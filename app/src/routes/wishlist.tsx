import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";

import { Nav } from "@/components/site/Nav";
import { Footer } from "@/components/site/Footer";
import { WishlistButton } from "@/components/site/WishlistButton";
import { useAuth } from "@/lib/auth-context";
import { getWishlist } from "@/lib/api/wishlist.functions";
import { getDestinationBySlug } from "@/data/destinations";

export const Route = createFileRoute("/wishlist")({
  head: () => ({
    meta: [
      { title: "Wishlist | Skynova Agency" },
      { name: "description", content: "Destinations you've saved for your next trip." },
      // Personalised, and empty for anyone not signed in -- indexing it adds a
      // thin page and leaks nothing useful into results. Same call as /account.
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: WishlistPage,
});

function WishlistPage() {
  const { user, isLoading: userLoading, openAuthModal } = useAuth();
  const { data: items, isLoading: wishlistLoading } = useQuery({
    queryKey: ["wishlist"],
    queryFn: () => getWishlist(),
    enabled: Boolean(user),
  });

  const destinations = (items ?? [])
    .filter((i) => i.itemType === "destination")
    .map((i) => getDestinationBySlug(i.itemSlug))
    .filter((d): d is NonNullable<typeof d> => Boolean(d));

  return (
    <>
      <Nav />
      <main>
        <section className="site-section">
          <div className="site-container">
            <p className="site-eyebrow mb-3">Wishlist</p>
            <h1 className="site-h2 max-w-2xl text-4xl md:text-6xl">Trips you're dreaming about.</h1>
            <p className="site-ink-muted mt-4 max-w-lg text-base leading-relaxed">
              Save any destination with the heart icon and find it here later.
            </p>
          </div>
        </section>

        <section className="site-section pt-0">
          <div className="site-container">
            {!userLoading && !user ? (
              <div className="site-panel flex flex-col items-start gap-4 p-8">
                <p className="text-base leading-relaxed">Sign in to see and manage your saved destinations.</p>
                <button type="button" className="btn-hero-pill" onClick={() => openAuthModal("sign-in")}>
                  <span>Sign in</span>
                </button>
              </div>
            ) : null}

            {user && wishlistLoading ? <p className="site-ink-muted">Loading your wishlist...</p> : null}

            {user && !wishlistLoading && destinations.length === 0 ? (
              <div className="site-panel p-8">
                <p className="text-base leading-relaxed">
                  Nothing saved yet -- browse{" "}
                  <Link to="/destinations" className="btn-underline">
                    destinations
                  </Link>{" "}
                  and tap the heart on any that catch your eye.
                </p>
              </div>
            ) : null}

            {destinations.length > 0 ? (
              <div className="grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-4">
                {destinations.map((d) => (
                  <div key={d.slug} className="relative">
                    <Link to="/destinations/$slug" params={{ slug: d.slug }} className="dest-mini-card">
                      <p className="dest-card-flag">{d.flag}</p>
                      <p className="mt-2 font-semibold">{d.name}</p>
                    </Link>
                    <WishlistButton itemType="destination" itemSlug={d.slug} variant="overlay" />
                  </div>
                ))}
              </div>
            ) : null}
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
