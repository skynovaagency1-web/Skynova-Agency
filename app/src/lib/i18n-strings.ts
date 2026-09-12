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
