import { createFileRoute, Link, notFound } from "@tanstack/react-router";

import { Nav } from "@/components/site/Nav";
import { Footer } from "@/components/site/Footer";
import { Newsletter } from "@/components/site/Newsletter";
import { getPostBySlug, POSTS, PHOTO_SLUGS, TAG_CLASSES } from "@/data/blog-posts";
import { getArticle, hasArticle, type Block } from "@/data/blog-articles";
import { getDestinationBySlug } from "@/data/destinations";
import {
  flightsLink,
  hotelsLink,
  carRentalLink,
  toursLink,
  eventsLink,
  esimLink,
  airportServicesLink,
  bikeRentalLink,
} from "@/lib/affiliate";

export const Route = createFileRoute("/blog/$slug")({
  loader: ({ params }) => {
    const post = getPostBySlug(params.slug);
    const article = getArticle(params.slug);
    // A post card without a written article must not resolve -- otherwise
    // we would serve an empty page and the sitemap would advertise it.
    if (!post || !article) throw notFound();
    return { post, article };
  },
  head: ({ loaderData }) =>
    loaderData
      ? {
          meta: [
            { title: `${loaderData.post.title} | Skynova Agency` },
            { name: "description", content: loaderData.article.dek },
            { property: "og:title", content: loaderData.post.title },
            { property: "og:description", content: loaderData.article.dek },
            { property: "og:type", content: "article" },
            { name: "twitter:card", content: "summary_large_image" },
          ],
        }
      : {},
  component: ArticlePage,
});

/** Minimal inline emphasis: **bold** only. The article source is ours, so a
 * full markdown parser would be weight we never use -- but hand-writing
 * <strong> into the data would stop it being plain text for other renderers. */
function RichText({ text }: { text: string }) {
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return (
    <>
      {parts.map((part, i) =>
        part.startsWith("**") && part.endsWith("**") && part.length > 4 ? (
          <strong key={i}>{part.slice(2, -2)}</strong>
        ) : (
          part
        ),
      )}
    </>
  );
}

function ctaHref(block: Extract<Block, { kind: "cta" }>): string {
  switch (block.link) {
    case "flights":
      return flightsLink();
    case "hotels":
      return hotelsLink(block.destination);
    case "cars":
      return carRentalLink();
    case "tours":
      return toursLink(block.destination);
    case "esim":
      return esimLink(block.destination);
    case "events":
      return eventsLink();
    case "airport":
      return airportServicesLink();
    case "bikes":
      return bikeRentalLink(block.destination);
  }
}

function ArticleBlock({ block }: { block: Block }) {
  switch (block.kind) {
    case "h2":
      return <h2 className="article-h2">{block.text}</h2>;
    case "para":
      return (
        <p className="article-para">
          <RichText text={block.text} />
        </p>
      );
    case "list":
      return (
        <ul className="article-list">
          {block.items.map((item, i) => (
            <li key={i}>
              <RichText text={item} />
            </li>
          ))}
        </ul>
      );
    case "callout":
      return (
        <aside className="article-callout">
          <p className="article-callout-title">{block.title}</p>
          <p className="article-callout-body">
            <RichText text={block.text} />
          </p>
        </aside>
      );
    case "cta":
      return (
        <div className="article-cta">
          <div className="article-cta-text">
            <p className="article-cta-label">{block.label}</p>
            <p className="article-cta-note">{block.note}</p>
          </div>
          <a
            href={ctaHref(block)}
            target="_blank"
            rel="noopener noreferrer sponsored"
            className="btn-hero-pill article-cta-btn"
          >
            <span className="spark" />
            <span>{block.label}</span>
          </a>
        </div>
      );
  }
}

function ArticlePage() {
  const { post, article } = Route.useLoaderData();
  const destination = getDestinationBySlug(post.destinationSlug);
  const hasPhoto = PHOTO_SLUGS.has(post.destinationSlug);

  const related = article.related
    .map((slug) => POSTS.find((p) => p.slug === slug))
    .filter((p): p is NonNullable<typeof p> => Boolean(p));

  const published = new Date(article.published);
  const publishedLabel = published.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: article.dek,
    datePublished: article.published,
    dateModified: article.updated ?? article.published,
    author: { "@type": "Organization", name: "Skynova Agency" },
    publisher: { "@type": "Organization", name: "Skynova Agency" },
    articleSection: post.tag,
  };

  return (
    <>
      <Nav />
      <main>
        <article>
          <header className="article-hero">
            {hasPhoto ? (
              <img
                src={`/assets/destinations/${post.destinationSlug}.webp`}
                alt=""
                aria-hidden="true"
                className="article-hero-media"
                fetchPriority="high"
              />
            ) : (
              <div className="article-hero-media article-hero-fallback" aria-hidden="true" />
            )}
            <div className="article-hero-mask" />
            <div className="article-hero-copy">
              <div className="site-container">
                <Link to="/blog" className="article-back">
                  <span className="arrow">&larr;</span> All articles
                </Link>
                <span className={`blog-category-badge ${TAG_CLASSES[post.tag] ?? ""}`}>{post.tag}</span>
                <h1 className="article-title">{post.title}</h1>
                <p className="article-dek">{article.dek}</p>
                <div className="article-meta">
                  <span>By Skynova Agency</span>
                  <span aria-hidden="true">·</span>
                  <time dateTime={article.published}>{publishedLabel}</time>
                  <span aria-hidden="true">·</span>
                  <span>{post.readTime}</span>
                </div>
              </div>
            </div>
          </header>

          <div className="site-container">
            <div className="article-body">
              {article.blocks.map((block, i) => (
                <ArticleBlock key={i} block={block} />
              ))}

              <p className="article-disclosure">
                Skynova Agency runs on the Travelpayouts affiliate network -- booking links may earn a
                commission at no extra cost to you.
              </p>

              {destination ? (
                <div className="article-dest-link">
                  <p className="site-eyebrow mb-2">Start planning</p>
                  <Link
                    to="/destinations/$slug"
                    params={{ slug: destination.slug }}
                    className="btn-underline"
                  >
                    {destination.flag} Explore {destination.name} <span className="arrow">&rarr;</span>
                  </Link>
                </div>
              ) : null}
            </div>
          </div>

          {related.length > 0 && (
            <section className="site-section">
              <div className="site-container">
                <p className="site-eyebrow mb-5">Keep reading</p>
                <div className="article-related">
                  {related.map((r) => {
                    const readable = hasArticle(r.slug);
                    return (
                      <div key={r.slug} className="site-panel article-related-card">
                        <span className={`blog-category-badge blog-category-badge-shrink ${TAG_CLASSES[r.tag] ?? ""}`}>
                          {r.tag}
                        </span>
                        <h3 className="article-related-title">
                          {readable ? (
                            <Link to="/blog/$slug" params={{ slug: r.slug }} className="blog-title-link">
                              {r.title}
                            </Link>
                          ) : (
                            r.title
                          )}
                        </h3>
                        <p className="site-ink-muted mt-2 text-sm leading-relaxed">{r.excerpt}</p>
                        <span className="site-ink-muted mt-3 block text-xs">{r.readTime}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </section>
          )}
        </article>

        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      </main>
      <Newsletter />
      <Footer />
    </>
  );
}
