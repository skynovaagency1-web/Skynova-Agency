import { esimLink } from "@/lib/affiliate";

const COUNTRIES = [
  { slug: "vietnam", name: "Vietnam", flag: "🇻🇳" },
  { slug: "sri-lanka", name: "Sri Lanka", flag: "🇱🇰" },
  { slug: "brazil", name: "Brazil", flag: "🇧🇷" },
  { slug: "oman", name: "Oman", flag: "🇴🇲" },
  { slug: "thailand", name: "Thailand", flag: "🇹🇭" },
  { slug: "japan", name: "Japan", flag: "🇯🇵" },
  { slug: "mexico", name: "Mexico", flag: "🇲🇽" },
  { slug: "italy", name: "Italy", flag: "🇮🇹" },
];

export function EsimCountriesSection() {
  return (
    <section className="site-section pt-0">
      <div className="site-container">
        <p className="site-eyebrow mb-3">Popular countries</p>
        <h2 className="site-h2 max-w-md text-3xl md:text-4xl">Pick a country, land connected.</h2>
        <div className="mt-8 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
          {COUNTRIES.map((c) => (
            <a
              key={c.slug}
              href={esimLink(c.slug)}
              target="_blank"
              rel="noopener noreferrer"
              className="dest-mini-card"
            >
              <p className="dest-card-flag">{c.flag}</p>
              <p className="mt-2 font-semibold">{c.name}</p>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
