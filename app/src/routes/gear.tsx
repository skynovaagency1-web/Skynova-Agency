import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";

import { Nav } from "@/components/site/Nav";
import { Footer } from "@/components/site/Footer";
import { Newsletter } from "@/components/site/Newsletter";
import { StructuredData } from "@/components/StructuredData";
import { breadcrumbJsonLd, itemListJsonLd, jsonLd } from "@/lib/seo";
import {
  GEAR,
  GEAR_CATEGORIES,
  GEAR_COLLECTIONS,
  gearCollectionItems,
  type GearCategory,
  type GearItem,
} from "@/data/gear";
import { gearLink, gearLinksAreAttributed } from "@/lib/gear-affiliate";
import { useT, useLocale, localeMeta } from "@/lib/i18n-strings";

/**
 * The boutique.
 *
 * Structure follows Your Next Store (yournextstore.com, MIT) -- the storefront
 * shape it uses and this page did not have: a banded head, curated
 * collections above the catalogue, and a square-tiled grid at one / two /
 * three columns where the media is the thing you scan and the words sit
 * under it. None of its code is here and none could be: YNS is Next.js 16
 * with React Server Components and a Stripe checkout, and this is TanStack
 * Start on a Worker with no checkout at all. What was portable was the
 * layout, and that is what was taken.
 *
 * NO CART, NO PRICES, AND THAT IS THE MODEL RATHER THAN AN UNFINISHED
 * FEATURE. Every link here goes to a retailer who takes the payment, states
 * the price and handles the return. Building a real checkout would mean VAT
 * registration, the 14-day withdrawal right and a GPSR responsible person
 * for the EU -- overhead that buys nothing at this site's traffic. See the
 * disclosure block below, whose wording follows whether the links are
 * actually attributed.
 */

export const Route = createFileRoute("/gear")({
  head: ({ match }) => ({
    meta: localeMeta(match.context.locale, "meta.gear.title", "meta.gear.description"),
  }),
  component: GearPage,
});

/** Ground tint per category, so a product with no photograph still lands on a
 *  plate that belongs to its group rather than a grey box. Drawn from the
 *  site's own accents, not invented. */
const CATEGORY_TINT: Record<GearCategory, string> = {
  bags: "202, 138, 64",
  packing: "134, 142, 106",
  tech: "96, 128, 160",
  comfort: "168, 118, 148",
  health: "88, 150, 140",
  security: "150, 104, 96",
};

