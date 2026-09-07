import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { z } from "zod";

import { Nav } from "@/components/site/Nav";
import { Footer } from "@/components/site/Footer";
import { performPasswordReset } from "@/lib/api/auth.functions";

const SearchSchema = z.object({
  token: z.string().trim().catch(""),
});

export const Route = createFileRoute("/reset-password")({
  validateSearch: SearchSchema,
  head: () => ({
    meta: [
      { title: "Choose a new password | Skynova Agency" },
      { name: "description", content: "Set a new password for your Skynova Agency account." },
      // A reset URL carries a live credential in the query string. It must
      // never be indexed, and it must not leak to any third party through a
      // referrer header when the page links out.
      { name: "robots", content: "noindex, nofollow" },
      { name: "referrer", content: "no-referrer" },
    ],
  }),
  component: ResetPasswordPage,
});

function ResetPasswordPage() {
  const { token } = Route.useSearch();
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [status, setStatus] = useState<"idle" | "submitting" | "done">("idle");
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    if (password !== confirm) {
      setError("Those two passwords don't match.");
      return;
    }
    if (password.length < 8) {
      setError("Use at least 8 characters.");
      return;
    }
    setStatus("submitting");
    try {
      await performPasswordReset({ data: { token, password } });
      setStatus("done");
    } catch (err) {
      setStatus("idle");
      setError(err instanceof Error ? err.message : "Something went wrong. Try again.");
    }
  }

  return (
    <>
      <Nav />
      <main className="site-section">
        <div className="site-container reset-page">
          <p className="site-eyebrow mb-3">Account</p>
          <h1 className="site-h2 text-3xl md:text-4xl">Choose a new password.</h1>

          {!token ? (
            <p className="reset-page-body">
              This link is missing its token, so there&rsquo;s nothing to reset. Reset links are single-use and
              expire after an hour &mdash; request a fresh one from the sign-in screen.
            </p>
          ) : status === "done" ? (
            <>
              <p className="reset-page-body">
                Done &mdash; your password has been changed and every existing session was signed out. You can
                sign in with the new one now.
              </p>
              <Link to="/" className="btn-hero-pill reset-page-cta">
                <span className="spark" />
                <span>Back to Skynova</span>
              </Link>
            </>
          ) : (
            <form className="site-panel reset-page-form" onSubmit={handleSubmit}>
              <label className="auth-modal-field">
                <span className="trip-search-label">New password</span>
                <input
                  type="password"
                  className="trip-search-input"
                  autoComplete="new-password"
                  minLength={8}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </label>
              <label className="auth-modal-field">
                <span className="trip-search-label">Confirm new password</span>
                <input
                  type="password"
                  className="trip-search-input"
                  autoComplete="new-password"
                  minLength={8}
                  required
                  value={confirm}
                  onChange={(e) => setConfirm(e.target.value)}
                />
              </label>
              {error ? <p className="reset-page-error">{error}</p> : null}
              <button type="submit" className="btn-hero-pill reset-page-cta" disabled={status === "submitting"}>
                <span className="spark" />
                <span>{status === "submitting" ? "Saving…" : "Save new password"}</span>
              </button>
              <p className="reset-page-note">
                At least 8 characters. Saving signs out every other device.
              </p>
            </form>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
