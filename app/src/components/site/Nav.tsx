import { useEffect, useRef, useState, type CSSProperties } from "react";
import { Link } from "@tanstack/react-router";
import { Home, MessageCircle, Heart, Gift, Share2, ChevronRight, MapPin, Newspaper, User, LogOut, Layers } from "lucide-react";

import { useAuth } from "@/lib/auth-context";
import { signOut } from "@/lib/api/auth.functions";
import { VERTICALS } from "@/data/verticals";
import { COLLECTIONS } from "@/data/collections";
import { REGION_ORDER } from "@/data/destinations";

const LINKS = [
  ...VERTICALS,
  { key: "destinations", label: "Destinations", icon: MapPin, href: "/destinations" },
  { key: "collections", label: "Collections", icon: Layers, href: "/collections" },
  { key: "blog", label: "Blog", icon: Newspaper, href: "/blog" },
] as const;

const COMPANY_LINKS = [
  { to: "/about", label: "About us" },
  { to: "/contact", label: "Contact" },
] as const;

export function Nav() {
  const [open, setOpen] = useState(false);
  const [companyOpen, setCompanyOpen] = useState(false);
  const [exploreOpen, setExploreOpen] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);
  const [activeVertical, setActiveVertical] = useState(VERTICALS[0].key);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const exploreCloseTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const accountCloseTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const { user, openAuthModal, refetchUser } = useAuth();

  function openCompany() {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    setCompanyOpen(true);
  }
  function scheduleCloseCompany() {
    closeTimer.current = setTimeout(() => setCompanyOpen(false), 150);
  }

  function openExplore() {
    if (exploreCloseTimer.current) clearTimeout(exploreCloseTimer.current);
    setExploreOpen(true);
  }
  function scheduleCloseExplore() {
    exploreCloseTimer.current = setTimeout(() => setExploreOpen(false), 150);
  }

  function openAccount() {
    if (accountCloseTimer.current) clearTimeout(accountCloseTimer.current);
    setAccountOpen(true);
  }
  function scheduleCloseAccount() {
    accountCloseTimer.current = setTimeout(() => setAccountOpen(false), 150);
  }

  async function handleSignOut() {
    await signOut();
    await refetchUser();
    setAccountOpen(false);
  }

  // Lock scroll behind the full-screen overlay while it's open, and let
  // Escape close it -- both expected of a premium mobile nav, neither free
  // with the old inline dropdown.
  //
  // The lock has to land on <html>, not just <body>. A body overflow only
  // governs the viewport when <html>'s own overflow is `visible`, and ours
  // is not (styles.css clips the x-axis on both to stop stray elements
  // opening a horizontal pan). Without <html>, the page scrolled happily
  // underneath the open overlay. <body> is kept as well so the lock still
  // holds if that clip is ever removed. This only runs on phones -- the
  // hamburger is display:none from 768px up -- where scrollbars overlay, so
  // there is no width to compensate for.
  useEffect(() => {
    if (!open) return;
    const root = document.documentElement;
    const prevRoot = root.style.overflow;
    const prevBody = document.body.style.overflow;
    root.style.overflow = "hidden";
    document.body.style.overflow = "hidden";
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    window.addEventListener("keydown", onKeyDown);
    return () => {
      root.style.overflow = prevRoot;
      document.body.style.overflow = prevBody;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  let rowIndex = 0;

  return (
    <header className="site-nav sticky top-0 z-40">
      <nav className="site-container flex h-16 items-center justify-between gap-4">
        <Link to="/" className="flex shrink-0 items-center gap-2" onClick={() => setOpen(false)}>
          <img src="/assets/brand/monogram.webp" alt="" aria-hidden="true" className="site-nav-mark" />
          <span className="font-semibold tracking-tight">Skynova Agency</span>
        </Link>
        <div className="site-nav-links">
          {/* One mega-menu trigger stands in for what used to be eight
              separate top-level links -- the same hover-to-preview
              interaction as the homepage's vertical explorer, so the two
              feel like one signature pattern rather than two different
              menus that happen to share a site. */}
          <div className="site-nav-dropdown" onMouseEnter={openExplore} onMouseLeave={scheduleCloseExplore}>
            <button
              type="button"
              className="site-nav-dropdown-trigger"
              aria-expanded={exploreOpen}
              onClick={() => setExploreOpen((v) => !v)}
            >
              Explore <span className="caret">&#9662;</span>
            </button>
            {exploreOpen ? (
              <div className="site-nav-mega">
                <div className="site-nav-mega-list">
                  {VERTICALS.map((v) => (
                    <Link
                      key={v.key}
                      to={v.href}
                      className={`site-nav-mega-item${activeVertical === v.key ? " is-active" : ""}`}
                      onMouseEnter={() => setActiveVertical(v.key)}
                      onFocus={() => setActiveVertical(v.key)}
                      onClick={() => setExploreOpen(false)}
                    >
                      <v.icon size={17} aria-hidden="true" />
                      <span>{v.label}</span>
                    </Link>
                  ))}
                </div>
                  {/* Second and third columns, adapted from a side-menu
                      reference: grouped link lists in place of a single
                      preview. Collections and regions previously had no
                      route in from the nav at all -- a lot of the site
                      hidden behind one "Destinations" link. */}
                  <div className="site-nav-mega-group">
                    <p className="site-nav-mega-heading">Collections</p>
                    <div className="site-nav-mega-links">
                      {COLLECTIONS.slice(0, 6).map((c) => (
                        <Link
                          key={c.slug}
                          to="/collections/$slug"
                          params={{ slug: c.slug }}
                          className="site-nav-mega-sublink"
                          onClick={() => setExploreOpen(false)}
                        >
                          <span aria-hidden="true">{c.icon}</span> {c.name}
                        </Link>
                      ))}
                    </div>
                    <Link to="/collections" className="site-nav-mega-more" onClick={() => setExploreOpen(false)}>
                      All collections <span className="arrow">&rarr;</span>
                    </Link>
                  </div>

                  <div className="site-nav-mega-group">
                    <p className="site-nav-mega-heading">By region</p>
                    <div className="site-nav-mega-links">
                      {REGION_ORDER.map(({ region, icon }) => (
                        <Link
                          key={region}
                          to="/destinations"
                          search={{ region }}
                          className="site-nav-mega-sublink"
                          onClick={() => setExploreOpen(false)}
                        >
                          <span aria-hidden="true">{icon}</span> {region}
                        </Link>
                      ))}
                    </div>
                    <Link to="/destinations" className="site-nav-mega-more" onClick={() => setExploreOpen(false)}>
                      All destinations <span className="arrow">&rarr;</span>
                    </Link>
                  </div>
              </div>
            ) : null}
          </div>
          <Link to="/destinations" className="site-nav-link text-sm">
            Destinations
          </Link>
          <Link to="/collections" className="site-nav-link text-sm">
            Collections
          </Link>
          <Link to="/blog" className="site-nav-link text-sm">
            Blog
          </Link>
          <div className="site-nav-dropdown" onMouseEnter={openCompany} onMouseLeave={scheduleCloseCompany}>
            <button
              type="button"
              className="site-nav-dropdown-trigger"
              aria-expanded={companyOpen}
              onClick={() => setCompanyOpen((v) => !v)}
            >
              Company <span className="caret">&#9662;</span>
            </button>
            {companyOpen ? (
              <div className="site-nav-dropdown-menu">
                {COMPANY_LINKS.map((l) => (
                  <Link
                    key={l.to}
                    to={l.to}
                    className="site-nav-dropdown-item"
                    onClick={() => setCompanyOpen(false)}
                  >
                    {l.label}
                  </Link>
                ))}
              </div>
            ) : null}
          </div>
          {user ? (
            <div className="site-nav-dropdown" onMouseEnter={openAccount} onMouseLeave={scheduleCloseAccount}>
              <button
                type="button"
                className="site-nav-account-icon is-signed-in"
                aria-label={`Account: ${user.email}`}
                aria-expanded={accountOpen}
                onClick={() => setAccountOpen((v) => !v)}
              >
                <User size={18} />
              </button>
              {accountOpen ? (
                <div className="site-nav-dropdown-menu site-nav-account-menu">
                  <p className="site-nav-account-email">{user.email}</p>
                  <Link to="/account" className="site-nav-dropdown-item" onClick={() => setAccountOpen(false)}>
                    <User size={15} /> Your account
                  </Link>
                  <button type="button" className="site-nav-dropdown-item site-nav-account-signout" onClick={handleSignOut}>
                    <LogOut size={15} /> Sign out
                  </button>
                </div>
              ) : null}
            </div>
          ) : (
            <button
              type="button"
              className="site-nav-account-icon"
              aria-label="Log in or sign up"
              onClick={() => openAuthModal("sign-in")}
            >
              <User size={18} />
            </button>
          )}
        </div>
        <div className="flex shrink-0 items-center gap-3">
          <a href="/#hero" className="btn-nav-pill site-nav-cta">
            <span>Start your trip</span>
          </a>
          <button
            type="button"
            className={`site-menu-btn${open ? " is-open" : ""}`}
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
          >
            <span className="site-menu-bar" />
            <span className="site-menu-bar" />
            <span className="site-menu-bar" />
          </button>
        </div>
      </nav>
      <div className={`site-mobile-menu md:hidden${open ? " is-open" : ""}`} aria-hidden={!open}>
        <div className="site-container site-mobile-menu-inner">
          <div className="mobile-menu-topbar">
            <Link to="/" className="mobile-menu-icon-btn" aria-label="Home" onClick={() => setOpen(false)}>
              <Home size={18} />
            </Link>
            <Link to="/contact" className="mobile-menu-icon-btn" aria-label="Contact" onClick={() => setOpen(false)}>
              <MessageCircle size={18} />
            </Link>
          </div>

          <div className="mobile-account-block">
            {user ? (
              <>
                <p className="site-eyebrow mb-2">Signed in</p>
                <p className="mobile-account-title">{user.email}</p>
                <Link to="/account" className="btn-underline mt-2" onClick={() => setOpen(false)}>
                  Your account <span className="arrow">&rarr;</span>
                </Link>
                <button
                  type="button"
                  className="btn-underline mt-3"
                  onClick={() => {
                    handleSignOut();
                    setOpen(false);
                  }}
                >
                  Sign out
                </button>
              </>
            ) : (
              <>
                <p className="site-eyebrow mb-2">Members save more</p>
                <p className="mobile-account-title">Log in to plan your next trip.</p>
                <p className="mobile-account-subtitle">Save destinations and share trips with friends.</p>
                <button
                  type="button"
                  className="btn-hero-pill mt-4 w-full justify-center"
                  onClick={() => {
                    openAuthModal("sign-in");
                    setOpen(false);
                  }}
                >
                  <span>Log in / Sign up</span>
                </button>
              </>
            )}
          </div>

          <div className="mobile-menu-card">
            <Link
              to="/wishlist"
              className="mobile-menu-row"
              style={{ "--i": rowIndex++ } as CSSProperties}
              tabIndex={open ? undefined : -1}
              onClick={() => setOpen(false)}
            >
              <Heart size={20} />
              <span>Wish list</span>
              <ChevronRight size={16} className="mobile-menu-row-chevron" />
            </Link>
            <Link
              to="/share"
              className="mobile-menu-row"
              style={{ "--i": rowIndex++ } as CSSProperties}
              tabIndex={open ? undefined : -1}
              onClick={() => setOpen(false)}
            >
              <Share2 size={20} />
              <span>Share Skynova with friends</span>
              <ChevronRight size={16} className="mobile-menu-row-chevron" />
            </Link>
          </div>

          <div className="mobile-menu-card">
            <Link
              to="/gift"
              className="mobile-menu-row"
              style={{ "--i": rowIndex++ } as CSSProperties}
              tabIndex={open ? undefined : -1}
              onClick={() => setOpen(false)}
            >
              <Gift size={20} />
              <span>Gift</span>
              <ChevronRight size={16} className="mobile-menu-row-chevron" />
            </Link>
          </div>

          <div className="mobile-menu-card">
            {LINKS.map((l) => (
              <Link
                key={l.key}
                to={l.href}
                className="mobile-menu-row"
                style={{ "--i": rowIndex++ } as CSSProperties}
                tabIndex={open ? undefined : -1}
                onClick={() => setOpen(false)}
              >
                <l.icon size={20} />
                <span>{l.label}</span>
                <ChevronRight size={16} className="mobile-menu-row-chevron" />
              </Link>
            ))}
          </div>

          <div className="mobile-menu-card">
            {COMPANY_LINKS.map((l) => (
              <Link
                key={l.to}
                to={l.to}
                className="mobile-menu-row"
                style={{ "--i": rowIndex++ } as CSSProperties}
                tabIndex={open ? undefined : -1}
                onClick={() => setOpen(false)}
              >
                <span>{l.label}</span>
                <ChevronRight size={16} className="mobile-menu-row-chevron" />
              </Link>
            ))}
          </div>

          <div className="site-mobile-menu-footer" style={{ "--i": rowIndex++ } as CSSProperties}>
            <a href="/#hero" className="btn-nav-pill justify-center w-full" onClick={() => setOpen(false)}>
              <span>Start your trip</span>
            </a>
          </div>
        </div>
      </div>
    </header>
  );
}
