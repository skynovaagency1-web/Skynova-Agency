export type Region =
  | "Europe"
  | "Asia"
  | "Americas"
  | "Caribbean"
  | "Africa"
  | "Middle East"
  | "Oceania";

export type Destination = {
  slug: string;
  /** The page's accent colour, drawn from the place itself -- Aegean blue for
   *  Croatia, terracotta for Morocco, indigo-red for Japan. Overrides
   *  --sky-coral for the whole destination page, so every accented element
   *  (eyebrow rule, stat figures, buttons, link hovers) retints together.
   *
   *  Every value is checked to clear WCAG AA both as a button fill under
   *  white text and as text on --sky-bg-raised; see the contrast check in
   *  the commit that introduced this. Do not add one by eye. */
  accent: string;
  name: string;
  region: Region;
  flag: string;
  hook: string;
};

/** Destinations that have a real hero photo at
 * /assets/destinations/<slug>.webp. Everything else falls back to the
 * designed flag treatment, which is intentional -- a generic stock shot
 * looks worse than an honest fallback.
 *
 * This list used to be duplicated in three files (this route, the slider and
 * blog-posts.ts) and had already drifted out of sync. It lives here now, and
 * the others import it. Order matters: DestinationSlider renders in this
 * order, so put the strongest images first.
 *
 * To add one: drop <slug>.webp in public/assets/destinations and add the
 * slug here. Nothing else needs changing. */
export const PHOTO_SLUG_ORDER = [
  "portugal",
  "switzerland",
  "italy",
  "japan",
  "vietnam",
  "peru",
  "kenya",
  "namibia",
  "jordan",
  "new-zealand",
  "fiji",
  "united-arab-emirates",
  "indonesia",
  "tanzania",
  "united-states",
  "turkey",
  "egypt",
  "canada",
  "south-africa",
  "croatia",
  "thailand",
  "mexico",
  "australia",
  "saudi-arabia",
  "morocco",
  "netherlands",
  "spain",
  "sri-lanka",
  "south-korea",
  "brazil",
  "argentina",
  "oman",
  "qatar",
  "french-polynesia",
  "samoa",
  "new-caledonia",
  "guadeloupe",
  "cuba",
  "dominican-republic",
  "jamaica",
  "bahamas",
] as const;

export const PHOTO_SLUGS: ReadonlySet<string> = new Set<string>([
  ...PHOTO_SLUG_ORDER,
  // Not a destination -- a themed cycling landing image reused by the blog.
  "switzerland-cycling",
]);

export const REGION_ORDER: { region: Region; icon: string }[] = [
  { region: "Europe", icon: "🌍" },
  { region: "Asia", icon: "🌏" },
  { region: "Americas", icon: "🌎" },
  { region: "Caribbean", icon: "🏝️" },
  { region: "Africa", icon: "🌍" },
  { region: "Middle East", icon: "🌍" },
  { region: "Oceania", icon: "🌊" },
];

