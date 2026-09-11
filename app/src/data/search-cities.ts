import { DESTINATIONS } from "@/data/destinations";

/**
 * Main cities for each destination, for the homepage trip search.
 *
 * The search used to know only the 42 country names, so a typed city went
 * to the hotel partner raw. Hotellook now hands its searches to Booking.com,
 * whose matcher ranks some airports above their own city: a bare "Dubai"
 * landed on "Dubai International Airport" hotels. Checked live on 11 Sep
 * 2026, "Dubai, United Arab Emirates" lands on hotels in Dubai, as did every
 * other "City, Country" form tried (Abu Dhabi, Cancun, Cape Town,
 * Queenstown, Istanbul). So a known city always goes out with its country.
 *
 * That also settles names other places share -- Kingston, Salvador,
 * Trinidad, Perth, the Dead Sea -- in favour of the destination this site
 * covers. A name shared by two of OUR destinations is left out rather than
 * guessed: Sainte-Anne is in both Martinique and Guadeloupe.
 *
 * Keys are destination slugs. A key that doesn't match one is skipped, so a
 * typo silently drops that country's cities -- keep them in step.
 */

type Dest = (typeof DESTINATIONS)[number];

const CITIES: Record<string, readonly string[]> = {
  portugal: ["Lisbon", "Porto", "Faro", "Funchal"],
  switzerland: ["Zurich", "Geneva", "Lucerne", "Interlaken", "Zermatt"],
  netherlands: ["Amsterdam", "Rotterdam", "Utrecht", "The Hague"],
  croatia: ["Dubrovnik", "Split", "Zagreb", "Hvar"],
  italy: ["Rome", "Florence", "Venice", "Milan", "Naples", "Amalfi"],
  spain: ["Barcelona", "Madrid", "Seville", "Malaga", "Granada", "Palma de Mallorca", "Ibiza"],
  vietnam: ["Hanoi", "Ho Chi Minh City", "Da Nang", "Hoi An"],
  "south-korea": ["Seoul", "Busan", "Jeju"],
  "sri-lanka": ["Colombo", "Kandy", "Galle", "Ella"],
  japan: ["Tokyo", "Kyoto", "Osaka", "Hiroshima", "Sapporo"],
  thailand: ["Bangkok", "Phuket", "Chiang Mai", "Krabi", "Koh Samui"],
  indonesia: ["Bali", "Ubud", "Seminyak", "Jakarta", "Yogyakarta", "Lombok"],
  "united-states": ["New York", "Los Angeles", "San Francisco", "Las Vegas", "Miami", "Orlando", "Chicago", "Honolulu"],
  canada: ["Toronto", "Vancouver", "Montreal", "Quebec City", "Banff"],
  brazil: ["Rio de Janeiro", "São Paulo", "Salvador", "Florianópolis"],
  mexico: ["Mexico City", "Cancún", "Tulum", "Playa del Carmen", "Oaxaca"],
  peru: ["Lima", "Cusco", "Arequipa"],
  argentina: ["Buenos Aires", "Mendoza", "El Calafate", "Bariloche", "Ushuaia"],
  martinique: ["Fort-de-France", "Les Trois-Îlets", "Le Diamant"],
  guadeloupe: ["Pointe-à-Pitre", "Le Gosier", "Deshaies", "Saint-François"],
  cuba: ["Havana", "Varadero", "Trinidad", "Viñales"],
  "dominican-republic": ["Punta Cana", "Santo Domingo", "Puerto Plata", "Samaná"],
  jamaica: ["Montego Bay", "Negril", "Ocho Rios", "Kingston"],
  bahamas: ["Nassau", "Paradise Island", "Exuma", "Eleuthera"],
  egypt: ["Cairo", "Luxor", "Aswan", "Hurghada", "Sharm El Sheikh"],
  "south-africa": ["Cape Town", "Johannesburg", "Durban", "Stellenbosch"],
  kenya: ["Nairobi", "Mombasa", "Diani Beach", "Lamu"],
  namibia: ["Windhoek", "Swakopmund"],
  morocco: ["Marrakech", "Fes", "Casablanca", "Chefchaouen", "Essaouira", "Tangier"],
  tanzania: ["Zanzibar", "Stone Town", "Arusha", "Dar es Salaam"],
  jordan: ["Amman", "Petra", "Aqaba", "Wadi Rum", "Dead Sea"],
  oman: ["Muscat", "Salalah", "Nizwa"],
  qatar: ["Doha"],
  "united-arab-emirates": ["Dubai", "Abu Dhabi", "Sharjah", "Ras Al Khaimah"],
  "saudi-arabia": ["Riyadh", "Jeddah", "AlUla"],
  turkey: ["Istanbul", "Antalya", "Cappadocia", "Bodrum", "Izmir"],
  australia: ["Sydney", "Melbourne", "Brisbane", "Gold Coast", "Cairns", "Perth"],
  "new-zealand": ["Auckland", "Queenstown", "Wellington", "Christchurch", "Rotorua"],
  fiji: ["Nadi", "Denarau Island", "Suva"],
  "french-polynesia": ["Tahiti", "Papeete", "Bora Bora", "Moorea"],
  "new-caledonia": ["Nouméa", "Île des Pins"],
  samoa: ["Apia", "Upolu", "Savai'i"],
};

