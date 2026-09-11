import { expect, test } from "bun:test";
import { applySecurityHeaders } from "../src/lib/security-headers.server";

// Rewritten 11 Sep 2026. The original pinned frame-src to one exact string
// from the Higgsfield days -- their auth hosts plus localrent -- so it failed
// the first time CI ever reached it (it never had: installs had been failing
// first). The policy had changed on purpose: the site left Higgsfield hosting
// on 4 Sep, and the booking widgets gained Tiqets, Klook and Travelpayouts.
// These check what that directive is actually for instead of its spelling.
test("keeps partner booking widgets framable and preserves the response", async () => {
  const response = applySecurityHeaders(new Response("ok", { status: 201 }));
  expect(response.status).toBe(201);
  expect(await response.text()).toBe("ok");

  const csp = response.headers.get("content-security-policy") ?? "";
  const frameSrc =
    csp
      .split(";")
      .map((d) => d.trim())
      .find((d) => d.startsWith("frame-src")) ?? "";

  // Booking widgets render in iframes. Dropping one of these hosts blanks
  // that widget silently -- no error anyone would notice.
  for (const host of [
    "'self'",
    "https://localrent.com",
    "https://*.localrent.com",
    "https://www.tiqets.com",
    "https://*.klook.com",
    "https://*.travelpayouts.com",
  ]) {
    expect(frameSrc).toContain(host);
  }

  // Retired with the Higgsfield hosting: nothing here embeds their auth pages.
  expect(frameSrc).not.toContain("higgsfield");

  // Clickjacking: only this site may frame itself (added 11 Sep 2026, after
  // the move off Higgsfield left nothing setting it).
  expect(csp).toContain("frame-ancestors 'self'");
  expect(response.headers.get("x-frame-options")).toBe("SAMEORIGIN");
});
