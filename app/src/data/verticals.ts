import { Plane, Building2, Car, Luggage, Smartphone, Compass, Ticket, Bike, type LucideIcon } from "lucide-react";

export type Vertical = {
  key: string;
  label: string;
  icon: LucideIcon;
  href: string;
  title: string;
  subtitle: string;
};

// Title/subtitle are pulled straight from each vertical's own hero copy
// (see routes/flights.tsx etc.) rather than written fresh, so a preview
// never says something the real page doesn't back up. Shared between the
// homepage's VerticalExplorerSection (a curated 6) and the desktop nav's
// mega menu (all 8) so both stay in sync with one source of copy.
export const VERTICALS: Vertical[] = [
  {
    key: "flights",
    label: "Flights",
    icon: Plane,
    href: "/flights",
    title: "Real fares, compared in one search.",
    subtitle: "Compare airlines on Aviasales-powered search and lock in a fare before prices move.",
  },
  {
    key: "hotels",
    label: "Hotels",
    icon: Building2,
    href: "/hotels",
    title: "Stay somewhere unforgettable.",
    subtitle: "From boutique stays to full resorts, filtered by neighborhood first and star rating second.",
  },
  {
    key: "car-rentals",
    label: "Car rentals",
    icon: Car,
    href: "/car-rentals",
    title: "Drive your journey.",
    subtitle: "Economy to executive SUVs, picked up at arrivals and dropped off anywhere on the route.",
  },
  {
    key: "airport-services",
    label: "Airport",
    icon: Luggage,
    href: "/airport-services",
    title: "Arrive relaxed. Leave effortlessly.",
    subtitle: "Private transfers, shared shuttles, lounge access and baggage help, booked before you land.",
  },
  {
    key: "esim",
    label: "SIM / eSIM",
    icon: Smartphone,
    href: "/esim",
    title: "Stay connected wherever you go.",
    subtitle: "Instant eSIM activation before you land, or a physical SIM waiting at the airport counter.",
  },
  {
    key: "tours",
    label: "Tours",
    icon: Compass,
    href: "/tours",
    title: "Go see it, not just land there.",
    subtitle: "Skip-the-line tours, day trips and local guides, bookable the moment you land.",
  },
  {
    key: "events",
    label: "Events",
    icon: Ticket,
    href: "/events",
    title: "Your next unforgettable experience starts here.",
    subtitle: "Concerts, museums, attractions and skip-the-line passes in the cities you are already visiting.",
  },
  {
    key: "bike-rentals",
    label: "Bike rentals",
    icon: Bike,
    href: "/bike-rentals",
    title: "See the destination differently.",
    subtitle: "City bikes, e-bikes and mountain bikes, plus guided rides in the cities you're already visiting.",
  },
];
