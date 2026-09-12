import { createFileRoute, Link, notFound } from "@tanstack/react-router";

import { Nav } from "@/components/site/Nav";
import { Footer } from "@/components/site/Footer";
import { Newsletter } from "@/components/site/Newsletter";
import { getPostBySlug, POSTS, PHOTO_SLUGS, TAG_CLASSES } from "@/data/blog-posts";
import { getArticle, hasArticle, type Block } from "@/data/blog-articles";
import { getDestinationBySlug } from "@/data/destinations";
import { absUrl, breadcrumbJsonLd, jsonLd } from "@/lib/seo";
import { useT, useLocale } from "@/lib/i18n-strings";
import { LOCALE_TAGS } from "@/lib/i18n";
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
  const t = useT();
  const locale = useLocale();
  const { post, article } = Route.useLoaderData();
  const destination = getDestinationBySlug(post.destinationSlug);
  const hasPhoto = PHOTO_SLUGS.has(post.destinationSlug);

  const related = article.related
    .map((slug) => POSTS.find((p) => p.slug === slug))
    .filter((p): p is NonNullable<typeof p> => Boolean(p));

  const published = new Date(article.published);
  const publishedLabel = published.toLocaleDateString(LOCALE_TAGS[locale], {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  // Where it lives, what it shows, and where it sits in the site. The image
  // is the same destination photo the article's header uses, and only when
  // there is one -- markup must not point at an image the page doesn't show.
  const articleUrl = absUrl(`/blog/${post.slug}`);
  const articleLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: article.dek,
    datePublished: article.published,
    dateModified: article.updated ?? article.published,
    url: articleUrl,
    mainEntityOfPage: { "@type": "WebPage", "@id": articleUrl },
    inLanguage: LOCALE_TAGS[locale],
    ...(hasPhoto ? { image: absUrl(`/assets/destinations/${post.destinationSlug}.webp`) } : {}),
    author: { "@type": "Organization", name: "Skynova Agency" },
    publisher: { "@type": "Organization", name: "Skynova Agency", logo: { "@type": "ImageObject", url: absUrl("/assets/brand/apple-touch-icon.png") } },
    articleSection: post.tag,
  };
  // Through the shared helper rather than JSON.stringify: it escapes "<", so
  // no article text can ever close the <script> tag early.
  const structuredData = jsonLd([
    articleLd,
    breadcrumbJsonLd([
      { name: t("nav.home"), path: "/" },
      { name: t("nav.blog"), path: "/blog" },
      { name: post.title },
    ]),
  ]);

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
                  <span className="arrow">&larr;</span> {t("blog.allArticles")}
                </Link>
                <span className={`blog-category-badge ${TAG_CLASSES[post.tag] ?? ""}`}>{post.tag}</span>
                <h1 className="article-title">{post.title}</h1>
                <p className="article-dek">{article.dek}</p>
                <div className="article-meta">
                  <span>{t("blog.author")}</span>
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
                {t("footer.affiliate")}
              </p>

              {destination ? (
                <div className="article-dest-link">
                  <p className="site-eyebrow mb-2">{t("blog.startPlanning")}</p>
                  <Link
                    to="/destinations/$slug"
                    params={{ slug: destination.slug }}
                    className="btn-underline"
                  >
                    {destination.flag} {t("blog.explore", { name: destination.name })}{" "}
                    <span className="arrow">&rarr;</span>
                  </Link>
                </div>
              ) : null}
            </div>
          </div>

          {related.length > 0 && (
            <section className="site-section">
              <div className="site-container">
                <p className="site-eyebrow mb-5">{t("blog.keepReading")}</p>
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

        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: structuredData }} />
      </main>
      <Newsletter />
      <Footer />
    </>
  );
}
