import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";

import { Nav } from "@/components/site/Nav";
import { Footer } from "@/components/site/Footer";
import { Newsletter } from "@/components/site/Newsletter";
import { StructuredData } from "@/components/StructuredData";
import { breadcrumbJsonLd, itemListJsonLd, jsonLd } from "@/lib/seo";
import { GEAR, GEAR_CATEGORIES, type GearCategory } from "@/data/gear";
import { gearLink, gearLinksAreAttributed } from "@/lib/gear-affiliate";
import { useT, useLocale, localeMeta } from "@/lib/i18n-strings";

export const Route = createFileRoute("/gear")({
  head: ({ match }) => ({
    meta: localeMeta(match.context.locale, "meta.gear.title", "meta.gear.description"),
  }),
  component: GearPage,
});

function GearPage() {
  const t = useT();
  const locale = useLocale();
  const [active, setActive] = useState<GearCategory | "all">("all");

  const shown = active === "all" ? GEAR : GEAR.filter((g) => g.category === active);

  // Built from the rendered strings, like faq.tsx does, so the French page
  // never emits English structured data.
  const ld = jsonLd([
    breadcrumbJsonLd([
      { name: "Skynova Agency", path: "/" },
      // No path on the last crumb: breadcrumbJsonLd drops `item` for the
      // current page, which is what Google expects.
      { name: t("gear.title") },
    ]),
    itemListJsonLd(
      t("gear.title"),
      GEAR.map((g) => ({
        name: `${g.maker} ${g.name}`,
        path: `/gear#${g.slug}`,
      })),
    ),
  ]);

  return (
    <>
      <StructuredData json={ld} />
      <Nav />
      <main>
        <section className="site-section">
          <div className="site-container">
            <p className="site-eyebrow mb-3">{t("gear.eyebrow")}</p>
            <h1 className="site-h2 max-w-2xl text-4xl md:text-5xl">{t("gear.title")}</h1>
            <p className="site-ink-muted mt-4 max-w-2xl text-base leading-relaxed">
              {t("gear.intro")}
            </p>

            {/*
              The disclosure sits HERE, above the first link, not only in the
              privacy policy. Both the FTC and the EU unfair-commercial-
              practices rules ask for it to be visible where the reader meets
              the link -- a line buried on /privacy does not meet that, and
              "affiliate" in a footer is not where anybody looks.

              Its wording changes with gearLinksAreAttributed(): claiming a
              commission that is not configured would be its own small lie,
              and the honest version costs nothing to display.
            */}
            <p className="site-ink-muted mt-6 max-w-2xl rounded-lg border border-white/10 bg-white/5 p-4 text-sm leading-relaxed">
              {gearLinksAreAttributed(locale) ? t("gear.disclosure") : t("gear.disclosureUnpaid")}
            </p>

            <div className="mt-8 flex flex-wrap gap-2">
              <CategoryChip
                label={t("gear.all")}
                selected={active === "all"}
                onSelect={() => setActive("all")}
              />
              {GEAR_CATEGORIES.map((c) => (
                <CategoryChip
                  key={c.id}
                  label={`${c.emoji} ${t(`gear.cat.${c.id}` as Parameters<typeof t>[0])}`}
                  selected={active === c.id}
                  onSelect={() => setActive(c.id)}
                />
              ))}
            </div>

            <ul className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {shown.map((item) => (
                <li key={item.slug} id={item.slug} className="gear-vitrine">
                  {/* The lit plinth. Decorative in full: the object is the
                      category mark, and the category is already stated by the
                      filter chips and readable in the copy below, so a screen
                      reader gains nothing from any of it. */}
                  <div className="gear-vitrine-stage" aria-hidden="true">
                    <div className="gear-vitrine-object">
                      {item.image ? (
                        <img src={item.image} alt="" />
                      ) : (
                        categoryEmoji(item.category)
                      )}
                    </div>
                    <span className="gear-vitrine-stand" />
                    <span className="gear-vitrine-bar" />
                  </div>

                  <div className="gear-vitrine-copy">
                    <p className="site-ink-muted text-xs uppercase tracking-wide">{item.maker}</p>
                    <h2 className="mt-1 text-lg font-semibold">{item.name}</h2>
                    <p className="site-ink-muted mt-3 flex-1 text-sm leading-relaxed">
                      {item.why[locale === "fr" ? "fr" : "en"]}
                    </p>
                    <a
                      className="site-btn-secondary mt-5 self-start"
                      href={gearLink(item.query, locale)}
                      target="_blank"
                      // noopener for the obvious reason; nofollow + sponsored
                      // because these are commercial outbound links and Google
                      // asks for them to be marked as such. Unmarked affiliate
                      // links are a manual-action risk, and the tag costs
                      // nothing when the link earns nothing.
                      rel="noopener noreferrer nofollow sponsored"
                    >
                      {t("gear.check")}
                    </a>
                  </div>
                </li>
              ))}
            </ul>

            <p className="site-ink-muted mt-10 max-w-2xl text-sm leading-relaxed">
              {t("gear.noPrices")}
            </p>
          </div>
        </section>
        <Newsletter />
      </main>
      <Footer />
    </>
  );
}

/** The mark that stands on the plinth until a licensed product shot exists.
 *  See the `image` note in data/gear.ts. */
function categoryEmoji(category: GearCategory): string {
  return GEAR_CATEGORIES.find((c) => c.id === category)?.emoji ?? "";
}

function CategoryChip({
  label,
  selected,
  onSelect,
}: {
  label: string;
  selected: boolean;
  onSelect: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onSelect}
      aria-pressed={selected}
      className={
        selected
          ? "rounded-full border border-white/30 bg-white/15 px-4 py-2 text-sm"
          : "rounded-full border border-white/10 px-4 py-2 text-sm"
      }
    >
      {label}
    </button>
  );
}
