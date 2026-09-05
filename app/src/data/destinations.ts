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
  { slug: "portugal", name: "Portugal", region: "Europe", flag: "🇵🇹", hook: "Atlantic coastline, tiled cities, and some of Europe's best-value flights." },
  { slug: "switzerland", name: "Switzerland", region: "Europe", flag: "🇨🇭", hook: "Alpine trains, lake towns, and easy connections into every neighboring country." },
  { slug: "netherlands", name: "Netherlands", region: "Europe", flag: "🇳🇱", hook: "Canal cities and a hub airport that makes onward flights easy." },
  { slug: "croatia", name: "Croatia", region: "Europe", flag: "🇭🇷", hook: "Adriatic islands and walled old towns along a single coastal road." },
  { slug: "italy", name: "Italy", region: "Europe", flag: "🇮🇹", hook: "Art cities, coastline, and food worth planning a route around." },
  { slug: "spain", name: "Spain", region: "Europe", flag: "🇪🇸", hook: "Beaches, historic capitals, and some of Europe's busiest flight routes." },

  { slug: "vietnam", name: "Vietnam", region: "Asia", flag: "🇻🇳", hook: "A north-to-south route through mountains, coast, and old quarters." },
  { slug: "south-korea", name: "South Korea", region: "Asia", flag: "🇰🇷", hook: "Seoul's neighborhoods, coastal cities, and fast rail between them." },
  { slug: "sri-lanka", name: "Sri Lanka", region: "Asia", flag: "🇱🇰", hook: "Hill country, coastline, and wildlife parks in a compact loop." },
  { slug: "japan", name: "Japan", region: "Asia", flag: "🇯🇵", hook: "Bullet trains between neon cities, temple towns, and mountain onsen." },
  { slug: "thailand", name: "Thailand", region: "Asia", flag: "🇹🇭", hook: "Street food, island beaches, and northern hill temples on one ticket." },
  { slug: "indonesia", name: "Indonesia", region: "Asia", flag: "🇮🇩", hook: "Volcanoes, reefs, and rice terraces across thousands of islands." },

  { slug: "united-states", name: "United States", region: "Americas", flag: "🇺🇸", hook: "National parks, coastal cities, and road trips across every region." },
  { slug: "canada", name: "Canada", region: "Americas", flag: "🇨🇦", hook: "Mountains, lakes, and cities spread across a continent-sized country." },
  { slug: "brazil", name: "Brazil", region: "Americas", flag: "🇧🇷", hook: "Coastline, rainforest, and cities that run through the night." },
  { slug: "mexico", name: "Mexico", region: "Americas", flag: "🇲🇽", hook: "Ruins, beach towns, and street food across every region." },
  { slug: "peru", name: "Peru", region: "Americas", flag: "🇵🇪", hook: "Andean trails, colonial cities, and Amazon access in one trip." },
  { slug: "argentina", name: "Argentina", region: "Americas", flag: "🇦🇷", hook: "Glaciers, wine country, and a capital built for long dinners." },

  { slug: "martinique", name: "Martinique", region: "Caribbean", flag: "🇲🇶", hook: "France in the Caribbean -- rum distilleries, a live volcano, and beaches on both coasts." },
  { slug: "guadeloupe", name: "Guadeloupe", region: "Caribbean", flag: "🇬🇵", hook: "Two islands joined by a bridge: rainforest and waterfalls on one, white sand on the other." },
  { slug: "cuba", name: "Cuba", region: "Caribbean", flag: "🇨🇺", hook: "Havana's old town, tobacco valleys, and a coastline still largely undeveloped." },
  { slug: "dominican-republic", name: "Dominican Republic", region: "Caribbean", flag: "🇩🇴", hook: "The Caribbean's busiest beaches, plus mountains and whale season on the side." },
  { slug: "jamaica", name: "Jamaica", region: "Caribbean", flag: "🇯🇲", hook: "Blue Mountains, waterfalls, and the north coast's long run of beaches." },
  { slug: "bahamas", name: "Bahamas", region: "Caribbean", flag: "🇧🇸", hook: "Seven hundred islands, shallow turquoise banks, and the shortest hop from Florida." },

  { slug: "egypt", name: "Egypt", region: "Africa", flag: "🇪🇬", hook: "Ancient sites along the Nile and Red Sea coastline." },
  { slug: "south-africa", name: "South Africa", region: "Africa", flag: "🇿🇦", hook: "Safari country, coastline, and wine valleys within a day's drive." },
  { slug: "kenya", name: "Kenya", region: "Africa", flag: "🇰🇪", hook: "Safari parks and a coastline worth extending the trip for." },
  { slug: "namibia", name: "Namibia", region: "Africa", flag: "🇳🇦", hook: "Desert dunes, wildlife, and some of the clearest night skies anywhere." },
  { slug: "morocco", name: "Morocco", region: "Africa", flag: "🇲🇦", hook: "Medinas, mountain passes, and Sahara camps within a few hours of each other." },
  { slug: "tanzania", name: "Tanzania", region: "Africa", flag: "🇹🇿", hook: "The Serengeti, a dormant volcano crater, and Zanzibar to finish on." },

  { slug: "jordan", name: "Jordan", region: "Middle East", flag: "🇯🇴", hook: "Desert canyons, ancient ruins, and a short hop to the Red Sea." },
  { slug: "oman", name: "Oman", region: "Middle East", flag: "🇴🇲", hook: "Mountains, wadis, and coastline without the crowds." },
  { slug: "qatar", name: "Qatar", region: "Middle East", flag: "🇶🇦", hook: "A stopover city built for a long layover done right." },
  { slug: "united-arab-emirates", name: "United Arab Emirates", region: "Middle East", flag: "🇦🇪", hook: "Dubai and Abu Dhabi, with desert and diving an hour from either." },
  { slug: "saudi-arabia", name: "Saudi Arabia", region: "Middle East", flag: "🇸🇦", hook: "Rock-cut tombs at AlUla, Red Sea reefs, and a country newly open to visitors." },
  { slug: "turkey", name: "Türkiye", region: "Middle East", flag: "🇹🇷", hook: "Istanbul's two continents, Cappadocian valleys, and a long Aegean coast." },

  { slug: "australia", name: "Australia", region: "Oceania", flag: "🇦🇺", hook: "Coastline, outback, and cities spread across a continent." },
  { slug: "new-zealand", name: "New Zealand", region: "Oceania", flag: "🇳🇿", hook: "Fjords, glaciers, and drives built for stopping often." },
  { slug: "fiji", name: "Fiji", region: "Oceania", flag: "🇫🇯", hook: "Island-hopping and reef diving in the South Pacific." },
  { slug: "french-polynesia", name: "French Polynesia", region: "Oceania", flag: "🇵🇫", hook: "Overwater bungalows, lagoons, and volcanic peaks across 118 islands." },
  { slug: "new-caledonia", name: "New Caledonia", region: "Oceania", flag: "🇳🇨", hook: "The world's largest lagoon, Cook pines, and France in the South Pacific." },
  { slug: "samoa", name: "Samoa", region: "Oceania", flag: "🇼🇸", hook: "Swimming holes, waterfalls, and beach fales on the sand." },
];

export function getDestinationsByRegion(region: Region): Destination[] {
  return DESTINATIONS.filter((d) => d.region === region);
}

export function getDestinationBySlug(slug: string): Destination | undefined {
  return DESTINATIONS.find((d) => d.slug === slug);
}
