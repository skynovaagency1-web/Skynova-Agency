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
