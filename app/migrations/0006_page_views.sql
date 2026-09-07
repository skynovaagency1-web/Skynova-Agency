-- First-party pageview counting.
--
-- Cloudflare Web Analytics is installed but not recording: its edge 404s
-- /cdn-cgi/rum for this zone, so the beacon's POST fails and no data arrives.
-- That is fixable in the dashboard, but it also showed the risk of having the
-- only record of your own traffic live somewhere you do not control. This is
-- the copy that cannot silently stop.
--
-- AGGREGATE, not one row per view. A row per pageview would grow without
-- bound for no analytical gain -- "which pages get read, and when" is answered
-- exactly as well by a counter per path per day, in a table that stays small
-- enough to query instantly a year from now. It is also the more private
-- shape: there is no event to correlate with another event, because there are
-- no events, only totals.
--
-- What this CANNOT tell you, and it matters: these are VIEWS, not visitors.
-- Distinguishing one person reading ten pages from ten people reading one
-- would need an identifier stored on the device, which is the thing that
-- drags analytics into consent-banner territory. Ten views is ten views.
CREATE TABLE IF NOT EXISTS page_views_daily (
  -- Path only, and only paths matching a real route (see page-views.server.ts).
  path TEXT NOT NULL,
  -- UTC date, YYYY-MM-DD.
  day TEXT NOT NULL,
  views INTEGER NOT NULL DEFAULT 0,
  PRIMARY KEY (path, day)
);

-- "Where does traffic come from" -- host only, never the full referring URL.
-- A full URL can carry a private path or a query string from someone else's
-- site; the host answers the question without inheriting their leak.
CREATE TABLE IF NOT EXISTS referrers_daily (
  host TEXT NOT NULL,
  day TEXT NOT NULL,
  hits INTEGER NOT NULL DEFAULT 0,
  PRIMARY KEY (host, day)
);

-- Both tables are read "most recent first, by volume".
CREATE INDEX IF NOT EXISTS idx_page_views_daily_day ON page_views_daily (day DESC, views DESC);
CREATE INDEX IF NOT EXISTS idx_referrers_daily_day ON referrers_daily (day DESC, hits DESC);