export const DESTINATIONS: Destination[] = [
  { slug: "portugal",
    accent: "#1f6f8b", name: "Portugal", region: "Europe", flag: "🇵🇹", hook: "Atlantic coastline, tiled cities, and some of Europe's best-value flights." },
  { slug: "switzerland",
    accent: "#8a1f2b", name: "Switzerland", region: "Europe", flag: "🇨🇭", hook: "Alpine trains, lake towns, and easy connections into every neighboring country." },
  { slug: "netherlands",
    accent: "#9c530b", name: "Netherlands", region: "Europe", flag: "🇳🇱", hook: "Canal cities and a hub airport that makes onward flights easy." },
  { slug: "croatia",
    accent: "#1b6ea8", name: "Croatia", region: "Europe", flag: "🇭🇷", hook: "Adriatic islands and walled old towns along a single coastal road." },
  { slug: "italy",
    accent: "#7a1f2b", name: "Italy", region: "Europe", flag: "🇮🇹", hook: "Art cities, coastline, and food worth planning a route around." },
  { slug: "spain",
    accent: "#a8420d", name: "Spain", region: "Europe", flag: "🇪🇸", hook: "Beaches, historic capitals, and some of Europe's busiest flight routes." },

  { slug: "vietnam",
    accent: "#1f7a5a", name: "Vietnam", region: "Asia", flag: "🇻🇳", hook: "A north-to-south route through mountains, coast, and old quarters." },
  { slug: "south-korea",
    accent: "#2f4b9a", name: "South Korea", region: "Asia", flag: "🇰🇷", hook: "Seoul's neighborhoods, coastal cities, and fast rail between them." },
  { slug: "sri-lanka",
    accent: "#8a5a12", name: "Sri Lanka", region: "Asia", flag: "🇱🇰", hook: "Hill country, coastline, and wildlife parks in a compact loop." },
  { slug: "japan",
    accent: "#8c2f39", name: "Japan", region: "Asia", flag: "🇯🇵", hook: "Bullet trains between neon cities, temple towns, and mountain onsen." },
  { slug: "thailand",
    accent: "#96560f", name: "Thailand", region: "Asia", flag: "🇹🇭", hook: "Street food, island beaches, and northern hill temples on one ticket." },
  { slug: "indonesia",
    accent: "#186b52", name: "Indonesia", region: "Asia", flag: "🇮🇩", hook: "Volcanoes, reefs, and rice terraces across thousands of islands." },

  { slug: "united-states",
    accent: "#8a4a1c", name: "United States", region: "Americas", flag: "🇺🇸", hook: "National parks, coastal cities, and road trips across every region." },
  { slug: "canada",
    accent: "#8a1f2b", name: "Canada", region: "Americas", flag: "🇨🇦", hook: "Mountains, lakes, and cities spread across a continent-sized country." },
  { slug: "brazil",
    accent: "#1f7a4a", name: "Brazil", region: "Americas", flag: "🇧🇷", hook: "Coastline, rainforest, and cities that run through the night." },
  { slug: "mexico",
    accent: "#9c3a12", name: "Mexico", region: "Americas", flag: "🇲🇽", hook: "Ruins, beach towns, and street food across every region." },
  { slug: "peru",
    accent: "#8a4a12", name: "Peru", region: "Americas", flag: "🇵🇪", hook: "Andean trails, colonial cities, and Amazon access in one trip." },
  { slug: "argentina",
    accent: "#2f6fa8", name: "Argentina", region: "Americas", flag: "🇦🇷", hook: "Glaciers, wine country, and a capital built for long dinners." },

  { slug: "martinique",
    accent: "#0f6b6b", name: "Martinique", region: "Caribbean", flag: "🇲🇶", hook: "France in the Caribbean -- rum distilleries, a live volcano, and beaches on both coasts." },
  { slug: "guadeloupe",
    accent: "#0f7a6a", name: "Guadeloupe", region: "Caribbean", flag: "🇬🇵", hook: "Two islands joined by a bridge: rainforest and waterfalls on one, white sand on the other." },
  { slug: "cuba",
    accent: "#a8420d", name: "Cuba", region: "Caribbean", flag: "🇨🇺", hook: "Havana's old town, tobacco valleys, and a coastline still largely undeveloped." },
  { slug: "dominican-republic",
    accent: "#0f6f8a", name: "Dominican Republic", region: "Caribbean", flag: "🇩🇴", hook: "The Caribbean's busiest beaches, plus mountains and whale season on the side." },
  { slug: "jamaica",
    accent: "#2b7a1f", name: "Jamaica", region: "Caribbean", flag: "🇯🇲", hook: "Blue Mountains, waterfalls, and the north coast's long run of beaches." },
  { slug: "bahamas",
    accent: "#0f7a9c", name: "Bahamas", region: "Caribbean", flag: "🇧🇸", hook: "Seven hundred islands, shallow turquoise banks, and the shortest hop from Florida." },

  { slug: "egypt",
    accent: "#856012", name: "Egypt", region: "Africa", flag: "🇪🇬", hook: "Ancient sites along the Nile and Red Sea coastline." },
  { slug: "south-africa",
    accent: "#1f6b4a", name: "South Africa", region: "Africa", flag: "🇿🇦", hook: "Safari country, coastline, and wine valleys within a day's drive." },
  { slug: "kenya",
    accent: "#a0521c", name: "Kenya", region: "Africa", flag: "🇰🇪", hook: "Safari parks and a coastline worth extending the trip for." },
  { slug: "namibia",
    accent: "#a05a1c", name: "Namibia", region: "Africa", flag: "🇳🇦", hook: "Desert dunes, wildlife, and some of the clearest night skies anywhere." },
  { slug: "morocco",
    accent: "#9c3a1c", name: "Morocco", region: "Africa", flag: "🇲🇦", hook: "Medinas, mountain passes, and Sahara camps within a few hours of each other." },
  { slug: "tanzania",
    accent: "#8a5a1c", name: "Tanzania", region: "Africa", flag: "🇹🇿", hook: "The Serengeti, a dormant volcano crater, and Zanzibar to finish on." },

  { slug: "jordan",
    accent: "#9c5a2b", name: "Jordan", region: "Middle East", flag: "🇯🇴", hook: "Desert canyons, ancient ruins, and a short hop to the Red Sea." },
  { slug: "oman",
    accent: "#2f5f7a", name: "Oman", region: "Middle East", flag: "🇴🇲", hook: "Mountains, wadis, and coastline without the crowds." },
  { slug: "qatar",
    accent: "#6b1f4a", name: "Qatar", region: "Middle East", flag: "🇶🇦", hook: "A stopover city built for a long layover done right." },
  { slug: "united-arab-emirates",
    accent: "#1f5f7a", name: "United Arab Emirates", region: "Middle East", flag: "🇦🇪", hook: "Dubai and Abu Dhabi, with desert and diving an hour from either." },
  { slug: "saudi-arabia",
    accent: "#1f6b52", name: "Saudi Arabia", region: "Middle East", flag: "🇸🇦", hook: "Rock-cut tombs at AlUla, Red Sea reefs, and a country newly open to visitors." },
  { slug: "turkey",
    accent: "#1f5f8a", name: "Türkiye", region: "Middle East", flag: "🇹🇷", hook: "Istanbul's two continents, Cappadocian valleys, and a long Aegean coast." },

  { slug: "australia",
    accent: "#a8480d", name: "Australia", region: "Oceania", flag: "🇦🇺", hook: "Coastline, outback, and cities spread across a continent." },
  { slug: "new-zealand",
    accent: "#1f6b6b", name: "New Zealand", region: "Oceania", flag: "🇳🇿", hook: "Fjords, glaciers, and drives built for stopping often." },
  { slug: "fiji",
    accent: "#0f7a8c", name: "Fiji", region: "Oceania", flag: "🇫🇯", hook: "Island-hopping and reef diving in the South Pacific." },
  { slug: "french-polynesia",
    accent: "#0f6f9c", name: "French Polynesia", region: "Oceania", flag: "🇵🇫", hook: "Overwater bungalows, lagoons, and volcanic peaks across 118 islands." },
  { slug: "new-caledonia",
    accent: "#1f6f8c", name: "New Caledonia", region: "Oceania", flag: "🇳🇨", hook: "The world's largest lagoon, Cook pines, and France in the South Pacific." },
  { slug: "samoa",
    accent: "#12756b", name: "Samoa", region: "Oceania", flag: "🇼🇸", hook: "Swimming holes, waterfalls, and beach fales on the sand." },
];

