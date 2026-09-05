import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { ChevronDown, ChevronUp } from "lucide-react";

import { Nav } from "@/components/site/Nav";
import { Footer } from "@/components/site/Footer";

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

const FAQS = [
  {
    q: "Does booking through Skynova cost more than going direct?",
    a: "No -- the price you see is the partner's own price. Skynova earns a commission from the airline, hotel, or partner, never a markup added to what you pay.",
  },
  {
    q: "Who do I contact if something goes wrong with my booking?",
    a: "Your booking sits directly with the airline, hotel, or partner you booked through, so their support team handles changes and issues -- our team can point you to the right contact if you're not sure where to start.",
  },
  {
    q: "Can I book flights, hotels, and a rental car in one search?",
    a: "Yes -- flights, stays, car rentals, airport services, eSIM, and tours are all searchable from the same flow, routed to the partner that actually fulfills each one.",
  },
  {
    q: "Do I need a data plan before I land?",
    a: "You can activate an eSIM before you leave or arrange a physical SIM waiting at the counter -- both are bookable from the same search as your flight.",
  },
  {
    q: "Is my payment information safe?",
    a: "Checkout happens directly on the partner's own site at their price -- Skynova never stores your card details.",
  },
];

function FaqPage() {
  const [activeIndex, setActiveIndex] = useState<number | null>(0);

  return (
    <>
      <Nav />
      <main>
        <section className="site-section">
          <div className="site-container">
            <p className="site-eyebrow mb-3">FAQ</p>
            <h1 className="site-h2 max-w-2xl text-4xl md:text-6xl">Questions, answered.</h1>
            <p className="site-ink-muted mt-5 max-w-xl text-base leading-relaxed">
              The things travelers usually want to know before they book their first trip through Skynova.
            </p>

            <div className="faq-grid mt-12">
              <div className="faq-cta">
                <h2 className="faq-cta-title">
                  Ready for
                  <br />
                  your next trip?
                </h2>
                <p className="faq-cta-sub">One search, every vertical, zero markup.</p>
                <Link to="/destinations" className="faq-cta-btn">
                  Start your trip
                </Link>
              </div>

              <div className="faq-list">
                {FAQS.map((item, i) => {
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
