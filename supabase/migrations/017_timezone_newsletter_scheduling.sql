-- Returns users where it's currently the target hour in their local timezone
-- and they haven't been sent a newsletter today (in their local timezone).
CREATE OR REPLACE FUNCTION get_users_due_for_newsletter(p_target_hour int DEFAULT 8)
RETURNS TABLE (id uuid)
LANGUAGE sql STABLE
AS $$
  SELECT u.id
  FROM users u
  WHERE u.is_active = true
    AND u.unsubscribed_at IS NULL
    AND EXTRACT(HOUR FROM NOW() AT TIME ZONE u.timezone) = p_target_hour
    AND (
      u.last_newsletter_at IS NULL
      OR (u.last_newsletter_at AT TIME ZONE u.timezone)::date
          < (NOW() AT TIME ZONE u.timezone)::date
    )
  LIMIT 100;
$$;

-- Partial index to speed up the hourly timezone lookup
CREATE INDEX IF NOT EXISTS idx_users_timezone_active
  ON users (timezone, is_active)
  WHERE is_active = true AND unsubscribed_at IS NULL;
