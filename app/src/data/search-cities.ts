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

/** A city is either a bare name, or a name with the IATA code of the
 *  airport that serves it. The code is what lets the flights search open on
 *  real results instead of a blank form.
 *
 *  Codes come from Travelpayouts' own city dataset
 *  (api.travelpayouts.com/data/en/cities.json), matched on name WITHIN the
 *  destination's country -- derived from the flag emoji, which is literally
 *  the ISO code. That constraint is not decoration: unconstrained, "Paris"
 *  resolves to PHT in Texas and "AlUla" to ALU in Somalia, neither of which
 *  is where the visitor is going. Only entries with a flightable airport get
 *  a code; Kyoto, Banff, Utrecht and the rest are matched but have no
 *  commercial airport, so they keep the blank search rather than send
 *  someone to the wrong place.
 *
 *  131 of 179 cities carry a code. The other 48 are not a defect -- a
 *  working blank search beats a confident wrong answer. */
type CityDef = string | { city: string; iata: string };

const CITIES: Record<string, readonly CityDef[]> = {
  portugal: [
    { city: "Lisbon", iata: "LIS" },
    { city: "Porto", iata: "OPO" },
    { city: "Faro", iata: "FAO" },
    { city: "Funchal", iata: "FNC" },
  ],
  switzerland: [
    { city: "Zurich", iata: "ZRH" },
    { city: "Geneva", iata: "GVA" },
    "Lucerne",
    "Interlaken",
    "Zermatt",
  ],
  netherlands: [{ city: "Amsterdam", iata: "AMS" }, { city: "Rotterdam", iata: "RTM" }, "Utrecht", "The Hague"],
  croatia: [
    { city: "Dubrovnik", iata: "DBV" },
    { city: "Split", iata: "SPU" },
    { city: "Zagreb", iata: "ZAG" },
    "Hvar",
  ],
  italy: [
    { city: "Rome", iata: "ROM" },
    { city: "Florence", iata: "FLR" },
    { city: "Venice", iata: "VCE" },
    { city: "Milan", iata: "MIL" },
    { city: "Naples", iata: "NAP" },
    "Amalfi",
  ],
  spain: [
    { city: "Barcelona", iata: "BCN" },
    { city: "Madrid", iata: "MAD" },
    "Seville",
    { city: "Malaga", iata: "AGP" },
    { city: "Granada", iata: "GRX" },
    "Palma de Mallorca",
    { city: "Ibiza", iata: "IBZ" },
  ],
  vietnam: [
    { city: "Hanoi", iata: "HAN" },
    { city: "Ho Chi Minh City", iata: "SGN" },
    { city: "Da Nang", iata: "DAD" },
    "Hoi An",
  ],
  "south-korea": [{ city: "Seoul", iata: "SEL" }, { city: "Busan", iata: "PUS" }, { city: "Jeju", iata: "CJU" }],
  "sri-lanka": [{ city: "Colombo", iata: "CMB" }, { city: "Kandy", iata: "KDZ" }, "Galle", "Ella"],
  japan: [
    { city: "Tokyo", iata: "TYO" },
    "Kyoto",
    { city: "Osaka", iata: "OSA" },
    { city: "Hiroshima", iata: "HIJ" },
    { city: "Sapporo", iata: "SPK" },
  ],
  thailand: [
    { city: "Bangkok", iata: "BKK" },
    { city: "Phuket", iata: "HKT" },
    { city: "Chiang Mai", iata: "CNX" },
    { city: "Krabi", iata: "KBV" },
    { city: "Koh Samui", iata: "USM" },
  ],
  indonesia: [
    "Bali",
    "Ubud",
    "Seminyak",
    { city: "Jakarta", iata: "JKT" },
    { city: "Yogyakarta", iata: "JOG" },
    "Lombok",
  ],
  "united-states": [
    { city: "New York", iata: "NYC" },
    { city: "Los Angeles", iata: "LAX" },
    { city: "San Francisco", iata: "SFO" },
    { city: "Las Vegas", iata: "LAS" },
    { city: "Miami", iata: "MIA" },
    { city: "Orlando", iata: "ORL" },
    { city: "Chicago", iata: "CHI" },
    { city: "Honolulu", iata: "HNL" },
  ],
  canada: [
    { city: "Toronto", iata: "YTO" },
    { city: "Vancouver", iata: "YVR" },
    { city: "Montreal", iata: "YMQ" },
    "Quebec City",
    "Banff",
  ],
  brazil: [
    { city: "Rio de Janeiro", iata: "RIO" },
    { city: "São Paulo", iata: "SAO" },
    { city: "Salvador", iata: "SSA" },
    { city: "Florianópolis", iata: "FLN" },
  ],
  mexico: [
    { city: "Mexico City", iata: "MEX" },
    { city: "Cancún", iata: "CUN" },
    { city: "Tulum", iata: "TQO" },
    "Playa del Carmen",
    { city: "Oaxaca", iata: "OAX" },
  ],
  peru: [
    { city: "Lima", iata: "LIM" },
    { city: "Cusco", iata: "CUZ" },
    { city: "Arequipa", iata: "AQP" },
  ],
  argentina: [
    { city: "Buenos Aires", iata: "BUE" },
    { city: "Mendoza", iata: "MDZ" },
    { city: "El Calafate", iata: "FTE" },
    "Bariloche",
    { city: "Ushuaia", iata: "USH" },
  ],
  martinique: [{ city: "Fort-de-France", iata: "FDF" }, "Les Trois-Îlets", "Le Diamant"],
  guadeloupe: [{ city: "Pointe-à-Pitre", iata: "PTP" }, "Le Gosier", "Deshaies", "Saint-François"],
  cuba: [{ city: "Havana", iata: "HAV" }, { city: "Varadero", iata: "VRA" }, "Trinidad", "Viñales"],
  "dominican-republic": [
    { city: "Punta Cana", iata: "PUJ" },
    { city: "Santo Domingo", iata: "SDQ" },
    { city: "Puerto Plata", iata: "POP" },
    "Samaná",
  ],
  jamaica: [
    { city: "Montego Bay", iata: "MBJ" },
    "Negril",
    { city: "Ocho Rios", iata: "OCJ" },
    { city: "Kingston", iata: "KIN" },
  ],
  bahamas: [{ city: "Nassau", iata: "NAS" }, "Paradise Island", "Exuma", "Eleuthera"],
  egypt: [
    { city: "Cairo", iata: "CAI" },
    { city: "Luxor", iata: "LXR" },
    { city: "Aswan", iata: "ASW" },
    { city: "Hurghada", iata: "HRG" },
    { city: "Sharm El Sheikh", iata: "SSH" },
  ],
  "south-africa": [
    { city: "Cape Town", iata: "CPT" },
    { city: "Johannesburg", iata: "JNB" },
    { city: "Durban", iata: "DUR" },
    "Stellenbosch",
  ],
  kenya: [
    { city: "Nairobi", iata: "NBO" },
    { city: "Mombasa", iata: "MBA" },
    "Diani Beach",
    { city: "Lamu", iata: "LAU" },
  ],
  namibia: [{ city: "Windhoek", iata: "WDH" }, "Swakopmund"],
  morocco: [
    { city: "Marrakech", iata: "RAK" },
    "Fes",
    { city: "Casablanca", iata: "CMN" },
    "Chefchaouen",
    { city: "Essaouira", iata: "ESU" },
    { city: "Tangier", iata: "TNG" },
  ],
  tanzania: [
    { city: "Zanzibar", iata: "ZNZ" },
    "Stone Town",
    { city: "Arusha", iata: "ARK" },
    { city: "Dar es Salaam", iata: "DAR" },
  ],
  jordan: [{ city: "Amman", iata: "AMM" }, "Petra", { city: "Aqaba", iata: "AQJ" }, "Wadi Rum", "Dead Sea"],
  oman: [{ city: "Muscat", iata: "MCT" }, { city: "Salalah", iata: "SLL" }, "Nizwa"],
  qatar: [{ city: "Doha", iata: "DOH" }],
  "united-arab-emirates": [
    { city: "Dubai", iata: "DXB" },
    { city: "Abu Dhabi", iata: "AUH" },
    { city: "Sharjah", iata: "SHJ" },
    { city: "Ras Al Khaimah", iata: "RKT" },
  ],
  "saudi-arabia": [
    { city: "Riyadh", iata: "RUH" },
    { city: "Jeddah", iata: "JED" },
    { city: "AlUla", iata: "ULH" },
  ],
  turkey: [
    { city: "Istanbul", iata: "IST" },
    { city: "Antalya", iata: "AYT" },
    "Cappadocia",
    { city: "Bodrum", iata: "BJV" },
    { city: "Izmir", iata: "IZM" },
  ],
  australia: [
    { city: "Sydney", iata: "SYD" },
    { city: "Melbourne", iata: "MEL" },
    { city: "Brisbane", iata: "BNE" },
    { city: "Gold Coast", iata: "OOL" },
    { city: "Cairns", iata: "CNS" },
    { city: "Perth", iata: "PER" },
  ],
  "new-zealand": [
    { city: "Auckland", iata: "AKL" },
    { city: "Queenstown", iata: "ZQN" },
    { city: "Wellington", iata: "WLG" },
    { city: "Christchurch", iata: "CHC" },
    { city: "Rotorua", iata: "ROT" },
  ],
  fiji: [{ city: "Nadi", iata: "NAN" }, "Denarau Island", { city: "Suva", iata: "SUV" }],
  "french-polynesia": [
    "Tahiti",
    { city: "Papeete", iata: "PPT" },
    { city: "Bora Bora", iata: "BOB" },
    { city: "Moorea", iata: "MOZ" },
  ],
  "new-caledonia": [{ city: "Nouméa", iata: "NOU" }, { city: "Île des Pins", iata: "ILP" }],
  samoa: [{ city: "Apia", iata: "APW" }, "Upolu", "Savai'i"],
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

type CityEntry = { city: string; dest: Dest; label: string; key: string; iata?: string };

const CITY_ENTRIES: CityEntry[] = Object.entries(CITIES).flatMap(([slug, cities]) => {
  const dest = BY_SLUG.get(slug);
  if (!dest) return [];
  return cities.map((entry) => {
    const city = typeof entry === "string" ? entry : entry.city;
    const iata = typeof entry === "string" ? undefined : entry.iata;
    return { city, dest, label: `${city}, ${dest.name}`, key: norm(city), iata };
  });
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
  /** IATA code for the flights deep link, when the city has one. Undefined
   *  for a country (which airport would it mean?) and for cities with no
   *  commercial airport -- both keep the partner's own blank search. */
  iata?: string;
};

function forCountry(d: Dest): ResolvedPlace {
  return { destination: d, hotelsQuery: d.name, toursQuery: d.name, label: d.name };
}

function forCity(c: CityEntry): ResolvedPlace {
  return { destination: c.dest, hotelsQuery: c.label, toursQuery: c.city, label: c.label, iata: c.iata };
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