export function getDestinationsByRegion(region: Region): Destination[] {
  return DESTINATIONS.filter((d) => d.region === region);
}

export function getDestinationBySlug(slug: string): Destination | undefined {
  return DESTINATIONS.find((d) => d.slug === slug);
}

/**
 * Destinations to suggest alongside `slug`.
 *
 * Same region first, because that is the genuinely useful neighbour -- someone
 * reading about Portugal is far more likely to also consider Spain than Japan,
 * and a link nobody follows is worth nothing for rankings or for readers.
 * Small regions are then topped up from the rest of the list so every page
 * gets a full row rather than one lonely card.
 *
 * Deterministic: no randomness anywhere. These links are rendered during SSR,
 * and a set that reshuffles per request gives crawlers a different link graph
 * every visit, which is the opposite of what internal linking is for. It also
 * makes the pages uncacheable in any meaningful sense.
 *
 * Rotation is by position rather than always taking the first few: starting at
 * the entry after this one and wrapping means link equity spreads around the
 * list instead of pooling on whichever destinations happen to sort first.
 */
export function relatedDestinations(slug: string, limit = 4): Destination[] {
  const current = getDestinationBySlug(slug);
  if (!current) return [];

  const pick = (pool: Destination[]) => {
    const others = pool.filter((d) => d.slug !== slug);
    if (others.length === 0) return [];
    // Start just past this destination's own position in the pool and wrap.
    const start = Math.max(0, pool.findIndex((d) => d.slug === slug));
    const rotated = [...pool.slice(start), ...pool.slice(0, start)].filter((d) => d.slug !== slug);
    return rotated;
  };

  const sameRegion = pick(getDestinationsByRegion(current.region));
  const out = sameRegion.slice(0, limit);
  if (out.length < limit) {
    const taken = new Set(out.map((d) => d.slug));
    for (const d of pick(DESTINATIONS)) {
      if (out.length >= limit) break;
      if (taken.has(d.slug)) continue;
      out.push(d);
      taken.add(d.slug);
    }
  }
  return out;
}
