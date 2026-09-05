import { useState, type FormEvent } from "react";

import { subscribeToNewsletter } from "@/lib/api/newsletter.functions";

// This form used to store nothing at all: submitting flipped a local flag and
// showed "You're on the list", so every address typed into it was discarded.
// It now persists to D1 and syncs to systeme.io, and -- the part that matters
// -- the confirmation only appears once the server has actually accepted the
// address. A success message shown before the request resolves is the same
// lie the old version told, just faster.
export function Newsletter() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "done" | "error">("idle");

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (status === "sending") return;
    setStatus("sending");
    try {
      await subscribeToNewsletter({ data: { email } });
      setStatus("done");
    } catch {
      setStatus("error");
    }
  }

  return (
    <section className="newsletter-section">
      <div className="site-container newsletter-inner">
        <p className="newsletter-eyebrow">Skynova Travel Club</p>
        <h2 className="newsletter-heading">Join the Skynova Travel Club</h2>
        <p className="newsletter-copy">
          Destination inspiration, hotel deals, travel guides, flight offers and curated experiences --
          straight to your inbox.
        </p>
        {status === "done" ? (
          <p className="newsletter-thanks">You're on the list -- look out for our next dispatch.</p>
        ) : (
          <form className="newsletter-form" onSubmit={handleSubmit}>
            <input
              type="email"
              required
              placeholder="Your email address"
              aria-label="Email address"
              className="newsletter-input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={status === "sending"}
            />
            <button type="submit" className="newsletter-submit" disabled={status === "sending"}>
              {status === "sending" ? "Joining..." : "Subscribe"}
            </button>
          </form>
        )}
        {status === "error" ? (
          // Says what to do next rather than apologising -- and never claims
          // the address was saved, because it was not.
          <p className="newsletter-error" role="alert">
            That didn&rsquo;t go through. Check the address and try again.
          </p>
        ) : null}
        <p className="newsletter-privacy">No spam. Unsubscribe anytime.</p>
      </div>
    </section>
  );
}
