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
