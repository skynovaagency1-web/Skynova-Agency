/**
 * Print what the site's own counters know.
 *
 *   bun scripts/traffic.mjs            last 30 days
 *   bun scripts/traffic.mjs 7          last 7 days
 *
 * WHY THIS EXISTS. The site has counted pageviews, referrers and outbound
 * affiliate clicks into D1 since 7 Sep 2026, and nothing has ever read any of
 * it. Three tables filling up with the only first-party answer to "is anyone
 * coming, and do they click through" and no way to look. Cloudflare Web
 * Analytics covers some of the same ground, but it cannot see outbound clicks
 * per partner, which is the number that decides whether the affiliate links
 * are worth keeping.
 *
 * Read-only by construction: every statement here is a SELECT, and the script
 * takes no arguments that reach SQL. The day count is parsed as an integer and
 * clamped before it is interpolated.
 */

import { execFile } from "node:child_process";
import { promisify } from "node:util";

const run = promisify(execFile);

const DB = "skynova-agency-db";
const CONFIG = "wrangler.production.jsonc";

/** Days of history. Integer, clamped -- it is the only value reaching SQL. */
const days = Math.min(365, Math.max(1, Number.parseInt(process.argv[2] ?? "30", 10) || 30));

/**
 * One query against production D1.
 *
 * wrangler prints a platform warning before its JSON on unsupported macOS, so
 * the payload is found by its first bracket rather than by parsing the whole
 * of stdout.
 */
async function query(sql) {
  const { stdout } = await run(
    "bunx",
    ["wrangler", "d1", "execute", DB, "--remote", "--config", CONFIG, "--json", "--command", sql],
    { maxBuffer: 8 * 1024 * 1024 },
  );
  const start = stdout.indexOf("[");
  if (start === -1) throw new Error(`no JSON in wrangler output:\n${stdout}`);
  return JSON.parse(stdout.slice(start))[0].results;
}

const since = new Date(Date.now() - days * 86_400_000).toISOString().slice(0, 10);

function table(rows, [labelKey, valueKey], { width = 34 } = {}) {
  if (rows.length === 0) return "  (nothing yet)";
  const total = rows.reduce((sum, r) => sum + Number(r[valueKey]), 0) || 1;
  return rows
    .map((r) => {
      const label = String(r[labelKey] ?? "(direct)").slice(0, width).padEnd(width);
      const value = String(r[valueKey]).padStart(6);
      // Share of the listed rows, not of everything -- the lists are capped.
      const bar = "█".repeat(Math.max(1, Math.round((Number(r[valueKey]) / total) * 24)));
      return `  ${label} ${value}  ${bar}`;
    })
    .join("\n");
}

const [totals, pages, referrers, partners, daily] = await Promise.all([
  query(
    `SELECT (SELECT IFNULL(SUM(views),0) FROM page_views_daily WHERE day >= '${since}') AS views,
            (SELECT COUNT(*) FROM outbound_clicks WHERE occurred_at >= '${since}') AS clicks,
            (SELECT COUNT(*) FROM contact_messages WHERE created_at >= '${since}') AS messages,
            (SELECT COUNT(*) FROM newsletter_subscribers) AS subscribers`,
  ),
  query(
    `SELECT path, SUM(views) AS views FROM page_views_daily WHERE day >= '${since}'
     GROUP BY path ORDER BY views DESC LIMIT 15`,
  ),
  query(
    `SELECT host, SUM(hits) AS hits FROM referrers_daily WHERE day >= '${since}'
     GROUP BY host ORDER BY hits DESC LIMIT 10`,
  ),
  query(
    `SELECT partner, COUNT(*) AS clicks FROM outbound_clicks WHERE occurred_at >= '${since}'
     GROUP BY partner ORDER BY clicks DESC`,
  ),
  query(
    `SELECT day, SUM(views) AS views FROM page_views_daily WHERE day >= '${since}'
     GROUP BY day ORDER BY day DESC LIMIT 14`,
  ),
]);

const { views, clicks, messages, subscribers } = totals[0];
// The rate worth watching: a visit that never reaches a partner earns nothing,
// however good the page was.
const rate = views > 0 ? ((clicks / views) * 100).toFixed(1) : "0.0";

console.log(`\nskynovaagency.com -- last ${days} days (since ${since})\n`);
console.log(`  pageviews          ${views}`);
console.log(`  outbound clicks    ${clicks}   (${rate}% of views)`);
console.log(`  contact messages   ${messages}`);
console.log(`  subscribers        ${subscribers}   (all time)`);

console.log("\nTop pages");
console.log(table(pages, ["path", "views"]));

console.log("\nWhere they came from");
console.log(table(referrers, ["host", "hits"]));

console.log("\nPartner click-throughs");
console.log(table(partners, ["partner", "clicks"]));

console.log("\nBy day");
console.log(table(daily, ["day", "views"], { width: 12 }));
console.log();
