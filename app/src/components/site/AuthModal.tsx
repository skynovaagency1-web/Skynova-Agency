import { useEffect, useState, type FormEvent, type ReactNode } from "react";
import { X, Heart, Gift, Users, Sparkles, CreditCard, ShieldCheck, Plane } from "lucide-react";

import { useAuth } from "@/lib/auth-context";
import { signIn, signUp, requestPasswordReset } from "@/lib/api/auth.functions";
import { useT, type TKey } from "@/lib/i18n-strings";

const REFERRAL_STORAGE_KEY = "skynova_ref";

type Mode = "sign-in" | "sign-up" | "forgot";

/** The four-point star from the reference, drawn rather than imported: the
 *  icon set's closest equivalent has softer arms and reads as a sparkle
 *  effect instead of a mark. */
function StarMark() {
  return (
    <svg width="15" height="15" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
      <path d="M8 0c.5 4 3.5 7 8 8-4.5 1-7.5 4-8 8-.5-4-3.5-7-8-8 4.5-1 7.5-4 8-8Z" />
    </svg>
  );
}

type Perk = { icon: ReactNode; labelKey: TKey; featured?: boolean };

/** Two grouped lists, mirroring the reference's right-hand panel. The first
 *  group is what the account does; the second is what people actually
 *  hesitate over before typing an email in. Referrals carry the raised pill
 *  because they are the one thing here no other travel site offers. */
const ACCOUNT_PERKS: Perk[] = [
  { icon: <Heart size={16} />, labelKey: "auth.saveDestinations" },
  { icon: <Gift size={16} />, labelKey: "auth.giftTrip" },
  { icon: <Users size={16} />, labelKey: "auth.earnReferrals", featured: true },
];

const REASSURANCE: Perk[] = [
  { icon: <Sparkles size={16} />, labelKey: "auth.freeToJoin" },
  { icon: <CreditCard size={16} />, labelKey: "auth.noCard" },
  { icon: <ShieldCheck size={16} />, labelKey: "auth.neverResell" },
];

function PerkRow({ perk }: { perk: Perk }) {
  const t = useT();
  return (
    <div className={`auth-modal-perk${perk.featured ? " is-featured" : ""}`}>
      {perk.icon}
      <span>{t(perk.labelKey)}</span>
      {perk.featured ? <span className="auth-modal-perk-dot" aria-hidden="true" /> : null}
    </div>
  );
}

