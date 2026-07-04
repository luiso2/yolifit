# Yoly Gift Cards Section Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a native gift-card purchase surface (home teaser section + `/[locale]/gift-cards` page + form) to the Yoly website, reusing Merktop's existing public buy endpoint.

**Architecture:** The client form posts to a same-origin API route (`/api/gift-cards/buy`); that route injects Yoly's `business_id` and forwards server-to-server to Merktop's public worker endpoint `POST /pub/gift-cards/buy`, which returns a Stripe Checkout URL the client redirects to. No Merktop backend changes. Purchase logic that carries risk (amount parsing, input validation, error mapping) lives in small pure modules with tests; the UI is verified by typecheck + build.

**Tech Stack:** Next.js 15 (App Router), TypeScript, next-intl (es/en), Tailwind 4, zod ^3.24, jest ^29 + ts-jest (testEnvironment `node`), lucide-react.

## Global Constraints

- Package manager: **pnpm** (NOT npm). Node 22.
- Money is in **cents** across the wire to Merktop. Minimum amount **500** ($5.00), maximum **10_000_000** ($100,000).
- Every new user-facing string goes into **both** `messages/es.json` and `messages/en.json`. Default locale is `es`.
- Imports inside `app/`, `components/`, `lib/` use the **`@/`** alias (e.g. `@/lib/...`). Tests in `tests/` use **relative** imports unless jest's `moduleNameMapper` maps `@/` (Task 3 adds it).
- NO em-dash (—) in any copy or code.
- Merktop worker base: `https://merktop-payments.odd-forest-9504.workers.dev`. Yoly business id: `5982fadb-48aa-4119-bc18-a61db8733d70`. Both are public; keep them in `lib/merktop.ts` with `process.env` override.
- The worker public buy contract (do NOT change it): `POST /pub/gift-cards/buy` body `{ business_id, amount(cents 500..10_000_000), buyer_name(1..120), buyer_email, recipient_name?|null, recipient_email?|null, message?|null(<=500) }` → `200 { url, code }`, `400 invalid_input`, `409 merchant_not_ready`, `502 checkout_failed`.
- Premium visual standard: Tailwind brand tokens already defined (`brand-cream #F6F1EA`, `brand-sand`, `brand-caramel`, `brand-bronze #A27043`, `brand-brown`, `brand-ink #2A241C`), fonts `font-heading` (Cormorant), `font-script` (Pinyon), body Outfit. Mobile-first. Add `data-hover="true"` to interactive elements (custom cursor hook).

## File Structure

**New files (`yoly-studio-fit`):**
- `lib/gift-amount.ts` — pure `parseAmountToCents(usd: string): number`.
- `lib/gift-card-schema.ts` — zod schema for the API route body (`giftCardBuySchema`).
- `lib/merktop.ts` — `MERKTOP_WORKER_URL`, `MERKTOP_BUSINESS_ID` constants (env-overridable).
- `app/api/gift-cards/buy/route.ts` — POST proxy handler.
- `components/GiftCardForm.tsx` — client form.
- `app/[locale]/gift-cards/page.tsx` — server page.
- `components/sections/GiftCardsSection.tsx` — home teaser section.
- `tests/gift-amount.test.ts`, `tests/gift-card-schema.test.ts`, `tests/gift-cards-route.test.ts`.

**Modified files:**
- `jest.config.js` — add `moduleNameMapper` for `@/` (Task 3).
- `messages/es.json`, `messages/en.json` — `giftCards` namespace + `nav.giftCards`.
- `components/HomePage.tsx` — render `<GiftCardsSection/>`.
- `components/sections/Navbar.tsx` — add "Gift Cards" nav item (desktop + mobile via shared `menuItems`).

---

### Task 1: Amount parsing helper

**Files:**
- Create: `lib/gift-amount.ts`
- Test: `tests/gift-amount.test.ts`

**Interfaces:**
- Produces: `parseAmountToCents(usd: string): number` — returns integer cents, or `0` for empty/non-numeric/non-positive input.

- [ ] **Step 1: Write the failing test**

Create `tests/gift-amount.test.ts`:

```ts
import { parseAmountToCents } from '../lib/gift-amount';

describe('parseAmountToCents', () => {
  it('converts whole and decimal dollars to cents', () => {
    expect(parseAmountToCents('50')).toBe(5000);
    expect(parseAmountToCents('50.00')).toBe(5000);
    expect(parseAmountToCents('50.5')).toBe(5050);
    expect(parseAmountToCents('5')).toBe(500);
  });

  it('returns 0 for empty, non-numeric, zero, or negative input', () => {
    expect(parseAmountToCents('')).toBe(0);
    expect(parseAmountToCents('abc')).toBe(0);
    expect(parseAmountToCents('0')).toBe(0);
    expect(parseAmountToCents('-5')).toBe(0);
  });

  it('rounds to the nearest cent', () => {
    expect(parseAmountToCents('50.999')).toBe(5100);
    expect(parseAmountToCents('50.001')).toBe(5000);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `pnpm exec jest tests/gift-amount.test.ts`
Expected: FAIL with "Cannot find module '../lib/gift-amount'".

- [ ] **Step 3: Write minimal implementation**

Create `lib/gift-amount.ts`:

```ts
// Converts a user-entered USD string ("50", "50.00", "50.5") into integer
// cents. Returns 0 for empty, non-numeric, zero, or negative input so callers
// can reject it against the $5.00 minimum in one check.
export function parseAmountToCents(usd: string): number {
  const n = parseFloat(usd);
  if (!Number.isFinite(n) || n <= 0) return 0;
  return Math.round(n * 100);
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `pnpm exec jest tests/gift-amount.test.ts`
Expected: PASS (3 tests).

- [ ] **Step 5: Commit**

```bash
git add lib/gift-amount.ts tests/gift-amount.test.ts
git commit -m "feat(gift): USD-to-cents parsing helper"
```

---

### Task 2: API request schema

**Files:**
- Create: `lib/gift-card-schema.ts`
- Test: `tests/gift-card-schema.test.ts`

**Interfaces:**
- Consumes: nothing.
- Produces: `giftCardBuySchema` (zod) and `type GiftCardBuyInput`. Shape: `{ amount: number(int, 500..10_000_000), buyer_name: string(1..120, trimmed), buyer_email: email, recipient_name?: string(<=120)|null, recipient_email?: email|null, message?: string(<=500)|null }`. Note: `business_id` is NOT in this schema — the API route injects it.

- [ ] **Step 1: Write the failing test**

Create `tests/gift-card-schema.test.ts`:

```ts
import { giftCardBuySchema } from '../lib/gift-card-schema';

const valid = {
  amount: 5000,
  buyer_name: 'Ana Perez',
  buyer_email: 'ana@example.com',
  recipient_name: null,
  recipient_email: null,
  message: null,
};

describe('giftCardBuySchema', () => {
  it('accepts a valid buy request (recipient fields nullable)', () => {
    expect(giftCardBuySchema.parse(valid)).toMatchObject({ amount: 5000 });
    expect(giftCardBuySchema.safeParse({ ...valid, recipient_name: 'Sofia', recipient_email: 'sofia@example.com', message: 'Feliz cumple' }).success).toBe(true);
  });

  it('rejects amount below the $5 minimum and above the max', () => {
    expect(giftCardBuySchema.safeParse({ ...valid, amount: 499 }).success).toBe(false);
    expect(giftCardBuySchema.safeParse({ ...valid, amount: 10_000_001 }).success).toBe(false);
    expect(giftCardBuySchema.safeParse({ ...valid, amount: 50.5 }).success).toBe(false);
  });

  it('rejects a missing buyer name and an invalid buyer email', () => {
    expect(giftCardBuySchema.safeParse({ ...valid, buyer_name: '' }).success).toBe(false);
    expect(giftCardBuySchema.safeParse({ ...valid, buyer_email: 'not-an-email' }).success).toBe(false);
  });

  it('rejects an invalid recipient email when provided', () => {
    expect(giftCardBuySchema.safeParse({ ...valid, recipient_email: 'nope' }).success).toBe(false);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `pnpm exec jest tests/gift-card-schema.test.ts`
Expected: FAIL with "Cannot find module '../lib/gift-card-schema'".

- [ ] **Step 3: Write minimal implementation**

Create `lib/gift-card-schema.ts`:

```ts
import { z } from 'zod';

// Body accepted by POST /api/gift-cards/buy. Mirrors Merktop's public buy
// contract EXCEPT business_id, which the API route injects server-side. Amount
// is already in cents (the client converts via parseAmountToCents).
export const giftCardBuySchema = z.object({
  amount: z.number().int().min(500).max(10_000_000),
  buyer_name: z.string().trim().min(1).max(120),
  buyer_email: z.string().email(),
  recipient_name: z.string().trim().max(120).optional().nullable(),
  recipient_email: z.string().email().optional().nullable(),
  message: z.string().max(500).optional().nullable(),
});

export type GiftCardBuyInput = z.infer<typeof giftCardBuySchema>;
```

- [ ] **Step 4: Run test to verify it passes**

Run: `pnpm exec jest tests/gift-card-schema.test.ts`
Expected: PASS (4 tests).

- [ ] **Step 5: Commit**

```bash
git add lib/gift-card-schema.ts tests/gift-card-schema.test.ts
git commit -m "feat(gift): zod schema for the buy API body"
```

---

### Task 3: API route (server-side proxy to Merktop)

**Files:**
- Create: `lib/merktop.ts`
- Create: `app/api/gift-cards/buy/route.ts`
- Modify: `jest.config.js`
- Test: `tests/gift-cards-route.test.ts`

**Interfaces:**
- Consumes: `giftCardBuySchema` (Task 2), `MERKTOP_WORKER_URL` + `MERKTOP_BUSINESS_ID` (this task).
- Produces: `POST(req: Request)` exported from the route. Returns `200 { url }` on success; `400 { error: 'invalid_input' }` on bad body; `409 { error: 'not_ready' }` when the worker says `merchant_not_ready`; `502 { error: 'checkout_failed' }` otherwise or on network failure.

- [ ] **Step 1: Add the `@/` module mapper to jest so the route (which uses `@/` imports) can be imported in tests**

Edit `jest.config.js` to:

```js
/** @type {import('jest').Config} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  testMatch: ['**/tests/**/*.test.ts'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/$1',
  },
};
```

- [ ] **Step 2: Verify existing tests still pass with the mapper**

Run: `pnpm exec jest tests/gift-amount.test.ts tests/booking-schema.test.ts`
Expected: PASS (both suites still green).

- [ ] **Step 3: Create the Merktop constants**

Create `lib/merktop.ts`:

```ts
// Public Merktop worker base + Yoly's business id. Both are public (the id
// appears in gift-card codes / pay URLs), so a constant default is fine; env
// vars can override per environment without a code change.
export const MERKTOP_WORKER_URL =
  process.env.MERKTOP_WORKER_URL ?? 'https://merktop-payments.odd-forest-9504.workers.dev';

