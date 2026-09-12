import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";

import { Nav } from "@/components/site/Nav";
import { Footer } from "@/components/site/Footer";
import { useAuth } from "@/lib/auth-context";
import { signOut } from "@/lib/api/auth.functions";
import { getWishlist } from "@/lib/api/wishlist.functions";
import { getReferralStats } from "@/lib/api/referral.functions";
import { getDestinationBySlug } from "@/data/destinations";
import { useT, useLocale } from "@/lib/i18n-strings";
import { LOCALE_TAGS } from "@/lib/i18n";

export const Route = createFileRoute("/account")({
  head: () => ({
    meta: [
      { title: "Your account | Skynova Agency" },
      { name: "description", content: "Your saved trips, referral link and account details." },
      // Nothing here is public, so keep it out of the index entirely.
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: AccountPage,
});

/**
 * Account page.
 *
 * Everything an account holds was previously scattered: the email lived only
 * in a nav dropdown, saved places on /wishlist, the referral link on /share.
 * There was no single page that answered "what is in my account?".
 *
 * Signed-out visitors get a prompt rather than a redirect -- a redirect loses
 * the fact that they meant to come here.
 */
function AccountPage() {
  const { user, isLoading, openAuthModal, refetchUser } = useAuth();
  const t = useT();
  const locale = useLocale();
  const [signingOut, setSigningOut] = useState(false);
  const [copied, setCopied] = useState(false);

  const wishlist = useQuery({
    queryKey: ["wishlist"],
    queryFn: () => getWishlist(),
    enabled: Boolean(user),
  });
  const referral = useQuery({
    queryKey: ["referral-stats"],
    queryFn: () => getReferralStats(),
    enabled: Boolean(user),
  });

  const referralLink = referral.data
    ? `https://skynovaagency.com/?ref=${referral.data.referralCode}`
    : null;

  async function handleCopy() {
    if (!referralLink) return;
    try {
      await navigator.clipboard.writeText(referralLink);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard can be blocked; the link stays selectable on screen.
    }
  }

  async function handleSignOut() {
    setSigningOut(true);
    await signOut();
    await refetchUser();
    setSigningOut(false);
  }

  if (isLoading) {
    return (
      <>
        <Nav />
        <main>
          <section className="site-section">
            <div className="site-container">
              <p className="site-ink-muted">{t("account.loading")}</p>
            </div>
          </section>
        </main>
        <Footer />
      </>
    );
  }

  if (!user) {
    return (
      <>
        <Nav />
        <main>
          <section className="site-section">
            <div className="site-container">
              <p className="site-eyebrow mb-3">{t("account.eyebrow")}</p>
              <h1 className="site-h2 max-w-2xl text-4xl md:text-5xl">{t("account.signedOutHeading")}</h1>
              <p className="site-ink-muted mt-4 max-w-lg text-base leading-relaxed">
                {t("account.signedOutCopy")}
              </p>
              <button type="button" className="btn-hero-pill mt-7" onClick={() => openAuthModal("sign-in")}>
                <span className="spark" />
                <span>{t("account.signInOrCreate")}</span>
              </button>
            </div>
          </section>
        </main>
        <Footer />
      </>
    );
  }

  const saved = wishlist.data ?? [];
  const savedDestinations = saved
    .filter((i) => i.itemType === "destination")
    .map((i) => getDestinationBySlug(i.itemSlug))
    .filter((d): d is NonNullable<typeof d> => Boolean(d));

  return (
    <>
      <Nav />
      <main>
        <section className="site-section pb-0">
          <div className="site-container">
            <p className="site-eyebrow mb-3">{t("account.eyebrow")}</p>
            <h1 className="site-h2 max-w-2xl text-4xl md:text-5xl">{t("account.heading")}</h1>
            <p className="account-email">{user.email}</p>
          </div>
        </section>

        <section className="site-section">
          <div className="site-container account-grid">
            <div className="site-panel p-7">
              <p className="site-eyebrow mb-3">{t("account.saved")}</p>
              {wishlist.isLoading ? (
                <p className="site-ink-muted text-sm">{t("account.loadingShort")}</p>
              ) : savedDestinations.length === 0 ? (
                <>
                  <p className="site-ink-muted text-sm leading-relaxed">
                    {t("account.nothingSaved")}
                  </p>
                  <Link to="/destinations" className="btn-underline mt-4">
                    {t("account.browseDestinations")} <span className="arrow">&rarr;</span>
                  </Link>
                </>
              ) : (
                <>
                  <div className="collection-more">
                    {savedDestinations.map((d) => (
                      <Link
                        key={d.slug}
                        to="/destinations/$slug"
                        params={{ slug: d.slug }}
                        className="collection-chip"
                      >
                        <span aria-hidden="true">{d.flag}</span> {d.name}
                      </Link>
                    ))}
                  </div>
                  <Link to="/wishlist" className="btn-underline mt-4">
                    {t("account.openWishlist")} <span className="arrow">&rarr;</span>
                  </Link>
                </>
              )}
            </div>

            <div className="site-panel p-7">
              <p className="site-eyebrow mb-3">{t("account.referralLink")}</p>
              {referral.data ? (
                <>
                  <p className="site-ink-muted text-sm leading-relaxed">
                    {t("account.referralCopy")}
                  </p>
                  <p className="account-code">{referralLink}</p>
                  <div className="account-actions">
                    <button type="button" className="btn-framed" onClick={handleCopy}>
                      {copied ? t("share.copied") : t("share.copyLink")}
                    </button>
                    <Link to="/share" className="btn-underline">
                      {t("account.sharePage")} <span className="arrow">&rarr;</span>
                    </Link>
                  </div>
                  <p className="account-stat">
                    <strong>{referral.data.referralCount}</strong>{" "}
                    {new Intl.PluralRules(LOCALE_TAGS[locale]).select(referral.data.referralCount) === "one"
                      ? t("account.tailOne")
                      : t("account.tailMany")}
                  </p>
                </>
              ) : (
                <p className="site-ink-muted text-sm">{t("account.loadingShort")}</p>
              )}
            </div>

            <div className="site-panel p-7">
              <p className="site-eyebrow mb-3">{t("account.bookings")}</p>
              <p className="site-ink-muted text-sm leading-relaxed">
                {t("account.bookingsCopy")}
              </p>
              <Link to="/contact" className="btn-underline mt-4">
                {t("account.needHelp")} <span className="arrow">&rarr;</span>
              </Link>
            </div>

            <div className="site-panel p-7">
              <p className="site-eyebrow mb-3">{t("account.session")}</p>
              <p className="site-ink-muted text-sm leading-relaxed">
                {t("account.signedInAs", { email: user.email })}
              </p>
              <button
                type="button"
                className="btn-framed mt-4"
                onClick={handleSignOut}
                disabled={signingOut}
              >
                {signingOut ? t("account.signingOut") : t("nav.signOut")}
              </button>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
