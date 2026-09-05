import { useEffect, useState, type FormEvent, type ReactNode } from "react";
import { X, Heart, Gift, Users, Sparkles, CreditCard, ShieldCheck, Plane } from "lucide-react";

import { useAuth } from "@/lib/auth-context";
import { signIn, signUp, requestPasswordReset } from "@/lib/api/auth.functions";

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

type Perk = { icon: ReactNode; label: string; featured?: boolean };

/** Two grouped lists, mirroring the reference's right-hand panel. The first
 *  group is what the account does; the second is what people actually
 *  hesitate over before typing an email in. Referrals carry the raised pill
 *  because they are the one thing here no other travel site offers. */
const ACCOUNT_PERKS: Perk[] = [
  { icon: <Heart size={16} />, label: "Save destinations" },
  { icon: <Gift size={16} />, label: "Send a trip as a gift" },
  { icon: <Users size={16} />, label: "Earn on referrals", featured: true },
];

const REASSURANCE: Perk[] = [
  { icon: <Sparkles size={16} />, label: "Free to join" },
  { icon: <CreditCard size={16} />, label: "No card needed" },
  { icon: <ShieldCheck size={16} />, label: "We never resell your email" },
];

function PerkRow({ perk }: { perk: Perk }) {
  return (
    <div className={`auth-modal-perk${perk.featured ? " is-featured" : ""}`}>
      {perk.icon}
      <span>{perk.label}</span>
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
      setError(err instanceof Error ? err.message : "Something went wrong. Try again.");
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
          <button type="button" className="auth-modal-close" onClick={closeAuthModal} aria-label="Close">
            <X size={16} />
          </button>

          <div className="auth-modal-side">
            <p className="auth-modal-brand">
              <StarMark />
              <span>Skynova Agency</span>
            </p>

            {mode === "forgot" ? (
              <>
                <h2 className="auth-modal-title">Reset your password.</h2>
                {resetSent ? (
                  <p className="text-sm leading-relaxed">
                    If that email has a Skynova account, we've got your request -- we'll be in touch to help you
                    back in.
                  </p>
                ) : (
                  <form className="auth-modal-form" onSubmit={handleSubmit}>
                    <p className="site-ink-muted text-sm leading-relaxed">
                      Enter the email on your account and we'll follow up to help you reset your password.
                    </p>
                    <label className="auth-modal-field">
                      <span>Email</span>
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
                      <span>{submitting ? "Please wait..." : "Send request"}</span>
                    </button>
                  </form>
                )}
                <button type="button" className="auth-modal-back" onClick={() => switchMode("sign-in")}>
                  &larr; Back to sign in
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
                    Sign in
                  </button>
                  <button
                    type="button"
                    className={`auth-modal-tab${mode === "sign-up" ? " is-active" : ""}`}
                    onClick={() => switchMode("sign-up")}
                  >
                    Sign up
                  </button>
                </div>
                <h2 className="auth-modal-title">
                  {mode === "sign-in" ? "Welcome back." : "Save trips, get rewards."}
                </h2>
                {mode === "sign-up" ? (
                  <div className="auth-modal-chips">
                    <span className="auth-modal-chip">Free to join</span>
                    <span className="auth-modal-chip">No card needed</span>
                    <span className="auth-modal-chip">Earn on referrals</span>
                  </div>
                ) : null}
                <form className="auth-modal-form" onSubmit={handleSubmit}>
                  <label className="auth-modal-field">
                    <span>Email</span>
                    <input
                      type="email"
                      required
                      autoComplete="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </label>
                  <label className="auth-modal-field">
                    <span>Password</span>
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
                      Forgot password?
                    </button>
                  ) : null}
                  {error ? <p className="auth-modal-error">{error}</p> : null}
                  <button type="submit" className="btn-hero-pill w-full justify-center" disabled={submitting}>
                    <span className="spark" />
                    <span>
                      {submitting ? "Please wait..." : mode === "sign-in" ? "Sign in" : "Create account"}
                    </span>
                  </button>
                  {mode === "sign-up" ? (
                    <p className="auth-modal-fineprint">
                      By creating an account you agree to our{" "}
                      <a href="/terms" target="_blank" rel="noopener noreferrer">
                        Terms of Use
                      </a>{" "}
                      and{" "}
                      <a href="/privacy" target="_blank" rel="noopener noreferrer">
                        Privacy Policy
                      </a>
                      .
                    </p>
                  ) : null}
                </form>
              </>
            )}
          </div>

          <aside className="auth-modal-perks">
            <p className="auth-modal-perks-label">With an account</p>
            {ACCOUNT_PERKS.map((perk) => (
              <PerkRow key={perk.label} perk={perk} />
            ))}
            <div className="auth-modal-perks-rule" />
            <p className="auth-modal-perks-label">Good to know</p>
            {REASSURANCE.map((perk) => (
              <PerkRow key={perk.label} perk={perk} />
            ))}
          </aside>
        </div>
      </div>
    </div>
  );
}