export const MERKTOP_BUSINESS_ID =
  process.env.MERKTOP_BUSINESS_ID ?? '5982fadb-48aa-4119-bc18-a61db8733d70';
```

- [ ] **Step 4: Write the failing test**

Create `tests/gift-cards-route.test.ts`:

```ts
import { POST } from '@/app/api/gift-cards/buy/route';

function makeReq(body: unknown): Request {
  return new Request('http://localhost/api/gift-cards/buy', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(body),
  });
}

const validBody = {
  amount: 5000,
  buyer_name: 'Ana',
  buyer_email: 'ana@example.com',
  recipient_name: null,
  recipient_email: null,
  message: null,
};

describe('POST /api/gift-cards/buy', () => {
  afterEach(() => jest.restoreAllMocks());

  it('forwards to the worker with Yoly business_id and returns the url', async () => {
    const fetchMock = jest.spyOn(global, 'fetch').mockResolvedValue(
      new Response(JSON.stringify({ url: 'https://checkout.stripe.com/x', code: 'YOL-AB12' }), { status: 200 }),
    );
    const res = await POST(makeReq(validBody));
    expect(res.status).toBe(200);
    expect(await res.json()).toEqual({ url: 'https://checkout.stripe.com/x' });
    const [url, opts] = fetchMock.mock.calls[0];
    expect(String(url)).toContain('/pub/gift-cards/buy');
    const sent = JSON.parse((opts as RequestInit).body as string);
    expect(sent.business_id).toBe('5982fadb-48aa-4119-bc18-a61db8733d70');
    expect(sent.amount).toBe(5000);
  });

  it('rejects an amount below 500 without calling the worker', async () => {
    const fetchMock = jest.spyOn(global, 'fetch');
    const res = await POST(makeReq({ ...validBody, amount: 400 }));
    expect(res.status).toBe(400);
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it('maps worker 409 to not_ready', async () => {
    jest.spyOn(global, 'fetch').mockResolvedValue(
      new Response(JSON.stringify({ error: 'merchant_not_ready' }), { status: 409 }),
    );
    const res = await POST(makeReq(validBody));
    expect(res.status).toBe(409);
    expect((await res.json()).error).toBe('not_ready');
  });

  it('maps a worker failure to checkout_failed', async () => {
    jest.spyOn(global, 'fetch').mockResolvedValue(
      new Response(JSON.stringify({ error: 'checkout_failed' }), { status: 502 }),
    );
    const res = await POST(makeReq(validBody));
    expect(res.status).toBe(502);
    expect((await res.json()).error).toBe('checkout_failed');
  });

  it('maps a network error to checkout_failed', async () => {
    jest.spyOn(global, 'fetch').mockRejectedValue(new Error('boom'));
    const res = await POST(makeReq(validBody));
    expect(res.status).toBe(502);
    expect((await res.json()).error).toBe('checkout_failed');
  });
});
```

- [ ] **Step 5: Run test to verify it fails**

Run: `pnpm exec jest tests/gift-cards-route.test.ts`
Expected: FAIL with "Cannot find module '@/app/api/gift-cards/buy/route'".

- [ ] **Step 6: Write the route**

Create `app/api/gift-cards/buy/route.ts`:

```ts
import { NextResponse } from 'next/server';
import { giftCardBuySchema } from '@/lib/gift-card-schema';
import { MERKTOP_WORKER_URL, MERKTOP_BUSINESS_ID } from '@/lib/merktop';

// Server-side proxy: validates the buy request, injects Yoly's business_id, and
// forwards to Merktop's public gift-card buy endpoint. Keeps the worker URL off
// the client and maps worker errors to stable codes the form can translate.
export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  const parsed = giftCardBuySchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: 'invalid_input' }, { status: 400 });
  }
  const d = parsed.data;
  try {
    const res = await fetch(`${MERKTOP_WORKER_URL}/pub/gift-cards/buy`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({
        business_id: MERKTOP_BUSINESS_ID,
        amount: d.amount,
        buyer_name: d.buyer_name,
        buyer_email: d.buyer_email,
        recipient_name: d.recipient_name ?? null,
        recipient_email: d.recipient_email ?? null,
        message: d.message ?? null,
      }),
    });
    const data = await res.json().catch(() => ({}));
    if (res.ok && data?.url) {
      return NextResponse.json({ url: data.url });
    }
    if (res.status === 409) {
      return NextResponse.json({ error: 'not_ready' }, { status: 409 });
    }
    return NextResponse.json({ error: 'checkout_failed' }, { status: 502 });
  } catch {
    return NextResponse.json({ error: 'checkout_failed' }, { status: 502 });
  }
}
```

- [ ] **Step 7: Run test to verify it passes**

Run: `pnpm exec jest tests/gift-cards-route.test.ts`
Expected: PASS (5 tests).

- [ ] **Step 8: Commit**

```bash
git add jest.config.js lib/merktop.ts app/api/gift-cards/buy/route.ts tests/gift-cards-route.test.ts
git commit -m "feat(gift): buy API route proxying to Merktop"
```

---

### Task 4: Translations (ES/EN)

**Files:**
- Modify: `messages/es.json`
- Modify: `messages/en.json`

**Interfaces:**
- Produces: `nav.giftCards` and the `giftCards` namespace (`section.*`, `page.*`, `form.*`, `errors.*`) consumed by Tasks 5, 6, 7, 8.

- [ ] **Step 1: Add `nav.giftCards` to `messages/es.json`**

In `messages/es.json`, inside the `"nav"` object, add after `"reservas": "Reservas",`:

```json
    "giftCards": "Gift Cards",
