import { useEffect, useRef } from "react";
import { Link } from "@tanstack/react-router";

import { DESTINATIONS } from "@/data/destinations";
import { Music2 } from "lucide-react";

import { REGION_ORDER } from "@/data/destinations";
import { useScrollReveal } from "@/hooks/use-scroll-reveal";

// lucide-react dropped brand/logo glyphs -- these four are plain inline SVG
// marks instead of lucide imports.
type IconProps = { size?: number };

function BrandIcon({ size = 16, path }: IconProps & { path: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d={path} />
    </svg>
  );
}

const FacebookIcon = (p: IconProps) => (
  <BrandIcon
    {...p}
    path="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.879v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.892h-2.33v6.987C18.343 21.128 22 16.991 22 12z"
  />
);

const XIcon = (p: IconProps) => (
  <BrandIcon
    {...p}
    path="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"
  />
);

const YoutubeIcon = (p: IconProps) => (
  <BrandIcon
    {...p}
    path="M23.498 6.186a2.999 2.999 0 0 0-2.113-2.117C19.505 3.5 12 3.5 12 3.5s-7.505 0-9.385.569A2.999 2.999 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a2.999 2.999 0 0 0 2.113 2.117C4.495 20.5 12 20.5 12 20.5s7.505 0 9.385-.569a2.999 2.999 0 0 0 2.113-2.117C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.75 15.5v-7l6.5 3.5-6.5 3.5z"
  />
);

const InstagramIcon = (p: IconProps) => (
  <BrandIcon
    {...p}
    path="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.012-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zm0 10.162a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z"
  />
);

const VERTICALS = [
  { to: "/flights", label: "Flights" },
  { to: "/hotels", label: "Hotels" },
  { to: "/car-rentals", label: "Car rentals" },
  { to: "/airport-services", label: "Airport services" },
  { to: "/events", label: "Events & tickets" },
  { to: "/esim", label: "SIM & eSIM" },
  { to: "/tours", label: "Tours & activities" },
  { to: "/bike-rentals", label: "Bike rentals" },
];

const COMPANY_LINKS = [
  { to: "/about", label: "About us" },
  { to: "/contact", label: "Contact us" },
  { to: "/blog", label: "Blog" },
];

const SOCIAL_LINKS = [
  { icon: Music2, label: "TikTok" },
  { icon: FacebookIcon, label: "Facebook" },
  { icon: XIcon, label: "X (Twitter)" },
  { icon: YoutubeIcon, label: "YouTube" },
  { icon: InstagramIcon, label: "Instagram" },
];

export function Footer() {
  const revealRef = useScrollReveal<HTMLElement>();
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  // This video sits at the bottom of every page on the site, but a plain
  // autoPlay video keeps decoding in the background for as long as the tab
  // is open, whether or not the footer is ever scrolled into view -- real
  // CPU/GPU work fighting the rest of the page for nothing on most visits.
  // Load and play it only once it's actually about to be seen.
  useEffect(() => {
    const container = containerRef.current;
    const video = videoRef.current;
    if (!container || !video) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          video.play().catch(() => {});
        } else {
          video.pause();
        }
      },
      { rootMargin: "200px" },
    );
    observer.observe(container);
    return () => observer.disconnect();
  }, []);

  return (
    <div className="footer-cinematic" ref={containerRef}>
      <video
        ref={videoRef}
        className="footer-video"
        src="/assets/hero/cloud-video.mp4"
        muted
        loop
        playsInline
        preload="none"
        aria-hidden="true"
      />
      <div className="footer-video-scrim" aria-hidden="true" />
      <footer ref={revealRef} className="footer-glass site-container">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-12 md:gap-12">
          <div className="md:col-span-5">
            <div className="flex items-center gap-2">
              <img src="/assets/brand/monogram-light.webp" alt="" aria-hidden="true" className="site-nav-mark" />
              <span className="font-semibold">Skynova Agency</span>
            </div>
            <p className="footer-ink-muted mt-4 max-w-sm text-sm leading-relaxed">
              One search that reaches real airlines, real hotels, and real partners -- no markup, no
              middleman, no juggling six tabs.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-8 sm:grid-cols-3 md:col-span-7">
            <div>
              <p className="footer-heading">Book</p>
              <ul className="space-y-2 text-xs">
                {VERTICALS.map((v) => (
                  <li key={v.to}>
                    <Link to={v.to} className="footer-link">{v.label}</Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <p className="footer-heading">Company</p>
              <ul className="space-y-2 text-xs">
                {COMPANY_LINKS.map((l) => (
                  <li key={l.to}>
                    <Link to={l.to} className="footer-link">{l.label}</Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <p className="footer-heading">Destinations</p>
              <ul className="space-y-2 text-xs">
                {REGION_ORDER.map(({ region }) => (
                  <li key={region}>
                    <Link to="/destinations" className="footer-link">{region}</Link>
                  </li>
                ))}
                <li>
                  <Link to="/destinations" className="footer-link font-medium">All {DESTINATIONS.length} destinations &rarr;</Link>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <div>
            <p className="footer-ink-muted text-[10px] uppercase tracking-widest">
              Skynova Agency runs on the Travelpayouts affiliate network -- booking links may earn a
              commission at no extra cost to you.
            </p>
            <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1">
              <Link to="/privacy" className="footer-link text-[10px] uppercase tracking-widest">
                Privacy Policy
              </Link>
              <Link to="/terms" className="footer-link text-[10px] uppercase tracking-widest">
                Terms of Use
              </Link>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <span className="footer-ink-muted text-[10px] uppercase tracking-widest">Follow along</span>
            <div className="flex items-center gap-3">
              {SOCIAL_LINKS.map(({ icon: Icon, label }) => (
                <a key={label} href="#" aria-label={label} className="footer-social-icon">
                  <Icon size={16} />
                </a>
              ))}
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
