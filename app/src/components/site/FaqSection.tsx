type Faq = { q: string; a: string };

// Same simple, always-visible static-panel pattern as the destination
// pages' FAQ section (routes/destinations/$slug.tsx) -- no accordion state
// needed, and nothing is ever hidden behind a click.
export function FaqSection({ heading, faqs }: { heading: string; faqs: Faq[] }) {
  return (
    <section className="site-section site-hairline border-t">
      <div className="site-container">
        <p className="site-eyebrow mb-3">FAQ</p>
        <h2 className="site-h2 max-w-lg text-3xl md:text-4xl">{heading}</h2>
        <div className="mt-8 grid grid-cols-1 gap-3 md:grid-cols-2 md:gap-5">
          {faqs.map((faq) => (
            <div key={faq.q} className="site-panel p-6">
              <p className="font-semibold leading-snug">{faq.q}</p>
              <p className="site-ink-muted mt-2 text-sm leading-relaxed">{faq.a}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
