import { createFileRoute } from "@tanstack/react-router";

import { VerticalPage } from "@/components/site/VerticalPage";
import { EsimCountriesSection } from "@/components/site/EsimCountries";
import { TravelGuidesSection } from "@/components/site/TravelGuides";
import { esimLink } from "@/lib/affiliate";

const HOW_STEPS = [
  { n: "01", title: "Choose a plan", detail: "Pick your country or region and a data allowance that fits the trip." },
  { n: "02", title: "Install the eSIM", detail: "Scan a QR code -- no store, no waiting, no physical SIM tray." },
  { n: "03", title: "Travel connected", detail: "Data activates on arrival; your home number stays free for calls." },
];

const COMPATIBLE_DEVICES = [
  { title: "iPhone", body: "XS and every model since, including the current lineup." },
  { title: "Samsung Galaxy", body: "S20 and newer, plus recent Galaxy Z Fold and Flip models." },
  { title: "Google Pixel", body: "Pixel 3 and every model since supports eSIM out of the box." },
];

export const Route = createFileRoute("/esim")({
  head: () => ({
    meta: [
      { title: "SIM & eSIM | Skynova Agency" },
      { name: "description", content: "Instant eSIM activation before you land, or a physical SIM waiting at the airport counter." },
    ],
  }),
  component: () => (
    <VerticalPage
      eyebrow="SIM & eSIM"
      title="Stay connected wherever you go."
      description="Instant eSIM activation before you land, or a physical SIM waiting at the airport counter."
      heroVideo={{ videoSrc: "/assets/hero/esim-hero.mp4" }}
      heroAlt="Smartphone displaying an eSIM QR code"
      ctaHref={esimLink()}
      ctaLabel="Get connected"
      bullets={[
        { title: "Local data plans", body: "One country, ready the moment you land." },
        { title: "Regional passes", body: "Cross borders without swapping SIMs." },
        { title: "Unlimited talk & data", body: "Built for longer stays and remote work." },
      ]}
      destinationSlugs={["vietnam", "sri-lanka", "brazil", "oman"]}
      faqHeading="eSIM questions, answered."
      faqs={[
        {
          q: "Does my phone support eSIM?",
          a: "Most phones from the last few years do -- Airalo's site lists supported models before you buy.",
        },
        {
          q: "Can I keep my regular number active too?",
          a: "Yes -- an eSIM runs alongside your physical SIM, so calls and texts on your home number still work.",
        },
        {
          q: "What happens when the data runs out?",
          a: "You can top up the same eSIM with more data, or buy a fresh plan if you're headed somewhere new.",
        },
        {
          q: "Do I need wifi to install it?",
          a: "Yes, briefly -- you install the eSIM over wifi before you fly, then it activates once you land.",
        },
      ]}
      afterDestinations={
        <TravelGuidesSection
          eyebrow="Travel connectivity guide"
          heading="Get the data plan right."
          slugs={["vietnam-esim-vs-sim", "esim-vs-roaming-cost", "esim-multi-country-trip"]}
        />
      }
    >
      <section className="site-section pt-0 sim-float-section">
        <div className="site-container">
          <div>
            <p className="site-eyebrow mb-3">Your data, wherever you land</p>
            <h2 className="site-h2 max-w-md text-3xl md:text-4xl">One SIM, every border.</h2>
            <p className="site-ink-muted mt-4 max-w-md text-base leading-relaxed">
              Skip the airport kiosk -- install your eSIM before you fly, or have a physical SIM waiting at
              arrivals. Either way, you're online the second you land.
            </p>
            <a href={esimLink()} target="_blank" rel="noopener noreferrer" className="btn-underline mt-6">
              Get connected <span className="arrow">&rarr;</span>
            </a>
          </div>
          <div className="sim-float-stage">
            <img src="/assets/esim/sim-card-float.webp" alt="A SIM card" className="sim-float-card" />
          </div>
        </div>
      </section>
      <section className="site-section pt-0">
        <div className="site-container">
          <p className="site-eyebrow mb-3">How it works</p>
          <h2 className="site-h2 max-w-md text-3xl md:text-4xl">Connected before you're through arrivals.</h2>
          <div className="flow-diagram mt-8">
            {HOW_STEPS.map((s, i) => (
              <div key={s.n} className="flow-step">
                <span className="flow-step-index">{s.n}</span>
                <div>
                  <p className="font-semibold">{s.title}</p>
                  <p className="site-ink-muted mt-1 text-sm leading-relaxed">{s.detail}</p>
                </div>
                {i < HOW_STEPS.length - 1 ? <span className="flow-step-line" aria-hidden="true" /> : null}
              </div>
            ))}
          </div>
        </div>
      </section>
      <EsimCountriesSection />
      <section className="site-section pt-0">
        <div className="site-container">
          <p className="site-eyebrow mb-3">Compatible devices</p>
          <h2 className="site-h2 max-w-md text-3xl md:text-4xl">Check your phone supports it first.</h2>
          <div className="mt-8 grid gap-6 sm:grid-cols-3">
            {COMPATIBLE_DEVICES.map((d) => (
              <div key={d.title} className="site-panel p-7">
                <p className="site-eyebrow mb-3">{d.title}</p>
                <p className="text-base leading-relaxed">{d.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </VerticalPage>
  ),
});
