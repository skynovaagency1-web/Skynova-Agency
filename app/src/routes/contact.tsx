import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";

import { Nav } from "@/components/site/Nav";
import { Footer } from "@/components/site/Footer";
import { submitContactMessage, CONTACT_TOPICS } from "@/lib/api/contact.functions";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact | Skynova Agency" },
      {
        name: "description",
        content:
          "Questions about a booking, a partnership enquiry, or feedback on the site -- send it here and we'll reply by email.",
      },
    ],
  }),
  component: ContactPage,
});

/**
 * This page used to advertise hello@ and partners@ mailto: links. The domain
 * has no MX records, so every message sent to either address bounced -- a
 * visitor trying to reach us concluded the business was not real.
 *
 * A form writing to D1 works regardless of mail configuration, so nothing a
 * visitor sends is lost. The addresses go back on this page once Cloudflare
 * Email Routing is configured and mail actually lands somewhere.
 */
function ContactPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [topic, setTopic] = useState<(typeof CONTACT_TOPICS)[number]>("Booking help");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<"idle" | "submitting" | "sent" | "error">("idle");
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setStatus("submitting");
    setError(null);
    try {
      await submitContactMessage({ data: { name, email, topic, message } });
      setStatus("sent");
    } catch (err) {
      setStatus("error");
      setError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
    }
  }

  return (
    <>
      <Nav />
      <main>
        <section className="site-section">
          <div className="site-container">
            <p className="site-eyebrow mb-3">Contact</p>
            <h1 className="site-h2 max-w-2xl text-4xl md:text-6xl">Talk to Skynova Agency.</h1>
            <p className="site-ink-muted mt-5 max-w-xl text-base leading-relaxed">
              We usually reply within one working day. If your question is about a booking you have
              already made, the partner who took the payment can help fastest -- your confirmation
              email came from them.
            </p>
          </div>
        </section>

        <section className="site-section pt-0">
          <div className="site-container contact-grid">
            <div>
              {status === "sent" ? (
                <div className="site-panel p-8">
                  <p className="site-eyebrow mb-3">Message received</p>
                  <p className="text-base leading-relaxed">
                    Thanks {name.split(" ")[0] || "for getting in touch"} -- we have your message and
                    will reply to <strong>{email}</strong>.
                  </p>
                  <p className="site-ink-muted mt-3 text-sm leading-relaxed">
                    Nothing else is needed from you. If it is urgent and about an existing booking,
                    contact the partner directly in the meantime.
                  </p>
                </div>
              ) : (
                <form className="site-panel flex flex-col gap-5 p-8" onSubmit={handleSubmit}>
                  <label className="auth-modal-field">
                    <span>Your name</span>
                    <input
                      type="text"
                      required
                      maxLength={120}
                      autoComplete="name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Jamie Rivera"
                    />
                  </label>

                  <label className="auth-modal-field">
                    <span>Email</span>
                    <input
                      type="email"
                      required
                      autoComplete="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@example.com"
                    />
                  </label>

                  <label className="auth-modal-field">
                    <span>What is it about?</span>
                    <select
                      value={topic}
                      onChange={(e) => setTopic(e.target.value as (typeof CONTACT_TOPICS)[number])}
                    >
                      {CONTACT_TOPICS.map((t) => (
                        <option key={t} value={t}>
                          {t}
                        </option>
                      ))}
                    </select>
                  </label>

                  <label className="auth-modal-field">
                    <span>Message</span>
                    <textarea
                      required
                      minLength={10}
                      maxLength={2000}
                      rows={6}
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="Tell us what you need."
                    />
                  </label>

                  {error ? <p className="contact-error">{error}</p> : null}

                  <button type="submit" className="btn-hero-pill self-start" disabled={status === "submitting"}>
                    <span className="spark" />
                    <span>{status === "submitting" ? "Sending…" : "Send message"}</span>
                  </button>
                </form>
              )}
            </div>

            <aside className="contact-aside">
              <div className="site-panel p-7">
                <p className="site-eyebrow mb-3">Already booked?</p>
                <p className="site-ink-muted text-sm leading-relaxed">
                  Skynova does not hold your booking -- the partner does, and they took the payment.
                  For changes, cancellations or refunds, contact them directly. Their details are on
                  your confirmation email.
                </p>
              </div>
              <div className="site-panel p-7">
                <p className="site-eyebrow mb-3">Common questions</p>
                <p className="site-ink-muted text-sm leading-relaxed">
                  Most questions about how booking works, pricing and cancellations are answered
                  already.
                </p>
                <Link to="/faq" className="btn-underline mt-4">
                  Read the FAQ <span className="arrow">&rarr;</span>
                </Link>
              </div>
              <div className="site-panel p-7">
                <p className="site-eyebrow mb-3">Partnerships</p>
                <p className="site-ink-muted text-sm leading-relaxed">
                  Travel brands and affiliate networks -- choose “Partnership” above and we will
                  route it to the right place.
                </p>
              </div>
            </aside>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
