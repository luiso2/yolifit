import postgres from 'postgres';
import { randomUUID } from 'node:crypto';

// One pooled client per server instance. DATABASE_URL is a Railway Postgres URL.
const sql = postgres(process.env.DATABASE_URL ?? '', { max: 5 });

export type BookingRow = {
  id: string;
  ref: string;
  service_id: string;
  service_name: string;
  duration_min: number;
  starts_at: Date;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  notes: string | null;
  status: string;
  deposit_pi_id: string | null;
  created_at: Date;
  paid_at: Date | null;
};

export async function createBooking(input: {
  ref: string;
  serviceId: string;
  serviceName: string;
  durationMin: number;
  startsAt: Date;
  name: string;
  email: string;
  phone: string;
  notes: string | null;
}): Promise<BookingRow> {
  const id = randomUUID();
  const [row] = await sql<BookingRow[]>`
    INSERT INTO bookings (id, ref, service_id, service_name, duration_min, starts_at,
      customer_name, customer_email, customer_phone, notes, status)
    VALUES (${id}, ${input.ref}, ${input.serviceId}, ${input.serviceName}, ${input.durationMin},
      ${input.startsAt}, ${input.name}, ${input.email}, ${input.phone}, ${input.notes}, 'pending_deposit')
    RETURNING *`;
  return row;
}

export async function paidBookingsForDate(dateISO: string): Promise<Array<{ startMin: number; durationMin: number }>> {
  // start_min is minute-of-day in Miami local time, so it compares directly
  // against the local wall-clock slots ("10:30 AM" -> 630). Computing it in SQL
  // (via AT TIME ZONE) avoids any UTC/local mismatch in JS.
  const rows = await sql<Array<{ start_min: number; duration_min: number }>>`
    SELECT
      (EXTRACT(HOUR FROM starts_at AT TIME ZONE 'America/New_York') * 60
       + EXTRACT(MINUTE FROM starts_at AT TIME ZONE 'America/New_York'))::int AS start_min,
      duration_min
    FROM bookings
    WHERE status = 'paid'
      AND (starts_at AT TIME ZONE 'America/New_York')::date = ${dateISO}::date`;
  return rows.map((r) => ({ startMin: r.start_min, durationMin: r.duration_min }));
}

export async function markBookingPaid(ref: string, depositPiId: string | null): Promise<void> {
  await sql`
    UPDATE bookings SET status = 'paid', paid_at = now(), deposit_pi_id = ${depositPiId}
    WHERE ref = ${ref} AND status = 'pending_deposit'`;
}

export async function markBookingCanceled(ref: string): Promise<void> {
  await sql`UPDATE bookings SET status = 'canceled' WHERE ref = ${ref} AND status <> 'canceled'`;
}

export async function wasEventProcessed(eventId: string): Promise<boolean> {
  const rows = await sql`SELECT 1 FROM webhook_events WHERE event_id = ${eventId}`;
  return rows.length > 0;
}

export async function markEventProcessed(eventId: string): Promise<void> {
  await sql`INSERT INTO webhook_events (event_id) VALUES (${eventId}) ON CONFLICT DO NOTHING`;
}
