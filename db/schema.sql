CREATE TABLE IF NOT EXISTS bookings (
  id             TEXT PRIMARY KEY,
  ref            TEXT NOT NULL UNIQUE,
  service_id     TEXT NOT NULL,
  service_name   TEXT NOT NULL,
  duration_min   INTEGER NOT NULL,
  starts_at      TIMESTAMPTZ NOT NULL,
  customer_name  TEXT NOT NULL,
  customer_email TEXT NOT NULL,
  customer_phone TEXT NOT NULL,
  notes          TEXT,
  status         TEXT NOT NULL DEFAULT 'pending_deposit',
  deposit_pi_id  TEXT,
  created_at     TIMESTAMPTZ NOT NULL DEFAULT now(),
  paid_at        TIMESTAMPTZ
);
CREATE INDEX IF NOT EXISTS idx_bookings_paid_starts ON bookings (starts_at) WHERE status = 'paid';

CREATE TABLE IF NOT EXISTS webhook_events (
  event_id     TEXT PRIMARY KEY,
  processed_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
