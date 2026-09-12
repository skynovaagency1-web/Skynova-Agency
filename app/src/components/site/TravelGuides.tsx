import { Link } from "@tanstack/react-router";

import { getPostBySlug, PHOTO_SLUGS } from "@/data/blog-posts";

// Pulls specific real posts from the shared blog dataset (data/blog-posts.ts)
// by slug rather than duplicating content -- each of these also exists on
// /blog, this is just a vertical-relevant teaser of them.
export function TravelGuidesSection({
  eyebrow = "Travel guides",
  heading,
  slugs,
}: {
  eyebrow?: string;
  heading: string;
  slugs: string[];
}) {
  const posts = slugs.map((slug) => getPostBySlug(slug)).filter((p): p is NonNullable<typeof p> => Boolean(p));
  if (posts.length === 0) return null;

  return (
    <section className="site-section pt-0">
      <div className="site-container">
        <p className="site-eyebrow mb-3">{eyebrow}</p>
        <h2 className="site-h2 max-w-md text-3xl md:text-4xl">{heading}</h2>
        <div className="mt-8 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-3">
          {posts.map((post) => (
            <Link key={post.slug} to="/blog" className="route-card">
              <div className="route-card-media">
                {PHOTO_SLUGS.has(post.destinationSlug) ? (
                  <img src={`/assets/destinations/${post.destinationSlug}.webp`} alt={post.title} loading="lazy" />
                ) : (
                  <div className="card-media-placeholder">
                    <span>✈️</span>
                  </div>
                )}
              </div>
              <div className="route-card-copy">
                <span className="route-card-path route-card-path-stack">
                  {post.title}
                  <span className="site-ink-muted mt-1 block text-xs font-normal normal-case">
                    {post.tag} &middot; {post.readTime}
                  </span>
                </span>
                <span className="route-card-cta">
                  Read <span className="arrow">&rarr;</span>
                </span>
              </div>
            </Link>
          ))}
        </div>
        <Link to="/blog" className="btn-underline mt-6">
          More travel guides <span className="arrow">&rarr;</span>
        </Link>
      </div>
    </section>
  );
}
