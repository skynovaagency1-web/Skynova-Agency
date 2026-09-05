import { useEffect, useRef } from "react";

/**
 * Mounts a partner-hosted widget script (Travelpayouts "Smart Content" and
 * similar) into a container div. Injected imperatively via useEffect rather
 * than as JSX <script> -- this is a client-side route (TanStack Router SPA
 * navigation), so a script tag from a previous route's render can linger;
 * this creates a fresh <script> on mount and clears the container on
 * unmount so re-visiting the page doesn't stack duplicate widget instances.
 */
export function AffiliateWidget({ src, className }: { src: string; className?: string }) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    const script = document.createElement("script");
    script.src = src;
    script.async = true;
    script.charset = "utf-8";
    container.appendChild(script);
    return () => {
      container.innerHTML = "";
    };
  }, [src]);

  return <div ref={containerRef} className={`affiliate-widget ${className ?? ""}`} />;
}