/** Other spellings people type, mapped to a canonical name above. Compared
 *  after norm(), so accents, case and hyphens never need listing here. */
const CITY_ALIASES: Record<string, string> = {
  saigon: "Ho Chi Minh City",
  hcmc: "Ho Chi Minh City",
  marrakesh: "Marrakech",
  fez: "Fes",
  nyc: "New York",
  "new york city": "New York",
  rio: "Rio de Janeiro",
  cdmx: "Mexico City",
  cuzco: "Cusco",
  quebec: "Quebec City",
  goreme: "Cappadocia",
  denpasar: "Bali",
  "al ula": "AlUla",
  "zanzibar city": "Stone Town",
};

/** Country names people type that differ from ours, mapped to a slug. */
const COUNTRY_ALIASES: Record<string, string> = {
  turkey: "turkey",
  uae: "united-arab-emirates",
  emirates: "united-arab-emirates",
  usa: "united-states",
  us: "united-states",
  "united states of america": "united-states",
  america: "united-states",
  korea: "south-korea",
  holland: "netherlands",
  "the netherlands": "netherlands",
  "the bahamas": "bahamas",
};

/** Case-, accent- and punctuation-insensitive key: "Cancún" and "cancun"
 *  meet, "Fort-de-France" and "fort de france" meet, "Savai'i" and "savaii"
 *  meet, and a trailing comma mid-typing ("Dubai,") is ignored. */
function norm(s: string): string {
  return s
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/['’]/g, "")
    .replace(/[-\s]+/g, " ")
    .trim()
    .replace(/,+$/, "")
    .trim();
}

const BY_SLUG = new Map<string, Dest>(DESTINATIONS.map((d) => [d.slug, d]));

type CityEntry = { city: string; dest: Dest; label: string; key: string };

const CITY_ENTRIES: CityEntry[] = Object.entries(CITIES).flatMap(([slug, cities]) => {
  const dest = BY_SLUG.get(slug);
  if (!dest) return [];
  return cities.map((city) => ({ city, dest, label: `${city}, ${dest.name}`, key: norm(city) }));
});

const COUNTRY_BY_KEY = new Map<string, Dest>();
for (const d of DESTINATIONS) COUNTRY_BY_KEY.set(norm(d.name), d);
for (const [alias, slug] of Object.entries(COUNTRY_ALIASES)) {
  const d = BY_SLUG.get(slug);
  if (d && !COUNTRY_BY_KEY.has(norm(alias))) COUNTRY_BY_KEY.set(norm(alias), d);
}

// Bare city, "City, Country" (what the datalist fills in), and aliases.
const CITY_BY_KEY = new Map<string, CityEntry>();
for (const c of CITY_ENTRIES) {
  if (!CITY_BY_KEY.has(c.key)) CITY_BY_KEY.set(c.key, c);
  CITY_BY_KEY.set(norm(c.label), c);
}
for (const [alias, canonical] of Object.entries(CITY_ALIASES)) {
  const c = CITY_ENTRIES.find((e) => e.city === canonical);
  if (c && !CITY_BY_KEY.has(norm(alias))) CITY_BY_KEY.set(norm(alias), c);
}

/** Datalist suggestions: each country, followed by its cities. */
export const SEARCH_OPTIONS: string[] = DESTINATIONS.flatMap((d) => [
  d.name,
  ...CITY_ENTRIES.filter((c) => c.dest === d).map((c) => c.label),
]);

export type ResolvedPlace = {
  /** The destination it belongs to -- drives the eSIM link and the guide link. */
  destination: Dest | null;
  /** Sent to Hotellook: "City, Country" for a known city. */
  hotelsQuery: string;
  /** Sent to GetYourGuide's text search, where the bare city reads best. */
  toursQuery: string;
  /** Shown in the note under the search box. */
  label: string;
};

function forCountry(d: Dest): ResolvedPlace {
  return { destination: d, hotelsQuery: d.name, toursQuery: d.name, label: d.name };
}

function forCity(c: CityEntry): ResolvedPlace {
  return { destination: c.dest, hotelsQuery: c.label, toursQuery: c.city, label: c.label };
}

/**
 * Exact matches before prefixes, and countries before cities within each:
 * an exact "Porto" reaches the city while "port" still reaches Portugal, and
 * an exact "Jordan" is never beaten by a longer prefix. City prefixes need
 * three letters, so "la" doesn't jump to whichever city happens to start
 * with it. Anything unrecognised goes out exactly as typed, as before.
 */
export function resolvePlace(raw: string): ResolvedPlace | null {
  const text = raw.trim();
  const q = norm(text);
  if (!q) return null;
  const country = COUNTRY_BY_KEY.get(q);
  if (country) return forCountry(country);
  const city = CITY_BY_KEY.get(q);
  if (city) return forCity(city);
  const countryPrefix = DESTINATIONS.find((d) => norm(d.name).startsWith(q));
  if (countryPrefix) return forCountry(countryPrefix);
  if (q.length >= 3) {
    const cityPrefix = CITY_ENTRIES.find((c) => c.key.startsWith(q));
    if (cityPrefix) return forCity(cityPrefix);
  }
  return { destination: null, hotelsQuery: text, toursQuery: text, label: text };
}
