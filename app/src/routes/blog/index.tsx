import { createFileRoute, Link } from "@tanstack/react-router";

import { Nav } from "@/components/site/Nav";
import { useReveal } from "@/hooks/use-reveal";
import { Footer } from "@/components/site/Footer";
import { getDestinationBySlug } from "@/data/destinations";
import { POSTS, PHOTO_SLUGS, TAG_CLASSES } from "@/data/blog-posts";
import { hasArticle } from "@/data/blog-articles";

export const Route = createFileRoute("/blog/")({
  head: () => ({
    meta: [
      { title: "Blog | Skynova Agency" },
      {
        name: "description",
        content:
          "Trip ideas, destination guides and booking tips from Skynova Agency -- flights, hotels, eSIM and more.",
      },
    ],
  }),
  component: BlogPage,
});

function BlogMedia({ destinationSlug, alt }: { destinationSlug: string; alt: string }) {
  const hasPhoto = PHOTO_SLUGS.has(destinationSlug);
  return (
    <div className="blog-media">
      {hasPhoto ? (
        <img src={`/assets/destinations/${destinationSlug}.webp`} alt={alt} loading="lazy" />
      ) : (
        <div className="card-media-placeholder">
          <span>✈️</span>
        </div>
      )}
      <div className="blog-media-overlay">
        <div className="blog-media-plus">+</div>
      </div>
      <span className="blog-corner blog-corner-tl" aria-hidden="true" />
      <span className="blog-corner blog-corner-tr" aria-hidden="true" />
      <span className="blog-corner blog-corner-bl" aria-hidden="true" />
      <span className="blog-corner blog-corner-br" aria-hidden="true" />
    </div>
  );
}

function BlogPage() {
  const gridRef = useReveal<HTMLDivElement>();
  const featured = POSTS.find((p) => p.slug === "kenya-safari-basics")!;
  const rest = POSTS.filter((p) => p.slug !== featured.slug);
  const featuredReadable = hasArticle(featured.slug);

  return (
    <>
      <Nav />
      <main>
        <section className="site-section pb-0">
          <div className="site-container">
            <span className="blog-badge">Blog</span>
            <h1 className="blog-heading">Trip ideas worth reading.</h1>
            <div className="blog-header-row">
              <p className="blog-subtitle">
                Destination guides, planning tips, and notes from the road -- each one links back to
                where you can start booking.
              </p>
              <Link to="/destinations" className="btn-blog-pill">
                View all destinations
              </Link>
            </div>
          </div>
        </section>

        <section className="site-section">
          <div className="site-container">
            <article className="blog-featured">
              {featuredReadable ? (
                <Link to="/blog/$slug" params={{ slug: featured.slug }} className="blog-media-link">
                  <BlogMedia destinationSlug={featured.destinationSlug} alt={featured.title} />
                </Link>
              ) : (
                <BlogMedia destinationSlug={featured.destinationSlug} alt={featured.title} />
              )}
              <div className="blog-featured-content">
                <span className="blog-featured-badge">Must read</span>
                <h2 className="blog-featured-title">
                  {featuredReadable ? (
                    <Link to="/blog/$slug" params={{ slug: featured.slug }} className="blog-title-link">
                      {featured.title}
                    </Link>
                  ) : (
                    featured.title
                  )}
                </h2>
                <p className="blog-featured-excerpt">{featured.excerpt}</p>
                {featuredReadable ? (
                  <Link to="/blog/$slug" params={{ slug: featured.slug }} className="btn-underline mt-4 self-start">
                    Read the guide <span className="arrow">&rarr;</span>
                  </Link>
                ) : null}
                <div className="blog-featured-footer">
                  <span className="blog-author">By Skynova Agency</span>
                  <span className={`blog-category-badge ${TAG_CLASSES[featured.tag] ?? ""}`}>
                    {featured.tag}
                  </span>
                </div>
              </div>
            </article>

            <div ref={gridRef} className="blog-grid">
              {rest.map((post) => {
                const destination = getDestinationBySlug(post.destinationSlug);
                // Only posts with a written article become links -- the rest
                // stay as plain cards rather than pointing at an empty page.
                const readable = hasArticle(post.slug);
                return (
                  <article key={post.slug}>
                    <div className="blog-card-media">
                      {readable ? (
                        <Link to="/blog/$slug" params={{ slug: post.slug }} className="blog-media-link">
                          <BlogMedia destinationSlug={post.destinationSlug} alt={post.title} />
                        </Link>
                      ) : (
                        <BlogMedia destinationSlug={post.destinationSlug} alt={post.title} />
                      )}
                    </div>
                    <div className="blog-card-title-row">
                      <h3 className="blog-card-title">
                        {readable ? (
                          <Link to="/blog/$slug" params={{ slug: post.slug }} className="blog-title-link">
                            {post.title}
                          </Link>
                        ) : (
                          post.title
                        )}
                      </h3>
                      <span className={`blog-category-badge blog-category-badge-shrink ${TAG_CLASSES[post.tag] ?? ""}`}>
                        {post.tag}
                      </span>
                    </div>
                    <p className="site-ink-muted mt-2 text-sm leading-relaxed">{post.excerpt}</p>
                    <div className="mt-3 flex items-center justify-between">
                      <span className="site-ink-muted text-xs">{post.readTime}</span>
                      {readable ? (
                        <Link to="/blog/$slug" params={{ slug: post.slug }} className="btn-underline">
                          Read article <span className="arrow">&rarr;</span>
                        </Link>
                      ) : destination ? (
                        <Link to="/destinations/$slug" params={{ slug: destination.slug }} className="btn-underline">
                          Explore {destination.name} <span className="arrow">&rarr;</span>
                        </Link>
                      ) : null}
                    </div>
                  </article>
                );
              })}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
