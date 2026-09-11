// Full article bodies for the blog.
//
// POSTS in blog-posts.ts is the card index -- every post has a title and
// excerpt there. ARTICLES below holds the ones that have actually been
// written. The two are deliberately decoupled: a post without an entry here
// renders as a non-clickable card, so we never link a reader to an empty
// page. Write the article, add it here, and the card becomes a link.
//
// Blocks are data, not JSX, so the same article could later be rendered into
// an RSS feed or an AMP variant without touching the content.

export type Block =
  | { kind: "para"; text: string }
  | { kind: "h2"; text: string }
  | { kind: "list"; items: string[] }
  | { kind: "callout"; title: string; text: string }
  /** Resolved to a real affiliate URL at render time by ArticleCta --
   * storing the link *kind* rather than the URL keeps this file pure and
   * means marker/param changes only happen in lib/affiliate.ts. */
  | {
      kind: "cta";
      link: "flights" | "hotels" | "cars" | "tours" | "esim" | "events" | "airport" | "bikes";
      label: string;
      note: string;
      destination?: string;
    };

export type Article = {
  /** Standfirst under the headline -- one sentence, sets the promise. */
  dek: string;
  published: string; // ISO date, used for <time> and JSON-LD
  updated?: string;
  blocks: Block[];
  /** Slugs of other POSTS to surface at the foot of the article. */
  related: string[];
};