```

- [ ] **Step 2: Add the `giftCards` namespace to `messages/es.json`**

Add a top-level `"giftCards"` object (e.g. right before `"common"`):

```json
  "giftCards": {
    "section": {
      "eyebrow": "Para regalar",
      "title": "Regala una Gift Card",
      "description": "Regala bienestar. Una gift card de Clinic YolyStudio se puede usar en cualquier servicio, sin fecha de vencimiento.",
      "cta": "Comprar una gift card"
    },
    "page": {
      "title": "Gift Cards",
      "subtitle": "Regala una experiencia de bienestar en Clinic YolyStudio.",
      "backToStudio": "Volver al estudio"
    },
    "form": {
      "amountLabel": "Monto (USD)",
      "amountPlaceholder": "Ej. 100",
      "amountHint": "Minimo $5.00. Sin fecha de vencimiento.",
      "buyerName": "Tu nombre",
      "buyerEmail": "Tu correo",
      "recipientTitle": "Para otra persona (opcional)",
      "recipientName": "Nombre del destinatario",
      "recipientEmail": "Correo del destinatario",
      "messageLabel": "Mensaje personal",
      "messagePlaceholder": "Feliz cumpleanos! Disfruta un momento en YolyStudio.",
      "submit": "Comprar gift card",
      "submitting": "Abriendo pago seguro..."
    },
    "errors": {
      "minAmount": "El monto minimo es $5.00.",
      "notReady": "Las gift cards no estan disponibles por ahora.",
      "checkoutFailed": "No pudimos iniciar el pago. Intenta de nuevo.",
      "connection": "Error de conexion. Intenta de nuevo."
    }
  },
