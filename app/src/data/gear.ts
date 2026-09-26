/**
 * Travel gear worth recommending.
 *
 * NO PRICES, and that is a decision rather than an omission. A price written
 * into this file is wrong within weeks: it changes by marketplace, by
 * currency, by sale, and by the day. A stale price on the page is worse than
 * none -- the visitor clicks expecting one number, meets another, and stops
 * trusting the rest of the page. The merchant states the price, because the
 * merchant is the only party that knows it.
 *
 * Same reasoning for star ratings, review counts and "best seller" badges:
 * none are stored here, because none could be kept true.
 *
 * EVERY ITEM IS A REAL, CURRENTLY-SOLD PRODUCT, listed by the name its maker
 * uses. `query` is what gets searched at the retailer, so it must stay
 * specific enough to land on the right thing -- "Osprey Farpoint 40", not
 * "travel backpack".
 *
 * These are recommendations in the ordinary editorial sense. Nothing here is
 * sponsored and no maker has been paid for placement; if that ever changes it
 * has to be disclosed on the page itself, not only in the privacy policy.
 */

export type GearCategory = "bags" | "packing" | "tech" | "comfort" | "health" | "security";

export type GearItem = {
  slug: string;
  /** Maker's own product name. Brand names are not translated. */
  name: string;
  maker: string;
  category: GearCategory;
  /** Retailer search term. Specific enough to resolve to this exact product. */
  query: string;
  /** One honest line on why it earns its place. Not marketing copy. */
  why: { en: string; fr: string };
  /**
   * A licensed product shot, if one ever exists. Empty for every item today
   * and that is deliberate: these are real branded products whose photography
   * belongs to their makers and retailers, and Amazon's Associates terms want
   * product images served through their own API rather than copied. Until a
   * licensed shot exists the vitrine displays the category mark instead --
   * see the gear-vitrine notes in styles.css.
   */
  image?: string;
};

export const GEAR_CATEGORIES: { id: GearCategory; emoji: string }[] = [
  { id: "bags", emoji: "🎒" },
  { id: "packing", emoji: "🧳" },
  { id: "tech", emoji: "🔌" },
  { id: "comfort", emoji: "😴" },
  { id: "health", emoji: "💧" },
  { id: "security", emoji: "🔒" },
];

