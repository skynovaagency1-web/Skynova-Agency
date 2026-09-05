-- Newsletter signups. The form previously stored nothing at all: it swapped in
-- "You're on the list" purely in local state, so every warm lead who typed an
-- address into the footer was dropped.
--
-- Kept in D1 as the source of truth even though the list also syncs to
-- systeme.io, so a bad or missing API key can never lose a subscriber. The
-- sync columns record whether each row made it across.
CREATE TABLE IF NOT EXISTS newsletter_subscribers (
  id TEXT PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  -- Where the signup came from, so a second form later stays distinguishable.
  source TEXT NOT NULL DEFAULT 'site',
  -- Null until the provider accepts it; set on a 201 or an "already exists".
  synced_at TEXT,
  -- Last failure reason, kept so a failed batch can be found and retried.
  sync_error TEXT,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_newsletter_subscribers_created
  ON newsletter_subscribers (created_at DESC);

-- Finds the rows that still need pushing to the provider.
CREATE INDEX IF NOT EXISTS idx_newsletter_subscribers_unsynced
  ON newsletter_subscribers (synced_at);
