export type Post = {
  slug: string;
  tag: string;
  title: string;
  excerpt: string;
  readTime: string;
  destinationSlug: string;
};

export const POSTS: Post[] = [
  {
    slug: "where-to-stay-in-dubai",
    tag: "City guide",
    title: "Where to stay in Dubai: a neighbourhood guide for your first trip",
    excerpt:
      "Dubai is a chain of districts strung along one long road. Pick the wrong end and the trip disappears into taxis -- here is how to choose.",
    readTime: "7 min read",
    destinationSlug: "united-arab-emirates",
  },
  {
    slug: "where-to-stay-in-marrakech",
    tag: "City guide",
    title: "Where to stay in Marrakech: riads, the medina and the new town",
    excerpt:
      "Inside the walls or outside them is the real decision. Here is what each part of Marrakech is like to stay in -- and what a riad actually is.",
    readTime: "7 min read",
    destinationSlug: "morocco",
  },
  {
    slug: "base-outside-amsterdam",
    tag: "Hotel tips",
    title: "Base yourself outside Amsterdam: a Dutch trip that costs less and sees more",
    excerpt:
      "Haarlem, Utrecht and Rotterdam are a short train ride from Amsterdam -- close enough to make the capital a day trip rather than the whole holiday.",
    readTime: "6 min read",
    destinationSlug: "netherlands",
  },
  {
    slug: "korea-without-a-car",
    tag: "Trip planning",
    title: "Korea without a rental car: high-speed rail, express buses and one card for everything",
    excerpt:
      "Between the KTX and a dense bus network, a car is more often a burden than a help in Korea -- with one real exception.",
    readTime: "6 min read",
    destinationSlug: "south-korea",
  },
  {
    slug: "oman-4x4-or-not",
    tag: "Trip planning",
    title: "Oman by car: where you need a 4x4, and where you really don't",
    excerpt:
      "Oman's main roads are some of the easiest in the region. Two places change that -- and one has a police checkpoint that turns ordinary cars around.",
    readTime: "6 min read",
    destinationSlug: "oman",
  },
  {
    slug: "kruger-self-drive-or-private-reserve",
    tag: "Trip planning",
    title: "Kruger: drive yourself through the national park, or pay for a private reserve?",
    excerpt:
      "Same animals, same unfenced bush -- two very different trips. What the price difference actually buys, and why most first visits should do both.",
    readTime: "7 min read",
    destinationSlug: "south-africa",
  },
  {
    slug: "48-hours-in-lisbon",
    tag: "City guide",
    title: "48 hours in Lisbon: a fast, affordable first trip to Portugal",
    excerpt:
      "Tiled hillsides, tram routes, and a flight-and-stay combo that keeps the whole weekend under budget.",
    readTime: "5 min read",
    destinationSlug: "portugal",
  },
  {
    slug: "switzerland-by-train",
    tag: "Trip planning",
    title: "Switzerland by train: skipping the rental car without missing a thing",
    excerpt:
      "Alpine routes and lake towns are easier to reach by rail than most travelers expect -- here is how to route it.",
    readTime: "6 min read",
    destinationSlug: "switzerland",
  },
  {
    slug: "qatar-layover",
    tag: "Airport services",
    title: "Why a Doha layover might be the smartest stop on your itinerary",
    excerpt:
      "Turn a long connection into a proper stopover with airport transfers and lounge access booked in advance.",
    readTime: "4 min read",
    destinationSlug: "qatar",
  },
  {
    slug: "sri-lanka-two-weeks",
    tag: "Destination spotlight",
    title: "Sri Lanka in two weeks: hill country, coast, and everything between",
    excerpt:
      "A compact loop that covers tea country, the southern coastline, and wildlife parks without doubling back.",
    readTime: "7 min read",
    destinationSlug: "sri-lanka",
  },
  {
    slug: "southwest-road-trip",
    tag: "Car rentals",
    title: "Road-tripping the American Southwest: national parks worth the detour",
    excerpt: "A rental-car route through canyon country, with the stops most itineraries skip.",
    readTime: "6 min read",
    destinationSlug: "united-states",
  },
  {
    slug: "new-zealand-south-island",
    tag: "Tours & activities",
    title: "New Zealand's South Island: a slow-travel itinerary",
    excerpt:
      "Fjords, glaciers, and drives built for stopping often -- paced for two weeks, not two hundred photos.",
    readTime: "6 min read",
    destinationSlug: "new-zealand",
  },
  {
    slug: "kenya-safari-basics",
    tag: "Tours & activities",
    title: "Kenya safari basics: what first-timers actually need to know",
    excerpt: "Park permits, timing, and how to book a safari and coastal add-on in the same trip.",
    readTime: "5 min read",
    destinationSlug: "kenya",
  },
  {
    slug: "vietnam-esim-vs-sim",
    tag: "SIM & eSIM",
    title: "Staying connected in Vietnam: eSIM vs. local SIM for travelers",
    excerpt: "What actually works for data on a north-to-south route, and when a physical SIM still wins.",
    readTime: "4 min read",
    destinationSlug: "vietnam",
  },
  {
    slug: "best-time-to-book-a-flight",
    tag: "Flying tips",
    title: "When to actually book: the flight-price myths worth ignoring",
    excerpt:
      "Tuesday deals and 21-day rules don't hold up the way they used to -- what actually moves the price, and when to stop waiting.",
    readTime: "5 min read",
    destinationSlug: "italy",
  },
  {
    slug: "long-haul-flight-survival",
    tag: "Flying tips",
    title: "Long-haul without the jet lag spiral: a realistic in-flight routine",
    excerpt: "Sleep timing, hydration, and the seat choices that actually matter on a long overnight sector.",
    readTime: "5 min read",
    destinationSlug: "new-zealand",
  },
  {
    slug: "packing-carry-on-only",
    tag: "Flying tips",
    title: "Carry-on only: the packing method that skips baggage claim entirely",
    excerpt: "A repeatable system for a week or two abroad without checking a bag, no matter the airline's size chart.",
    readTime: "4 min read",
    destinationSlug: "vietnam",
  },
  {
    slug: "hotel-room-upgrade-tips",
    tag: "Hotel tips",
    title: "How a free room upgrade actually happens at check-in",
    excerpt: "It's rarely about being polite -- loyalty status, timing, and what you book in the first place matter more.",
    readTime: "4 min read",
    destinationSlug: "portugal",
  },
  {
    slug: "boutique-vs-resort",
    tag: "Hotel tips",
    title: "Boutique hotel or full resort: how to actually decide",
    excerpt: "Neighborhood access versus on-site everything -- the tradeoff that matters more than the star rating.",
    readTime: "5 min read",
    destinationSlug: "switzerland",
  },
  {
    slug: "free-cancellation-fine-print",
    tag: "Hotel tips",
    title: "What 'free cancellation' really means before you book",
    excerpt: "The deadline, the time zone it runs on, and the rate types that quietly don't qualify.",
    readTime: "4 min read",
    destinationSlug: "italy",
  },
  {
    slug: "rental-car-damage-waiver",
    tag: "Car rentals",
    title: "What that rental car damage waiver actually covers",
    excerpt: "The counter upsell isn't always overkill -- here's when your own card cover falls short.",
    readTime: "4 min read",
    destinationSlug: "namibia",
  },
  {
    slug: "driving-on-the-other-side",
    tag: "Car rentals",
    title: "Driving on the other side of the road: a 10-minute mental checklist",
    excerpt: "The habits that actually trip people up on day one, and how to reset them before you leave the lot.",
    readTime: "4 min read",
    destinationSlug: "new-zealand",
  },
  {
    slug: "one-way-rental-fees",
    tag: "Car rentals",
    title: "One-way rentals: when the drop-off fee is actually worth it",
    excerpt: "Sometimes it beats losing a full day backtracking just to return the car where you picked it up.",
    readTime: "4 min read",
    destinationSlug: "peru",
  },
  {
    slug: "esim-vs-roaming-cost",
    tag: "SIM & eSIM",
    title: "eSIM vs. your carrier's roaming plan: the real cost difference",
    excerpt: "Roaming day-passes add up fast on a two-week trip -- here's roughly where the break-even point sits.",
    readTime: "4 min read",
    destinationSlug: "peru",
  },
  {
    slug: "esim-multi-country-trip",
    tag: "SIM & eSIM",
    title: "One eSIM, five countries: planning data for a multi-stop trip",
    excerpt: "Regional passes beat buying a new plan at every border, if you pick the right coverage map first.",
    readTime: "5 min read",
    destinationSlug: "switzerland",
  },
  {
    slug: "ebike-vs-regular-bike-rental",
    tag: "Cycling",
    title: "E-bike or regular bike: which one actually fits your route",
    excerpt: "Hills, distance, and how much of the day you want left for sightseeing instead of pedaling.",
    readTime: "4 min read",
    destinationSlug: "switzerland-cycling",
  },
  {
    slug: "cycling-city-rules-abroad",
    tag: "Cycling",
    title: "Cycling in a new city: the local rules that actually matter",
    excerpt: "Bike lanes, right-of-way, and the habits that look nothing like home.",
    readTime: "4 min read",
    destinationSlug: "vietnam",
  },
  {
    slug: "japan-rail-pass-worth-it",
    tag: "Trip planning",
    title: "Is the Japan Rail Pass still worth it? Price your route first",
    excerpt:
      "Since the 2023 price rise it loses money on a lot of ordinary itineraries. Here is how to check yours before you buy.",
    readTime: "6 min read",
    destinationSlug: "japan",
  },
  {
    slug: "thailand-which-coast-which-month",
    tag: "Trip planning",
    title: "Thailand's two coasts: which islands, and which month",
    excerpt:
      "The Andaman and the Gulf have opposite wet seasons, which is why blanket advice about the best time to visit Thailand is useless.",
    readTime: "6 min read",
    destinationSlug: "thailand",
  },
  {
    slug: "marrakech-sahara-how-long",
    tag: "Trip planning",
    title: "Marrakech to the Sahara: how long the desert trip really takes",
    excerpt:
      "It is sold as an easy add-on and it is two long driving days each way. Here is how to fit it in without wasting the rest of the week.",
    readTime: "6 min read",
    destinationSlug: "morocco",
  },
  {
    slug: "yucatan-in-a-week",
    tag: "Trip planning",
    title: "The Yucatan in a week: ruins, cenotes and one base too many",
    excerpt:
      "Most first Yucatan trips move three times and see less for it. A two-base week covers more with far less driving.",
    readTime: "6 min read",
    destinationSlug: "mexico",
  },
  {
    slug: "cappadocia-balloon-odds",
    tag: "Tours & activities",
    title: "Cappadocia balloons: what actually decides whether you fly",
    excerpt:
      "Flights are cancelled for wind far more often than people expect. Build the trip so a grounded morning is not a ruined one.",
    readTime: "5 min read",
    destinationSlug: "turkey",
  },
  {
    slug: "jordan-pass-explained",
    tag: "Trip planning",
    title: "The Jordan Pass: buy it before you fly, or pay twice",
    excerpt:
      "It bundles the visa waiver with Petra entry, and it only works if you buy it before you land. Most people find out afterwards.",
    readTime: "5 min read",
    destinationSlug: "jordan",
  },
  {
    slug: "alhambra-tickets-ahead",
    tag: "Tours & activities",
    title: "Alhambra tickets sell out months ahead — plan Granada around them",
    excerpt:
      "Entry is capped and timed, and the Nasrid Palaces slot is the one that goes first. Book before you book the hotel.",
    readTime: "5 min read",
    destinationSlug: "spain",
  },
  {
    slug: "croatia-ferries-vs-driving",
    tag: "Trip planning",
    title: "Croatia's islands: ferries, catamarans and when the car becomes a problem",
    excerpt:
      "Fast catamarans do not take cars, and that single fact decides the shape of most Dalmatian coast trips.",
    readTime: "6 min read",
    destinationSlug: "croatia",
  },
  {
    slug: "egypt-nile-cruise-or-not",
    tag: "Trip planning",
    title: "Nile cruise or stay in Luxor? An honest comparison",
    excerpt:
      "The cruise is the classic way to see Luxor and Aswan. It is not automatically the better one, and it depends on what you want from the temples.",
    readTime: "6 min read",
    destinationSlug: "egypt",
  },
  {
    slug: "bali-without-a-scooter",
    tag: "Trip planning",
    title: "Getting around Bali without a scooter",
    excerpt:
      "Scooter crashes are the most common way a Bali trip goes wrong. The alternatives are cheap, and mostly better.",
    readTime: "5 min read",
    destinationSlug: "indonesia",
  },
];

// Re-exported so blog components keep a single import, but the canonical
// list now lives in data/destinations.ts -- it was duplicated across three
// files and had already drifted out of sync.
export { PHOTO_SLUGS } from "@/data/destinations";

export const TAG_CLASSES: Record<string, string> = {
  "City guide": "blog-cat-a",
  "Trip planning": "blog-cat-b",
  "Airport services": "blog-cat-c",
  "Destination spotlight": "blog-cat-d",
  "Car rentals": "blog-cat-e",
  "Tours & activities": "blog-cat-f",
  "SIM & eSIM": "blog-cat-g",
  "Flying tips": "blog-cat-h",
  "Hotel tips": "blog-cat-i",
  Cycling: "blog-cat-j",
};

export function getPostBySlug(slug: string): Post | undefined {
  return POSTS.find((p) => p.slug === slug);
}