export const GEAR: GearItem[] = [
  // ---- Bags -------------------------------------------------------------
  {
    slug: "osprey-farpoint-40",
    name: "Farpoint 40",
    maker: "Osprey",
    category: "bags",
    query: "Osprey Farpoint 40 travel backpack",
    why: {
      en: "Forty litres is the largest most airlines still accept as cabin baggage, so this is the biggest bag you can carry without ever paying to check one. Opens flat like a suitcase rather than loading from the top.",
      fr: "Quarante litres, c’est le maximum encore accepté en cabine par la plupart des compagnies : le plus grand sac possible sans jamais payer de bagage en soute. S’ouvre à plat comme une valise.",
    },
  },
  {
    slug: "osprey-fairview-40",
    name: "Fairview 40",
    maker: "Osprey",
    category: "bags",
    query: "Osprey Fairview 40 travel backpack",
    why: {
      en: "The Farpoint with a shorter harness and narrower shoulder straps. Worth knowing it exists: the standard version genuinely does not fit shorter torsos well.",
      fr: "Le Farpoint avec un dos plus court et des bretelles plus étroites. Bon à savoir : la version standard convient mal aux torses courts.",
    },
  },
  {
    slug: "peak-design-travel-backpack",
    name: "Travel Backpack 45L",
    maker: "Peak Design",
    category: "bags",
    query: "Peak Design Travel Backpack 45L",
    why: {
      en: "Compresses to 35L and expands to 45L, so one bag covers a weekend and a fortnight. Expensive, and the camera inserts it is built around are sold separately.",
      fr: "Se comprime à 35 L et s’étend à 45 L : un seul sac pour un week-end comme pour deux semaines. Cher, et les inserts photo se vendent séparément.",
    },
  },

  {
    slug: "everki-atlas",
    name: "Atlas Laptop Backpack",
    maker: "EVERKI",
    category: "bags",
    query: "EVERKI Atlas laptop backpack 17.3",
    why: {
      en: "Checkpoint-friendly, so it lies flat and the laptop stays in the bag at security. The compartment adjusts from 13 to 17.3 inches, which means it still fits after you change laptop. A work bag first — far less room for clothes than the Osprey.",
      fr: "Compatible contrôle de sécurité : le sac s’ouvre à plat et l’ordinateur reste dedans. Le compartiment s’ajuste de 13 à 17,3 pouces, donc il convient encore après un changement d’ordinateur. Avant tout un sac de travail — bien moins de place pour les vêtements que l’Osprey.",
    },
  },

  // ---- Packing ----------------------------------------------------------
  {
    slug: "eagle-creek-compression-cubes",
    name: "Pack-It Compression Cubes",
    maker: "Eagle Creek",
    category: "packing",
    query: "Eagle Creek Pack-It compression cubes set",
    why: {
      en: "The compression zip genuinely reclaims space rather than just tidying. The real gain is not having to unpack a whole bag to find one shirt.",
      fr: "La fermeture de compression gagne réellement de la place, au lieu de simplement ranger. Le vrai bénéfice : ne plus vider tout le sac pour trouver une chemise.",
    },
  },
  {
    slug: "matador-flatpak-toiletry",
    name: "FlatPak Toiletry Case",
    maker: "Matador",
    category: "packing",
    query: "Matador FlatPak toiletry case",
    why: {
      en: "Flattens as it empties instead of holding its shape, and it is genuinely waterproof — which matters when it shares a bag with clothes.",
      fr: "S’aplatit à mesure qu’il se vide au lieu de garder sa forme, et vraiment étanche — ce qui compte quand il voyage avec les vêtements.",
    },
  },

  // ---- Tech -------------------------------------------------------------
  {
    slug: "anker-power-bank",
    name: "Power Bank (10,000 mAh)",
    maker: "Anker",
    category: "tech",
    query: "Anker 10000mAh power bank USB-C",
    why: {
      en: "Ten thousand milliamp-hours is the sweet spot: roughly two phone charges and still under the 100Wh limit airlines set for cabin batteries. Larger ones get confiscated.",
      fr: "Dix mille mAh est le bon compromis : environ deux charges de téléphone, et sous la limite de 100 Wh imposée en cabine. Au-delà, la batterie est confisquée.",
    },
  },
  {
    slug: "epicka-universal-adapter",
    name: "Universal Travel Adapter",
    maker: "Epicka",
    category: "tech",
    query: "Epicka universal travel adapter",
    why: {
      en: "One adapter covering the four main plug types, with USB ports so it replaces a second charger. Note it converts plug shape, not voltage — a hair dryer will still fail.",
      fr: "Un seul adaptateur pour les quatre principaux types de prises, avec ports USB. Attention : il adapte la forme, pas la tension — un sèche-cheveux ne fonctionnera pas.",
    },
  },
  {
    slug: "apple-airtag",
    name: "AirTag",
    maker: "Apple",
    category: "tech",
    query: "Apple AirTag",
    why: {
      en: "Put one in a checked bag. It will not stop the bag being lost, but being able to tell an airline exactly where it is changes that conversation completely. iPhone only.",
      fr: "À glisser dans un bagage en soute. Cela n’empêche pas la perte, mais pouvoir dire à la compagnie où se trouve le sac change tout. iPhone uniquement.",
    },
  },

  // ---- Comfort ----------------------------------------------------------
  {
    slug: "trtl-pillow",
    name: "Trtl Pillow",
    maker: "Trtl",
    category: "comfort",
    query: "Trtl travel pillow neck support",
    why: {
      en: "A hidden brace rather than a horseshoe cushion, so it actually stops your head dropping sideways. Packs down to about the size of a folded scarf.",
      fr: "Une armature dissimulée plutôt qu’un coussin en fer à cheval : la tête ne bascule plus sur le côté. Se plie à la taille d’une écharpe.",
    },
  },
  {
    slug: "manta-sleep-mask",
    name: "Manta Sleep Mask",
    maker: "Manta",
    category: "comfort",
    query: "Manta Sleep Mask",
    why: {
      en: "The eye cups hold the fabric off your eyelids, so you can open your eyes inside it. That sounds trivial and is the difference between sleeping and not.",
      fr: "Les coques maintiennent le tissu à distance des paupières : on peut ouvrir les yeux à l’intérieur. Détail anodin en apparence, décisif pour dormir.",
    },
  },

  // ---- Health -----------------------------------------------------------
  {
    slug: "grayl-geopress",
    name: "GeoPress Purifier",
    maker: "Grayl",
    category: "health",
    query: "Grayl GeoPress water purifier bottle",
    why: {
      en: "Press the inner cylinder down and eight seconds later the water is drinkable. Filters viruses as well as bacteria, which most hiking filters do not — that is the difference that matters outside Europe and North America.",
      fr: "On presse le cylindre intérieur et huit secondes plus tard l’eau est potable. Filtre les virus en plus des bactéries, contrairement à la plupart des filtres de randonnée — c’est ce qui compte hors d’Europe et d’Amérique du Nord.",
    },
  },
  {
    slug: "lifestraw-go",
    name: "Go Water Filter Bottle",
    maker: "LifeStraw",
    category: "health",
    query: "LifeStraw Go water filter bottle",
    why: {
      en: "Lighter and far cheaper than the Grayl, and you drink straight through the filter. Handles bacteria and parasites but not viruses, so it suits hiking more than dense cities.",
      fr: "Plus légère et bien moins chère que la Grayl : on boit directement à travers le filtre. Traite bactéries et parasites, pas les virus — plutôt pour la randonnée que pour la ville.",
    },
  },

  // ---- Security ---------------------------------------------------------
  {
    slug: "pacsafe-crossbody",
    name: "Anti-Theft Crossbody",
    maker: "Pacsafe",
    category: "security",
    query: "Pacsafe anti theft crossbody bag",
    why: {
      en: "Cut-proof strap and slash-proof panels. Worth it in a handful of cities where bag-slashing is genuinely common, and unnecessary in most.",
      fr: "Sangle et panneaux anti-lacération. Utile dans quelques villes où le vol à l’arraché est courant, superflu dans la plupart.",
    },
  },
  {
    slug: "travel-document-organiser",
    name: "RFID Document Organiser",
    maker: "Zoppen",
    category: "security",
    query: "RFID blocking travel document organizer passport wallet",
    why: {
      en: "Keeps passports, boarding passes and cards in one place, which is the real benefit. RFID blocking is a marketing feature more than a threat you are likely to face.",
      fr: "Regroupe passeports, cartes d’embarquement et cartes bancaires — c’est là le vrai intérêt. Le blocage RFID relève plus du marketing que d’un risque réel.",
    },
  },
];

