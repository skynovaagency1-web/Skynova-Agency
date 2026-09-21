import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";

import { Nav } from "@/components/site/Nav";
import { Footer } from "@/components/site/Footer";
import { submitContactMessage, CONTACT_TOPICS } from "@/lib/api/contact.functions";
import { localeMeta, useT, type TKey } from "@/lib/i18n-strings";

export const Route = createFileRoute("/contact")({
  head: ({ match }) => ({
    meta: localeMeta(match.context.locale, "meta.contact.title", "meta.contact.description"),
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
/** Chip labels, so the topic a visitor picks reads in their language while the
 *  value stored stays the English enum the server validates against. */
const TOPIC_KEYS: Record<(typeof CONTACT_TOPICS)[number], TKey> = {
  "Booking help": "contact.topicBooking",
  Partnership: "contact.topicPartnership",
  Feedback: "contact.topicFeedback",
  "Something else": "contact.topicOther",
};

/** The partners a visitor could plausibly have booked with, as they are
 *  spelled on the partner's own confirmation email.
 *
 *  Written out rather than derived from PARTNER_VERTICALS in
 *  lib/outbound-clicks.server.ts, for two reasons: that module is server-only
 *  and importing it here would pull it into the client bundle, and it is
 *  keyed by hostname, so deriving names from it yields "Getrentacar",
 *  "Ektatraveling" and "Autoeurope" -- not what the confirmation says. */
const PARTNER_NAMES = [
  "Aviasales",
  "Hotellook",
  "Booking.com",
  "GetRentacar",
  "Auto Europe",
  "Discover Cars",
  "GetTransfer",
  "Welcome Pickups",
  "Tiqets",
  "Go City",
  "Airalo",
  "Saily",
  "BikesBooking",
  "Radical Storage",
  "Compensair",
  "AirHelp",
  "Ekta",
  "Searadar",
];

function ContactPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [topic, setTopic] = useState<(typeof CONTACT_TOPICS)[number]>("Booking help");
  const [message, setMessage] = useState("");
  const [reference, setReference] = useState("");
  const [partner, setPartner] = useState("");
  const [status, setStatus] = useState<"idle" | "submitting" | "sent" | "error">("idle");
  const [error, setError] = useState<string | null>(null);
  const t = useT();

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setStatus("submitting");
    setError(null);
    try {
      // Prepended rather than stored in their own columns. They are only ever
      // read by a human answering the message, and a migration to carry two
      // optional strings that always travel with the message is more moving
      // parts than the value justifies.
      const details = [
        partner ? `Partner: ${partner}` : "",
        reference.trim() ? `Reference: ${reference.trim()}` : "",
      ].filter(Boolean);
      const body = details.length ? `${details.join(" | ")}\n\n${message}` : message;
      await submitContactMessage({ data: { name, email, topic, message: body } });
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

                  <fieldset className="contact-topics">
                    <legend className="auth-modal-field-label">{t("contact.about")}</legend>
                    <div className="contact-topic-row">
                      {CONTACT_TOPICS.map((option) => (
                        <button
                          key={option}
                          type="button"
                          className={`contact-topic${topic === option ? " is-active" : ""}`}
                          aria-pressed={topic === option}
                          onClick={() => setTopic(option)}
                        >
                          {t(TOPIC_KEYS[option])}
                        </button>
                      ))}
                    </div>
                  </fieldset>

                  {/* Only for a booking question. Asking every visitor for a
                      reference they do not have is how a form gets abandoned;
                      asking the one who does have it is how the reply becomes
                      useful on the first try. */}
                  {topic === "Booking help" ? (
                    <div className="contact-booking-pair">
                      <label className="auth-modal-field">
                        <span>{t("contact.reference")}</span>
                        <input
                          type="text"
                          maxLength={64}
                          value={reference}
                          onChange={(e) => setReference(e.target.value)}
                          placeholder={t("contact.referencePlaceholder")}
                        />
                        <small className="contact-field-hint">{t("contact.referenceHint")}</small>
                      </label>
                      <label className="auth-modal-field">
                        <span>{t("contact.whichPartner")}</span>
                        <select value={partner} onChange={(e) => setPartner(e.target.value)}>
                          <option value="">{t("contact.partnerUnsure")}</option>
                          {PARTNER_NAMES.map((n) => (
                            <option key={n} value={n}>
                              {n}
                            </option>
                          ))}
                        </select>
                      </label>
                    </div>
                  ) : null}

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
