-- Contact form submissions.
--
-- The site advertised hello@ and partners@ addresses on a domain with no MX
-- records, so every message sent to them bounced. This table means the form
-- works regardless of whether mail forwarding is ever configured -- nothing
-- a visitor sends is silently lost.
--
-- Additive and IF NOT EXISTS, per the shared-database rule: this runs against
-- the live D1 on deploy.
CREATE TABLE IF NOT EXISTS contact_messages (
  id TEXT PRIMARY KEY,
  -- Null for signed-out visitors; set when we can attribute the message.
  user_id TEXT REFERENCES users(id),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  topic TEXT NOT NULL,
  message TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

-- Read pattern is "newest first", so index the sort column.
CREATE INDEX IF NOT EXISTS idx_contact_messages_created
  ON contact_messages (created_at DESC);