// Custom-styled, not a platform Quanta component -- this is a `type:
// "website"` build with its own independent brand, and per the platform's
// own auth.md this is in-app auth (Skynova's own customer accounts), not
// Higgsfield's /__auth/login. Opened from the nav's "Log in / Sign up" and
// from any WishlistButton click while signed out.
//
// Three surfaces after a layered-panel reference: a photo rail floating
// clear of the card, the form on white, and the perks recessed onto cream.
// The reference also had no equivalent of "Continue with Google"; neither
// does this, and deliberately so -- authentication here is email and
// password against D1, and a button that looks like sign-in but does
// nothing is worse than no button.
export function AuthModal() {
  const { authModalOpen, authModalMode, closeAuthModal, refetchUser } = useAuth();
  const [mode, setMode] = useState<Mode>(authModalMode);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [resetSent, setResetSent] = useState(false);
  const t = useT();

  useEffect(() => {
    if (authModalOpen) {
      setMode(authModalMode);
      setEmail("");
      setPassword("");
      setError(null);
      setResetSent(false);
    }
  }, [authModalOpen, authModalMode]);

  useEffect(() => {
    if (!authModalOpen) return;
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") closeAuthModal();
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [authModalOpen, closeAuthModal]);

  if (!authModalOpen) return null;

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      if (mode === "forgot") {
        await requestPasswordReset({ data: { email } });
        setResetSent(true);
      } else if (mode === "sign-up") {
        const referralCode = sessionStorage.getItem(REFERRAL_STORAGE_KEY) ?? undefined;
        await signUp({ data: { email, password, referralCode } });
        await refetchUser();
        closeAuthModal();
      } else {
        await signIn({ data: { email, password } });
        await refetchUser();
        closeAuthModal();
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : t("auth.genericError"));
    } finally {
      setSubmitting(false);
    }
  }

  function switchMode(next: Mode) {
    setMode(next);
    setError(null);
    setResetSent(false);
  }

  return (
    <div className="auth-modal-backdrop" role="dialog" aria-modal="true" onClick={closeAuthModal}>
      <div className="auth-modal-stack" onClick={(e) => e.stopPropagation()}>
        <aside className="auth-modal-rail" aria-hidden="true">
          <img src="/assets/destinations/french-polynesia.webp" alt="" className="auth-modal-rail-media" />
          <span className="auth-modal-rail-veil" />
          <img src="/assets/brand/monogram-light.webp" alt="" className="auth-modal-rail-mark" />
          <span className="auth-modal-rail-thread">
            <i />
          </span>
          <Plane size={16} className="auth-modal-rail-glyph" />
        </aside>

        <div className="auth-modal-panel">
          <button type="button" className="auth-modal-close" onClick={closeAuthModal} aria-label={t("auth.close")}>
            <X size={16} />
          </button>

          <div className="auth-modal-side">
            <p className="auth-modal-brand">
              <StarMark />
              <span>Skynova Agency</span>
            </p>

            {mode === "forgot" ? (
              <>
                <h2 className="auth-modal-title">{t("auth.resetTitle")}</h2>
                {resetSent ? (
                  <p className="text-sm leading-relaxed">
                    {t("auth.resetSent")}
                  </p>
                ) : (
                  <form className="auth-modal-form" onSubmit={handleSubmit}>
                    <p className="site-ink-muted text-sm leading-relaxed">
                      {t("auth.resetIntro")}
                    </p>
                    <label className="auth-modal-field">
                      <span>{t("auth.email")}</span>
                      <input
                        type="email"
                        required
                        autoComplete="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                      />
                    </label>
                    {error ? <p className="auth-modal-error">{error}</p> : null}
                    <button type="submit" className="btn-hero-pill w-full justify-center" disabled={submitting}>
                      <span className="spark" />
                      <span>{submitting ? t("auth.pleaseWait") : t("auth.sendRequest")}</span>
                    </button>
                  </form>
                )}
                <button type="button" className="auth-modal-back" onClick={() => switchMode("sign-in")}>
                  &larr; {t("auth.backToSignIn")}
                </button>
              </>
            ) : (
              <>
                <div className="auth-modal-tabs">
                  <button
                    type="button"
                    className={`auth-modal-tab${mode === "sign-in" ? " is-active" : ""}`}
                    onClick={() => switchMode("sign-in")}
                  >
                    {t("auth.signIn")}
                  </button>
                  <button
                    type="button"
                    className={`auth-modal-tab${mode === "sign-up" ? " is-active" : ""}`}
                    onClick={() => switchMode("sign-up")}
                  >
                    {t("auth.signUp")}
                  </button>
                </div>
                <h2 className="auth-modal-title">
                  {mode === "sign-in" ? t("auth.welcomeBack") : t("auth.saveTrips")}
                </h2>
                {mode === "sign-up" ? (
                  <div className="auth-modal-chips">
                    <span className="auth-modal-chip">{t("auth.freeToJoin")}</span>
                    <span className="auth-modal-chip">{t("auth.noCard")}</span>
                    <span className="auth-modal-chip">{t("auth.earnReferrals")}</span>
                  </div>
                ) : null}
                <form className="auth-modal-form" onSubmit={handleSubmit}>
                  <label className="auth-modal-field">
                    <span>{t("auth.email")}</span>
                    <input
                      type="email"
                      required
                      autoComplete="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </label>
                  <label className="auth-modal-field">
                    <span>{t("auth.password")}</span>
                    <input
                      type="password"
                      required
                      minLength={8}
                      autoComplete={mode === "sign-in" ? "current-password" : "new-password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                  </label>
                  {mode === "sign-in" ? (
                    <button type="button" className="auth-modal-forgot" onClick={() => switchMode("forgot")}>
                      {t("auth.forgotPassword")}
                    </button>
                  ) : null}
                  {error ? <p className="auth-modal-error">{error}</p> : null}
                  <button type="submit" className="btn-hero-pill w-full justify-center" disabled={submitting}>
                    <span className="spark" />
                    <span>
                      {submitting ? t("auth.pleaseWait") : mode === "sign-in" ? t("auth.signIn") : t("auth.createAccount")}
                    </span>
                  </button>
                  {mode === "sign-up" ? (
                    <p className="auth-modal-fineprint">
                      {t("auth.fineprintBefore")}
                      <a href="/terms" target="_blank" rel="noopener noreferrer">
                        {t("footer.terms")}
                      </a>
                      {t("auth.fineprintAnd")}
                      <a href="/privacy" target="_blank" rel="noopener noreferrer">
                        {t("footer.privacy")}
                      </a>
                      .
                    </p>
                  ) : null}
                </form>
              </>
            )}
          </div>

          <aside className="auth-modal-perks">
            <p className="auth-modal-perks-label">{t("auth.withAccount")}</p>
            {ACCOUNT_PERKS.map((perk) => (
              <PerkRow key={perk.labelKey} perk={perk} />
            ))}
            <div className="auth-modal-perks-rule" />
            <p className="auth-modal-perks-label">{t("auth.goodToKnow")}</p>
            {REASSURANCE.map((perk) => (
              <PerkRow key={perk.labelKey} perk={perk} />
            ))}
          </aside>
        </div>
      </div>
    </div>
  );
}
