import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { Share2 } from "lucide-react";

import { Nav } from "@/components/site/Nav";
import { Footer } from "@/components/site/Footer";
import { useAuth } from "@/lib/auth-context";
import { getReferralStats } from "@/lib/api/referral.functions";

export const Route = createFileRoute("/share")({
  head: () => ({
    meta: [
      { title: "Share Skynova | Skynova Agency" },
      { name: "description", content: "Share your Skynova link and see how many friends have joined through it." },
    ],
  }),
  component: SharePage,
});

function SharePage() {
  const { user, isLoading: userLoading, openAuthModal } = useAuth();
  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ["referral-stats"],
    queryFn: () => getReferralStats(),
    enabled: Boolean(user),
  });
  const [copied, setCopied] = useState(false);

  const referralLink = stats ? `${typeof window !== "undefined" ? window.location.origin : ""}/?ref=${stats.referralCode}` : "";

  async function handleCopy() {
    if (!referralLink) return;
    await navigator.clipboard.writeText(referralLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  async function handleShare() {
    if (!referralLink) return;
    if (navigator.share) {
      try {
        await navigator.share({ title: "Skynova Agency", url: referralLink });
      } catch {
        // User dismissed the native share sheet -- nothing to do.
      }
    } else {
      await handleCopy();
    }
  }

  return (
    <>
      <Nav />
      <main>
        <section className="site-section">
          <div className="site-container">
            <p className="site-eyebrow mb-3">Share Skynova</p>
            <h1 className="site-h2 max-w-2xl text-4xl md:text-6xl">Send Skynova to a friend.</h1>
            <p className="site-ink-muted mt-4 max-w-lg text-base leading-relaxed">
              Share your link -- when someone signs up through it, it counts here.
            </p>
          </div>
        </section>

        <section className="site-section pt-0">
          <div className="site-container max-w-lg">
            {!userLoading && !user ? (
              <div className="site-panel flex flex-col items-start gap-4 p-8">
                <p className="text-base leading-relaxed">Sign in to get your personal share link.</p>
                <button type="button" className="btn-hero-pill" onClick={() => openAuthModal("sign-in")}>
                  <span>Sign in</span>
                </button>
              </div>
            ) : null}

            {user && statsLoading ? <p className="site-ink-muted">Loading...</p> : null}

            {user && stats ? (
              <div className="site-panel flex flex-col gap-5 p-8">
                <div>
                  <p className="site-eyebrow mb-2">Your link</p>
                  <p className="break-all font-mono text-sm">{referralLink}</p>
                </div>
                <div className="flex flex-wrap gap-3">
                  <button type="button" className="btn-framed" onClick={handleCopy}>
                    {copied ? "Copied" : "Copy link"}
                  </button>
                  <button type="button" className="btn-hero-pill" onClick={handleShare}>
                    <Share2 size={16} />
                    <span>Share</span>
                  </button>
                </div>
                <p className="text-sm">
                  <strong className="text-base">{stats.referralCount}</strong>{" "}
                  <span className="site-ink-muted">
                    {stats.referralCount === 1 ? "friend has" : "friends have"} signed up through your link.
                  </span>
                </p>
              </div>
            ) : null}
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
