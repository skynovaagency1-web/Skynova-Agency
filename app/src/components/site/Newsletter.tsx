import { useState, type FormEvent } from "react";

// No email backend exists yet, so this deliberately doesn't claim to send
// or store anything -- submitting just swaps in an honest local
// acknowledgment instead of a fake "subscribed!" state.
export function Newsletter() {
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setSubmitted(true);
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
        {submitted ? (
          <p className="newsletter-thanks">You're on the list -- look out for our next dispatch.</p>
        ) : (
          <form className="newsletter-form" onSubmit={handleSubmit}>
            <input type="email" required placeholder="Your email address" aria-label="Email address" className="newsletter-input" />
            <button type="submit" className="newsletter-submit">
              Subscribe
            </button>
          </form>
        )}
        <p className="newsletter-privacy">No spam. Unsubscribe anytime.</p>
      </div>
    </section>
  );
}
