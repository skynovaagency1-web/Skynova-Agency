// Server-only access to this app's Cloudflare bindings. Each is present ONLY if
// opted into via app.manifest.json (D1 `DB`, R2 `STORAGE`, KV `KV`, and the
// container `CONTAINER`) — so the accessors are optional; guard before use.
// `cloudflare:workers` is the Workers-runtime module that exposes the Worker
// env (bindings) — usable inside any server-side code (server functions,
// server routes). It is NOT bundled; the runtime provides it.
import { env } from "cloudflare:workers";
// Import the binding types directly — NOT via the global tsconfig `types` list,
// which would clobber the DOM globals the client/SSR React code relies on.
import type {
  D1Database,
  DurableObjectNamespace,
  KVNamespace,
  R2Bucket,
} from "@cloudflare/workers-types";

type AppEnv = {
  DB?: D1Database;
  STORAGE?: R2Bucket;
  KV?: KVNamespace;
  // The container's Durable Object — present only when "container" is set in
  // the manifest. Reach an instance with env.CONTAINER.getByName(id), then
  // .fetch(). See skills/containers.md.
  CONTAINER?: DurableObjectNamespace;
  HF_ENV?: string;
  APP_SLUG?: string;
  /** systeme.io API key for newsletter sync. Set with:
   *    wrangler secret put SYSTEME_API_KEY --config wrangler.production.jsonc
   *  Absent is a supported state -- signups still persist to D1, they just
   *  are not pushed to the provider until a key exists. */
  SYSTEME_API_KEY?: string;
  /** Resend API key for transactional mail (password resets, and the contact
   *  and gift follow-ups that were previously promised but never sent). Set:
   *    wrangler secret put RESEND_API_KEY --config wrangler.production.jsonc
   *  Absent is a supported state -- a reset token is still issued and stored,
   *  only the delivery is skipped, and sendEmail() reports why. */
  RESEND_API_KEY?: string;
  /** Travelpayouts Data API token, for real prices on our own pages -- lowest
   *  fare per route, price calendars, popular routes from a city. Set with:
   *    wrangler secret put TRAVELPAYOUTS_TOKEN --config wrangler.production.jsonc
   *
   *  NOTHING READS THIS YET. It is declared so the secret is reachable from
   *  code the moment something wants it, rather than the binding being the
   *  thing that blocks the first attempt. It is NOT the marker (720297) or the
   *  traffic source (519959) in lib/affiliate.ts -- those identify the account
   *  in outbound links, are visible in every one of them, and are not secret.
   *  This one is, and must stay out of the repo.
   *
   *  Absent is a supported state, and must remain one: whatever uses this has
   *  to fall back to the affiliate links the site already has rather than
   *  render an empty price. */
  TRAVELPAYOUTS_TOKEN?: string;
};

export function bindings(): AppEnv {
  return env as unknown as AppEnv;
}
