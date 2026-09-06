-- Outbound affiliate clicks.
--
-- Cloudflare Web Analytics records pageviews and, by design, nothing else --
-- it has no custom events. So the site could tell you how many people read
-- the Portugal guide and nothing whatsoever about how many went on to click
-- a booking partner. Affiliate CTR, revenue per destination and "which
-- vertical actually earns" were all unanswerable.
--
-- Deliberately minimal, and that is the whole design. There is no IP, no user
-- agent, no session id, no account id and nothing written to the visitor's
-- device: a row records that SOMEONE clicked a given vertical from a given
-- page, never who. That keeps it outside the consent-banner regime under
-- GDPR/ePrivacy (no storage or access on the device) and it is also all the
-- data the actual question needs.
--
-- No foreign key to users on purpose. Attributing clicks to accounts would
-- make this personal data and drag the whole feature into consent territory
-- for the sake of a number nobody has asked for.
CREATE TABLE IF NOT EXISTS outbound_clicks (
  id TEXT PRIMARY KEY,
  occurred_at TEXT NOT NULL DEFAULT (datetime('now')),
  -- flights | hotels | cars | tours | events | esim | transfers | bikes
  vertical TEXT NOT NULL,
  -- The partner host, so a later switch of provider stays comparable.
  partner TEXT NOT NULL,
  -- Set when the click happened on a destination guide; null elsewhere.
  destination_slug TEXT,
  -- Path only, never the query string: a query can carry anything.
  page_path TEXT NOT NULL
);

-- "What happened recently", the default view.
CREATE INDEX IF NOT EXISTS idx_outbound_clicks_time
  ON outbound_clicks (occurred_at DESC);

-- "Which destinations earn" -- the question this table exists to answer.
CREATE INDEX IF NOT EXISTS idx_outbound_clicks_destination
  ON outbound_clicks (destination_slug, occurred_at DESC);

-- "Which vertical earns".
CREATE INDEX IF NOT EXISTS idx_outbound_clicks_vertical
  ON outbound_clicks (vertical, occurred_at DESC);