```

- [ ] **Step 3: Add `nav.giftCards` to `messages/en.json`**

In `messages/en.json`, inside `"nav"`, after `"reservas": "Bookings",`:

```json
    "giftCards": "Gift Cards",
```

- [ ] **Step 4: Add the `giftCards` namespace to `messages/en.json`**

```json
  "giftCards": {
    "section": {
      "eyebrow": "Gifting",
      "title": "Give a Gift Card",
      "description": "Give the gift of wellness. A Clinic YolyStudio gift card works toward any service, with no expiration.",
      "cta": "Buy a gift card"
    },
    "page": {
      "title": "Gift Cards",
      "subtitle": "Gift a wellness experience at Clinic YolyStudio.",
      "backToStudio": "Back to studio"
    },
    "form": {
      "amountLabel": "Amount (USD)",
      "amountPlaceholder": "e.g. 100",
      "amountHint": "Minimum $5.00. No expiration.",
      "buyerName": "Your name",
      "buyerEmail": "Your email",
      "recipientTitle": "For someone else? (optional)",
      "recipientName": "Recipient name",
      "recipientEmail": "Recipient email",
      "messageLabel": "Personal message",
      "messagePlaceholder": "Happy birthday! Enjoy a moment at YolyStudio.",
      "submit": "Buy gift card",
      "submitting": "Opening secure checkout..."
    },
    "errors": {
      "minAmount": "The minimum amount is $5.00.",
      "notReady": "Gift cards are not available right now.",
      "checkoutFailed": "We could not start the payment. Please try again.",
      "connection": "Connection error. Please try again."
    }
  },
```

- [ ] **Step 5: Verify both files are valid JSON**

Run: `node -e "JSON.parse(require('fs').readFileSync('messages/es.json','utf8')); JSON.parse(require('fs').readFileSync('messages/en.json','utf8')); console.log('OK')"`
Expected: `OK`

- [ ] **Step 6: Commit**

```bash
git add messages/es.json messages/en.json
git commit -m "i18n(gift): gift cards strings (es/en)"
```

---

### Task 5: Gift card form (client component)

**Files:**
- Create: `components/GiftCardForm.tsx`

**Interfaces:**
- Consumes: `parseAmountToCents` (Task 1), the `giftCards.form.*` and `giftCards.errors.*` translations (Task 4), `POST /api/gift-cards/buy` (Task 3).
- Produces: default export `GiftCardForm` (no props). Client component.

- [ ] **Step 1: Create the component**

Create `components/GiftCardForm.tsx`:

```tsx
'use client';

import React, { useState, type FormEvent } from 'react';
import { useTranslations } from 'next-intl';
import { parseAmountToCents } from '@/lib/gift-amount';

