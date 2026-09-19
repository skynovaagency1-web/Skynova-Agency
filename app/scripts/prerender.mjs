/**
 * Render every indexable URL to static HTML at build time.
 *
 *   bun run build && bun scripts/prerender.mjs
 *
 * WHY. The Workers Free plan gives a request about 10ms of CPU. React SSR of
 * this site's larger pages costs 60-100ms, so on 19 Sep 2026 production was
 * answering 503 (Cloudflare 1102, exceededCpu) on the homepage 8 times out of
 * 8. Nothing here is per-request -- it is a marketing site whose content
 * changes when the repo changes -- so the render belongs at build time, where
 * there is no limit, rather than in front of every visitor. See
 * src/lib/prerendered.server.ts for the runtime half.
 *
 * HOW IT RENDERS. It runs the REAL production bundle, dist/server/server.js,
 * the same file wrangler deploys. Not a second Node-targeted build, and not
 * `vite dev`: dev HTML references /@vite/client and unhashed source modules,
 * so it would ship a document pointing at files that do not exist. The only
 * thing standing between that bundle and running here is its one import of
 * `cloudflare:workers`, a workerd built-in. That specifier is rewritten to a
 * local shim exporting an empty env, which is the same stand-in `vite dev`
 * already uses (src/lib/cloudflare-workers.dev.ts) and a state every binding
 * caller is written to survive.
 *
 * WHICH URLS. Whatever /sitemap.xml lists, fetched from the bundle itself.
 * That file is already the site's own statement of what is indexable, it is
 * already locale-aware, and it already excludes /account, /wishlist and
 * /reset-password -- the pages that must keep rendering per request. Deriving
 * the list from it means there is no second list to fall out of date.
 *
 * Passing no bindings is also what keeps this from feeding on its own output:
 * servePrerendered() returns null without an ASSETS binding, so every request
 * here is a real render even when dist/client/__prerender is already full.
 */
