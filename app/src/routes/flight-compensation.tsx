import { createFileRoute } from "@tanstack/react-router";

import { VerticalPage } from "@/components/site/VerticalPage";
import { PlainHero } from "@/components/site/PlainHero";
import { flightCompensationLink } from "@/lib/affiliate";
import { useT } from "@/lib/i18n-strings";

export const Route = createFileRoute("/flight-compensation")({
  head: () => ({
    meta: [
      { title: "Flight delay compensation | Skynova Agency" },
      {
        name: "description",
        content:
          "Delayed, cancelled or overbooked? You may be owed up to 600 EUR per passenger under EU261. Free check, no win no fee.",
      },
    ],
  }),
  component: FlightCompensationPage,
});

/**
 * Flight compensation, through Compensair.
 *
 * Deliberately NOT in data/verticals.ts. That array is the bookable services,
 * it drives the nav's mega menu and the homepage explorer, and the homepage
 * counts it to say how many "kinds of booking" the site covers -- adding a
 * claims service would make that sentence untrue. It is linked from /flights
 * and the footer instead, which is where someone looking for it would be.
 *
 * No hero photograph: there is no honest stock image of a compensation claim,
 * so this uses the typographic hero (components/site/PlainHero.tsx) rather
 * than borrowing an unrelated airport shot.
 *
 * The fee is stated on the page, in the hero, above the fold. Compensair take
 * a percentage of whatever they recover, and a visitor should read that here
 * rather than discover it at the partner's checkout -- the same principle as
 * the "no markup, ever" line the rest of the site leads with.
 */
function FlightCompensationPage() {
  const t = useT();
  const href = flightCompensationLink();

  return (
    <VerticalPage
      eyebrow={t("protect.compEyebrow")}
      title={t("protect.compTitle")}
      description={t("protect.compCopy")}
      heroAlt=""
      ctaHref={href}
      ctaLabel={t("protect.compCta")}
      heroSlot={
        <PlainHero
          eyebrow={t("protect.compEyebrow")}
          title={t("protect.compTitle")}
          description={t("protect.compCopy")}
          ctaHref={href}
          ctaLabel={t("protect.compCta")}
          note={t("protect.compNote")}
        />
      }
      bulletVariant="gradient"
      bullets={[
        { title: t("protect.compB1Title"), body: t("protect.compB1Body") },
        { title: t("protect.compB2Title"), body: t("protect.compB2Body") },
        { title: t("protect.compB3Title"), body: t("protect.compB3Body") },
        { title: t("protect.compB4Title"), body: t("protect.compB4Body") },
      ]}
      faqs={[
        { q: t("protect.compQ1"), a: t("protect.compA1") },
        { q: t("protect.compQ2"), a: t("protect.compA2") },
        { q: t("protect.compQ3"), a: t("protect.compA3") },
      ]}
    />
  );
}
