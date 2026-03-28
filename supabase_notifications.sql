-- Notifications table for real-time alerts
-- NOTE: user_id type must match the actual users.id type in your database.
-- If users.id is INTEGER (SERIAL), use INTEGER. If UUID, use UUID.
-- Run this query first to check: SELECT data_type FROM information_schema.columns WHERE table_name = 'users' AND column_name = 'id';

CREATE TABLE IF NOT EXISTS notifications (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  type VARCHAR(50) NOT NULL DEFAULT 'info',  -- 'audit_complete', 'bias_alert', 'compliance_warning', 'system', 'info'
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  priority VARCHAR(20) DEFAULT 'normal',  -- 'high', 'normal', 'low'
  read BOOLEAN DEFAULT FALSE,
  metadata JSONB DEFAULT '{}',  -- audit_id, score, etc.
  created_at TIMESTAMPTZ DEFAULT NOW(),
  read_at TIMESTAMPTZ
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_read ON notifications(user_id, read);
CREATE INDEX IF NOT EXISTS idx_notifications_created ON notifications(user_id, created_at DESC);

-- RLS policies
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own notifications" ON notifications
  FOR SELECT USING (true);

CREATE POLICY "Users can update own notifications" ON notifications
  FOR UPDATE USING (true);

CREATE POLICY "Service can insert notifications" ON notifications
  FOR INSERT WITH CHECK (true);

-- Enable Realtime for notifications
ALTER PUBLICATION supabase_realtime ADD TABLE notifications;

-- Function to create notification when audit completes
CREATE OR REPLACE FUNCTION notify_audit_complete()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.status = 'completed' AND (OLD.status IS NULL OR OLD.status != 'completed') THEN
    INSERT INTO notifications (user_id, type, title, message, priority, metadata)
    VALUES (
      NEW.user_id,
      CASE
        WHEN NEW.risk_level = 'High' THEN 'bias_alert'
        WHEN NEW.overall_score < 80 THEN 'compliance_warning'
        ELSE 'audit_complete'
      END,
      CASE
        WHEN NEW.risk_level = 'High' THEN 'Alerte: Biais critique detecte'
        WHEN NEW.overall_score < 80 THEN 'Attention: Non-conformite detectee'
        ELSE 'Audit termine avec succes'
      END,
      format('L''audit "%s" est termine. Score: %s/100, Risque: %s',
        NEW.audit_name, NEW.overall_score, NEW.risk_level),
      CASE WHEN NEW.risk_level = 'High' THEN 'high' ELSE 'normal' END,
      jsonb_build_object(
        'audit_id', NEW.id,
        'audit_name', NEW.audit_name,
        'overall_score', NEW.overall_score,
        'risk_level', NEW.risk_level,
        'bias_detected', NEW.bias_detected
      )
    );
  END IF;

  IF NEW.status = 'failed' AND (OLD.status IS NULL OR OLD.status != 'failed') THEN
    INSERT INTO notifications (user_id, type, title, message, priority, metadata)
    VALUES (
      NEW.user_id,
      'system',
      'Echec de l''analyse',
      format('L''audit "%s" a echoue. Veuillez relancer l''analyse.', NEW.audit_name),
      'high',
      jsonb_build_object('audit_id', NEW.id, 'audit_name', NEW.audit_name)
    );
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger
DROP TRIGGER IF EXISTS trigger_audit_notification ON audits;
CREATE TRIGGER trigger_audit_notification
  AFTER UPDATE ON audits
  FOR EACH ROW
  EXECUTE FUNCTION notify_audit_complete();
