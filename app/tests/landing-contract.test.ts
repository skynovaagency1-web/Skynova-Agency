import { describe, expect, test } from "bun:test";
import { readFileSync } from "node:fs";
import { landingContentSchema } from "@higgsfield/app-landing";
import { landingContent } from "../src/landing-content";

describe("scroll-scrub website landing contract", () => {
  test("uses a safe full-app route preview", () => {
    expect(() => landingContentSchema.parse(landingContent)).not.toThrow();
    expect(landingContent.preview).toMatchObject({
      kind: "route",
      src: "/app?preview=1",
      openHref: "/app",
    });
    expect(landingContent.steps.items).toHaveLength(3);
    expect(landingContent.steps.items.map((item) => item.preview.kind)).toEqual([
      "instruction",
      "action",
      "result",
    ]);
    expect(landingContent.features.items).toHaveLength(3);
  });

  test("keeps public landing and full app routes separate", () => {
    const landingRoute = readFileSync(new URL("../src/routes/index.tsx", import.meta.url), "utf8");
    const appRoute = readFileSync(new URL("../src/routes/app.tsx", import.meta.url), "utf8");

    // "/" is the Skynova travel homepage -- currently the scroll fly-in hero
    // (components/site/HeroScroll.tsx), which replaced the scroll-scrubbed
    // Hero (components/site/Hero.tsx, still in the tree as the alternate) --
    // and must never pull in the app workspace. The template's check named a
    // component the rebuilt homepage no longer has, so it guarded nothing;
    // these guard the split the test is actually about.
    //
    // This line names whichever component is the homepage's hero, so it has
    // to move whenever the hero does. It has now gone stale twice for that
    // reason: once when the template's name was left behind, and once when
    // the hero was swapped without this suite being run.
    expect(landingRoute).toContain("<HeroScroll />");
    expect(landingRoute).not.toContain("PromptBox");
    expect(landingRoute).not.toContain("UserGenerations");
    expect(appRoute).toContain('createFileRoute("/app")');
    expect(appRoute).toContain("previewMode");
  });

  test("ships the canonical generations workspace recipe", () => {
    const layout = readFileSync(new URL("../src/layouts/custom.tsx", import.meta.url), "utf8");

    expect(layout).toContain('id: "generations"');
    expect(layout).toContain('mode="generations"');
    expect(layout).toContain("<UserGenerations demo");
    expect(layout).toContain("<PromptBox.Root");
  });
});
