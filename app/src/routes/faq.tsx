import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { ChevronDown, ChevronUp } from "lucide-react";

import { Nav } from "@/components/site/Nav";
import { Footer } from "@/components/site/Footer";
import { StructuredData } from "@/components/StructuredData";
import { breadcrumbJsonLd, faqJsonLd, jsonLd } from "@/lib/seo";

import { useT } from "@/lib/i18n-strings";

export const Route = createFileRoute("/faq")({
  head: () => ({
    meta: [
      { title: "FAQ | Skynova Agency" },
      {
        name: "description",
        content: "Answers to the questions travelers ask most about booking with Skynova Agency.",
      },
    ],
  }),
  component: FaqPage,
});

function FaqPage() {
  const t = useT();
  const [activeIndex, setActiveIndex] = useState<number | null>(0);

  // Built inside the component, from the same strings the page renders. It
  // used to be a module constant, which would have emitted English FAQ markup
  // on the French page -- structured data that disagrees with the page is
  // worse than none.
  const faqs = [
    { q: t("faq.q1"), a: t("faq.a1") },
    { q: t("faq.q2"), a: t("faq.a2") },
    { q: t("faq.q3"), a: t("faq.a3") },
    { q: t("faq.q4"), a: t("faq.a4") },
    { q: t("faq.q5"), a: t("faq.a5") },
  ];
  const faqLd = jsonLd([
    faqJsonLd(faqs),
    breadcrumbJsonLd([{ name: t("nav.home"), path: "/" }, { name: t("faq.eyebrow") }]),
  ]);

  return (
    <>
      <StructuredData json={faqLd} />
      <Nav />
      <main>
        <section className="site-section">
          <div className="site-container">
            <p className="site-eyebrow mb-3">{t("faq.eyebrow")}</p>
            <h1 className="site-h2 max-w-2xl text-4xl md:text-6xl">{t("faq.heading")}</h1>
            <p className="site-ink-muted mt-5 max-w-xl text-base leading-relaxed">{t("faq.intro")}</p>

            <div className="faq-grid mt-12">
              <div className="faq-cta">
                <h2 className="faq-cta-title">
                  {t("faq.ctaTitle1")}
                  <br />
                  {t("faq.ctaTitle2")}
                </h2>
                <p className="faq-cta-sub">{t("faq.ctaSub")}</p>
                <Link to="/destinations" className="faq-cta-btn">
                  {t("nav.startTrip")}
                </Link>
              </div>

              <div className="faq-list">
                {faqs.map((item, i) => {
                  const isOpen = activeIndex === i;
                  return (
                    <div
                      key={item.q}
                      className={`faq-item${isOpen ? " is-open" : ""}`}
                      onClick={() => setActiveIndex(isOpen ? null : i)}
                    >
                      <div className="faq-item-row">
                        <span>{item.q}</span>
                        {isOpen ? (
                          <ChevronUp size={18} aria-hidden="true" />
                        ) : (
                          <ChevronDown size={18} aria-hidden="true" />
                        )}
                      </div>
                      {isOpen ? <p className="faq-answer">{item.a}</p> : null}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
