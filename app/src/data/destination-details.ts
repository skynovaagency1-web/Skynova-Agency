export type Attraction = { name: string; description: string };
export type FoodItem = { name: string; description: string };
export type Hotel = { name: string; tier: string; description: string };
export type ItineraryDay = { title: string; description: string };
export type Faq = { q: string; a: string };
export type WhyVisitCard = { title: string; description: string };

export type DestinationDetail = {
  whyChoose: string;
  whyVisit: WhyVisitCard[];
  attractions: Attraction[];
  foodIntro: string;
  dishes: FoodItem[];
  hotels: Hotel[];
  itinerary: ItineraryDay[];
  bestTime: string;
  tips: { currency: string; transport: string; safety: string; language: string };
  faqs: Faq[];
};

export const DESTINATION_DETAILS: Record<string, DestinationDetail> = {
  portugal: {
    whyChoose:
      "Portugal packs Atlantic coastline, tiled hill cities, and port-wine valleys into a country you can cross by train in an afternoon -- and flights into Lisbon are some of the best-value in Western Europe.",
    whyVisit: [
      { title: "Two capitals in one trip", description: "Lisbon's hills and Porto's riverfront are 3 hours apart by train, so you get two very different cities without a second flight." },
      { title: "Value that holds up", description: "Meals, wine, and stays run noticeably cheaper than Spain or France, without a drop in quality." },
      { title: "A coastline for every pace", description: "Surf towns in the north, cliff walks in the center, and calm beach coves in the Algarve." },
      { title: "Easy to get around", description: "A compact rail network and short drives make multi-city routes simple to self-plan." },
    ],
    attractions: [
      { name: "Belem Tower & Jeronimos Monastery", description: "Lisbon's riverside monuments from the Age of Discoveries, best visited early before the tour buses arrive." },
      { name: "Sintra's palaces", description: "A hill town of candy-colored palaces and misty forest, 40 minutes from Lisbon by train." },
      { name: "Ribeira, Porto", description: "Porto's UNESCO riverfront district, best seen from a boat crossing the Douro at sunset." },
      { name: "Douro Valley", description: "Terraced vineyards along the river where most of the world's port wine is grown." },
      { name: "Algarve sea caves", description: "Kayak or boat into the golden cliffs and grottoes around Lagos and Benagil." },
      { name: "Livraria Lello, Porto", description: "One of the world's most photographed bookstores, said to have inspired Harry Potter's staircases." },
    ],
    foodIntro: "Portuguese cooking runs on grilled fish, olive oil, and pastry -- simple ingredients treated with real care.",
    dishes: [
      { name: "Pasteis de nata", description: "Warm custard tarts with a shatter-crisp crust, best straight from the oven in Belem." },
      { name: "Bacalhau", description: "Salt cod, cooked a reputed 365 different ways depending who you ask." },
      { name: "Francesinha", description: "Porto's over-the-top sandwich, drowned in melted cheese and a beer-spiked tomato sauce." },
      { name: "Grilled sardines", description: "Charcoal-grilled and simple, a summer staple at outdoor festivals." },
    ],
    hotels: [
      { name: "Bairro Alto boutique stays", tier: "Boutique", description: "Tiled facades and rooftop bars in Lisbon's nightlife district." },
      { name: "Douro Valley quintas", tier: "Countryside", description: "Working wine estates that double as guesthouses, with vineyard views from the pool." },
      { name: "Algarve clifftop resorts", tier: "Resort", description: "Whitewashed resorts built into the cliffs above the Atlantic." },
    ],
    itinerary: [
      { title: "Day 1-2: Lisbon", description: "Walk Alfama's alleys, ride Tram 28, and day-trip to Sintra's palaces." },
      { title: "Day 3: Douro Valley", description: "Train or drive into wine country for a vineyard lunch and river views." },
      { title: "Day 4-5: Porto", description: "Cross the Dom Luis bridge, tour a port wine cellar, and eat your way through the Bolhao market." },
      { title: "Day 6-7: Algarve", description: "End on the coast -- boat the sea caves, then slow down on a beach in Lagos." },
    ],
    bestTime: "May-June and September-October bring warm days, thinner crowds, and lower prices than the July-August peak.",
    tips: {
      currency: "Euro (EUR). Cards are widely accepted; carry small cash for cafes and markets.",
      transport: "Trains link the major cities affordably; rent a car for the Algarve and Douro.",
      safety: "One of Europe's safer countries -- standard city precautions are enough.",
      language: "Portuguese; English is common in Lisbon, Porto, and tourist areas.",
    },
    faqs: [
      { q: "How many days do I need in Portugal?", a: "5-7 days covers Lisbon, Porto, and one region well; 10+ lets you add the Algarve or Azores." },
      { q: "Is Lisbon or Porto better as a base?", a: "Lisbon has more flight options; Porto is smaller and closer to the Douro. Many trips do both." },
      { q: "Do I need a car?", a: "Not for Lisbon or Porto -- trains cover the route between them. A car helps in the Algarve and wine country." },
      { q: "Is Portugal expensive?", a: "It's one of the better-value countries in Western Europe for food, wine, and mid-range stays." },
    ],
  },

  switzerland: {
    whyChoose:
      "Switzerland's trains reach places most countries would leave to hikers -- glacier passes, lake towns, and Alpine villages, all connected by a rail network built for scenery, not just speed.",
    whyVisit: [
      { title: "The trains are the attraction", description: "Panoramic routes like the Glacier Express turn transit time into the main event." },
      { title: "A hub for the region", description: "Zurich and Geneva connect easily onward into France, Italy, and Germany." },
      { title: "Lake towns worth stopping for", description: "Lucerne, Interlaken, and Montreux sit right on the water, mountains behind them." },
      { title: "Trails for every level", description: "From cable-car viewpoints to multi-day Alpine routes, all clearly marked and maintained." },
    ],
    attractions: [
      { name: "Jungfraujoch", description: "\"Top of Europe\" -- a rail station built into the ice at 3,454 meters." },
      { name: "Lake Lucerne", description: "Paddle steamers cross a lake ringed by peaks, with Mount Pilatus rising above the town." },
      { name: "Matterhorn views, Zermatt", description: "A car-free village under Switzerland's most photographed peak." },
      { name: "Chateau de Chillon", description: "A moated castle on Lake Geneva, one of the most visited historic sites in the country." },
      { name: "Rhine Falls", description: "Europe's largest waterfall, close enough to Zurich for an easy half-day trip." },
      { name: "Bern's Old Town", description: "A UNESCO-listed medieval center of arcaded streets and clock towers." },
    ],
    foodIntro: "Alpine cooking here means cheese, hearty mountain fare, and some of the best chocolate in the world.",
    dishes: [
      { name: "Cheese fondue", description: "Melted Gruyere and Vaudois, shared from one pot with crusty bread." },
      { name: "Raclette", description: "Cheese melted tableside and scraped over potatoes and pickles." },
      { name: "Rosti", description: "A crisp, pan-fried potato cake -- German-Swiss comfort food." },
      { name: "Swiss chocolate", description: "From Lindt to small-batch chocolatiers, tasting flights are common in Zurich and Geneva." },
    ],
    hotels: [
      { name: "Lucerne lakefront hotels", tier: "Classic", description: "Belle Epoque hotels with private lake views and mountain backdrops." },
      { name: "Zermatt chalets", tier: "Alpine", description: "Timber chalets at the foot of the Matterhorn, car-free village setting." },
      { name: "Geneva business stays", tier: "City", description: "Efficient, well-located hotels for a stopover or lakeside city break." },
    ],
    itinerary: [
      { title: "Day 1-2: Zurich", description: "Old Town, Lake Zurich, and a day trip to the Rhine Falls." },
      { title: "Day 3-4: Lucerne & Interlaken", description: "Lake cruises, cable cars, and a scenic rail transfer between the two." },
      { title: "Day 5: Jungfraujoch", description: "A full day riding up to the highest railway station in Europe." },
      { title: "Day 6-7: Zermatt or Geneva", description: "Close on the Matterhorn's doorstep or Lake Geneva's promenade, your call." },
    ],
    bestTime: "June-September for hiking and full mountain access; December-March for skiing. Shoulder months are quieter and cheaper.",
    tips: {
      currency: "Swiss Franc (CHF), not Euro. Cards work almost everywhere.",
      transport: "The Swiss Travel Pass covers trains, buses, and boats -- often cheaper than single tickets.",
      safety: "Extremely safe; the main risk is underestimating Alpine weather on hikes.",
      language: "German, French, and Italian by region; English is widely spoken in tourist areas.",
    },
    faqs: [
      { q: "Is Switzerland worth the price?", a: "It's expensive, but the rail scenery and trail access are hard to match anywhere else." },
      { q: "Do I need to rent a car?", a: "No -- the train network reaches nearly everywhere worth going, often more scenically." },
      { q: "What's the best base for the Alps?", a: "Interlaken or Zermatt put you closest to the classic mountain routes." },
      { q: "Can I do Switzerland as a stopover?", a: "Yes -- Zurich and Geneva both work well for a 1-2 day add-on to a longer Europe trip." },
    ],
  },

  netherlands: {
    whyChoose:
      "Amsterdam's canal rings and a flat, bike-first country make the Netherlands one of the easiest places in Europe to explore slowly -- and Schiphol keeps onward flights simple.",
    whyVisit: [
      { title: "A genuinely walkable capital", description: "Amsterdam's center is compact enough to see most of it on foot or by bike in a few days." },
      { title: "A major connecting hub", description: "Schiphol's flight network makes the Netherlands an easy add-on to a wider Europe trip." },
      { title: "Beyond the capital", description: "Delft, Utrecht, and the tulip fields are all under an hour by train." },
      { title: "A museum city", description: "The Rijksmuseum, Van Gogh Museum, and Anne Frank House sit within walking distance of each other." },
    ],
    attractions: [
      { name: "Amsterdam canal ring", description: "The UNESCO-listed 17th-century canals, best seen by boat or bike at golden hour." },
      { name: "Rijksmuseum", description: "The national collection, anchored by Rembrandt's Night Watch." },
      { name: "Anne Frank House", description: "The preserved annex where Anne Frank's diary was written -- book weeks ahead." },
      { name: "Keukenhof Gardens", description: "Seasonal tulip fields near Lisse, open March-May only." },
      { name: "Delft's old center", description: "The blue-and-white pottery town, an easy day trip by train." },
      { name: "Zaanse Schans windmills", description: "Working windmills and wooden houses just outside Amsterdam." },
    ],
    foodIntro: "Dutch food is unfussy and portable -- built for eating on a bike or by a canal.",
    dishes: [
      { name: "Stroopwafel", description: "A thin waffle cookie filled with caramel syrup, best warm off a market stall." },
      { name: "Herring", description: "Raw, lightly salted, and traditionally eaten by the tail from a street cart." },
      { name: "Bitterballen", description: "Crumbed, deep-fried meat croquettes -- a bar-snack staple." },
      { name: "Dutch cheese", description: "Gouda and Edam sold fresh at markets across Delft and Amsterdam." },
    ],
    hotels: [
      { name: "Canal-house hotels", tier: "Boutique", description: "Narrow historic buildings converted into stylish stays along the canal ring." },
      { name: "Jordaan neighborhood stays", tier: "Local", description: "Quiet, residential base close to the museums and canal district." },
      { name: "Schiphol airport hotels", tier: "Convenience", description: "Useful for early flights or a short layover stopover." },
    ],
    itinerary: [
      { title: "Day 1-2: Amsterdam museums & canals", description: "Rijksmuseum, Van Gogh Museum, and a canal cruise at sunset." },
      { title: "Day 3: Delft & The Hague", description: "Pottery workshops, old squares, and the Mauritshuis if time allows." },
      { title: "Day 4: Zaanse Schans", description: "Windmills, cheese tastings, and clog-making just north of the city." },
      { title: "Day 5: Utrecht", description: "A quieter, canal-lined university town, easy by train." },
    ],
    bestTime: "April-May for tulip season; June-August for the warmest, longest days.",
    tips: {
      currency: "Euro (EUR). Contactless is standard almost everywhere.",
      transport: "Trains and bikes cover nearly everything -- renting a car is rarely necessary.",
      safety: "Very safe; watch for cyclists when crossing streets, they have the right of way.",
      language: "Dutch; English is spoken fluently and widely.",
    },
    faqs: [
      { q: "Is Amsterdam walkable?", a: "Yes -- the center is compact, and renting a bike covers everything else." },
      { q: "Do I need to book Anne Frank House ahead?", a: "Yes, tickets release six weeks in advance and sell out quickly." },
      { q: "When are the tulip fields open?", a: "Keukenhof typically runs late March through mid-May." },
      { q: "Is the Netherlands a good stopover?", a: "Yes -- Schiphol's connections make even a 1-2 day add-on worthwhile." },
    ],
  },

  croatia: {
    whyChoose:
      "Croatia strings walled old towns along a single coastal road above the Adriatic -- island-hopping, historic centers, and beach clubs all reachable without ever leaving the coastline.",
    whyVisit: [
      { title: "A drive built for stopping", description: "The coastal road links Split, Hvar-bound ferries, and Dubrovnik in one route." },
      { title: "Islands for every mood", description: "Hvar for nightlife, Vis for quiet coves, Korcula for wine and old stone streets." },
      { title: "History you can walk into", description: "Diocletian's Palace in Split is a living neighborhood, not a roped-off ruin." },
      { title: "Clear water, easy access", description: "The Adriatic's visibility rivals Greece, with far shorter transfer times from Europe." },
    ],
    attractions: [
      { name: "Dubrovnik Old City walls", description: "Walk the full mile of medieval ramparts above the terracotta rooftops and sea." },
      { name: "Diocletian's Palace, Split", description: "A 4th-century Roman palace that's now the living center of the city." },
      { name: "Plitvice Lakes", description: "Terraced turquoise lakes and waterfalls connected by wooden walkways." },
      { name: "Hvar Town", description: "A harbor town of stone lanes, lavender fields, and rooftop bars." },
      { name: "Krka National Park", description: "Waterfalls you can swim beneath, closer to Split than Plitvice." },
      { name: "Blue Cave, Bisevo", description: "A sea cave near Vis lit electric blue by sunlight through the water." },
    ],
    foodIntro: "Coastal Croatian food leans Italian and Mediterranean -- fresh seafood, olive oil, and simple grilling.",
    dishes: [
      { name: "Peka", description: "Meat and vegetables slow-roasted under an iron bell over open coals." },
      { name: "Fresh grilled fish", description: "Whatever came in that morning, served simply with olive oil and chard." },
      { name: "Black risotto", description: "Squid-ink risotto, a Dalmatian coast staple." },
      { name: "Rakija", description: "Fruit brandy, often homemade, poured as a welcome drink." },
    ],
    hotels: [
      { name: "Dubrovnik Old City stays", tier: "Historic", description: "Stone guesthouses inside the walls, steps from the ramparts." },
      { name: "Hvar harbor hotels", tier: "Resort", description: "Waterfront rooms close to the yacht harbor and old town nightlife." },
      { name: "Split waterfront apartments", tier: "Local", description: "Riva-side stays with easy ferry access to the islands." },
    ],
    itinerary: [
      { title: "Day 1-2: Split", description: "Explore Diocletian's Palace and day-trip to Krka's waterfalls." },
      { title: "Day 3-4: Hvar & Vis", description: "Ferry out to the islands for the Blue Cave and beach clubs." },
      { title: "Day 5-6: Dubrovnik", description: "Walk the city walls, cable car up for the view, and boat to Lokrum." },
      { title: "Day 7: Plitvice Lakes", description: "A scenic detour inland before flying home." },
    ],
    bestTime: "May-June and September for warm water without the August crowds and prices.",
    tips: {
      currency: "Euro (EUR), adopted in 2023.",
      transport: "Drive or bus the coastal road; ferries link the islands.",
      safety: "Very safe -- standard coastal-tourism precautions apply.",
      language: "Croatian; English and Italian are common in tourist areas.",
    },
    faqs: [
      { q: "Split or Dubrovnik as a base?", a: "Split is more central for island-hopping; Dubrovnik has the bigger old-town draw." },
      { q: "How do I get between the islands?", a: "Regular ferries and catamarans run from Split and Dubrovnik in summer." },
      { q: "Is Croatia expensive?", a: "More than the Balkans inland, less than Italy or the French Riviera." },
      { q: "How many islands should I visit?", a: "Two or three is realistic for a week -- Hvar plus one quieter option like Vis." },
    ],
  },

  italy: {
    whyChoose:
      "Italy is worth planning a route around -- art cities, coastline, and a food culture that changes by the region, all connected by one of Europe's best train networks.",
    whyVisit: [
      { title: "A different Italy every few hours", description: "Rome, Florence, Venice, and the Amalfi Coast each feel like separate countries." },
      { title: "Food worth the detour", description: "Regional cooking varies enough that the same dish tastes different city to city." },
      { title: "Art you can't see anywhere else", description: "The Sistine Chapel, the Uffizi, and Venice's basilicas hold originals, not reproductions." },
      { title: "Fast trains between it all", description: "High-speed rail connects the major cities in under three hours each." },
    ],
    attractions: [
      { name: "Colosseum & Roman Forum", description: "Book timed entry ahead -- the ancient center of Rome, still standing." },
      { name: "Uffizi Gallery, Florence", description: "Renaissance masterworks by Botticelli, da Vinci, and Michelangelo." },
      { name: "Venice's Grand Canal", description: "Best seen by vaporetto at dawn, before the day-trip crowds arrive." },
      { name: "Amalfi Coast drive", description: "Cliffside towns like Positano and Ravello above the Tyrrhenian Sea." },
      { name: "Pompeii", description: "A Roman city frozen by Vesuvius, an easy day trip from Naples." },
      { name: "Cinque Terre", description: "Five pastel fishing villages connected by cliffside coastal trails." },
    ],
    foodIntro: "Italian food is regional to its core -- what's classic in Bologna barely appears on a menu in Sicily.",
    dishes: [
      { name: "Roman carbonara", description: "Egg, guanciale, and pecorino -- no cream, whatever anyone tells you." },
      { name: "Neapolitan pizza", description: "Wood-fired and blistered, best eaten standing in Naples where it was invented." },
      { name: "Fresh pasta, Bologna", description: "Tagliatelle al ragu from the city that gave the world bolognese." },
      { name: "Sicilian granita", description: "Icy, fruit-based, and eaten for breakfast with warm brioche." },
    ],
    hotels: [
      { name: "Rome centro storico stays", tier: "Historic", description: "Walking distance to the Pantheon and Piazza Navona." },
      { name: "Florence Oltrarno boutiques", tier: "Boutique", description: "Quieter side of the river, close to the Ponte Vecchio." },
      { name: "Amalfi Coast clifftop hotels", tier: "Resort", description: "Terraced rooms with sea views above Positano and Praiano." },
    ],
    itinerary: [
      { title: "Day 1-3: Rome", description: "The Colosseum, Vatican Museums, and evenings in Trastevere." },
      { title: "Day 4-5: Florence", description: "The Uffizi, Duomo climb, and a day trip into Tuscan wine country." },
      { title: "Day 6-7: Venice", description: "The Grand Canal, St. Mark's Square, and getting lost in the side streets." },
      { title: "Day 8-9: Amalfi Coast", description: "Positano, Ravello, and a boat day around the coastline." },
    ],
    bestTime: "April-May and September-October for mild weather and thinner crowds than peak summer.",
    tips: {
      currency: "Euro (EUR). Cards widely accepted; small cash useful for markets.",
      transport: "High-speed trains (Frecciarossa, Italo) link major cities fastest.",
      safety: "Generally safe; watch for pickpockets in crowded tourist areas and stations.",
      language: "Italian; English is common in major tourist centers, less so in smaller towns.",
    },
    faqs: [
      { q: "How many cities can I fit in a week?", a: "Three is comfortable -- Rome, Florence, and Venice is the classic first-timer route." },
      { q: "Do I need to book the Vatican and Uffizi ahead?", a: "Yes -- both sell out days or weeks in advance in peak season." },
      { q: "Is a rental car worth it?", a: "Only for Tuscany or the Amalfi Coast -- trains are faster and easier between major cities." },
      { q: "When should I avoid?", a: "August is hot and many local businesses close as Italians take their own holidays." },
    ],
  },

  spain: {
    whyChoose:
      "Spain pairs beach coastline with historic capitals and some of Europe's busiest, most affordable flight routes -- a country built for long lunches and later nights.",
    whyVisit: [
      { title: "Cities with their own personality", description: "Barcelona's Gaudi, Madrid's museums, and Seville's flamenco each feel distinct." },
      { title: "A food culture built around sharing", description: "Tapas crawls turn dinner into a multi-stop evening out." },
      { title: "Beaches within reach of it all", description: "The Costa Brava and Costa del Sol are short trips from major cities." },
      { title: "Great value flying", description: "Spain has some of the densest, cheapest intra-Europe flight routes." },
    ],
    attractions: [
      { name: "Sagrada Familia, Barcelona", description: "Gaudi's unfinished basilica, still under construction over a century later." },
      { name: "Alhambra, Granada", description: "A Moorish palace complex above the city -- book tickets weeks ahead." },
      { name: "Prado Museum, Madrid", description: "Velazquez, Goya, and one of Europe's great classical collections." },
      { name: "Plaza de Espana, Seville", description: "A sweeping riverside plaza built for the 1929 expo." },
      { name: "Park Guell, Barcelona", description: "Gaudi's mosaic park above the city, with skyline views." },
      { name: "Camino de Santiago", description: "The centuries-old pilgrimage route across northern Spain, walked in full or in part." },
    ],
    foodIntro: "Spanish food is built for sharing -- small plates, long tables, and dinner that starts late.",
    dishes: [
      { name: "Jamon iberico", description: "Cured ham from acorn-fed pigs, sliced paper-thin." },
      { name: "Paella", description: "Saffron rice with seafood or rabbit, traditionally cooked outdoors in Valencia." },
      { name: "Tapas", description: "Small plates meant for grazing across several bars in one evening." },
      { name: "Churros con chocolate", description: "Fried dough dipped in thick hot chocolate, a classic late-night or breakfast treat." },
    ],
    hotels: [
      { name: "Barcelona Eixample stays", tier: "City", description: "Central, walkable base near Gaudi's landmarks." },
      { name: "Seville old-quarter hotels", tier: "Historic", description: "Courtyard hotels in the Santa Cruz district." },
      { name: "Costa Brava beach resorts", tier: "Resort", description: "Coastal stays along the cliffs north of Barcelona." },
    ],
    itinerary: [
      { title: "Day 1-3: Barcelona", description: "Sagrada Familia, Park Guell, and tapas in the Gothic Quarter." },
      { title: "Day 4-5: Madrid", description: "The Prado, Retiro Park, and late dinners in Malasana." },
      { title: "Day 6-7: Seville & Granada", description: "Flamenco, the Alhambra, and Andalusian courtyards." },
    ],
    bestTime: "April-June and September-October for warm, dry weather without the summer heat spikes.",
    tips: {
      currency: "Euro (EUR). Cards accepted almost everywhere.",
      transport: "High-speed AVE trains connect major cities quickly and comfortably.",
      safety: "Safe overall; watch for pickpockets on Barcelona's Ramblas and metro.",
      language: "Spanish, with Catalan in Barcelona; English common in tourist zones.",
    },
    faqs: [
      { q: "Barcelona or Madrid first?", a: "Both work as an entry point -- Barcelona for architecture and coast, Madrid for museums and central access." },
      { q: "Do I need to book the Alhambra ahead?", a: "Yes, tickets are timed and sell out well in advance in peak season." },
      { q: "What time is dinner in Spain?", a: "Locals eat from 9pm -- restaurants often don't open before 8." },
      { q: "Is southern Spain worth adding?", a: "Yes, if you have a week or more -- Seville and Granada round out the trip well." },
    ],
  },

  vietnam: {
    whyChoose:
      "Vietnam runs a single, dramatic route from mountains to coast to old quarters -- north to south, with a different landscape and cuisine at every stop.",
    whyVisit: [
      { title: "One route, total variety", description: "Hanoi's old quarter, Halong Bay's karsts, and Ho Chi Minh City's energy all sit on one route." },
      { title: "Food that's a destination itself", description: "Street food culture here is dense, cheap, and genuinely excellent." },
      { title: "Dramatic landscapes", description: "Limestone karsts, rice terraces, and a coastline that runs the length of the country." },
      { title: "Real value", description: "Flights, food, and stays run a fraction of neighboring Thailand's peak-season prices." },
    ],
    attractions: [
      { name: "Halong Bay", description: "Thousands of limestone karsts rising from emerald water -- best seen from an overnight boat." },
      { name: "Hanoi Old Quarter", description: "36 streets, each historically tied to a trade, now dense with food stalls and cafes." },
      { name: "Hoi An Ancient Town", description: "A lantern-lit riverside town, UNESCO-listed and easy to explore on foot." },
      { name: "Cu Chi Tunnels", description: "The underground tunnel network from the Vietnam War, near Ho Chi Minh City." },
      { name: "Sapa rice terraces", description: "Mountain trekking through terraced valleys in Vietnam's northern highlands." },
      { name: "Mekong Delta", description: "Floating markets and river villages south of Ho Chi Minh City." },
    ],
    foodIntro: "Vietnamese food is fresh, herb-heavy, and mostly eaten on plastic stools at a street stall.",
    dishes: [
      { name: "Pho", description: "Beef or chicken noodle soup, the country's signature dish, eaten any time of day." },
      { name: "Banh mi", description: "A French-Vietnamese sandwich on a crisp baguette, packed with pate and herbs." },
      { name: "Bun cha", description: "Grilled pork over rice noodles with a sweet-sour dipping broth, a Hanoi specialty." },
      { name: "Vietnamese coffee", description: "Strong drip coffee with condensed milk, served hot or over ice." },
    ],
    hotels: [
      { name: "Hanoi Old Quarter stays", tier: "Boutique", description: "Narrow tube-house hotels steps from the night market." },
      { name: "Halong Bay overnight boats", tier: "Cruise", description: "Cabin boats that sail through the karsts overnight." },
      { name: "Hoi An riverside hotels", tier: "Resort", description: "Lantern-lit riverside stays close to the ancient town and beach." },
    ],
    itinerary: [
      { title: "Day 1-2: Hanoi", description: "Old Quarter food crawl and a day at the Temple of Literature." },
      { title: "Day 3-4: Halong Bay", description: "Overnight boat through the karsts, kayaking and cave stops." },
      { title: "Day 5-6: Hoi An", description: "Ancient town, tailor shops, and a bike ride to An Bang beach." },
      { title: "Day 7-8: Ho Chi Minh City", description: "War Remnants Museum, the Cu Chi Tunnels, and Mekong Delta day trip." },
    ],
    bestTime: "February-April for the whole country; weather varies by region the rest of the year.",
    tips: {
      currency: "Vietnamese Dong (VND). Cash is still widely used outside major hotels.",
      transport: "Domestic flights or overnight trains/buses cover the long north-south distances.",
      safety: "Generally safe; traffic crossing takes some getting used to.",
      language: "Vietnamese; English is spoken in tourist areas, less so elsewhere.",
    },
    faqs: [
      { q: "Should I go north to south or south to north?", a: "North to south is standard, following the weather from cool highlands to warm coast." },
      { q: "How long do I need for the whole route?", a: "10-14 days covers Hanoi, Halong Bay, Hoi An, and Ho Chi Minh City comfortably." },
      { q: "Is street food safe?", a: "Generally yes -- stick to stalls with high turnover and fresh ingredients." },
      { q: "Do I need a visa?", a: "Many nationalities can get an e-visa online in advance; check requirements before you fly." },
    ],
  },

  "south-korea": {
    whyChoose:
      "South Korea moves fast -- Seoul's neighborhoods shift character block by block, and a high-speed rail network puts coastal cities and mountain temples within easy reach.",
    whyVisit: [
      { title: "A capital of contrasts", description: "Centuries-old palaces sit blocks from some of Asia's most futuristic skylines." },
      { title: "Fast, easy rail", description: "The KTX bullet train reaches most of the country in under three hours." },
      { title: "A food scene on its own terms", description: "Korean barbecue, street food markets, and a serious coffee culture." },
      { title: "Beyond Seoul", description: "Busan's beaches, Jeju's volcanic coast, and mountain temple stays round out the trip." },
    ],
    attractions: [
      { name: "Gyeongbokgung Palace", description: "Seoul's largest royal palace, with a changing-of-the-guard ceremony worth timing for." },
      { name: "Bukchon Hanok Village", description: "A hillside neighborhood of traditional hanok houses in central Seoul." },
      { name: "Myeong-dong & Hongdae", description: "Seoul's shopping and nightlife districts, dense with street food and neon." },
      { name: "Jeju Island", description: "Volcanic coastline, waterfalls, and hiking up Hallasan, reached by short flight." },
      { name: "Busan's Haeundae Beach", description: "A city beach backed by a modern skyline, plus the Jagalchi fish market nearby." },
      { name: "DMZ tour", description: "A day trip to the Demilitarized Zone border with North Korea, from Seoul." },
    ],
    foodIntro: "Korean food is built around sharing, grilling at the table, and a wall of banchan side dishes.",
    dishes: [
      { name: "Korean BBQ", description: "Marinated meat grilled tableside, wrapped in lettuce with rice and sauce." },
      { name: "Bibimbap", description: "Rice topped with vegetables, egg, and gochujang, mixed together at the table." },
      { name: "Kimchi", description: "Fermented, spiced cabbage served at nearly every meal." },
      { name: "Tteokbokki", description: "Spicy rice cakes, a street-food staple found at markets across Seoul." },
    ],
    hotels: [
      { name: "Myeong-dong city hotels", tier: "City", description: "Central Seoul base close to shopping and the subway network." },
      { name: "Bukchon hanok stays", tier: "Boutique", description: "Traditional courtyard houses converted into guesthouses." },
      { name: "Jeju coastal resorts", tier: "Resort", description: "Beachfront and volcanic-coast stays on Jeju Island." },
    ],
    itinerary: [
      { title: "Day 1-3: Seoul", description: "Palaces, Bukchon Village, and nights out in Hongdae and Myeong-dong." },
      { title: "Day 4: DMZ day trip", description: "A guided tour to the North Korean border, back in Seoul by evening." },
      { title: "Day 5-6: Busan", description: "Haeundae Beach, the fish market, and Gamcheon's colorful hillside village." },
      { title: "Day 7-8: Jeju Island", description: "Volcanic coast, waterfalls, and a hike up Hallasan." },
    ],
    bestTime: "April-June and September-November for cherry blossoms or autumn color and mild weather.",
    tips: {
      currency: "South Korean Won (KRW). A T-money transit card covers most city transport.",
      transport: "The KTX high-speed rail and Seoul's subway are fast, clean, and easy to navigate.",
      safety: "Very safe, including at night; standard city awareness is enough.",
      language: "Korean; English signage is common in Seoul's subway and tourist areas.",
    },
    faqs: [
      { q: "Is Seoul easy for first-time visitors?", a: "Yes -- the subway is extensive and well-signed in English." },
      { q: "Should I add Busan or Jeju?", a: "Both are worth it if you have 8+ days; Busan for beaches, Jeju for nature." },
      { q: "Best season for cherry blossoms?", a: "Late March to early April, though exact timing shifts year to year." },
      { q: "Is Korean food very spicy?", a: "Some dishes are, but plenty of milder options -- Korean BBQ and bibimbap are easy starting points." },
    ],
  },

  "sri-lanka": {
    whyChoose:
      "Sri Lanka fits hill country, coastline, and wildlife safaris into a loop small enough to cover in under two weeks -- a compact, dense alternative to bigger South Asia trips.",
    whyVisit: [
      { title: "Everything in one loop", description: "Tea country, ancient cities, beaches, and safari parks all sit within a day's drive of each other." },
      { title: "A serious tea culture", description: "The central highlands produce some of the world's best Ceylon tea, grown on terraced estates you can walk through." },
      { title: "Wildlife without the long transfers", description: "Leopard and elephant safaris are a few hours from the coast, not a separate trip." },
      { title: "Beaches for every style", description: "Surf towns in the south, calmer bays in the east and northwest." },
    ],
    attractions: [
      { name: "Sigiriya Rock Fortress", description: "A 5th-century palace ruin atop a 200-meter granite column, with frescoes en route." },
      { name: "Ella & the hill country train", description: "One of the world's most scenic rail rides, through tea plantations and viaducts." },
      { name: "Yala National Park", description: "One of the world's highest leopard-density parks, plus elephants and crocodiles." },
      { name: "Galle Fort", description: "A Dutch colonial fort town on the south coast, walkable in an afternoon." },
      { name: "Kandy's Temple of the Tooth", description: "A sacred Buddhist relic temple beside Kandy Lake." },
      { name: "Mirissa whale watching", description: "Blue whale and dolphin tours off the south coast, seasonal November-April." },
    ],
    foodIntro: "Sri Lankan food is built on rice, coconut, and a heat that builds gradually meal to meal.",
    dishes: [
      { name: "Rice and curry", description: "A spread of vegetable and meat curries served over rice, the daily staple." },
      { name: "Hoppers", description: "Bowl-shaped fermented rice pancakes, often served with an egg cracked in the center." },
      { name: "Kottu roti", description: "Chopped flatbread stir-fried with vegetables and meat, cooked loudly on a hot griddle." },
      { name: "Ceylon tea", description: "Grown in the central highlands, tasted fresh at plantation tea houses." },
    ],
    hotels: [
      { name: "Ella hill country stays", tier: "Boutique", description: "Bungalows set among tea estates with valley views." },
      { name: "Galle Fort boutique hotels", tier: "Historic", description: "Converted Dutch colonial townhouses inside the fort walls." },
      { name: "Yala safari lodges", tier: "Safari", description: "Tented and lodge stays on the edge of the national park." },
    ],
    itinerary: [
      { title: "Day 1-2: Sigiriya & Kandy", description: "The rock fortress, cave temples, and the Temple of the Tooth." },
      { title: "Day 3-4: Ella", description: "The hill-country train, tea plantations, and Nine Arches Bridge." },
      { title: "Day 5: Yala safari", description: "An early-morning game drive for leopards and elephants." },
      { title: "Day 6-7: South coast", description: "Galle Fort, Mirissa's beaches, and whale watching if it's the season." },
    ],
    bestTime: "December-March for the west and south coasts; April-September for the east coast and cultural triangle.",
    tips: {
      currency: "Sri Lankan Rupee (LKR). Cash useful outside cities and hotels.",
      transport: "Trains for the hill country, private drivers for longer cross-country routes.",
      safety: "Generally safe for travelers; standard precautions around roads and swimming apply.",
      language: "Sinhala and Tamil; English is common in tourist areas.",
    },
    faqs: [
      { q: "How long do I need for the full loop?", a: "10-14 days covers the cultural triangle, hill country, safari, and south coast well." },
      { q: "Is Sri Lanka good for a first safari?", a: "Yes -- Yala has some of the highest leopard sighting rates anywhere in the world." },
      { q: "When's the hill-country train best?", a: "The Kandy-to-Ella stretch is the classic scenic ride, any time of year." },
      { q: "Do I need a visa in advance?", a: "Most visitors need an ETA, applied for online before arrival." },
    ],
  },

  "united-states": {
    whyChoose:
      "The US covers enough ground for a dozen different trips -- national parks, coastal cities, and road-trip country, spread across a continent and served by an enormous domestic flight network.",
    whyVisit: [
      { title: "A different trip every region", description: "The Southwest's deserts, the Northeast's cities, and the West Coast barely resemble each other." },
      { title: "National parks built for road trips", description: "The park system connects some of the most dramatic landscapes on the continent." },
      { title: "Cities with global reach", description: "New York, Los Angeles, and Chicago each anchor a very different kind of trip." },
      { title: "Easy domestic connections", description: "A dense flight network makes multi-city, multi-region routes simple to build." },
    ],
    attractions: [
      { name: "Grand Canyon", description: "A mile-deep canyon carved by the Colorado River, with rim trails for every fitness level." },
      { name: "Yosemite National Park", description: "Granite cliffs, waterfalls, and giant sequoias in California's Sierra Nevada." },
      { name: "Times Square & Central Park, NYC", description: "The dense energy of Midtown against the calm of an 843-acre park." },
      { name: "Golden Gate Bridge, San Francisco", description: "Walk or bike across, with views back to the city and bay." },
      { name: "New Orleans French Quarter", description: "Jazz clubs, Creole food, and colonial architecture along the Mississippi." },
      { name: "Las Vegas Strip", description: "Casinos, shows, and easy access to the Grand Canyon and Red Rock Canyon." },
    ],
    foodIntro: "American food is deeply regional -- barbecue in Texas, seafood in New England, tacos on the West Coast.",
    dishes: [
      { name: "New York pizza", description: "Wide, foldable slices, best eaten standing on the sidewalk." },
      { name: "Texas barbecue", description: "Slow-smoked brisket, a whole regional cuisine built around the pit." },
      { name: "California burritos & tacos", description: "West Coast Mexican food, shaped by proximity to the border." },
      { name: "New Orleans gumbo", description: "A Creole stew of the Louisiana coast, built on a dark roux." },
    ],
    hotels: [
      { name: "Manhattan city hotels", tier: "City", description: "Central bases for walking Midtown and downtown New York." },
      { name: "National park lodges", tier: "Lodge", description: "In-park stays at Yosemite and the Grand Canyon, booked well ahead." },
      { name: "LA & San Francisco boutiques", tier: "Boutique", description: "Neighborhood stays in West Coast cities, close to transit." },
    ],
    itinerary: [
      { title: "Day 1-3: New York City", description: "Central Park, the Met, and neighborhoods from the Village to Brooklyn." },
      { title: "Day 4-6: Grand Canyon & Southwest", description: "Fly into Phoenix or Vegas for the canyon and Southwest desert scenery." },
      { title: "Day 7-9: California coast", description: "San Francisco, the Golden Gate, and a drive down Highway 1 to LA." },
    ],
    bestTime: "Varies hugely by region -- spring and fall are safest bets for most of the country; summer for national parks.",
    tips: {
      currency: "US Dollar (USD). Tipping (15-20%) is expected at restaurants and for services.",
      transport: "Domestic flights for long distances; a rental car is essential for national parks and road trips.",
      safety: "Varies by city and neighborhood; standard urban precautions apply.",
      language: "English; Spanish is widely spoken in the Southwest and major cities.",
    },
    faqs: [
      { q: "Can I do East and West Coast in one trip?", a: "It's better split into two trips -- the distances and time zones make one visit rushed." },
      { q: "Do I need a car?", a: "Essential for national parks and most of the country; unnecessary in NYC." },
      { q: "How far ahead should I book national park lodges?", a: "6-12 months for the most popular parks in peak summer season." },
      { q: "Is tipping really required?", a: "It's expected, not optional, in US restaurant and service culture -- 15-20% is standard." },
    ],
  },

  canada: {
    whyChoose:
      "Canada spreads mountains, lakes, and cities across a continent-sized country -- Banff's peaks and Toronto's skyline feel like different trips entirely, connected by a wide domestic flight network.",
    whyVisit: [
      { title: "Mountain scenery at scale", description: "The Canadian Rockies rival anywhere in the world for turquoise lakes and glacier views." },
      { title: "Cities with real variety", description: "Toronto's skyline, Montreal's French heritage, and Vancouver's coastline are all distinct trips." },
      { title: "Wide open nature", description: "National parks here are enormous, with far fewer crowds than US equivalents." },
      { title: "Easy for road trips", description: "Well-maintained highways and clear signage make self-driving simple." },
    ],
    attractions: [
      { name: "Banff & Lake Louise", description: "Glacier-fed turquoise lakes ringed by the Canadian Rockies." },
      { name: "Niagara Falls", description: "The thundering Horseshoe Falls, best viewed from the Canadian side." },
      { name: "CN Tower, Toronto", description: "A 553-meter tower with a glass floor and city-wide views." },
      { name: "Old Montreal", description: "Cobblestone streets and French colonial architecture in Quebec's largest city." },
      { name: "Stanley Park, Vancouver", description: "A seawall-ringed park connecting downtown Vancouver to the coastline." },
      { name: "Jasper National Park", description: "Larger and quieter than Banff, with some of the darkest skies in North America." },
    ],
    foodIntro: "Canadian food blends British, French, and Indigenous influences, with strong regional specialties.",
    dishes: [
      { name: "Poutine", description: "Fries, cheese curds, and gravy -- Quebec's contribution to comfort food." },
      { name: "Montreal bagels", description: "Wood-fired and denser than New York's, boiled in honey water first." },
      { name: "Maple syrup", description: "Harvested across Quebec and Ontario, poured on everything from pancakes to bacon." },
      { name: "Fresh Pacific salmon", description: "A West Coast staple, grilled or smoked along the Vancouver waterfront." },
    ],
    hotels: [
      { name: "Banff mountain lodges", tier: "Alpine", description: "Timber lodges with direct access to the Rockies' trailheads." },
      { name: "Toronto downtown hotels", tier: "City", description: "Central stays near the CN Tower and waterfront." },
      { name: "Vancouver harbor hotels", tier: "Coastal", description: "Waterfront rooms with views across to the North Shore mountains." },
    ],
    itinerary: [
      { title: "Day 1-2: Toronto & Niagara", description: "The CN Tower, downtown neighborhoods, and a day trip to Niagara Falls." },
      { title: "Day 3-4: Montreal & Quebec City", description: "Old Montreal's cobblestones and Quebec City's walled old town." },
      { title: "Day 5-7: Banff & the Rockies", description: "Lake Louise, Moraine Lake, and hiking trails through glacier country." },
    ],
    bestTime: "June-September for the Rockies and most outdoor travel; December-March for skiing and winter sports.",
    tips: {
      currency: "Canadian Dollar (CAD). Tipping 15-18% is standard at restaurants.",
      transport: "Domestic flights for east-west distances; a rental car is best for the Rockies.",
      safety: "Very safe; standard wildlife precautions apply in national parks.",
      language: "English and French (especially in Quebec); both are official languages.",
    },
    faqs: [
      { q: "Can I combine Toronto and the Rockies?", a: "They're a 4-hour flight apart -- doable, but better as separate legs of a longer trip." },
      { q: "Is Quebec really French-speaking?", a: "Yes, especially outside Montreal -- some French phrases help, though English gets by." },
      { q: "Best time for Rockies hiking?", a: "July-September, when most high-alpine trails are fully snow-free." },
      { q: "Do I need a car in Banff?", a: "It helps for reaching trailheads, though a shuttle network covers the main sights." },
    ],
  },

  brazil: {
    whyChoose:
      "Brazil runs coastline, rainforest, and cities that don't slow down after dark -- a country big enough that Rio and the Amazon feel like entirely separate trips.",
    whyVisit: [
      { title: "Beach city energy", description: "Rio's Copacabana and Ipanema set the pace for beach culture worldwide." },
      { title: "The Amazon, accessibly", description: "Manaus puts rainforest lodges and river tours within a short flight of major cities." },
      { title: "A soundtrack of its own", description: "Samba, bossa nova, and Carnival make Brazil's nightlife genuinely unique." },
      { title: "Waterfalls on a different scale", description: "Iguazu Falls dwarfs Niagara, with trails on both the Brazilian and Argentine sides." },
    ],
    attractions: [
      { name: "Christ the Redeemer", description: "Rio's iconic statue atop Corcovado, with sweeping views over the city and bay." },
      { name: "Copacabana & Ipanema beaches", description: "Rio's famous beachfronts, busy with volleyball, football, and coconut stands." },
      { name: "Iguazu Falls", description: "A sprawling waterfall system on the Argentina border, viewed by walkway and boat." },
      { name: "Amazon rainforest, Manaus", description: "River lodges and jungle tours into the world's largest rainforest." },
      { name: "Sugarloaf Mountain", description: "A cable car ride up granite peaks for sunset views over Rio." },
      { name: "Salvador's Pelourinho", description: "A UNESCO-listed colonial center known for Afro-Brazilian culture and music." },
    ],
    foodIntro: "Brazilian food centers on grilled meat, tropical fruit, and dishes shaped by African, Portuguese, and Indigenous roots.",
    dishes: [
      { name: "Churrasco", description: "Skewered, fire-grilled meats served tableside at a rodizio steakhouse." },
      { name: "Feijoada", description: "A black bean and pork stew, traditionally served on Saturdays." },
      { name: "Acai bowls", description: "Frozen acai berry blended and topped with granola and fruit, a Rio beach staple." },
      { name: "Pao de queijo", description: "Chewy, cheese-filled bread rolls, a breakfast fixture nationwide." },
    ],
    hotels: [
      { name: "Copacabana beachfront hotels", tier: "Resort", description: "Rio stays with direct beach access and skyline views." },
      { name: "Manaus jungle lodges", tier: "Eco-lodge", description: "River-based stays for Amazon wildlife tours." },
      { name: "Salvador historic hotels", tier: "Boutique", description: "Colonial buildings converted into stays in the Pelourinho district." },
    ],
    itinerary: [
      { title: "Day 1-3: Rio de Janeiro", description: "Christ the Redeemer, Sugarloaf, and the beaches of Copacabana and Ipanema." },
      { title: "Day 4-5: Iguazu Falls", description: "Walkways and boat tours through one of the world's largest waterfall systems." },
      { title: "Day 6-8: Amazon, Manaus", description: "River lodge stays with guided jungle and wildlife tours." },
    ],
    bestTime: "May-September for drier weather in Rio; June-November for lower water levels in the Amazon.",
    tips: {
      currency: "Brazilian Real (BRL). Cards widely accepted in cities.",
      transport: "Domestic flights for long distances; taxis or rideshare within cities.",
      safety: "Take standard city precautions in Rio and Sao Paulo, especially at night.",
      language: "Portuguese; English is limited outside major hotels and tourist zones.",
    },
    faqs: [
      { q: "Is Rio safe for tourists?", a: "Yes, with standard precautions -- stick to well-traveled areas and avoid displaying valuables." },
      { q: "How do I get to the Amazon?", a: "Fly into Manaus, then transfer by boat to a river lodge." },
      { q: "Should I see Iguazu from Brazil or Argentina?", a: "Both sides offer different views -- many visitors cross the border to see both." },
      { q: "Is Carnival worth planning around?", a: "If nightlife and parades interest you, yes -- but book accommodation many months ahead." },
    ],
  },

  mexico: {
    whyChoose:
      "Mexico covers ancient ruins, beach towns, and street food that varies by region -- close enough for a long weekend, deep enough for a month.",
    whyVisit: [
      { title: "Ruins without the long flight", description: "Chichen Itza and Tulum's Maya sites are a short hop from major resort areas." },
      { title: "A beach town for every style", description: "Cancun's resorts, Tulum's boho coast, and Puerto Vallarta's bay each feel different." },
      { title: "Street food as culture", description: "Tacos, mole, and mezcal define a food scene that rewards wandering." },
      { title: "Easy, short-haul access", description: "Direct flights from across North America keep travel time short." },
    ],
    attractions: [
      { name: "Chichen Itza", description: "The Maya step-pyramid of Kukulkan, a short drive from Cancun and Tulum." },
      { name: "Tulum ruins & beach", description: "Clifftop Maya ruins directly above a white-sand Caribbean beach." },
      { name: "Mexico City's Zocalo & museums", description: "A dense historic center, plus world-class museums like Frida Kahlo's Casa Azul." },
      { name: "Cenotes, Yucatan", description: "Freshwater sinkholes for swimming and snorkeling across the peninsula." },
      { name: "Oaxaca's food scene", description: "Mole, mezcal, and markets in one of Mexico's culinary capitals." },
      { name: "Puerto Vallarta's Malecon", description: "A seafront boardwalk backed by the Sierra Madre mountains." },
    ],
    foodIntro: "Mexican food changes dramatically by region -- what's classic in Oaxaca is different in Yucatan or Baja.",
    dishes: [
      { name: "Street tacos", description: "Corn tortillas piled with al pastor, carnitas, or fish, eaten standing at a stall." },
      { name: "Mole", description: "A complex, slow-cooked sauce from Oaxaca, often chocolate-based and deeply savory." },
      { name: "Ceviche", description: "Citrus-cured seafood, especially good along the Pacific and Baja coasts." },
      { name: "Mezcal", description: "Smoky agave spirit from Oaxaca, tasted at small palenques and city bars alike." },
    ],
    hotels: [
      { name: "Tulum beachfront eco-hotels", tier: "Boutique", description: "Palapa-roofed stays right on the sand, south of the ruins." },
      { name: "Mexico City boutique hotels", tier: "City", description: "Stylish stays in Roma and Condesa, close to museums and cafes." },
      { name: "Riviera Maya resorts", tier: "Resort", description: "All-inclusive stays along Cancun and the Riviera Maya coastline." },
    ],
    itinerary: [
      { title: "Day 1-2: Mexico City", description: "The Zocalo, Frida Kahlo's Casa Azul, and Roma-Condesa's cafes." },
      { title: "Day 3-4: Oaxaca", description: "Mezcal tastings, mole, and the Monte Alban ruins." },
      { title: "Day 5-7: Tulum & Yucatan", description: "Beach time, cenote swimming, and a day trip to Chichen Itza." },
    ],
    bestTime: "November-April for dry weather across most of the country and coast.",
    tips: {
      currency: "Mexican Peso (MXN). Cash useful for markets and street food.",
      transport: "Domestic flights or buses for long distances; taxis and rideshare within cities.",
      safety: "Varies by region -- resort areas and major tourist zones are generally safe with standard precautions.",
      language: "Spanish; English is common in resort areas, less so inland.",
    },
    faqs: [
      { q: "Cancun or Tulum for a beach trip?", a: "Cancun for resorts and nightlife, Tulum for a quieter, boho coastal feel." },
      { q: "Is Mexico City safe to visit?", a: "Yes, in the well-traveled central neighborhoods, with standard urban precautions." },
      { q: "How far is Chichen Itza from the coast?", a: "About 2.5 hours by car or bus from Cancun or Tulum." },
      { q: "Best region for food travel?", a: "Oaxaca and Mexico City are considered the country's culinary centers." },
    ],
  },

  peru: {
    whyChoose:
      "Peru fits Andean trails, colonial cities, and Amazon access into one trip -- Machu Picchu is the draw, but the route around it is just as strong.",
    whyVisit: [
      { title: "One of the world's great treks", description: "The Inca Trail and its alternatives lead through cloud forest to Machu Picchu's gate." },
      { title: "A colonial city as a base", description: "Cusco's cobbled streets and Inca foundations make a rich stop before the trail." },
      { title: "Amazon access built in", description: "Puerto Maldonado connects easily for rainforest lodges after the highlands." },
      { title: "Food that's having a moment", description: "Lima consistently ranks among the world's best food cities." },
    ],
    attractions: [
      { name: "Machu Picchu", description: "The Inca citadel above the Urubamba Valley, reached by train or multi-day trek." },
      { name: "Sacred Valley", description: "Inca ruins, weaving villages, and terraced farmland between Cusco and Machu Picchu." },
      { name: "Cusco's historic center", description: "Inca stonework beneath colonial Spanish buildings, in Peru's former imperial capital." },
      { name: "Rainbow Mountain", description: "A striped mineral peak reached by a demanding high-altitude day hike." },
      { name: "Lake Titicaca", description: "The world's highest navigable lake, with floating Uros reed islands." },
      { name: "Lima's Miraflores & food scene", description: "Clifftop parks above the Pacific and some of South America's best restaurants." },
    ],
    foodIntro: "Peruvian food blends Indigenous, Spanish, Chinese, and Japanese influences into one of Latin America's strongest cuisines.",
    dishes: [
      { name: "Ceviche", description: "Raw fish cured in citrus with chili and onion, Peru's signature dish." },
      { name: "Lomo saltado", description: "Stir-fried beef with onions, tomatoes, and fries -- a Chinese-Peruvian classic." },
      { name: "Causa", description: "Layered mashed potato with chicken or seafood, chilled and pressed." },
      { name: "Pisco sour", description: "Peru's national cocktail, made with grape brandy, lime, and egg white." },
    ],
    hotels: [
      { name: "Cusco boutique hotels", tier: "Historic", description: "Colonial courtyard buildings built on Inca stone foundations." },
      { name: "Sacred Valley lodges", tier: "Countryside", description: "Mountain-view stays closer to the Machu Picchu trailheads." },
      { name: "Lima Miraflores hotels", tier: "City", description: "Clifftop stays close to Lima's restaurant district." },
    ],
    itinerary: [
      { title: "Day 1-2: Lima", description: "Acclimatize with a food tour through Miraflores and Barranco." },
      { title: "Day 3-4: Cusco & Sacred Valley", description: "Altitude adjustment, Inca ruins, and weaving villages." },
      { title: "Day 5-6: Machu Picchu", description: "Train or trek to the citadel, staying overnight in Aguas Calientes." },
      { title: "Day 7: Lake Titicaca", description: "A flight to Puno and a boat trip to the floating Uros islands." },
    ],
    bestTime: "May-September (dry season) for Machu Picchu and the highlands; avoid February when the Inca Trail closes for maintenance.",
    tips: {
      currency: "Peruvian Sol (PEN). Cash needed in smaller towns and markets.",
      transport: "Domestic flights between Lima and Cusco; trains for the Sacred Valley to Machu Picchu.",
      safety: "Generally safe for travelers; altitude sickness is the more common concern in Cusco.",
      language: "Spanish, with Quechua widely spoken in the highlands.",
    },
    faqs: [
      { q: "Do I need to book Machu Picchu tickets in advance?", a: "Yes -- entry is timed and capped daily, especially for the Inca Trail." },
      { q: "How do I handle the altitude in Cusco?", a: "Spend a day or two acclimatizing before any strenuous hiking; coca tea is a common local remedy." },
      { q: "Inca Trail or train to Machu Picchu?", a: "The trail is a multi-day trek booked months ahead; the train is a same-day, no-hiking option." },
      { q: "Is Lima worth more than a stopover?", a: "Yes -- it's one of South America's top food cities and worth 2-3 days on its own." },
    ],
  },

  argentina: {
    whyChoose:
      "Argentina spans glaciers, wine country, and a capital built for long dinners -- one of South America's most varied single-country trips.",
    whyVisit: [
      { title: "A capital with its own rhythm", description: "Buenos Aires runs late -- dinner after 9pm, tango until early morning." },
      { title: "Wine country worth the detour", description: "Mendoza's malbec vineyards sit beneath the Andes, an easy flight from the capital." },
      { title: "Glaciers you can walk on", description: "Perito Moreno in Patagonia is one of the few glaciers still advancing." },
      { title: "European heritage, South American energy", description: "Italian and Spanish influence run deep, especially in the capital's architecture and food." },
    ],
    attractions: [
      { name: "Perito Moreno Glacier", description: "A vast, still-advancing glacier in Los Glaciares National Park, viewable by walkway or boat." },
      { name: "Recoleta Cemetery, Buenos Aires", description: "An elaborate cemetery of mausoleums, including Eva Peron's grave." },
      { name: "Iguazu Falls (Argentine side)", description: "Walkways bring you right to the edge of the falls, complementing the Brazilian view." },
      { name: "Mendoza wine country", description: "Malbec vineyards at the foot of the Andes, best toured by bike or private driver." },
      { name: "La Boca & Caminito, Buenos Aires", description: "A colorful working-class port neighborhood, birthplace of tango." },
      { name: "El Chalten trekking", description: "Patagonia's trekking capital, with trails to Mount Fitz Roy." },
    ],
    foodIntro: "Argentine food centers on beef, Italian influence, and a wine culture to match.",
    dishes: [
      { name: "Asado", description: "Slow-grilled beef over an open fire, a weekend ritual and national institution." },
      { name: "Empanadas", description: "Baked or fried pastries filled with beef, cheese, or corn, sold everywhere." },
      { name: "Malbec wine", description: "Argentina's signature red, grown at altitude in Mendoza's vineyards." },
      { name: "Dulce de leche", description: "A caramelized milk spread found in pastries, ice cream, and alfajores." },
    ],
    hotels: [
      { name: "Buenos Aires boutique hotels", tier: "City", description: "Stays in Palermo and Recoleta, close to parks and restaurants." },
      { name: "Mendoza wine lodges", tier: "Countryside", description: "Vineyard estates with Andes views and on-site tastings." },
      { name: "El Calafate & Patagonia lodges", tier: "Lodge", description: "Base camps for glacier tours and Patagonian trekking." },
    ],
    itinerary: [
      { title: "Day 1-3: Buenos Aires", description: "Recoleta, La Boca, a tango show, and late dinners in Palermo." },
      { title: "Day 4-5: Mendoza", description: "Vineyard tours and Andes views over a long wine lunch." },
      { title: "Day 6-8: Patagonia", description: "Perito Moreno Glacier and trekking around El Chalten." },
    ],
    bestTime: "September-November and March-May for mild weather in Buenos Aires; November-March for Patagonia's summer trekking season.",
    tips: {
      currency: "Argentine Peso (ARS). Exchange rates fluctuate -- carrying USD cash is common practice.",
      transport: "Domestic flights for Patagonia and Mendoza; the capital is walkable with a strong subway system.",
      safety: "Generally safe; standard city precautions apply in Buenos Aires.",
      language: "Spanish; English is spoken in tourist areas of Buenos Aires.",
    },
    faqs: [
      { q: "How far is Patagonia from Buenos Aires?", a: "About a 3-hour flight to El Calafate, the gateway to the glaciers." },
      { q: "Is Mendoza worth a dedicated stop?", a: "Yes -- it's one of the world's great wine regions and an easy add-on flight." },
      { q: "When's best for glacier trekking?", a: "November-March, Patagonia's summer, for the most stable weather." },
      { q: "Is Buenos Aires walkable?", a: "Yes -- Palermo, Recoleta, and downtown are all pedestrian-friendly with good transit links." },
    ],
  },

  egypt: {
    whyChoose:
      "Egypt strings ancient sites along the Nile and Red Sea coastline -- pyramids, temples, and diving all reachable on one well-worn route.",
    whyVisit: [
      { title: "History on an unmatched scale", description: "The pyramids of Giza are the last surviving Ancient Wonder of the World." },
      { title: "The Nile as a route", description: "A river cruise between Luxor and Aswan links temple after temple." },
      { title: "Red Sea diving", description: "Some of the world's best reef diving, a short flight from Cairo." },
      { title: "A trip that's easy to structure", description: "Cairo, a Nile cruise, and a coastal add-on form a clean, well-trodden itinerary." },
    ],
    attractions: [
      { name: "Pyramids of Giza & the Sphinx", description: "The last standing Ancient Wonder, just outside Cairo." },
      { name: "Valley of the Kings, Luxor", description: "Underground tombs of the pharaohs, including Tutankhamun's." },
      { name: "Karnak Temple", description: "A vast temple complex built over 2,000 years, near Luxor." },
      { name: "Abu Simbel", description: "Ramses II's colossal rock temples near Aswan, relocated to save them from flooding." },
      { name: "Nile River cruise", description: "A multi-day boat trip between Luxor and Aswan, stopping at temples along the way." },
      { name: "Red Sea reefs, Hurghada or Sharm el-Sheikh", description: "World-class diving and snorkeling on the Red Sea coast." },
    ],
    foodIntro: "Egyptian food leans on legumes, bread, and slow-cooked stews, shaped by Mediterranean and Middle Eastern influence.",
    dishes: [
      { name: "Koshari", description: "A carb-heavy mix of rice, lentils, pasta, and fried onions -- Egypt's national dish." },
      { name: "Ful medames", description: "Slow-cooked fava beans, typically eaten for breakfast with bread." },
      { name: "Molokhia", description: "A garlicky, jute-leaf stew usually served over rice with chicken or rabbit." },
      { name: "Egyptian bread & mezze", description: "Flatbread served with hummus, baba ghanoush, and pickled vegetables." },
    ],
    hotels: [
      { name: "Cairo Nile-view hotels", tier: "City", description: "Central stays with river views close to the Egyptian Museum." },
      { name: "Nile cruise ships", tier: "Cruise", description: "Multi-day boats linking Luxor and Aswan's temple sites." },
      { name: "Red Sea dive resorts", tier: "Resort", description: "Coastal stays built around reef access in Hurghada or Sharm el-Sheikh." },
    ],
    itinerary: [
      { title: "Day 1-2: Cairo & Giza", description: "The pyramids, the Sphinx, and the Egyptian Museum's treasures." },
      { title: "Day 3-5: Nile cruise, Luxor to Aswan", description: "Karnak, the Valley of the Kings, and Abu Simbel." },
      { title: "Day 6-7: Red Sea coast", description: "Diving or snorkeling in Hurghada or Sharm el-Sheikh before flying home." },
    ],
    bestTime: "October-April for cooler, more comfortable temperatures across the country.",
    tips: {
      currency: "Egyptian Pound (EGP). Cash useful for markets and tipping (baksheesh is customary).",
      transport: "Domestic flights or Nile cruises between Cairo, Luxor, and Aswan.",
      safety: "Tourist areas are generally safe; standard precautions apply, especially around bargaining and touts.",
      language: "Arabic; English is common in tourist areas and hotels.",
    },
    faqs: [
      { q: "Is a Nile cruise worth it?", a: "Yes -- it's the most efficient way to see Luxor and Aswan's temples without repeated transfers." },
      { q: "How many days for the pyramids?", a: "A full day covers Giza's pyramids, the Sphinx, and a nearby museum stop." },
      { q: "Is Egypt safe to visit?", a: "Tourist zones and Nile cruise routes are well-established and generally safe." },
      { q: "Should I add the Red Sea coast?", a: "If you dive or want beach time, yes -- it pairs well as a final leg after the historical sites." },
    ],
  },

  "south-africa": {
    whyChoose:
      "South Africa fits safari, coastline, and wine valleys within a day's drive of each other -- a rare combination that makes for one efficient, varied trip.",
    whyVisit: [
      { title: "Safari without the long transfer", description: "Kruger and private reserves are a short flight from Cape Town or Johannesburg." },
      { title: "A coastline and a city together", description: "Cape Town pairs Table Mountain, beaches, and a working harbor in one place." },
      { title: "World-class wine country", description: "Stellenbosch and Franschhoek sit under an hour from Cape Town." },
      { title: "Genuinely varied landscapes", description: "Desert, coastline, mountains, and bushveld all within one country." },
    ],
    attractions: [
      { name: "Table Mountain, Cape Town", description: "A cable car or hike to flat-topped views over the city and Atlantic." },
      { name: "Kruger National Park", description: "One of Africa's largest safari reserves, home to the Big Five." },
      { name: "Cape of Good Hope", description: "Dramatic cliffs and beaches at the peninsula's southern tip." },
      { name: "Stellenbosch & Franschhoek", description: "Cape Winelands towns with vineyard estates and Cape Dutch architecture." },
      { name: "Robben Island", description: "The former prison island where Nelson Mandela was held, reached by ferry from Cape Town." },
      { name: "Garden Route", description: "A scenic coastal drive linking forests, lagoons, and small towns between Cape Town and Port Elizabeth." },
    ],
    foodIntro: "South African food blends Cape Malay, Dutch, and Indigenous traditions with a strong braai (barbecue) culture.",
    dishes: [
      { name: "Braai", description: "South Africa's version of barbecue, a weekend social ritual as much as a meal." },
      { name: "Bobotie", description: "Spiced minced meat baked with an egg-based topping, a Cape Malay classic." },
      { name: "Biltong", description: "Air-dried, cured meat, the local answer to jerky." },
      { name: "Cape wine", description: "Stellenbosch and Franschhoek produce some of the Southern Hemisphere's best." },
    ],
    hotels: [
      { name: "Cape Town city hotels", tier: "City", description: "Waterfront and city-bowl stays close to Table Mountain and the harbor." },
      { name: "Kruger safari lodges", tier: "Safari", description: "Private reserve lodges with guided game drives included." },
      { name: "Winelands estate stays", tier: "Countryside", description: "Vineyard hotels around Stellenbosch and Franschhoek." },
    ],
    itinerary: [
      { title: "Day 1-3: Cape Town", description: "Table Mountain, the Cape of Good Hope, and Robben Island." },
      { title: "Day 4: Winelands", description: "A day trip to Stellenbosch and Franschhoek for tastings." },
      { title: "Day 5-7: Kruger safari", description: "Fly to a private reserve for game drives at dawn and dusk." },
    ],
    bestTime: "May-September (dry winter) for the best safari viewing; November-March for Cape Town's warm, sunny summer.",
    tips: {
      currency: "South African Rand (ZAR). Cards widely accepted in cities and lodges.",
      transport: "Domestic flights between Cape Town, Johannesburg, and Kruger; rent a car for the Garden Route.",
      safety: "Take standard urban precautions in Cape Town and Johannesburg; safari lodges are well-secured.",
      language: "11 official languages; English is widely spoken and used in tourism.",
    },
    faqs: [
      { q: "Can I combine Cape Town and safari in one trip?", a: "Yes -- it's a common route, with a short flight connecting the two." },
      { q: "Is South Africa safe for tourists?", a: "Tourist areas and lodges are well-managed; standard city awareness applies in Cape Town and Johannesburg." },
      { q: "Best time for safari?", a: "Dry season (May-September) when animals cluster around water sources, easier to spot." },
      { q: "How many days for Kruger?", a: "3-4 days at a lodge gives you multiple game drives and a real chance at the Big Five." },
    ],
  },

  kenya: {
    whyChoose:
      "Kenya pairs some of Africa's best safari parks with a coastline worth extending the trip for -- the Maasai Mara's migration and the Swahili coast, all in one country.",
    whyVisit: [
      { title: "The Great Migration", description: "Wildebeest and zebra cross the Maasai Mara in one of nature's largest wildlife spectacles." },
      { title: "A coast worth adding on", description: "Diani and Watamu's beaches make a natural extension after safari." },
      { title: "Community-based tourism", description: "Many Maasai Mara conservancies are run in partnership with local communities." },
      { title: "Easy safari logistics", description: "Nairobi's flight network makes reaching remote parks straightforward." },
    ],
    attractions: [
      { name: "Maasai Mara National Reserve", description: "Home to the Great Migration and consistently strong Big Five sightings." },
      { name: "Amboseli National Park", description: "Elephant herds framed against Mount Kilimanjaro's silhouette." },
      { name: "Lake Nakuru", description: "A soda lake known for flamingo flocks and rhino sanctuary status." },
      { name: "Diani Beach", description: "White sand and reef diving on the Indian Ocean coast." },
      { name: "Nairobi National Park", description: "A safari park within sight of the capital's skyline." },
      { name: "Lamu Old Town", description: "A UNESCO-listed Swahili trading town, car-free and centuries old." },
    ],
    foodIntro: "Kenyan food centers on grilled meat, maize staples, and coastal Swahili flavors shaped by Indian Ocean trade.",
    dishes: [
      { name: "Nyama choma", description: "Grilled meat, usually goat or beef, a social centerpiece at gatherings." },
      { name: "Ugali", description: "A dense maize porridge served as the base for most meals." },
      { name: "Swahili coconut curries", description: "Coastal dishes built on coconut milk, showing Indian and Arab trade influence." },
      { name: "Chapati", description: "A flatbread introduced via Indian trade, now a Kenyan staple." },
    ],
    hotels: [
      { name: "Maasai Mara safari camps", tier: "Safari", description: "Tented camps with guided game drives and Migration-season access." },
      { name: "Nairobi city hotels", tier: "City", description: "A comfortable base before or after safari legs." },
      { name: "Diani Beach resorts", tier: "Resort", description: "Coastal stays with reef access and dhow sailing trips." },
    ],
    itinerary: [
      { title: "Day 1: Nairobi", description: "Arrive, visit the Giraffe Centre or Nairobi National Park." },
      { title: "Day 2-4: Maasai Mara", description: "Multiple game drives, timed for the Migration if the season aligns." },
      { title: "Day 5-7: Diani Beach", description: "Fly to the coast for reef diving and downtime after safari." },
    ],
    bestTime: "July-October for the Great Migration river crossings; December-March for drier, warmer coastal weather.",
    tips: {
      currency: "Kenyan Shilling (KES). Cards accepted at lodges; cash useful for tips and markets.",
      transport: "Small-plane charters link Nairobi to safari camps quickly; road transfers take longer but cost less.",
      safety: "Tourist routes and lodges are well-established; standard precautions apply in Nairobi.",
      language: "Swahili and English, both official languages.",
    },
    faqs: [
      { q: "When is the Migration in the Mara?", a: "River crossings typically peak July-October, though timing shifts with rainfall." },
      { q: "How do I get to the Maasai Mara?", a: "A short charter flight from Nairobi is fastest; driving takes 5-6 hours." },
      { q: "Is Kenya good for a first safari?", a: "Yes -- the Mara's wildlife density and camp infrastructure make it very approachable." },
      { q: "Should I add the coast?", a: "If you have a week or more, yes -- it's a natural, relaxing close to a safari trip." },
    ],
  },

  namibia: {
    whyChoose:
      "Namibia offers desert dunes, wide-open wildlife, and some of the clearest night skies anywhere -- a self-drive country built for wide horizons and few other travelers.",
    whyVisit: [
      { title: "The world's oldest desert", description: "The Namib's towering red dunes are unlike any other landscape on the continent." },
      { title: "Self-drive done right", description: "Well-marked roads and low traffic make Namibia one of Africa's easiest self-drive destinations." },
      { title: "Wildlife on a different scale", description: "Etosha's waterholes concentrate game in a way few other parks do." },
      { title: "True dark skies", description: "Minimal light pollution makes Namibia one of the best stargazing destinations on Earth." },
    ],
    attractions: [
      { name: "Sossusvlei dunes", description: "Some of the world's tallest sand dunes, best climbed at sunrise." },
      { name: "Deadvlei", description: "A white clay pan of ancient dead trees against red dunes and blue sky." },
      { name: "Etosha National Park", description: "A vast salt pan reserve where waterholes draw elephants, lions, and rhino." },
      { name: "Fish River Canyon", description: "One of the largest canyons in the world, rivaling the Grand Canyon in scale." },
      { name: "Swakopmund", description: "A German colonial coastal town, base for desert adventure activities." },
      { name: "Skeleton Coast", description: "A remote, fog-bound shipwreck coastline along the Atlantic." },
    ],
    foodIntro: "Namibian food reflects German colonial heritage alongside game meat and Southern African staples.",
    dishes: [
      { name: "Game meat", description: "Springbok, kudu, and oryx served grilled or in stews, widely available." },
      { name: "German-style bakeries", description: "A colonial legacy still visible in Swakopmund and Windhoek's bread and pastry shops." },
      { name: "Biltong", description: "Dried, cured meat, a popular road-trip snack across the country." },
      { name: "Braai", description: "Open-fire grilling, a staple of Namibian lodge dinners." },
    ],
    hotels: [
      { name: "Sossusvlei desert lodges", tier: "Desert", description: "Lodges at the edge of the dunes, positioned for sunrise access." },
      { name: "Etosha safari camps", tier: "Safari", description: "Camps with waterhole viewing decks for evening wildlife." },
      { name: "Swakopmund coastal hotels", tier: "Coastal", description: "A base for adventure activities and Skeleton Coast trips." },
    ],
    itinerary: [
      { title: "Day 1-2: Windhoek & drive to Sossusvlei", description: "Arrive and self-drive south toward the dunes." },
      { title: "Day 3: Sossusvlei & Deadvlei", description: "Sunrise dune climb and the clay pan's dead trees." },
      { title: "Day 4-5: Swakopmund", description: "Coastal activities and a Skeleton Coast excursion." },
      { title: "Day 6-8: Etosha National Park", description: "Multi-day game drives around the park's waterholes." },
    ],
    bestTime: "May-October (dry season) for the best wildlife viewing at Etosha's waterholes.",
    tips: {
      currency: "Namibian Dollar (NAD), pegged to and interchangeable with the South African Rand.",
      transport: "Self-driving is common and straightforward; 4x4 recommended for some routes.",
      safety: "Very safe for travelers; distances between stops are the main planning challenge.",
      language: "English is official; German and Afrikaans are also widely spoken.",
    },
    faqs: [
      { q: "Is self-driving in Namibia easy?", a: "Yes -- roads are well-maintained and traffic is minimal, though distances are long." },
      { q: "How many days do I need?", a: "10-12 days covers Sossusvlei, Swakopmund, and Etosha at a comfortable pace." },
      { q: "Is Namibia good for stargazing?", a: "Among the best in the world -- NamibRand Nature Reserve is an International Dark Sky Reserve." },
      { q: "Do I need a 4x4?", a: "Recommended for some routes, though many main roads are accessible by standard vehicle." },
    ],
  },

  jordan: {
    whyChoose:
      "Jordan packs desert canyons, ancient ruins, and a short hop to the Red Sea into a compact, easy-to-navigate country -- Petra alone justifies the trip.",
    whyVisit: [
      { title: "One of the New Seven Wonders", description: "Petra's rose-red facades carved into canyon walls are unlike anywhere else." },
      { title: "A compact, efficient route", description: "Amman, Petra, Wadi Rum, and the Dead Sea all sit within a few hours of each other." },
      { title: "Desert landscapes for camping", description: "Wadi Rum's red-sand valleys are best experienced overnight in a Bedouin camp." },
      { title: "The lowest point on Earth", description: "Float in the Dead Sea's mineral-rich water, easily added to any route." },
    ],
    attractions: [
      { name: "Petra", description: "An ancient Nabataean city carved into rose-colored sandstone canyons." },
      { name: "Wadi Rum", description: "A vast desert valley of red dunes and rock formations, explored by jeep or camel." },
      { name: "Dead Sea", description: "The lowest point on Earth, where the high salt content makes floating effortless." },
      { name: "Jerash", description: "One of the best-preserved Roman provincial cities outside Italy." },
      { name: "Amman Citadel", description: "Ruins overlooking the capital, spanning Roman, Byzantine, and Islamic periods." },
      { name: "Aqaba", description: "Jordan's Red Sea port, with coral reef diving a short trip from Petra." },
    ],
    foodIntro: "Jordanian food centers on slow-cooked meat, rice, and shared mezze plates.",
    dishes: [
      { name: "Mansaf", description: "Lamb cooked in fermented dried yogurt over rice -- Jordan's national dish." },
      { name: "Falafel & hummus", description: "Street-food staples, found at stalls across Amman." },
      { name: "Knafeh", description: "A sweet, cheese-filled pastry soaked in syrup, popular for dessert." },
      { name: "Bedouin tea", description: "Sweet, sage-infused tea served at Wadi Rum desert camps." },
    ],
    hotels: [
      { name: "Petra boutique hotels", tier: "Historic", description: "Stays walking distance from the Siq entrance to the ancient city." },
      { name: "Wadi Rum desert camps", tier: "Desert", description: "Bedouin-style tents under some of the clearest skies in the region." },
      { name: "Dead Sea resorts", tier: "Resort", description: "Spa resorts along the shoreline, built for float-and-relax stops." },
    ],
    itinerary: [
      { title: "Day 1: Amman & Jerash", description: "The Citadel, downtown Amman, and the Roman ruins at Jerash." },
      { title: "Day 2-3: Petra", description: "Two full days to see the Treasury, Monastery, and back canyons properly." },
      { title: "Day 4: Wadi Rum", description: "A jeep tour and overnight in a desert camp under the stars." },
      { title: "Day 5: Dead Sea", description: "Float, mud treatment, and a spa afternoon before flying home." },
    ],
    bestTime: "March-May and September-November for mild desert temperatures.",
    tips: {
      currency: "Jordanian Dinar (JOD). Cards accepted in cities; cash useful in Petra and Wadi Rum.",
      transport: "Private drivers or rental cars cover the Amman-Petra-Wadi Rum-Dead Sea route easily.",
      safety: "One of the more stable and safe countries in the region for travelers.",
      language: "Arabic; English is widely spoken in tourism.",
    },
    faqs: [
      { q: "How many days does Petra need?", a: "At least a full day, ideally two, to see beyond the Treasury into the Monastery and back trails." },
      { q: "Can I do Jordan as a short trip?", a: "Yes -- 5 days covers Amman, Petra, Wadi Rum, and the Dead Sea comfortably." },
      { q: "Is Jordan safe to visit?", a: "Yes, it's considered one of the safest countries in the Middle East for tourism." },
      { q: "Should I stay overnight in Wadi Rum?", a: "Highly recommended -- the desert camp experience and stargazing are a highlight." },
    ],
  },

  oman: {
    whyChoose:
      "Oman offers mountains, wadis, and coastline without the crowds of its Gulf neighbors -- a quieter, more traditional alternative for desert and coastal travel.",
    whyVisit: [
      { title: "Dramatic, uncrowded landscapes", description: "The Hajar Mountains and wadis feel wide open compared to the region's busier destinations." },
      { title: "A capital that keeps its character", description: "Muscat blends traditional architecture with a low-rise, walkable feel." },
      { title: "Wadi swimming", description: "Turquoise mountain pools like Wadi Shab are a signature Omani experience." },
      { title: "Desert camping in Wahiba Sands", description: "Rolling dunes and Bedouin camps, less commercialized than nearby Gulf deserts." },
    ],
    attractions: [
      { name: "Sultan Qaboos Grand Mosque", description: "Muscat's monumental mosque, open to non-Muslim visitors during set hours." },
      { name: "Wadi Shab", description: "A hike and swim through canyon pools to a hidden cave waterfall." },
      { name: "Wahiba Sands", description: "Desert dunes for 4x4 driving and overnight Bedouin camps." },
      { name: "Nizwa Fort", description: "A restored 17th-century fort and one of Oman's most-visited historic sites." },
      { name: "Jebel Akhdar", description: "The 'Green Mountain,' with terraced rose and pomegranate farms." },
      { name: "Muttrah Souq", description: "Muscat's old market, dense with frankincense, spices, and silver." },
    ],
    foodIntro: "Omani food is subtly spiced, built around rice, grilled meat, and dates.",
    dishes: [
      { name: "Shuwa", description: "Slow-cooked, spiced lamb traditionally buried and cooked underground for special occasions." },
      { name: "Omani halwa", description: "A dense, syrup-based sweet flavored with cardamom and rosewater." },
      { name: "Kahwa & dates", description: "Cardamom coffee served with dates, the standard gesture of hospitality." },
      { name: "Grilled fish, Muscat coast", description: "Fresh catch from the Gulf of Oman, simply prepared." },
    ],
    hotels: [
      { name: "Muscat waterfront hotels", tier: "City", description: "Coastal stays close to the Grand Mosque and old town." },
      { name: "Wahiba Sands desert camps", tier: "Desert", description: "Tented camps for overnight dune stays." },
      { name: "Jebel Akhdar mountain resorts", tier: "Mountain", description: "Clifftop stays above the terraced green mountain." },
    ],
    itinerary: [
      { title: "Day 1-2: Muscat", description: "The Grand Mosque, Muttrah Souq, and the corniche." },
      { title: "Day 3: Nizwa & Jebel Akhdar", description: "The fort, mountain terraces, and a cooler-air overnight." },
      { title: "Day 4: Wadi Shab", description: "A canyon hike and swim en route to the desert." },
      { title: "Day 5: Wahiba Sands", description: "Dune driving and an overnight Bedouin camp." },
    ],
    bestTime: "October-April for comfortable temperatures across the coast and desert.",
    tips: {
      currency: "Omani Rial (OMR). Cards widely accepted in Muscat; cash useful elsewhere.",
      transport: "Rental car recommended for wadis and desert routes; taxis cover Muscat.",
      safety: "Very safe and stable; dress modestly, especially at religious sites.",
      language: "Arabic; English is widely spoken in tourism and business.",
    },
    faqs: [
      { q: "Is Oman good for a first Middle East trip?", a: "Yes -- it's stable, welcoming, and less crowded than nearby Gulf destinations." },
      { q: "Do I need a 4x4?", a: "Recommended for Wahiba Sands and some wadi routes; not required for Muscat or Nizwa." },
      { q: "What should I wear?", a: "Modest clothing is expected, particularly at mosques and in rural areas." },
      { q: "How many days do I need?", a: "5-7 days covers Muscat, the mountains, and the desert well." },
    ],
  },

  qatar: {
    whyChoose:
      "Qatar is built for a stopover done right -- Doha's skyline, museums, and desert day trips fit neatly into a layover of any length.",
    whyVisit: [
      { title: "A stopover that's a destination", description: "Doha's proximity to Hamad International makes even a 24-hour layover worthwhile." },
      { title: "World-class museums", description: "The Museum of Islamic Art and National Museum rank among the region's best." },
      { title: "Desert within city limits", description: "Dune bashing and camel rides are a short drive from downtown." },
      { title: "A compact, walkable waterfront", description: "The Corniche links the skyline to the old town in one easy walk." },
    ],
    attractions: [
      { name: "Museum of Islamic Art", description: "I.M. Pei's waterfront museum, housing centuries of Islamic art and design." },
      { name: "Souq Waqif", description: "A restored traditional market of alleys, spice stalls, and falconry shops." },
      { name: "The Pearl-Qatar", description: "A man-made island of marinas, boutiques, and waterfront dining." },
      { name: "Inland Sea (Khor Al Adaid)", description: "A desert-meets-sea landscape reached by 4x4 dune drive." },
      { name: "Doha Corniche", description: "A sweeping waterfront promenade with skyline views." },
      { name: "National Museum of Qatar", description: "A desert-rose-inspired building tracing the country's history and heritage." },
    ],
    foodIntro: "Doha's food scene blends traditional Qatari dishes with a genuinely international restaurant scene.",
    dishes: [
      { name: "Machboos", description: "Spiced rice with meat or fish, Qatar's signature dish." },
      { name: "Karak tea", description: "Strong, spiced milk tea, a Souq Waqif staple." },
      { name: "Balaleet", description: "Sweet vermicelli with saffron and cardamom, often topped with egg." },
      { name: "International fine dining", description: "Doha's chef-driven restaurant scene rivals other major global cities." },
    ],
    hotels: [
      { name: "West Bay skyline hotels", tier: "City", description: "High-rise stays close to the business district and Corniche." },
      { name: "The Pearl-Qatar resorts", tier: "Resort", description: "Marina-front stays with boutique shopping nearby." },
      { name: "Desert camp experiences", tier: "Desert", description: "Overnight tented stays at the Inland Sea for a change of pace." },
    ],
    itinerary: [
      { title: "Day 1: Doha city", description: "The Museum of Islamic Art, the Corniche, and Souq Waqif in the evening." },
      { title: "Day 2: Desert day trip", description: "Dune bashing and the Inland Sea, back in the city by night." },
      { title: "Day 3: The Pearl & National Museum", description: "Waterfront shopping and the National Museum's architecture." },
    ],
    bestTime: "November-March for comfortable outdoor temperatures; summer months are extremely hot.",
    tips: {
      currency: "Qatari Riyal (QAR). Cards widely accepted.",
      transport: "The Doha Metro and taxis cover the city easily; a driver is best for desert trips.",
      safety: "Very safe; low crime rate and modern infrastructure throughout.",
      language: "Arabic; English is widely spoken and used in business and tourism.",
    },
    faqs: [
      { q: "Is Qatar good for a layover?", a: "Yes -- even 24 hours is enough to see the Corniche, a museum, and Souq Waqif." },
      { q: "Do I need a visa?", a: "Many nationalities get visa-free entry or an easy e-visa; check requirements ahead." },
      { q: "Is the desert day trip worth it?", a: "Yes, especially the Inland Sea -- a striking, easy add-on from the city." },
      { q: "What should I wear in public?", a: "Modest dress is expected outside hotel pools and beach clubs." },
    ],
  },

  australia: {
    whyChoose:
      "Australia spreads coastline, outback, and cities across a continent -- Sydney's harbor and the Great Barrier Reef alone justify the long flight.",
    whyVisit: [
      { title: "Iconic cities on the water", description: "Sydney's harbor and Melbourne's laneways anchor very different visits." },
      { title: "A reef unlike anywhere else", description: "The Great Barrier Reef is the largest living structure on Earth." },
      { title: "Outback scale", description: "Uluru and the Red Centre offer landscapes and Indigenous culture found nowhere else." },
      { title: "A wine and food culture of its own", description: "The Barossa Valley and Margaret River rank among the world's top wine regions." },
    ],
    attractions: [
      { name: "Sydney Opera House & Harbour Bridge", description: "Australia's most recognized skyline, best seen from a harbor ferry." },
      { name: "Great Barrier Reef", description: "Snorkel or dive the world's largest coral reef system from Cairns or the Whitsundays." },
      { name: "Uluru", description: "A sacred sandstone monolith in the Red Centre, best seen at sunrise and sunset." },
      { name: "Great Ocean Road", description: "A coastal drive past the Twelve Apostles rock formations near Melbourne." },
      { name: "Bondi to Coogee coastal walk", description: "A clifftop walk between Sydney's most famous beaches." },
      { name: "Daintree Rainforest", description: "The world's oldest tropical rainforest, where reef meets jungle in Far North Queensland." },
    ],
    foodIntro: "Australian food draws on British roots, waves of immigration, and some of the world's best produce and coffee.",
    dishes: [
      { name: "Flat white coffee", description: "An Australian cafe staple now found worldwide, best had in Melbourne." },
      { name: "Fresh seafood", description: "Barramundi, prawns, and oysters, especially strong along the coasts." },
      { name: "Meat pies", description: "A handheld savory pastry, an everyday Australian classic." },
      { name: "Barossa & Margaret River wine", description: "Two of the country's leading wine regions, both worth a dedicated day." },
    ],
    hotels: [
      { name: "Sydney harbor hotels", tier: "City", description: "Stays with Opera House or bridge views close to Circular Quay." },
      { name: "Cairns & Whitsundays resorts", tier: "Resort", description: "Reef-access stays for diving and island hopping." },
      { name: "Outback lodges, Uluru", tier: "Desert", description: "Red Centre stays positioned for sunrise and sunset viewing." },
    ],
    itinerary: [
      { title: "Day 1-3: Sydney", description: "The Opera House, Harbour Bridge climb, and Bondi to Coogee walk." },
      { title: "Day 4-6: Great Barrier Reef", description: "Fly to Cairns or the Whitsundays for diving and island time." },
      { title: "Day 7-8: Uluru", description: "Sunrise and sunset at the rock, plus Indigenous cultural tours." },
    ],
    bestTime: "September-November and March-May for mild weather across most of the country.",
    tips: {
      currency: "Australian Dollar (AUD). Tipping is not customary but appreciated for great service.",
      transport: "Domestic flights for long distances -- the country is vast, distances are often underestimated.",
      safety: "Very safe; sun protection and reef/ocean safety are the main practical concerns.",
      language: "English.",
    },
    faqs: [
      { q: "Can I do Sydney, the Reef, and Uluru in one trip?", a: "Yes, but budget 10-14 days -- the distances between them are significant." },
      { q: "Best base for the Great Barrier Reef?", a: "Cairns for reef access and rainforest; the Whitsundays for island sailing." },
      { q: "Is Uluru worth the detour?", a: "Yes -- it's a singular landscape and important Indigenous cultural site." },
      { q: "How far is Melbourne from Sydney?", a: "About 1.5 hours by flight; both are worth including if time allows." },
    ],
  },

  "new-zealand": {
    whyChoose:
      "New Zealand is built for driving slowly -- fjords, glaciers, and coastline connected by roads designed to be stopped on, not rushed through.",
    whyVisit: [
      { title: "Landscapes that don't repeat", description: "Fjords, glaciers, geothermal fields, and beaches all sit within a few hours of each other." },
      { title: "A country built for road trips", description: "Well-maintained roads and frequent lookout points reward slow travel." },
      { title: "Adventure at every level", description: "From gentle hikes to bungee jumping, both islands cater to any pace." },
      { title: "Maori culture, genuinely present", description: "Indigenous heritage is woven into place names, tours, and daily life, not just museums." },
    ],
    attractions: [
      { name: "Milford Sound", description: "A fjord of waterfalls and steep cliffs, best seen by boat cruise." },
      { name: "Franz Josef & Fox Glaciers", description: "Accessible glaciers on the South Island's West Coast, some tours include ice walks." },
      { name: "Rotorua geothermal fields", description: "Bubbling mud pools and geysers, alongside strong Maori cultural experiences." },
      { name: "Queenstown", description: "The adventure capital -- bungee jumping, jet boating, and lake views in one town." },
      { name: "Hobbiton", description: "The Lord of the Rings/Hobbit film set, preserved as a working attraction." },
      { name: "Abel Tasman coastal track", description: "Golden beaches and turquoise water on one of the country's Great Walks." },
    ],
    foodIntro: "New Zealand food leans on fresh seafood, lamb, and a coffee and wine culture on par with Australia's.",
    dishes: [
      { name: "Lamb", description: "Grass-fed and widely considered among the best in the world." },
      { name: "Green-lipped mussels", description: "A native shellfish, often served simply steamed with white wine." },
      { name: "Hangi", description: "A traditional Maori method of cooking food in an earth oven." },
      { name: "Central Otago wine", description: "Pinot noir country around Queenstown, best paired with a vineyard lunch." },
    ],
    hotels: [
      { name: "Queenstown lakeside hotels", tier: "Alpine", description: "Mountain and lake-view stays close to the adventure sports hub." },
      { name: "Rotorua geothermal resorts", tier: "Resort", description: "Stays with on-site hot pools fed by the region's geothermal activity." },
      { name: "Milford Sound lodges", tier: "Remote", description: "Fjordland stays positioned for early cruise departures." },
    ],
    itinerary: [
      { title: "Day 1-2: Auckland & Rotorua", description: "City arrival, then geothermal fields and Maori cultural experiences." },
      { title: "Day 3-4: Queenstown", description: "Adventure sports, lake cruises, and wine country day trips." },
      { title: "Day 5-6: Milford Sound & Fiordland", description: "A scenic drive and fjord cruise through Fiordland National Park." },
      { title: "Day 7: Franz Josef Glacier", description: "Glacier walks or helicopter tours on the return north." },
    ],
    bestTime: "December-February (summer) for hiking and Great Walks; June-August for skiing around Queenstown.",
    tips: {
      currency: "New Zealand Dollar (NZD). Cards widely accepted, including contactless.",
      transport: "Self-driving is the standard way to see the country -- distances are manageable and roads well-marked.",
      safety: "Very safe; weather can change quickly in the mountains, so check conditions before hikes.",
      language: "English and Maori, both official languages.",
    },
    faqs: [
      { q: "North or South Island?", a: "The South Island has the bigger-name landscapes (fjords, glaciers); the North has Rotorua and Hobbiton. Both if you have 10+ days." },
      { q: "Do I need to book Milford Sound cruises ahead?", a: "Yes, especially in summer -- morning departures sell out first." },
      { q: "Is New Zealand good for a road trip?", a: "It's one of the best -- roads are well-maintained and scenic stops are frequent." },
      { q: "How many days for both islands?", a: "12-14 days lets you cover the highlights of both without rushing." },
    ],
  },

  fiji: {
    whyChoose:
      "Fiji is built for island-hopping and reef diving in the South Pacific -- warm water, easy transfers between islands, and some of the friendliest hospitality anywhere.",
    whyVisit: [
      { title: "Island-hopping made simple", description: "Seaplanes and ferries connect the Mamanuca and Yasawa island groups easily from Nadi." },
      { title: "World-class soft coral diving", description: "Fiji is known as the 'Soft Coral Capital of the World.'" },
      { title: "A range of island styles", description: "Backpacker islands, honeymoon resorts, and family-friendly reefs, all within reach." },
      { title: "Genuine Fijian hospitality", description: "The 'Bula' welcome culture is a real, felt part of every stay." },
    ],
    attractions: [
      { name: "Mamanuca Islands", description: "A cluster of resort islands close to Nadi, easy for day trips or short stays." },
      { name: "Yasawa Islands", description: "A quieter, more remote island chain reached by ferry, known for clear water." },
      { name: "Sabeto mud pools & hot springs", description: "Natural mud baths and volcanic hot springs near Nadi." },
      { name: "Cloud 9 floating platform", description: "A floating bar and pizza deck anchored in open water, popular for a day out." },
      { name: "Taveuni's waterfalls", description: "Fiji's 'Garden Island,' known for rainforest hikes and Bouma Falls." },
      { name: "Beqa Lagoon", description: "Shark diving and soft coral reefs off Fiji's main island." },
    ],
    foodIntro: "Fijian food blends Pacific Islander, Indian, and Chinese influence, built around fresh fish and root vegetables.",
    dishes: [
      { name: "Kokoda", description: "Fiji's version of ceviche, raw fish marinated in coconut cream and citrus." },
      { name: "Lovo feast", description: "Meat and vegetables slow-cooked in an underground earth oven, often for celebrations." },
      { name: "Cassava & taro", description: "Root vegetable staples served at most traditional meals." },
      { name: "Kava", description: "A traditional ceremonial drink, shared as a welcome ritual in villages." },
    ],
    hotels: [
      { name: "Mamanuca island resorts", tier: "Resort", description: "Overwater and beachfront bungalows a short boat ride from Nadi." },
      { name: "Yasawa Islands eco-resorts", tier: "Boutique", description: "Smaller, quieter island stays further from the mainland." },
      { name: "Denarau Island hotels", tier: "Resort", description: "A resort strip near Nadi, convenient for arrival and departure days." },
    ],
    itinerary: [
      { title: "Day 1: Nadi arrival", description: "Settle in, visit the Sabeto mud pools and hot springs." },
      { title: "Day 2-4: Mamanuca Islands", description: "Island-hop by boat, snorkel the reefs, and relax between resorts." },
      { title: "Day 5-7: Yasawa Islands", description: "A quieter island chain for diving, hiking, and village visits." },
    ],
    bestTime: "May-October (dry season) for the most reliable sunshine and lower humidity.",
    tips: {
      currency: "Fijian Dollar (FJD). Cards accepted at resorts; cash useful for local markets.",
      transport: "Boat transfers and seaplanes connect the islands; Nadi is the main international gateway.",
      safety: "Very safe and welcoming; standard water and sun safety precautions apply.",
      language: "English, Fijian, and Fiji Hindi are all widely spoken.",
    },
    faqs: [
      { q: "Which island group should I pick?", a: "Mamanuca for closer, easier access; Yasawa for a quieter, more remote feel." },
      { q: "How do I get between islands?", a: "Regular boat transfers and seaplanes run from Nadi's marina and airport." },
      { q: "Is Fiji good for honeymoons?", a: "Yes -- it's one of the South Pacific's most popular honeymoon destinations for exactly this reason." },
      { q: "Best time to avoid cyclone season?", a: "May-October falls outside the November-April cyclone season." },
    ],
  },

  japan: {
    whyChoose:
      "Japan runs on a rail network that makes a two-week trip feel effortless -- Tokyo to Kyoto in just over two hours, with mountain towns, hot springs and island coastlines branching off the same ticket.",
    whyVisit: [
      { title: "The trains change the trip", description: "Shinkansen services run to the minute, so day trips that look ambitious on a map are genuinely easy." },
      { title: "Four distinct seasons", description: "Cherry blossom, humid green summers, maple colour, and powder snow -- each one a different country." },
      { title: "Food at every price", description: "A standing noodle bar and a three-star counter are held to the same standards of care." },
      { title: "Cities and silence, close together", description: "An hour from Tokyo's crossings you can be in cedar forest with nothing but a shrine bell." },
    ],
    attractions: [
      { name: "Fushimi Inari, Kyoto", description: "Thousands of vermilion gates climbing a wooded hillside. Go at dawn or after dark to have stretches of it alone." },
      { name: "Shibuya and Shinjuku, Tokyo", description: "The scramble crossing, the yokocho alleys behind the station, and neon that photographs better in the rain." },
      { name: "Nara Park", description: "Free-roaming deer around Todai-ji and its enormous bronze Buddha, forty minutes from Kyoto." },
      { name: "Hakone and Mount Fuji", description: "Ropeways, a pirate-ship lake crossing, and Fuji views on the days the mountain is out." },
      { name: "Miyajima", description: "The floating torii gate at Itsukushima, best at high tide, an easy add-on from Hiroshima." },
      { name: "Kanazawa", description: "Kenroku-en garden, a preserved samurai district, and gold-leaf everything -- the Kyoto alternative without the queues." },
    ],
    foodIntro: "Regional specialisation runs deep: the same dish is made differently three prefectures apart, and locals will tell you which version is correct.",
    dishes: [
      { name: "Sushi", description: "At a counter, in season, priced by what came in that morning -- nothing like the supermarket version." },
      { name: "Ramen", description: "Tonkotsu in Fukuoka, miso in Sapporo, shoyu in Tokyo. Regional, not interchangeable." },
      { name: "Okonomiyaki", description: "A savoury cabbage pancake, griddled at your table. Osaka mixes it; Hiroshima layers it." },
      { name: "Kaiseki", description: "A multi-course seasonal meal that is as close to fine art as dinner gets." },
    ],
    hotels: [
      { name: "Ryokan with onsen", description: "Tatami rooms, futon bedding, and a hot-spring bath -- worth at least one night, ideally in Hakone or Kinosaki.", tier: "Traditional" },
      { name: "Tokyo business hotels", description: "Small, spotless, well-located rooms near a station. The efficient default for city nights.", tier: "Mid-range" },
      { name: "Kyoto machiya townhouses", description: "Restored wooden merchant houses in the old lanes, usually rented whole.", tier: "Boutique" },
    ],
    itinerary: [
      { title: "Day 1-4: Tokyo", description: "Neighbourhood by neighbourhood -- Asakusa, Shibuya, Shimokitazawa -- plus a day trip to Hakone or Nikko." },
      { title: "Day 5-8: Kyoto", description: "Temples early to beat the crowds, Nishiki market at midday, and Nara or Osaka as day trips." },
      { title: "Day 9-11: Hiroshima and Miyajima", description: "The Peace Memorial, then the island for the torii and a night with the day-trippers gone." },
      { title: "Day 12-14: Kanazawa or the Alps", description: "Garden, samurai district and seafood, or hike between the thatched villages of Shirakawa-go." },
    ],
    bestTime: "Late March to early April for blossom and October to November for maple colour -- both busy and worth it. June is rainy season; August is genuinely hot and humid.",
    tips: {
      currency: "Japanese yen (JPY). Cash still matters at small restaurants and shrines, though cards are now widely taken in cities.",
      transport: "A Japan Rail Pass pays off only on long multi-city routes -- price your actual itinerary first, as it no longer wins by default. IC cards (Suica/ICOCA) cover local transit.",
      safety: "Among the safest countries to travel in, including alone and at night.",
      language: "Japanese. English signage is good on transport and thin elsewhere; a translation app earns its keep.",
    },
    faqs: [
      { q: "How many days do I need?", a: "10-14 days covers Tokyo, Kyoto and one or two additions comfortably. A week means Tokyo and Kyoto only." },
      { q: "Is the Japan Rail Pass still worth it?", a: "Only for long routes. Since the price rise it loses to individual tickets on many itineraries -- add up your legs before buying." },
      { q: "Do I need to speak Japanese?", a: "No. Transport is navigable in English and translation apps handle menus, though a few polite phrases go a long way." },
      { q: "Is it expensive?", a: "Less than most visitors expect. Food and transport are good value; accommodation in peak blossom season is where costs spike." },
    ],
  },

  thailand: {
    whyChoose:
      "Thailand is the easiest introduction to Southeast Asia: cheap internal flights, genuinely good infrastructure, and three completely different trips -- city, mountains, islands -- inside one country.",
    whyVisit: [
      { title: "Value that goes a long way", description: "Street meals, massages and domestic flights cost a fraction of European equivalents." },
      { title: "Two coastlines, two seasons", description: "When the Andaman side is wet, the Gulf side is usually dry -- there is nearly always a good beach somewhere." },
      { title: "Food worth planning around", description: "Regional cooking varies sharply between the north, the northeast and the south." },
      { title: "Easy to combine", description: "Bangkok is a major hub, so pairing Thailand with Vietnam, Cambodia or Japan is straightforward." },
    ],
    attractions: [
      { name: "Grand Palace and Wat Pho, Bangkok", description: "The royal complex and the reclining Buddha. Strict dress code -- shoulders and knees covered." },
      { name: "Chiang Mai's old city", description: "A moated square of temples, night markets and cooking schools, with mountains starting at the edge of town." },
      { name: "Railay and Krabi", description: "Limestone towers straight out of the sea, reachable only by longtail boat." },
      { name: "Ayutthaya", description: "The ruined former capital, an easy day trip north of Bangkok by train." },
      { name: "Elephant sanctuaries, Chiang Mai", description: "Choose observation-only, no-riding projects -- the distinction matters for the animals." },
      { name: "Ko Lipe and the southern islands", description: "Clearer water and fewer crowds than Phuket, at the cost of a longer journey." },
    ],
    foodIntro: "Thai cooking balances hot, sour, salty and sweet in every dish -- and the best version is usually from a cart, not a restaurant.",
    dishes: [
      { name: "Som tam", description: "Green papaya salad pounded to order. Say how much chilli you actually want; the default is not gentle." },
      { name: "Khao soi", description: "Northern curry noodle soup with crisp noodles on top. A Chiang Mai speciality worth the trip." },
      { name: "Massaman curry", description: "Mild, rich, and Persian-influenced -- the entry point for anyone avoiding heat." },
      { name: "Mango sticky rice", description: "Sweet coconut rice with ripe mango. Best from March to May when mangoes peak." },
    ],
    hotels: [
      { name: "Bangkok riverside hotels", description: "River-facing rooms with boat access, away from the traffic on the road side.", tier: "Luxury" },
      { name: "Chiang Mai boutique guesthouses", description: "Small teak-and-garden places inside or just outside the old city walls.", tier: "Boutique" },
      { name: "Island beach bungalows", description: "Simple huts a few steps from the sand, from basic fan rooms to air-conditioned villas.", tier: "Beach" },
    ],
    itinerary: [
      { title: "Day 1-3: Bangkok", description: "Temples in the morning, canal boat in the afternoon, and a rooftop or a night market after dark." },
      { title: "Day 4-6: Chiang Mai", description: "Old city temples, a cooking class, and a day in the hills or at an ethical elephant project." },
      { title: "Day 7-10: Andaman coast", description: "Fly to Krabi or Phuket, then boat out to Railay, Ko Lanta or Ko Phi Phi." },
      { title: "Day 11-14: Slow down", description: "Pick one island and stay put, or loop back through Ayutthaya on the way to Bangkok." },
    ],
    bestTime: "November to February is the cool dry season nationwide and the peak. March to May is very hot. The rainy season differs by coast, so check your specific islands rather than the country.",
    tips: {
      currency: "Thai baht (THB). Cash rules outside cities and resorts; ATMs charge a fixed foreign-card fee per withdrawal, so take out larger amounts less often.",
      transport: "Domestic flights are cheap and quick. Overnight trains and buses work for Chiang Mai; boats connect the islands on published schedules.",
      safety: "Generally very safe. The real risks are road traffic and scooter injuries -- check your insurance actually covers riding one.",
      language: "Thai. English is widely spoken in tourist areas, less so in the northeast.",
    },
    faqs: [
      { q: "Which islands should I pick?", a: "Gulf side (Ko Samui, Ko Tao) roughly February to September; Andaman side (Krabi, Ko Lanta) roughly November to April." },
      { q: "Is street food safe?", a: "Generally yes -- busy stalls with high turnover are the ones to trust. Cooked-to-order beats anything sitting out." },
      { q: "Do I need vaccinations?", a: "Check with a travel clinic several weeks ahead; requirements depend on your route and how rural you are going." },
      { q: "How much should I budget?", a: "It stretches unusually far, but Bangkok and the resort islands cost several times what the north does." },
    ],
  },

  indonesia: {
    whyChoose:
      "Indonesia is 17,000 islands with genuinely different cultures on each -- Bali's temples and rice terraces, Java's volcanoes, Komodo's dragons and Raja Ampat's reefs are all the same country and all completely unalike.",
    whyVisit: [
      { title: "Volcano landscapes", description: "Sunrise over Bromo's caldera and the blue flames of Ijen are unlike anything in Southeast Asia." },
      { title: "Diving and snorkelling at the top tier", description: "Raja Ampat and Komodo sit inside the Coral Triangle, the most biodiverse marine region on earth." },
      { title: "Living Balinese culture", description: "Daily offerings, temple ceremonies and gamelan are part of ordinary life, not put on for visitors." },
      { title: "It goes a long way", description: "Villas, food and drivers cost a fraction of comparable destinations." },
    ],
    attractions: [
      { name: "Borobudur and Prambanan, Java", description: "A ninth-century Buddhist monument and a Hindu temple complex, both near Yogyakarta." },
      { name: "Mount Bromo", description: "An active cone inside a sea of volcanic sand. The standard pre-dawn viewpoint trip is worth the early start." },
      { name: "Ubud, Bali", description: "Rice terraces, craft villages and the monkey forest, with the island's best food scene." },
      { name: "Komodo National Park", description: "Komodo dragons, pink-sand beaches and Manta Point, usually as a liveaboard from Labuan Bajo." },
      { name: "Raja Ampat", description: "Remote, expensive to reach, and consistently rated among the best diving anywhere." },
      { name: "Tanah Lot and Uluwatu", description: "Clifftop and offshore temples on Bali's west and south coasts, at their best at sunset." },
    ],
    foodIntro: "Indonesian food is built on rice, chilli and slow-cooked spice pastes, with each island claiming its own version of the staples.",
    dishes: [
      { name: "Nasi goreng", description: "Fried rice with sweet soy, usually topped with a fried egg. The national default, done well everywhere." },
      { name: "Rendang", description: "Beef simmered for hours in coconut and spice until dry and dense. Sumatran in origin." },
      { name: "Babi guling", description: "Balinese spit-roast suckling pig -- a Bali speciality, since most of Indonesia is Muslim-majority." },
      { name: "Gado-gado", description: "Blanched vegetables, tofu and egg under a thick peanut sauce." },
    ],
    hotels: [
      { name: "Ubud jungle villas", description: "Private-pool villas over the river valley, often with staff and breakfast included.", tier: "Villa" },
      { name: "Gili and Nusa island bungalows", description: "Low-key beachfront rooms on the small islands off Bali and Lombok.", tier: "Beach" },
      { name: "Liveaboard boats", description: "The practical way to dive Komodo or Raja Ampat -- your cabin follows the reefs.", tier: "Dive" },
    ],
    itinerary: [
      { title: "Day 1-4: Bali south and Ubud", description: "Settle in on the coast, then move inland for temples, terraces and the food scene." },
      { title: "Day 5-7: Java volcanoes", description: "Fly to Surabaya or Yogyakarta for Bromo, Ijen and Borobudur." },
      { title: "Day 8-11: Komodo", description: "Fly to Labuan Bajo and take a liveaboard or day boats out to the park." },
      { title: "Day 12-14: Islands", description: "Finish slowly on the Gilis, Nusa Penida or Lombok's south coast." },
    ],
    bestTime: "April to October is the dry season and the reliable window. Diving in Raja Ampat is best October to April, which runs opposite -- check the specific island, not the country.",
    tips: {
      currency: "Indonesian rupiah (IDR). Large denominations mean prices look alarming at first; cards work in Bali, far less elsewhere.",
      transport: "Domestic flights connect the islands; on Bali, hire a car with a driver for a day rather than self-driving. Scooters carry real risk.",
      safety: "Generally safe. Watch surf conditions and rip currents, and treat volcano access advisories as binding -- they change quickly.",
      language: "Indonesian, plus hundreds of local languages. English is common in Bali and thinner elsewhere.",
    },
    faqs: [
      { q: "Is Bali all there is?", a: "Bali is the easiest entry point, but Java, Flores and Sulawesi feel like different countries and see a fraction of the visitors." },
      { q: "Do I need a visa?", a: "Many nationalities get visa-on-arrival, but rules change -- check the current requirement for your passport before booking." },
      { q: "Is the water safe to drink?", a: "No. Stick to bottled or filtered water, including for brushing teeth." },
      { q: "How do I get between islands?", a: "Cheap domestic flights for long hops, fast boats for short ones like Bali to the Gilis." },
    ],
  },

  morocco: {
    whyChoose:
      "Morocco compresses more variety into short distances than almost anywhere: a medina morning, an afternoon over the Atlas passes, and a night in the Sahara are a realistic three days, not a fantasy itinerary.",
    whyVisit: [
      { title: "Four landscapes, one week", description: "Coast, imperial cities, mountains and desert are all within a day's drive of each other." },
      { title: "Craft you can watch being made", description: "Tanneries, zellige tilework and carpet weaving are still working trades, not museum pieces." },
      { title: "Close to Europe", description: "Three hours from most of Western Europe, with a completely different culture at the other end." },
      { title: "Sahara nights", description: "Camps in the Erg Chebbi dunes deliver some of the clearest star fields you will ever see." },
    ],
    attractions: [
      { name: "Jemaa el-Fnaa, Marrakech", description: "The main square, which turns from juice stalls by day to food smoke and storytellers after dark." },
      { name: "Fes el-Bali", description: "The world's largest car-free urban area, and a medina you should expect to get lost in." },
      { name: "Chefchaouen", description: "The blue-washed mountain town in the Rif -- small, photogenic and worth an overnight, not a day trip." },
      { name: "Erg Chebbi dunes", description: "Camel trek or 4x4 into the Sahara from Merzouga, staying overnight in a desert camp." },
      { name: "Ait Ben Haddou", description: "A fortified earthen village on the old caravan route, familiar from a long list of films." },
      { name: "Atlas Mountains", description: "Berber villages, walnut groves and trailheads for Toubkal, an hour from Marrakech." },
    ],
    foodIntro: "Moroccan cooking is slow and aromatic rather than hot -- preserved lemon, cumin, saffron and long cooking in clay.",
    dishes: [
      { name: "Tagine", description: "Named for the conical pot it steams in. Lamb with prunes and chicken with preserved lemon are the classics." },
      { name: "Couscous", description: "Traditionally the Friday meal, steamed three times and served under vegetables and broth." },
      { name: "Harira", description: "Tomato, lentil and chickpea soup, eaten to break the fast during Ramadan and year-round otherwise." },
      { name: "Mint tea", description: "Green tea, fresh mint and a lot of sugar, poured from height. Refusing a glass is genuinely rude." },
    ],
    hotels: [
      { name: "Riads", description: "Courtyard houses turned guesthouses inside the medina walls -- quiet, cool, and the authentic choice.", tier: "Traditional" },
      { name: "Desert camps", description: "From basic tents to heated suites with private bathrooms out in the dunes.", tier: "Desert" },
      { name: "Coastal resorts, Essaouira and Agadir", description: "Atlantic beach hotels, windier and cooler than the interior.", tier: "Resort" },
    ],
    itinerary: [
      { title: "Day 1-3: Marrakech", description: "Medina, Bahia Palace, the Majorelle garden, and a first evening on Jemaa el-Fnaa." },
      { title: "Day 4-5: Atlas and Ait Ben Haddou", description: "Cross the Tizi n'Tichka pass, stopping at the kasbah on the way to the desert." },
      { title: "Day 6-7: Sahara", description: "Merzouga, a camel trek at sunset, and a night under the stars at an Erg Chebbi camp." },
      { title: "Day 8-10: Fes", description: "The oldest medina, the tanneries, and the craft workshops -- allow more time than you think." },
    ],
    bestTime: "March to May and September to November. Summer inland is extremely hot -- Marrakech and the desert regularly pass 40C -- and the mountains get snow in winter.",
    tips: {
      currency: "Moroccan dirham (MAD), a closed currency you generally get on arrival rather than beforehand. Carry cash for medinas.",
      transport: "Trains are good between the northern cities, including a high-speed line to Tangier. For the desert, hire a driver -- the mountain passes are long days.",
      safety: "Broadly safe. Expect persistent sales pressure in the medinas; a polite, firm no is normal and not rude.",
      language: "Arabic and Amazigh, with French widely used in business and tourism. English is growing in tourist areas.",
    },
    faqs: [
      { q: "Marrakech or Fes?", a: "Marrakech is easier and better connected; Fes has the older, less commercial medina. A week comfortably fits both." },
      { q: "What should I wear?", a: "Modest dress -- shoulders and knees covered -- is respectful and draws less attention, particularly outside resorts." },
      { q: "Can I visit the Sahara in two days?", a: "You can, but it is a lot of driving. Three days makes it enjoyable rather than a road marathon." },
      { q: "Is it suitable for solo travellers?", a: "Yes, and widely done. Solo women should expect more attention and may prefer riads with airport pickup." },
    ],
  },

  tanzania: {
    whyChoose:
      "Tanzania holds the Serengeti, the Ngorongoro Crater, Africa's highest mountain and Zanzibar's reefs -- a safari and a beach week that need only one internal flight between them.",
    whyVisit: [
      { title: "The migration, year-round", description: "The herds move within the Serengeti all year, so there is always a region where the action is." },
      { title: "Ngorongoro Crater", description: "A collapsed caldera holding around 25,000 animals in one enclosed bowl -- extraordinary density." },
      { title: "Kilimanjaro", description: "The highest walkable summit in the world; no technical climbing, just altitude and time." },
      { title: "Zanzibar to finish", description: "Stone Town's history and white-sand beaches, a short hop from the safari circuit." },
    ],
    attractions: [
      { name: "Serengeti National Park", description: "Vast plains, big cats, and the migration. The northern Serengeti holds the Mara River crossings around July to October." },
      { name: "Ngorongoro Crater", description: "A half-day descent into the caldera, and one of the better chances anywhere of seeing black rhino." },
      { name: "Mount Kilimanjaro", description: "Five to nine days depending on route. Longer routes acclimatise better and summit more often." },
      { name: "Stone Town, Zanzibar", description: "A UNESCO maze of carved doors and Swahili, Omani and Indian influence." },
      { name: "Tarangire National Park", description: "Baobabs and very large elephant herds, quieter than the Serengeti and often skipped." },
      { name: "Mnemba Atoll", description: "Snorkelling and diving off Zanzibar's northeast, with dolphins and turtles regularly seen." },
    ],
    foodIntro: "Mainland cooking is built on grilled meat and maize staples; Zanzibar's is Swahili -- coconut, cardamom and cloves from the spice trade.",
    dishes: [
      { name: "Nyama choma", description: "Grilled meat, usually goat, eaten with the hands alongside ugali. The national social meal." },
      { name: "Ugali", description: "A stiff maize staple used to scoop stew and sauce -- the everyday accompaniment to almost everything." },
      { name: "Zanzibar pilau", description: "Rice slow-cooked with cinnamon, cloves and cumin, often with beef or chicken." },
      { name: "Urojo", description: "Zanzibar's tangy mango-and-turmeric street soup, loaded with fritters and crisps." },
    ],
    hotels: [
      { name: "Serengeti tented camps", description: "Canvas suites with proper beds and plumbing. Mobile camps follow the migration through the year.", tier: "Safari" },
      { name: "Crater rim lodges", description: "Lodges on the Ngorongoro rim with the caldera below you at breakfast.", tier: "Lodge" },
      { name: "Zanzibar beach resorts", description: "From simple bungalows on the east coast to full resorts in the north at Nungwi and Kendwa.", tier: "Beach" },
    ],
    itinerary: [
      { title: "Day 1-2: Arusha and Tarangire", description: "Arrive at Kilimanjaro airport, then baobabs and elephants as a gentle opening." },
      { title: "Day 3-4: Ngorongoro", description: "Stay on the rim and descend into the crater for a full game-viewing day." },
      { title: "Day 5-7: Serengeti", description: "Two or three nights, positioned in whichever region the herds are in that month." },
      { title: "Day 8-11: Zanzibar", description: "Fly out from the Serengeti, a night in Stone Town, then the coast." },
    ],
    bestTime: "June to October is dry season and the strongest overall window, and covers the Mara River crossings. January to February is calving season in the southern Serengeti. Long rains fall March to May.",
    tips: {
      currency: "Tanzanian shilling (TZS); US dollars are accepted for park fees and lodges. Bring newer dollar notes -- older ones are often refused.",
      transport: "Light aircraft between the parks and Zanzibar saves whole days over driving, with a strict soft-bag luggage allowance.",
      safety: "Safe on the standard circuits with a guide. Altitude is the real risk on Kilimanjaro -- pick a longer route.",
      language: "Swahili and English, both official. English is widely used in tourism.",
    },
    faqs: [
      { q: "Tanzania or Kenya for safari?", a: "Tanzania has larger parks and higher park fees; Kenya is cheaper to reach and easier for short trips. Both see the same migration at different points." },
      { q: "How fit must I be for Kilimanjaro?", a: "Good general fitness plus altitude tolerance. Success depends far more on route length and pace than on athleticism." },
      { q: "Are park fees included in tour prices?", a: "Not always, and they are substantial. Ask explicitly before comparing quotes." },
      { q: "Do I need a yellow fever certificate?", a: "It depends on the countries you transit. Check current requirements with a travel clinic well before departure." },
    ],
  },

  "united-arab-emirates": {
    whyChoose:
      "The UAE works as a destination and as a stopover: Dubai and Abu Dhabi are 90 minutes apart, the airport is one of the world's best connected, and desert, diving and mountains all sit within an easy drive.",
    whyVisit: [
      { title: "Built for stopovers", description: "Free or cheap transit visas for many nationalities, and enough to do to justify breaking a long-haul." },
      { title: "Desert on the doorstep", description: "Dune drives, camel farms and overnight camps start 45 minutes from central Dubai." },
      { title: "Winter sun", description: "November to March is warm, dry and pleasant while Europe is dark." },
      { title: "Genuinely good museums", description: "Louvre Abu Dhabi and the Museum of the Future are serious buildings, not just photo stops." },
    ],
    attractions: [
      { name: "Burj Khalifa", description: "The world's tallest building. Book At The Top for sunset well in advance -- that slot sells out first." },
      { name: "Sheikh Zayed Grand Mosque, Abu Dhabi", description: "White marble and inlaid flowers, holding 40,000 worshippers. Free entry with a strict dress code." },
      { name: "Louvre Abu Dhabi", description: "Jean Nouvel's perforated dome creating a 'rain of light' over the galleries." },
      { name: "Al Fahidi and the creek, Dubai", description: "Wind-tower houses, the gold and spice souks, and an abra crossing for a couple of dirhams." },
      { name: "Liwa and the Empty Quarter", description: "Some of the largest sand dunes on earth, a few hours inland from Abu Dhabi." },
      { name: "Hatta and the Hajar Mountains", description: "Wadis, a dam with kayaking, and mountain air an hour and a half from the city." },
    ],
    foodIntro: "Emirati food is the smaller part of a scene dominated by the region's diaspora -- Lebanese, Iranian, Indian and Pakistani cooking is where the city eats.",
    dishes: [
      { name: "Machboos", description: "Spiced rice with meat, dried lime and saffron -- the Emirati national dish." },
      { name: "Shawarma", description: "The default late-night meal, best from a busy street counter rather than a mall." },
      { name: "Luqaimat", description: "Crisp sweet dumplings soaked in date syrup, sold everywhere during Ramadan." },
      { name: "Karak chai", description: "Strong, sweet, evaporated-milk tea from a roadside cafeteria. A dirham or two, and a ritual." },
    ],
    hotels: [
      { name: "Beach resorts, Jumeirah and Saadiyat", description: "Full-service resorts on private sand, with the best rates outside the winter peak.", tier: "Resort" },
      { name: "Desert camps and retreats", description: "Conservation-reserve lodges within an hour of Dubai, from tented to genuinely luxurious.", tier: "Desert" },
      { name: "Downtown and Marina towers", description: "High-floor city rooms, often better value than the beach for a short stay.", tier: "City" },
    ],
    itinerary: [
      { title: "Day 1-2: Dubai", description: "Old town and the creek first, then Downtown, the Burj and the fountain show after dark." },
      { title: "Day 3: Desert", description: "Afternoon dune drive, dinner at camp, and the drive back under a genuinely dark sky." },
      { title: "Day 4-5: Abu Dhabi", description: "The Grand Mosque, Louvre Abu Dhabi, and the Corniche at sunset." },
      { title: "Day 6-7: Coast or mountains", description: "Snorkel or dive off Fujairah on the east coast, or take the wadis around Hatta." },
    ],
    bestTime: "November to March. Summer, roughly June to September, regularly exceeds 45C, and outdoor plans become impractical.",
    tips: {
      currency: "UAE dirham (AED), pegged to the US dollar. Cards are accepted virtually everywhere.",
      transport: "Dubai's metro is cheap and clean; taxis and ride-hailing are inexpensive. A car helps for Abu Dhabi, Hatta and the east coast.",
      safety: "Very low crime. Laws around alcohol, public behaviour and photographing people are stricter than in Europe -- worth reading before you go.",
      language: "Arabic is official; English is the working language nearly everywhere.",
    },
    faqs: [
      { q: "Is a stopover worth it?", a: "Yes -- two or three days covers Dubai's highlights, and many airlines offer discounted stopover hotel packages." },
      { q: "What should I wear?", a: "Beachwear is fine at resorts and pools; cover shoulders and knees in malls, souks and mosques." },
      { q: "Is alcohol available?", a: "Yes, in licensed hotels, bars and restaurants. Drinking in public or being drunk in public is an offence." },
      { q: "Dubai or Abu Dhabi?", a: "Dubai for shopping, nightlife and scale; Abu Dhabi for museums and a slower pace. They are close enough to do both." },
    ],
  },

  "saudi-arabia": {
    whyChoose:
      "Saudi Arabia only opened to general tourism in 2019, so its rock-cut tombs, Red Sea reefs and mountain villages still see a fraction of the visitors that comparable sites elsewhere draw.",
    whyVisit: [
      { title: "AlUla before the crowds", description: "Hegra's Nabataean tombs rival Petra's and you may share them with a handful of people." },
      { title: "Untouched Red Sea diving", description: "Reefs with very little dive pressure and visibility to match anything in Egypt." },
      { title: "Real regional variety", description: "Riyadh's desert, Jeddah's coral-stone old town and Asir's green mountains are three different countries in feel." },
      { title: "Straightforward entry now", description: "An online tourist e-visa covers many nationalities, where a decade ago there was no route in at all." },
    ],
    attractions: [
      { name: "Hegra (Mada'in Salih), AlUla", description: "Saudi's first UNESCO site -- more than a hundred monumental Nabataean tombs cut into sandstone outcrops." },
      { name: "Al-Balad, Jeddah", description: "The old town's coral-stone houses and carved wooden balconies, best explored in the evening." },
      { name: "Diriyah, Riyadh", description: "The mud-brick birthplace of the Saudi state, restored and floodlit at night." },
      { name: "Edge of the World", description: "An escarpment dropping abruptly onto an ancient seabed, about two hours from Riyadh by 4x4." },
      { name: "Farasan Islands", description: "Red Sea coral islands in the south with very few visitors and excellent snorkelling." },
      { name: "Asir Mountains and Rijal Almaa", description: "Green terraced highlands, cool air, and a village of painted stone tower houses." },
    ],
    foodIntro: "Saudi cooking centres on rice, slow-cooked lamb and dates, with strong Yemeni and Levantine influence in the cities.",
    dishes: [
      { name: "Kabsa", description: "Spiced rice with lamb or chicken, the national dish, usually shared from one large platter." },
      { name: "Mandi", description: "Meat and rice cooked in an underground oven until it falls apart. Yemeni in origin, Saudi by adoption." },
      { name: "Jareesh", description: "Crushed wheat slow-cooked with meat and yoghurt into a savoury porridge." },
      { name: "Dates and Arabic coffee", description: "Offered on arrival everywhere. Cardamom-heavy, lightly roasted, and served in small cups." },
    ],
    hotels: [
      { name: "AlUla desert resorts", description: "Canvas and stone retreats among the sandstone outcrops, some among the region's most striking builds.", tier: "Desert" },
      { name: "Jeddah Corniche hotels", description: "Sea-facing towers with easy access to Al-Balad and the dive boats.", tier: "City" },
      { name: "Red Sea dive lodges", description: "Simple, functional bases built around boat access rather than luxury.", tier: "Dive" },
    ],
    itinerary: [
      { title: "Day 1-2: Riyadh", description: "Diriyah, the National Museum, and a 4x4 day out to the Edge of the World." },
      { title: "Day 3-5: AlUla", description: "Hegra, Dadan, the old town and Elephant Rock, with a desert night in between." },
      { title: "Day 6-7: Jeddah", description: "Al-Balad on foot, the Corniche at sunset, and a day on the reefs." },
      { title: "Day 8-10: Asir or the Farasans", description: "Fly south for mountain villages, or out to the islands for snorkelling." },
    ],
    bestTime: "November to March. Summer inland is extreme, regularly above 45C, and the coastal humidity in Jeddah makes it worse.",
    tips: {
      currency: "Saudi riyal (SAR), pegged to the US dollar. Cards are widely accepted in cities.",
      transport: "Domestic flights link the regions; a high-speed train runs Jeddah to Medina. Ride-hailing works well in cities, and a 4x4 is needed for desert sites.",
      safety: "Low crime. Local law and custom are conservative -- respect photography restrictions, and note Mecca and Medina's central areas are closed to non-Muslims.",
      language: "Arabic. English is common in hotels, airports and among younger Saudis, thinner in rural areas.",
    },
    faqs: [
      { q: "Can tourists actually visit now?", a: "Yes. An online e-visa covers many nationalities and takes minutes, though you should confirm the current rules for your passport." },
      { q: "What do women need to wear?", a: "Abaya is no longer required for visitors, but modest dress covering shoulders and knees is expected. A headscarf is not required except in mosques." },
      { q: "Is AlUla better than Petra?", a: "Different -- Hegra is from the same Nabataean civilisation, smaller in scale but dramatically quieter." },
      { q: "Is alcohol available?", a: "No. Alcohol is prohibited throughout the country, including in hotels." },
    ],
  },

  turkey: {
    whyChoose:
      "Türkiye straddles two continents and reads like it: Byzantine and Ottoman Istanbul, Greek and Roman ruins along the Aegean, and the volcanic valleys of Cappadocia, all on one affordable itinerary.",
    whyVisit: [
      { title: "Istanbul is worth the trip alone", description: "Two continents, three empires' worth of monuments, and a ferry commute across the Bosphorus." },
      { title: "Cappadocia's balloons", description: "Hundreds of balloons over eroded rock valleys at sunrise -- as good as the photographs suggest." },
      { title: "Classical sites without the queues", description: "Ephesus is one of the best-preserved ancient cities anywhere, and far quieter than Italy's equivalents." },
      { title: "It goes a long way", description: "A favourable exchange rate makes food, transport and hotels notably good value." },
    ],
    attractions: [
      { name: "Hagia Sophia, Istanbul", description: "Cathedral, then mosque, then museum, now a mosque again -- 1,500 years of history in one dome." },
      { name: "Cappadocia", description: "Fairy chimneys, cave hotels, underground cities, and the balloon launch at first light." },
      { name: "Ephesus", description: "Marble streets, the Library of Celsus, and a theatre seating 25,000, near Selçuk." },
      { name: "Pamukkale", description: "White travertine terraces of mineral water, with the ruins of Hierapolis on the ridge above." },
      { name: "Topkapi Palace and the Grand Bazaar", description: "The Ottoman court, then one of the world's oldest covered markets, with 4,000 shops." },
      { name: "The Turquoise Coast", description: "Ölüdeniz, Kaş and Kalkan, plus the Lycian Way and gulet boats along the shoreline." },
    ],
    foodIntro: "Turkish cooking is regional and vegetable-forward as often as it is meat-based -- mezze, olive oil dishes and bread at every meal.",
    dishes: [
      { name: "Kebap", description: "Far more varied than the export version: Adana, İskender and şiş are each their own dish." },
      { name: "Meze", description: "Small cold plates -- aubergine, yoghurt, stuffed vine leaves -- shared before the main event." },
      { name: "Pide and lahmacun", description: "Boat-shaped flatbread with toppings, and a thin, crisp minced-lamb round rolled with lemon and parsley." },
      { name: "Baklava and Turkish coffee", description: "Layered pistachio pastry with unfiltered coffee, served with a glass of water." },
    ],
    hotels: [
      { name: "Cappadocia cave hotels", description: "Rooms carved into soft volcanic rock, with terraces facing the balloon launch valleys.", tier: "Unique" },
      { name: "Istanbul boutique hotels", description: "Restored Ottoman houses in Sultanahmet, or design hotels across the water in Karaköy.", tier: "Boutique" },
      { name: "Aegean coast resorts", description: "Bodrum and Çeşme beach hotels, and gulet charters along the Lycian coast.", tier: "Resort" },
    ],
    itinerary: [
      { title: "Day 1-4: Istanbul", description: "Sultanahmet's monuments, the bazaars, a Bosphorus ferry, and an evening in Kadıköy." },
      { title: "Day 5-7: Cappadocia", description: "Fly to Kayseri, take a sunrise balloon, and walk the Rose and Red valleys." },
      { title: "Day 8-9: Ephesus and Pamukkale", description: "The ancient city, then the travertine terraces and Hierapolis." },
      { title: "Day 10-12: Turquoise Coast", description: "Kaş or Ölüdeniz for the sea, with a gulet day or a stretch of the Lycian Way." },
    ],
    bestTime: "April to June and September to October -- warm, dry and outside the July-August heat and peak. Cappadocia is beautiful under winter snow, though balloons are grounded more often.",
    tips: {
      currency: "Turkish lira (TRY). Inflation moves prices quickly, so treat older price guides with suspicion. Cards are widely accepted.",
      transport: "Domestic flights are cheap and quick; intercity buses are comfortable and extensive. Istanbul's trams, ferries and metro all take one Istanbulkart.",
      safety: "Generally safe for visitors. Normal city precautions apply, and check current government advice for regions near the southeastern borders.",
      language: "Turkish. English is common in tourist areas and Istanbul, less so in smaller towns.",
    },
    faqs: [
      { q: "How many days for Istanbul?", a: "Three full days covers the main sights without rushing; four lets you cross to the Asian side properly." },
      { q: "Are the balloons guaranteed?", a: "No -- flights are cancelled for wind, and often. Allow two or three mornings in Cappadocia to get a slot." },
      { q: "Do I need a visa?", a: "Many nationalities enter visa-free or on a quick e-visa. Confirm the current rule for your passport before booking." },
      { q: "Is it a beach destination or a culture trip?", a: "Both, and they combine well -- most itineraries pair Istanbul and Cappadocia with a week on the Aegean coast." },
    ],
  },

  "french-polynesia": {
    whyChoose:
      "French Polynesia is 118 islands across an area the size of Europe -- Bora Bora's lagoon, Moorea's green peaks and the Tuamotus' diving are separate trips that happen to share an airport.",
    whyVisit: [
      { title: "The lagoons are the point", description: "Bora Bora and Taha'a hold water in colours that photographs consistently fail to capture." },
      { title: "Overwater bungalows, done first", description: "The format was invented here in the 1960s, and the originals still set the standard." },
      { title: "Diving and drift snorkelling", description: "The Tuamotu passes at Fakarava and Rangiroa deliver shark and manta encounters at world level." },
      { title: "Volcanic drama", description: "Moorea and Huahine are jagged and green, a complete contrast to the flat coral atolls." },
    ],
    attractions: [
      { name: "Bora Bora lagoon", description: "Mount Otemanu ringed by a turquoise lagoon and motu islets. Lagoon tours with ray and shark stops are the standard day out." },
      { name: "Moorea", description: "Thirty minutes by ferry from Tahiti -- Cook's and Opunohu bays, pineapple fields and the Belvedere viewpoint." },
      { name: "Fakarava", description: "A UNESCO biosphere reserve whose southern pass holds a famous wall of hundreds of grey reef sharks." },
      { name: "Rangiroa", description: "One of the world's largest atolls, with dolphins regularly met in the Tiputa pass." },
      { name: "Papeete market", description: "Tahiti's covered market for vanilla, monoi oil, black pearls and pareo -- busiest early on Sunday." },
      { name: "Taha'a vanilla island", description: "Vanilla plantations and pearl farms, with a drift snorkel through the coral garden off Motu Tautau." },
    ],
    foodIntro: "Polynesian cooking pairs raw fish and coconut with a strong French inheritance -- baguettes and patisserie sit beside the traditional dishes.",
    dishes: [
      { name: "Poisson cru", description: "Raw tuna cured in lime and coconut milk. The national dish, eaten at any hour." },
      { name: "Ma'a Tahiti", description: "A Sunday feast cooked in an underground oven -- pork, breadfruit, taro and fish." },
      { name: "Roulotte food", description: "Papeete's waterfront food trucks: steak frites, chow mein and crepes, and the best-value meal in the country." },
      { name: "Tahitian vanilla", description: "A distinct species, floral rather than sharp, and used in everything from ice cream to fish sauces." },
    ],
    hotels: [
      { name: "Overwater bungalows", description: "Glass floor panels, ladders into the lagoon, and the reason most people come. Bora Bora and Taha'a lead.", tier: "Luxury" },
      { name: "Family pensions", description: "Guesthouses run by local families -- a fraction of resort prices and the way to actually meet Polynesians.", tier: "Guesthouse" },
      { name: "Atoll dive lodges", description: "Simple rooms on Fakarava and Rangiroa built around the day's dives rather than the view.", tier: "Dive" },
    ],
    itinerary: [
      { title: "Day 1-2: Tahiti", description: "Papeete market, the roulottes, and the black-sand west coast to shake off the flight." },
      { title: "Day 3-5: Moorea", description: "Ferry across for hiking, the Belvedere, and snorkelling with rays in the lagoon." },
      { title: "Day 6-9: Bora Bora or Taha'a", description: "The lagoon proper -- boat day, coral garden drift, and sunset from the motu." },
      { title: "Day 10-12: Tuamotus", description: "Fly to Fakarava or Rangiroa for the passes, which is where the diving justifies the trip." },
    ],
    bestTime: "May to October is the dry season -- warm, less humid, and the reliable window. November to April is wetter and warmer, with cyclone risk at the margins.",
    tips: {
      currency: "CFP franc (XPF), pegged to the euro. Cards work at resorts; carry cash for pensions, markets and small islands.",
      transport: "Air Tahiti connects the islands and is the main cost after accommodation -- multi-island air passes are usually cheaper than separate tickets.",
      safety: "Very safe. The genuine hazards are sun, currents in the passes, and coral cuts -- reef shoes are worth packing.",
      language: "French and Tahitian. English is spoken at resorts, less so at family pensions.",
    },
    faqs: [
      { q: "Is it as expensive as people say?", a: "Resorts are, yes. Family pensions and the roulottes bring it down dramatically -- it is only unavoidable if you insist on overwater bungalows." },
      { q: "How many islands should I visit?", a: "Two or three in ten days. Each internal flight costs a half-day, so more islands means less time on any of them." },
      { q: "Bora Bora or Moorea?", a: "Bora Bora for the lagoon and the bungalows; Moorea for scenery, hiking and value. Moorea is far cheaper to reach from Tahiti." },
      { q: "When can I see whales?", a: "Humpbacks are usually present from roughly August to October, with regulated in-water encounters." },
    ],
  },

  "new-caledonia": {
    whyChoose:
      "New Caledonia is France in the South Pacific -- a UNESCO-listed lagoon, the largest in the world, wrapped around an island where the bakery is genuinely French and the culture is genuinely Kanak.",
    whyVisit: [
      { title: "The world's largest lagoon", description: "Roughly 24,000 square kilometres of reef and turquoise water, UNESCO World Heritage listed, and calm enough for beginners to snorkel." },
      { title: "France, eight hours from Sydney", description: "Baguettes, patisserie and a French-speaking capital, in the tropics and a short flight from Australia and New Zealand." },
      { title: "Kanak culture", description: "Indigenous Melanesian culture is living, not curated -- and the Tjibaou Cultural Centre is one of the finest modern buildings in the Pacific." },
      { title: "Endemic wildlife", description: "The flightless kagu, giant geckos and Cook pines exist nowhere else. The island split from Gondwana and the biology shows it." },
    ],
    attractions: [
      { name: "Isle of Pines", description: "Cook pines over white sand and the Piscine Naturelle, a natural rock pool that fills with reef fish. A short flight or ferry from Noumea." },
      { name: "Ouvea, Loyalty Islands", description: "Twenty-five kilometres of uninterrupted white beach on one of the most complete lagoons in the Pacific." },
      { name: "Tjibaou Cultural Centre", description: "Renzo Piano's ten timber structures on a Noumea peninsula, built to echo Kanak dwellings. Worth a half-day." },
      { name: "Coeur de Voh", description: "A naturally heart-shaped clearing in the mangroves on the west coast, best seen from a light aircraft." },
      { name: "Lifou", description: "Cliffs, vanilla plantations and some of the clearest snorkelling water in the territory." },
      { name: "Blue River Provincial Park", description: "Red earth, drowned forest and the best chance of seeing a kagu in the wild." },
    ],
    foodIntro:
      "The food is the clearest sign of where you are: French technique and imported cheese alongside bougna, the Kanak dish cooked underground.",
    dishes: [
      { name: "Bougna", description: "Yam, taro, banana and meat or fish wrapped in banana leaves with coconut milk and baked in a stone oven." },
      { name: "Fresh baguette", description: "Baked daily to French standard. The tropical setting does not make it worse." },
      { name: "Blue prawns", description: "Farmed locally and exported to France, which is a reasonable indication of the quality." },
      { name: "Coconut crab", description: "A delicacy, increasingly protected -- eat it where it is legally and sustainably sourced." },
    ],
    hotels: [
      { name: "Noumea beachfront, Anse Vata", description: "The main resort strip, with the lagoon on the doorstep and restaurants within walking distance.", tier: "Resort" },
      { name: "Isle of Pines lodges", description: "A handful of properties on the island's best bays, deliberately low-rise.", tier: "Island" },
      { name: "Loyalty Islands guesthouses", description: "Tribal homestays on Lifou and Ouvea -- simple, and the most direct way to meet Kanak hosts.", tier: "Homestay" },
    ],
    itinerary: [
      { title: "Day 1-2: Noumea", description: "The lagoon beaches, the market, and the Tjibaou Cultural Centre." },
      { title: "Day 3-5: Isle of Pines", description: "Fly or ferry across for the Piscine Naturelle, the pines and the bays." },
      { title: "Day 6-8: Loyalty Islands", description: "Ouvea for the beach, Lifou for the cliffs and snorkelling." },
      { title: "Day 9-10: West coast", description: "Drive north for the Coeur de Voh and the cattle country, which looks nothing like the coast." },
    ],
    bestTime:
      "September to December is the sweet spot -- warm, dry and outside the cyclone risk, which runs roughly November to April. May to August is cooler and pleasant for walking.",
    tips: {
      currency: "CFP franc (XPF), pegged to the euro. Cards are widely accepted in Noumea and less so on the outer islands -- carry cash for those.",
      transport: "Domestic flights and ferries link the islands. A hire car is worth it on Grande Terre; on the smaller islands it usually is not.",
      safety: "Generally safe for visitors. Check current advice before booking, as there have been periods of civil unrest, and respect that some land is customary and requires permission to enter.",
      language: "French is the working language and English is far less widely spoken than elsewhere in the Pacific. A phrasebook earns its keep here.",
    },
    faqs: [
      { q: "Do I need French?", a: "It helps considerably. Outside the Noumea hotels, English is not reliably spoken -- more like rural France than a Pacific resort island." },
      { q: "Isle of Pines or the Loyalty Islands?", a: "Isle of Pines for the classic postcard and easier logistics; the Loyalty Islands for emptier beaches and a closer look at Kanak life." },
      { q: "How do I get there?", a: "Direct flights from Sydney, Brisbane and Auckland, plus connections via Tokyo and Papeete. It is one of the easier Pacific nations to reach from Australia." },
      { q: "Is it expensive?", a: "Yes -- prices track France rather than the region, and most goods are imported. Self-catering and guesthouses bring it down considerably." },
    ],
  },

  samoa: {
    whyChoose:
      "Samoa is the South Pacific with the resorts stripped out -- swimming holes in lava rock, waterfalls off the road, and beach fales on the sand where you sleep a few metres from the water for very little money.",
    whyVisit: [
      { title: "To Sua Ocean Trench", description: "A 30-metre swimming hole in a lava field, reached by ladder. One of the Pacific's genuinely singular sights." },
      { title: "Beach fales", description: "Open-sided thatched huts right on the sand, usually with breakfast and dinner included, for very little." },
      { title: "Fa'a Samoa, still central", description: "Village life, chiefly structures and Sunday observance shape the country -- this is not a resort bubble." },
      { title: "Two islands, different pace", description: "Upolu has the airport and infrastructure; Savai'i is bigger, quieter and more traditional." },
    ],
    attractions: [
      { name: "To Sua Ocean Trench", description: "The swimming hole at Lotofaga, on Upolu's south coast, connected to the sea by a lava tube." },
      { name: "Lalomanu Beach", description: "White sand under a green headland on Upolu's southeast tip, and the classic beach fale strip." },
      { name: "Alofaaga Blowholes, Savai'i", description: "Lava tubes firing seawater tens of metres up. Locals throw coconuts in to demonstrate the force." },
      { name: "Papaseea Sliding Rocks", description: "Natural rock waterslides into freshwater pools, best when the water is high." },
      { name: "Robert Louis Stevenson Museum", description: "The writer's restored home above Apia, with a walk up Mount Vaea to his tomb." },
      { name: "Saleaula lava fields", description: "A village buried by early-1900s eruptions, with a church half-filled by hardened lava." },
    ],
    foodIntro: "Samoan cooking relies on taro, breadfruit, coconut and fish, most traditionally cooked in an umu -- a stone oven built above ground.",
    dishes: [
      { name: "Palusami", description: "Taro leaves baked in coconut cream until silky. Usually the best thing on an umu plate." },
      { name: "Oka i'a", description: "Raw fish in coconut cream with onion, tomato and lemon." },
      { name: "Umu feast", description: "Sunday's to'ona'i, cooked on hot stones -- pork, taro, breadfruit and fish, eaten after church." },
      { name: "Koko Samoa", description: "Thick local cocoa, roasted and ground on the islands, drunk hot and sweet." },
    ],
    hotels: [
      { name: "Beach fales", description: "Open-sided huts on the sand with a mattress, mosquito net and meals included. The signature Samoan stay.", tier: "Traditional" },
      { name: "Apia hotels", description: "Conventional rooms in the capital, useful for arrival and departure nights.", tier: "City" },
      { name: "Upolu coastal resorts", description: "A small number of full-service properties on the north and south coasts.", tier: "Resort" },
    ],
    itinerary: [
      { title: "Day 1-2: Apia", description: "The market, the Stevenson museum, and the Mount Vaea walk before heading out of town." },
      { title: "Day 3-5: South coast, Upolu", description: "To Sua Ocean Trench, Lalomanu, and nights in a beach fale on the sand." },
      { title: "Day 6-8: Savai'i", description: "Ferry across for blowholes, lava fields and a much slower pace." },
      { title: "Day 9-10: Back to Upolu", description: "Sliding rocks, the waterfalls inland, and a last night near the airport." },
    ],
    bestTime: "May to October is drier and cooler. November to April is the wet season with cyclone risk, though rain often comes in short heavy bursts rather than all day.",
    tips: {
      currency: "Samoan tala (WST). Cash is essential outside Apia -- most fales and village fees are cash only.",
      transport: "Hire a car to see Upolu properly; local buses are colourful, cheap and not built around schedules. A ferry links Upolu and Savai'i.",
      safety: "Very safe. Respect village customs -- ask before crossing private land, and expect a small custom fee at many natural sites.",
      language: "Samoan and English, both official.",
    },
    faqs: [
      { q: "Samoa or Fiji?", a: "Fiji has more resorts and flights; Samoa is more traditional and much better value if you are happy in a fale rather than a resort." },
      { q: "What is a beach fale actually like?", a: "An open-sided hut on the sand with a mattress and mosquito net, shared bathrooms, and usually breakfast and dinner included." },
      { q: "Do I need to cover up?", a: "Away from beaches and resorts, yes -- shoulders and knees covered is the norm, especially in villages and on Sunday." },
      { q: "Is Sunday really closed?", a: "Largely yes. Church, then a family umu. Plan travel and shopping around it." },
    ],
  },
  martinique: {
    whyChoose:
      "Martinique is the French Caribbean at its most complete -- an AOC rum industry, a volcano that erased a city in 1902, and beaches on two coasts with entirely different characters.",
    whyVisit: [
      { title: "Rum with an appellation", description: "The only rum region in the world with AOC status. Distilleries run tours and tastings, and the agricole style is nothing like molasses rum." },
      { title: "Two coasts, two holidays", description: "The Atlantic side is wild and windswept; the Caribbean side is calm and swimmable. They are forty minutes apart." },
      { title: "France, with euros", description: "EU territory, so no currency change for European travellers and no visa for EU citizens. French healthcare and roads." },
      { title: "A volcano with a story", description: "Mont Pelee destroyed Saint-Pierre in 1902, killing almost the entire population in minutes. The ruins are still there." },
    ],
    attractions: [
      { name: "Les Salines", description: "The island's most famous beach -- white sand and coconut palms at the southern tip." },
      { name: "Saint-Pierre", description: "The old capital, rebuilt among the ruins of the 1902 eruption. The volcano museum is small and excellent." },
      { name: "Mont Pelee", description: "A demanding hike up the volcano itself, with the crater and the whole island below on a clear morning." },
      { name: "Jardin de Balata", description: "A botanical garden in the rainforest above Fort-de-France, with rope bridges through the canopy." },
      { name: "Route de la Trace", description: "The mountain road across the island's spine through rainforest -- one of the best drives in the Caribbean." },
      { name: "Anse Dufour and Anse Noire", description: "Neighbouring bays, one golden sand and one black, with turtles regularly in the water." },
    ],
    foodIntro:
      "Creole cooking with French technique -- and the standard is high, because this is a place where eating well is not negotiable.",
    dishes: [
      { name: "Accras de morue", description: "Salt cod fritters, served everywhere as a starter or a beach snack." },
      { name: "Colombo", description: "A curry brought by indentured Indian labourers, now thoroughly Martinican, usually with pork or chicken." },
      { name: "Boudin creole", description: "Spiced blood sausage, a staple of every bakery and roadside stall." },
      { name: "Ti' punch", description: "Rhum agricole, cane syrup and lime. Served without ice and mixed by you, not the bartender." },
    ],
    hotels: [
      { name: "Trois-Ilets resorts", description: "The main hotel area across the bay from Fort-de-France, with ferries into town.", tier: "Resort" },
      { name: "Sainte-Anne guesthouses", description: "Small properties near Les Salines in the quiet south.", tier: "Boutique" },
      { name: "North coast gites", description: "Self-catering houses in the rainforest, best if you have a car.", tier: "Self-catering" },
    ],
    itinerary: [
      { title: "Day 1-2: Fort-de-France and Trois-Ilets", description: "The market, the library, and the bay. Settle in." },
      { title: "Day 3-4: The north", description: "Saint-Pierre, the volcano and the Route de la Trace." },
      { title: "Day 5-6: The south", description: "Les Salines, Sainte-Anne, and the quiet bays around Anse Dufour." },
      { title: "Day 7: Distilleries", description: "Two or three rum estates, which are as much about the landscape as the tasting." },
    ],
    bestTime:
      "December to April is dry and reliably warm. Hurricane season runs roughly June to November, with September the peak -- and many smaller places close for part of it.",
    tips: {
      currency: "Euro (EUR). Cards are accepted almost everywhere, which is unusual for the Caribbean.",
      transport: "Hire a car. Public transport is limited and the island rewards driving, though the mountain roads are narrow.",
      safety: "Low crime by regional standards. The main risks are the sea -- Atlantic-side currents are strong -- and the manchineel trees, which are marked with red bands and genuinely dangerous.",
      language: "French, with Creole spoken alongside it. English is limited outside hotels; some French helps enormously.",
    },
    faqs: [
      { q: "Do I need a visa?", a: "It is EU territory, so EU citizens do not. Others should check the rules for France specifically, which are not the same as for other Caribbean islands." },
      { q: "Martinique or Guadeloupe?", a: "Martinique is more developed, with better roads and restaurants. Guadeloupe has wilder nature and better diving. Both are easy to combine." },
      { q: "Is it expensive?", a: "Yes, by Caribbean standards -- French prices with import costs on top. Self-catering and local lolos bring it down." },
      { q: "Can I drink the tap water?", a: "Yes, it is treated to French standards." },
    ],
  },

  guadeloupe: {
    whyChoose:
      "Guadeloupe is two islands joined by a bridge and they could not be more different -- rainforest, waterfalls and an active volcano on one side, flat white-sand beaches on the other.",
    whyVisit: [
      { title: "Two islands, one trip", description: "Basse-Terre is volcanic, green and mountainous. Grande-Terre is flat, dry and where the beaches are. Cross in twenty minutes." },
      { title: "A national park worth the name", description: "Guadeloupe National Park covers much of Basse-Terre -- rainforest, waterfalls and marked trails up La Soufriere." },
      { title: "Diving that ranks globally", description: "The Cousteau Reserve off Pigeon Island is among the best-regarded dive sites in the Caribbean." },
      { title: "The outer islands", description: "Les Saintes, Marie-Galante and La Desirade are short ferry rides and feel decades removed from the mainland." },
    ],
    attractions: [
      { name: "Chutes du Carbet", description: "Three waterfalls in the national park, the tallest over 100 metres. The second is the most accessible." },
      { name: "La Soufriere", description: "An active volcano you can climb in a morning, often in cloud, with sulphur vents near the summit." },
      { name: "Cousteau Reserve", description: "Protected waters off Pigeon Island -- snorkelling from a boat is enough to see most of it." },
      { name: "Les Saintes", description: "A small archipelago with one of the world's finest bays, reached by ferry in under an hour." },
      { name: "Plage de la Perle", description: "A wide beach on the northwest coast, less developed than the Grande-Terre resorts." },
      { name: "Pointe des Chateaux", description: "The island's eastern tip, where the Atlantic meets a rocky headland with a cross on top." },
    ],
    foodIntro:
      "Creole food with French discipline, and a strong street-food culture built around the lolo -- the small roadside eatery.",
    dishes: [
      { name: "Bokit", description: "Fried bread stuffed with cod, chicken or beef. The island's great cheap lunch." },
      { name: "Court-bouillon de poisson", description: "Fish poached in a tomato and lime broth, heavy on herbs and chilli." },
      { name: "Chatrou", description: "Octopus, usually in a fricassee -- one of the dishes Guadeloupe does better than its neighbours." },
      { name: "Punch coco", description: "Coconut rum punch, sweeter than the Martinican ti' punch and served at every occasion." },
    ],
    hotels: [
      { name: "Sainte-Anne and Saint-Francois", description: "The main resort strip on Grande-Terre, close to the best beaches.", tier: "Resort" },
      { name: "Basse-Terre eco-lodges", description: "Small properties in the rainforest, near the national park trails.", tier: "Eco-lodge" },
      { name: "Les Saintes guesthouses", description: "A handful of small hotels on Terre-de-Haut, best booked well ahead.", tier: "Boutique" },
    ],
    itinerary: [
      { title: "Day 1-3: Grande-Terre", description: "Beaches, Pointe des Chateaux, and Pointe-a-Pitre's market." },
      { title: "Day 4-6: Basse-Terre", description: "The waterfalls, La Soufriere and the Cousteau Reserve." },
      { title: "Day 7-8: Les Saintes", description: "Ferry across and slow down. Rent a scooter; there are barely any cars." },
      { title: "Day 9-10: Marie-Galante", description: "Ox carts, rum distilleries and empty beaches. The quietest of the group." },
    ],
    bestTime:
      "December to April for dry, settled weather. The rainy season peaks August to October, which is also hurricane season -- Basse-Terre is genuinely wet then.",
    tips: {
      currency: "Euro (EUR). Cards are widely accepted, less so on the outer islands.",
      transport: "A car is essential on the main islands; the outer islands are better on foot or scooter.",
      safety: "Generally safe. Take the sea seriously on Atlantic-facing beaches, and watch for manchineel trees marked with red paint.",
      language: "French and Creole. English is limited -- more so than in Martinique.",
    },
    faqs: [
      { q: "How long do I need?", a: "A week covers both main islands at a rush. Ten days lets you add Les Saintes or Marie-Galante properly." },
      { q: "Is La Soufriere safe to climb?", a: "Yes, on marked trails when the park authority has it open. It is muddy, steep and frequently in cloud -- go early." },
      { q: "Which island should I base on?", a: "Split it. Grande-Terre for the beach half, Basse-Terre for the nature half. They are close enough to move once." },
      { q: "Do I need a visa?", a: "It is EU territory. EU citizens do not; others should check French entry rules." },
    ],
  },

  cuba: {
    whyChoose:
      "Cuba is the largest island in the Caribbean and the least like the rest of it -- a capital of crumbling grandeur, tobacco valleys worked by ox, and a coastline that development largely skipped.",
    whyVisit: [
      { title: "Havana is genuinely singular", description: "A UNESCO-listed old town, sea wall and street life that has no real equivalent anywhere else in the region." },
      { title: "Casas particulares", description: "Licensed family homestays that are cheaper than hotels, usually better, and the most direct way to meet Cubans." },
      { title: "Vinales", description: "Limestone mogotes rising out of tobacco fields, worked much as they were a century ago." },
      { title: "Beaches without the strip", description: "Cayo Coco, Cayo Levisa and much of the north coast remain thinly developed by Caribbean standards." },
    ],
    attractions: [
      { name: "Habana Vieja", description: "The old town's squares and colonnades, restored in parts and gloriously not in others." },
      { name: "Vinales Valley", description: "Tobacco country, with farm visits, cave systems and horse riding between the mogotes." },
      { name: "Trinidad", description: "A colonial sugar town frozen in the 19th century, cobbled and pastel and UNESCO-listed." },
      { name: "Malecon, Havana", description: "The sea wall where the city gathers in the evening. Best at sunset, and free." },
      { name: "Cienfuegos", description: "A French-founded port city with a grand seafront and an entirely different feel from Spanish Cuba." },
      { name: "Bay of Pigs", description: "Excellent shore diving and snorkelling straight off the road, plus the museum at Playa Giron." },
    ],
    foodIntro:
      "Cuban food is simple and improving fast -- the private paladares are where the cooking happens, not the state restaurants.",
    dishes: [
      { name: "Ropa vieja", description: "Shredded beef stewed with peppers and tomato. The national dish, and reliably good." },
      { name: "Moros y cristianos", description: "Black beans and rice cooked together. The default accompaniment to everything." },
      { name: "Tostones", description: "Twice-fried green plantain, salted and served as a side or a snack." },
      { name: "Cuban coffee", description: "Small, strong and sweetened in the pot. Ordering it any other way marks you out immediately." },
    ],
    hotels: [
      { name: "Havana casas particulares", description: "Family homestays in Vedado and Habana Vieja -- the recommended way to stay in the city.", tier: "Homestay" },
      { name: "Varadero resorts", description: "The all-inclusive strip on the north coast, mostly international chains.", tier: "Resort" },
      { name: "Trinidad colonial houses", description: "Restored townhouses around the old centre, many run as casas.", tier: "Boutique" },
    ],
    itinerary: [
      { title: "Day 1-3: Havana", description: "The old town, the Malecon, and a day doing nothing in particular." },
      { title: "Day 4-5: Vinales", description: "Tobacco farms, caves and the valley on horseback." },
      { title: "Day 6-8: Trinidad and Cienfuegos", description: "Colonial towns, with the Escambray mountains behind Trinidad." },
      { title: "Day 9-10: The coast", description: "Playa Ancon, Cayo Coco or the Bay of Pigs, depending which coast you finish on." },
    ],
    bestTime:
      "December to April is dry season and the most reliable. Hurricane season runs June to November, peaking in September.",
    tips: {
      currency: "Cash is essential. Card acceptance is limited and unreliable, and cards issued by US banks generally do not work at all. Bring enough for the whole trip.",
      transport: "Viazul coaches connect the main towns; colectivo shared taxis are faster and not much dearer. Car hire is expensive and should be booked well ahead.",
      safety: "Violent crime is rare and petty theft is not. The bigger practical issues are shortages -- of medicines, some foods and occasionally fuel. Bring what you cannot do without.",
      language: "Spanish. English is limited outside tourist areas, and a phrasebook is genuinely useful here.",
    },
    faqs: [
      { q: "Do I need a tourist card?", a: "Most visitors need one in addition to a passport, usually bought through the airline or a Cuban consulate. Check the requirements for your nationality before you fly." },
      { q: "Will my bank card work?", a: "Assume it will not. Cards from US banks are generally unusable, and ATMs are unreliable everywhere. Bring cash in euros or another major currency." },
      { q: "Is internet available?", a: "Improving but patchy and often paid by the hour. Plan for being offline more than you expect." },
      { q: "Hotel or casa particular?", a: "Casas, for value and for the experience. Hotels are mostly state-run and rarely represent good value." },
    ],
  },

  "dominican-republic": {
    whyChoose:
      "The Dominican Republic is the Caribbean's most-visited country for a reason -- the beaches are excellent and cheap to reach -- but it also has the region's highest mountains and its oldest European city.",
    whyVisit: [
      { title: "Value that is hard to match", description: "All-inclusive competition in Punta Cana is fierce, which keeps prices well below most of the Caribbean." },
      { title: "More than a beach", description: "Pico Duarte is the highest peak in the Caribbean, and the interior has whitewater, waterfalls and cloud forest." },
      { title: "Whale season", description: "Humpbacks gather in Samana Bay between roughly January and March in one of the most reliable whale encounters anywhere." },
      { title: "Santo Domingo", description: "The Zona Colonial is the oldest continuously inhabited European settlement in the Americas, and a UNESCO site." },
    ],
    attractions: [
      { name: "Zona Colonial, Santo Domingo", description: "Cobbled streets, the first cathedral in the Americas, and a genuine city rather than a resort town." },
      { name: "Samana Peninsula", description: "Whales in season, El Limon waterfall, and the beaches at Las Terrenas." },
      { name: "27 Charcos de Damajagua", description: "Twenty-seven natural pools you jump and slide down, with guides and helmets. Genuinely fun." },
      { name: "Bahia de las Aguilas", description: "A remote and almost undeveloped beach in the far southwest, reached by boat." },
      { name: "Punta Cana beaches", description: "The long resort strip on the east coast -- calm, palm-lined and the reason most people come." },
      { name: "Jarabacoa", description: "Mountain town in the interior, with rafting, waterfalls and a cool climate." },
    ],
    foodIntro:
      "Dominican cooking is hearty and built around rice, beans and stewed meat -- and the roadside places do it better than the resorts.",
    dishes: [
      { name: "La bandera", description: "The national plate: rice, red beans and stewed meat. Eaten at lunch, which is the main meal." },
      { name: "Mangu", description: "Mashed green plantain, usually at breakfast with fried cheese, salami and egg." },
      { name: "Sancocho", description: "A thick stew of several meats and root vegetables, made for gatherings." },
      { name: "Mamajuana", description: "Rum, wine and honey steeped with bark and herbs. Every family has a version." },
    ],
    hotels: [
      { name: "Punta Cana all-inclusives", description: "The largest concentration of resorts in the Caribbean, at every price point.", tier: "Resort" },
      { name: "Las Terrenas boutique", description: "Smaller French- and Italian-run places on the Samana peninsula.", tier: "Boutique" },
      { name: "Santo Domingo colonial hotels", description: "Restored townhouses in the Zona Colonial, for a city start or finish.", tier: "City" },
    ],
    itinerary: [
      { title: "Day 1-2: Santo Domingo", description: "The Zona Colonial, before the beach rather than after." },
      { title: "Day 3-5: Samana", description: "Whales in season, El Limon, and Las Terrenas." },
      { title: "Day 6-7: Jarabacoa", description: "The mountains, for the change of temperature and the rafting." },
      { title: "Day 8-10: Punta Cana or the southwest", description: "Resort beaches, or Bahia de las Aguilas if you want them empty." },
    ],
    bestTime:
      "December to April is dry and settled. Whale season in Samana runs roughly mid-January to mid-March. Hurricane season is June to November.",
    tips: {
      currency: "Dominican peso (DOP). US dollars are widely accepted in resorts; you will get a better rate paying in pesos elsewhere.",
      transport: "Domestic flights and coaches link the regions. Driving is possible but the roads are chaotic -- many visitors use private transfers instead.",
      safety: "Resort areas are heavily policed and low risk. Take normal precautions in cities, avoid unlit beaches at night, and use official taxis.",
      language: "Spanish. English is common in resort areas and much less so elsewhere.",
    },
    faqs: [
      { q: "Is it just all-inclusives?", a: "That is the majority of the tourism, but the country is far larger and more varied than Punta Cana suggests. Two days inland changes the trip completely." },
      { q: "When can I see whales?", a: "Roughly mid-January to mid-March in Samana Bay, with regulated boat trips. It is one of the most dependable whale sites in the world." },
      { q: "Is it safe?", a: "Resort areas are very safe. Elsewhere, ordinary city precautions apply -- it is not unusually dangerous, but it is not the sanitised version either." },
      { q: "Punta Cana or the north coast?", a: "Punta Cana for calm water and resorts; the north coast around Cabarete for wind sports and a younger, less packaged scene." },
    ],
  },

  jamaica: {
    whyChoose:
      "Jamaica has a cultural footprint out of all proportion to its size -- and behind the resort strip there are mountains, rivers and waterfalls that most visitors never get to.",
    whyVisit: [
      { title: "The Blue Mountains", description: "Coffee country rising to over 2,200 metres, cool, forested, and an hour from Kingston." },
      { title: "Waterfalls you climb", description: "Dunn's River and Reach Falls are climbed rather than looked at, which is why they stay memorable." },
      { title: "Music with an address", description: "Kingston is where reggae came from, and the Bob Marley Museum is in the house he actually lived in." },
      { title: "Two very different coasts", description: "The north coast is resorts and beaches; Port Antonio in the east is lush, quiet and barely developed." },
    ],
    attractions: [
      { name: "Dunn's River Falls", description: "A 180-metre cascade climbed in a human chain with a guide. Touristy and genuinely good fun." },
      { name: "Seven Mile Beach, Negril", description: "The island's best-known stretch of sand, with sunset cliffs at the southern end." },
      { name: "Blue Mountains", description: "Coffee estates, hiking, and a pre-dawn walk up Blue Mountain Peak if you are committed." },
      { name: "Blue Lagoon, Port Antonio", description: "A deep spring-fed lagoon where fresh and salt water meet, changing colour through the day." },
      { name: "Rio Grande rafting", description: "Bamboo rafts poled down the river through the hills. Slow, quiet and nothing like the resorts." },
      { name: "Bob Marley Museum, Kingston", description: "His Hope Road home, largely as it was, with the studio still standing." },
    ],
    foodIntro:
      "Jamaican food is assertive and smoky, built on jerk seasoning, and the roadside pans do it better than any restaurant.",
    dishes: [
      { name: "Jerk chicken or pork", description: "Marinated in scotch bonnet and pimento, cooked slowly over pimento wood. Boston Bay is the traditional home." },
      { name: "Ackee and saltfish", description: "The national dish, eaten at breakfast. Ackee is a fruit with the texture of scrambled egg." },
      { name: "Curry goat", description: "Slow-cooked and heavily spiced, a fixture at every gathering." },
      { name: "Festival", description: "Slightly sweet fried dumplings, served with everything, especially jerk." },
    ],
    hotels: [
      { name: "Montego Bay and Ocho Rios", description: "The main resort corridor on the north coast, mostly all-inclusive.", tier: "Resort" },
      { name: "Negril cliffs", description: "Smaller places on the West End cliffs, with sunsets and swimming straight off the rocks.", tier: "Boutique" },
      { name: "Port Antonio guesthouses", description: "The quiet east, where the island looks like it did before the resorts.", tier: "Guesthouse" },
    ],
    itinerary: [
      { title: "Day 1-3: Negril", description: "Seven Mile Beach, the cliffs, and easing in." },
      { title: "Day 4-5: Ocho Rios", description: "Dunn's River, the Blue Hole, and the north coast." },
      { title: "Day 6-7: Port Antonio", description: "Rio Grande rafting, the Blue Lagoon and Boston Bay jerk." },
      { title: "Day 8-10: Blue Mountains and Kingston", description: "Coffee estates, then the city for the music and the food." },
    ],
    bestTime:
      "November to mid-December and April to May give good weather without peak prices. Hurricane season runs June to November.",
    tips: {
      currency: "Jamaican dollar (JMD). US dollars are accepted in tourist areas, usually at a poor rate -- pay in JMD where you can.",
      transport: "Route taxis and coaches connect the towns cheaply. Driving is on the left and the roads are demanding; many visitors use private transfers.",
      safety: "Resort areas and the tourist corridor are well policed. Kingston has neighbourhoods worth avoiding -- take local advice rather than wandering, and use registered taxis.",
      language: "English is official; Patois is what you will hear spoken.",
    },
    faqs: [
      { q: "Do I have to stay all-inclusive?", a: "No, and the island is far more interesting if you do not. Mixing a few resort nights with guesthouses in Port Antonio or the Blue Mountains gives a much fuller picture." },
      { q: "Is it safe for tourists?", a: "The tourist areas are safe and heavily policed. Use registered taxis, avoid unlit areas at night, and take local advice in Kingston specifically." },
      { q: "Which airport?", a: "Montego Bay for the north coast and Negril; Kingston for the Blue Mountains and the east. They are three to four hours apart." },
      { q: "When is it cheapest?", a: "Late spring and autumn, outside the winter peak -- with the caveat that autumn is the height of hurricane season." },
    ],
  },

  bahamas: {
    whyChoose:
      "The Bahamas is seven hundred islands on a shallow bank, which is why the water is that colour -- and why the country ranges from a cruise-ship capital to cays with a dozen residents.",
    whyVisit: [
      { title: "The water, genuinely", description: "The Bahama Banks are shallow and sandy, producing turquoise that photographs look exaggerated but is not." },
      { title: "Out Islands", description: "Beyond Nassau and Paradise Island, the Exumas, Eleuthera and the Abacos are quiet, low-rise and slow." },
      { title: "The shortest hop", description: "Under an hour from Florida, which makes a short trip viable in a way most Caribbean destinations are not." },
      { title: "Blue holes and wrecks", description: "Andros has the largest concentration of blue holes on earth, and the diving is world class." },
    ],
    attractions: [
      { name: "Exuma Cays", description: "Sandbars, swimming pigs at Big Major Cay, and Thunderball Grotto. Best seen on a boat day." },
      { name: "Pink Sands Beach, Harbour Island", description: "Three miles of genuinely pink sand, from crushed coral. Among the finest beaches anywhere." },
      { name: "Nassau's old town", description: "Colonial architecture, the straw market and Fort Fincastle, in a compact and walkable centre." },
      { name: "Andros blue holes", description: "Inland and ocean blue holes on the largest and least developed island." },
      { name: "Dean's Blue Hole, Long Island", description: "One of the deepest known blue holes, and a free-diving competition site." },
      { name: "Lucayan National Park", description: "On Grand Bahama -- caves, mangrove and one of the country's best beaches at Gold Rock." },
    ],
    foodIntro:
      "Bahamian food is conch first and everything else second, cooked simply and eaten at the water's edge.",
    dishes: [
      { name: "Conch salad", description: "Raw conch diced with citrus, onion and pepper. Made in front of you at a shack, which is how it should be." },
      { name: "Cracked conch", description: "Battered and fried, served with peas and rice. The standard lunch." },
      { name: "Rock lobster", description: "Caribbean spiny lobster, in season roughly August to March." },
      { name: "Guava duff", description: "Steamed guava pudding with a rum butter sauce. The national dessert." },
    ],
    hotels: [
      { name: "Nassau and Paradise Island", description: "The largest resorts, including the big integrated properties.", tier: "Resort" },
      { name: "Exuma and Eleuthera boutique", description: "Small properties on the Out Islands, quiet and low-rise.", tier: "Boutique" },
      { name: "Harbour Island cottages", description: "Colonial cottages a short walk from the pink sand.", tier: "Cottage" },
    ],
    itinerary: [
      { title: "Day 1-2: Nassau", description: "The old town and a beach day, then move on -- Nassau is not the reason to come." },
      { title: "Day 3-5: Exumas", description: "A boat day through the cays, sandbars and the swimming pigs." },
      { title: "Day 6-8: Eleuthera and Harbour Island", description: "Pink sand, the Glass Window Bridge, and very little to do." },
      { title: "Day 9-10: Andros or Grand Bahama", description: "Blue holes and diving, or Lucayan National Park." },
    ],
    bestTime:
      "December to April is dry, cooler and the peak season. Hurricane season runs June to November, and the Bahamas sits directly in the corridor.",
    tips: {
      currency: "Bahamian dollar (BSD), pegged one to one with the US dollar, which is accepted everywhere.",
      transport: "Inter-island flights and mail boats connect the islands. Distances are larger than the map suggests -- plan on flying between groups.",
      safety: "The Out Islands are very safe. Parts of Nassau away from the tourist areas warrant normal city caution, particularly after dark.",
      language: "English.",
    },
    faqs: [
      { q: "Nassau or the Out Islands?", a: "Out Islands, if the water is why you are coming. Nassau is convenient and busy; the Exumas and Eleuthera are what the photographs are of." },
      { q: "Is it expensive?", a: "Yes. Almost everything is imported, and the Out Islands are dearer again. Self-catering helps, where it is available." },
      { q: "Can I see the swimming pigs?", a: "Yes, at Big Major Cay in the Exumas, on organised boat trips. Go with an operator that keeps its distance and does not overfeed them." },
      { q: "How do I get between islands?", a: "Domestic flights are the practical option. The mail boats are cheap, slow and an experience rather than a transport plan." },
    ],
  },

};
