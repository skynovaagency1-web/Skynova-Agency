import { useState, type FormEvent } from "react";

import { subscribeToNewsletter } from "@/lib/api/newsletter.functions";
import { useT } from "@/lib/i18n-strings";

// This form used to store nothing at all: submitting flipped a local flag and
// showed "You're on the list", so every address typed into it was discarded.
// It now persists to D1 and syncs to systeme.io, and -- the part that matters
// -- the confirmation only appears once the server has actually accepted the
// address. A success message shown before the request resolves is the same
// lie the old version told, just faster.
export function Newsletter() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "done" | "error">("idle");
  const t = useT();

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
    <section data-rail-dark="" className="newsletter-section">
      <div className="site-container newsletter-inner">
        <p className="newsletter-eyebrow">{t("news.eyebrow")}</p>
        <h2 className="newsletter-heading">{t("news.heading")}</h2>
        <p className="newsletter-copy">{t("news.copy")}</p>
        {status === "done" ? (
          <p className="newsletter-thanks">{t("news.thanks")}</p>
        ) : (
          <form className="newsletter-form" onSubmit={handleSubmit}>
            <input
              type="email"
              required
              placeholder={t("news.placeholder")}
              aria-label={t("news.emailAria")}
              className="newsletter-input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={status === "sending"}
            />
            <button type="submit" className="newsletter-submit" disabled={status === "sending"}>
              {status === "sending" ? t("news.joining") : t("news.subscribe")}
            </button>
          </form>
        )}
        {status === "error" ? (
          // Says what to do next rather than apologising -- and never claims
          // the address was saved, because it was not.
          <p className="newsletter-error" role="alert">
            {t("news.error")}
          </p>
        ) : null}
        <p className="newsletter-privacy">{t("news.privacy")}</p>
      </div>
    </section>
  );
}
