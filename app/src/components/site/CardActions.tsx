import { useEffect, useRef, useState, type MouseEvent } from "react";
import { Link } from "@tanstack/react-router";
import { Check, Gift, Share2 } from "lucide-react";

import { WishlistButton } from "./WishlistButton";

// The glass pill that sits on a destination card: collapsed it's just the
// save heart, and it expands to reveal share + gift.
//
// Save stays a ONE-tap action at every size -- it's by far the most-used of
// the three, so hiding it behind an expand would have been a regression
// dressed up as a flourish. The reveal is therefore additive, never gating.
//
// Expansion is CSS-only (see .card-actions): pointer devices collapse and
// expand on hover/focus-within, touch devices -- which have no hover -- get
// the pill expanded permanently rather than a tap they'd have to discover.
export function CardActions({ slug, name }: { slug: string; name: string }) {
  const [copied, setCopied] = useState(false);
  const copyTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => () => {
    if (copyTimer.current) clearTimeout(copyTimer.current);
  }, []);

  async function handleShare(e: MouseEvent<HTMLButtonElement>) {
    // The whole card body is a <Link>; without this the click navigates.
    e.preventDefault();
    e.stopPropagation();

    const url = `${window.location.origin}/destinations/${slug}`;
    const title = `${name} | Skynova Agency`;

    // Native share sheet where there is one (mostly mobile), clipboard
    // everywhere else. A cancelled share sheet rejects with AbortError,
    // which is a normal outcome, not a failure worth surfacing.
    if (navigator.share) {
      try {
        await navigator.share({ title, url });
        return;
      } catch {
        return;
      }
    }

    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      if (copyTimer.current) clearTimeout(copyTimer.current);
      copyTimer.current = setTimeout(() => setCopied(false), 1800);
    } catch {
      // Clipboard can be blocked by permissions; staying silent is better
      // than a scary error on what is a secondary convenience action.
    }
  }

  return (
    <div className="card-actions">
      <WishlistButton itemType="destination" itemSlug={slug} variant="bare" />

      <button
        type="button"
        className="card-actions-item"
        onClick={handleShare}
        aria-label={copied ? "Link copied" : `Share ${name}`}
      >
        {copied ? <Check size={16} /> : <Share2 size={16} />}
      </button>

      <Link
        to="/gift"
        search={{ destination: slug }}
        className="card-actions-item"
        aria-label={`Gift a trip to ${name}`}
        onClick={(e) => e.stopPropagation()}
      >
        <Gift size={16} />
      </Link>
    </div>
  );
}
