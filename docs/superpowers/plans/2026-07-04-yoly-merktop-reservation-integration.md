# Yoly - Merktop Reservation Integration Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make the Yoly website charge a $60 deposit through Merktop for every reservation, store the booking in Postgres, and mark it paid + block the slot via a signed webhook.

**Architecture:** The website owns the agenda (Postgres `bookings`), Merktop owns the money (existing reservation deposit link). `/api/reservas` creates a `pending_deposit` booking and redirects to the Merktop pay URL with a `ref`; Merktop calls `/api/merktop/webhook` (HMAC-signed) on `deposit.paid` to mark it `paid`. Pure logic (duration, ref, signature verify, availability) is extracted into testable modules; the DB layer and route handlers are thin.

**Tech Stack:** Next.js 15 (App Router), TypeScript, Postgres (`postgres` driver by porsager), jest + ts-jest (`testEnvironment: node`), Railway (service "Yolifit").

## Global Constraints

- Package manager: `pnpm` (never npm). TypeScript only.
- Money code is TDD: pure-logic modules (Tasks 1-4) write the failing test first. DB/route tasks (Tasks 5-6, 8) have no DB test harness in jest — their gate is `pnpm lint` (`tsc --noEmit`) plus the integration verification described; do NOT fake a DB test.
- Webhook signature (from Merktop `src/merchant-webhook.ts`, verbatim): header `merktop-signature: t=<unixSec>,v1=<hexHmac>`; verify `HMAC_SHA256(secret, "<t>.<rawBody>")` in constant time; reject if `t` is older than 5 minutes (replay). Dedup by header `merktop-event-id`.
- Webhook body shape: `{ id, type, created, data }`; `data.ref` correlates with the website booking; `data.deposit_id` is the Stripe-side id.
- The reservation pay URL is read from `process.env.MERKTOP_RESERVATION_PAY_URL` (value: `https://payments.merktop.com/pay/d/e69614c2-d285-430e-99d1-a1e2c1d299c6`). The webhook secret from `process.env.MERKTOP_WEBHOOK_SECRET`. The DB from `process.env.DATABASE_URL`.
- Timezone for combining date + slot into `starts_at`: America/New_York (Miami).
- Ref format: `YS-YYYYMMDD-NNNN` (reuse the pattern in `lib/tickets.ts`).
- No em-dash (—) in code or copy.
- jest config: `testMatch: ['**/tests/**/*.test.ts']`, ts-jest, node env. Put tests in `tests/`.

---

## File Structure

- `lib/duration.ts` — `durationMinutes(text)` parses "90 minutos"/"90 minutes" to 90.
- `lib/booking-ref.ts` — `generateBookingRef(date, random?)` produces `YS-YYYYMMDD-NNNN`.
- `lib/merktop-webhook.ts` — `verifyMerktopSignature(...)` and `parseSlotTime`-free signature/replay checks.
- `lib/availability.ts` — `parseSlotToMinutes`, `computeAvailableSlots(baseSlots, candidateDurationMin, paidBookings, dayStart)`.
- `lib/db.ts` — Postgres pool + `bookings` schema constant + queries (`createBooking`, `getBookingByRef`, `markBookingPaid`, `markBookingCanceled`, `paidBookingsForDate`, `wasEventProcessed`, `markEventProcessed`).
- `app/api/reservas/route.ts` — MODIFY: create booking + return Merktop URL.
- `app/api/availability/route.ts` — NEW: available slots for a date.
- `app/api/merktop/webhook/route.ts` — NEW: signed webhook receiver.
- `components/sections/Reservas.tsx` — MODIFY: fetch availability, disable taken slots.
- `tests/*.test.ts` — pure-logic tests.

---

### Task 1: `lib/duration.ts` — parse service duration to minutes

**Files:**
- Create: `lib/duration.ts`
- Test: `tests/duration.test.ts`

**Interfaces:**
- Produces: `durationMinutes(durationText: string): number` — parses the leading integer from strings like `"90 minutos"` / `"60 minutes"`; returns `60` when no integer is found (safe default).