function GearPage() {
  const t = useT();
  const locale = useLocale();
  const [active, setActive] = useState<GearCategory | "all">("all");
  const lang = locale === "fr" ? "fr" : "en";

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
        {/* The banded head. YNS gives its collections a tinted band rather
            than dropping straight into a grid, which is what separates a
            storefront from a list. */}
        <section className="boutique-head">
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
            <p className="boutique-disclosure site-ink-muted">
              {gearLinksAreAttributed(locale) ? t("gear.disclosure") : t("gear.disclosureUnpaid")}
            </p>
          </div>
        </section>

        {/* Curated groups, above the catalogue. These cut across the category
            filter below on purpose -- "Carry-on only" is a bag, cubes, a
            toiletry case and a battery. */}
        <section className="site-section pt-0">
          <div className="site-container">
            <h2 className="boutique-section-title">{t("gear.collectionsTitle")}</h2>
            <div className="boutique-collections">
              {GEAR_COLLECTIONS.map((collection) => {
                const items = gearCollectionItems(collection);
                return (
                  <a key={collection.slug} href={`#${collection.slug}`} className="boutique-collection">
                    <span className="boutique-collection-count">
                      {t("gear.pieces", { count: items.length })}
                    </span>
                    <span className="boutique-collection-title">{collection.title[lang]}</span>
                    <span className="site-ink-muted boutique-collection-blurb">
                      {collection.blurb[lang]}
                    </span>
                  </a>
                );
              })}
            </div>
          </div>
        </section>

        {GEAR_COLLECTIONS.map((collection) => (
          <section key={collection.slug} id={collection.slug} className="site-section pt-0 scroll-mt-24">
            <div className="site-container">
              <h2 className="boutique-section-title">{collection.title[lang]}</h2>
              <p className="site-ink-muted boutique-section-blurb">{collection.blurb[lang]}</p>
              <ul className="boutique-grid">
                {gearCollectionItems(collection).map((item) => (
                  <ProductTile key={`${collection.slug}-${item.slug}`} item={item} lang={lang} t={t} locale={locale} />
                ))}
              </ul>
            </div>
          </section>
        ))}

        {/* The full catalogue, with the category filter. */}
        <section id="everything" className="site-section pt-0 scroll-mt-24">
          <div className="site-container">
            <h2 className="boutique-section-title">{t("gear.allTitle")}</h2>

            <div className="mt-6 flex flex-wrap gap-2">
              <CategoryChip
                label={t("gear.all")}
                selected={active === "all"}
                onSelect={() => setActive("all")}
              />
              {GEAR_CATEGORIES.map((c) => (
                <CategoryChip
                  key={c.id}
                  label={t(`gear.cat.${c.id}` as Parameters<typeof t>[0])}
                  selected={active === c.id}
                  onSelect={() => setActive(c.id)}
                />
              ))}
            </div>

            <ul className="boutique-grid mt-10">
              {shown.map((item) => (
                <ProductTile key={item.slug} item={item} lang={lang} t={t} locale={locale} anchor />
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

function ProductTile({
  item,
  lang,
  t,
  locale,
  anchor = false,
}: {
  item: GearItem;
  lang: "en" | "fr";
  t: ReturnType<typeof useT>;
  locale: ReturnType<typeof useLocale>;
  anchor?: boolean;
}) {
  const href = gearLink(item.query, locale);
  // noopener for the obvious reason; nofollow + sponsored because these are
  // commercial outbound links and Google asks for them to be marked as such.
  // Unmarked affiliate links are a manual-action risk, and the tag costs
  // nothing when the link earns nothing.
  const rel = "noopener noreferrer nofollow sponsored";

  return (
    /* Only the catalogue carries the id. A product appears in several
       collections, and four elements sharing one id is invalid HTML and
       breaks the #slug links the structured data publishes. */
    <li id={anchor ? item.slug : undefined} className="boutique-card">
      <a
        className="boutique-media"
        href={href}
        target="_blank"
        rel={rel}
        style={{ "--tint": CATEGORY_TINT[item.category] } as React.CSSProperties}
        aria-label={`${item.maker} ${item.name}`}
      >
        {item.image ? (
          <img src={item.image} alt="" className="boutique-photo" loading="lazy" />
        ) : (
          /* No photograph yet, and this is not a placeholder waiting to be
             replaced by a grey box. These are real branded products whose
             photography belongs to their makers, and Amazon's terms want
             product images served through their own API rather than copied.
             Until a licensed shot exists the tile is a typographic plate on
             the category's own tint -- deliberate, and readable, which an
             empty square is not. The photo takes over the moment `image` is
             set on the item. */
          <span className="boutique-plate" aria-hidden="true">
            <span className="boutique-plate-maker">{item.maker}</span>
            <span className="boutique-plate-name">{item.name}</span>
          </span>
        )}
      </a>

      <div className="boutique-meta">
        <p className="site-ink-muted boutique-maker">{item.maker}</p>
        <h3 className="boutique-name">{item.name}</h3>
        <p className="site-ink-muted boutique-why">{item.why[lang]}</p>
        <a className="boutique-cta" href={href} target="_blank" rel={rel}>
          {t("gear.check")}
        </a>
      </div>
    </li>
  );
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
      className="boutique-chip"
    >
      {label}
    </button>
  );
}
