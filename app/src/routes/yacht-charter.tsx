import { createFileRoute } from "@tanstack/react-router";

import { VerticalPage } from "@/components/site/VerticalPage";
import { PlainHero } from "@/components/site/PlainHero";
import { yachtCharterLink } from "@/lib/affiliate";
import { useT } from "@/lib/i18n-strings";

export const Route = createFileRoute("/yacht-charter")({
  head: () => ({
    meta: [
      { title: "Yacht charter & small cruises | Skynova Agency" },
      {
        name: "description",
        content:
          "Sailing yachts, catamarans and motor boats by the week -- bareboat with a licence, or skippered without one. Mediterranean, Caribbean and beyond.",
      },
    ],
  }),
  component: YachtCharterPage,
});

/**
 * Yacht and small-ship charter, through Searadar.
 *
 * ⚠ THE PARTNER LINK MAY NOT ATTRIBUTE. See yachtCharterLink() in
 * lib/affiliate.ts: alone among the partner links on this site, it resolves to
 * a bare homepage with no tracking parameter and no cookie. The page is worth
 * having either way -- it ranks, it answers real questions, and the link can be
 * swapped for a working one in a single line -- but nobody should count income
 * from it until a real click has been seen in the Travelpayouts dashboard.
 *
 * Unlike compensation and insurance, this one IS a booking, so it could
 * eventually belong in data/verticals.ts. It is held out for now for a
 * practical reason rather than a principled one: every entry in that array
 * carries a card photograph from public/assets/sections, and there is no boat
 * photography in the repo. Adding it without one would put a blank tile in the
 * nav's mega menu and the homepage explorer.
 *
 * No hero photograph for the same reason -- see components/site/PlainHero.tsx.
 */
function YachtCharterPage() {
  const t = useT();
  const href = yachtCharterLink();

  return (
    <VerticalPage
      eyebrow={t("protect.yachtEyebrow")}
      title={t("protect.yachtTitle")}
      description={t("protect.yachtCopy")}
      heroAlt=""
      ctaHref={href}
      ctaLabel={t("protect.yachtCta")}
      heroSlot={
        <PlainHero
          eyebrow={t("protect.yachtEyebrow")}
          title={t("protect.yachtTitle")}
          description={t("protect.yachtCopy")}
          ctaHref={href}
          ctaLabel={t("protect.yachtCta")}
          note={t("protect.yachtNote")}
        />
      }
      bullets={[
        { title: t("protect.yachtB1Title"), body: t("protect.yachtB1Body") },
        { title: t("protect.yachtB2Title"), body: t("protect.yachtB2Body") },
        { title: t("protect.yachtB3Title"), body: t("protect.yachtB3Body") },
      ]}
      faqs={[
        { q: t("protect.yachtQ1"), a: t("protect.yachtA1") },
        { q: t("protect.yachtQ2"), a: t("protect.yachtA2") },
        { q: t("protect.yachtQ3"), a: t("protect.yachtA3") },
      ]}
    />
  );
}
