import { Link } from "@tanstack/react-router";

import { breadcrumbJsonLd, jsonLd, type Crumb } from "@/lib/seo";

/**
 * Visible breadcrumb trail plus its BreadcrumbList markup.
 *
 * Both halves come from ONE array, deliberately. Breadcrumb rich results are
 * checked against the page: markup describing a trail the visitor cannot see
 * is the classic way this feature gets ignored, or flagged. Emitting them from
 * a single source means they cannot drift apart later.
 *
 * `aria-current="page"` on the last crumb, and it is plain text rather than a
 * link to the page you are already on.
 */
export function Breadcrumbs({ trail }: { trail: Crumb[] }) {
  if (trail.length === 0) return null;
  const last = trail.length - 1;

  return (
    <nav className="crumbs" aria-label="Breadcrumb">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLd(breadcrumbJsonLd(trail)) }}
      />
      <ol className="crumbs-list">
        {trail.map((crumb, i) => (
          <li key={crumb.name} className="crumbs-item">
            {i === last || !crumb.path ? (
              <span className="crumbs-current" aria-current={i === last ? "page" : undefined}>
                {crumb.name}
              </span>
            ) : (
              <Link to={crumb.path} className="crumbs-link">
                {crumb.name}
              </Link>
            )}
            {i < last ? (
              <span className="crumbs-sep" aria-hidden="true">
                /
              </span>
            ) : null}
          </li>
        ))}
      </ol>
    </nav>
  );
}