export const ARTICLES: Record<string, Article> = {
  // ────────────────────────────────────────────────────────────────
  "where-to-stay-in-dubai": {
    dek: "Dubai runs about 30 kilometres from the old souks to the Marina, and where you sleep decides how much of the trip you spend in taxis.",
    published: "2026-09-11",
    blocks: [
      { kind: "para", text: "Most cities let you pick a hotel and walk out into the middle of things. Dubai does not. It is a chain of separate districts strung along Sheikh Zayed Road and the coast, roughly 30 kilometres from the souks on the Creek to the towers of the Marina, and the gap between them is usually a taxi ride, not a stroll." },
      { kind: "para", text: "That makes the neighbourhood the most important booking decision of the trip -- more than the star rating, and more than the view. **Pick the area first, then the hotel inside it.**" },

      { kind: "h2", text: "The short answer" },
      { kind: "list", items: [
        "**First visit, three or four nights:** Downtown, or Business Bay next door for less money.",
        "**Beach holiday with some life in the evenings:** Dubai Marina and JBR.",
        "**A resort you barely leave:** Palm Jumeirah.",
        "**Quieter, low-rise beach:** Jumeirah and Umm Suqeim, near the Burj Al Arab.",
        "**Tight budget, or culture over glamour:** Deira and Bur Dubai, around the Creek.",
        "**Short stopover or late-night arrival:** Deira again -- it is the closest area to the main airport.",
      ]},

      { kind: "h2", text: "Downtown Dubai: the landmarks on your doorstep" },
      { kind: "para", text: "This is the postcard: the Burj Khalifa, Dubai Mall and the fountain show that plays across the lake every evening. Stay here and the biggest sights are a walk away, which in Dubai is a genuine luxury." },
      { kind: "para", text: "It is also on the Metro's Red Line, with a covered, air-conditioned walkway linking the station to the mall -- useful when the afternoon heat makes any outdoor walk a bad idea. The trade-off is price. Rooms with a view of the tower carry a premium, and there is no beach, so budget for a taxi or two to the coast." },

      { kind: "h2", text: "Business Bay: Downtown's cheaper neighbour" },
      { kind: "para", text: "Business Bay sits directly beside Downtown along the canal, and is mostly newer towers and hotel apartments. You can often get a similar skyline for noticeably less, and the better-placed hotels are a short taxi or a longer walk from Dubai Mall." },
      { kind: "para", text: "Check the exact location on a map before you book. The district is large, parts of it are still under construction, and \"near Downtown\" in a listing can mean five minutes or twenty-five." },

      { kind: "h2", text: "Dubai Marina and JBR: the lively beach base" },
      { kind: "para", text: "If you want sand and a bit of life after dark, this is the easiest choice. The Marina is a ring of towers around a man-made waterway with a long promenade, and JBR beside it has an open public beach and The Walk, a strip of restaurants and cafés at street level." },
      { kind: "para", text: "It suits couples, groups and anyone who wants to step out of the hotel and find dinner without a plan. The Dubai Tram links it to the Metro and to the Palm's monorail. The catch is distance: **Downtown and the old town are 30 to 45 minutes away by car**, longer at rush hour, so sightseeing days start with a journey." },

      { kind: "h2", text: "Palm Jumeirah: a resort you don't need to leave" },
      { kind: "para", text: "The Palm is where the big beach resorts are, each with its own stretch of private sand, pools and restaurants. It is the right answer for a honeymoon or a family trip where the plan is mostly pool, beach and long dinners." },
      { kind: "para", text: "It is the wrong answer if you want to explore. The hotels on the outer crescent are a long way from everything else, and although a monorail runs the length of the trunk, most outings start with a taxi. Price the resort's food and drink as well as the room -- when leaving takes effort, you will eat most meals on site." },

      { kind: "h2", text: "Jumeirah and Umm Suqeim: the quiet beach" },
      { kind: "para", text: "Between Downtown and the Marina, the coast along Jumeirah Beach Road is low-rise and residential, with public beaches such as Kite Beach, the Burj Al Arab, and the Madinat Jumeirah complex with its souk-style shops and canals." },
      { kind: "para", text: "It feels more like a neighbourhood than a resort strip, and it sits usefully between the two ends of the city. The Metro runs along Sheikh Zayed Road a few kilometres inland, though, so you will rely on taxis and ride-hailing more than you would in Downtown or the Marina." },

      { kind: "h2", text: "Deira and Bur Dubai: old Dubai, and the best value" },
      { kind: "para", text: "The city began on the Creek, and this is still its most characterful corner: the gold and spice souks in Deira, the restored lanes of the Al Fahidi historic district in Bur Dubai, and wooden abra boats that cross the water for small change." },
      { kind: "para", text: "Hotels here are routinely the cheapest in the city, and **Deira is about 15 minutes from Dubai International Airport**, which makes it ideal for a stopover or a late arrival. It is busy, crowded and very real, and it is a long way from the beaches -- allow 40 minutes or more to reach the Marina." },
      { kind: "callout", title: "Not every hotel has a bar", text: "Alcohol is served only in licensed venues, which in Dubai mostly means hotels. Some hotels do not hold a licence, particularly budget properties in the older districts and many hotel apartments. If a drink at the end of the day matters to you, check the listing before you book." },

      { kind: "h2", text: "Al Barsha: mid-range value in the middle" },
      { kind: "para", text: "Worth a look if prices elsewhere put you off. Al Barsha is built around the Mall of the Emirates, home of the indoor ski slope, with a Metro stop at the mall and plenty of mid-range hotels. It is not pretty, but it sits roughly halfway between Downtown and the Marina, and the beach at Umm Suqeim is a short taxi ride away." },

      // "Dubai" alone resolves to Dubai International Airport on Hotellook's
      // redirect; the country qualifier lands on the city-wide results.
      { kind: "cta", link: "hotels", destination: "Dubai, United Arab Emirates", label: "Compare hotels in Dubai", note: "Live rates across every neighbourhood from our booking partners." },

      { kind: "h2", text: "Split the stay" },
      { kind: "para", text: "For a first trip of five nights or more, a split works well: two or three nights in Downtown for the sights, then the rest by the beach in the Marina, JBR or the Palm. The move costs one taxi ride of half an hour or so, and you get each half of Dubai at its best instead of commuting between them every day." },
      { kind: "para", text: "On a long weekend, pick one base. A move eats half a day you do not have." },

      { kind: "h2", text: "Getting around from wherever you stay" },
      { kind: "list", items: [
        "**The Metro** is clean, cheap and air-conditioned. The Red Line runs the length of the city along Sheikh Zayed Road, through the airport and Downtown and on past the Marina; the Green Line covers the Creek and old Dubai. You pay with a rechargeable Nol card.",
        "**Taxis and ride-hailing** are plentiful and metered, and Careem and Uber both operate. Anywhere the Metro misses, this is how you will move.",
        "**The tram and the Palm monorail** connect the Marina, JBR and the Palm to the Red Line.",
        "**Walking** works well within one district in winter, and is hard going from June to September, when afternoon temperatures regularly pass 40°C.",
      ]},
      { kind: "para", text: "Landing at Dubai International? The Red Line stops at Terminals 1 and 3, so a Downtown or Marina hotel is reachable without a taxi if your luggage is manageable. Arriving late at night or with a lot of bags, a pre-booked transfer is simpler." },
      { kind: "cta", link: "airport", label: "Book an airport transfer", note: "Pre-booked pickups from Dubai's airports, priced before you travel." },
      { kind: "para", text: "Sort out data before you fly, too. You will book most journeys on your phone, and an eSIM installed at home means maps and ride-hailing work the moment you land -- no kiosk queue, and no surprise from your own network's roaming charges." },
      { kind: "cta", link: "esim", destination: "united-arab-emirates", label: "Get a UAE eSIM", note: "Data plans you can install before you leave home." },

      { kind: "h2", text: "When prices move" },
      { kind: "para", text: "Dubai hotel prices follow the weather. **November to March is peak season**, with the most comfortable temperatures and the highest rates, especially over Christmas and New Year. Book early for those dates." },
      { kind: "para", text: "**June to September is the opposite:** fierce heat, and some of the lowest luxury-hotel prices of the year. If the plan is mostly pool, beach club and air-conditioned malls, summer can be excellent value." },
      { kind: "para", text: "Two other things shift prices. Large conventions at the Dubai World Trade Centre can fill business hotels in Downtown and Business Bay for a week at a time. And Ramadan, which moves about eleven days earlier each year, often brings lower rates and a slower, quieter pace during the day." },
      { kind: "callout", title: "Compare the total, not the nightly rate", text: "Dubai hotel bills usually carry a service charge, a municipality fee and VAT, and hotels also collect a Tourism Dirham fee per room, per night. Some booking sites fold all of this into the headline price and some add it at checkout or at the hotel. Compare final totals before deciding which hotel is cheaper." },

      { kind: "h2", text: "Before you book" },
      { kind: "list", items: [
        "**Choose the neighbourhood first**, then filter hotels inside it.",
        "**Trust the map pin**, not the listing's description of where the hotel is.",
        "**Confirm the total price**, including city fees and the Tourism Dirham.",
        "**Read the cancellation terms** -- peak-season rates are often non-refundable.",
        "**Plan the arrival:** Metro or transfer from the airport, and data on your phone before you land.",
        "**Check the entry rules for your passport.** Many nationalities can enter visa-free or get a visa on arrival, but not all.",
      ]},

      { kind: "cta", link: "flights", label: "Compare flights to Dubai", note: "Fares into Dubai from our booking partners." },
    ],
    related: ["free-cancellation-fine-print", "boutique-vs-resort", "qatar-layover"],
  },
  "where-to-stay-in-marrakech": {
    dek: "The medina is where Marrakech happens and where cars can't reach, so the real decision is a riad inside the walls or a hotel outside them.",
    published: "2026-09-11",
    blocks: [
      { kind: "para", text: "Marrakech splits cleanly in two. Inside the red walls of the medina is the city everyone pictures -- the souks, Jemaa el-Fnaa, lanes too narrow for a car -- and it is full of riads, old courtyard houses turned into small hotels. Outside the walls are the new town and the resort districts: wide streets, big pools, and hotels that look like hotels anywhere." },
      { kind: "para", text: "Neither is right for everyone. **Decide inside or outside the walls first; the hotel follows from that.**" },

      { kind: "h2", text: "The short answer" },
      { kind: "list", items: [
        "**First visit, three or four nights:** a riad in the medina, within about ten minutes' walk of Jemaa el-Fnaa.",
        "**The medina, but calmer:** the Kasbah, or the southern medina near the Bahia Palace.",
        "**A proper pool and room to switch off:** Hivernage, a short taxi ride from the walls.",
        "**Restaurants, cafes and easy taxis:** Gueliz, the French-era new town.",
        "**A resort you barely leave:** the Palmeraie, north-east of the city.",
        "**Small children, or anyone who finds stairs hard:** outside the walls. Riads mean stairs, and the medina means walking.",
      ]},

      { kind: "h2", text: "The medina, and what a riad actually is" },
      { kind: "para", text: "A riad is a traditional house built around an inner courtyard, usually with a fountain or a small plunge pool, rooms opening onto galleries above it and a roof terrace on top. Most have somewhere between a handful and a dozen rooms. From the lane outside they are a blank wall and a door; inside, the city's noise drops away." },
      { kind: "para", text: "Staying in one is the reason many people come -- breakfast on the roof, the call to prayer at dusk, the souks a few minutes away. The trade-offs are real, though. Rooms are often small, sound carries across an open courtyard, there is rarely a lift, and the pool is usually one you can cross in two strokes." },
      { kind: "callout", title: "Cars stop at the edge", text: "Most of the medina's lanes are too narrow for a car, so a taxi drops you at the nearest gate or square and the last stretch is on foot. Good riads send someone to meet you there and wheel your bags in -- ask for it when you book, especially if you land after dark. Medina addresses are hard to find the first time, even with a map." },

      { kind: "h2", text: "Around Jemaa el-Fnaa and the souks" },
      { kind: "para", text: "For a first visit, the lanes north of the main square -- around Mouassine and the souks -- put everything within walking distance: the square at night, the markets by day, and the Koutoubia minaret as a landmark you can always steer by. It is also the busiest, most intense part of the medina, which is exactly the point for some people and too much for others." },
      { kind: "para", text: "Right beside the square you will hear it late into the night. A few lanes back is the sweet spot." },

      { kind: "h2", text: "The Kasbah and the southern medina: quieter, still inside the walls" },
      { kind: "para", text: "South of the square, the Kasbah quarter around the Saadian Tombs, and the old Jewish quarter, the Mellah, beside the Bahia Palace, feel more residential. You are still inside the walls and still walking everywhere, with less of the souks' pressure. The Kasbah is also the side of the medina nearest the airport, which makes arriving simpler." },

      { kind: "h2", text: "Hivernage: pools and space, close to the walls" },
      { kind: "para", text: "Just outside the walls to the west, Hivernage is where many of the larger hotels sit, with real swimming pools, gardens, and the nightlife the medina largely lacks. The medina is a short taxi ride, or a longish walk, away." },
      { kind: "para", text: "It suits anyone who wants Marrakech by day and a pool to come back to -- and it is the easy choice in summer, when the heat makes a plunge pool feel like a gesture." },

      { kind: "h2", text: "Gueliz: the new town" },
      { kind: "para", text: "Gueliz is the city the French laid out in the last century: wide avenues, cafes, galleries, modern restaurants and ordinary city hotels. It is where a lot of Marrakech eats out, it is easy to reach by car, and the Majorelle Garden is close by. It is not atmospheric the way the medina is -- but plenty of travellers would rather visit the medina than sleep in it." },

      { kind: "h2", text: "The Palmeraie: a resort, not a base" },
      { kind: "para", text: "North-east of the city, the palm grove is resort country: spacious hotels and villas with large grounds and pools, far quieter than anywhere in town. It is the wrong answer if you want to explore -- the medina is a drive away and you will depend on taxis or the hotel shuttle -- and the right one for a few days of doing very little." },

      { kind: "cta", link: "hotels", destination: "Marrakech, Morocco", label: "Compare hotels and riads in Marrakech", note: "Live rates from our hotel partner, from medina riads to Palmeraie resorts." },

      { kind: "h2", text: "Split the stay" },
      { kind: "para", text: "On a week, a split works well: three or four nights in a riad for the medina, then a few at a hotel with a real pool -- or up in the High Atlas, where mountain guesthouses around villages like Imlil are roughly an hour and a half from the city and the air is noticeably cooler." },
      { kind: "para", text: "If the Sahara is on your list, plan it separately. It is two long driving days each way, not a day trip -- we cover how to fit it in on its own page." },

      { kind: "h2", text: "Getting there and getting around" },
      { kind: "list", items: [
        "**From the airport:** Marrakech Menara is close to the city, usually a short taxi ride to the edge of the medina. Agree the fare before you get in, or book a transfer ahead.",
        "**In the medina:** walk. Distances are short; finding your way is the challenge, so download an offline map before you go.",
        "**Between districts:** petits taxis are cheap and plentiful. Ask for the meter, or agree a price before you set off.",
        "**Data:** you will lean on a map constantly in the medina, so sort out an eSIM before you land.",
      ]},
      { kind: "cta", link: "airport", label: "Book an airport transfer in Marrakech", note: "Private and shared transfers from Menara, booked before you land." },
      { kind: "cta", link: "esim", destination: "morocco", label: "Get a Morocco eSIM", note: "Data plans you can activate before you fly." },

      { kind: "h2", text: "When prices move" },
      { kind: "para", text: "**Spring and autumn are peak season** -- roughly March to May and September to November -- with warm days and rates to match. **Summer is fiercely hot**, often well above 35C, and prices drop to suit; it is when a hotel with a real pool earns its keep." },
      { kind: "para", text: "Winter days are mild and bright, but nights are cold, and an old riad around an open courtyard can be chilly -- check that rooms have heating. Christmas, New Year and Easter push prices up. Ramadan moves every year and changes the rhythm of the city: many restaurants close in daylight, and evenings come alive." },
      { kind: "callout", title: "Not every riad serves alcohol", text: "Many medina riads don't, and some don't allow it on the premises. If a drink with dinner matters to you, check before you book -- the bigger hotels in Hivernage and the Palmeraie almost always do." },

      { kind: "h2", text: "Before you book" },
      { kind: "list", items: [
        "**Find it on a map**, not just in the listing. In the medina, the nearest gate or landmark matters more than the address.",
        "**Ask how arrival works** -- where the taxi stops, and whether someone meets you.",
        "**Check heating or air conditioning** for the season you are travelling in.",
        "**Count the stairs** if anyone in your group finds them hard; lifts are rare in riads.",
        "**Compare the total**, including tourist tax and breakfast, not just the nightly rate.",
      ]},
      { kind: "cta", link: "tours", destination: "Marrakech", label: "Compare Marrakech tours", note: "Souk walks, cooking classes and Atlas day trips from our booking partners." },
      { kind: "cta", link: "flights", label: "Compare flights to Marrakech", note: "Fares into Marrakech Menara from our booking partners." },
    ],
    related: ["marrakech-sahara-how-long", "where-to-stay-in-dubai", "boutique-vs-resort"],
  },
  "base-outside-amsterdam": {
    dek: "The Dutch rail network is dense enough that where you sleep and where you spend the day no longer have to be the same city.",
    published: "2026-09-11",
    blocks: [
      { kind: "para", text: "Amsterdam is small, beautiful and, for much of the year, very full. Rooms in the canal ring are among the priciest in Europe, and the city's tourist tax -- one of the highest anywhere on the continent -- goes on top of the room. Meanwhile the rest of the country is compact, and the trains between its cities run all day, several an hour." },
      { kind: "para", text: "Put those together and the obvious plan turns around. **Sleep somewhere quieter and cheaper, and treat Amsterdam as the day trip.**" },

      { kind: "h2", text: "The short answer" },
      { kind: "list", items: [
        "**Haarlem** -- about fifteen minutes by train. Canals, a grand market square and none of the crowds. The easiest swap.",
        "**Utrecht** -- under half an hour, and the middle of the whole rail network, so everywhere else is close too.",
        "**Rotterdam** -- around forty minutes on the fastest trains. A different kind of city, with Delft and The Hague on the doorstep.",
        "**Leiden** -- the base for tulip season, a short bus ride from Keukenhof.",
        "**Stay in Amsterdam itself** if it is a two-night first visit, or if the evenings are the point of the trip.",
      ]},

      { kind: "h2", text: "Why it works: the trains" },
      { kind: "para", text: "On the main lines between the big cities, trains come often enough that you rarely check a timetable -- you walk to the platform. Paying is simple too: tap a contactless bank card or phone on the reader at the station, and tap again when you leave. No ticket to buy, and the fare is worked out for you." },
      { kind: "para", text: "Late nights are covered better than most visitors expect. Around the dense western part of the country, a reduced night service keeps the main cities connected into the small hours, so dinner in Amsterdam does not mean a hotel there." },
      { kind: "callout", title: "Tap in, and tap out", text: "The reader at the start of the journey and the reader at the end both matter. Forget to tap out and you can be charged a maximum fare rather than the price of the trip you actually took -- use the same card or phone both times." },

      { kind: "h2", text: "Haarlem: Amsterdam's quieter twin" },
      { kind: "para", text: "Haarlem is what a lot of people hope Amsterdam will be: canals, gabled houses, a huge church on a lively market square, good restaurants, and the space to walk without queueing. It is close enough that you can be in Amsterdam before your coffee goes cold, and the beach at Zandvoort is a few minutes the other way." },

      { kind: "h2", text: "Utrecht: the middle of the map" },
      { kind: "para", text: "Utrecht has a medieval centre and a canal with a difference: the old wharves sit at water level, below the street, and are now lined with cafes and terraces. More usefully, it is the hub of the rail network. From here Amsterdam, Rotterdam, The Hague and the east of the country are all an easy hop, which makes it the best base if you want to see more than one city." },

      { kind: "h2", text: "Rotterdam: a different city altogether" },
      { kind: "para", text: "Rotterdam was largely rebuilt after the Second World War, and it leans into that: bold modern architecture, a huge covered market hall, and a harbour that still feels like a working port. It feels nothing like Amsterdam, which is exactly why it pairs well with a day there. Delft, with its canals and blue-and-white pottery, is minutes away, and The Hague barely further." },

      { kind: "h2", text: "Leiden: for tulip season" },
      { kind: "para", text: "Leiden is an old university town of canals and bookshops, and in spring it is perfectly placed. Keukenhof, the famous bulb gardens, opens for only about eight weeks, roughly mid-March to mid-May, and buses run there from Leiden during the season. Tickets are sold for timed entry, so book before you go rather than at the gate." },

      { kind: "cta", link: "hotels", destination: "Haarlem, Netherlands", label: "Compare hotels in Haarlem", note: "Live rates from our hotel partner -- or search Utrecht, Rotterdam or Leiden the same way." },

      { kind: "h2", text: "What you give up" },
      { kind: "para", text: "Amsterdam after dark. The canal ring lit up at night is a real part of the city, and a late train home is not the same as a stroll back to the hotel. If that matters to you, split it: stay outside for most of the trip, and spend the last night or two in Amsterdam itself." },
      { kind: "para", text: "Whichever you choose, book the big museums ahead. The Rijksmuseum and the Van Gogh Museum sell timed tickets, and the Anne Frank House sells its tickets online only, released weeks in advance -- turning up at the door is not an option." },

      { kind: "h2", text: "Getting in" },
      { kind: "list", items: [
        "**From Schiphol:** the airport has its own station under the terminal, with direct trains toward Leiden, The Hague, Rotterdam and Utrecht, as well as Amsterdam.",
        "**Around town:** every city here is walkable, and every one of them is better on a bike.",
        "**Luggage:** if you check out before an afternoon train, the bigger stations have lockers.",
      ]},
      { kind: "cta", link: "bikes", destination: "Utrecht", label: "Compare bike rentals in Utrecht", note: "City bikes and e-bikes from our booking partners." },
      { kind: "cta", link: "flights", label: "Compare flights to Amsterdam", note: "Fares into Schiphol from our booking partners." },
    ],
    related: ["cycling-city-rules-abroad", "switzerland-by-train", "free-cancellation-fine-print"],
  },

  "korea-without-a-car": {
    dek: "Seoul to Busan is well under three hours on the fastest trains, and most of what the rail line misses, an express bus reaches.",
    published: "2026-09-11",
    blocks: [
      { kind: "para", text: "In a lot of countries a rental car is how you see anything outside the capital. Korea is not one of them. A high-speed rail line runs the length of the country, an express bus network fills the gaps, and one rechargeable card pays for almost all of it. A car mostly adds traffic, parking and paperwork." },
      { kind: "para", text: "**Plan the trip around trains and buses, and rent a car only for Jeju.**" },

      { kind: "h2", text: "The short answer" },
      { kind: "list", items: [
        "**Seoul:** the subway, paid with a T-money card.",
        "**Seoul to Busan, Gyeongju and the south:** the KTX high-speed train.",
        "**Smaller towns and national parks:** express and intercity buses.",
        "**The DMZ:** an organised tour -- it is not somewhere you can visit on your own.",
        "**Jeju:** rent a car. This is the exception.",
      ]},

      { kind: "h2", text: "The KTX: the country's spine" },
      { kind: "para", text: "The fastest trains get from Seoul to Busan in well under three hours, city centre to city centre, with no airport security or transfers at either end. Two operators run high-speed services: KTX trains leave from Seoul Station, and SRT trains from Suseo, in the south-east of the city -- check which station your ticket is for before you set off." },
      { kind: "para", text: "Reserve seats on popular routes, especially on weekends and around holidays, when trains sell out. There is also a rail pass sold to foreign visitors; as with any rail pass, price your actual journeys first -- two or three long trips rarely justify it." },

      { kind: "h2", text: "Express buses reach what the rail doesn't" },
      { kind: "para", text: "For towns off the rail line, mountain parks and the east coast, the bus is the answer, and it is a good one. Express buses leave frequently from big terminals, run on motorways, and the premium versions have three wide seats to a row -- more comfortable than most flights. They are also usually cheaper than the train." },

      { kind: "h2", text: "One card for all of it" },
      { kind: "para", text: "A T-money card is a rechargeable transit card that works on the subway and buses across the country's cities, on many taxis, and in convenience stores. You tap in, and on buses and the subway you tap out too, which is how transfers get discounted." },
      { kind: "callout", title: "Buy it at a convenience store", text: "T-money cards are sold and topped up at convenience stores and station machines, usually with cash. Buy one on your first day, put a sensible amount on it, and top up as you go." },

      { kind: "h2", text: "Why not drive" },
      { kind: "para", text: "Seoul's traffic is heavy, parking in the busy districts is scarce and expensive, and the subway will beat a car across town at almost any hour. To drive at all, most visitors need an International Driving Permit alongside their licence -- arrange it before you leave home, because you cannot get one once you are there." },
      { kind: "callout", title: "Google Maps won't get you there", text: "Google Maps gives only limited directions in Korea. Locals use Naver Map or KakaoMap for walking, transit and driving routes -- download one before you arrive, and search places by their Korean name if the English one comes up short." },

      { kind: "h2", text: "The exception: Jeju" },
      { kind: "para", text: "Jeju is an island of coastal roads, volcanic peaks and scattered beaches and villages, and while buses do cover it, they cover it slowly. A car turns a day of connections into a day of places. Hire desks cluster around the airport, so collect it when you land and drop it off before you fly back." },
      { kind: "cta", link: "cars", label: "Compare car hire on Jeju", note: "Pick-up at Jeju International Airport from our booking partners." },

      { kind: "h2", text: "Getting data sorted" },
      { kind: "para", text: "Between map apps, rail bookings and ride-hailing, you will be on your phone constantly. An eSIM set up before you fly means you land connected." },
      { kind: "cta", link: "esim", destination: "south-korea", label: "Get a South Korea eSIM", note: "Data plans you can activate before you fly." },
      { kind: "cta", link: "tours", destination: "DMZ tour Seoul", label: "Compare DMZ tours", note: "Organised day trips from Seoul from our booking partners." },
      { kind: "cta", link: "flights", label: "Compare flights to Seoul", note: "Fares into Incheon from our booking partners." },
    ],
    related: ["japan-rail-pass-worth-it", "esim-vs-roaming-cost", "driving-on-the-other-side"],
  },
  "oman-4x4-or-not": {
    dek: "Most of the country is paved, fast and easy in an ordinary hire car. The mountain road and the dunes are the two exceptions.",
    published: "2026-09-11",
    blocks: [
      { kind: "para", text: "Oman is one of the easiest countries in the region to drive. The highways out of Muscat are wide and well kept, road signs are in English as well as Arabic, and the traffic thins out quickly once you leave the capital. For most of the classic loop -- Muscat, Nizwa, the coast road and Wadi Shab -- an ordinary saloon car does the job." },
      { kind: "para", text: "Two places change the answer. **Jebel Akhdar needs a four-wheel drive by rule, and the dunes of Wahiba Sands need one in practice.** Everywhere else it is a question of comfort, not access." },

      { kind: "h2", text: "The short answer" },
      { kind: "list", items: [
        "**Muscat, Nizwa and the coast road:** any hire car. The roads are paved and good.",
        "**Wadi Shab:** any hire car. You park near the mouth of the wadi and walk in -- the car never leaves the tarmac.",
        "**Jebel Akhdar:** a 4x4, no exceptions. A police checkpoint at the foot of the mountain road turns other cars back.",
        "**Wahiba Sands:** a 4x4 if you want to drive the dunes yourself -- or leave the car at the edge and let your camp drive you in.",
      ]},

      { kind: "h2", text: "Jebel Akhdar: the checkpoint" },
      { kind: "para", text: "The road up to Jebel Akhdar is paved, but it is long, steep and relentless, and the brakes take a beating on the way down. That is why a police checkpoint sits at the bottom and lets through four-wheel drives only. Arrive in a saloon and you will be turned around, however good the tarmac looks." },
      { kind: "para", text: "If the mountain is on your list -- and on our five-day route it is the overnight stop after Nizwa -- that decides the car for the whole trip. Swapping vehicles halfway round a loop is rarely practical, so most people simply hire a 4x4 from the start. The alternative is to ask your mountain hotel whether it arranges a transfer up from the foot of the road; some do." },

      { kind: "h2", text: "Wahiba Sands: drive in, or be driven" },
      { kind: "para", text: "Driving on sand is a skill, not a setting. It means letting the tyres down to a much lower pressure, keeping momentum on the climbs, and knowing what to do when -- not if -- you get stuck. Hire companies know this too, which is why many rental agreements exclude off-road driving from the cover, even on a 4x4." },
      { kind: "para", text: "The easy answer is that many desert camps meet their guests at the edge of the sands, by the villages on the main road, and drive them the last stretch in their own vehicles. You park, they take over, and the dune driving comes with someone who does it every day." },
      { kind: "callout", title: "Read the off-road clause", text: "Before you take a hire car onto sand or gravel tracks, look for the words off-road in the rental terms. If it is excluded, any damage out there -- underside and tyres included -- is yours to pay for, whatever cover you bought at the desk." },

      { kind: "h2", text: "What to know on the road" },
      { kind: "list", items: [
        "**Traffic drives on the right,** and the roads out of Muscat are fast, multi-lane highways.",
        "**Speed cameras are everywhere,** and fines follow the car -- which means the hire company, which means you.",
        "**Camels and goats wander onto the road,** especially in the interior. It is the best reason not to drive rural roads after dark.",
        "**Fill up before the desert and the mountains.** Fuel stations are plentiful on the highways and sparse away from them.",
        "**Check your licence.** Some are accepted on their own for a short visit; others need an International Driving Permit. Confirm with the hire company before you fly.",
      ]},

      { kind: "h2", text: "Never cross a flowing wadi" },
      { kind: "para", text: "Wadis are dry riverbeds for most of the year, and roads often run straight through them. After rain in the mountains -- even rain that never reached you -- water can arrive fast and deep. If there is water moving across a wadi crossing, wait. It usually passes within hours, and no car, 4x4 included, is heavy enough to argue with it." },

      { kind: "h2", text: "Picking the car" },
      { kind: "para", text: "If Jebel Akhdar or self-driven dunes are in the plan, hire a 4x4 and be done with it. If not, take the saloon, keep the difference, and let a desert camp handle the sand. Either way, collect it at Muscat airport rather than in town -- the choice is wider, and you skip the city traffic on the first morning." },
      { kind: "cta", link: "cars", label: "Compare car hire in Muscat", note: "4x4s and saloons, pick-up at Muscat airport, from our booking partners." },
      { kind: "cta", link: "hotels", destination: "Nizwa, Oman", label: "Compare hotels in Nizwa", note: "Live rates from our hotel partner, for the night before the mountain." },
      { kind: "cta", link: "flights", label: "Compare flights to Muscat", note: "Fares into Muscat from our booking partners." },
    ],
    related: ["rental-car-damage-waiver", "marrakech-sahara-how-long", "southwest-road-trip"],
  },

  "kruger-self-drive-or-private-reserve": {
    dek: "Kruger is one of the few great safari parks you can drive yourself, in an ordinary hire car. Whether you should depends on what you want from the week.",
    published: "2026-09-11",
    blocks: [
      { kind: "para", text: "Most safaris come as a package: a lodge, a guide, a vehicle, and one price for the lot. Kruger is different. The national park has paved roads, fenced rest camps and clear rules, and you are allowed to drive yourself around it in whatever car you hired at the airport." },
      { kind: "para", text: "Along its western edge sit private reserves -- Sabi Sand, Timbavati, Klaserie and others -- with no fence between them and the park. Same bush, same animals, and a very different experience at a very different price. **For most first visits the honest answer is both: a couple of nights driving yourself, then a couple being driven.**" },

      { kind: "h2", text: "The short answer" },
      { kind: "list", items: [
        "**Self-drive Kruger** if you are watching the budget, love the freedom to stop where you like, and can live with the rules: stay in the car, stay on the road, be back in camp before the gates shut.",
        "**A private reserve** if you want an expert finding the animals for you, open vehicles, off-road tracking and drives after dark.",
        "**Both,** if the trip allows. Two nights of each makes a very good week.",
      ]},

      { kind: "h2", text: "Driving yourself through the park" },
      { kind: "para", text: "Kruger's main roads are tarred and its gravel roads are generally well kept, so an ordinary hire car copes fine -- you do not need a 4x4. Speed limits are low, 50 km/h on tar and 40 on gravel, and in practice you will drive slower still, because the whole point is looking." },
      { kind: "para", text: "You sleep in the park's rest camps: fenced compounds with huts, cottages and campsites, a shop and usually a restaurant. The best camps book up long in advance, especially around South African school holidays, so reserve them before anything else." },
      { kind: "callout", title: "The gate times are not a suggestion", text: "Camp and park gates open and close at fixed times that shift through the year, roughly with sunrise and sunset. You must be inside a camp before its gate closes, and arriving late can mean a fine. Plan each day's drive backwards from closing time." },
      { kind: "para", text: "The limits are real. Self-drivers must stay inside the vehicle except at marked spots, and must stay on the roads -- no following a leopard into the bush. Driving after dark is not allowed at all. The camps do sell guided sunset and night drives, which is the cheapest way to see what comes out at night." },

      { kind: "h2", text: "What a private reserve adds" },
      { kind: "para", text: "At a private reserve lodge you do not drive. Twice a day, at dawn and late afternoon, a ranger and usually a tracker take you out in an open vehicle. They share sightings with the other vehicles on the reserve by radio, and in many reserves they can leave the track to get close to an animal -- which is how most of the great leopard photographs are taken." },
      { kind: "para", text: "The afternoon drive carries on after dark with a spotlight, and many lodges offer guided bush walks as well. Rates are usually all-inclusive -- meals, drives and often drinks -- which is why they look so high next to a rest camp hut. You are paying for a guide's skill, far fewer vehicles at each sighting, and access the park's own rules do not allow." },

      { kind: "h2", text: "What each one costs" },
      { kind: "para", text: "The national park charges a conservation fee per person, per day, with a higher rate for international visitors, on top of your camp accommodation. Private reserves charge their own fees, normally folded into the lodge rate. Either way, as with any safari, fewer and longer stays beat moving on every night." },

      { kind: "h2", text: "Getting there" },
      { kind: "list", items: [
        "**By air:** Kruger Mpumalanga International, near Mbombela, serves the south of the park; Skukuza has its own airport inside it; Hoedspruit is the gateway for Timbavati and Klaserie.",
        "**By road:** the southern gates are five hours or more from Johannesburg, on good roads. South Africa drives on the left.",
        "**From Cape Town:** fly. It is a very long way by road, and the short flight is exactly why Cape Town and Kruger pair so well.",
      ]},
      { kind: "cta", link: "cars", label: "Compare car hire for Kruger", note: "Pick-up at Kruger Mpumalanga or Johannesburg from our booking partners." },

      { kind: "h2", text: "Before you go" },
      { kind: "list", items: [
        "**Malaria:** Kruger is in a malaria area. Talk to a travel clinic well before you leave about whether you need tablets.",
        "**Pack for the cold:** in the dry winter months -- the best for game viewing -- dawn drives in an open vehicle are properly cold. Bring a warm layer and a hat.",
        "**Binoculars:** a pair each. Passing one pair around at a sighting means someone always misses it.",
      ]},
      { kind: "cta", link: "hotels", destination: "Hazyview, South Africa", label: "Compare stays near Kruger's southern gates", note: "Live rates from our hotel partner around Hazyview, a short drive from the park." },
      { kind: "cta", link: "flights", label: "Compare flights to Johannesburg", note: "Fares into Johannesburg from our booking partners." },
    ],
    related: ["kenya-safari-basics", "driving-on-the-other-side", "rental-car-damage-waiver"],
  },


  "japan-rail-pass-worth-it": {
    dek: "Since the 2023 price rise the pass loses money on a lot of ordinary itineraries -- price yours before you buy.",
    published: "2026-09-08",
    blocks: [
      { kind: "para", text: "For years the advice was automatic: going to Japan, buy the rail pass. That stopped being true in October 2023, when the price rose by roughly two thirds in one step. The pass did not become bad value overnight, but it did stop being the default, and plenty of itineraries that used to break even comfortably now do not." },
      { kind: "para", text: "The good news is that this is one of the few travel questions with an actual arithmetic answer. It takes about ten minutes to settle." },

      { kind: "h2", text: "How to price it in ten minutes" },
      { kind: "list", items: [
        "**Write down your real route**, in order, with the long train legs only. Tokyo to Kyoto counts. A subway ride across Tokyo does not.",
        "**Price each leg individually** on a fare site or the operator's own booking page, one way, reserved seat.",
        "**Add them up** and compare to the pass price for the duration you would need.",
        "**Ignore the day trips** you have not committed to. Counting hypothetical journeys is how people talk themselves into a pass they will not use.",
      ]},
      { kind: "para", text: "If the total is comfortably above the pass, buy it. If it is close, do not -- a marginal win is not worth locking your route to a single operator's network." },

      { kind: "h2", text: "Where the pass still wins" },
      { kind: "para", text: "Long, multi-city routes covered end to end. A trip that runs Tokyo, Kyoto, Hiroshima and back inside a week is the shape the pass was built for, because the return leg alone is a substantial fare and you are riding the spine of the network the whole way." },
      { kind: "para", text: "It also wins when your plans are genuinely unsettled. The freedom to change your mind at the station has a real value that does not show up in a spreadsheet, even if it is smaller than people assume." },

      { kind: "h2", text: "Where it now loses" },
      { kind: "para", text: "Two cities and a couple of day trips. Tokyo and Kyoto with an excursion to Nara and another to Hakone is a wonderful two weeks and it is not enough long-distance travel to clear the price. Buy individual tickets and spend the difference on dinner." },
      { kind: "callout", title: "The pass does not cover every fast train", text: "The fastest Nozomi and Mizuho services on the Tokaido and Sanyo lines have historically sat outside the standard pass, with pass holders directed to the slightly slower Hikari and Sakura. Supplement options have changed more than once, so check the current terms for your route rather than assuming -- the difference is typically minutes, but it matters if you are timing a connection." },
      { kind: "para", text: "It also loses on any trip that leans on internal flights, which are often cheaper than the equivalent rail fare for the longest hops, and on trips that stay mostly inside one region on private railways the pass does not cover." },

      { kind: "h2", text: "The regional passes almost nobody prices" },
      { kind: "para", text: "There is a whole tier below the nationwide pass: regional passes covering Kansai, the west, the north, and other areas, at a fraction of the price. If your trip is really Kyoto, Osaka, Nara and Hiroshima, a regional pass is frequently the right answer and gets skipped because the national one dominates the conversation." },
      { kind: "para", text: "Price the regional option against your route as well. It is the single most common way to end up ahead." },

      { kind: "cta", link: "flights", label: "Compare flights to Japan", note: "Fares into Tokyo and Osaka from our booking partners." },

      { kind: "h2", text: "What to do about seats" },
      { kind: "para", text: "Reserve them, pass or no pass. Shinkansen services run to the minute and unreserved carriages fill on popular routes, particularly in blossom season and around national holidays. A reservation costs little or nothing depending on your ticket and removes the one genuinely stressful part of Japanese rail travel." },
      { kind: "para", text: "The other habit worth forming: your luggage. Oversized bags need a reserved space on some services, and travelling light through stations designed around escalators and short platform stops is its own reward." },
    ],
    related: ["switzerland-by-train", "packing-carry-on-only", "best-time-to-book-a-flight"],
  },

  "thailand-which-coast-which-month": {
    dek: "The Andaman and the Gulf run opposite wet seasons, so the question is never simply when to go.",
    published: "2026-09-08",
    blocks: [
      { kind: "para", text: "Most advice about the best time to visit Thailand is written as though the country has one climate. It has two that matter, on opposite sides of a narrow peninsula, and they are frequently out of step. This is why a friend can tell you October was perfect and another can tell you October was a washout, and both are telling the truth." },
      { kind: "para", text: "Pick the coast first. The month follows from it." },

      { kind: "h2", text: "The two coasts" },
      { kind: "list", items: [
        "**The Andaman coast, west.** Phuket, Krabi, Railay, Ko Lanta, Ko Phi Phi. The limestone scenery most people picture when they picture Thailand.",
        "**The Gulf coast, east.** Ko Samui, Ko Pha Ngan, Ko Tao. Gentler landscapes, and the diving centre of the country at Ko Tao.",
      ]},
      { kind: "para", text: "They are a few hours apart by road and boat, and their weather is not interchangeable. Broadly, the Andaman side is at its best from roughly November through March and wettest around May to October. The Gulf side runs later, holding up well through much of that Andaman wet season and taking its own heaviest rain around November and December." },
      { kind: "para", text: "The practical consequence: there is almost no month with no good island option, but there are plenty of months with a wrong one." },

      { kind: "h2", text: "Reading it as a decision, not a forecast" },
      { kind: "list", items: [
        "**Travelling December to March?** Either coast works; the Andaman is at its peak and priced accordingly.",
        "**Travelling June to September?** Lean Gulf. This is when Ko Tao and Ko Pha Ngan earn their reputation while the west is squally.",
        "**Travelling October or November?** This is the genuinely awkward window, with the Andaman still drying out and the Gulf heading into its wettest stretch. Shorten the island leg and give the time to Bangkok and the north.",
      ]},
      { kind: "callout", title: "Rain here is not the rain you are imagining", text: "Wet season in Thailand mostly means a heavy downpour for an hour or two, often late afternoon, and sun either side. It is boat crossings and visibility for diving that get disrupted, not the whole day. A wet-season island trip that stays put on one island is far less affected than one built around hopping." },

      { kind: "h2", text: "The north runs on a different clock again" },
      { kind: "para", text: "Chiang Mai and the hills are coolest and clearest from November to February, which is also the most comfortable stretch for the temples and the markets. March and April bring both real heat and, in some years, agricultural burning that can settle over the valley for weeks. If the north is the point of your trip, that is the window to avoid." },

      { kind: "cta", link: "tours", destination: "Thailand", label: "Compare Thailand tours", note: "Island trips, cooking classes and day tours from our booking partners." },

      { kind: "h2", text: "Getting between them" },
      { kind: "para", text: "Domestic flights are cheap and quick, and they are what makes a two-coast trip realistic in two weeks. Bangkok to Krabi or Phuket, or Bangkok to Surat Thani for the Gulf boats, is an hour and change and often costs less than the overnight bus once you value the night." },
      { kind: "para", text: "One thing worth planning around: the last boat. Island transfers stop earlier than you expect, and a flight that lands in the evening frequently means a night on the mainland whether you budgeted for one or not." },
    ],
    related: ["vietnam-esim-vs-sim", "sri-lanka-two-weeks", "packing-carry-on-only"],
  },

  "marrakech-sahara-how-long": {
    dek: "It is sold as an easy add-on, and it is two long driving days each way.",
    published: "2026-09-08",
    blocks: [
      { kind: "para", text: "Every agency window in Marrakech advertises the desert, and the way it is sold makes it sound like a day out. It is not. Erg Chebbi, the dune field most people mean when they say the Sahara, is the better part of two days' driving from Marrakech, and the same again coming back." },
      { kind: "para", text: "That is not a reason to skip it. A night in the dunes is one of the genuinely unforgettable things you can do in Morocco. It is a reason to know what you are spending, because a badly planned desert trip eats most of a week and leaves you with photographs of the inside of a minibus." },

      { kind: "h2", text: "What the drive actually is" },
      { kind: "para", text: "The route crosses the High Atlas by the Tizi n'Tichka pass, which is spectacular, slow, and full of switchbacks. Then it runs down through the Draa or Dades valleys and out to the sand. Distances that look modest on a map take much longer than the numbers suggest, and that is before the stops." },
      { kind: "list", items: [
        "**Two days out**, with a night in the Dades or Todra gorges, arriving at the dunes on the second afternoon.",
        "**One night in the desert**, which is the whole point -- camel trek at sunset, dinner, stars.",
        "**Two days back**, usually by the same road, unless you fly out of Errachidia or push north to Fes instead.",
      ]},
      { kind: "para", text: "So the honest minimum is three days and two nights, and that version is rushed. Four days is the comfortable shape." },

      { kind: "h2", text: "The mistake worth avoiding" },
      { kind: "para", text: "Booking the round trip back to Marrakech when your onward plans are north. If Fes is on your itinerary, do the desert as a one-way and finish there -- it turns four days of driving into three and you never repeat a road." },
      { kind: "callout", title: "One-way beats a loop here", text: "Marrakech, desert, then north to Fes is the standard route for a reason: nothing is driven twice. Booking a return to Marrakech and then travelling to Fes separately adds a full day and a second long journey, for no gain. Decide your exit city before you book the desert leg, not after." },

      { kind: "h2", text: "Two nights in the dunes is usually one too many" },
      { kind: "para", text: "Camps sell two-night stays and they are lovely, but the desert reveals most of itself on the first evening and the following dawn. Unless you are there specifically to walk or to photograph, the second night is often better spent in the gorges on the way back, which are underrated and much less visited." },

      { kind: "cta", link: "tours", destination: "Morocco", label: "Compare Morocco desert tours", note: "Multi-day Sahara trips and Atlas crossings from our booking partners." },

      { kind: "h2", text: "Driver or self-drive" },
      { kind: "para", text: "Hire a driver. This is one of the few places where the recommendation is close to unanimous, and it is not about the difficulty of the roads so much as the length of the days. Someone else driving the Tichka pass while you look out of the window is the difference between a scenic day and an exhausting one." },
      { kind: "para", text: "It is also markedly cheaper than the equivalent would be in Europe, and a driver who knows the route will stop in the right places rather than the ones with the biggest car parks." },

      { kind: "h2", text: "When not to go" },
      { kind: "para", text: "High summer. Marrakech and the desert regularly pass 40C, and a camel trek across open sand in that heat is an endurance exercise rather than a pleasure. March to May and September to November are the windows, and the desert nights in those months are cool enough to want the blanket the camp gives you." },
    ],
    related: ["kenya-safari-basics", "packing-carry-on-only", "sri-lanka-two-weeks"],
  },

  "yucatan-in-a-week": {
    dek: "Two bases beat three. The driving you save is a whole day of your trip.",
    published: "2026-09-08",
    blocks: [
      { kind: "para", text: "The Yucatan is flat, well-roaded and deceptively spread out. It tempts people into an itinerary that moves every two nights -- Cancun, then Tulum, then Valladolid, then Merida -- and the result is a week where a surprising amount of the time is spent packing, checking out and sitting in a hire car." },
      { kind: "para", text: "Two bases is almost always the better week. You see more, because you spend the saved hours actually seeing things." },

      { kind: "h2", text: "The two-base week" },
      { kind: "list", items: [
        "**Nights 1-4, the coast.** Tulum or Akumal. Beach, the clifftop ruins, and the cenotes strung along the road inland.",
        "**Nights 5-7, inland.** Valladolid or Merida. Colonial streets, the quieter cenotes, and Chichen Itza or Uxmal within easy reach.",
      ]},
      { kind: "para", text: "One move, mid-week, in a direction you were travelling anyway. Everything else is a day trip from somewhere you have already unpacked." },

      { kind: "h2", text: "Chichen Itza is a timing problem, not a distance one" },
      { kind: "para", text: "It is close to almost everywhere on this route. The difficulty is that it receives an enormous number of coach parties from the coast, all arriving mid-morning, and by eleven the site is both crowded and extremely hot." },
      { kind: "callout", title: "Stay inland the night before", text: "The single best thing you can do for Chichen Itza is sleep in Valladolid, forty minutes away, and arrive at opening. You will have the Kukulkan pyramid in reasonable quiet for an hour before the first coaches from Cancun and Tulum reach the gate. Doing it as a day trip from the coast means arriving exactly when everyone else does." },
      { kind: "para", text: "If early is impossible, late afternoon is the second-best option for the same reason, and the light is better." },

      { kind: "h2", text: "Cenotes: pick by type, not by list" },
      { kind: "para", text: "There are thousands, and they are not interchangeable. Open ones are essentially swimming holes with sunlight and are good for a hot afternoon. Cavern and cave cenotes are dark, cooler, and considerably more atmospheric. Most people visit three of the same kind without realising there was a choice." },
      { kind: "para", text: "Go early here too. The popular ones near the main road fill by midday, and the smaller ones signposted off it are frequently empty at nine in the morning." },

      { kind: "cta", link: "cars", label: "Compare car hire in Mexico", note: "Pick-up in Cancun or Merida from our booking partners." },

      { kind: "h2", text: "Do you need the car?" },
      { kind: "para", text: "For this week, yes. Colectivos and ADO buses cover the main road between the coastal towns perfectly well, but the cenotes and the smaller ruins sit off it, and that is where the difference between a good Yucatan trip and a coach-party one lies." },
      { kind: "para", text: "Two practical notes: keep cash for the cenote entry fees, which are frequently cash-only and set by whoever owns the land, and read the insurance terms before you collect the car rather than at the desk with a queue behind you." },
    ],
    related: ["rental-car-damage-waiver", "one-way-rental-fees", "driving-on-the-other-side"],
  },

  "cappadocia-balloon-odds": {
    dek: "Flights are grounded for wind far more often than people expect -- plan the trip so that is survivable.",
    published: "2026-09-08",
    blocks: [
      { kind: "para", text: "The balloon flight is why a lot of people go to Cappadocia, and it is genuinely worth the early alarm. What the photographs do not convey is how often it does not happen. Flights are cancelled for wind regularly, decisions are made at dawn, and no amount of paying more changes the weather." },
      { kind: "para", text: "This is entirely manageable, but only if you plan for it before you arrive rather than discovering it on your one available morning." },

      { kind: "h2", text: "What actually grounds a flight" },
      { kind: "para", text: "Wind, almost always -- both at ground level and aloft, since the pilots steer by finding different wind directions at different altitudes. Rain and poor visibility matter too, but wind is the usual culprit, and it is why a bright, still-looking morning can still end with a cancellation." },
      { kind: "para", text: "The call is made very early, typically at or before dawn, by the civil aviation authority rather than the individual operator. That is worth knowing because it means every company is grounded at once. Shopping around after a cancellation achieves nothing." },

      { kind: "h2", text: "The fix is scheduling, not spending" },
      { kind: "list", items: [
        "**Give yourself three mornings, not one.** Two nights in Cappadocia is the most common mistake; three gives you two genuine attempts.",
        "**Book the first morning, not the last.** If it flies, you have spare days for the valleys. If it does not, you still have chances left.",
        "**Expect a refund, not a rebooking.** Cancelled flights are normally refunded; whether you can fly the next day depends on availability, which is tight in season.",
      ]},
      { kind: "callout", title: "Winter is not the write-off people assume", text: "Cappadocia under snow is startlingly beautiful and prices drop, but balloons are grounded more often in winter. If the flight is the whole reason for the trip, that trade goes the wrong way. If you would enjoy the valleys and the cave hotels regardless, winter is a genuinely good time to go." },

      { kind: "h2", text: "If you do not fly" },
      { kind: "para", text: "Watch instead. The balloons launch en masse around sunrise and the view from the ground, particularly from a hotel terrace or one of the ridges above Goreme, is remarkable in its own right -- arguably a better photograph than the one you would take from inside a basket." },
      { kind: "para", text: "The valleys are the other answer. The Rose and Red valleys are walkable in a morning, and the underground cities at Derinkuyu and Kaymakli are entirely weather-proof." },

      { kind: "cta", link: "tours", destination: "Cappadocia", label: "Compare Cappadocia tours", note: "Balloon flights, valley walks and underground cities from our booking partners." },

      { kind: "h2", text: "Getting there" },
      { kind: "para", text: "Fly. Kayseri and Nevsehir both serve the region, domestic flights within Turkiye are cheap and quick, and the drive from Istanbul is a very long day for no reward. Most hotels arrange the airport transfer, and in a region where the interesting places are scattered across valleys, that is usually easier than hiring a car for a short stay." },
    ],
    related: ["qatar-layover", "best-time-to-book-a-flight", "hotel-room-upgrade-tips"],
  },

  "jordan-pass-explained": {
    dek: "It bundles the visa waiver with entry to Petra and dozens of other sites -- and only if you buy it before you land.",
    published: "2026-09-08",
    blocks: [
      { kind: "para", text: "Jordan does something unusual and genuinely generous: it sells a single pass that waives the tourist visa fee and covers entry to Petra and a long list of other sites. For almost anyone spending more than a couple of days in the country, it costs less than buying those things separately." },
      { kind: "para", text: "There is one condition, and it is the whole article: you have to buy it before you arrive. Bought after you land, the visa waiver is gone, and you have paid for the visa twice over." },

      { kind: "h2", text: "What it actually covers" },
      { kind: "list", items: [
        "**The tourist visa fee**, waived -- provided you meet the minimum-nights condition attached to the pass.",
        "**Entry to Petra**, for one, two or three consecutive days depending on which version you buy.",
        "**Dozens of other sites**, including Jerash, the Amman Citadel, Wadi Rum's protected area and the desert castles.",
      ]},
      { kind: "para", text: "Petra entry alone is the single largest site fee in the country, which is why the arithmetic works out so consistently in the pass's favour." },

      { kind: "h2", text: "Choosing the Petra duration" },
      { kind: "para", text: "The pass comes in variants covering one, two or three days at Petra. Two is the right answer for most people and it is not close." },
      { kind: "para", text: "One day gets you the Siq, the Treasury and probably the Monastery if you march. Two lets you do the Monastery properly on the second morning when it is cool and quiet, and leaves room for the back trails -- which is where Petra stops being a photograph you have already seen and becomes a place." },
      { kind: "callout", title: "The days must be consecutive", text: "The Petra days on the pass run back to back, so an itinerary that visits Petra, drives to Wadi Rum for a night and returns will not work with a two-day pass. Plan Petra as one continuous block, then move on -- which is how the standard Amman, Petra, Wadi Rum, Dead Sea route is sequenced anyway." },

      { kind: "h2", text: "The condition people miss" },
      { kind: "para", text: "The visa waiver is conditional on staying a minimum number of consecutive nights in Jordan -- three, at time of writing. A short stopover trip does not qualify, and the pass then only saves you the site entries rather than the visa." },
      { kind: "para", text: "That rule has been stable for years but it is exactly the sort of detail that changes, so read the current terms on the official pass site when you buy rather than trusting a blog post, this one included." },

      { kind: "cta", link: "tours", destination: "Jordan", label: "Compare Jordan tours", note: "Petra, Wadi Rum and Dead Sea trips from our booking partners." },

      { kind: "h2", text: "Where it does not help" },
      { kind: "para", text: "Wadi Rum is the notable gap. The pass covers entry to the protected area, but the jeep tour and the camp are separate and are the bulk of what you will actually spend there. The Dead Sea is similar -- the resorts and beach clubs charge their own admission regardless." },
      { kind: "para", text: "Budget those separately, and treat the pass as covering the archaeology rather than the whole trip." },
    ],
    related: ["cappadocia-balloon-odds", "kenya-safari-basics", "packing-carry-on-only"],
  },

  "alhambra-tickets-ahead": {
    dek: "Entry is capped and timed, and the Nasrid Palaces slot is the one that sells out first.",
    published: "2026-09-08",
    blocks: [
      { kind: "para", text: "Most of Andalusia rewards spontaneity. The Alhambra does the opposite. Daily entry is capped, tickets are timed, and in high season they sell out weeks and sometimes months in advance. People arrive in Granada having booked everything else and find the one thing they came for is unavailable for the length of their stay." },
      { kind: "para", text: "The fix is simple and slightly backwards: book the Alhambra first, then build Granada around the slot you got." },

      { kind: "h2", text: "The bit that actually sells out" },
      { kind: "para", text: "The Alhambra is not one ticket. The grounds, the Generalife gardens and the Alcazaba have reasonable capacity. The Nasrid Palaces -- the carved, tiled, honeycombed interiors that are the reason the place is famous -- are entered in timed half-hour blocks with a hard cap." },
      { kind: "para", text: "Your ticket names a Nasrid Palaces time. Miss it and you do not get in, regardless of how long you queued. Everything else about your visit is flexible; that one slot is not." },
      { kind: "callout", title: "Bring the passport you booked with", text: "Alhambra tickets are personal and name-matched, and identification is checked at entry. Book with the exact name on the passport you will be carrying, and bring it -- a mismatch between booking name and document is a refusal at the gate, and it is not a rule anyone bends." },

      { kind: "h2", text: "Which slot to take" },
      { kind: "list", items: [
        "**First thing** is coolest and quietest, and in summer that matters more than it sounds -- there is very little shade in the Generalife.",
        "**Late afternoon** gives the best light in the palaces and lets you spend the hot middle of the day in the city.",
        "**Avoid the middle of the day in July and August** unless you have no choice; Granada regularly sits in the high thirties.",
      ]},
      { kind: "para", text: "Give yourself three hours for the whole site even if the palace slot is thirty minutes. The walk between sections is longer than the map suggests and it is uphill." },

      { kind: "cta", link: "events", label: "Compare Granada tickets and tours", note: "Alhambra guided visits and Granada experiences from our booking partners." },

      { kind: "h2", text: "If it is genuinely sold out" },
      { kind: "para", text: "Guided tours hold their own allocations, so a tour can get you in when direct tickets have gone. It costs more and you move at the group's pace, but it is a real option rather than a consolation prize, and a good guide adds a lot to a site this dense with history." },
      { kind: "para", text: "Failing that, the grounds-only ticket still includes the Generalife and the Alcazaba, and the view of the palace complex from the Mirador de San Nicolas in the Albaicin costs nothing at all. It is not a substitute, but it is a fine evening." },

      { kind: "h2", text: "One night is not enough" },
      { kind: "para", text: "Granada tends to get a single night in a Barcelona-Madrid-Seville week, and a timed Alhambra slot makes that fragile: an inconvenient time and you have seen little else. Two nights turns it from a logistics exercise into a stop, and the Albaicin in the evening is worth the extra one." },
    ],
    related: ["48-hours-in-lisbon", "hotel-room-upgrade-tips", "free-cancellation-fine-print"],
  },

  "croatia-ferries-vs-driving": {
    dek: "Fast catamarans do not take cars. That single fact decides the shape of most Dalmatian trips.",
    published: "2026-09-08",
    blocks: [
      { kind: "para", text: "The Dalmatian coast looks like a driving holiday and behaves like a ferry one. The coastal road is genuinely lovely, the islands are the reason people come, and the connection between the two is where itineraries fall apart -- because the fast boats and the car boats are not the same service." },

      { kind: "h2", text: "Two different fleets" },
      { kind: "list", items: [
        "**Catamarans** are fast, passenger-only, and the way most people reach Hvar or Vis from Split in about an hour. **No cars.**",
        "**Car ferries** are slower and less frequent, and they are the only way to bring a vehicle to an island.",
      ]},
      { kind: "para", text: "The practical consequence: if you hire a car for the coast and then want the islands, you are choosing between a slow car ferry with limited sailings, or leaving the car parked on the mainland and paying for it to sit there." },

      { kind: "h2", text: "The shape that usually works" },
      { kind: "para", text: "Split and the islands on foot and by catamaran, then a car only for the parts a car actually helps with -- Plitvice, Krka, the drive down towards Dubrovnik." },
      { kind: "para", text: "Hvar town, Vis and Korcula's old town are all compact and walkable, and having a car on them is closer to a liability than a convenience. Parking in the old towns ranges from expensive to genuinely impossible in August." },
      { kind: "callout", title: "Book island car ferries early in summer", text: "Vehicle space on the car ferries is finite and sells out on popular July and August sailings, particularly to Hvar. Foot passengers can nearly always squeeze on; a car cannot. If a leg of your trip depends on getting a vehicle onto an island on a specific day, that is the booking to make first." },

      { kind: "h2", text: "Dubrovnik is its own problem" },
      { kind: "para", text: "The old town is entirely pedestrian, parking outside it is limited and priced accordingly, and the approach road is slow in season. If Dubrovnik is your finish, dropping the car before you arrive rather than after is usually the cheaper and calmer choice -- one-way drop fees are common in Croatia, so price that in when you book." },

      { kind: "cta", link: "cars", label: "Compare car hire in Croatia", note: "Pick-up in Split, Zadar or Dubrovnik from our booking partners." },

      { kind: "h2", text: "Timing the season" },
      { kind: "para", text: "May, June and September are the sweet spot -- warm water, full ferry timetables, and a fraction of the August pressure on both boats and parking. Outside the season, catamaran frequencies drop sharply and some island routes reduce to a service a day or less, which is enough to strip an itinerary of its flexibility." },
      { kind: "para", text: "Check the sailing frequency for your specific route and month before you commit to the order of your stops. It is the one variable that quietly determines everything else." },
    ],
    related: ["one-way-rental-fees", "rental-car-damage-waiver", "yucatan-in-a-week"],
  },

  "egypt-nile-cruise-or-not": {
    dek: "The cruise is the classic way to see Luxor and Aswan. It is not automatically the better one.",
    published: "2026-09-08",
    blocks: [
      { kind: "para", text: "Almost every Egypt itinerary puts a Nile cruise between Luxor and Aswan, and it is a genuinely good way to travel: the temples are strung along the river, the boat moves while you sleep, and you unpack once. But it is presented as the only option when it is really a trade, and for some trips the land-based version is better." },

      { kind: "h2", text: "What the cruise does well" },
      { kind: "list", items: [
        "**No repacking.** Four days, one room, and the temples come to you.",
        "**Kom Ombo and Edfu** sit between the two cities and are awkward to reach any other way; cruises stop at both as a matter of course.",
        "**Arriving by water** at Aswan is a genuinely different experience from arriving by road.",
      ]},

      { kind: "h2", text: "What it costs you" },
      { kind: "para", text: "Timing control, mostly. Cruise schedules are fixed and they cluster: boats arrive at the same sites within the same hours, which is why the Valley of the Kings and Karnak can feel like a scrum in the middle of the morning and be almost calm at opening." },
      { kind: "para", text: "Staying in Luxor lets you be at the Valley of the Kings when it opens and back at the hotel before the worst heat, which in a place where summer temperatures are punishing is not a small thing. You also eat where you like rather than on the boat's schedule." },
      { kind: "callout", title: "Luxor's sites are on two banks, and it matters", text: "Karnak and Luxor Temple are on the east bank; the Valley of the Kings, Hatshepsut's temple and the Colossi are on the west. Grouping them by bank rather than bouncing across the river saves real time either way, and it is easier to arrange staying on land than from a boat's fixed programme." },

      { kind: "h2", text: "Who should take the cruise" },
      { kind: "para", text: "First visits with limited time, anyone who would rather not organise transfers and guides site by site, and anyone travelling in the hot months who values a pool and air conditioning between temples. It is the low-friction option and there is nothing wrong with wanting that." },

      { kind: "h2", text: "Who should stay put" },
      { kind: "para", text: "Repeat visitors, photographers, and anyone whose priority is being at the big sites at opening. Luxor has enough within reach for three or four days on its own, and a domestic flight or the train covers the Aswan leg cheaply if you still want Abu Simbel and Philae." },

      { kind: "cta", link: "tours", destination: "Egypt", label: "Compare Egypt tours and cruises", note: "Nile cruises, Luxor day trips and guided sites from our booking partners." },

      { kind: "h2", text: "When to go, non-negotiably" },
      { kind: "para", text: "October to April. Upper Egypt in summer is severe -- the Valley of the Kings is an unshaded limestone bowl, and midday there in July is not a sightseeing proposition. Within the good window, earlier and later in the day beats the middle regardless of which option you pick." },
    ],
    related: ["marrakech-sahara-how-long", "kenya-safari-basics", "long-haul-flight-survival"],
  },

  "bali-without-a-scooter": {
    dek: "Scooter crashes are the most common way a Bali trip goes wrong, and the alternatives are cheap.",
    published: "2026-09-08",
    blocks: [
      { kind: "para", text: "Renting a scooter is the default advice for Bali and it is worth pushing back on. Traffic is dense and fast, road surfaces are inconsistent, and a great many visitors ride with no licence for it, no helmet worth the name, and travel insurance that will not pay out for exactly that reason." },
      { kind: "para", text: "The road-rash injuries have their own nickname among expats, which tells you how routine they are. The alternatives are genuinely cheap and mostly more pleasant." },

      { kind: "h2", text: "The insurance point, since it is the expensive one" },
      { kind: "para", text: "Most travel policies exclude motorbike injuries unless you hold a valid licence for that category, and many require a local or international permit as well. A hospital stay in Denpasar or a medical evacuation is not a bill you want to discover is yours." },
      { kind: "para", text: "Read your policy wording before you rent, not after. It is a two-minute check and it is the difference between an inconvenience and a financial catastrophe." },

      { kind: "h2", text: "What to do instead" },
      { kind: "list", items: [
        "**A car with a driver for the day.** The standard Bali solution, priced per day rather than per journey, and it costs far less than the equivalent anywhere in Europe. The driver waits while you visit things.",
        "**Ride-hailing apps** work well in the south and around Ubud, though some areas have local restrictions on where app drivers may pick up.",
        "**Staying put.** Bali's distances are short on paper and slow in practice; picking two bases rather than day-tripping across the island removes most of the transport question."
      ]},
      { kind: "callout", title: "A driver is cheaper than you think, per person", text: "A full day with a car and driver is typically comparable to a couple of restaurant meals, and it is a flat rate rather than per head. Split between two or more people it is frequently cheaper than hiring two scooters, before you count the risk." },

      { kind: "h2", text: "The traffic is the real argument" },
      { kind: "para", text: "The stretch between the southern beaches and Ubud is slow at almost any hour, and getting slower year on year. A journey that looks like forty minutes routinely takes ninety. That is tiring on a scooter in the heat and trivial in an air-conditioned car where someone else is dealing with it." },

      { kind: "cta", link: "cars", label: "Compare car hire in Indonesia", note: "Cars and drivers across Bali and beyond from our booking partners." },

      { kind: "h2", text: "If you ride anyway" },
      { kind: "para", text: "Bring or buy a proper helmet rather than accepting the rental one, get the international permit before you travel because you cannot obtain it once you have left home, and do not ride at night on unlit roads outside the towns. Stay off the scooter entirely after a drink -- that combination is behind a large share of the serious incidents." },
    ],
    related: ["vietnam-esim-vs-sim", "thailand-which-coast-which-month", "driving-on-the-other-side"],
  },

  "kenya-safari-basics": {
    dek: "Park fees, timing and transfers decide most of your budget -- and most first-timers find out about them too late.",
    published: "2026-09-04",
    blocks: [
      {
        kind: "para",
        text: "A Kenyan safari is one of the few trips where the headline price tells you almost nothing. Two people can book the same number of nights in the same reserve and pay wildly different amounts, because the cost sits in things that never appear in a brochure photo: how many days you are inside a park gate, whether you flew or drove to get there, and whether your vehicle is shared with six strangers.",
      },
      {
        kind: "para",
        text: "None of that is a reason to overthink it. But knowing where the money and the time actually go makes the difference between a trip that feels effortless and one where you spend the third morning doing arithmetic in the back of a Land Cruiser.",
      },

      { kind: "h2", text: "Timing: the migration is not the only reason to go" },
      {
        kind: "para",
        text: "The Great Migration river crossings in the Masai Mara are usually a July-to-October event, and that window is priced accordingly. It is spectacular, and it is also the busiest and most expensive time to be there, with the most vehicles at any given sighting.",
      },
      {
        kind: "para",
        text: "Kenya has two rainy periods -- the long rains roughly March to May, the short rains around November. The dry stretches on either side concentrate animals around water, which is what actually makes game viewing good. January and February are dry, hot, green from the short rains, and considerably quieter than the migration peak.",
      },
      {
        kind: "callout",
        title: "If you have flexibility",
        text: "Late January to early March gives you dry-season visibility, newborn animals, lower rates and thinner crowds. You trade away the river crossings. For a first safari, that is usually the better deal.",
      },

      { kind: "h2", text: "Park fees are per person, per day" },
      {
        kind: "para",
        text: "This is the line item that surprises people. Conservancy and national park entry is charged per person for each 24-hour period you are inside, and in the premium reserves it is a substantial daily figure rather than a token gate charge. On a week-long itinerary it can rival what you paid for the flight.",
      },
      {
        kind: "para",
        text: "Rates are revised periodically and differ between national parks and the private conservancies bordering them, so check the current figure for your specific park rather than trusting a number in a two-year-old forum post. What matters for planning is the shape of the cost: every extra day inside the gate has a fixed floor, no matter how modest your accommodation is.",
      },
      {
        kind: "para",
        text: "The practical consequence is that fewer, longer stays beat hopping. Three nights in one reserve almost always costs less and delivers more than one night in each of three.",
      },

      { kind: "h2", text: "Which parks, and why" },
      {
        kind: "list",
        items: [
          "Masai Mara -- the classic. Big cats year-round, migration July to October, and the highest vehicle density of anywhere in Kenya. The private conservancies around its edges cost more but cap vehicle numbers and allow off-road driving and night drives, which the reserve itself does not.",
          "Amboseli -- large elephant herds against Kilimanjaro when the mountain is clear, which is mostly early morning. Smaller and flatter than the Mara, easy to combine with it.",
          "Samburu -- dry northern country with species you will not see further south: reticulated giraffe, Grevy's zebra, gerenuk. Fewer visitors, a genuinely different landscape.",
          "Tsavo East and West -- vast, rugged, red-dusted elephants. Good value, lower density of both animals and tourists, and conveniently placed between Nairobi and the coast.",
          "Nairobi National Park -- rhinos with a city skyline behind them, reachable in a morning. Not a substitute for a real safari, but an excellent use of an arrival or departure day.",
        ],
      },

      { kind: "h2", text: "Fly or drive" },
      {
        kind: "para",
        text: "Nairobi to the Mara is a long road day on mixed surfaces -- the last stretch is rough enough that it is part of the story people tell afterwards. The light aircraft transfer from Wilson Airport takes well under an hour to the airstrips.",
      },
      {
        kind: "para",
        text: "Flying costs more per person, but it buys back most of two days, which at daily park-fee rates is not the extravagance it first appears. It also has a strict luggage allowance, usually soft-sided bags around 15 kg. If you are moving between two parks, flying is almost always worth it. If you are visiting only one and have the time, driving is fine and you see the country.",
      },

      { kind: "h2", text: "Shared vehicle or private" },
      {
        kind: "para",
        text: "A shared game drive puts six or seven people in a pop-top minibus on a fixed schedule. A private vehicle means you decide when to leave, how long to sit with a leopard, and when to go back for breakfast. On a short trip where every drive counts, and especially if you photograph, private is the upgrade that changes the experience most per shilling spent.",
      },
      {
        kind: "callout",
        title: "The one question to ask before booking",
        text: "Ask whether park fees are included in the quoted price or added on arrival. This single question explains most of the gap between quotes that otherwise look identical.",
      },

      { kind: "h2", text: "Health and paperwork" },
      {
        kind: "para",
        text: "Malaria precautions are standard for most Kenyan safari areas, and a yellow fever certificate may be required depending on the countries you pass through en route. Requirements change, and this is genuinely a question for a travel clinic or your doctor several weeks before departure rather than something to settle from a blog post. Book that appointment early -- some prophylaxis needs to start before you travel.",
      },

      { kind: "h2", text: "Adding the coast" },
      {
        kind: "para",
        text: "Safari and beach combine well, and the domestic hop from the parks to Diani, Watamu or Malindi is short. After four or five days of pre-dawn game drives, a few flat days on the Indian Ocean is not indulgence, it is pacing. Build it in rather than treating it as an extra.",
      },

      {
        kind: "cta",
        link: "tours",
        destination: "Kenya",
        label: "Compare Kenya safari tours",
        note: "Operators, durations and departure dates from our booking partners.",
      },

      { kind: "h2", text: "What to actually pack" },
      {
        kind: "list",
        items: [
          "Binoculars, one pair per person. The single most underrated item -- guides spot at distances your eyes will not resolve.",
          "Neutral layers. Mornings before sunrise are genuinely cold in an open vehicle; midday is hot.",
          "A soft duffel, not a hard case, if any leg is by light aircraft.",
          "More camera storage than you think, and a way to charge in a tent -- power is often solar and available only at certain hours.",
          "Dust protection for lenses. The dust gets everywhere regardless.",
        ],
      },
      {
        kind: "para",
        text: "Everything else you can buy in Nairobi. Binoculars you cannot, reliably, at the last minute.",
      },
    ],
    related: ["sri-lanka-two-weeks", "new-zealand-south-island", "qatar-layover"],
  },

  // ────────────────────────────────────────────────────────────────
  "48-hours-in-lisbon": {
    dek: "Two days is genuinely enough for Lisbon, provided you stop trying to see all of it.",
    published: "2026-09-04",
    blocks: [
      {
        kind: "para",
        text: "Lisbon rewards a short visit better than most European capitals. The centre is walkable, the airport sits close enough to the city that the metro ride is quicker than most airport transfers, and the things worth seeing cluster into two or three areas rather than scattering across a sprawl.",
      },
      {
        kind: "para",
        text: "The mistake first-timers make is treating it as a checklist. Lisbon is built on seven hills of varying cruelty, and an itinerary that looks tidy on a map turns into a stair-climbing endurance event by mid-afternoon. Plan by neighbourhood, not by monument.",
      },

      { kind: "h2", text: "Getting in from the airport" },
      {
        kind: "para",
        text: "Humberto Delgado (LIS) is close to the centre, and the metro's red line connects it directly. Buy a rechargeable Viva Viagem card at the machine and load it with credit -- the same card covers metro, buses, trams and the funiculars, and it is substantially cheaper than buying single paper tickets each time.",
      },

      { kind: "h2", text: "Day one: Alfama, and the viewpoints" },
      {
        kind: "para",
        text: "Alfama is the old Moorish quarter that survived the 1755 earthquake, which is why its street plan makes no sense and that is the point. Start high at the Castelo de São Jorge and let gravity do the work downhill rather than fighting your way up.",
      },
      {
        kind: "para",
        text: "The miradouros -- the terraced viewpoints -- are the city's real attraction. Santa Luzia and Portas do Sol sit minutes apart above Alfama's rooftops. Senhora do Monte, higher and further, is the one worth the extra climb near sunset and is noticeably less crowded.",
      },
      {
        kind: "callout",
        title: "About tram 28",
        text: "It runs a genuinely scenic route through Graça and Alfama, and it is also packed, slow, and the city's most reliable spot for pickpockets. Ride it early morning if at all. Tram 12 covers a shorter loop with the same character and a fraction of the queue.",
      },
      {
        kind: "para",
        text: "In the evening, Alfama is where fado is sung in small rooms that hold thirty people. The venues that require a booking and a minimum spend are generally more serious about the music than the ones with a tout outside.",
      },

      { kind: "h2", text: "Day two: Belém, then Chiado" },
      {
        kind: "para",
        text: "Belém is a tram or short train ride west, and holds the Jerónimos Monastery and the Torre de Belém -- the two genuine must-sees, both from Portugal's maritime peak. Go early. The monastery queue by late morning is the longest in the city.",
      },
      {
        kind: "para",
        text: "The pastéis de nata at Pastéis de Belém are made to an unpublished recipe a few hundred metres from where the custard tart was invented, and the queue moves faster than it looks because most people are buying boxes to take away. Eat them standing, warm, with cinnamon.",
      },
      {
        kind: "para",
        text: "Come back east for the afternoon in Chiado and Bairro Alto -- bookshops, tiled façades, and the Bica funicular, which climbs a street so steep it is a photograph in itself. The Time Out Market at Cais do Sodré is a reasonable dinner solution when a group cannot agree, though it is not where you will find the best meal in the city.",
      },

      {
        kind: "cta",
        link: "hotels",
        destination: "Portugal",
        label: "Find a Lisbon hotel",
        note: "Compare rates across Baixa, Chiado and Alfama.",
      },

      { kind: "h2", text: "If you can steal a third day" },
      {
        kind: "para",
        text: "Sintra is about forty minutes by train from Rossio station, and the palaces in the hills above it -- Pena, the Moorish castle, Quinta da Regaleira -- are the reason to go. It is emphatically a full day, not a morning, and the queues at Pena in summer are serious enough that pre-booked timed entry is the difference between seeing it and standing in a line.",
      },
      {
        kind: "para",
        text: "Cascais, on the coast from Cais do Sodré, is the lower-effort alternative: a short ride, a walkable seaside town, and a beach at the end of it.",
      },

      { kind: "h2", text: "Practical notes" },
      {
        kind: "list",
        items: [
          "Wear real shoes. The calçada portuguesa pavement is beautiful, worn smooth, and treacherous in light rain.",
          "Lunch runs late by northern European standards; dinner later still. Restaurants filling at 21:00 is normal, not a bad sign.",
          "The couvert -- bread, olives, cheese brought unasked to the table -- is charged for. Waving it away is completely normal and not rude.",
          "Use the funiculars. Bica, Glória and Lavra exist precisely because the hills defeated people long before you.",
        ],
      },
      {
        kind: "para",
        text: "Two days will not show you Lisbon. It will show you enough of it to know whether you want to come back for a week, which is the honest goal of a first visit.",
      },
    ],
    related: ["hotel-room-upgrade-tips", "best-time-to-book-a-flight", "packing-carry-on-only"],
  },

  // ────────────────────────────────────────────────────────────────
  "best-time-to-book-a-flight": {
    dek: "Most flight-booking folklore was true once, briefly, a decade ago. Here is what still holds.",
    published: "2026-09-04",
    blocks: [
      {
        kind: "para",
        text: "Airline pricing is set by revenue-management systems that adjust continuously against demand, competitor fares and how full a specific flight already is. That single fact kills most of the advice you have been given about when to book.",
      },

      { kind: "h2", text: "The myths worth dropping" },
      {
        kind: "para",
        text: "**Tuesday at 1am.** This descends from an era when airlines loaded fare sales manually at the start of the week and competitors matched them a day later. Pricing is now algorithmic and effectively continuous. There is no weekly reset to wait for.",
      },
      {
        kind: "para",
        text: "**Incognito mode gets you cheaper fares.** There is no credible evidence that airlines raise prices because you searched twice. What actually changes between two searches is seat inventory in a given fare bucket -- when the cheapest bucket sells out, the next price up is what you see. That happens whether or not you cleared your cookies.",
      },
      {
        kind: "para",
        text: "**Exactly 21 days out, or 54, or whatever number you read.** Studies that produce these figures are averages across millions of itineraries. The average is not your route. A single number cannot describe both a Tuesday domestic hop and Christmas week to Johannesburg.",
      },

      { kind: "h2", text: "What genuinely moves the price" },
      {
        kind: "list",
        items: [
          "Fare bucket depletion. Each flight is sold in tiers. Cheap seats are finite, and once they are gone the price steps up and does not come back down except in a sale.",
          "The day you fly, not the day you book. Midweek departures are usually cheaper than Friday and Sunday, because business and weekend demand is real.",
          "Route competition. A route with three carriers behaves completely differently to one with a single operator, regardless of how far ahead you book.",
          "Seasonality and events. School holidays, national holidays and major events override everything else on this list.",
          "Advance-purchase thresholds. Some fares genuinely do expire at fixed intervals before departure, which is the grain of truth the 21-day myth grew from.",
        ],
      },

      { kind: "h2", text: "So when should you book" },
      {
        kind: "para",
        text: "The honest answer is a range, not a date. Commonly cited guidance puts short-haul and domestic somewhere in the one-to-three-month band, and long-haul international wider, around two to six months. Peak season and holiday travel sit at the far end of both.",
      },
      {
        kind: "para",
        text: "Treat those as the window in which to start paying attention, not a moment to act. The useful behaviour is different from the useful date.",
      },
      {
        kind: "callout",
        title: "The one habit that beats every rule",
        text: "Set a price alert on your route as soon as you know you are going, then book when you see a fare that is clearly good rather than waiting for one that might be better. The regret asymmetry is real: fares rise more often than they fall as departure approaches.",
      },

      { kind: "h2", text: "Techniques that actually pay" },
      {
        kind: "list",
        items: [
          "Search a flexible-date grid rather than a single day. Shifting departure by 24 hours frequently moves the price more than booking a month earlier would.",
          "Check nearby airports at both ends, but price the ground transfer honestly before celebrating.",
          "Price one-ways separately as well as the return. On some routes and mixed carriers, two one-ways beat a round trip; on others they are far worse. It costs one extra search to find out.",
          "Read what basic economy excludes before comparing it to anything. A fare without a cabin bag, seat selection or any change rights is not the same product, and is not cheaper once you add back what you need.",
        ],
      },

      { kind: "h2", text: "The safety net most people never use" },
      {
        kind: "para",
        text: "For itineraries touching the United States, US Department of Transportation rules require airlines to allow cancellation with a full refund within 24 hours of booking, provided you booked at least seven days before departure. That gives you a free option: book the good fare now, then keep looking for a day without risk.",
      },
      {
        kind: "para",
        text: "Other jurisdictions have no equivalent blanket rule, though individual airlines sometimes offer a hold or a short grace period. Check before assuming it exists.",
      },

      {
        kind: "cta",
        link: "flights",
        label: "Search flights",
        note: "Compare fares across airlines and flexible dates.",
      },

      { kind: "h2", text: "The short version" },
      {
        kind: "para",
        text: "Stop hunting for the magic day. Set an alert early, stay flexible about which day you fly, compare the real total including bags, and accept a clearly good fare when it appears. That is genuinely most of it.",
      },
    ],
    related: ["packing-carry-on-only", "long-haul-flight-survival", "free-cancellation-fine-print"],
  },

  // ────────────────────────────────────────────────────────────────
  "esim-vs-roaming-cost": {
    dek: "The comparison is simpler than it looks -- one charges per day, the other per gigabyte.",
    published: "2026-09-04",
    blocks: [
      {
        kind: "para",
        text: "Almost every argument about travel data comes down to one structural difference. Carrier roaming passes usually charge a flat fee for each day you use them. Travel eSIMs sell you a fixed amount of data over a fixed window. One scales with the length of your trip; the other does not.",
      },
      {
        kind: "para",
        text: "That is the whole comparison. Everything else is detail.",
      },

      { kind: "h2", text: "Do the arithmetic yourself" },
      {
        kind: "para",
        text: "Find your carrier's daily roaming charge for your destination, multiply it by the number of days you will actually use data, and compare that to the price of an eSIM package with enough gigabytes. It takes two minutes and it is more reliable than any general claim, because roaming rates vary enormously between carriers and countries.",
      },
      {
        kind: "para",
        text: "The pattern that falls out is consistent: for a weekend, a daily pass is often fine and requires no setup. Across a fortnight, the daily fee compounds and an eSIM usually wins by a clear margin.",
      },
      {
        kind: "callout",
        title: "Check your plan before you buy anything",
        text: "Some plans already include roaming in certain regions at no extra charge. People buy eSIMs they did not need every day. Look first.",
      },

      { kind: "h2", text: "The thing nobody warns you about" },
      {
        kind: "para",
        text: "Most travel eSIMs are data-only. They give you no local phone number, which means no SMS. If your bank, airline or email sends two-factor codes by text, those arrive on your normal number -- and if you have disabled roaming to avoid charges, you will not receive them.",
      },
      {
        kind: "para",
        text: "The correct setup is to run both: your home SIM active for calls and SMS with data roaming switched off, and the eSIM carrying all data. Modern phones handle this natively. Configure it before you leave, while you can still test it.",
      },
      {
        kind: "callout",
        title: "Do this at home, not at the airport",
        text: "Activating an eSIM requires an internet connection. Install and activate on your home wifi before departure -- the QR code is far less useful when you have landed with no connectivity to scan it with.",
      },

      { kind: "h2", text: "Before you buy, confirm three things" },
      {
        kind: "list",
        items: [
          "Your phone supports eSIM. Most flagships from recent years do; budget models and older handsets frequently do not.",
          "Your phone is carrier-unlocked. A locked handset may refuse a third-party eSIM entirely.",
          "The plan covers every country you are visiting. A regional pass beats buying a separate plan at each border on a multi-stop trip, but only if the coverage map genuinely includes all of them -- check the list rather than assuming the region name covers it.",
        ],
      },

      { kind: "h2", text: "When a local physical SIM still wins" },
      {
        kind: "para",
        text: "If you are staying somewhere for weeks, need a local number for taxis, deliveries or a rental deposit, or want the cheapest possible per-gigabyte rate, a physical SIM bought locally usually beats both options. The trade is time at an airport kiosk or phone shop, sometimes passport registration, and a number that stops working the moment you leave.",
      },
      {
        kind: "para",
        text: "For a two-week trip across a few countries, that hassle is rarely worth it. For a month in one, it often is.",
      },

      {
        kind: "cta",
        link: "esim",
        label: "Compare travel eSIM plans",
        note: "Country and regional data packages, activated before you fly.",
      },

      { kind: "h2", text: "The short version" },
      {
        kind: "para",
        text: "Short trip, no setup appetite: daily roaming pass. Longer trip or several countries: eSIM, installed at home, running alongside your home SIM so your text messages still arrive. Staying put for a month: buy locally when you land.",
      },
    ],
    related: ["esim-multi-country-trip", "vietnam-esim-vs-sim", "packing-carry-on-only"],
  },

  // ────────────────────────────────────────────────────────────────
  "packing-carry-on-only": {
    dek: "Carry-on only is a packing method, not a smaller suitcase.",
    published: "2026-09-04",
    blocks: [
      { kind: "para", text: "Travelling carry-on only is usually framed as sacrifice -- taking less, doing without. It is better understood as a method. The people who do it well are not more disciplined than everyone else; they are packing to a different rule." },
      { kind: "para", text: "The rule is this: **pack a wardrobe, not a set of outfits.** Outfit-packing means one top per day and a decision already made for each. Wardrobe-packing means a small number of pieces that all work with each other, worn in different combinations. It is the single change that halves a bag." },

      { kind: "h2", text: "The arithmetic" },
      { kind: "para", text: "For a week or two, one person genuinely needs: five tops, two bottoms, one layer, one jacket appropriate to the weather, underwear and socks for about five days, and two pairs of shoes counting the ones on your feet." },
      { kind: "para", text: "That is it, and it works for two weeks as readily as one, because the variable is not the length of the trip -- it is whether you will wash anything. Beyond about five days, every trip becomes a laundry trip. Accepting that early is what unlocks the whole approach." },
      { kind: "callout", title: "The test that settles it", text: "Lay everything out and remove anything that goes with fewer than two other items. A single top that only works with one pair of trousers is not a top, it is a liability taking up space." },

      { kind: "h2", text: "Where the space actually goes" },
      { kind: "list", items: [
        "**Shoes.** They are the bulkiest thing you will pack by a wide margin. Two pairs total, and the heavier pair is worn on the plane, never packed.",
        "**Toiletries.** Nearly everything is available at the destination and most accommodation supplies the basics. Take what you cannot easily replace; buy the rest there.",
        "**The just-in-case layer.** The item packed for a scenario you cannot describe is the one to leave. If you genuinely need it, you can buy it.",
        "**Bulky outerwear.** A winter coat cannot go in a carry-on and should not try. Wear it.",
      ]},

      { kind: "h2", text: "Rolling, cubes, and what actually helps" },
      { kind: "para", text: "Rolling versus folding is argued about far more than it matters -- rolling wins slightly for soft items, folding for structured ones, and the difference is small either way." },
      { kind: "para", text: "Packing cubes are a real improvement, but not for the reason usually given. They do not create space. What they do is make the bag navigable, so you stop unpacking the whole thing to find one item and repacking badly afterwards. On a multi-stop trip that compounds." },

      { kind: "h2", text: "The airline rules that actually bite" },
      { kind: "para", text: "Size limits vary between carriers and are enforced inconsistently, but the two that catch people out are consistent enough to plan around." },
      { kind: "list", items: [
        "**Weight limits, not just dimensions.** Several carriers, particularly in Europe and Asia, weigh cabin bags. A bag that fits the sizer can still be refused.",
        "**One bag versus two.** Many basic fares now include only a small under-seat item, with the overhead bag charged separately. This is the most common unexpected cost at the gate, and it is always cheaper online than at the airport.",
      ]},
      { kind: "callout", title: "Check this before you book, not before you fly", text: "Read what the specific fare includes rather than what the airline generally allows. Two fares on the same flight often differ only in whether a cabin bag is included -- and once you add it, the cheaper fare frequently is not." },

      { kind: "cta", link: "flights", label: "Compare fares and baggage", note: "See what each fare actually includes before you book." },

      { kind: "h2", text: "What you gain" },
      { kind: "para", text: "Skipping baggage claim saves twenty to forty minutes at every airport. Your bag cannot be lost, because it never leaves you. Connections stop being anxious. And moving between cities becomes something you do casually rather than plan around." },
      { kind: "para", text: "That last one is the real prize. Carry-on travel does not just make the airport easier -- it changes which trips are worth taking." },
    ],
    related: ["long-haul-flight-survival", "best-time-to-book-a-flight", "esim-vs-roaming-cost"],
  },

  // ────────────────────────────────────────────────────────────────
  "long-haul-flight-survival": {
    dek: "Most long-haul advice is folklore. A few things genuinely work, and they mostly happen before you board.",
    published: "2026-09-04",
    blocks: [
      { kind: "para", text: "A long-haul flight is not an endurance event to be survived with tricks. It is a period of poor sleep, low humidity and immobility, and the things that help are the ones that address those three directly." },

      { kind: "h2", text: "Choose the seat before you choose anything else" },
      { kind: "para", text: "Seat choice affects a long flight more than anything else you control. The principles are simple and the exceptions are worth knowing." },
      { kind: "list", items: [
        "**Window if you intend to sleep** -- you get something to lean on and nobody climbs over you.",
        "**Aisle if you intend to stay awake**, work, or expect to move around; on a twelve-hour flight the ability to stand up without negotiating is worth a lot.",
        "**Forward of the wing** is marginally quieter than behind it, where the engine noise carries.",
        "**Avoid the last row and the row in front of an exit** -- both frequently have restricted or no recline.",
        "**Bulkhead** gives legroom but a fixed armrest and no under-seat storage, and is where bassinets go. Read that trade honestly before paying for it.",
      ]},

      { kind: "h2", text: "Sleep is a timing problem, not a comfort problem" },
      { kind: "para", text: "The most effective thing you can do about jet lag happens before departure: shift your sleep by an hour or two towards the destination's clock for the two nights before you fly. It is unglamorous and it works better than anything done on board." },
      { kind: "para", text: "Once flying, set your watch to the destination on takeoff and eat and sleep by that clock rather than the one you left. If it is night where you are going, sleep, even badly. If it is daytime, stay up, even when the cabin lights go down." },
      { kind: "callout", title: "The one thing not to do", text: "Alcohol is the most common and least effective sleep strategy on a plane. It shortens time to sleep and degrades its quality, and it compounds the dehydration the cabin is already causing. If you want a drink, have it -- just do not mistake it for a plan." },

      { kind: "h2", text: "Hydration, honestly" },
      { kind: "para", text: "Cabin air is genuinely very dry -- far drier than most indoor environments -- which is why you arrive with a headache and a dry throat. The fix is unremarkable: bring an empty bottle through security, fill it after, and drink from it steadily rather than waiting for the trolley." },
      { kind: "para", text: "Skin and eyes suffer too. If you wear contact lenses, a long flight is the trip to wear glasses instead." },

      { kind: "h2", text: "Move, and the reason why" },
      { kind: "para", text: "Immobility over many hours raises the risk of blood clots. This is the one genuinely medical item on the list, and the mitigation is simple: get up every couple of hours, and flex your calves regularly while seated. Anyone with a relevant history should ask a doctor about compression stockings rather than reading about them." },

      { kind: "cta", link: "flights", label: "Search long-haul fares", note: "Compare cabins and seat maps across carriers." },

      { kind: "h2", text: "Landing well" },
      { kind: "para", text: "Whatever time you arrive, get outside in daylight and stay awake until a reasonable local bedtime. Daylight is the strongest signal your body clock responds to, and a short walk on arrival does more for the next day than a nap ever will." },
      { kind: "para", text: "Give yourself one easy first day. Booking a demanding morning after a long-haul arrival is the most common way to lose two days instead of one." },
    ],
    related: ["packing-carry-on-only", "best-time-to-book-a-flight", "qatar-layover"],
  },

  // ────────────────────────────────────────────────────────────────
  "hotel-room-upgrade-tips": {
    dek: "Upgrades are inventory decisions, not rewards for charm.",
    published: "2026-09-04",
    blocks: [
      { kind: "para", text: "The popular theory is that upgrades go to people who ask nicely, mention an anniversary, or tip at check-in. Occasionally that is true. Far more often the decision was made before you arrived, by whether the hotel has rooms it would rather not leave empty." },
      { kind: "para", text: "Understanding that changes what you should actually do." },

      { kind: "h2", text: "What really drives the decision" },
      { kind: "list", items: [
        "**Occupancy.** A full hotel has nothing to give. A quiet midweek night has better rooms sitting unsold, and moving you costs nothing.",
        "**Loyalty status.** The single biggest lever, and the least romantic. Even the entry tier of a chain's programme is usually ahead of no status at all -- and it is free to join.",
        "**What you booked.** Upgrades move you up one category, rarely more. The cheapest room in the building is the furthest from the good ones.",
        "**Length of stay.** Multi-night guests are worth more and are moved more readily than a single overnight.",
      ]},

      { kind: "h2", text: "What to actually do" },
      { kind: "para", text: "Join the loyalty programme before you book, even for a single stay -- it is free, takes a minute, and is the one thing that reliably matters. Book direct where the price is the same, because third-party bookings are frequently excluded from upgrades entirely." },
      { kind: "para", text: "Then, at check-in, ask once, pleasantly and specifically. Not \"any chance of an upgrade?\" but \"if you have anything quieter or higher up available, I would appreciate it.\" A specific, easy request gets a better response than an open one." },
      { kind: "callout", title: "Timing beats charm", text: "Arriving mid-afternoon, after checkout but before the evening rush, is when the front desk knows what is empty and has time to look. At 9pm on a busy night the answer is no regardless of how you ask." },

      { kind: "h2", text: "The paid upgrade nobody mentions" },
      { kind: "para", text: "Many hotels will sell you an upgrade at check-in for far less than the price difference online, because an empty suite earns nothing. Asking what an upgrade would cost is a different question from asking for one free, and it is answered yes much more often." },
      { kind: "para", text: "It is worth asking even when you expect the answer to be expensive. The gap between the online rate and the at-desk rate for the same room is routinely large." },

      { kind: "cta", link: "hotels", label: "Compare hotels", note: "Rates across our booking partners -- book direct where it matters." },

      { kind: "h2", text: "What does not work" },
      { kind: "para", text: "Claiming a honeymoon or birthday that is not happening is transparent and remembered -- front desk staff hear it several times a day. Tipping at check-in for an upgrade is awkward in most countries and ineffective in nearly all of them. And complaining about a perfectly adequate room to force a move tends to produce a different perfectly adequate room." },
      { kind: "para", text: "Join the programme, book direct, arrive mid-afternoon, ask once and specifically. That is genuinely the whole method." },
    ],
    related: ["free-cancellation-fine-print", "boutique-vs-resort", "48-hours-in-lisbon"],
  },

  // ────────────────────────────────────────────────────────────────
  "free-cancellation-fine-print": {
    dek: "\"Free cancellation\" is a deadline, and it is not always the one you assume.",
    published: "2026-09-04",
    blocks: [
      { kind: "para", text: "Free cancellation is the reason most people book early. It is also one of the most misread terms in travel, because it describes a window rather than a permanent right -- and the window closes on the hotel's terms, not yours." },

      { kind: "h2", text: "The deadline runs on the hotel's clock" },
      { kind: "para", text: "A policy reading \"free cancellation until 6pm the day before arrival\" means 6pm in the hotel's own time zone. If you are booking from another continent, that can be the previous afternoon where you are." },
      { kind: "para", text: "This is the single most common way people miss the window, and it is entirely avoidable: when you book, work out the deadline in your own time zone and put a reminder in your calendar a day before it. Two minutes, and it removes the whole problem." },
      { kind: "callout", title: "Set the reminder at booking time", text: "Not the deadline itself -- a day earlier. A reminder that fires on the deadline gives you no time to make a decision or reach anyone." },

      { kind: "h2", text: "The rate types that quietly do not qualify" },
      { kind: "list", items: [
        "**Non-refundable or \"advance purchase\" rates.** Cheaper by design, and the discount is exactly the price of the flexibility you are giving up.",
        "**Promotional and flash rates.** Often carry their own stricter terms regardless of the property's standard policy.",
        "**Peak dates and events.** Many hotels apply longer cancellation windows -- sometimes weeks -- over major events and holidays.",
        "**Group bookings.** Several rooms on one reservation usually fall under different rules entirely.",
      ]},

      { kind: "h2", text: "Free to cancel is not free to not turn up" },
      { kind: "para", text: "Cancelling within the window costs nothing. Simply not arriving is a no-show, and a no-show is normally charged at least the first night regardless of how flexible the rate was. They are different things and the policy treats them differently." },
      { kind: "para", text: "If plans change, cancel explicitly -- and keep the confirmation. A cancellation you cannot evidence is, in practice, a no-show." },

      { kind: "h2", text: "The strategy this enables" },
      { kind: "para", text: "Used deliberately, a flexible rate is a free option. Book a refundable room as soon as your dates firm up, which secures a price and availability, then keep an eye out. If something better appears before the deadline, move; if not, you have lost nothing." },
      { kind: "para", text: "That works only if you know the deadline. Without it, the flexible rate is just a more expensive room." },

      { kind: "cta", link: "hotels", label: "Find flexible rates", note: "Compare refundable and non-refundable options side by side." },

      { kind: "h2", text: "Before you book, check three things" },
      { kind: "list", items: [
        "The exact deadline, converted to your own time zone.",
        "Whether the deposit is taken at booking or at the property.",
        "Whether cancelling is done through the site you booked on or the hotel directly -- for third-party bookings it is almost always the former, and the hotel often cannot help you.",
      ]},
    ],
    related: ["hotel-room-upgrade-tips", "boutique-vs-resort", "best-time-to-book-a-flight"],
  },

  // ────────────────────────────────────────────────────────────────
  "rental-car-damage-waiver": {
    dek: "The counter upsell is sometimes a rip-off and sometimes the cheapest insurance you will ever buy. The difference is knowable in advance.",
    published: "2026-09-04",
    blocks: [
      { kind: "para", text: "The damage waiver conversation at a rental counter is deliberately uncomfortable. You are tired, there is a queue behind you, and the price quoted is often a significant fraction of the rental itself. It is also the moment you are least equipped to make the decision." },
      { kind: "para", text: "So make it beforehand. It takes about ten minutes and turns a pressured upsell into a yes or no you already know the answer to." },

      { kind: "h2", text: "What a waiver actually is" },
      { kind: "para", text: "A collision damage waiver is not insurance in the strict sense. It is the rental company agreeing not to pursue you for damage to their vehicle. That distinction matters, because it explains the gaps." },
      { kind: "para", text: "Most basic rentals include a waiver with a large excess -- the amount you remain liable for. The counter upsell is usually selling you a reduction of that excess to zero, which is why it is expensive." },

      { kind: "h2", text: "What the standard waiver typically excludes" },
      { kind: "list", items: [
        "**Tyres, windscreen and glass** -- among the most common damage, and frequently outside the waiver entirely.",
        "**Undercarriage and roof** -- the two areas you cannot easily inspect, and the two most often excluded.",
        "**Wrong fuel, lost keys, lockouts** -- all normally on you.",
        "**Driving off sealed roads** -- often voids cover completely. This matters enormously in places like Namibia or Iceland where unsealed roads are the trip.",
      ]},
      { kind: "callout", title: "The exclusions are where the money is", text: "A zero-excess upgrade that still excludes tyres, glass and undercarriage is not the complete protection it sounds like. Ask specifically what remains excluded, and decide against that answer rather than the headline." },

      { kind: "h2", text: "Where your card cover falls short" },
      { kind: "para", text: "Many premium credit cards include rental cover, and it is often genuinely good. It is also where most of the confident bad advice lives. Before relying on it, confirm four things with your card issuer -- not with the rental desk, who have no reason to know." },
      { kind: "list", items: [
        "It covers the **country** you are renting in. Exclusions are common, and Ireland and Italy are frequently among them.",
        "It covers the **vehicle class**. Large vans, luxury and specialist vehicles are routinely excluded.",
        "It covers the **rental length**. Cover often stops after a set number of consecutive days.",
        "Whether it is **primary or secondary**. Secondary cover pays only what your own motor insurance does not -- which for many travellers means claiming on their own policy first.",
      ]},
      { kind: "para", text: "And one procedural trap: card cover almost always requires you to **decline the rental company's waiver** and pay with that card. Accepting the counter product can void it entirely." },

      { kind: "h2", text: "Third-party excess policies" },
      { kind: "para", text: "Standalone excess insurance, bought online in advance, is usually a fraction of the counter price for comparable cover. The trade-off is process: you pay the rental company for damage and claim it back afterwards, rather than walking away. If you would rather not front the money, that is a real cost worth weighing." },

      { kind: "cta", link: "cars", label: "Compare car rentals", note: "Rates and included cover across our rental partners." },

      { kind: "h2", text: "At the counter" },
      { kind: "para", text: "Photograph the car before you drive it -- all four sides, the roof, the wheels and the windscreen, with the timestamp on. Do the same when you return it. This is five minutes that has settled more disputes than any policy wording." },
      { kind: "para", text: "Then decide from what you already checked, not from the queue behind you." },
    ],
    related: ["one-way-rental-fees", "driving-on-the-other-side", "southwest-road-trip"],
  },

  // ────────────────────────────────────────────────────────────────
  "esim-multi-country-trip": {
    dek: "Regional plans beat buying data at every border -- if the coverage map genuinely includes your route.",
    published: "2026-09-04",
    blocks: [
      { kind: "para", text: "On a single-country trip, choosing a travel eSIM is straightforward. Across five countries in three weeks it becomes a planning question, and the wrong answer means buying data at every border or discovering you have none in the one place you needed it." },

      { kind: "h2", text: "Regional beats per-country, usually" },
      { kind: "para", text: "Most eSIM providers sell regional plans -- Europe, Southeast Asia, Latin America -- covering a list of countries on one allowance. For a multi-stop trip these are almost always better value than separate country plans, and far better than arriving in each new place and starting again." },
      { kind: "para", text: "The catch is that regional names are marketing, not geography. A \"Europe\" plan may exclude Switzerland, Türkiye or the UK. An \"Asia\" plan may cover ten countries and not the two you are visiting." },
      { kind: "callout", title: "Read the list, not the region", text: "Open the coverage list and check off your actual itinerary country by country before buying. This is the single mistake that turns a well-planned data setup into roaming charges." },

      { kind: "h2", text: "Sizing the allowance" },
      { kind: "para", text: "Data needs on the road are dominated by maps, messaging and the occasional booking -- all modest. What actually consumes an allowance is video, whether you meant to watch it or an app auto-played it." },
      { kind: "list", items: [
        "Turn **autoplay off** in social apps before you leave. This alone often halves consumption.",
        "Download **offline maps** for each city while on wifi.",
        "Download entertainment for the flights at home, not in the airport.",
        "Set your phone to warn you at a data threshold, so you find out before you run out.",
      ]},
      { kind: "para", text: "Unlimited-sounding plans frequently throttle after a set amount. That is fine for maps and messaging and poor for anything else, so check what the speed drops to rather than trusting the word." },

      { kind: "h2", text: "One plan or several?" },
      { kind: "para", text: "Modern phones hold multiple eSIM profiles but only run one or two at a time. That makes a single regional plan far less fiddly than swapping profiles at each border -- fewer things to activate while tired in an unfamiliar airport." },
      { kind: "para", text: "If your route genuinely spans two regions -- Europe then Southeast Asia -- buy two regional plans and install both before departure. Installing needs connectivity, and the moment you need a new plan is precisely the moment you have none." },
      { kind: "callout", title: "Install everything at home", text: "Every profile you will use on the trip should be installed and verified on your home wifi. Activate each one when you arrive; installation is the part that requires internet." },

      { kind: "h2", text: "Keep your own number alive" },
      { kind: "para", text: "Travel eSIMs are generally data-only, so they give you no phone number and no SMS. Bank and airline two-factor codes still go to your normal number -- and if you have disabled it to avoid roaming charges, they arrive nowhere." },
      { kind: "para", text: "Run both: home SIM active for calls and texts with data roaming switched off, eSIM carrying all data. Set it up before you leave, while you can still test that a code actually arrives." },

      { kind: "cta", link: "esim", label: "Compare regional eSIM plans", note: "Multi-country coverage, activated before you fly." },

      { kind: "h2", text: "The short version" },
      { kind: "para", text: "Check the coverage list against your real itinerary. Buy regional rather than per-country. Install everything at home. Keep your own number on for SMS. That covers essentially every way this goes wrong." },
    ],
    related: ["esim-vs-roaming-cost", "vietnam-esim-vs-sim", "packing-carry-on-only"],
  },

  // ────────────────────────────────────────────────────────────────
  "switzerland-by-train": {
    dek: "The rental car is the default and, in Switzerland, usually the wrong call.",
    published: "2026-09-04",
    blocks: [
      { kind: "para", text: "Most countries punish you for not driving. Switzerland is the rare one that rewards it -- the rail network reaches valleys, passes and villages that would be a long day's drive, and the scenery is arranged so that the journey is a large part of what you came for." },
      { kind: "para", text: "The decision is not really about cost. It is that a car makes you the driver, and in a country where the view is the point, being the driver means being the one person who cannot look at it." },

      { kind: "h2", text: "What the network actually does" },
      { kind: "para", text: "Trains, buses, boats and most mountain cable cars operate as one integrated system with coordinated timetables. Connections are built to work: a bus that meets a train is scheduled to meet that train, and if the train is late the bus generally waits." },
      { kind: "para", text: "Practically, that means you can plan a day at the level of \"be in Lauterbrunnen by eleven\" rather than researching each leg. Trains run frequently enough that a missed connection costs you thirty minutes, not the afternoon." },
      { kind: "callout", title: "Reservations are the exception, not the rule", text: "Ordinary intercity trains need no seat reservation -- turn up and board. The scenic panoramic routes are the exception and do require one, often weeks ahead in summer. Do not assume either way; check the specific train." },

      { kind: "h2", text: "Passes versus point-to-point" },
      { kind: "para", text: "Switzerland sells several travel passes, and which one wins depends entirely on how much you will actually move." },
      { kind: "list", items: [
        "**Moving most days, across regions** -- a consecutive-day pass usually wins, and it covers boats and many city trams too.",
        "**Two or three big journeys with static days between** -- individual tickets are often cheaper, especially booked in advance where saver fares exist.",
        "**Lots of mountain excursions** -- check each summit railway separately. Many are only discounted by a pass, not included, and they are among the most expensive tickets in the country.",
      ]},
      { kind: "para", text: "The honest advice is to sketch your actual route first and price both. The pass is excellent value for some itineraries and poor value for others, and no general rule survives contact with a specific trip." },

      { kind: "h2", text: "The routes worth building a trip around" },
      { kind: "list", items: [
        "**Interlaken to Lauterbrunnen and Grindelwald** -- the classic valley access into the Jungfrau region, and short enough to do as a day trip from a lake base.",
        "**The Bernina line, Chur to Tirano** -- crosses into Italy over a glacier pass. A UNESCO-listed railway and, in winter, one of the most striking journeys in Europe.",
        "**Montreux up into the Alps** -- vineyards on the lake, mountains within the hour, and a good pairing with a French-speaking base.",
        "**Lucerne to Interlaken** -- lakes and passes on an ordinary scheduled service, no premium ticket needed.",
      ]},
      { kind: "callout", title: "Skip the premium panoramic trains if you are counting cost", text: "The famous named routes run along tracks used by ordinary scheduled trains. You see the same scenery from a normal carriage, with a window that opens, at a fraction of the fare and no reservation." },

      { kind: "h2", text: "Luggage, which is the real argument for the train" },
      { kind: "para", text: "Swiss stations are built around movement -- lifts, ramps, luggage racks, and left-luggage almost everywhere. You can leave bags at a station for the day and go up a mountain unencumbered, which is not something a car boot in a valley car park offers." },
      { kind: "para", text: "There is also a baggage-forwarding service between stations, which is genuinely useful on a multi-base trip: send the bags ahead and travel with a day pack." },

      { kind: "cta", link: "flights", label: "Find flights to Switzerland", note: "Zurich and Geneva both connect straight onto the rail network." },

      { kind: "h2", text: "When a car still wins" },
      { kind: "para", text: "If you are travelling with small children and a lot of equipment, staying somewhere genuinely remote, or moving between several places in a single day on your own schedule, a car earns its keep. For nearly every other Swiss itinerary, the train is faster to plan, cheaper to park, and considerably better to look out of." },
    ],
    related: ["boutique-vs-resort", "best-time-to-book-a-flight", "packing-carry-on-only"],
  },

  // ────────────────────────────────────────────────────────────────
  "qatar-layover": {
    dek: "A long connection in Doha is either dead time or a free extra city. The difference is about an hour of planning.",
    published: "2026-09-04",
    blocks: [
      { kind: "para", text: "Doha sits on one of the busiest east-west corridors in aviation, which means a great many people pass through it and a great many treat the layover as something to be endured." },
      { kind: "para", text: "It does not have to be. Hamad International is unusually good at being an airport, and the city is close enough that a long connection can become a genuine half-day out." },

      { kind: "h2", text: "The number that decides everything" },
      { kind: "para", text: "Work out your **actual free time**, not your layover length. Take the gap between flights, then subtract immigration on the way in, the transfer each way, and being back at the airport comfortably before your onward departure." },
      { kind: "list", items: [
        "**Under about five hours** -- stay airside. There is not enough slack to enjoy leaving, and the anxiety costs more than the outing gains.",
        "**Five to eight hours** -- one thing in the city, chosen in advance, then straight back.",
        "**Eight hours or more** -- a proper half-day, and worth considering a hotel room for a few hours of real sleep.",
      ]},
      { kind: "callout", title: "Check the visa before you plan anything", text: "Entry rules vary by nationality and change. Confirm what applies to your passport before building an itinerary around leaving the airport -- and check whether your airline offers a transit visa or stopover programme, which several do." },

      { kind: "h2", text: "If you stay airside" },
      { kind: "para", text: "Hamad is one of the few airports where staying in is not a consolation prize. There are quiet rest areas, a water feature and gardens, showers, and lounges that can be bought into without a business-class ticket." },
      { kind: "para", text: "For a long overnight connection, a paid lounge or an in-terminal hotel room is frequently the best money on the whole trip -- arriving at your destination having actually slept changes the first day completely." },

      { kind: "h2", text: "If you go into the city" },
      { kind: "para", text: "The transfer is short, and the sensible plan is one area rather than a list. Two work well." },
      { kind: "list", items: [
        "**Souq Waqif** -- the restored market quarter. Walkable, atmospheric in the evening, and the easiest single stop if you only have a few hours.",
        "**The Corniche and the Museum of Islamic Art** -- the waterfront promenade with the skyline opposite, and a genuinely first-rate museum at one end.",
      ]},
      { kind: "para", text: "Both are close to each other, so pairing them is realistic on an eight-hour connection and rushed on a five-hour one." },
      { kind: "callout", title: "Plan around the heat, not the clock", text: "From roughly May to September, the middle of the day outdoors is punishing. A summer layover is better spent on the museum and the souq's shaded lanes in the evening than on the Corniche at noon." },

      { kind: "cta", link: "airport", label: "Book airport transfers", note: "Pre-arranged pickup, so the clock is not spent negotiating a taxi." },

      { kind: "h2", text: "The practical bits" },
      { kind: "list", items: [
        "**Bags.** If your luggage is checked through, you have nothing to collect. If not, use left luggage rather than dragging it into town.",
        "**Money.** Cards work nearly everywhere, so there is no need to change cash for a half-day.",
        "**Transfers.** Pre-book, or use a metered taxi rather than an approach at arrivals. A pre-arranged pickup removes the one bit of a layover that reliably eats time.",
        "**Return buffer.** Be back at the terminal three hours before an international departure. On a layover the temptation is to shave that; do not.",
      ]},
    ],
    related: ["long-haul-flight-survival", "packing-carry-on-only", "esim-multi-country-trip"],
  },

  // ────────────────────────────────────────────────────────────────
  "sri-lanka-two-weeks": {
    dek: "A compact loop with no backtracking -- hill country, coast and wildlife in the right order.",
    published: "2026-09-04",
    blocks: [
      { kind: "para", text: "Sri Lanka is small, which is the single most useful thing to know about planning it. The distances look trivial on a map and the journey times do not match them, but the whole country still fits into two weeks without a domestic flight." },
      { kind: "para", text: "The mistake most itineraries make is treating it as a list of places rather than a loop. Done as a loop, nothing is repeated." },

      { kind: "h2", text: "The route" },
      { kind: "list", items: [
        "**Days 1-2, Negombo or straight out.** The airport is north of Colombo, and Colombo itself is not the reason you came. Rest one night near the coast and move on.",
        "**Days 3-4, Sigiriya and Dambulla.** The rock fortress and the cave temples, plus the option of Polonnaruwa's ruins by bicycle.",
        "**Days 5-7, Kandy then the hill country.** The temple and the lake, then the train up to Ella through the tea estates.",
        "**Days 8-9, Ella and Horton Plains.** Walking country, waterfalls, and cool nights that are a genuine relief.",
        "**Days 10-11, Yala or Udawalawe.** Wildlife, on the way down to the coast rather than as a detour.",
        "**Days 12-14, the south coast.** Mirissa, Unawatuna or Tangalle to finish, with Galle Fort for a day.",
      ]},
      { kind: "para", text: "That order matters. It runs a clockwise circle from the airport, arrives at the beach at the end when you want it, and never doubles back." },

      { kind: "h2", text: "The train, honestly" },
      { kind: "para", text: "The Kandy-to-Ella line is genuinely one of the great rail journeys, and it is also slow, crowded and frequently full. The famous open-door photographs are real and so are the four hours standing if you did not reserve." },
      { kind: "callout", title: "Book reserved seats well ahead", text: "Reserved tickets for this route are released in advance and sell out. Book as early as you can; unreserved carriages are standing-room on the popular stretch, and the section between Nanu Oya and Ella is the part worth sitting down for." },

      { kind: "h2", text: "Wildlife: pick one park, not three" },
      { kind: "para", text: "Yala has the highest leopard density and the highest vehicle density to match. Udawalawe is the better bet for elephants and is markedly calmer. Wilpattu is quieter again and harder to reach." },
      { kind: "para", text: "One park done well beats two done in a rush, and an early-morning drive beats an afternoon one comfortably." },

      { kind: "h2", text: "Timing, which is genuinely complicated here" },
      { kind: "para", text: "Sri Lanka has two monsoons hitting opposite coasts at opposite times, which is why blanket advice about the best month is useless." },
      { kind: "list", items: [
        "**December to March** suits the south and west coasts and the hill country -- the standard window for the loop above.",
        "**May to September** suits the east coast, and the south is wetter.",
        "**The hill country is cool year-round** and can be wet in any season; take a layer regardless of when you go.",
      ]},

      { kind: "cta", link: "tours", destination: "Sri Lanka", label: "Compare Sri Lanka tours", note: "Guided loops and wildlife trips from our booking partners." },

      { kind: "h2", text: "Getting around" },
      { kind: "para", text: "A car with a driver is the standard way to do this loop and is far more affordable than the equivalent would be in Europe. It is also the practical answer to the roads, which are busy and unhurried in a way that makes self-driving a poor use of a holiday." },
      { kind: "para", text: "Mix it with the train for the Kandy-to-Ella leg specifically. Have the driver meet you at the other end; that is the standard arrangement and every driver will know it." },
    ],
    related: ["kenya-safari-basics", "vietnam-esim-vs-sim", "packing-carry-on-only"],
  },

  // ────────────────────────────────────────────────────────────────
  "southwest-road-trip": {
    dek: "The parks are the easy part. The distances between them are what the itinerary has to respect.",
    published: "2026-09-04",
    blocks: [
      { kind: "para", text: "The American Southwest is one of the few places where a road trip is genuinely the only sensible way to travel. The parks are far apart, public transport barely connects them, and the driving between is a significant part of what makes it worth doing." },
      { kind: "para", text: "The mistake is underestimating the distances. They are long, the roads are fast and empty, and an itinerary that looks reasonable on a map is often six hours a day behind the wheel." },

      { kind: "h2", text: "A route that works in ten days" },
      { kind: "list", items: [
        "**Las Vegas** -- the usual start, purely for the flights and the rental rates.",
        "**Zion** -- the first stop, and the one where the shuttle system replaces your car inside the canyon.",
        "**Bryce Canyon** -- a couple of hours on, and higher, colder and completely different in character.",
        "**Capitol Reef or Escalante** -- the quiet middle of the loop, and where you stop seeing tour buses.",
        "**Moab, for Arches and Canyonlands** -- two parks from one base, which is the efficiency this route needs.",
        "**Monument Valley** -- on Navajo Nation land, not a national park, with its own rules and access.",
        "**Grand Canyon South Rim** -- last, because after Bryce and Arches it still has scale to spare.",
      ]},
      { kind: "callout", title: "Two nights minimum per base", text: "One-night stops mean packing every morning and arriving each afternoon with no time to walk anywhere. Fewer bases with two nights each covers less ground and sees far more." },

      { kind: "h2", text: "The park pass maths" },
      { kind: "para", text: "Each national park charges per vehicle for entry, valid for several days. The annual America the Beautiful pass covers entry to all federal parks for a year, and on a route like the one above it typically pays for itself after roughly three parks." },
      { kind: "para", text: "Buy it at the first park entrance rather than in advance. Note that it does not cover Monument Valley, which is tribal land with a separate fee." },

      { kind: "h2", text: "Heat, water and the thing people get wrong" },
      { kind: "para", text: "Summer temperatures in the desert parks are genuinely dangerous, not merely uncomfortable. Rangers close trails and rescue people every season, and most of those people did not think of themselves as taking a risk." },
      { kind: "list", items: [
        "**Hike early.** Be off exposed trails by late morning in summer. Afternoons are for driving with the air conditioning on.",
        "**Carry more water than seems reasonable**, and drink it steadily rather than at the top.",
        "**Fuel up at half a tank.** Stretches between stations are long and some close early.",
        "**Do not rely on mobile signal.** Coverage is patchy to absent across much of the route -- download offline maps before you leave.",
      ]},
      { kind: "callout", title: "Book accommodation early or plan to stay outside", text: "In-park lodges open reservations many months ahead and fill quickly. Gateway towns -- Springdale, Moab, Tusayan -- are the fallback, and they fill too in peak season." },

      { kind: "cta", link: "cars", label: "Compare rental cars", note: "Pick-up in Las Vegas or Phoenix, with one-way options." },

      { kind: "h2", text: "The car itself" },
      { kind: "para", text: "A standard car handles this entire route. Four-wheel drive is needed only for specific unpaved roads, and those are usually excluded from rental agreements anyway -- check before assuming a higher category buys you access." },
      { kind: "para", text: "What does matter is air conditioning that works, boot space for water, and a one-way drop-off if you want to finish somewhere other than where you started." },
    ],
    related: ["one-way-rental-fees", "rental-car-damage-waiver", "driving-on-the-other-side"],
  },

  // ────────────────────────────────────────────────────────────────
  "new-zealand-south-island": {
    dek: "Two weeks, one loop, and considerably fewer stops than you are planning.",
    published: "2026-09-04",
    blocks: [
      { kind: "para", text: "The South Island is roughly the size of England with a fraction of the population, and its roads are winding, single-carriageway and slow in the way that mountain roads are. Every first itinerary tries to fit too much in." },
      { kind: "para", text: "The compensation is that almost nowhere is dull. Cutting the list does not cost you much, because the drives between what remains are themselves worth the trip." },

      { kind: "h2", text: "The loop" },
      { kind: "list", items: [
        "**Christchurch** -- the usual arrival, and a fine place to pick up the car and leave the next morning.",
        "**Lake Tekapo and Aoraki / Mount Cook** -- turquoise lakes and the country's highest peak. Dark-sky reserve, so stay the night rather than passing through.",
        "**Wanaka** -- quieter than Queenstown and better as a base if you want walking rather than nightlife.",
        "**Queenstown** -- the adventure hub, and the launch point for Milford.",
        "**Milford Sound** -- a very long day from Queenstown, or a short one from Te Anau. Stay in Te Anau if you can.",
        "**The West Coast and the glaciers** -- Franz Josef and Fox, then north through rainforest that meets the sea.",
        "**Back east over Arthur's Pass** -- the closing leg, and among the best drives on the island.",
      ]},
      { kind: "callout", title: "Milford deserves the overnight", text: "From Queenstown it is roughly four hours each way plus the cruise -- a twelve-hour day, much of it in a coach or car. From Te Anau it is about two. Moving your base for one night converts an endurance day into a good one." },

      { kind: "h2", text: "Driving, which catches people out" },
      { kind: "para", text: "New Zealand drives on the left, and a large share of visitors do not. Combine that with narrow roads, frequent one-lane bridges and long single-carriageway stretches, and the driving needs more attention than the scenery invites." },
      { kind: "list", items: [
        "**One-lane bridges are common.** A sign shows which direction has priority; the smaller arrow gives way.",
        "**Journey times are longer than the distance suggests.** Assume you will average well below the speed limit on mountain roads.",
        "**Fuel is sparse on the West Coast.** Fill up when you can, not when you need to.",
        "**Pull over for the view.** Most of the fatal-crash campaigns there target distracted tourist drivers, which is not a coincidence.",
      ]},

      { kind: "h2", text: "Seasons" },
      { kind: "para", text: "Summer, December to February, gives the longest days and the best weather, and is also when everything is booked out and priced accordingly. Autumn, March and April, is the quiet recommendation -- stable weather, colour in Central Otago, and far fewer people." },
      { kind: "para", text: "Winter turns it into a ski trip and closes some alpine routes. Spring is beautiful and unreliable in equal measure." },

      { kind: "cta", link: "cars", label: "Compare campervans and cars", note: "One-way options between Christchurch and Queenstown." },

      { kind: "h2", text: "Campervan or car plus accommodation?" },
      { kind: "para", text: "A campervan is the romantic choice and works well if you genuinely want to be self-contained and stop where you like. It is slower, thirstier and needs certified campsites -- freedom camping rules are enforced and fines are real." },
      { kind: "para", text: "A car plus booked accommodation is faster, cheaper to run, and far better in bad weather. For a two-week first visit doing the loop above, it is usually the better trip." },
    ],
    related: ["driving-on-the-other-side", "one-way-rental-fees", "rental-car-damage-waiver"],
  },

  // ────────────────────────────────────────────────────────────────
  "vietnam-esim-vs-sim": {
    dek: "Vietnam is one of the few places where the local SIM genuinely competes with an eSIM.",
    published: "2026-09-04",
    blocks: [
      { kind: "para", text: "In most countries the travel eSIM wins on convenience and loses slightly on price, and the gap is small enough that convenience decides it. Vietnam is an exception worth understanding, because local data is cheap enough that the maths changes." },

      { kind: "h2", text: "Why Vietnam is different" },
      { kind: "para", text: "Local prepaid data in Vietnam is inexpensive by international standards, with generous allowances and good coverage from the major networks. A local SIM bought on arrival often costs a fraction of an equivalent travel eSIM." },
      { kind: "para", text: "It also gives you a Vietnamese phone number, which matters more here than in many places: ride-hailing apps, delivery and some accommodation confirmations expect to reach you by local number or messaging tied to one." },

      { kind: "h2", text: "The trade you are actually making" },
      { kind: "list", items: [
        "**Local SIM** -- cheapest, gives a local number, but means a kiosk queue on arrival, passport registration, and swapping your physical SIM out.",
        "**Travel eSIM** -- costs more, no queue, working before you land, and your home number stays active for bank codes. No local number.",
      ]},
      { kind: "callout", title: "The registration requirement is real", text: "Vietnamese SIMs must be registered to a passport. Buy from an official carrier counter or shop rather than an unregistered street vendor -- unregistered SIMs get cut off, usually a few days in, which is exactly when you have stopped carrying the receipt." },

      { kind: "h2", text: "Which to choose" },
      { kind: "para", text: "**Trip under about a week, or you value landing connected:** take the eSIM. Install it at home, arrive working, and skip the airport queue entirely. The premium over a local SIM is small in absolute terms on a short trip." },
      { kind: "para", text: "**Two weeks or more, especially a north-to-south route:** the local SIM starts to win clearly, and the local number becomes genuinely useful for the apps you will end up relying on." },
      { kind: "para", text: "**Best of both, if you can:** an eSIM for the first day so you land connected and can reach your accommodation, then a local SIM once you are settled and unhurried. That costs slightly more and removes every failure mode." },

      { kind: "h2", text: "Coverage on a north-to-south route" },
      { kind: "para", text: "Coverage in the cities and along the main corridor -- Hanoi, Hue, Da Nang, Hoi An, Ho Chi Minh City -- is good on all the major networks. It thins in the far north around Ha Giang and Sapa, and in parts of the central highlands." },
      { kind: "para", text: "If the mountain north is a major part of your trip, ask which network performs best there rather than assuming; it is the one part of the country where the answer differs meaningfully." },

      { kind: "cta", link: "esim", destination: "Vietnam", label: "Compare Vietnam eSIM plans", note: "Installed and activated before you fly." },

      { kind: "h2", text: "Whichever you pick" },
      { kind: "para", text: "Keep your home SIM active for SMS. Bank and airline two-factor codes go to your normal number, and a local SIM in the tray means your own number is out of the phone unless it is an eSIM. This is the single most common way a cheap data decision becomes an expensive afternoon." },
    ],
    related: ["esim-vs-roaming-cost", "esim-multi-country-trip", "sri-lanka-two-weeks"],
  },

  // ────────────────────────────────────────────────────────────────
  "boutique-vs-resort": {
    dek: "The real question is not star rating -- it is whether you want to leave the property.",
    published: "2026-09-04",
    blocks: [
      { kind: "para", text: "Boutique hotels and full resorts are usually compared on price and star rating, which explains almost nothing. Two properties at the same price and rating can produce completely different holidays." },
      { kind: "para", text: "The useful question is simpler: **do you intend to spend your days on the property, or out in the place you flew to?** Nearly everything else follows from that." },

      { kind: "h2", text: "What a resort is actually selling" },
      { kind: "para", text: "A resort sells the removal of decisions. Food, pool, beach, activities and childcare are on site, priced in or charged to the room, and you never have to work out where to eat or how to get there." },
      { kind: "para", text: "That is genuinely valuable in some situations and wasted in others. It is worth most when you are tired, travelling with young children, somewhere with limited options nearby, or when the point of the trip is rest rather than discovery." },
      { kind: "para", text: "It is worth least in a city, or anywhere the surrounding area is the reason you came -- where you are paying for facilities you will barely use." },

      { kind: "h2", text: "What a boutique hotel is selling" },
      { kind: "para", text: "A boutique property sells location and character. Fewer rooms, more distinctive design, staff who recognise you by the second day, and -- crucially -- a position that puts you inside the neighbourhood rather than in a compound outside it." },
      { kind: "para", text: "The trade is facilities. Often no pool worth the name, one restaurant or none, limited service hours, and no answer at all to a rainy afternoon with children." },

      { kind: "h2", text: "The honest decision table" },
      { kind: "list", items: [
        "**City break** -- boutique, nearly always. A resort in a city is a compound you will leave every morning anyway.",
        "**Beach holiday where rest is the point** -- resort. This is exactly what it is built for.",
        "**Beach destination you want to explore** -- boutique or a small hotel, with the resort's pool traded for being able to walk somewhere.",
        "**Young children** -- resort, and it is not close. Childcare, food at any hour and a pool you can see from a lounger are worth the compromise.",
        "**Two weeks in one country** -- split it. A boutique base for the exploring half, a resort for the last few days when you are tired.",
      ]},
      { kind: "callout", title: "All-inclusive changes the maths again", text: "All-inclusive is worth it where food and drink outside are expensive or scarce, and poor value where the destination has excellent affordable eating. Working out the daily food cost outside the gate is the whole calculation -- and in most food-led destinations it favours leaving." },

      { kind: "h2", text: "The thing to check either way" },
      { kind: "para", text: "For a resort, check how far it actually is from anything. Isolation is a feature until the third day, and \"twenty minutes from town\" often means twenty minutes by taxi, each way, at resort taxi prices." },
      { kind: "para", text: "For a boutique hotel, check what is on the street. A characterful place above a bar is a different proposition on a Saturday night than the photographs suggest." },

      { kind: "cta", link: "hotels", label: "Compare hotels and resorts", note: "Filter by location and facilities across our booking partners." },

      { kind: "h2", text: "The short version" },
      { kind: "para", text: "Pick the resort when you want the property to be the holiday. Pick the boutique when you want the place to be the holiday. Where a trip is genuinely both, split it -- and put the resort at the end, when doing nothing has been earned." },
    ],
    related: ["hotel-room-upgrade-tips", "free-cancellation-fine-print", "48-hours-in-lisbon"],
  },

  // ────────────────────────────────────────────────────────────────
  "driving-on-the-other-side": {
    dek: "It is not the driving that catches people out. It is the junctions, the mirrors and the first ten minutes.",
    published: "2026-09-04",
    blocks: [
      { kind: "para", text: "Driving on the opposite side is easier than most people fear and goes wrong in more specific ways than they expect. On an open road it takes minutes to adapt, because the road itself tells you where to be." },
      { kind: "para", text: "The failures cluster in three places: the first few minutes out of the rental car park, junctions where you have to choose a side, and any moment you are tired or distracted and revert to instinct." },

      { kind: "h2", text: "The first ten minutes matter most" },
      { kind: "para", text: "You will be jet-lagged, in an unfamiliar car, in a car park designed to funnel you straight onto a road. That is the worst possible combination and it is exactly when most incidents happen." },
      { kind: "list", items: [
        "**Sit still before you move.** Find the indicators, wipers, lights and handbrake while parked. The indicator and wiper stalks are often reversed, and discovering that at a junction means signalling with your windscreen.",
        "**Adjust the mirrors deliberately.** Your sense of where the car ends has just swapped sides.",
        "**Drive one easy lap** of the car park before joining traffic.",
        "**Do not programme the satnav while moving.** Set it before you start.",
      ]},
      { kind: "callout", title: "The one rule that prevents most of it", text: "Keep the driver in the middle of the road. Whichever country you are in, your body should be nearer the centre line than the kerb. It is a single check that works everywhere and catches the error before it becomes one." },

      { kind: "h2", text: "Junctions are where it actually goes wrong" },
      { kind: "para", text: "On a straight road with traffic around you, you will not drift onto the wrong side -- the other cars make it obvious. The danger is turning onto an empty road, where there is nothing to correct you." },
      { kind: "para", text: "Empty rural junctions, exits from petrol stations and car parks, and early-morning starts are the classic circumstances. Say the direction out loud as you turn if it helps; plenty of experienced drivers do." },

      { kind: "h2", text: "Roundabouts" },
      { kind: "para", text: "Roundabouts run the opposite way round, which means you give way in the opposite direction and your instinct to look the wrong way is strongest exactly when you are entering one." },
      { kind: "para", text: "Look both ways, take the time, and accept being slow. Being hesitant on a roundabout is mildly irritating for the driver behind and much safer than being confident in the wrong direction." },

      { kind: "h2", text: "Positioning and the gutter" },
      { kind: "para", text: "The most common minor damage on a swapped-side rental is kerbing the near-side wheels, because your judgement of where that edge of the car sits is calibrated to the other side. On narrow roads you will feel closer to the edge than you are." },
      { kind: "para", text: "This is also where an automatic earns its money: on the other side, the gearstick is on your other hand, and one fewer new thing to think about is worth the small extra rental cost." },

      { kind: "cta", link: "cars", label: "Compare rental cars", note: "Automatics and one-way options across our rental partners." },

      { kind: "h2", text: "Before you go" },
      { kind: "list", items: [
        "Check whether an **International Driving Permit** is required -- it is in some countries and must be obtained before travel.",
        "Read up on the **local rules that differ**: priority conventions, right-turn-on-red, speed units, and whether headlights are required in daylight.",
        "Consider **picking the car up outside the airport or city centre**. A quiet suburban pickup is a far kinder first drive than a motorway exit.",
      ]},
    ],
    related: ["one-way-rental-fees", "rental-car-damage-waiver", "new-zealand-south-island"],
  },

  // ────────────────────────────────────────────────────────────────
  "one-way-rental-fees": {
    dek: "The drop-off fee looks outrageous until you price what returning the car actually costs you.",
    published: "2026-09-04",
    blocks: [
      { kind: "para", text: "One-way rentals carry a surcharge, sometimes a startling one, and the instinct is to redesign the trip around avoiding it. Occasionally that is right. More often it is a false economy, because the loop you drive to get back is not free either." },

      { kind: "h2", text: "What the fee is actually for" },
      { kind: "para", text: "The car has to get home. Rental companies rebalance fleets constantly, and a one-way drop leaves a vehicle where they may not want it, so the fee reflects the cost of moving it back -- or the value of not having to." },
      { kind: "para", text: "That explains why the amount varies so wildly. It is not a fixed penalty; it is a logistics price, and it moves with direction, season and how badly they need cars at each end." },
      { kind: "list", items: [
        "**Popular one-way corridors are cheap or free** -- routes where demand runs both ways, or where the company needs cars moved in your direction anyway.",
        "**Against the flow is expensive** -- dropping a car somewhere they already have too many.",
        "**Cross-border is expensive or forbidden** -- and often voids insurance if undeclared. Always declare it.",
        "**Same-company, different city, same country** is usually the cheapest form of one-way.",
      ]},

      { kind: "h2", text: "The comparison people skip" },
      { kind: "para", text: "The fee is not being compared to zero. It is being compared to driving back, and that has real costs which rarely get counted." },
      { kind: "list", items: [
        "**A day, sometimes two, of your holiday** -- almost always the largest cost and the one nobody prices.",
        "**Fuel for the return leg**, which on a long route is substantial.",
        "**Extra rental days** to cover the driving back.",
        "**An extra night's accommodation** if the return does not fit in one day.",
      ]},
      { kind: "callout", title: "Price the loop honestly", text: "Add the extra rental days, the fuel and any extra night, then ask what the lost day is worth to you. On a two-week trip a large drop-off fee frequently comes out cheaper than backtracking -- and always more pleasant." },

      { kind: "h2", text: "When to avoid it anyway" },
      { kind: "para", text: "Sometimes the loop is genuinely no loss. If your route naturally returns near where it started -- the Southwest circuit ending back at Las Vegas, or a Scottish loop from Edinburgh -- there is nothing to gain from a one-way." },
      { kind: "para", text: "The other case is short trips. Over three or four days, a day of backtracking is a much larger share of the holiday, but so is the fee relative to a short rental. Price both; neither is obviously right." },

      { kind: "h2", text: "How to reduce it" },
      { kind: "list", items: [
        "**Compare companies specifically on the one-way fee.** It varies enormously between them on the identical route, and the cheapest daily rate is often not the cheapest total.",
        "**Try both directions.** A route that is expensive one way is sometimes free the other, which occasionally makes it worth reversing the itinerary.",
        "**Check nearby branches.** Dropping at a city office rather than its airport, or the other way round, can change the fee materially.",
        "**Look for relocation deals.** Companies occasionally offer heavily discounted one-ways when they need a car moved -- most common with campervans.",
      ]},

      { kind: "cta", link: "cars", label: "Compare one-way rentals", note: "Different pick-up and drop-off points, priced across partners." },

      { kind: "h2", text: "The rule of thumb" },
      { kind: "para", text: "On a trip of a week or more covering real distance, take the one-way and keep the day. On a short trip that naturally loops, drive back. The fee is only expensive if you compare it to nothing." },
    ],
    related: ["southwest-road-trip", "rental-car-damage-waiver", "driving-on-the-other-side"],
  },

  // ────────────────────────────────────────────────────────────────
  "ebike-vs-regular-bike-rental": {
    dek: "The honest test is the hills, the distance, and how much of the day you want left over.",
    published: "2026-09-04",
    blocks: [
      { kind: "para", text: "E-bike rental costs meaningfully more than a standard bike, and whether that is money well spent has almost nothing to do with fitness. It has to do with the route and what you want to be doing at the end of it." },

      { kind: "h2", text: "The three questions that decide it" },
      { kind: "list", items: [
        "**Is it hilly?** Flat cities -- Amsterdam, Copenhagen, Bordeaux -- give an e-bike almost nothing to do. Anywhere built on hills changes the answer immediately.",
        "**How far?** Under about 15 km a day, a normal bike is fine for most people. Past 25 or 30, the assistance stops being a luxury.",
        "**What happens afterwards?** If the ride is the day, arriving tired is fine. If you are cycling to a vineyard, a museum or dinner, arriving fresh is the entire point.",
      ]},
      { kind: "callout", title: "The real argument for an e-bike", text: "It is not about avoiding effort -- it is about range. An e-bike puts places within a day's reach that would otherwise need a car, which on a rural trip can replace a rental entirely." },

      { kind: "h2", text: "Where an e-bike clearly wins" },
      { kind: "para", text: "Hilly wine regions, coastal routes with headlands, anywhere you want to cover 40 km and still be good company at dinner, and riding with a group of mixed fitness -- where the assistance keeps everyone together instead of stringing the group out." },
      { kind: "para", text: "It is also the honest answer for heat. In a hot climate, the difference between a hill under your own power at midday and the same hill with assistance is not comfort, it is whether you finish." },

      { kind: "h2", text: "Where a standard bike wins" },
      { kind: "para", text: "Flat cities, short distances, and any trip where you will lock the bike up repeatedly. A standard bike is lighter, cheaper, and far less anxiety to leave outside a cafe -- e-bikes are a theft target and often carry an excess you are liable for." },
      { kind: "para", text: "It is also simply more pleasant on a flat canal path. There is nothing to be gained from a motor on a route with no resistance." },

      { kind: "h2", text: "The practical things people find out late" },
      { kind: "list", items: [
        "**Range is a claim, not a promise.** Stated range assumes low assistance, flat ground and a light rider. Hills and high assist cut it sharply -- plan for well under the number on the listing.",
        "**Weight matters when the battery dies.** An e-bike without charge is a heavy bike, and lifting one onto a train or up steps is a genuine job.",
        "**Check the charger and the plan.** On a multi-day hire, know where you are charging each night.",
        "**Confirm the excess.** E-bikes are expensive, and the damage or theft liability is usually much higher than for a standard bike.",
      ]},

      { kind: "cta", link: "bikes", label: "Compare bike rentals", note: "Standard and electric, by city and by day." },

      { kind: "h2", text: "The short version" },
      { kind: "para", text: "Flat and short: standard bike, and enjoy the simplicity. Hilly, long, hot, or with something to do at the other end: take the e-bike and treat the extra cost as buying back range and the rest of your day." },
    ],
    related: ["cycling-city-rules-abroad", "switzerland-by-train", "48-hours-in-lisbon"],
  },

  // ────────────────────────────────────────────────────────────────
  "cycling-city-rules-abroad": {
    dek: "The rules matter less than the conventions -- and the conventions are what locals expect you to know.",
    published: "2026-09-04",
    blocks: [
      { kind: "para", text: "Cycling in an unfamiliar city is rarely difficult because of the traffic law. It is difficult because every cycling city has a set of unwritten conventions that everyone follows and nobody explains, and breaking them marks you out instantly -- occasionally dangerously." },

      { kind: "h2", text: "Lanes are traffic lanes, not shared space" },
      { kind: "para", text: "In cities with serious cycling infrastructure -- Amsterdam, Copenhagen, Utrecht -- the bike lane is a road. It has its own flow, speed and etiquette, and it is used by people commuting, not sightseeing." },
      { kind: "list", items: [
        "**Do not stop in the lane.** Pull fully out first. Stopping to check a map mid-lane is the single most resented thing a visitor does.",
        "**Keep right, overtake left**, exactly as with cars.",
        "**Signal with your arm** before turning or pulling out. It is expected, not optional.",
        "**Do not walk in it.** Bike lanes and pavements are separate, and pedestrians in the lane are treated as an obstruction.",
      ]},
      { kind: "callout", title: "Assume you are the slowest thing there", text: "Local cyclists move faster than visitors expect, and they will overtake close. Hold a straight line, do not swerve for photographs, and check behind before any change of position." },

      { kind: "h2", text: "The rules that genuinely differ" },
      { kind: "para", text: "Beyond convention, some actual laws vary in ways worth checking before you ride." },
      { kind: "list", items: [
        "**Helmets.** Mandatory in some countries, unusual in others. Where it is mandatory, it is enforced.",
        "**Lights.** Required after dark essentially everywhere, and a common thing to be fined for. Confirm the rental has working ones before you leave.",
        "**Right turn on red.** Permitted for cyclists in some cities, with a specific sign, and illegal without it.",
        "**Pavements.** Illegal to cycle on in most European cities, tolerated in some places, and never in busy centres.",
        "**Alcohol limits apply to cyclists** in many countries, sometimes with the same threshold as driving.",
      ]},

      { kind: "h2", text: "Locking, which is where trips go wrong" },
      { kind: "para", text: "Bike theft is high in exactly the cities with the best cycling, because that is where the bikes are. Rental agreements normally make you liable, often for the full replacement value." },
      { kind: "list", items: [
        "**Use both locks** if you are given two, and lock the frame to something fixed -- not just the wheel, and not just to itself.",
        "**Photograph the bike locked up.** It settles disputes.",
        "**Ask where not to leave it overnight.** The rental shop knows the streets to avoid and will tell you.",
      ]},

      { kind: "h2", text: "Junctions and trams" },
      { kind: "para", text: "Two specific hazards catch visitors more than anything else. Tram rails will take a wheel if you cross them at a shallow angle -- cross closer to a right angle, always. And in cities with dedicated cycle signals, the bike light is not the car light; watch for the smaller signal, which often changes at a different time." },

      { kind: "cta", link: "bikes", label: "Find bike rentals", note: "City hire by the day, with lights and locks included." },

      { kind: "h2", text: "The short version" },
      { kind: "para", text: "Ride predictably, signal, never stop in the lane, lock the frame to something solid, and spend five minutes checking the local rules on helmets and lights. That covers nearly everything that goes wrong." },
    ],
    related: ["ebike-vs-regular-bike-rental", "48-hours-in-lisbon", "packing-carry-on-only"],
  },
};

export function getArticle(slug: string): Article | undefined {
  return ARTICLES[slug];
}

export function hasArticle(slug: string): boolean {
  return slug in ARTICLES;
}

/** Slugs that have a written article -- used by the sitemap so we never
 * advertise a URL that would 404. */
export const ARTICLE_SLUGS = Object.keys(ARTICLES);
