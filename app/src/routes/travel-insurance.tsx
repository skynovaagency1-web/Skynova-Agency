import { createFileRoute } from "@tanstack/react-router";

import { VerticalPage } from "@/components/site/VerticalPage";
import { PlainHero } from "@/components/site/PlainHero";
import { travelInsuranceLink } from "@/lib/affiliate";
import { useT } from "@/lib/i18n-strings";

export const Route = createFileRoute("/travel-insurance")({
  head: () => ({
    meta: [
      { title: "Travel & medical insurance | Skynova Agency" },
      {
        name: "description",
        content:
          "Medical cover, hospital stays and evacuation abroad. Single-trip or annual policies, and cover you can buy after you have already left.",
      },
    ],
  }),
  component: TravelInsurancePage,
});

/**
 * Travel and medical insurance, through Ekta.
 *
 * Not in data/verticals.ts, for the same reason as the compensation page: that
 * array is the bookable services and the homepage counts it to say how many
 * "kinds of booking" the site covers. Insurance is not a booking.
 *
 * The exclusions are in the hero rather than buried at the foot. Pre-existing
 * conditions are the single most common reason a travel medical claim is
 * refused, and someone who reads that here and buys anyway has made a real
 * decision -- which is the whole posture of the site.
 *
 * No hero photograph, deliberately: see components/site/PlainHero.tsx.
 */
function TravelInsurancePage() {
  const t = useT();
  const href = travelInsuranceLink();

  return (
    <VerticalPage
      eyebrow={t("protect.insEyebrow")}
      title={t("protect.insTitle")}
      description={t("protect.insCopy")}
      heroAlt=""
      ctaHref={href}
      ctaLabel={t("protect.insCta")}
      heroSlot={
        <PlainHero
          eyebrow={t("protect.insEyebrow")}
          title={t("protect.insTitle")}
          description={t("protect.insCopy")}
          ctaHref={href}
          ctaLabel={t("protect.insCta")}
          note={t("protect.insNote")}
        />
      }
      bullets={[
        { title: t("protect.insB1Title"), body: t("protect.insB1Body") },
        { title: t("protect.insB2Title"), body: t("protect.insB2Body") },
        { title: t("protect.insB3Title"), body: t("protect.insB3Body") },
      ]}
      faqs={[
        { q: t("protect.insQ1"), a: t("protect.insA1") },
        { q: t("protect.insQ2"), a: t("protect.insA2") },
        { q: t("protect.insQ3"), a: t("protect.insA3") },
      ]}
    />
  );
}