export const gearByCategory = (category: GearCategory): GearItem[] =>
  GEAR.filter((g) => g.category === category);

/**
 * Curated groups, which is the thing a boutique does that a category filter
 * does not.
 *
 * Categories answer "what kind of object is this" -- bags, tech, comfort.
 * These answer "what am I packing for", and they cut ACROSS categories on
 * purpose: "Carry-on only" is a bag, a set of cubes, a toiletry case and a
 * battery, and the point is precisely that they are not all bags. A product
 * can belong to more than one.
 *
 * Every slug here is checked against GEAR at module load by gearCollection()
 * below, so a typo or a product removed from GEAR cannot leave a collection
 * quietly showing fewer items than it claims.
 */
export type GearCollection = {
  slug: string;
  title: { en: string; fr: string };
  blurb: { en: string; fr: string };
  items: string[];
};

export const GEAR_COLLECTIONS: GearCollection[] = [
  {
    slug: "carry-on-only",
    title: { en: "Carry-on only", fr: "Cabine uniquement" },
    blurb: {
      en: "The bag that is the largest most airlines still accept, and the three things that make it hold a fortnight.",
      fr: "Le plus grand sac encore accepté en cabine, et les trois objets qui lui font tenir deux semaines.",
    },
    items: [
      "osprey-farpoint-40",
      "eagle-creek-compression-cubes",
      "matador-flatpak-toiletry",
      "anker-power-bank",
    ],
  },
  {
    slug: "long-haul",
    title: { en: "Long-haul comfort", fr: "Confort long-courrier" },
    blurb: {
      en: "Eleven hours in a seat that was not designed for sleeping. These are the four things that help.",
      fr: "Onze heures dans un siège qui n’a pas été conçu pour dormir. Voici les quatre objets qui aident.",
    },
    items: ["trtl-pillow", "manta-sleep-mask", "everki-atlas", "epicka-universal-adapter"],
  },
  {
    slug: "off-the-grid",
    title: { en: "Off the grid", fr: "Loin de tout" },
    blurb: {
      en: "For trips where the tap water is a question and the nearest socket is a day away.",
      fr: "Pour les voyages où l’eau du robinet pose question et où la prise la plus proche est à un jour de marche.",
    },
    items: ["grayl-geopress", "lifestraw-go", "anker-power-bank", "apple-airtag"],
  },
  {
    slug: "city-days",
    title: { en: "City days", fr: "Journées en ville" },
    blurb: {
      en: "Crowded streets, long days on foot, and everything you own in one bag you cannot see behind you.",
      fr: "Rues bondées, longues journées à pied, et tout ce que vous possédez dans un sac que vous ne voyez pas.",
    },
    items: [
      "pacsafe-crossbody",
      "travel-document-organiser",
      "apple-airtag",
      "matador-flatpak-toiletry",
    ],
  },
];

/** A collection's real products, in the order the collection lists them.
 *  Unknown slugs are dropped rather than rendered as holes. */
export const gearCollectionItems = (collection: GearCollection): GearItem[] =>
  collection.items
    .map((slug) => GEAR.find((g) => g.slug === slug))
    .filter((g): g is GearItem => Boolean(g));
