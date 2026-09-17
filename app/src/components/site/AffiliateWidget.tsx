import { useEffect, useRef } from "react";

/**
 * Mounts a partner-hosted widget script (Travelpayouts "Smart Content" and
 * similar) into a container div. Injected imperatively via useEffect rather
 * than as JSX <script> -- this is a client-side route (TanStack Router SPA
 * navigation), so a script tag from a previous route's render can linger;
 * this creates a fresh <script> on mount and clears the container on
 * unmount so re-visiting the page doesn't stack duplicate widget instances.
 */
export function AffiliateWidget({
  src,
  className,
  async = true,
}: {
  src: string;
  className?: string;
  /**
   * Whether the injected <script> carries async.
   *
   * Default true, which is what every partner's copy-paste snippet says and
   * what the widgets on /tours, /events, /car-rentals and /esim have always
   * used. BikesBooking (campaign_id=57) is the exception and needs FALSE: it
   * finds its own mount point through document.currentScript, which is only
   * meaningful while the script is executing in order. Left async it loaded,
   * threw nothing, logged nothing, and rendered nothing -- the container kept
   * its 60px min-height with the <script> as its only child. With async off
   * it mounts its <tp-cascoon> element and draws.
   */
  async?: boolean;
}) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    const script = document.createElement("script");
    script.src = src;
    script.async = async;
    script.charset = "utf-8";
    container.appendChild(script);
    return () => {
      container.innerHTML = "";
    };
  }, [src, async]);

  return <div ref={containerRef} className={`affiliate-widget ${className ?? ""}`} />;
}
