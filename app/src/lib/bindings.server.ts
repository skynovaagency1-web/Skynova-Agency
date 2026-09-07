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
};

export function bindings(): AppEnv {
  return env as unknown as AppEnv;
}
