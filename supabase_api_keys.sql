-- API Keys table for public API authentication
-- NOTE: user_id type must match users.id (INTEGER if SERIAL, UUID if UUID)
CREATE TABLE IF NOT EXISTS api_keys (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  name VARCHAR(100) NOT NULL DEFAULT 'Default Key',
  key_hash VARCHAR(64) NOT NULL UNIQUE, -- SHA-256 hash of the API key
  key_prefix VARCHAR(12) NOT NULL,       -- First 12 chars for display (aiq_xxxxx...)
  is_active BOOLEAN DEFAULT TRUE,
  last_used_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_api_keys_hash ON api_keys(key_hash);
CREATE INDEX IF NOT EXISTS idx_api_keys_user ON api_keys(user_id);

ALTER TABLE api_keys ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own keys" ON api_keys
  FOR SELECT USING (true);

CREATE POLICY "Users can manage own keys" ON api_keys
  FOR ALL USING (true);
