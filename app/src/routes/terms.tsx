import { createFileRoute } from "@tanstack/react-router";

import { Nav } from "@/components/site/Nav";
import { Footer } from "@/components/site/Footer";

export const Route = createFileRoute("/terms")({
  head: () => ({
    meta: [
      { title: "Terms of Use | Skynova Agency" },
      { name: "description", content: "The terms that apply to using Skynova Agency." },
    ],
  }),
  component: TermsPage,
});

function TermsPage() {
  return (
    <>
      <Nav />
      <main>
        <section className="site-section">
          <div className="site-container max-w-3xl">
            <p className="site-eyebrow mb-3">Legal</p>
            <h1 className="site-h2 text-4xl md:text-5xl">Terms of Use.</h1>
            <p className="site-ink-muted mt-4 text-sm">Last updated September 1, 2026.</p>

            <div className="prose-legal mt-10 flex flex-col gap-8">
              <div>
                <h2>What you're agreeing to</h2>
                <p>
                  These terms cover your use of skynovaagency.com. By browsing the site, creating
                  an account, or clicking through to a booking partner, you're agreeing to them. If
                  you don't agree, please don't use the site.
                </p>
              </div>

              <div>
                <h2>Skynova doesn't sell travel -- our partners do</h2>
                <p>
                  Skynova Agency is a search and referral layer over independent travel partners
                  (airlines, hotels, car rental companies, tour operators, and similar). We don't
                  hold flight, hotel, car, ticket, or eSIM inventory ourselves, and we're not a
                  party to any booking you make. When you complete a booking, that contract is
                  between you and the partner, under their own terms, their own pricing, and their
                  own cancellation and refund policies. We aren't responsible for a partner's
                  service, availability, pricing accuracy, or how they handle your booking.
                </p>
              </div>

              <div>
                <h2>Accounts</h2>
                <ul>
                  <li>You need a real, working email address to create an account.</li>
                  <li>You're responsible for keeping your password confidential and for anything done through your account.</li>
                  <li>Tell us right away at <a href="mailto:hello@skynovaagency.com" className="btn-underline">hello@skynovaagency.com</a> if you think your account's been compromised.</li>
                  <li>We can suspend or close an account used to abuse the site (spam signups, abusing the referral program, and similar).</li>
                </ul>
              </div>

              <div>
                <h2>Acceptable use</h2>
                <p>Don't use Skynova Agency to:</p>
                <ul>
                  <li>Scrape, copy, or resell the site's content or listings at scale.</li>
                  <li>Attempt to disrupt, overload, or gain unauthorized access to the site or its accounts.</li>
                  <li>Create accounts or referrals through automated, fraudulent, or misleading means.</li>
                  <li>Submit false or harassing information through the Gift or Contact forms.</li>
                </ul>
              </div>

              <div>
                <h2>Affiliate links and commissions</h2>
                <p>
                  Skynova Agency earns a commission when you book with a partner through a link on
                  this site, at no extra cost to you -- the price you're shown at checkout is the
                  partner's own. This doesn't change your rights with that partner in any way.
                </p>
              </div>

              <div>
                <h2>No warranty</h2>
                <p>
                  The site, its content, and its account features (wishlist, referrals, gifting)
                  are provided "as is." We work to keep listings, prices, and descriptions
                  accurate, but travel pricing and availability change constantly on the partner
                  side, and we can't guarantee the site is always error-free or uninterrupted.
                </p>
              </div>

              <div>
                <h2>Limitation of liability</h2>
                <p>
                  To the extent the law allows, Skynova Agency isn't liable for losses arising
                  from a booking made with a partner, from reliance on information found on this
                  site, or from an interruption to the site itself. Your recourse for a booking
                  issue is with the partner you booked through.
                </p>
              </div>

              <div>
                <h2>Changes</h2>
                <p>
                  We may update these terms as the site changes. We'll update the date at the top
                  of this page when we do -- continuing to use the site after a change means you
                  accept the update.
                </p>
              </div>

              <div>
                <h2>Contact</h2>
                <p>
                  Questions about these terms go to{" "}
                  <a href="mailto:hello@skynovaagency.com" className="btn-underline">
                    hello@skynovaagency.com
                  </a>
                  .
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