const GiftCardForm: React.FC = () => {
  const t = useTranslations('giftCards');

  const [amount, setAmount] = useState('');
  const [buyerName, setBuyerName] = useState('');
  const [buyerEmail, setBuyerEmail] = useState('');
  const [recipientName, setRecipientName] = useState('');
  const [recipientEmail, setRecipientEmail] = useState('');
  const [message, setMessage] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const cents = parseAmountToCents(amount);
    if (cents < 500) {
      setError(t('errors.minAmount'));
      return;
    }
    setBusy(true);
    setError(null);
    try {
      const res = await fetch('/api/gift-cards/buy', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          amount: cents,
          buyer_name: buyerName,
          buyer_email: buyerEmail,
          recipient_name: recipientName || null,
          recipient_email: recipientEmail || null,
          message: message || null,
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (res.ok && data?.url) {
        window.location.href = data.url as string;
        return;
      }
      if (data?.error === 'not_ready') setError(t('errors.notReady'));
      else setError(t('errors.checkoutFailed'));
    } catch {
      setError(t('errors.connection'));
    } finally {
      setBusy(false);
    }
  }

  const inputClass =
    'w-full mt-2 px-4 py-3 rounded-xl bg-brand-cream border border-brand-bronze/25 text-brand-ink placeholder:text-brand-brown/40 focus:outline-none focus:border-brand-bronze transition-colors';
  const labelClass = 'block text-[11px] font-mono uppercase tracking-[0.18em] text-brand-brown';

  return (
    <form
      onSubmit={handleSubmit}
      className="w-full max-w-md mx-auto bg-white/70 border border-brand-bronze/10 rounded-3xl p-6 md:p-8 shadow-sm backdrop-blur-md"
    >
      <p className="text-center text-[11px] font-mono uppercase tracking-[0.22em] text-brand-bronze mb-1">
        🎁 {t('page.title')}
      </p>
      <p className="text-center text-brand-brown/80 text-sm font-light mb-6">{t('page.subtitle')}</p>

      <label className={labelClass}>
        {t('form.amountLabel')}
        <input
          type="number" inputMode="decimal" min="5" step="1"
          value={amount} onChange={(e) => setAmount(e.target.value)}
          placeholder={t('form.amountPlaceholder')} required
          className={inputClass}
        />
      </label>
      <p className="text-xs text-brand-brown/60 mt-1.5 mb-5 font-light">{t('form.amountHint')}</p>

      <label className={labelClass}>
        {t('form.buyerName')}
        <input type="text" value={buyerName} onChange={(e) => setBuyerName(e.target.value)} required className={inputClass} />
      </label>
      <div className="h-4" />
      <label className={labelClass}>
        {t('form.buyerEmail')}
        <input type="email" value={buyerEmail} onChange={(e) => setBuyerEmail(e.target.value)} required className={inputClass} />
      </label>

      <div className="mt-6 pt-5 border-t border-brand-bronze/15">
        <p className="text-[11px] font-mono uppercase tracking-[0.18em] text-brand-brown mb-3">{t('form.recipientTitle')}</p>
        <label className={labelClass}>
          {t('form.recipientName')}
          <input type="text" value={recipientName} onChange={(e) => setRecipientName(e.target.value)} className={inputClass} />
        </label>
        <div className="h-4" />
        <label className={labelClass}>
          {t('form.recipientEmail')}
          <input type="email" value={recipientEmail} onChange={(e) => setRecipientEmail(e.target.value)} className={inputClass} />
        </label>
        <div className="h-4" />
        <label className={labelClass}>
          {t('form.messageLabel')}
          <textarea
            value={message} onChange={(e) => setMessage(e.target.value)}
            maxLength={500} rows={3} placeholder={t('form.messagePlaceholder')}
            className={`${inputClass} resize-none`}
          />
        </label>
      </div>

      {error && (
        <p className="mt-5 text-sm text-red-700 bg-red-50 border border-red-200 rounded-xl px-4 py-2.5">{error}</p>
      )}

      <button
        type="submit" disabled={busy}
        data-hover="true"
        className="mt-6 w-full py-4 rounded-full bg-brand-bronze text-white text-xs font-bold uppercase tracking-widest hover:bg-brand-caramel transition-colors disabled:opacity-60 disabled:cursor-wait"
      >
        {busy ? t('form.submitting') : t('form.submit')}
      </button>

      <p className="text-center text-[10px] font-mono uppercase tracking-[0.2em] text-brand-brown/50 mt-4">
        Powered by <a href="https://merktop.com" className="underline">Merktop</a>
      </p>
    </form>
  );
};

export default GiftCardForm;
```

- [ ] **Step 2: Typecheck**

Run: `pnpm exec tsc --noEmit`
Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add components/GiftCardForm.tsx
git commit -m "feat(gift): native gift card purchase form"
```

