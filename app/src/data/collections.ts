import { DESTINATIONS, type Destination } from "@/data/destinations";

/**
 * Travel collections -- themed groupings of the destination catalogue.
 *
 * Each destination sits in two to four collections on purpose: that is what
 * makes these pages useful for internal linking without any of them becoming
 * a near-duplicate of another. A destination that belonged to exactly one
 * collection would just be a slower route to the same page.
 *
 * The intros are written per collection rather than templated. Ten pages
 * built from one sentence pattern with the nouns swapped is the classic way
 * to get a set of thin pages ignored by search engines -- each one here has
 * to earn its place by saying something only true of that theme.
 */

export type Collection = {
  slug: string;
  name: string;
  /** Shown in the eyebrow and card. */
  tagline: string;
  icon: string;
  /** 150-250 words. The page's reason to exist. */
  intro: string[];
  /** What this collection is good for, as scannable points. */
  highlights: string[];
  destinationSlugs: string[];
};

export const COLLECTIONS: Collection[] = [
  {
    slug: "city-breaks",
    name: "City breaks",
    tagline: "Three nights, one great city",
    icon: "🌍",
    intro: [
      "A city break lives or dies on how much of it you can reach on foot. The destinations here were picked for compact centres, dense public transport and enough within a short walk of a central hotel that you are never spending an hour in transit to see one thing.",
      "They also share a practical advantage: frequent, competitive flights. Lisbon, Amsterdam, Barcelona, Rome and Seoul are served by multiple carriers from most hubs, which is what keeps a two- or three-night trip worth taking at all — a long weekend does not survive an expensive or awkward flight.",
      "If you have never done one, the format is simple. Fly in on a Thursday evening, stay somewhere central rather than cheap-but-distant, pick two neighbourhoods rather than ten sights, and fly home Sunday. The cities below all reward that pace instead of punishing it.",
    ],
    highlights: [
      "Walkable centres — most of what you came for within 30 minutes on foot",
      "Frequent flights from multiple carriers, so fares stay competitive",
      "Strong rail links if you want to add a second city to the same trip",
    ],
    destinationSlugs: [
      "portugal",
      "netherlands",
      "spain",
      "italy",
      "croatia",
      "south-korea",
      "japan",
      "turkey",
    ],
  },
  {
    slug: "beach-destinations",
    name: "Beach destinations",
    tagline: "Coastline worth the flight",
    icon: "🏖️",
    intro: [
      "Every country has a coast. These have coastline worth crossing the world for — and, just as importantly, the infrastructure to reach it without losing two days to connections.",
      "The list splits into two kinds of trip. The South Pacific — Fiji, French Polynesia, New Caledonia, Samoa — is where you go when the water itself is the destination: lagoons, reefs, and islands small enough to circle in an afternoon. The second kind pairs a beach with something else entirely: Croatia's islands sit beside walled medieval towns, Mexico's Caribbean coast beside Mayan ruins, Thailand's beaches an hour's flight from Bangkok.",
      "Which you want depends on an honest question: do you want to do nothing, or do you want a beach to come back to at the end of each day? The first group answers the first question better; the second group is far better value for the second.",
      "Season matters more here than anywhere else in the catalogue. Cyclone and monsoon windows are real and they are worth planning around rather than gambling on.",
    ],
    highlights: [
      "Pacific lagoons where the water is the whole point",
      "Coast-plus-culture pairings if doing nothing is not your holiday",
      "Season windows worth checking before you book anything",
    ],
    destinationSlugs: [
      "fiji",
      "french-polynesia",
      "new-caledonia",
      "samoa",
      "croatia",
      "mexico",
      "thailand",
      "indonesia",
      "brazil",
      "martinique",
      "guadeloupe",
      "dominican-republic",
      "jamaica",
      "bahamas",
    ],
  },
  {
    slug: "luxury-travel",
    name: "Luxury travel",
    tagline: "Where the upgrade is worth it",
    icon: "💎",
    intro: [
      "Luxury travel is often just a more expensive version of the same trip. These destinations are the ones where paying more genuinely buys something different rather than the same view from a better chair.",
      "In the Gulf — Qatar, the UAE, Oman — the difference is service and infrastructure: airports built as destinations, hotels operating at a standard that would be a flagship anywhere else, and desert or mountain excursions an hour from the city. In the South Pacific it is exclusivity in the literal sense: overwater accommodation on lagoons with a handful of other guests.",
      "Switzerland and Japan belong here for a third reason. Neither is cheap, but in both the premium buys precision — trains that arrive to the second, service that anticipates rather than responds, and a standard of maintenance that quietly removes friction from the whole trip.",
      "One practical note: in this bracket the flight matters as much as the hotel. A long-haul in a flat bed changes the first day of the trip entirely, and on these routes that upgrade is often the highest-value part of the budget.",
    ],
    highlights: [
      "Gulf hubs where the airport itself is part of the experience",
      "Overwater stays on genuinely quiet lagoons",
      "Routes where the cabin upgrade buys back your first day",
    ],
    destinationSlugs: [
      "qatar",
      "united-arab-emirates",
      "oman",
      "french-polynesia",
      "fiji",
      "switzerland",
      "japan",
      "bahamas",
    ],
  },
  {
    slug: "family-travel",
    name: "Family travel",
    tagline: "Trips that work with children",
    icon: "👨‍👩‍👧",
    intro: [
      "Family travel has a different definition of a good destination. Spectacular matters less than practical: short transfers, safe tap water, healthcare you can reach, food a child will actually eat, and enough variety that nobody is bored on day four.",
      "The countries here score well on all of it. Australia and New Zealand are built for road trips with children — short driving legs, campsites and motels geared to families, and beaches and wildlife that need no explaining. Canada and the Netherlands add excellent public transport, which removes the car-seat problem entirely.",
      "Japan deserves a specific mention. It is often assumed to be difficult with children and is close to the opposite: exceptionally safe, immaculate public transport, family bathing culture, and food that is far more child-friendly than its reputation suggests.",
      "The single biggest lever is not the destination but the pace. Two bases over ten days beats five bases every time — the packing and moving is what exhausts everyone, not the sightseeing.",
    ],
    highlights: [
      "Short transfers and reliable public transport over long drives",
      "Two bases in ten days, not five — the moving is what tires everyone",
      "Destinations where safety and healthcare are simply not a worry",
    ],
    destinationSlugs: [
      "australia",
      "new-zealand",
      "canada",
      "netherlands",
      "japan",
      "united-arab-emirates",
      "portugal",
      "dominican-republic",
      "bahamas",
    ],
  },
  {
    slug: "honeymoon-destinations",
    name: "Honeymoon & romantic escapes",
    tagline: "Somewhere quiet, and properly good",
    icon: "❤️",
    intro: [
      "The best honeymoon destinations have one thing in common, and it is not scenery — it is low friction. After a wedding, the last thing worth doing is a trip with four internal flights and a tight itinerary.",
      "The South Pacific islands here are the strongest version of that: fly in, transfer once, and stay put. French Polynesia and New Caledonia are the quietest of the group; Fiji is the easiest to reach and the best value; Samoa is the least developed and the most interesting if you would rather not be on a resort.",
      "Italy and Croatia are the alternative for couples who would be restless doing nothing. Both let you combine a few days of coast with a city, and both are close enough to home that jet lag does not eat the first three days.",
      "Whatever you pick, book the flights in a cabin you will actually rest in, and give yourselves a buffer day at the start. Arriving exhausted is the most common and most avoidable way to lose the beginning of a honeymoon.",
    ],
    highlights: [
      "Fly in, transfer once, stay put — low friction beats a packed itinerary",
      "Quiet Pacific lagoons, or coast-plus-city if doing nothing is not for you",
      "Build in a buffer day so jet lag does not take the first three",
    ],
    destinationSlugs: [
      "french-polynesia",
      "new-caledonia",
      "fiji",
      "samoa",
      "italy",
      "croatia",
      "martinique",
      "guadeloupe",
      "bahamas",
    ],
  },
  {
    slug: "food-and-culture",
    name: "Food & culture",
    tagline: "Where the meal is the reason",
    icon: "🍜",
    intro: [
      "Some trips are planned around what you will see. These are planned around what you will eat — and in every country here, the food is not a highlight of the culture, it is the clearest expression of it.",
      "The strongest advice for all of them is the same, and most travellers ignore it: eat where the queue is local and the menu is short. Vietnam, Thailand, Mexico and Türkiye all have world-class street food that costs a fraction of restaurant prices and is frequently better. Italy, Spain and Japan reward the opposite discipline — regional specificity. Ordering the wrong region's dish in the right city is the most common way to eat mediocre food in a country famous for it.",
      "Peru is the outlier worth flagging. Lima has become a genuine culinary destination in its own right, and the ingredient diversity — coast, Andes and Amazon in one country — has no real parallel.",
      "Book the flights early and the restaurants earlier. The tables worth planning a trip around open reservations months ahead and fill the same week.",
    ],
    highlights: [
      "Street food that beats the restaurants, at a fraction of the price",
      "Regional specificity — the single biggest lever on eating well",
      "Book the notable tables months out, not on arrival",
    ],
    destinationSlugs: [
      "italy",
      "vietnam",
      "south-korea",
      "japan",
      "thailand",
      "spain",
      "mexico",
      "peru",
      "turkey",
      "argentina",
      "martinique",
      "cuba",
      "jamaica",
    ],
  },
  {
    slug: "history-and-culture",
    name: "History & culture",
    tagline: "Sites that reset your sense of scale",
    icon: "🏛️",
    intro: [
      "These destinations hold sites that are genuinely difficult to comprehend at photograph scale — and the gap between the picture and standing there is the entire reason to go.",
      "Egypt, Jordan and Peru anchor the list: the Giza plateau, Petra, and Machu Picchu are each the sort of place where the surprise is not what it looks like but how large, how old, or how improbably built it is. Türkiye and Italy offer a different density — layers of Roman, Byzantine and Ottoman history stacked in the same street rather than isolated at one site.",
      "Morocco and Saudi Arabia are the two most likely to surprise. Morocco's medinas are living cities rather than preserved ones. AlUla's rock-cut tombs in Saudi Arabia are comparable to Petra and, for now, see a fraction of the visitors.",
      "Two things make these trips work: go early in the day, and hire a guide at the major sites. Both sound obvious and both are routinely skipped. A good guide at Petra or Karnak is the difference between an impressive morning and understanding what you are looking at.",
    ],
    highlights: [
      "Sites where the scale is the surprise, not the silhouette",
      "Early mornings — the crowds and the heat arrive together",
      "A guide at the major sites is worth more than any other spend",
    ],
    destinationSlugs: [
      "egypt",
      "jordan",
      "peru",
      "italy",
      "turkey",
      "croatia",
      "morocco",
      "saudi-arabia",
      "cuba",
    ],
  },
  {
    slug: "nature-and-adventure",
    name: "Nature & adventure",
    tagline: "Landscape at full volume",
    icon: "🌿",
    intro: [
      "This is the collection where the landscape is the itinerary. In each of these countries you could see almost nothing man-made for two weeks and still have taken a remarkable trip.",
      "They divide by what you go to see. Kenya, Tanzania, South Africa and Namibia are wildlife-first — and worth understanding as a specific kind of trip, where park fees charged per person per day usually dominate the budget rather than the accommodation. New Zealand, Switzerland and Canada are terrain-first: fjords, alps and coastline reachable on well-marked trails and public transport, with none of the logistical weight of a safari.",
      "Peru and Indonesia sit between the two, offering high-altitude trekking and volcanic landscapes alongside genuine cultural depth.",
      "The recurring mistake across all of them is over-scheduling. These are places where weather cancels plans regularly, and an itinerary with no slack turns every cancelled day into a loss rather than a rest.",
    ],
    highlights: [
      "Wildlife-first trips where park fees, not hotels, drive the budget",
      "Terrain-first countries you can cross on trails and public transport",
      "Leave slack — weather cancels plans, and a packed plan has no give",
    ],
    destinationSlugs: [
      "new-zealand",
      "kenya",
      "tanzania",
      "namibia",
      "south-africa",
      "switzerland",
      "canada",
      "peru",
      "indonesia",
      "argentina",
      "guadeloupe",
    ],
  },
  {
    slug: "nightlife-destinations",
    name: "Nightlife & entertainment",
    tagline: "Cities that start late",
    icon: "🎶",
    intro: [
      "The countries here share a habit that catches visitors out: the evening starts far later than it does at home. In Spain, dinner at nine is early and a club before midnight is empty. Brazil runs later still.",
      "Beyond the hours, they differ completely. Spain is neighbourhood-led — bar to bar on foot, rather than one destination for the night. Brazil is music-first, and live rather than recorded. South Korea's nightlife is dense and vertical, stacked floor by floor in the same building, and runs comfortably until the first trains. The Netherlands is the most compact of all, and the easiest to navigate without a plan.",
      "The United States and Thailand are the two where the scene is most concentrated in specific cities rather than spread across the country, so where you base yourself matters more than in the others.",
      "The practical advice is dull but it is the advice: book accommodation within walking distance of where you intend to be at 2am. It costs more and it is cheaper than the taxis, and it is the single thing that most improves these trips.",
    ],
    highlights: [
      "Evenings that start hours later than you expect — plan the day around it",
      "Neighbourhood bar-hopping versus one-destination nights",
      "Stay within walking distance of 2am — it pays for itself in taxis",
    ],
    destinationSlugs: [
      "spain",
      "brazil",
      "south-korea",
      "netherlands",
      "united-states",
      "thailand",
      "argentina",
      "cuba",
      "jamaica",
    ],
  },
  {
    slug: "budget-travel",
    name: "Budget-friendly travel",
    tagline: "Where your money goes furthest",
    icon: "💰",
    intro: [
      "Cheap destinations and good-value destinations are not the same thing, and the difference matters. Everything here is the second: places where a modest daily budget buys a genuinely good trip rather than a compromised one.",
      "Vietnam, Sri Lanka, Thailand and Indonesia are the strongest on pure daily cost — food, transport and accommodation are all inexpensive, and the quality at the low end is far higher than the price suggests. The catch is the flight, which for most travellers is the dominant cost of the whole trip, so these reward longer stays that amortise it.",
      "Portugal, Mexico, Morocco and Egypt work the other way. None is the cheapest country in its region, but flights are shorter and more frequent, which makes a one-week trip viable in a way that a long-haul budget destination rarely is.",
      "The most effective saving on any of them is not the accommodation tier — it is travelling in shoulder season. The same trip in May or October rather than August routinely costs a third less and is, on almost every measure, more pleasant.",
    ],
    highlights: [
      "Low daily costs that reward longer stays to amortise the flight",
      "Short-haul value where a one-week trip actually makes sense",
      "Shoulder season — roughly a third cheaper and usually better",
    ],
    destinationSlugs: [
      "vietnam",
      "sri-lanka",
      "thailand",
      "indonesia",
      "portugal",
      "mexico",
      "morocco",
      "egypt",
      "cuba",
      "dominican-republic",
    ],
  },
  {
    slug: "mountain-retreats",
    name: "Mountain retreats",
    tagline: "Thin air, slow mornings",
    icon: "🏔️",
    intro: [
      "A mountain retreat is a different trip from a mountain adventure. The point is not the summit; it is waking up somewhere cool and quiet, with a view that does the work and nothing on the schedule before breakfast. These are the destinations where that is easy to arrange — where the mountains come with good places to stay in them, not just trailheads.",
      "Some are obvious. Switzerland and New Zealand's Southern Alps built their hospitality around altitude, and the lodges around Banff in the Canadian Rockies are among the best mountain stays anywhere. Others are less so. Sri Lanka's hill country is tea estates and old planters' bungalows close to two thousand metres up, a few hours from the coast. Oman's Jebel Akhdar is terraced villages and cool nights above the desert heat, and Morocco's High Atlas puts stone guesthouses within a morning's drive of Marrakech.",
      "Peru and Argentina ask more of you. Cusco sits at around 3,400 metres, so a day or two of doing very little on arrival is part of the plan rather than time lost. Patagonia's retreats are remote, and the weather decides more of the itinerary than you do.",
      "Seasons run opposite across the list: the Alps and the Rockies for summer walking or winter snow, the Andes and Patagonia in the southern summer, the Atlas and Jebel Akhdar outside the hottest months.",
    ],
    highlights: [
      "Alpine and Rockies lodges built around the view",
      "Tea-country and desert-mountain retreats most itineraries skip",
      "Altitude days built into the plan in the Andes",
      "Opposite seasons north and south of the equator",
    ],
    destinationSlugs: [
      "switzerland",
      "new-zealand",
      "canada",
      "sri-lanka",
      "oman",
      "morocco",
      "peru",
      "argentina",
    ],
  },
  {
    slug: "business-travel",
    name: "Business travel",
    tagline: "Fly in, work, fly out",
    icon: "💼",
    intro: [
      "A work trip is judged on different things. Not the view — the connection. Can you fly in nonstop, get from the terminal to a meeting without losing half a day, and sleep somewhere central enough that a cancelled flight is an inconvenience rather than a crisis? These destinations answer yes more reliably than most.",
      "The Gulf hubs are built for it. Dubai and Doha are two of the best-connected airports in the world, close enough to their business districts to schedule a meeting on the day you land, and both turn a long-haul trip into a stopover rather than an ordeal. Amsterdam does the same job for Europe: the train from the station under Schiphol reaches the city centre in about a quarter of an hour.",
      "Seoul, Istanbul and the big American cities are the other kind of business trip, where a trade fair or a head office is the reason to go and the sheer size of the place is the thing to plan around. There, where you stay matters more than the star rating — a hotel on the right metro line saves hours across a week.",
      "Riyadh and Australia's east-coast cities round out the list for anyone whose work takes them there. Entry rules for business visitors differ from tourist rules almost everywhere here, so check what your passport needs before anything is booked.",
    ],
    highlights: [
      "Gulf hubs with short airport-to-city runs and easy stopovers",
      "Amsterdam's train from the station under the terminal",
      "Big-city stays chosen by metro line, not star rating",
      "Business-visitor entry rules to check before you book",
    ],
    destinationSlugs: [
      "united-arab-emirates",
      "qatar",
      "netherlands",
      "south-korea",
      "turkey",
      "united-states",
      "saudi-arabia",
      "australia",
    ],
  },
];

export function getCollectionBySlug(slug: string): Collection | undefined {
  return COLLECTIONS.find((c) => c.slug === slug);
}

/** Resolve a collection's slugs to real destinations, dropping any that no
 * longer exist so a renamed destination can never 500 a collection page. */
export function collectionDestinations(c: Collection): Destination[] {
  return c.destinationSlugs
    .map((s) => DESTINATIONS.find((d) => d.slug === s))
    .filter((d): d is Destination => Boolean(d));
}

/** Collections a given destination belongs to -- used to cross-link from a
 * destination page back into the themed pages. */
export function collectionsForDestination(slug: string): Collection[] {
  return COLLECTIONS.filter((c) => c.destinationSlugs.includes(slug));
}

export const COLLECTION_SLUGS = COLLECTIONS.map((c) => c.slug);
