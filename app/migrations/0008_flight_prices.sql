-- Cached cheapest fares from the Travelpayouts Data API.
--
-- WHY A TABLE AND NOT JUST THE CACHE API. The edge cache is per-colo: a
-- visitor arriving at a colo that has not seen this origin before gets a miss,
-- and a miss means either a blocking API call in the render path or a card
-- with no price. This table is the floor under that -- one global copy, so a
-- cold colo serves a slightly older price instead of none, and the API is
-- called because the DATA is stale rather than because the edge forgot.
--
-- Keyed by origin, not by route. The API endpoint this feeds
-- (v1/city-directions) answers "cheapest fare from X to everywhere" in a
-- single request, so one row per origin covers all 42 destinations at once.
-- Storing a row per route would multiply the writes by forty and buy nothing.
--
-- No visitor data of any kind. The origin is a three-letter airport code
-- derived from CF-IPCountry, which is country-level and never stored against
-- anything identifying -- so this table stays outside the consent regime for
-- the same reason outbound_clicks does.
CREATE TABLE IF NOT EXISTS flight_prices (
  -- "LON:EUR" -- origin airport and the currency it was priced in. Both
  -- matter: the same route in GBP and EUR are different cached answers.
  cache_key TEXT PRIMARY KEY,
  origin_iata TEXT NOT NULL,
  currency TEXT NOT NULL,
  -- The API response, already reduced to { destIata: { value, date } }.
  -- Stored as JSON because the shape is a map with ~40 unpredictable keys,
  -- and nothing queries inside it -- it is read whole or not at all.
  payload TEXT NOT NULL,
  fetched_at TEXT NOT NULL DEFAULT (datetime('now'))
);

-- "Is this origin's copy stale?" -- the only question asked of this table.
CREATE INDEX IF NOT EXISTS idx_flight_prices_fetched
  ON flight_prices (fetched_at DESC);