---

### Task 6: Gift cards page (`/[locale]/gift-cards`)

**Files:**
- Create: `app/[locale]/gift-cards/page.tsx`

**Interfaces:**
- Consumes: `GiftCardForm` (Task 5), `giftCards.page.*` translations (Task 4). Mirrors the header pattern of `app/[locale]/reservas/page.tsx`.

- [ ] **Step 1: Create the page**

Create `app/[locale]/gift-cards/page.tsx`:

```tsx
import type { Metadata } from 'next';
import { ArrowLeft } from 'lucide-react';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { Link } from '@/i18n/routing';
import GiftCardForm from '@/components/GiftCardForm';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'giftCards' });
  return {
    title: `${t('page.title')} | Clinic YolyStudio`,
    description: t('page.subtitle'),
  };
}

export default async function GiftCardsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: 'giftCards' });

  return (
    <div className="relative min-h-screen bg-brand-cream text-brand-ink overflow-hidden">
      <div
        className="pointer-events-none absolute -top-1/3 left-1/2 -translate-x-1/2 w-[85vw] h-[85vw] max-w-[900px] max-h-[900px] rounded-full opacity-40 blur-3xl"
        style={{ background: 'radial-gradient(circle, rgba(162,112,67,0.28) 0%, rgba(162,112,67,0) 70%)' }}
        aria-hidden
      />

      <header className="fixed top-0 left-0 right-0 z-40 flex items-center justify-between px-6 md:px-12 py-5 bg-brand-cream/85 backdrop-blur-md border-b border-black/[0.05]">
        <Link href="/" className="flex items-center gap-3 font-heading text-xl md:text-2xl tracking-tight text-black leading-none">
          <img src="/media/logo.png" alt="Clinic YolyStudio logo" className="w-12 h-12 md:w-14 md:h-14 object-contain shrink-0" />
          <div className="flex flex-col items-start leading-none">
            <span className="font-script text-2xl md:text-[1.75rem] text-brand-bronze leading-none">Clinic</span>
            <span className="mt-1 leading-none">
              <span className="font-medium text-brand-bronze">Yoly</span>
              <span className="font-light text-brand-caramel">Studio</span>
            </span>
          </div>
        </Link>
        <Link href="/" className="flex items-center gap-2 text-xs font-semibold tracking-widest uppercase text-brand-bronze hover:text-brand-brown transition-colors" data-hover="true">
          <ArrowLeft className="w-4 h-4" />
          <span className="hidden sm:inline">{t('page.backToStudio')}</span>
        </Link>
      </header>

      <main className="relative z-10 min-h-screen flex items-center justify-center px-4 md:px-6 pt-28 pb-10 md:pt-24">
        <div className="w-full max-w-md mx-auto">
          <GiftCardForm />
        </div>
      </main>
    </div>
  );
}
```

- [ ] **Step 2: Typecheck**

Run: `pnpm exec tsc --noEmit`
Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add "app/[locale]/gift-cards/page.tsx"
git commit -m "feat(gift): gift cards page route"
```

---

### Task 7: Home teaser section

**Files:**
- Create: `components/sections/GiftCardsSection.tsx`
- Modify: `components/HomePage.tsx`

**Interfaces:**
- Consumes: `giftCards.section.*` translations (Task 4), `Link` from `@/i18n/routing`.
- Produces: default export `GiftCardsSection` rendered inside `HomePage` between `<Reviews />` and the `#reservas` section.

- [ ] **Step 1: Create the section component**

Create `components/sections/GiftCardsSection.tsx`:

```tsx
'use client';

import React from 'react';
import { Gift } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/routing';

const GiftCardsSection: React.FC = () => {
  const t = useTranslations('giftCards.section');

  return (
    <section id="gift-cards" className="relative z-10 py-20 md:py-28 px-4 md:px-6 bg-white/30 border-t border-b border-black/[0.04]">
      <div className="max-w-3xl mx-auto text-center flex flex-col items-center gap-5">
        <span className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-brand-bronze/10 text-brand-bronze border border-brand-bronze/20">
          <Gift className="w-6 h-6" />
        </span>
        <span className="text-xs font-mono uppercase tracking-[0.3em] text-brand-bronze">{t('eyebrow')}</span>
        <h2 className="font-heading text-3xl md:text-5xl font-normal leading-tight text-brand-ink">{t('title')}</h2>
        <p className="text-brand-brown/80 text-sm md:text-base max-w-xl font-light leading-relaxed">{t('description')}</p>
        <Link
          href="/gift-cards"
          className="mt-2 inline-flex items-center gap-2 px-8 py-4 bg-brand-bronze text-white text-xs font-bold uppercase tracking-widest rounded-full hover:bg-brand-caramel transition-colors"
          data-hover="true"
        >
          {t('cta')}
        </Link>
      </div>
    </section>
  );
};

export default GiftCardsSection;
```

