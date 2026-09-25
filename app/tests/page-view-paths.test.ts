import { describe, expect, test } from "bun:test";
import { readdirSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { COUNTED_EXACT_PATHS, UNCOUNTED_ROUTES } from "../src/lib/counted-paths";

/**
 * The pageview counter validates against a hand-written allowlist, and a
 * hand-written list drifts. This one did: /gear, /reviews,
 * /flight-compensation, /travel-insurance and /yacht-charter all shipped as
 * real pages whose visits were counted by the browser, posted to the
 * endpoint, rejected as "not a real path", and discarded. Nothing failed,
 * nothing logged, and the traffic simply did not exist as far as the numbers
 * were concerned -- /gear being the affiliate page, the one whose traffic was
 * most worth knowing.
 *
 * Adding the five was the small half of the fix. This is the other half: the
 * list is now checked against the filesystem, so the next page added without
 * a line in counted-paths.ts fails CI instead of quietly losing its traffic.
 */

const ROUTES_DIR = fileURLToPath(new URL("../src/routes", import.meta.url));

/** Paths a visitor can actually land on, derived from TanStack's file routing. */
function routePathsOnDisk(): string[] {
  const paths: string[] = [];

  for (const entry of readdirSync(ROUTES_DIR, { withFileTypes: true })) {
    if (entry.isDirectory()) {
      // A directory is a segment: blog/index.tsx -> /blog. Its $slug.tsx is a
      // parameterised child, validated separately in page-views.server.ts
      // against the real slug lists, so it is not an exact path.
      const children = readdirSync(`${ROUTES_DIR}/${entry.name}`);
      if (children.includes("index.tsx")) paths.push(`/${entry.name}`);
      continue;
    }

    const name = entry.name;
    // Only .tsx files are pages. llms[.]txt.ts, robots[.]txt.ts and
    // sitemap[.]xml.ts are .ts and serve plain text, not something a person
    // visits and a counter should count.
    if (!name.endsWith(".tsx")) continue;
    // The layout route, not a page.
    if (name.startsWith("__")) continue;
    // A parameterised route at the top level, if one ever appears.
    if (name.startsWith("$")) continue;

    const base = name.slice(0, -".tsx".length);
    paths.push(base === "index" ? "/" : `/${base}`);
  }

  return paths.sort();
}

describe("pageview path allowlist", () => {
  test("every route on disk is either counted or documented as uncounted", () => {
    const missing = routePathsOnDisk().filter(
      (path) => !COUNTED_EXACT_PATHS.has(path) && !(path in UNCOUNTED_ROUTES),
    );

    // The message carries the fix, because the person who trips this will be
    // adding a page and will not have read any of the above.
    expect(missing).toEqual([]);
  });

  test("nothing is counted that has no route behind it", () => {
    const onDisk = new Set(routePathsOnDisk());
    const orphaned = [...COUNTED_EXACT_PATHS].filter((path) => !onDisk.has(path)).sort();

    expect(orphaned).toEqual([]);
  });

  test("an uncounted route is a decision, not an omission", () => {
    // Every exclusion names a real route and carries a reason. A stale entry
    // here would quietly re-open the hole the other two tests close.
    const onDisk = new Set(routePathsOnDisk());
    for (const [path, reason] of Object.entries(UNCOUNTED_ROUTES)) {
      expect(onDisk.has(path)).toBe(true);
      expect(reason.length).toBeGreaterThan(10);
    }
  });
});