import { mkdir, readFile, rm, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const APP_DIR = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const SERVER_BUNDLE = resolve(APP_DIR, "dist/server/server.js");
const OUT_DIR = resolve(APP_DIR, "dist/client/__prerender");
const ORIGIN = "https://skynovaagency.com";

/**
 * URLs that must keep rendering per request, even though the sitemap lists
 * them because they are genuinely indexable.
 *
 * /destinations renders live airfares. routes/destinations/index.tsx loads
 * them in its loader (getVisitorFares), backed by a table that refetches
 * anything older than twelve hours -- so prerendering would freeze a price,
 * and a frozen price on a travel site is not a stale heading, it is a wrong
 * number. Worse in practice: this script runs with no bindings, so there is no
 * D1 table and no TRAVELPAYOUTS_TOKEN, getVisitorFares returns null, and the
 * document would ship with no prices at all -- permanently, and silently.
 *
 * The honest consequence is that this page stays on the CPU limit and keeps
 * failing. Fixing it means moving the fares to a client fetch so the document
 * itself is static; that is a change to the route, not to this list.
 */
const ALWAYS_SSR = new Set(["/destinations", "/fr/destinations"]);

/** Mirrors prerenderKey() in src/lib/prerendered.server.ts. */
function prerenderKey(pathname) {
  const trimmed = pathname.replace(/\/+$/, "");
  if (trimmed === "") return "__root";
  if (!/^(\/[A-Za-z0-9._-]+)+$/.test(trimmed)) return null;
  return trimmed.slice(1).replace(/\//g, "__");
}

/**
 * Import the production bundle with `cloudflare:workers` pointed at a shim.
 *
 * Written beside the original so its own relative imports and any asset paths
 * baked into it still resolve; removed again at the end so a later
 * `wrangler deploy` uploads only what the build produced.
 */
async function loadWorker() {
  const source = await readFile(SERVER_BUNDLE, "utf8");
  if (!source.includes("cloudflare:workers")) {
    // Not fatal on its own -- but it means the assumption this script is built
    // on no longer holds, and silently rendering anyway would hide that.
    console.warn("  note: no cloudflare:workers import found in the bundle");
  }

  const shimPath = resolve(dirname(SERVER_BUNDLE), "__prerender-cf-shim.mjs");
  const patchedPath = resolve(dirname(SERVER_BUNDLE), "__prerender-server.mjs");

  await writeFile(shimPath, "export const env = {};\nexport default { env };\n");
  await writeFile(
    patchedPath,
    source.replace(/(["'])cloudflare:workers\1/g, JSON.stringify("./__prerender-cf-shim.mjs")),
  );

  const mod = await import(patchedPath);
  const entry = mod.default ?? mod;
  if (typeof entry.fetch !== "function") {
    throw new Error("dist/server/server.js does not export a default fetch handler");
  }

  return {
    entry,
    cleanup: () => Promise.all([rm(shimPath, { force: true }), rm(patchedPath, { force: true })]),
  };
}

/** No bindings, on purpose -- see the header. */
const ENV = {};
const CTX = { waitUntil() {}, passThroughOnException() {} };

async function render(entry, pathname) {
  const response = await entry.fetch(
    new Request(new URL(pathname, ORIGIN), {
      method: "GET",
      headers: { "user-agent": "skynova-prerender", "accept": "text/html" },
    }),
    ENV,
    CTX,
  );
  return response;
}

async function main() {
  const { entry, cleanup } = await loadWorker();

  try {
    const sitemapResponse = await render(entry, "/sitemap.xml");
    if (!sitemapResponse.ok) {
      throw new Error(`/sitemap.xml returned ${sitemapResponse.status}`);
    }
    const sitemap = await sitemapResponse.text();

    // Only <loc>, and only the entry URLs -- <xhtml:link href> alternates
    // repeat the same pages and would render each of them twice.
    const paths = [
      ...new Set(
        [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => new URL(m[1]).pathname),
      ),
    ].sort();

    if (paths.length === 0) throw new Error("sitemap listed no URLs");
    console.log(`  sitemap: ${paths.length} URLs`);

    // The sitemap is the list of INDEXABLE URLs, which is not the same as the
    // list of URLs that have to work. Only 21 of its 149 entries are French,
    // because lib/i18n.ts marks a French page noindex until its content is
    // actually translated -- but the language switcher still links to all of
    // them, and a visitor who lands on one gets a page, not a 404. Left to
    // SSR they would be 107 URLs still answering 503 for exactly the reason
    // everything else here is being prerendered. Noindex is a crawler
    // instruction, not permission to serve an error.
    const frenchVariants = paths
      .filter((p) => !p.startsWith("/fr"))
      .map((p) => (p === "/" ? "/fr" : `/fr${p}`));

    const byKey = new Map();
    for (const pathname of [...paths, ...frenchVariants]) {
      const key = prerenderKey(pathname);
      if (key && !byKey.has(key)) byKey.set(key, pathname);
    }
    const targets = [...byKey.values()].sort();
    console.log(`  targets:  ${targets.length} URLs (sitemap + untranslated French)`);

    await rm(OUT_DIR, { recursive: true, force: true });
    await mkdir(OUT_DIR, { recursive: true });

    let written = 0;
    const skipped = [];

    for (const pathname of targets) {
      if (ALWAYS_SSR.has(pathname.replace(/\/+$/, ""))) {
        skipped.push(`${pathname} (live fares -- must render per request)`);
        continue;
      }

      const key = prerenderKey(pathname);
      if (!key) {
        skipped.push(`${pathname} (unkeyable)`);
        continue;
      }

      let response;
      try {
        response = await render(entry, pathname);
      } catch (error) {
        skipped.push(`${pathname} (threw: ${error.message})`);
        continue;
      }

      const contentType = response.headers.get("content-type") ?? "";
      if (response.status !== 200 || !contentType.includes("text/html")) {
        skipped.push(`${pathname} (${response.status} ${contentType || "no content-type"})`);
        continue;
      }

      const html = await response.text();

      // A document that came back 200 but without a closing </html> is a
      // truncated stream, and shipping it would put a half-rendered page in
      // front of every visitor to that URL -- worse than the 503 this
      // replaces, because nothing would report it as an error.
      if (!html.includes("</html>")) {
        skipped.push(`${pathname} (truncated: ${html.length} bytes, no </html>)`);
        continue;
      }

      // The canonical tag is the check that caught this being wrong the first
      // time. These documents are what crawlers see FOREVER -- until the next
      // deploy, with nothing at runtime to notice a missing tag -- and the
      // first run of this script produced 254 pages with no canonical and no
      // hreflang on any of them, because __root.tsx rendered them in the body
      // and left React to hoist them into an already-flushed <head>. The
      // output looked perfect: every file full-size, every one ending in
      // </html>. Refusing to write a document without it is the only reason
      // that did not ship as a site-wide SEO regression dressed as a fix.
      if (!html.includes('rel="canonical"')) {
        skipped.push(`${pathname} (no canonical tag -- not shipping it)`);
        continue;
      }

      await writeFile(resolve(OUT_DIR, `${key}.html`), html);
      written += 1;
    }

    console.log(`  prerendered: ${written} / ${targets.length}`);
    if (skipped.length > 0) {
      console.log(`  left to SSR: ${skipped.length}`);
      for (const line of skipped) console.log(`    - ${line}`);
    }

    // The homepage is the page this exists for. If it is not here, the deploy
    // would go out still 503ing on `/` while every measurement said the fix
    // shipped -- so fail the build instead.
    if (written === 0 || !targets.some((p) => prerenderKey(p) === "__root")) {
      throw new Error("the homepage was not prerendered");
    }
  } finally {
    await cleanup();
  }
}

await main();
