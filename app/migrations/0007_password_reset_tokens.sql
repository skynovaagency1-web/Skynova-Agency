-- Additive migration. See 0001_init.sql for the base schema/rules.
--
-- Replaces the reset flow that could not reset anything.
--
-- 0002 created password_reset_requests (id, email, created_at) and nothing
-- else: no token, no expiry, no user reference. Submitting the form logged a
-- row and returned success, so a visitor who forgot their password saw
-- "we'll be in touch to help you back in", was never contacted -- nothing
-- read that table -- and could not re-register either, because signUp rejects
-- an email that already exists. There was no route back into the account.
--
-- password_reset_requests is deliberately KEPT rather than dropped. It is now
-- the rate-limit ledger: one row per request attempt, counted per email over
-- a short window so this endpoint cannot be used to spray reset mail at
-- someone else's address. Its existing rows stay as a record of the six
-- requests made while the flow was inert.

CREATE TABLE IF NOT EXISTS password_reset_tokens (
  -- SHA-256 of the token, never the token itself. A leaked database backup
  -- must not hand over working reset links, exactly as it must not hand over
  -- passwords -- the token IS a credential for the length of its life.
  -- Plain SHA-256 rather than PBKDF2 is correct here: the token is 32 bytes
  -- of CSPRNG output, so there is no low-entropy guess space to slow down.
  token_hash TEXT PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES users(id),
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  -- Short by design: one hour. A reset link sitting valid in an inbox for a
  -- day is a standing key to the account.
  expires_at TEXT NOT NULL,
  -- Set the moment it is spent. Single use, so a link that leaks after the
  -- fact (forwarded mail, shared screenshot, browser history) is already dead.
  used_at TEXT
);

-- "Kill this user's outstanding links" -- run when a reset succeeds, so any
-- other tokens issued for the same account stop working immediately.
CREATE INDEX IF NOT EXISTS idx_password_reset_tokens_user
  ON password_reset_tokens (user_id, created_at DESC);

-- Housekeeping: expired rows are worthless and should be sweepable cheaply.
CREATE INDEX IF NOT EXISTS idx_password_reset_tokens_expiry
  ON password_reset_tokens (expires_at);
