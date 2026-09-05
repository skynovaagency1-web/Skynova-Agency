import { createFileRoute } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";

import { Nav } from "@/components/site/Nav";
import { Footer } from "@/components/site/Footer";
import { getDestinationBySlug } from "@/data/destinations";
import { submitGiftRequest } from "@/lib/api/gift.functions";

export const Route = createFileRoute("/gift")({
  // Optional ?destination=<slug>, set by the gift button on destination
  // cards. Validated rather than trusted: an unknown slug simply resolves
  // to no destination and the form opens blank.
  validateSearch: (search: Record<string, unknown>): { destination?: string } => {
    const raw = search.destination;
    return typeof raw === "string" && raw.length > 0 && raw.length < 80
      ? { destination: raw }
      : {};
  },
  head: () => ({
    meta: [
      { title: "Gift a trip | Skynova Agency" },
      { name: "description", content: "Send someone a trip idea worth taking." },
    ],
  }),
  component: GiftPage,
});

function GiftPage() {
  const { destination: destinationSlug } = Route.useSearch();
  const destination = destinationSlug ? getDestinationBySlug(destinationSlug) : undefined;

  const [recipientEmail, setRecipientEmail] = useState("");
  // Prefilled when they arrived from a specific destination card, so the
  // button carries its context instead of dumping them on a blank form.
  const [message, setMessage] = useState(
    destination ? `I thought you'd love a trip to ${destination.name}.` : "",
  );
  const [status, setStatus] = useState<"idle" | "submitting" | "sent" | "error">("idle");
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setStatus("submitting");
    setError(null);
    try {
      await submitGiftRequest({ data: { recipientEmail, message: message || undefined } });
      setStatus("sent");
    } catch (err) {
      setStatus("error");
      setError(err instanceof Error ? err.message : "Something went wrong. Try again.");
    }
  }

  return (
    <>
      <Nav />
      <main>
        <section className="site-section">
          <div className="site-container">
            <p className="site-eyebrow mb-3">Gift</p>
            <h1 className="site-h2 max-w-2xl text-4xl md:text-6xl">Give someone a trip to look forward to.</h1>
            <p className="site-ink-muted mt-4 max-w-lg text-base leading-relaxed">
              Tell us who it's for and we'll be in touch to put a trip together with them.
            </p>
          </div>
        </section>

        <section className="site-section pt-0">
          <div className="site-container max-w-lg">
            {status === "sent" ? (
              <div className="site-panel p-8">
                <p className="text-base leading-relaxed">
                  Got it -- we'll be in touch about a gift trip for {recipientEmail}.
                </p>
              </div>
            ) : (
              <form className="site-panel flex flex-col gap-5 p-8" onSubmit={handleSubmit}>
                <label className="auth-modal-field">
                  <span>Recipient's email</span>
                  <input
                    type="email"
                    required
                    value={recipientEmail}
                    onChange={(e) => setRecipientEmail(e.target.value)}
                  />
                </label>
                <label className="auth-modal-field">
                  <span>Message (optional)</span>
                  <textarea
                    rows={4}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="A trip idea, an occasion, anything that helps us put it together."
                  />
                </label>
                {error ? <p className="auth-modal-error">{error}</p> : null}
                <button type="submit" className="btn-hero-pill justify-center" disabled={status === "submitting"}>
                  <span>{status === "submitting" ? "Sending..." : "Send"}</span>
                </button>
              </form>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
