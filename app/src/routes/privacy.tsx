import { createFileRoute } from "@tanstack/react-router";

import { Nav } from "@/components/site/Nav";
import { Footer } from "@/components/site/Footer";

export const Route = createFileRoute("/privacy")({
  head: () => ({
    meta: [
      { title: "Privacy Policy | Skynova Agency" },
      { name: "description", content: "How Skynova Agency collects, uses, and protects your information." },
    ],
  }),
  component: PrivacyPage,
});

function PrivacyPage() {
  return (
    <>
      <Nav />
      <main>
        <section className="site-section">
          <div className="site-container max-w-3xl">
            <p className="site-eyebrow mb-3">Legal</p>
            <h1 className="site-h2 text-4xl md:text-5xl">Privacy Policy.</h1>
            <p className="site-ink-muted mt-4 text-sm">Last updated September 1, 2026.</p>

            <div className="prose-legal mt-10 flex flex-col gap-8">
              <div>
                <h2>What Skynova Agency is</h2>
                <p>
                  Skynova Agency ("Skynova," "we," "us") is a travel search and referral site. We
                  don't sell flights, hotel rooms, cars, or tickets ourselves -- we route your
                  search to established travel partners (Aviasales, Hotellook, Rentalcars,
                  GetYourGuide, Airalo, Tiqets, and others), and any booking you complete happens
                  on that partner's own site, under their own terms. This policy covers what we
                  collect on skynovaagency.com itself.
                </p>
              </div>

              <div>
                <h2>Information we collect</h2>
                <p>If you create a Skynova account, we store:</p>
                <ul>
                  <li>Your email address.</li>
                  <li>
                    Your password -- never in plain text. It's hashed with a per-account random
                    salt before it's saved, and we can't read it back out.
                  </li>
                  <li>Destinations you save to your wishlist.</li>
                  <li>Your referral code, and which account (if any) referred you.</li>
                  <li>Recipient details you submit through the Gift form.</li>
                </ul>
                <p>
                  We also set one functional cookie to keep you signed in (<code>skynova_session</code>).
                  It's <code>HttpOnly</code>, so no script on this page (ours or anyone else's) can
                  read it, and it's the only cookie we set ourselves. We don't currently run
                  advertising or analytics cookies of our own.
                </p>
              </div>

              <div>
                <h2>What we use it for</h2>
                <ul>
                  <li>Creating and securing your account, and keeping you signed in.</li>
                  <li>Showing your saved destinations back to you.</li>
                  <li>Crediting referrals when someone signs up through your link.</li>
                  <li>Following up on a gift request you submitted.</li>
                  <li>Responding if you contact us directly.</li>
                </ul>
                <p>
                  We do not sell your personal information, and we do not share your account
                  email or password with the travel partners we link to -- when you click through
                  to book, you're on their site, giving them whatever information their own
                  checkout asks for, under their own privacy policy.
                </p>
              </div>

              <div>
                <h2>Affiliate links</h2>
                <p>
                  Most links on this site are affiliate links -- if you book through one, the
                  partner may pay Skynova a commission, at no extra cost to you. The price you see
                  at checkout is the partner's own price. See our{" "}
                  <a href="/about" className="btn-underline">
                    About page
                  </a>{" "}
                  for more on how that works.
                </p>
              </div>

              <div>
                <h2>Your choices</h2>
                <ul>
                  <li>You can remove items from your wishlist at any time from your account.</li>
                  <li>
                    To close your account or request deletion of your data, email us at{" "}
                    <a href="mailto:hello@skynovaagency.com" className="btn-underline">
                      hello@skynovaagency.com
                    </a>{" "}
                    and we'll handle it directly.
                  </li>
                  <li>You can decline to create an account at all -- browsing and clicking through to partners doesn't require one.</li>
                </ul>
              </div>

              <div>
                <h2>Children</h2>
                <p>Skynova Agency isn't directed at children, and we don't knowingly collect information from anyone under 16.</p>
              </div>

              <div>
                <h2>Changes to this policy</h2>
                <p>
                  If this policy changes in a material way, we'll update the date at the top of
                  this page. Continuing to use Skynova after a change means you accept the updated
                  policy.
                </p>
              </div>

              <div>
                <h2>Contact</h2>
                <p>
                  Questions about this policy or your data go to{" "}
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