- [ ] **Step 1: Write the failing test**

Create `tests/duration.test.ts`:

```ts
import { durationMinutes } from '../lib/duration';

describe('durationMinutes', () => {
  it('parses the leading integer from Spanish and English duration text', () => {
    expect(durationMinutes('90 minutos')).toBe(90);
    expect(durationMinutes('60 minutes')).toBe(60);
    expect(durationMinutes('45 minutos')).toBe(45);
  });
  it('falls back to 60 when there is no number', () => {
    expect(durationMinutes('Consultar')).toBe(60);
    expect(durationMinutes('')).toBe(60);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `pnpm exec jest tests/duration.test.ts`
Expected: FAIL (module not found / durationMinutes undefined).

- [ ] **Step 3: Write the implementation**

Create `lib/duration.ts`:

```ts
// Service durations in the catalog are free text ("90 minutos", "60 minutes").
// Reservations need the numeric minutes to block the right calendar slots.
export function durationMinutes(durationText: string): number {
  const match = durationText.match(/\d+/);
  return match ? parseInt(match[0], 10) : 60;
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `pnpm exec jest tests/duration.test.ts`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add lib/duration.ts tests/duration.test.ts
git commit -m "feat: durationMinutes parser for service durations"
```

---

### Task 2: `lib/booking-ref.ts` — generate the Merktop correlation ref

**Files:**
- Create: `lib/booking-ref.ts`
- Test: `tests/booking-ref.test.ts`

**Interfaces:**
- Produces: `generateBookingRef(date: Date, random?: () => number): string` — returns `YS-YYYYMMDD-NNNN` (4-digit 1000-9999), deterministic when `random` is injected. Same format as `lib/tickets.ts` `generateTicketCode`.

- [ ] **Step 1: Write the failing test**

Create `tests/booking-ref.test.ts`:

```ts
import { generateBookingRef } from '../lib/booking-ref';

describe('generateBookingRef', () => {
  it('produces YS-YYYYMMDD-NNNN, deterministic with injected random', () => {
    const date = new Date('2026-07-15T12:00:00Z');
    expect(generateBookingRef(date, () => 0)).toBe('YS-20260715-1000');
    expect(generateBookingRef(date, () => 0.9999)).toBe('YS-20260715-9999');
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `pnpm exec jest tests/booking-ref.test.ts`
Expected: FAIL.

- [ ] **Step 3: Write the implementation**

Create `lib/booking-ref.ts`:

```ts
// Correlation id shared with Merktop via ?ref=... on the pay URL; it comes back
// on every webhook as data.ref so we can tie the deposit to this booking.
export function generateBookingRef(date: Date, random: () => number = Math.random): string {
  const dateStr = date.toISOString().slice(0, 10).replace(/-/g, '');
  const num = Math.floor(1000 + random() * 9000);
  return `YS-${dateStr}-${num}`;
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `pnpm exec jest tests/booking-ref.test.ts`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add lib/booking-ref.ts tests/booking-ref.test.ts
git commit -m "feat: generateBookingRef for Merktop correlation"
```

---

### Task 3: `lib/merktop-webhook.ts` — verify the signed webhook

**Files:**
- Create: `lib/merktop-webhook.ts`
- Test: `tests/merktop-webhook.test.ts`

**Interfaces:**
- Produces: `verifyMerktopSignature(args: { secret: string; rawBody: string; signatureHeader: string | null; nowSec: number }): boolean` — parses `t=<t>,v1=<sig>`, recomputes `HMAC_SHA256(secret, "<t>.<rawBody>")`, constant-time compares, and rejects when `|nowSec - t| > 300`. Returns true only when everything checks out.

- [ ] **Step 1: Write the failing test**

Create `tests/merktop-webhook.test.ts`:

```ts
import { createHmac } from 'node:crypto';
import { verifyMerktopSignature } from '../lib/merktop-webhook';

const SECRET = 'whsec_merktop_testsecret';
function signHeader(body: string, t: number): string {
  const sig = createHmac('sha256', SECRET).update(`${t}.${body}`).digest('hex');
  return `t=${t},v1=${sig}`;
}

describe('verifyMerktopSignature', () => {
  const body = JSON.stringify({ id: 'evt_1', type: 'deposit.paid', data: { ref: 'YS-20260715-1000' } });
  const now = 1_800_000_000;

  it('accepts a valid, fresh signature', () => {
    const header = signHeader(body, now);
    expect(verifyMerktopSignature({ secret: SECRET, rawBody: body, signatureHeader: header, nowSec: now })).toBe(true);
  });
  it('rejects a tampered body', () => {
    const header = signHeader(body, now);
    expect(verifyMerktopSignature({ secret: SECRET, rawBody: body + 'x', signatureHeader: header, nowSec: now })).toBe(false);
  });
  it('rejects a stale timestamp (older than 5 min)', () => {
    const header = signHeader(body, now - 301);
    expect(verifyMerktopSignature({ secret: SECRET, rawBody: body, signatureHeader: header, nowSec: now })).toBe(false);
  });
  it('rejects a missing or malformed header', () => {
    expect(verifyMerktopSignature({ secret: SECRET, rawBody: body, signatureHeader: null, nowSec: now })).toBe(false);
    expect(verifyMerktopSignature({ secret: SECRET, rawBody: body, signatureHeader: 'garbage', nowSec: now })).toBe(false);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `pnpm exec jest tests/merktop-webhook.test.ts`
Expected: FAIL.

- [ ] **Step 3: Write the implementation**

Create `lib/merktop-webhook.ts`:

```ts
import { createHmac, timingSafeEqual } from 'node:crypto';

const MAX_SKEW_SEC = 300;

// Verifies Merktop's outbound webhook signature. Header format:
// `merktop-signature: t=<unixSec>,v1=<hexHmac>` where the HMAC is over
// `${t}.${rawBody}` with the per-business webhook secret. Rejects replays
// (timestamp older than 5 minutes) and any signature mismatch.
export function verifyMerktopSignature(args: {
  secret: string;
  rawBody: string;
  signatureHeader: string | null;
  nowSec: number;
}): boolean {
  if (!args.signatureHeader) return false;
  const parts = Object.fromEntries(
    args.signatureHeader.split(',').map((kv) => {
      const i = kv.indexOf('=');
      return [kv.slice(0, i).trim(), kv.slice(i + 1).trim()];
    }),
  );
  const t = Number(parts.t);
  const v1 = parts.v1;
  if (!Number.isFinite(t) || !v1) return false;
  if (Math.abs(args.nowSec - t) > MAX_SKEW_SEC) return false;
  const expected = createHmac('sha256', args.secret).update(`${t}.${args.rawBody}`).digest('hex');
  const a = Buffer.from(expected, 'hex');
  const b = Buffer.from(v1, 'hex');
  if (a.length !== b.length) return false;
  return timingSafeEqual(a, b);
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `pnpm exec jest tests/merktop-webhook.test.ts`
Expected: PASS (all four).

- [ ] **Step 5: Commit**

```bash
git add lib/merktop-webhook.ts tests/merktop-webhook.test.ts
git commit -m "feat: verify Merktop webhook signature (HMAC + replay guard)"
```

---

### Task 4: `lib/availability.ts` — compute free slots (anti double-booking)

**Files:**
- Create: `lib/availability.ts`
- Test: `tests/availability.test.ts`

**Interfaces:**
- Produces:
  - `parseSlotToMinutes(slot: string): number` — `"10:30 AM"` -> 630, `"02:00 PM"` -> 840.
  - `computeAvailableSlots(baseSlots: string[], candidateDurationMin: number, paidBookings: Array<{ startMin: number; durationMin: number }>): string[]` — returns the base slots whose `[start, start+candidateDuration)` range does NOT overlap any paid booking's range.

- [ ] **Step 1: Write the failing test**

Create `tests/availability.test.ts`:

```ts
import { parseSlotToMinutes, computeAvailableSlots } from '../lib/availability';

describe('parseSlotToMinutes', () => {
  it('parses 12h AM/PM to minutes since midnight', () => {
    expect(parseSlotToMinutes('10:30 AM')).toBe(630);
    expect(parseSlotToMinutes('02:00 PM')).toBe(840);
    expect(parseSlotToMinutes('12:00 PM')).toBe(720);
    expect(parseSlotToMinutes('12:00 AM')).toBe(0);
  });
});

describe('computeAvailableSlots', () => {
  const base = ['09:00 AM', '10:30 AM', '12:00 PM', '01:30 PM'];
  it('removes slots that overlap a paid booking (by duration)', () => {
    // A 90-min booking at 10:30 (630..720) blocks 10:30 and 12:00 (720) is edge-open.
    const paid = [{ startMin: 630, durationMin: 90 }];
    // candidate services are 60 min: 09:00 (540..600) free, 10:30 (630..690) overlaps,
    // 12:00 (720..780) free (booking ends at 720), 01:30 (810..870) free.
    expect(computeAvailableSlots(base, 60, paid)).toEqual(['09:00 AM', '12:00 PM', '01:30 PM']);
  });
  it('keeps all slots when there are no paid bookings', () => {
    expect(computeAvailableSlots(base, 60, [])).toEqual(base);
  });
  it('blocks a slot whose candidate range reaches into a later booking', () => {
    // Booking at 12:00 PM, 60 min: blocks 720..780.
    // 90-min candidate at 09:00 (540..630): free.
    // 90-min candidate at 10:30 (630..720): ends exactly at 720, edge-touching -> free.
    // 90-min candidate at 12:00 (720..810): starts at 720, inside booking -> blocked.
    // 90-min candidate at 01:30 (810..900): starts after booking ends (780) -> free.
    const paid = [{ startMin: 720, durationMin: 60 }];
    expect(computeAvailableSlots(base, 90, paid)).toEqual(['09:00 AM', '10:30 AM', '01:30 PM']);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `pnpm exec jest tests/availability.test.ts`
Expected: FAIL.

- [ ] **Step 3: Write the implementation**

Create `lib/availability.ts`:

```ts
// Two half-open ranges [aStart, aEnd) and [bStart, bEnd) overlap iff
// aStart < bEnd && bStart < aEnd. Edge-touching (one ends where the other
// starts) does NOT overlap, so back-to-back appointments are allowed.
export function parseSlotToMinutes(slot: string): number {
  const m = slot.trim().match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/i);
  if (!m) return NaN;
  let hour = parseInt(m[1], 10) % 12;
  if (m[3].toUpperCase() === 'PM') hour += 12;
  return hour * 60 + parseInt(m[2], 10);
}

export function computeAvailableSlots(
  baseSlots: string[],
  candidateDurationMin: number,
  paidBookings: Array<{ startMin: number; durationMin: number }>,
): string[] {
  return baseSlots.filter((slot) => {
    const start = parseSlotToMinutes(slot);
    const end = start + candidateDurationMin;
    return !paidBookings.some((b) => start < b.startMin + b.durationMin && b.startMin < end);
  });
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `pnpm exec jest tests/availability.test.ts`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add lib/availability.ts tests/availability.test.ts
git commit -m "feat: computeAvailableSlots for anti double-booking"
```

---

### Task 5: `lib/db.ts` — Postgres pool, schema, and booking queries

**Files:**
- Create: `lib/db.ts`, `db/schema.sql`
- Modify: `package.json` (add `postgres` dependency)

**Interfaces:**
- Consumes: none.
- Produces:
  - `type BookingRow = { id: string; ref: string; service_id: string; service_name: string; duration_min: number; starts_at: Date; customer_name: string; customer_email: string; customer_phone: string; notes: string | null; status: string; deposit_pi_id: string | null; created_at: Date; paid_at: Date | null }`
  - `createBooking(input: { ref: string; serviceId: string; serviceName: string; durationMin: number; startsAt: Date; name: string; email: string; phone: string; notes: string | null }): Promise<BookingRow>`
  - `paidBookingsForDate(dateISO: string): Promise<Array<{ startMin: number; durationMin: number }>>` — bookings with `status='paid'` on that calendar day (America/New_York); `startMin` is the minute-of-day IN MIAMI LOCAL TIME (computed in SQL), so it lines up directly with the local wall-clock slots.
  - `markBookingPaid(ref: string, depositPiId: string | null): Promise<void>` — sets `status='paid'`, `paid_at=now()`, `deposit_pi_id` only if currently `pending_deposit` (idempotent).
  - `markBookingCanceled(ref: string): Promise<void>`
  - `wasEventProcessed(eventId: string): Promise<boolean>` and `markEventProcessed(eventId: string): Promise<void>` (dedup table `webhook_events`).

**No jest DB harness exists.** Gate: `pnpm lint` (`tsc --noEmit`) passes and the schema file is valid SQL. DB behavior is verified in Task 9 (integration).

- [ ] **Step 1: Add the driver**

Run: `pnpm add postgres`
Expected: `postgres` added to dependencies.

- [ ] **Step 2: Create the schema file**

Create `db/schema.sql`:

```sql
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
```

- [ ] **Step 3: Create the DB module**

Create `lib/db.ts`:

```ts
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
```

- [ ] **Step 4: Typecheck**

Run: `pnpm lint`
Expected: PASS (no type errors).

- [ ] **Step 5: Commit**

```bash
git add package.json pnpm-lock.yaml lib/db.ts db/schema.sql
git commit -m "feat: Postgres bookings schema + query layer"
```

---

### Task 6: `app/api/reservas/route.ts` — create booking + return Merktop pay URL

**Files:**
- Modify: `app/api/reservas/route.ts` (replace the ticket/Stripe body)
- Test gate: `pnpm lint` (no DB test harness)

**Interfaces:**
- Consumes: `durationMinutes` (Task 1), `generateBookingRef` (Task 2), `computeAvailableSlots`/`parseSlotToMinutes` (Task 4), `createBooking`/`paidBookingsForDate` (Task 5), `bookingSchema` + `getSpaServices` (existing).
- Produces: `POST /api/reservas` -> `{ url }` (200) or `{ error }` (409 slot_taken / 400 invalid / 503 not_configured).

- [ ] **Step 1: Replace the handler**

Replace the entire body of `app/api/reservas/route.ts` with:

```ts
import { NextResponse } from 'next/server';
import { bookingSchema } from '@/lib/booking-schema';
import { getSpaServices } from '@/lib/services';
import { durationMinutes } from '@/lib/duration';
import { generateBookingRef } from '@/lib/booking-ref';
import { computeAvailableSlots } from '@/lib/availability';
import { createBooking, paidBookingsForDate } from '@/lib/db';

// Combine a YYYY-MM-DD date and a "10:30 AM" slot into an absolute instant,
// interpreting the wall-clock time as America/New_York (Miami).
function slotToStartsAt(dateISO: string, time: string): Date {
  const m = time.trim().match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/i);
  if (!m) return new Date(`${dateISO}T12:00:00-04:00`);
  let hour = parseInt(m[1], 10) % 12;
  if (m[3].toUpperCase() === 'PM') hour += 12;
  const hh = String(hour).padStart(2, '0');
  // Miami is UTC-4 (EDT) in summer; the reservation window is same-day so a fixed
  // -04:00 offset is acceptable for the MVP (documented tradeoff).
  return new Date(`${dateISO}T${hh}:${m[2]}:00-04:00`);
}

export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  const locale = body?.locale === 'en' ? 'en' : 'es';
  const parsed = bookingSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: locale === 'en' ? 'Invalid booking data' : 'Datos de reserva invalidos' },
      { status: 400 },
    );
  }
  const data = parsed.data;
  const service = getSpaServices(locale).find((s) => s.id === data.serviceId);
  if (!service) {
    return NextResponse.json(
      { error: locale === 'en' ? 'Service not found' : 'Servicio no encontrado' },
      { status: 400 },
    );
  }
  const payUrl = process.env.MERKTOP_RESERVATION_PAY_URL;
  if (!payUrl) {
    return NextResponse.json(
      { error: locale === 'en' ? 'Reservations are not available right now.' : 'Las reservas no estan disponibles en este momento.' },
      { status: 503 },
    );
  }

  const durMin = durationMinutes(service.duration);
  // Anti double-booking: the chosen slot must still be free among paid bookings.
  // paidBookingsForDate already returns startMin in Miami local minutes.
  const paid = await paidBookingsForDate(data.dateISO);
  const free = computeAvailableSlots([data.time], durMin, paid);
  if (free.length === 0) {
    return NextResponse.json(
      { error: locale === 'en' ? 'That time is no longer available.' : 'Ese horario ya no esta disponible.' },
      { status: 409 },
    );
  }

  const startsAt = slotToStartsAt(data.dateISO, data.time);
  const ref = generateBookingRef(new Date(`${data.dateISO}T12:00:00Z`));
  await createBooking({
    ref, serviceId: service.id, serviceName: service.name, durationMin: durMin,
    startsAt, name: data.name, email: data.email, phone: data.phone, notes: data.notes ?? null,
  });

  const url = `${payUrl}?ref=${encodeURIComponent(ref)}&for=${encodeURIComponent(startsAt.toISOString())}`;
  return NextResponse.json({ url });
}
```

Note: `paidBookingsForDate` returns `startMin` in Miami local minutes (computed in SQL), so it compares directly against the local slot times. `slotToStartsAt` stores the instant with a fixed `-04:00` (EDT) offset; this MVP assumes the summer offset (documented in the helper).

- [ ] **Step 2: Typecheck**

Run: `pnpm lint`
Expected: PASS.

- [ ] **Step 3: Commit**

```bash
git add app/api/reservas/route.ts
git commit -m "feat: reservas creates a booking and redirects to the Merktop deposit"
```

---

### Task 7: availability endpoint + wizard uses it

**Files:**
- Create: `app/api/availability/route.ts`
- Modify: `components/sections/Reservas.tsx` (fetch availability for the chosen day, disable taken slots)
- Test gate: `pnpm lint` + `pnpm build`

**Interfaces:**
- Consumes: `paidBookingsForDate` (Task 5), `computeAvailableSlots` (Task 4), `getSpaServices`/`durationMinutes`.
- Produces: `GET /api/availability?date=YYYY-MM-DD&serviceId=<id>&locale=<es|en>` -> `{ slots: string[] }` (the free slots for that day + service).

- [ ] **Step 1: Create the availability route**

Create `app/api/availability/route.ts`:

```ts
import { NextResponse } from 'next/server';
import { getSpaServices } from '@/lib/services';
import { durationMinutes } from '@/lib/duration';
import { computeAvailableSlots } from '@/lib/availability';
import { paidBookingsForDate } from '@/lib/db';

// The static weekly schedule (mirror of Reservas.tsx getTimeSlots). Kept here so
// the server is the source of truth for which slots are offered.
function baseSlots(dateISO: string): string[] {
  const dow = new Date(`${dateISO}T12:00:00Z`).getUTCDay();
  if (dow === 0) return [];
  if (dow === 6) return ['09:00 AM', '10:15 AM', '11:30 AM', '12:45 PM', '02:00 PM'];
  return ['09:00 AM', '10:30 AM', '12:00 PM', '01:30 PM', '03:00 PM', '04:30 PM', '06:00 PM'];
}

export async function GET(req: Request) {
  const url = new URL(req.url);
  const date = url.searchParams.get('date') ?? '';
  const serviceId = url.searchParams.get('serviceId') ?? '';
  const locale = url.searchParams.get('locale') === 'en' ? 'en' : 'es';
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    return NextResponse.json({ slots: [] });
  }
  const service = getSpaServices(locale).find((s) => s.id === serviceId);
  const durMin = service ? durationMinutes(service.duration) : 60;
  const paid = await paidBookingsForDate(date);
  return NextResponse.json({ slots: computeAvailableSlots(baseSlots(date), durMin, paid) });
}
```

- [ ] **Step 2: Wire the wizard to availability**

In `components/sections/Reservas.tsx`, replace the static `activeSlots` (line ~143 `const activeSlots = getTimeSlots(calDate);`) with a fetched, availability-aware list. Add near the other `useState` hooks:

```tsx
  const [availableSlots, setAvailableSlots] = useState<string[] | null>(null);
