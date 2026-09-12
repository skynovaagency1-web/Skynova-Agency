import { useRouter } from "@tanstack/react-router";

import { DEFAULT_LOCALE, type Locale } from "./i18n";

/**
 * Interface strings.
 *
 * Only chrome lives here -- navigation, buttons, form labels, the words that
 * wrap the content. Page copy stays where it is written (data/, landing-content
 * .ts, the route files), because that is prose to be translated as prose, not
 * as a lookup table of fragments.
 *
 * English is the source of truth and defines the keys. Every other locale is a
 * Partial of it, so a missing translation falls back to English rather than
 * rendering a key or an empty element -- which means a language can ship
 * surface by surface instead of all at once.
 */
export const EN = {
  "nav.explore": "Explore",
  "nav.destinations": "Destinations",
  "nav.collections": "Collections",
  "nav.blog": "Blog",
  "nav.company": "Company",
  "nav.about": "About us",
  "nav.reviews": "Reviews",
  "nav.contact": "Contact",
  "nav.byRegion": "By region",
  "nav.allCollections": "All collections",
  "nav.allDestinations": "All destinations",
  "nav.startTrip": "Start your trip",
  "nav.home": "Home",
  "nav.openMenu": "Open menu",
  "nav.closeMenu": "Close menu",
  "nav.accountAria": "Account: {email}",
  "nav.yourAccount": "Your account",
  "nav.signOut": "Sign out",
  "nav.signedIn": "Signed in",
  "nav.logInOrSignUp": "Log in or sign up",
  "nav.logInSignUp": "Log in / Sign up",
  "nav.yourSkynovaAccount": "Your Skynova account",
  "nav.logInPrompt": "Log in to plan your next trip.",
  "nav.saveDestinations": "Save destinations and share trips with friends.",
  "nav.wishlist": "Wish list",
  "nav.share": "Share Skynova with friends",
  "nav.gift": "Gift",

  "service.flights": "Flights",
  "service.hotels": "Hotels",
  "service.carRentals": "Car rentals",
  "service.airportServices": "Airport services",
  "service.events": "Events & tickets",
  "service.esim": "SIM & eSIM",
  "service.tours": "Tours & activities",
  "service.bikeRentals": "Bike rentals",

  "footer.tagline":
    "One search that reaches real airlines, real hotels, and real partners -- no markup, no middleman, no juggling six tabs.",
  "footer.book": "Book",
  "footer.company": "Company",
  "footer.contactUs": "Contact us",
  "footer.destinations": "Destinations",
  "footer.allDestinations": "All {count} destinations",
  "footer.affiliate":
    "Skynova Agency runs on the Travelpayouts affiliate network -- booking links may earn a commission at no extra cost to you.",
  "footer.privacy": "Privacy Policy",
  "footer.terms": "Terms of Use",
  "footer.followAlong": "Follow along",

  "consent.aria": "Cookie choice",
  "consent.copy":
    "We\u2019d like to use Google Analytics to see which pages are actually useful \u2014 only if you say yes. Cloudflare\u2019s traffic counter runs either way and never sets a cookie.",
  "consent.readDetails": "Read the details",
  "consent.decline": "Decline",
  "consent.accept": "Accept",

  "auth.close": "Close",
  "auth.signIn": "Sign in",
  "auth.signUp": "Sign up",
  "auth.welcomeBack": "Welcome back.",
  "auth.saveTrips": "Save trips and destinations.",
  "auth.email": "Email",
  "auth.password": "Password",
  "auth.forgotPassword": "Forgot password?",
  "auth.createAccount": "Create account",
  "auth.pleaseWait": "Please wait...",
  "auth.genericError": "Something went wrong. Try again.",
  "auth.resetTitle": "Reset your password.",
  "auth.resetIntro":
    "Enter the email on your account and we\u2019ll send you a link to choose a new password.",
  "auth.resetSent":
    "If that email has a Skynova account, a link to choose a new password is on its way. It works once and expires in an hour.",
  "auth.sendRequest": "Send request",
  "auth.backToSignIn": "Back to sign in",
  "auth.fineprintBefore": "By creating an account you agree to our ",
  "auth.fineprintAnd": " and ",
  "auth.withAccount": "With an account",
  "auth.goodToKnow": "Good to know",
  "auth.saveDestinations": "Save destinations",
  "auth.giftTrip": "Send a trip as a gift",
  "auth.earnReferrals": "Earn on referrals",
  "auth.freeToJoin": "Free to join",
  "auth.noCard": "No card needed",
  "auth.neverResell": "We never resell your email",

  "search.eyebrow": "Plan it here",
  "search.heading": "Where are you going?",
  "search.tablistAria": "What to search",
  "search.destination": "Destination",
  "search.placeholder": "Portugal, Japan, Kenya\u2026",
  "search.checkIn": "Check in",
  "search.checkOut": "Check out",
  "search.go": "Search {what}",
  "search.modeHotels": "Hotels",
  "search.modeFlights": "Flights",
  "search.modeCars": "Car rental",
  "search.modeTours": "Tours",
  "search.modeEsim": "eSIM",
  "search.noteResults": "Opens {partner} results for {place}.",
  "search.notePartner": "Opens {partner}. Add a destination to land straight on results.",
  "search.noteNoPrefill":
    "Opens {partner}\u2019 own search \u2014 they need airport and pickup codes, so we don\u2019t guess them for you.",
  "search.guideLink": "Read the {name} guide first",

  "lang.label": "Language",

  "news.eyebrow": "Skynova Travel Club",
  "news.heading": "Join the Skynova Travel Club",
  "news.copy":
    "Destination inspiration, hotel deals, travel guides, flight offers and curated experiences -- straight to your inbox.",
  "news.thanks": "You're on the list -- look out for our next dispatch.",
  "news.placeholder": "Your email address",
  "news.emailAria": "Email address",
  "news.joining": "Joining...",
  "news.subscribe": "Subscribe",
  "news.error": "That didn\u2019t go through. Check the address and try again.",
  "news.privacy": "No spam. Unsubscribe anytime.",

  "home.introHeading": "Book the whole trip, not six tabs.",
  "home.introCopy":
    "Search flights, hotels, cars, airport transfers, SIM cards and tours from one dashboard, then check out with our travel partners.",
  "home.introAlt": "Atmospheric night sky plate",
  "home.flightsHeading": "Real fares, compared in one search.",
  "home.flightsCopy":
    "Compare airlines on Aviasales-powered search and lock in a fare before prices move.",
  "home.compareFlights": "Compare flights",
  "home.viewAllFlights": "View all flights",
  "home.flightsAlt": "Window seat view from a jet cabin at golden hour",
  "home.hotelsHeading": "Stays that fit the trip.",
  "home.hotelsCopy":
    "From boutique stays to full resorts, filtered by neighborhood first and star rating second.",
  "home.browseStays": "Browse stays",
  "home.viewAllHotels": "View all hotels",
  "home.hotelsAlt": "Infinity pool overlooking the coastline at a luxury hotel",
  "home.carsHeading": "Wheels, wherever you land.",
  "home.carsCopy":
    "Economy to executive SUVs, picked up at arrivals and dropped off anywhere on the route.",
  "home.reserveCar": "Reserve a car",
  "home.viewAllCars": "View all cars",
  "home.carsAlt": "Luxury car parked along a coastal road",
  "home.airportAlt": "Airport lounge seating with departure boards",
  "home.airportHeading": "Skip the queues.",
  "home.airportCopy":
    "Private transfers, shared shuttles, lounge access and baggage help, booked before you land.",
  "home.addAirportHelp": "Add airport help",
  "home.viewAllAirport": "View all airport services",
  "home.eventsHeading": "Tickets to the good stuff.",
  "home.eventsCopy":
    "Concerts, museums, attractions and skip-the-line passes in the cities you are already visiting.",
  "home.eventsAlt": "Event ticket stub resting on a dark surface",
  "home.sameDay": "Same day",
  "home.eventsTickets": "Mobile tickets land in your inbox the moment you book.",
  "home.findEvents": "Find events",
  "home.viewAll": "View all",
  "home.connectivity": "Connectivity",
  "home.esimHeading": "Stay connected on arrival.",
  "home.esimCopy":
    "Instant eSIM activation before you land, or a physical SIM waiting at the airport counter.",
  "home.viewAllEsim": "View all eSIM plans",
  "home.esimAlt": "Smartphone displaying an eSIM QR code",
  "home.planLocal": "Local data plans",
  "home.planLocalDetail": "One country, ready on arrival.",
  "home.planRegional": "Regional passes",
  "home.planRegionalDetail": "Cross borders without swapping SIMs.",
  "home.planUnlimited": "Unlimited talk & data",
  "home.planUnlimitedDetail": "For longer stays and remote work.",
  "home.getConnected": "Get connected",
  "home.toursHeading": "Go see it, not just land there.",
  "home.toursCopy":
    "Skip-the-line tours, day trips and local guides, bookable the moment you land.",
  "home.exploreTours": "Explore tours",
  "home.toursAlt1": "Brass compass resting on a map",
  "home.toursAlt2": "Aerial view of a coastline landmark",
  "home.howHeading": "How Skynova works.",
  "home.one": "One",
  "home.two": "Two",
  "home.three": "Three",
  "home.step1Title": "Search once",
  "home.step1Detail": "One search bar, every vertical, live results from our partner networks.",
  "home.step2Title": "Compare honestly",
  "home.step2Detail":
    "Skynova adds no markup and sells no placement -- you see the partner's own results.",
  "home.step3Title": "Book everything",
  "home.step3Detail": "Check out with each partner directly; your booking sits with them, not us.",
  "home.trustLine": "Booking runs through our travel-network partners",
  "home.why1Title": "One search, every vertical",
  "home.why1Detail": "Flights through tours, compared side by side.",
  "home.why2Title": "Partner pricing, not markup",
  "home.why2Detail": "You check out directly with the airline, hotel or operator.",
  "home.why3Title": "Built for the whole trip",
  "home.why3Detail": "From the first flight search to the last day tour.",
  "home.finalHeading": "Start your trip.",
  "home.finalCopy": "Pick a vertical above, or browse by destination.",
  "home.trustVerticals": "travel verticals",
  "home.trustDestinations": "destinations",
  "home.trustPartner": "booked through one trusted partner network",
  "home.whySkynova": "Why Skynova",
  "home.advHeading": "Built to book the whole trip, properly.",
  "home.adv1Title": "Direct partner access",
  "home.adv1Detail":
    "Every search routes straight to vetted flight, hotel, car and tour partners -- no reseller markup in between.",
  "home.adv2Detail":
    "Flights, stays, cars, airport help, eSIM and tours, compared in a single flow instead of six open tabs.",
  "home.adv3Title": "Transparent, partner pricing",
  "home.adv3Detail":
    "The price shown at checkout is the partner's own -- Skynova earns a commission, you don't pay extra for it.",
  "home.adv4Title": "Built around your route",
  "home.adv4Detail":
    "Destination guides and bundled add-ons matched to where you're actually going, not generic upsells.",
  "home.specVerticals": "Verticals in one flow",
  "home.specDestinations": "Destinations routed",
  "home.specMarkup": "Markup added by Skynova",
  "home.specSupport": "Support response window",
  "home.howBookingWorks": "How a booking works",
  "home.insideHeading": "Inside every Skynova booking.",
  "home.insideCopy":
    "No inventory of our own, no hidden fees -- just a routing layer between you and the travel partners who actually fulfill the trip.",
  "home.step3AltTitle": "Book with the partner",
  "home.step3AltDetail": "Checkout happens on the partner's own site, at their price.",
  "home.step4Title": "Fly, stay, go",
  "home.step4Detail": "Your booking sits with them; we're just the front door.",
  "home.beyondBooking": "Beyond the booking",
  "home.benefitsHeading": "The parts people forget to plan.",
  "home.ben1Title": "Connected from touchdown",
  "home.ben1Detail": "eSIM activation before you land, or a physical SIM waiting at the counter.",
  "home.ben2Title": "Skip the queues",
  "home.ben2Detail": "Private transfers, lounge access and baggage help, arranged before you land.",
  "home.ben3Title": "Local, guided, or solo",
  "home.ben3Detail": "Skip-the-line tours and day trips, bookable the moment you land.",
  "home.ben4Title": "Support, whenever you need it",
  "home.ben4Detail": "A route to a real person if a booking needs a human touch.",
  "home.countriesServed": "Countries served",
  "home.travelVerticals": "Travel verticals",
  "home.bookingOpen": "Booking open",
  "home.yourLocalTime": "Your local time",
  "home.flyAnywhere": "Fly anywhere",
  "home.flyHeading": "{count} destinations, one booking flow.",
  "home.flyCopy":
    "Every city below routes straight into flights, stays, cars and tours for that country.",
  "home.viewAllDestinationsCount": "View all {count} destinations",
  "home.closingHeading": "Destinations routed through one search, not six tabs.",
  "home.closingCopy":
    "Flights, stays, cars, airport help, eSIM and tours -- start with a destination or a vertical, we'll route the rest.",
  "home.talkToUs": "Talk to us",

  "contact.heading": "Talk to Skynova Agency.",
  "contact.intro":
    "We usually reply within one working day. If your question is about a booking you have already made, the partner who took the payment can help fastest -- your confirmation email came from them.",
  "contact.received": "Message received",
  "contact.thanksNamed": "Thanks {name} -- we have your message and will reply to ",
  "contact.thanksAnon": "Thanks for getting in touch -- we have your message and will reply to ",
  "contact.nothingElse":
    "Nothing else is needed from you. If it is urgent and about an existing booking, contact the partner directly in the meantime.",
  "contact.yourName": "Your name",
  "contact.namePlaceholder": "Jamie Rivera",
  "contact.emailPlaceholder": "you@example.com",
  "contact.about": "What is it about?",
  "contact.message": "Message",
  "contact.messagePlaceholder": "Tell us what you need.",
  "contact.sending": "Sending\u2026",
  "contact.send": "Send message",
  "contact.error": "Something went wrong. Please try again.",
  "contact.alreadyBooked": "Already booked?",
  "contact.alreadyBookedCopy":
    "Skynova does not hold your booking -- the partner does, and they took the payment. For changes, cancellations or refunds, contact them directly. Their details are on your confirmation email.",
  "contact.commonQuestions": "Common questions",
  "contact.commonCopy":
    "Most questions about how booking works, pricing and cancellations are answered already.",
  "contact.readFaq": "Read the FAQ",
  "contact.partnerships": "Partnerships",
  "contact.partnershipsCopy":
    "Travel brands and affiliate networks -- choose \u201cPartnership\u201d above and we will route it to the right place.",

  "about.eyebrow": "About Skynova Agency",
  "about.heading": "One place for the whole trip.",
  "about.intro":
    "Most trips get planned across six or seven open tabs -- one for flights, another for the hotel, another for the rental car, another for tickets. Skynova Agency puts all of it behind one search, one route in, one place to come back to before you go.",
  "about.howItWorks": "How it works",
  "about.howCopy":
    "Skynova Agency does not hold inventory itself. Every flight, room, car, ticket, eSIM and tour booked through the site is fulfilled by an established travel partner -- we route each search to the right one and get out of the way at checkout.",
  "about.howPaid": "How we're paid",
  "about.paidCopy":
    "We run on the Travelpayouts affiliate network. When a booking completes with one of our partners, we earn a commission at no extra cost to the traveler -- the price shown at checkout is the partner's own price.",
  "about.whereToday": "Where we are today",
  "about.statGuides": "destination guides",
  "about.statRegions": "regions covered",
  "about.statCollections": "themed collections",
  "about.statArticles": "written articles",
  "about.whatNot": "What we do not do",
  "about.whatNotCopy":
    "We do not take your payment, hold your booking, or set the price. That all happens with the partner. If something needs changing after you book, they are the ones who can do it -- which is why their details are on your confirmation, not ours.",
  "about.whyGuides": "Why the guides exist",
  "about.whyGuidesCopy":
    "Every destination here has a written guide rather than a stock paragraph, because the useful part of planning a trip is knowing what a place actually costs, when to go, and what the guidebook leaves out.",
  "about.whatsCovered": "What\u2019s covered",
} as const;

