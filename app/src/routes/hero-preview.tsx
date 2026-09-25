import { createFileRoute } from "@tanstack/react-router";

import { Nav } from "@/components/site/Nav";
import { Footer } from "@/components/site/Footer";
import { ShaderHero } from "@/components/site/ShaderHero";

/** Preview only -- not linked, not in the sitemap, noindex. Delete with
 *  components/site/ShaderHero.tsx if the shader hero is not adopted. */
export const Route = createFileRoute("/hero-preview")({
  head: () => ({ meta: [{ title: "Hero preview" }, { name: "robots", content: "noindex, nofollow" }] }),
  component: () => (
    <>
      <Nav />
      <main>
        <ShaderHero />
        <section className="site-section">
          <div className="site-container">
            <p className="site-ink-muted text-sm">Content below the hero, for scroll context.</p>
          </div>
        </section>
      </main>
      <Footer />
    </>
  ),
});