```

Add an effect (import `useEffect` from React) after `getTimeSlots` is defined:

```tsx
  React.useEffect(() => {
    if (!calDate) { setAvailableSlots([]); return; }
    const dateISO = calDate.toISOString().slice(0, 10);
    let active = true;
    setAvailableSlots(null); // loading
    fetch(`/api/availability?date=${dateISO}&serviceId=${calService.id}&locale=${locale}`)
      .then((r) => r.json())
      .then((d) => { if (active) setAvailableSlots(Array.isArray(d.slots) ? d.slots : getTimeSlots(calDate)); })
      .catch(() => { if (active) setAvailableSlots(getTimeSlots(calDate)); });
    return () => { active = false; };
  }, [calDate, calService.id, locale]);

  const activeSlots = availableSlots ?? getTimeSlots(calDate);
```

(The `getTimeSlots` fallback keeps the wizard working if `/api/availability` fails.) The slot buttons already map over `activeSlots`; no further JSX change is required beyond this substitution.

- [ ] **Step 3: Typecheck and build**

Run: `pnpm lint && pnpm build`
Expected: both succeed.

- [ ] **Step 4: Commit**

```bash
git add app/api/availability/route.ts components/sections/Reservas.tsx
git commit -m "feat: real availability endpoint + wizard disables taken slots"
```

---

### Task 8: `app/api/merktop/webhook/route.ts` — signed webhook receiver

**Files:**
- Create: `app/api/merktop/webhook/route.ts`
- Test gate: `pnpm lint` (signature logic already tested in Task 3)

**Interfaces:**
- Consumes: `verifyMerktopSignature` (Task 3), `markBookingPaid`/`markBookingCanceled`/`wasEventProcessed`/`markEventProcessed` (Task 5).
- Produces: `POST /api/merktop/webhook` -> 200 (processed/ignored), 401 (bad signature).

- [ ] **Step 1: Create the webhook route**

Create `app/api/merktop/webhook/route.ts`:

```ts
import { NextResponse } from 'next/server';
import { verifyMerktopSignature } from '@/lib/merktop-webhook';
import { markBookingPaid, markBookingCanceled, wasEventProcessed, markEventProcessed } from '@/lib/db';