export type TKey = keyof typeof EN;

/** A locale's strings. Partial: what is missing falls back to English. */
type Dict = Partial<Record<TKey, string>>;

/** French. Drafted here so the plumbing has something real to render; it wants
 *  a native read before /fr is ever linked to. */
const FR: Dict = {
  "nav.explore": "Explorer",
  "nav.destinations": "Destinations",
  "nav.collections": "Collections",
  "nav.blog": "Blog",
  "nav.company": "L'agence",
  "nav.about": "À propos",
  "nav.reviews": "Avis",
  "nav.contact": "Contact",
  "nav.byRegion": "Par région",
  "nav.allCollections": "Toutes les collections",
  "nav.allDestinations": "Toutes les destinations",
  "nav.startTrip": "Commencez votre voyage",
  "nav.home": "Accueil",
  "nav.openMenu": "Ouvrir le menu",
  "nav.closeMenu": "Fermer le menu",
  "nav.accountAria": "Compte : {email}",
  "nav.yourAccount": "Votre compte",
  "nav.signOut": "Se déconnecter",
  "nav.signedIn": "Connecté",
  "nav.logInOrSignUp": "Se connecter ou s'inscrire",
  "nav.logInSignUp": "Connexion / Inscription",
  "nav.yourSkynovaAccount": "Votre compte Skynova",
  "nav.logInPrompt": "Connectez-vous pour préparer votre prochain voyage.",
  "nav.saveDestinations": "Enregistrez des destinations et partagez vos voyages avec vos amis.",
  "nav.wishlist": "Liste de souhaits",
  "nav.share": "Partagez Skynova avec vos amis",
  "nav.gift": "Cadeau",

  "service.flights": "Vols",
  "service.hotels": "Hôtels",
  "service.carRentals": "Location de voitures",
  "service.airportServices": "Services aéroport",
  "service.events": "Événements et billets",
  "service.esim": "SIM et eSIM",
  "service.tours": "Excursions et activités",
  "service.bikeRentals": "Location de vélos",

  "footer.tagline":
    "Une seule recherche qui interroge de vraies compagnies aériennes, de vrais hôtels et de vrais partenaires -- sans majoration, sans intermédiaire, sans jongler entre six onglets.",
  "footer.book": "Réserver",
  "footer.company": "L'agence",
  "footer.contactUs": "Nous contacter",
  "footer.destinations": "Destinations",
  "footer.allDestinations": "Les {count} destinations",
  "footer.affiliate":
    "Skynova Agency fonctionne avec le réseau d'affiliation Travelpayouts -- les liens de réservation peuvent générer une commission, sans coût supplémentaire pour vous.",
  "footer.privacy": "Politique de confidentialité",
  "footer.terms": "Conditions d'utilisation",
  "footer.followAlong": "Nous suivre",

  "consent.aria": "Choix des cookies",
  "consent.copy":
    "Nous aimerions utiliser Google Analytics pour savoir quelles pages sont vraiment utiles \u2014 uniquement si vous l\u2019acceptez. Le compteur de trafic de Cloudflare fonctionne dans tous les cas et ne d\u00e9pose aucun cookie.",
  "consent.readDetails": "Lire le d\u00e9tail",
  "consent.decline": "Refuser",
  "consent.accept": "Accepter",

  "auth.close": "Fermer",
  "auth.signIn": "Se connecter",
  "auth.signUp": "S\u2019inscrire",
  "auth.welcomeBack": "Bon retour.",
  "auth.saveTrips": "Enregistrez vos voyages et vos destinations.",
  "auth.email": "E-mail",
  "auth.password": "Mot de passe",
  "auth.forgotPassword": "Mot de passe oubli\u00e9 ?",
  "auth.createAccount": "Cr\u00e9er un compte",
  "auth.pleaseWait": "Veuillez patienter...",
  "auth.genericError": "Un probl\u00e8me est survenu. R\u00e9essayez.",
  "auth.resetTitle": "R\u00e9initialisez votre mot de passe.",
  "auth.resetIntro":
    "Indiquez l\u2019adresse e-mail de votre compte et nous vous enverrons un lien pour choisir un nouveau mot de passe.",
  "auth.resetSent":
    "Si un compte Skynova existe pour cette adresse, un lien pour choisir un nouveau mot de passe est en route. Il fonctionne une seule fois et expire dans une heure.",
  "auth.sendRequest": "Envoyer la demande",
  "auth.backToSignIn": "Retour \u00e0 la connexion",
  "auth.fineprintBefore": "En cr\u00e9ant un compte, vous acceptez nos ",
  "auth.fineprintAnd": " et notre ",
  "auth.withAccount": "Avec un compte",
  "auth.goodToKnow": "Bon \u00e0 savoir",
  "auth.saveDestinations": "Enregistrer des destinations",
  "auth.giftTrip": "Offrir un voyage",
  "auth.earnReferrals": "Gagnez avec le parrainage",
  "auth.freeToJoin": "Inscription gratuite",
  "auth.noCard": "Sans carte bancaire",
  "auth.neverResell": "Nous ne revendons jamais votre e-mail",

  "search.eyebrow": "Planifiez ici",
  "search.heading": "O\u00f9 allez-vous ?",
  "search.tablistAria": "Que rechercher",
  "search.destination": "Destination",
  "search.placeholder": "Portugal, Japon, Kenya\u2026",
  "search.checkIn": "Arriv\u00e9e",
  "search.checkOut": "D\u00e9part",
  "search.go": "Rechercher {what}",
  "search.modeHotels": "H\u00f4tels",
  "search.modeFlights": "Vols",
  "search.modeCars": "Location de voiture",
  "search.modeTours": "Excursions",
  "search.modeEsim": "eSIM",
  "search.noteResults": "Ouvre les r\u00e9sultats {partner} pour {place}.",
  "search.notePartner": "Ouvre {partner}. Ajoutez une destination pour arriver directement sur les r\u00e9sultats.",
  "search.noteNoPrefill":
    "Ouvre la recherche de {partner} \u2014 il leur faut des codes d\u2019a\u00e9roport et de prise en charge, que nous ne devinons pas \u00e0 votre place.",
  "search.guideLink": "Lisez d\u2019abord le guide {name}",

  "lang.label": "Langue",

  "news.eyebrow": "Skynova Travel Club",
  "news.heading": "Rejoignez le Skynova Travel Club",
  "news.copy":
    "Inspiration voyage, offres d\u2019h\u00f4tels, guides pratiques, promotions de vols et exp\u00e9riences s\u00e9lectionn\u00e9es -- directement dans votre bo\u00eete mail.",
  "news.thanks": "Vous \u00eates inscrit -- surveillez notre prochaine lettre.",
  "news.placeholder": "Votre adresse e-mail",
  "news.emailAria": "Adresse e-mail",
  "news.joining": "Inscription...",
  "news.subscribe": "S\u2019inscrire",
  "news.error": "L\u2019envoi n\u2019a pas abouti. V\u00e9rifiez l\u2019adresse et r\u00e9essayez.",
  "news.privacy": "Pas de spam. D\u00e9sinscription \u00e0 tout moment.",

  "home.introHeading": "R\u00e9servez tout le voyage, pas six onglets.",
  "home.introCopy":
    "Cherchez vols, h\u00f4tels, voitures, transferts a\u00e9roport, cartes SIM et excursions depuis un seul tableau de bord, puis r\u00e9servez chez nos partenaires.",
  "home.introAlt": "Ciel nocturne",
  "home.flightsHeading": "De vrais tarifs, compar\u00e9s en une seule recherche.",
  "home.flightsCopy":
    "Comparez les compagnies via la recherche Aviasales et bloquez un tarif avant qu\u2019il ne bouge.",
  "home.compareFlights": "Comparer les vols",
  "home.viewAllFlights": "Voir tous les vols",
  "home.flightsAlt": "Vue depuis un hublot \u00e0 l\u2019heure dor\u00e9e",
  "home.hotelsHeading": "Des s\u00e9jours \u00e0 la hauteur du voyage.",
  "home.hotelsCopy":
    "Du boutique-h\u00f4tel au grand resort, filtr\u00e9s d\u2019abord par quartier, ensuite par nombre d\u2019\u00e9toiles.",
  "home.browseStays": "Voir les h\u00e9bergements",
  "home.viewAllHotels": "Voir tous les h\u00f4tels",
  "home.hotelsAlt": "Piscine \u00e0 d\u00e9bordement surplombant la c\u00f4te",
  "home.carsHeading": "Une voiture, o\u00f9 que vous atterrissiez.",
  "home.carsCopy":
    "De la citadine au SUV, r\u00e9cup\u00e9r\u00e9e \u00e0 l\u2019arriv\u00e9e et rendue o\u00f9 vous voulez sur le trajet.",
  "home.reserveCar": "R\u00e9server une voiture",
  "home.viewAllCars": "Voir toutes les voitures",
  "home.carsAlt": "Voiture de luxe gar\u00e9e sur une route c\u00f4ti\u00e8re",
  "home.airportAlt": "Salon d\u2019a\u00e9roport avec \u00e9crans des d\u00e9parts",
  "home.airportHeading": "\u00c9vitez les files d\u2019attente.",
  "home.airportCopy":
    "Transferts priv\u00e9s, navettes partag\u00e9es, acc\u00e8s aux salons et aide bagages, r\u00e9serv\u00e9s avant l\u2019atterrissage.",
  "home.addAirportHelp": "Ajouter un service a\u00e9roport",
  "home.viewAllAirport": "Voir tous les services a\u00e9roport",
  "home.eventsHeading": "Des billets pour l\u2019essentiel.",
  "home.eventsCopy":
    "Concerts, mus\u00e9es, attractions et coupe-files dans les villes que vous visitez d\u00e9j\u00e0.",
  "home.eventsAlt": "Talon de billet pos\u00e9 sur une surface sombre",
  "home.sameDay": "Le jour m\u00eame",
  "home.eventsTickets": "Les billets mobiles arrivent dans votre bo\u00eete mail d\u00e8s la r\u00e9servation.",
  "home.findEvents": "Trouver des \u00e9v\u00e9nements",
  "home.viewAll": "Tout voir",
  "home.connectivity": "Connectivit\u00e9",
  "home.esimHeading": "Connect\u00e9 d\u00e8s l\u2019arriv\u00e9e.",
  "home.esimCopy":
    "Activation eSIM instantan\u00e9e avant l\u2019atterrissage, ou une carte SIM \u00e0 retirer au comptoir de l\u2019a\u00e9roport.",
  "home.viewAllEsim": "Voir tous les forfaits eSIM",
  "home.esimAlt": "T\u00e9l\u00e9phone affichant un QR code eSIM",
  "home.planLocal": "Forfaits data locaux",
  "home.planLocalDetail": "Un pays, pr\u00eat \u00e0 l\u2019arriv\u00e9e.",
  "home.planRegional": "Forfaits r\u00e9gionaux",
  "home.planRegionalDetail": "Passez les fronti\u00e8res sans changer de SIM.",
  "home.planUnlimited": "Appels et data illimit\u00e9s",
  "home.planUnlimitedDetail": "Pour les longs s\u00e9jours et le travail \u00e0 distance.",
  "home.getConnected": "Activer une eSIM",
  "home.toursHeading": "Allez le voir, pas seulement y atterrir.",
  "home.toursCopy":
    "Visites coupe-file, excursions \u00e0 la journ\u00e9e et guides locaux, r\u00e9servables d\u00e8s l\u2019arriv\u00e9e.",
  "home.exploreTours": "Explorer les excursions",
  "home.toursAlt1": "Boussole en laiton pos\u00e9e sur une carte",
  "home.toursAlt2": "Vue a\u00e9rienne d\u2019un site c\u00f4tier",
  "home.howHeading": "Comment fonctionne Skynova.",
  "home.one": "Un",
  "home.two": "Deux",
  "home.three": "Trois",
  "home.step1Title": "Une seule recherche",
  "home.step1Detail":
    "Une barre de recherche, tous les services, des r\u00e9sultats en direct de nos r\u00e9seaux partenaires.",
  "home.step2Title": "Comparez honn\u00eatement",
  "home.step2Detail":
    "Skynova n\u2019ajoute aucune marge et ne vend aucun placement -- vous voyez les r\u00e9sultats du partenaire.",
  "home.step3Title": "R\u00e9servez tout",
  "home.step3Detail":
    "Vous payez directement chez chaque partenaire ; votre r\u00e9servation est chez lui, pas chez nous.",
  "home.trustLine": "Les r\u00e9servations passent par nos partenaires du r\u00e9seau de voyage",
  "home.why1Title": "Une recherche, tous les services",
  "home.why1Detail": "Des vols aux excursions, compar\u00e9s c\u00f4te \u00e0 c\u00f4te.",
  "home.why2Title": "Le prix du partenaire, sans marge",
  "home.why2Detail": "Vous payez directement la compagnie, l\u2019h\u00f4tel ou l\u2019op\u00e9rateur.",
  "home.why3Title": "Pens\u00e9 pour tout le voyage",
  "home.why3Detail": "De la premi\u00e8re recherche de vol \u00e0 la derni\u00e8re excursion.",
  "home.finalHeading": "Commencez votre voyage.",
  "home.finalCopy": "Choisissez un service ci-dessus, ou explorez par destination.",
  "home.trustVerticals": "services de voyage",
  "home.trustDestinations": "destinations",
  "home.trustPartner": "r\u00e9serv\u00e9s via un seul r\u00e9seau de partenaires de confiance",
  "home.whySkynova": "Pourquoi Skynova",
  "home.advHeading": "Con\u00e7u pour r\u00e9server tout le voyage, correctement.",
  "home.adv1Title": "Acc\u00e8s direct aux partenaires",
  "home.adv1Detail":
    "Chaque recherche m\u00e8ne directement \u00e0 des partenaires v\u00e9rifi\u00e9s -- vols, h\u00f4tels, voitures et excursions -- sans marge de revendeur.",
  "home.adv2Detail":
    "Vols, h\u00e9bergements, voitures, services a\u00e9roport, eSIM et excursions, compar\u00e9s dans un seul parcours au lieu de six onglets.",
  "home.adv3Title": "Prix partenaire, en toute transparence",
  "home.adv3Detail":
    "Le prix affich\u00e9 au paiement est celui du partenaire -- Skynova touche une commission, vous ne payez rien de plus.",
  "home.adv4Title": "Pens\u00e9 autour de votre itin\u00e9raire",
  "home.adv4Detail":
    "Des guides de destination et des extras adapt\u00e9s \u00e0 o\u00f9 vous allez vraiment, pas des ventes additionnelles g\u00e9n\u00e9riques.",
  "home.specVerticals": "Services en un seul parcours",
  "home.specDestinations": "Destinations desservies",
  "home.specMarkup": "Marge ajout\u00e9e par Skynova",
  "home.specSupport": "D\u00e9lai de r\u00e9ponse du support",
  "home.howBookingWorks": "Comment se passe une r\u00e9servation",
  "home.insideHeading": "Dans chaque r\u00e9servation Skynova.",
  "home.insideCopy":
    "Aucun stock en propre, aucun frais cach\u00e9 -- juste une couche d\u2019aiguillage entre vous et les partenaires qui assurent r\u00e9ellement le voyage.",
  "home.step3AltTitle": "R\u00e9servez chez le partenaire",
  "home.step3AltDetail": "Le paiement se fait sur le site du partenaire, \u00e0 son prix.",
  "home.step4Title": "Volez, s\u00e9journez, partez",
  "home.step4Detail": "Votre r\u00e9servation est chez lui ; nous ne sommes que la porte d\u2019entr\u00e9e.",
  "home.beyondBooking": "Au-del\u00e0 de la r\u00e9servation",
  "home.benefitsHeading": "Ce qu\u2019on oublie de planifier.",
  "home.ben1Title": "Connect\u00e9 d\u00e8s l\u2019atterrissage",
  "home.ben1Detail": "Activation eSIM avant l\u2019atterrissage, ou une carte SIM \u00e0 retirer au comptoir.",
  "home.ben2Title": "\u00c9vitez les files d\u2019attente",
  "home.ben2Detail": "Transferts priv\u00e9s, acc\u00e8s aux salons et aide bagages, organis\u00e9s avant l\u2019atterrissage.",
  "home.ben3Title": "Guid\u00e9, en groupe ou en solo",
  "home.ben3Detail": "Visites coupe-file et excursions \u00e0 la journ\u00e9e, r\u00e9servables d\u00e8s l\u2019arriv\u00e9e.",
  "home.ben4Title": "Une assistance quand il le faut",
  "home.ben4Detail": "Un vrai interlocuteur si une r\u00e9servation demande une intervention humaine.",
  "home.countriesServed": "Pays desservis",
  "home.travelVerticals": "Services de voyage",
  "home.bookingOpen": "R\u00e9servation ouverte",
  "home.yourLocalTime": "Votre heure locale",
  "home.flyAnywhere": "Partez o\u00f9 vous voulez",
  "home.flyHeading": "{count} destinations, un seul parcours de r\u00e9servation.",
  "home.flyCopy":
    "Chaque ville ci-dessous m\u00e8ne directement aux vols, h\u00e9bergements, voitures et excursions du pays.",
  "home.viewAllDestinationsCount": "Voir les {count} destinations",
  "home.closingHeading": "Des destinations r\u00e9unies dans une seule recherche, pas six onglets.",
  "home.closingCopy":
    "Vols, h\u00e9bergements, voitures, services a\u00e9roport, eSIM et excursions -- commencez par une destination ou un service, nous nous occupons du reste.",
  "home.talkToUs": "Parlez-nous",

  "contact.heading": "Parlez \u00e0 Skynova Agency.",
  "contact.intro":
    "Nous r\u00e9pondons en g\u00e9n\u00e9ral sous un jour ouvr\u00e9. Si votre question porte sur une r\u00e9servation d\u00e9j\u00e0 effectu\u00e9e, le partenaire qui a encaiss\u00e9 le paiement vous aidera le plus vite -- votre e-mail de confirmation vient de lui.",
  "contact.received": "Message re\u00e7u",
  "contact.thanksNamed": "Merci {name} -- nous avons bien re\u00e7u votre message et vous r\u00e9pondrons \u00e0 ",
  "contact.thanksAnon": "Merci de nous avoir \u00e9crit -- nous avons bien re\u00e7u votre message et vous r\u00e9pondrons \u00e0 ",
  "contact.nothingElse":
    "Rien d\u2019autre n\u2019est attendu de votre part. Si c\u2019est urgent et que cela concerne une r\u00e9servation existante, contactez le partenaire directement en attendant.",
  "contact.yourName": "Votre nom",
  "contact.namePlaceholder": "Camille Martin",
  "contact.emailPlaceholder": "vous@exemple.com",
  "contact.about": "De quoi s\u2019agit-il ?",
  "contact.message": "Message",
  "contact.messagePlaceholder": "Dites-nous ce dont vous avez besoin.",
  "contact.sending": "Envoi\u2026",
  "contact.send": "Envoyer le message",
  "contact.error": "Un probl\u00e8me est survenu. Veuillez r\u00e9essayer.",
  "contact.alreadyBooked": "D\u00e9j\u00e0 r\u00e9serv\u00e9 ?",
  "contact.alreadyBookedCopy":
    "Skynova ne d\u00e9tient pas votre r\u00e9servation -- c\u2019est le partenaire, et c\u2019est lui qui a encaiss\u00e9. Pour toute modification, annulation ou remboursement, contactez-le directement. Ses coordonn\u00e9es figurent sur votre e-mail de confirmation.",
  "contact.commonQuestions": "Questions fr\u00e9quentes",
  "contact.commonCopy":
    "La plupart des questions sur la r\u00e9servation, les prix et les annulations ont d\u00e9j\u00e0 une r\u00e9ponse.",
  "contact.readFaq": "Lire la FAQ",
  "contact.partnerships": "Partenariats",
  "contact.partnershipsCopy":
    "Marques de voyage et r\u00e9seaux d\u2019affiliation -- choisissez \u00ab Partnership \u00bb ci-dessus et nous transmettrons au bon endroit.",

  "about.eyebrow": "\u00c0 propos de Skynova Agency",
  "about.heading": "Un seul endroit pour tout le voyage.",
  "about.intro":
    "La plupart des voyages se pr\u00e9parent dans six ou sept onglets ouverts -- un pour les vols, un pour l\u2019h\u00f4tel, un pour la voiture de location, un pour les billets. Skynova Agency r\u00e9unit tout cela derri\u00e8re une seule recherche, une seule porte d\u2019entr\u00e9e, un seul endroit o\u00f9 revenir avant de partir.",
  "about.howItWorks": "Comment \u00e7a marche",
  "about.howCopy":
    "Skynova Agency ne d\u00e9tient aucun stock. Chaque vol, chambre, voiture, billet, eSIM et excursion r\u00e9serv\u00e9 via le site est assur\u00e9 par un partenaire de voyage \u00e9tabli -- nous orientons chaque recherche vers le bon et nous nous effa\u00e7ons au moment du paiement.",
  "about.howPaid": "Comment nous sommes r\u00e9mun\u00e9r\u00e9s",
  "about.paidCopy":
    "Nous fonctionnons avec le r\u00e9seau d\u2019affiliation Travelpayouts. Lorsqu\u2019une r\u00e9servation aboutit chez l\u2019un de nos partenaires, nous touchons une commission sans co\u00fbt suppl\u00e9mentaire pour le voyageur -- le prix affich\u00e9 au paiement est celui du partenaire.",
  "about.whereToday": "O\u00f9 nous en sommes",
  "about.statGuides": "guides de destination",
  "about.statRegions": "r\u00e9gions couvertes",
  "about.statCollections": "collections th\u00e9matiques",
  "about.statArticles": "articles r\u00e9dig\u00e9s",
  "about.whatNot": "Ce que nous ne faisons pas",
  "about.whatNotCopy":
    "Nous n\u2019encaissons pas votre paiement, ne d\u00e9tenons pas votre r\u00e9servation et ne fixons pas le prix. Tout cela se passe chez le partenaire. Si quelque chose doit changer apr\u00e8s la r\u00e9servation, c\u2019est lui qui peut le faire -- et c\u2019est pourquoi ce sont ses coordonn\u00e9es qui figurent sur votre confirmation, pas les n\u00f4tres.",
  "about.whyGuides": "Pourquoi ces guides existent",
  "about.whyGuidesCopy":
    "Chaque destination ici a un guide r\u00e9dig\u00e9 plut\u00f4t qu\u2019un paragraphe g\u00e9n\u00e9rique, parce que l\u2019utile, quand on pr\u00e9pare un voyage, c\u2019est de savoir ce qu\u2019un endroit co\u00fbte vraiment, quand y aller et ce que le guide touristique passe sous silence.",
  "about.whatsCovered": "Ce qui est couvert",
};

const DICTS: Record<Locale, Dict> = { en: EN, fr: FR };

/** `{name}` placeholders, filled from `vars`. Left as written when a caller
 *  passes nothing for them, so a missing variable is visible rather than a
 *  silent gap in a sentence. */
function fill(template: string, vars?: Record<string, string | number>) {
  if (!vars) return template;
  return template.replace(/\{(\w+)\}/g, (whole, name: string) =>
    name in vars ? String(vars[name]) : whole,
  );
}

export function translate(key: TKey, locale: Locale, vars?: Record<string, string | number>) {
  return fill(DICTS[locale][key] ?? EN[key], vars);
}

/** The locale of the current router. Single source for every component that
 *  needs it -- see router.tsx for why this is router context and not the URL. */
export function useLocale(): Locale {
  const router = useRouter();
  const context = router.options.context as { locale?: Locale } | undefined;
  return context?.locale ?? DEFAULT_LOCALE;
}

/** `const t = useT()` then `t("nav.explore")`. */
export function useT() {
  const locale = useLocale();
  return (key: TKey, vars?: Record<string, string | number>) => translate(key, locale, vars);
}