- [ ] **Step 2: Import it in `components/HomePage.tsx`**

Add to the imports (after the `InstagramCta` import, line ~13):

```tsx
import GiftCardsSection from '@/components/sections/GiftCardsSection';
```

- [ ] **Step 3: Render it between `<Reviews />` and the `#reservas` section**

In `components/HomePage.tsx`, change:

```tsx
      <Reviews />

      <section id="reservas" className="relative z-10 py-16 md:py-20 px-4 md:px-6 bg-brand-ink text-brand-cream overflow-hidden">
```

to:

```tsx
      <Reviews />

      <GiftCardsSection />

      <section id="reservas" className="relative z-10 py-16 md:py-20 px-4 md:px-6 bg-brand-ink text-brand-cream overflow-hidden">
```

- [ ] **Step 4: Typecheck**

Run: `pnpm exec tsc --noEmit`
Expected: no errors.

- [ ] **Step 5: Commit**

```bash
git add components/sections/GiftCardsSection.tsx components/HomePage.tsx
git commit -m "feat(gift): home teaser section for gift cards"
```

---

### Task 8: Navbar link (desktop + mobile)

**Files:**
- Modify: `components/sections/Navbar.tsx`

**Interfaces:**
- Consumes: `nav.giftCards` translation (Task 4). The `Navbar` maps a shared `menuItems` array in BOTH the desktop bar and the mobile drawer, so adding one item with an `href` surfaces it in both. `/gift-cards` is a route (like `/reservas`), so it uses the `href` shape, not a scroll `id`.

- [ ] **Step 1: Add the gift cards item to `menuItems`**

In `components/sections/Navbar.tsx`, the `menuItems` array (around line 20) currently ends with the reservas entry. Change:

```tsx
    { key: 'reservas', id: 'reservas', href: '/reservas', label: t('reservas') },
  ] as const;
```

to:

```tsx
    { key: 'reservas', id: 'reservas', href: '/reservas', label: t('reservas') },
    { key: 'giftCards', id: 'gift-cards', href: '/gift-cards', label: t('giftCards') },
  ] as const;
```

(`t` here is `useTranslations('nav')`, so `t('giftCards')` resolves to the `nav.giftCards` string added in Task 4. Both the desktop map at `hidden lg:flex` and the mobile drawer map render `href` items as `<Link>`, so no other change is needed.)

- [ ] **Step 2: Typecheck**

Run: `pnpm exec tsc --noEmit`
Expected: no errors.

- [ ] **Step 3: Full build to confirm the whole surface compiles**

Run: `pnpm build`
Expected: build succeeds; route list includes `/[locale]/gift-cards` and `/api/gift-cards/buy`.

- [ ] **Step 4: Run the full test suite**

Run: `pnpm exec jest`
Expected: all suites pass (existing + gift-amount + gift-card-schema + gift-cards-route).

- [ ] **Step 5: Commit**

```bash
git add components/sections/Navbar.tsx
git commit -m "feat(gift): gift cards link in desktop and mobile nav"
```

---

## Deploy (after all tasks, with Jose's authorization)

Gift cards inherit Yoly's Stripe readiness (`charges_enabled=1`); no Merktop backend change and no new required env vars (constants have public defaults). To ship:

```bash
git push origin master   # Railway auto-deploys the Yolifit service
```

Then verify in production: home shows the gift cards section, `/es/gift-cards` and `/en/gift-cards` render the form, and a valid submit redirects to Stripe Checkout for the entered amount.

## Notes on scope

- No balance-lookup UI (out of scope per spec).
- Thanks screen is Merktop's `/gift/thanks` (the worker sets `success_url`); nothing to build here.
- No Merktop backend / D1 / email changes.