export async function POST(req: Request) {
  const rawBody = await req.text();
  const secret = process.env.MERKTOP_WEBHOOK_SECRET ?? '';
  const ok = verifyMerktopSignature({
    secret,
    rawBody,
    signatureHeader: req.headers.get('merktop-signature'),
    nowSec: Math.floor(Date.now() / 1000),
  });
  if (!ok) return NextResponse.json({ error: 'bad_signature' }, { status: 401 });

  const eventId = req.headers.get('merktop-event-id') ?? '';
  if (eventId && (await wasEventProcessed(eventId))) return NextResponse.json({ ok: true });

  let event: { type?: string; data?: { ref?: string | null; deposit_id?: string | null } };
  try { event = JSON.parse(rawBody); } catch { return NextResponse.json({ ok: true }); }
  const ref = event.data?.ref ?? null;

  if (ref) {
    if (event.type === 'deposit.paid') {
      await markBookingPaid(ref, event.data?.deposit_id ?? null);
    } else if (event.type === 'deposit.refunded' || event.type === 'deposit.expired') {
      await markBookingCanceled(ref);
    }
    // Other event types (booking.rescheduled/updated/deleted, ping) are acknowledged only.
  }

  if (eventId) await markEventProcessed(eventId);
  return NextResponse.json({ ok: true });
}
```

- [ ] **Step 2: Typecheck**

Run: `pnpm lint`
Expected: PASS.

- [ ] **Step 3: Commit**

```bash
git add app/api/merktop/webhook/route.ts
git commit -m "feat: signed Merktop webhook receiver (deposit.paid marks booking paid)"
```

---

### Task 9: Config + deploy (Postgres, variables, webhook wiring, e2e)

**Files:** none (infra). This task is done by the controller with the user's authorization (production).

- [ ] **Step 1: Provision the dedicated Postgres** in the Railway "clientes" project and get its `DATABASE_URL`.

- [ ] **Step 2: Apply the schema** to that Postgres: run the contents of `db/schema.sql`.

- [ ] **Step 3: Set the Yolifit service variables** on Railway: `DATABASE_URL`, `MERKTOP_WEBHOOK_SECRET` (generate a fresh secret, `whsec_merktop_<hex>`), `MERKTOP_RESERVATION_PAY_URL=https://payments.merktop.com/pay/d/e69614c2-d285-430e-99d1-a1e2c1d299c6`.

