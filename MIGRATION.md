# Taking Skynova Agency live on skynovaagency.com

> ## ✅ COMPLETED — 4 September 2026
>
> The site is live at **https://skynovaagency.com**.
>
> | | |
> |---|---|
> | Worker | `skynova-agency` |
> | Fallback URL | https://skynova-agency.skynovaagency.workers.dev |
> | D1 database id | `f6a64a00-2de9-4c88-a7ed-ee9239f3c829` |
> | Nameservers | `felipe.ns.cloudflare.com`, `rachel.ns.cloudflare.com` |
> | TLS | Google Trust Services, expires 2 Dec 2026, auto-renews |
>
> Verified end to end: all routes return 200, sign-up writes to D1,
> `sitemap.xml` emits the real domain, certificate valid.
>
> **Registration stays at Hostinger** — only DNS moved. The unused Hostinger
> WordPress site (`skynovaagency-com-274165.hostingersite.com`) is untouched on
> its temporary address; do not click "Connect domain" on it, as that would
> point the domain away from the Worker.
>
> The only record carried over from the old DNS is the
> `google-site-verification` TXT (Google Search Console). The old A record
> (`2.57.91.91`, Hostinger parking) and the `www` CNAME were deleted.
>
> **To redeploy, skip to [Redeploying later](#redeploying-later).** Steps 1–8
> below are history, kept because they document why each choice was made.

Runbook for moving the site from Higgsfield's Cloudflare account into **your own**,
and attaching your domain.

**Nothing is being rewritten.** The app is already a Cloudflare Worker. This only
supplies the values Higgsfield's pipeline used to inject, then points your domain
at it.

Leave the Higgsfield site running throughout. Nothing here touches it, so you can
stop at any point and you still have a working site.

---

## Before you start

- A Cloudflare account (the free plan covers this).
- **Bun** (`curl -fsSL https://bun.sh/install | bash`). This is not optional:
  four dependencies use the `workspace:*` protocol, which **npm cannot parse** —
  `npm install` fails outright on this project.
- `skynovaagency.com` registered at Hostinger (you already have this).
- A terminal open in the `app/` folder of this project.

Two notes on what this replaces:

- **Do not use Hostinger's "deploy from GitHub"** flow (the Nitro preset screen).
  Hostinger runs Node; this app needs Cloudflare's runtime and Cloudflare's D1
  database. That path requires a substantial rewrite. This one requires none.
- The existing `app/wrangler.jsonc` is a **build-only placeholder** for
  Higgsfield's CI. Your deploys use `app/wrangler.production.jsonc` instead, via
  the `--config` flag in every command below.

---

## 1. Install dependencies

```bash
bun install
```

(Verified: this installs 790 packages and the project builds clean from a fresh
copy of this folder.)

## 2. Log in to Cloudflare

```bash
bunx wrangler login
```

Opens a browser; click **Allow**. Must be run in your own terminal — an
automated shell can't complete the browser step.

> **Why `bunx` and not `npx`?** `npx` reads this project's package.json and
> fails with `EOVERRIDE` on the `@types/react` override before wrangler even
> starts. `bunx` skips npm entirely. Verified: `npx` fails here, `bunx` works.

> **macOS note:** you're on 12.7.6, and Wrangler warns that the local Workers
> runtime wants 13.5.0+. Deploys and D1 commands are API calls and should be
> unaffected; `wrangler dev` (local preview) is the part likely to misbehave.
> If a command fails citing the runtime, tell me and we'll work around it.

## 3. Create your database

```bash
bunx wrangler d1 create skynova-agency-db
```

This prints a `database_id`. **Open `app/wrangler.production.jsonc` and paste it
over `PASTE_YOUR_DATABASE_ID_HERE`.**

If you skip this, the site deploys and the pages load, but every account feature
fails — sign-in, sessions, password reset, wishlist, gift requests, referrals.

## 4. Create the schema

Both migrations, in order. `--remote` targets the real database rather than a
local copy:

```bash
bunx wrangler d1 execute skynova-agency-db --remote --file=./migrations/0001_init.sql
bunx wrangler d1 execute skynova-agency-db --remote --file=./migrations/0002_password_reset.sql
```

Verify the five tables exist:

```bash
bunx wrangler d1 execute skynova-agency-db --remote \
  --command "SELECT name FROM sqlite_master WHERE type='table' ORDER BY name"
```

Expect: `gift_requests`, `password_reset_requests`, `sessions`, `users`,
`wishlist_items`.

## 5. Build

```bash
bun run build
```

This runs the full check chain — lint, route generation, TypeScript, then the
Vite build. It emits `dist/client` (static assets) and `dist/server/server.js`
(the SSR Worker).

## 6. Deploy

```bash
bunx wrangler deploy --config wrangler.production.jsonc
```

First run opens a browser to authorise Wrangler against your Cloudflare account.

It finishes with a `*.workers.dev` URL. **Open it and confirm the site works,
including signing up for an account**, before touching DNS. If accounts fail
here, step 3 or 4 didn't take.

---

## 7. Move the domain's DNS to Cloudflare

Workers custom domains require the domain to be on Cloudflare's nameservers.
The registration stays at Hostinger — only DNS moves.

1. Cloudflare dashboard → **Add a site** → `skynovaagency.com` → Free plan.
2. Cloudflare scans existing records and shows you **two nameservers**.
3. Hostinger → your domain → **DNS / Nameservers** → change to Cloudflare's two.
4. Wait for Cloudflare to mark the domain **Active**. Usually well under an hour,
   but it can take up to 24.

If the domain currently serves anything else (email especially), check that
Cloudflare's scan carried those records across before switching. **MX records for
email are the common thing to lose here** — losing them stops mail delivery.

## 8. Attach the domain to the Worker

Cloudflare dashboard → **Workers & Pages** → `skynova-agency` → **Settings** →
**Domains & Routes** → **Add** → **Custom domain** → `skynovaagency.com`.

Repeat for `www.skynovaagency.com` if you want that to work too.

Cloudflare issues the TLS certificate automatically; HTTPS may take a few minutes
to go green.

## 9. Afterwards

**Completed 4 Sep 2026:**

- **Always Use HTTPS** is on (Cloudflare -> SSL/TLS -> Edge Certificates).
  Verified end to end: `http://www.skynovaagency.com` -> 301 ->
  `https://www.skynovaagency.com` -> 301 -> `https://skynovaagency.com`, two
  hops, valid TLS.
- **Cloudflare Web Analytics** is live. The beacon token lives in
  `app/src/lib/analytics.tsx`; the beacon host is allow-listed in
  `app/src/lib/security-headers.server.ts` -- remove it there and traffic
  silently stops being recorded.
- **Google Search Console**: Domain property `sc-domain:skynovaagency.com`,
  verified by the `google-site-verification` TXT that was carried across in
  the DNS move. Sitemap `https://skynovaagency.com/sitemap.xml` submitted,
  Status Success, 53 pages. NOTE: a Domain property needs the FULL sitemap
  URL, not the bare `sitemap.xml` a URL-prefix property takes.



- Re-test sign-up, sign-in and the affiliate links on the real domain.
- Your Travelpayouts marker (`720297`) is in the code and moves with it —
  commission tracking is unaffected by the change of host.
- Keep the Higgsfield deployment up for a few days as a fallback.

---

## Redeploying later

```bash
bun run build
bunx wrangler deploy --config wrangler.production.jsonc
```

That's the whole loop — no CI, no Higgsfield step.

---

## About the existing data

I checked the live database: **2 users, 1 wishlist item, 1 gift request, 0
sessions.** That's test data, so the runbook above starts clean and you re-register.

I deliberately did **not** export it. Doing so means moving password hashes
around in plain files, which isn't worth it for two test accounts.

If you do want it moved, say so and I'll produce an import script — but it's
worth doing this migration *now*, while the cost of not migrating data is zero.
Once real customers have accounts, this gets meaningfully harder.

---

## If you'd rather not move at all

Ask Higgsfield whether they support attaching a custom domain. If they do, it's
just DNS records at Hostinger and none of the above is needed. I checked their
tooling from my side — there's no custom-domain function exposed, only one that
renames the subdomain, so this is a question for their dashboard or support.
