/**
 * DEV ONLY. Stands in for the `cloudflare:workers` runtime built-in, which
 * only exists inside workerd.
 *
 * `vite dev` runs SSR in Node, so the import in lib/bindings.server.ts had
 * nothing to resolve and every page rendered as the Vite error overlay
 * instead of the site -- `bun run dev` could not serve the homepage at all.
 * vite.config.ts aliases the module here when `command === "serve"`; the
 * build and the deployed Worker never see this file and still get the real
 * runtime module.
 *
 * An empty env is the honest answer rather than a convenience: bindings()
 * already documents every binding as optional and every caller guards before
 * use, so local dev exercises exactly the "binding absent" path the
 * production code is written to survive. Anything that genuinely needs D1 or
 * R2 wants `wrangler dev`, not this.
 */
export const env: Record<string, unknown> = {};