- [ ] **Step 4: Wire the webhook in Merktop** for business `5982fadb-48aa-4119-bc18-a61db8733d70`: set `webhook_url=https://clinicyolystudiofit.com/api/merktop/webhook` and the SAME `webhook_secret`. Fire "Test connection" (ping) and confirm the site returns 200.

- [ ] **Step 5: Deploy the website** (Railway build of Yolifit) and run the end-to-end check: reserve a service -> pay the $60 deposit with a real (refundable) card -> confirm the booking flips to `paid` in Postgres and the slot disappears from `/api/availability`.

---

## Self-Review

**1. Spec coverage:**
- Postgres `bookings` + queries -> Task 5. ✓
- `/api/reservas` creates booking + redirects with ref/for -> Task 6. ✓
- `/api/merktop/webhook` verifies HMAC + marks paid -> Tasks 3 (verify) + 8 (route). ✓
- Real availability (paid bookings block slots by duration) -> Tasks 4 (logic) + 7 (endpoint + wizard). ✓
- Webhook signature format (t.{body}, replay 5 min, event-id dedup) -> Task 3 + Task 8. ✓
- Config (webhook_url/secret + Railway vars + Postgres) -> Task 9. ✓
- Error handling (409 slot_taken, 401 bad sig, 200 unknown ref, idempotent) -> Tasks 6, 8. ✓
- Duration parsing -> Task 1. ✓; ref format -> Task 2. ✓
- Fuera de alcance (notifications, booking.* from dashboard, Gemini/Stripe) -> not implemented, acknowledged in Task 8 comment. ✓

**2. Placeholder scan:** No TBD/TODO. Every code step shows the code; every pure-logic task shows the test.

**3. Type consistency:** `paidBookingsForDate` returns `{ startMin: number; durationMin: number }[]` in Task 5 and is passed DIRECTLY into `computeAvailableSlots` in Tasks 6 and 7 (matching Task 4's `{ startMin, durationMin }` param). `generateBookingRef(date)`, `durationMinutes(text)`, `verifyMerktopSignature({secret,rawBody,signatureHeader,nowSec})`, `markBookingPaid(ref, depositPiId)` are used consistently. Consistent.

## Notes on testability

Tasks 1-4 are pure functions with real jest tests (the money-critical logic: signature verification and double-booking). Tasks 5-6 and 8 touch Postgres, which the website has no jest harness for; their gate is `tsc --noEmit` plus the Task 9 integration check. This mirrors the boundary the spec drew (pure logic tested, DB/routes verified at deploy).
