import type { DestinationFare } from "@/lib/api/prices.functions";

/**
 * "from £89" on a destination card.
 *
 * THE WORD "FROM" IS NOT DECORATION. What Travelpayouts returns is a cached
 * aggregate of fares other people have found, not live inventory -- it will
 * not match what the partner quotes at checkout, and it is not bookable at
 * that number. Presenting it as a price would be a claim the site cannot
 * honour; presenting it as a floor is true and still useful. The same reason
 * the rest of the site says "no markup" rather than "cheapest".
 *
 * Renders nothing at all when there is no fare, rather than a placeholder or
 * a skeleton. A card with no price should look like a card that never had
 * one -- not like a card whose price failed to load.
 */
export function FarePill({ fare, className }: { fare?: DestinationFare; className?: string }) {
  if (!fare) return null;

  // Whole units. These are "from" figures; pence on an approximation is false
  // precision, and it makes the pill wider than the card can spare.
  const formatted = new Intl.NumberFormat(undefined, {
    style: "currency",
    currency: fare.currency.toUpperCase(),
    maximumFractionDigits: 0,
  }).format(fare.value);

  return (
    <span className={className ? `fare-pill ${className}` : "fare-pill"}>
      <span className="fare-pill-label">from</span>
      <span className="fare-pill-value">{formatted}</span>
    </span>
  );
}
