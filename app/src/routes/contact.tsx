import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";

import { Nav } from "@/components/site/Nav";
import { Footer } from "@/components/site/Footer";
import { submitContactMessage, CONTACT_TOPICS } from "@/lib/api/contact.functions";
import { useT } from "@/lib/i18n-strings";

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
  const t = useT();

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setStatus("submitting");
    setError(null);
    try {
      await submitContactMessage({ data: { name, email, topic, message } });
      setStatus("sent");
    } catch (err) {
      setStatus("error");
      setError(err instanceof Error ? err.message : t("contact.error"));
    }
  }

  return (
    <>
      <Nav />
      <main>
        <section className="site-section">
          <div className="site-container">
            <p className="site-eyebrow mb-3">{t("nav.contact")}</p>
            <h1 className="site-h2 max-w-2xl text-4xl md:text-6xl">{t("contact.heading")}</h1>
            <p className="site-ink-muted mt-5 max-w-xl text-base leading-relaxed">
              {t("contact.intro")}
            </p>
          </div>
        </section>

        <section className="site-section pt-0">
          <div className="site-container contact-grid">
            <div>
              {status === "sent" ? (
                <div className="site-panel p-8">
                  <p className="site-eyebrow mb-3">{t("contact.received")}</p>
                  <p className="text-base leading-relaxed">
                    {name.split(" ")[0]
                      ? t("contact.thanksNamed", { name: name.split(" ")[0] })
                      : t("contact.thanksAnon")}
                    <strong>{email}</strong>.
                  </p>
                  <p className="site-ink-muted mt-3 text-sm leading-relaxed">
                    {t("contact.nothingElse")}
                  </p>
                </div>
              ) : (
                <form className="site-panel flex flex-col gap-5 p-8" onSubmit={handleSubmit}>
                  <label className="auth-modal-field">
                    <span>{t("contact.yourName")}</span>
                    <input
                      type="text"
                      required
                      maxLength={120}
                      autoComplete="name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder={t("contact.namePlaceholder")}
                    />
                  </label>

                  <label className="auth-modal-field">
                    <span>{t("auth.email")}</span>
                    <input
                      type="email"
                      required
                      autoComplete="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder={t("contact.emailPlaceholder")}
                    />
                  </label>

                  <label className="auth-modal-field">
                    <span>{t("contact.about")}</span>
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
                    <span>{t("contact.message")}</span>
                    <textarea
                      required
                      minLength={10}
                      maxLength={2000}
                      rows={6}
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder={t("contact.messagePlaceholder")}
                    />
                  </label>

                  {error ? <p className="contact-error">{error}</p> : null}

                  <button type="submit" className="btn-hero-pill self-start" disabled={status === "submitting"}>
                    <span className="spark" />
                    <span>{status === "submitting" ? t("contact.sending") : t("contact.send")}</span>
                  </button>
                </form>
              )}
            </div>

            <aside className="contact-aside">
              <div className="site-panel p-7">
                <p className="site-eyebrow mb-3">{t("contact.alreadyBooked")}</p>
                <p className="site-ink-muted text-sm leading-relaxed">
                  {t("contact.alreadyBookedCopy")}
                </p>
              </div>
              <div className="site-panel p-7">
                <p className="site-eyebrow mb-3">{t("contact.commonQuestions")}</p>
                <p className="site-ink-muted text-sm leading-relaxed">
                  {t("contact.commonCopy")}
                </p>
                <Link to="/faq" className="btn-underline mt-4">
                  {t("contact.readFaq")} <span className="arrow">&rarr;</span>
                </Link>
              </div>
              <div className="site-panel p-7">
                <p className="site-eyebrow mb-3">{t("contact.partnerships")}</p>
                <p className="site-ink-muted text-sm leading-relaxed">
                  {t("contact.partnershipsCopy")}
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
