# Yoly Studio Fit Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Migrar el sitio Yoly Studio (SPA Vite exportada de AI Studio) a una app Next.js 15 con branding oficial, sección de video a mitad de página, chat Gemini server-side y pagos reales con Stripe Checkout en las reservas.

**Architecture:** App Next.js 15 App Router de una página principal compuesta por secciones cliente portadas del `App.tsx` legacy, más dos route handlers (`/api/chat`, `/api/reservas`) y una página server de confirmación de pago. Sin base de datos: Stripe guarda la reserva completa en `metadata` de la Checkout Session.

**Tech Stack:** Next.js 15 (App Router), TypeScript, Tailwind CSS 4, React 19, framer-motion 12, lucide-react, stripe, @google/genai, zod, jest + ts-jest, pnpm 10, Node 22.

## Global Constraints

- Gestor de paquetes: **pnpm** (NUNCA npm). Node 22.
- Scripts obligatorios en package.json: `dev`, `build`, `start`, `test` (jest), `lint` (`tsc --noEmit`) (CLAUDE.md sección 8; `dev`/`build`/`start` usan next, no tsx).
- Secretos SOLO en `.env` (gitignored): `GEMINI_API_KEY`, `STRIPE_SECRET_KEY`. `.env.example` con placeholders. La key Gemini del zip legacy NO se copia a ningún archivo del repo.
- Todo copy visible en español. Código e identificadores en inglés.
- PROHIBIDO el em-dash en cualquier copy.
- Footer con "Powered by Merktop" -> https://merktop.com.
- Mobile-first en toda UI.
- Commits atómicos locales al cerrar cada task (CLAUDE.md sección 12). NO crear ramas, NO worktrees, NO push.
- Fuente legacy de referencia (solo lectura, ya extraída): copiada a `legacy/` dentro del proyecto (gitignored).
- Mapa de colores legacy -> branding (aplicar en TODO código portado):
  - `#FAF8F5` -> `#F6F1EA` (brand-cream, fondo)
  - `#F5EFEB` -> `#EDE5DA` (brand-sand, superficies)
  - `#b48c68` -> `#B19073` (brand-caramel, acento)
  - `#1A1A1A` -> `#2A241C` (brand-ink, texto)
  - Cualquier otro hex: mapear al token más cercano de la paleta (bronce `#A27043`, marrón `#5B4D3C`).

---

### Task 1: Scaffold del proyecto Next.js 15 + assets

**Files:**
- Create: `~/Desktop/yoly-studio-fit/package.json`, `tsconfig.json`, `next.config.ts`, `postcss.config.mjs`, `.gitignore`, `.env`, `.env.example`, `app/layout.tsx`, `app/page.tsx` (placeholder), `app/globals.css` (base)
- Copy: assets legacy y video a `public/media/`, fuente legacy a `legacy/`

**Interfaces:**
- Produces: proyecto compilable con `pnpm build`; alias `@/*`; assets en `/media/*.jpg` y `/media/yoly-studio.mp4` + poster.

- [ ] **Step 1: Crear estructura y copiar fuentes legacy**

```bash
cd ~/Desktop/yoly-studio-fit
mkdir -p app lib components public/media legacy
cp -R "/private/tmp/claude-501/-Users-josemichaelhernandezvargas/3366364e-af90-4c1e-b7e0-82769bc5946d/scratchpad/yoly-explore/"{App.tsx,types.ts,components,services,index.html} legacy/
cp "/private/tmp/claude-501/-Users-josemichaelhernandezvargas/3366364e-af90-4c1e-b7e0-82769bc5946d/scratchpad/yoly-explore/src/assets/images/"*.jpg public/media/
cp "/Users/josemichaelhernandezvargas/Downloads/WhatsApp Video 2026-07-01 at 18.03.39.mp4" public/media/yoly-studio.mp4
ffmpeg -y -ss 0.5 -i public/media/yoly-studio.mp4 -frames:v 1 -q:v 3 public/media/yoly-studio-poster.jpg
```

- [ ] **Step 2: Escribir package.json**

```json
{
  "name": "yoly-studio-fit",
  "private": true,
  "version": "0.1.0",
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "test": "jest",
    "lint": "tsc --noEmit"
  },
  "dependencies": {
    "@google/genai": "^1.29.0",
    "framer-motion": "^12.23.24",
    "lucide-react": "^0.553.0",
    "next": "^15.5.0",
    "react": "^19.2.0",
    "react-dom": "^19.2.0",
    "stripe": "^18.0.0",
    "zod": "^3.24.0"
  },
  "devDependencies": {
    "@tailwindcss/postcss": "^4.1.0",
    "@types/jest": "^29.5.0",
    "@types/node": "^22.14.0",
    "@types/react": "^19.0.0",
    "@types/react-dom": "^19.0.0",
    "jest": "^29.7.0",
    "tailwindcss": "^4.1.0",
    "ts-jest": "^29.2.0",
    "typescript": "~5.8.2"
  }
}
```

- [ ] **Step 3: Escribir tsconfig.json, next.config.ts, postcss.config.mjs**

`tsconfig.json`:
```json
{
  "compilerOptions": {
    "target": "ES2022",
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": false,
    "skipLibCheck": true,
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "plugins": [{ "name": "next" }],
    "paths": { "@/*": ["./*"] }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules", "legacy"]
}
```

`next.config.ts`:
```ts
import type { NextConfig } from 'next';

const nextConfig: NextConfig = {};

export default nextConfig;
```

`postcss.config.mjs`:
```js
export default { plugins: { '@tailwindcss/postcss': {} } };
```

- [ ] **Step 4: .gitignore, .env y .env.example**

`.gitignore`:
```
node_modules/
.next/
out/
.env*
!.env.example
*.log
.DS_Store
legacy/
```

`.env.example`:
```
GEMINI_API_KEY=your_gemini_api_key
STRIPE_SECRET_KEY=sk_test_xxx
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

`.env`: mismo contenido que `.env.example` (Jose llenará las keys reales; NO copiar la key del zip legacy).

- [ ] **Step 5: layout, page y globals mínimos para compilar**

`app/globals.css`:
```css
@import "tailwindcss";
```

`app/layout.tsx`:
```tsx
import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Yoly Studio | Estética, Bienestar & Notaría en Miami',
  description:
    'Santuario boutique de cosmetología y estética de alta gama con servicios notariales oficiales en Miami, Florida.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  );
}
```

`app/page.tsx`:
```tsx
export default function Home() {
  return <main>Yoly Studio</main>;
}
```

- [ ] **Step 6: Instalar y verificar puertas**

```bash
cd ~/Desktop/yoly-studio-fit && git init -q && pnpm install && pnpm lint && pnpm build
```
Expected: install sin errores, `tsc` limpio, `next build` exitoso.

---

### Task 2: Branding (tokens, fuentes, base styles)

**Files:**
- Modify: `app/globals.css`, `app/layout.tsx`

**Interfaces:**
- Produces: tokens Tailwind `brand-cream #F6F1EA`, `brand-sand #EDE5DA`, `brand-caramel #B19073`, `brand-bronze #A27043`, `brand-brown #5B4D3C`, `brand-ink #2A241C`; clases `font-heading` (Playfair Display) y body Inter; scroll behavior del legacy.

- [ ] **Step 1: globals.css con @theme y estilos base (portados de legacy/index.html líneas 12-33)**

```css
@import "tailwindcss";

@theme {
  --color-brand-cream: #F6F1EA;
  --color-brand-sand: #EDE5DA;
  --color-brand-caramel: #B19073;
  --color-brand-bronze: #A27043;
  --color-brand-brown: #5B4D3C;
  --color-brand-ink: #2A241C;
  --font-sans: var(--font-inter), sans-serif;
  --font-heading: var(--font-playfair), serif;
}

html {
  scroll-behavior: smooth;
  scroll-padding-top: 100px;
  -ms-overflow-style: none;
  scrollbar-width: none;
}

::-webkit-scrollbar {
  display: none;
}

body {
  font-family: var(--font-inter), sans-serif;
  background-color: #F6F1EA;
  color: #2A241C;
  overflow-x: hidden;
}

h1, h2, h3, .font-heading {
  font-family: var(--font-playfair), serif;
}
```

- [ ] **Step 2: Fuentes con next/font en layout.tsx**

```tsx
import type { Metadata } from 'next';
import { Inter, Playfair_Display } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'], weight: ['300', '400', '500', '600', '700'], variable: '--font-inter' });
const playfair = Playfair_Display({ subsets: ['latin'], style: ['normal', 'italic'], weight: ['400', '600', '700'], variable: '--font-playfair' });

export const metadata: Metadata = {
  title: 'Yoly Studio | Estética, Bienestar & Notaría en Miami',
  description:
    'Santuario boutique de cosmetología y estética de alta gama con servicios notariales oficiales en Miami, Florida.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body className={`${inter.variable} ${playfair.variable}`}>{children}</body>
    </html>
  );
}
```

- [ ] **Step 3: Verificar**

```bash
pnpm lint && pnpm build
```
Expected: sin errores.

---

### Task 3: lib de dominio (types, services, tickets) con TDD

**Files:**
- Create: `lib/types.ts`, `lib/services.ts`, `lib/tickets.ts`, `jest.config.ts`, `tests/tickets.test.ts`

**Interfaces:**
- Produces: `SpaService` (con `priceCents: number | null`), `ChatMessage`, `SPA_SERVICES: SpaService[]` (6 servicios, ids '1'..'6', notaría id '6' con `priceCents: null`), `generateTicketCode(date: Date, random?: () => number): string`, `ticketFromSessionId(sessionId: string, dateISO: string): string`.

- [ ] **Step 1: jest.config.ts**

```ts
import type { Config } from 'jest';

const config: Config = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  testMatch: ['**/tests/**/*.test.ts'],
};

export default config;
```

- [ ] **Step 2: Test que falla para tickets**

`tests/tickets.test.ts`:
```ts
import { generateTicketCode, ticketFromSessionId } from '../lib/tickets';

describe('generateTicketCode', () => {
  it('genera código YS-YYYYMMDD-NNNN determinista con random inyectado', () => {
    const date = new Date('2026-07-15T12:00:00Z');
    expect(generateTicketCode(date, () => 0)).toBe('YS-20260715-1000');
    expect(generateTicketCode(date, () => 0.9999)).toBe('YS-20260715-9999');
  });
});

describe('ticketFromSessionId', () => {
  it('deriva sufijo estable de 6 chars del session id', () => {
    expect(ticketFromSessionId('cs_test_a1B2c3D4e5F6xyz789', '2026-07-15')).toBe('YS-20260715-XYZ789');
  });
});
```

- [ ] **Step 3: Verificar que falla**

```bash
pnpm test
```
Expected: FAIL (module `../lib/tickets` no existe).

- [ ] **Step 4: Implementar lib/tickets.ts**

```ts
export function generateTicketCode(date: Date, random: () => number = Math.random): string {
  const dateStr = date.toISOString().slice(0, 10).replace(/-/g, '');
  const num = Math.floor(1000 + random() * 9000);
  return `YS-${dateStr}-${num}`;
}

export function ticketFromSessionId(sessionId: string, dateISO: string): string {
  const dateStr = dateISO.replace(/-/g, '');
  const suffix = sessionId.replace(/[^a-zA-Z0-9]/g, '').slice(-6).toUpperCase();
  return `YS-${dateStr}-${suffix}`;
}
```

- [ ] **Step 5: Verificar que pasa**

```bash
pnpm test
```
Expected: PASS (3 asserts).

- [ ] **Step 6: lib/types.ts y lib/services.ts**

`lib/types.ts` (portar de `legacy/types.ts`, extender SpaService):
```ts
export interface SpaService {
  id: string;
  name: string;
  category: string;
  image: string;
  duration: string;
  price: string;
  priceCents: number | null;
  benefits: string[];
  description: string;
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
  isError?: boolean;
}
```

`lib/services.ts`: copiar el array `SPA_SERVICES` COMPLETO de `legacy/App.tsx` líneas 21-82 (los 6 objetos con name/category/duration/price/benefits/description textuales) con estos cambios exactos:
- `import { SpaService } from '@/lib/types';` y `export const SPA_SERVICES: SpaService[] = [...]`.
- Imágenes locales: servicio '1' `image: '/media/skincare_treatment_1782918671588.jpg'`; los servicios con URLs de Unsplash conservan su URL.
- Agregar `priceCents` a cada servicio: '1' -> `12000`, '2' -> `8500`, '3' -> `9500`, '4' -> `6500`, '5' -> `9000`, '6' (notaría) -> `null`.

También copiar `FAQ_ITEMS` (líneas 84-109 del legacy) a `lib/services.ts` como `export const FAQ_ITEMS: { question: string; answer: string }[]` sin cambios de texto.

- [ ] **Step 7: Verificar**

```bash
pnpm lint && pnpm test
```
Expected: limpio y PASS.

---

### Task 4: Schema de reserva (Zod) con TDD

**Files:**
- Create: `lib/booking-schema.ts`, `tests/booking-schema.test.ts`

**Interfaces:**
- Produces: `bookingSchema` (Zod) y `BookingInput = { serviceId: string; dateISO: string; time: string; name: string; email: string; phone: string; notes?: string }`.

- [ ] **Step 1: Test que falla**

`tests/booking-schema.test.ts`:
```ts
import { bookingSchema } from '../lib/booking-schema';

const valid = {
  serviceId: '1',
  dateISO: '2026-07-15',
  time: '10:30 AM',
  name: 'Maria Perez',
  email: 'maria@example.com',
  phone: '+1 305 555 0100',
  notes: 'Piel sensible',
};

describe('bookingSchema', () => {
  it('acepta una reserva válida (notes opcional)', () => {
    expect(bookingSchema.parse(valid)).toMatchObject({ serviceId: '1' });
    const { notes, ...noNotes } = valid;
    expect(bookingSchema.parse(noNotes).notes).toBeUndefined();
  });

  it('rechaza email inválido, fecha mal formada y nombre corto', () => {
    expect(bookingSchema.safeParse({ ...valid, email: 'no-email' }).success).toBe(false);
    expect(bookingSchema.safeParse({ ...valid, dateISO: '15/07/2026' }).success).toBe(false);
    expect(bookingSchema.safeParse({ ...valid, name: 'A' }).success).toBe(false);
  });
});
```

- [ ] **Step 2: Verificar que falla**

```bash
pnpm test
```
Expected: FAIL (módulo no existe).

- [ ] **Step 3: Implementar lib/booking-schema.ts**

```ts
import { z } from 'zod';

export const bookingSchema = z.object({
  serviceId: z.string().min(1),
  dateISO: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  time: z.string().min(1),
  name: z.string().trim().min(2),
  email: z.string().email(),
  phone: z.string().trim().min(7),
  notes: z.string().max(500).optional(),
});

export type BookingInput = z.infer<typeof bookingSchema>;
```

- [ ] **Step 4: Verificar que pasa**

```bash
pnpm test && pnpm lint
```
Expected: PASS.

---

### Task 5: Stripe + endpoint de reservas

**Files:**
- Create: `lib/stripe.ts`, `app/api/reservas/route.ts`

**Interfaces:**
- Consumes: `bookingSchema`, `SPA_SERVICES`, `generateTicketCode`.
- Produces: `getStripe(): Stripe | null`; `POST /api/reservas` que responde `{url}` (pago), `{ticket}` (notaría), 400 (validación), 503 (sin key).

- [ ] **Step 1: lib/stripe.ts**

```ts
import Stripe from 'stripe';

export function getStripe(): Stripe | null {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key || key.startsWith('sk_test_xxx')) return null;
  return new Stripe(key);
}
```

- [ ] **Step 2: app/api/reservas/route.ts**

```ts
import { NextResponse } from 'next/server';
import { bookingSchema } from '@/lib/booking-schema';
import { SPA_SERVICES } from '@/lib/services';
import { getStripe } from '@/lib/stripe';
import { generateTicketCode } from '@/lib/tickets';

export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  const parsed = bookingSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: 'Datos de reserva inválidos', issues: parsed.error.flatten().fieldErrors },
      { status: 400 },
    );
  }
  const data = parsed.data;
  const service = SPA_SERVICES.find((s) => s.id === data.serviceId);
  if (!service) {
    return NextResponse.json({ error: 'Servicio no encontrado' }, { status: 400 });
  }

  if (service.priceCents === null) {
    return NextResponse.json({ ticket: generateTicketCode(new Date(`${data.dateISO}T12:00:00Z`)) });
  }

  const stripe = getStripe();
  if (!stripe) {
    return NextResponse.json(
      { error: 'Los pagos en línea no están disponibles en este momento. Por favor intenta más tarde.' },
      { status: 503 },
    );
  }

  const origin = process.env.NEXT_PUBLIC_SITE_URL || new URL(req.url).origin;
  const session = await stripe.checkout.sessions.create({
    mode: 'payment',
    customer_email: data.email,
    line_items: [
      {
        quantity: 1,
        price_data: {
          currency: 'usd',
          unit_amount: service.priceCents,
          product_data: {
            name: service.name,
            description: `${service.duration} · ${data.dateISO} ${data.time}`,
          },
        },
      },
    ],
    metadata: {
      serviceId: service.id,
      serviceName: service.name,
      dateISO: data.dateISO,
      time: data.time,
      name: data.name,
      email: data.email,
      phone: data.phone,
      notes: data.notes ?? '',
    },
    success_url: `${origin}/reserva/confirmada?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${origin}/#reservas`,
  });

  return NextResponse.json({ url: session.url });
}
```

- [ ] **Step 3: Verificar con curl (dev server corriendo: `pnpm dev`)**

```bash
# Validación
curl -s -X POST localhost:3000/api/reservas -H 'content-type: application/json' -d '{"serviceId":"1"}' | head -c 300
# Expected: {"error":"Datos de reserva inválidos",...} y status 400

# Notaría sin pago
curl -s -X POST localhost:3000/api/reservas -H 'content-type: application/json' \
  -d '{"serviceId":"6","dateISO":"2026-07-15","time":"10:30 AM","name":"Maria Perez","email":"m@e.com","phone":"3055550100"}'
# Expected: {"ticket":"YS-20260715-NNNN"}

# Servicio pagado sin key configurada
curl -s -o /dev/null -w '%{http_code}' -X POST localhost:3000/api/reservas -H 'content-type: application/json' \
  -d '{"serviceId":"1","dateISO":"2026-07-15","time":"10:30 AM","name":"Maria Perez","email":"m@e.com","phone":"3055550100"}'
# Expected: 503 (o {"url":"https://checkout.stripe.com/..."} si hay key de test en .env)
```

- [ ] **Step 4: Puertas**

```bash
pnpm lint && pnpm build
```
Expected: limpio.

---

### Task 6: Chat Gemini server-side + componente AIChat

**Files:**
- Create: `app/api/chat/route.ts`, `components/AIChat.tsx`

**Interfaces:**
- Consumes: `ChatMessage` de `@/lib/types`.
- Produces: `POST /api/chat` body `{message: string, history: ChatMessage[]}` -> `{text: string}`; componente `<AIChat />` (client) botón flotante + panel.

- [ ] **Step 1: app/api/chat/route.ts**

El `SYSTEM_INSTRUCTION` se copia VERBATIM del template string de `legacy/services/geminiService.ts` (líneas 26-49, desde "Eres 'Yoly AI'..." hasta "...legal en cada respuesta.").

```ts
import { NextResponse } from 'next/server';
import { GoogleGenAI } from '@google/genai';

const SYSTEM_INSTRUCTION = `<< COPIAR VERBATIM DE legacy/services/geminiService.ts líneas 26-49 >>`;

export async function POST(req: Request) {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === 'your_gemini_api_key') {
    return NextResponse.json({ text: 'Sistemas fuera de línea temporalmente. 🌸' }, { status: 503 });
  }
  const body = await req.json().catch(() => null);
  const message: unknown = body?.message;
  const history: { role: 'user' | 'model'; text: string }[] = Array.isArray(body?.history) ? body.history : [];
  if (typeof message !== 'string' || !message.trim()) {
    return NextResponse.json({ error: 'Mensaje vacío' }, { status: 400 });
  }
  try {
    const ai = new GoogleGenAI({ apiKey });
    const chat = ai.chats.create({
      model: 'gemini-3.5-flash',
      config: { systemInstruction: SYSTEM_INSTRUCTION },
      history: history.slice(-20).map((m) => ({ role: m.role, parts: [{ text: m.text }] })),
    });
    const response = await chat.sendMessage({ message });
    return NextResponse.json({ text: response.text || 'La transmisión fue interrumpida.' });
  } catch (error) {
    console.error('Gemini error:', error);
    return NextResponse.json({ text: 'Se perdió la señal. Por favor intenta de nuevo en unos momentos.' }, { status: 502 });
  }
}
```

Nota: el chat es stateless por request (serverless); el cliente envía el historial completo.

- [ ] **Step 2: Portar components/AIChat.tsx**

Copiar `legacy/components/AIChat.tsx` a `components/AIChat.tsx` con estas adaptaciones exactas:
1. Añadir `'use client';` como primera línea.
2. `import { ChatMessage } from '@/lib/types';` (antes `../types`).
3. Eliminar `import { sendMessageToGemini } from '../services/geminiService';`.
4. Reemplazar la llamada `const responseText = await sendMessageToGemini(input);` (línea 47 legacy) por:
```ts
const res = await fetch('/api/chat', {
  method: 'POST',
  headers: { 'content-type': 'application/json' },
  body: JSON.stringify({ message: input, history: messages }),
});
const dataJson = await res.json().catch(() => ({ text: 'Se perdió la señal. Por favor intenta de nuevo.' }));
const responseText: string = dataJson.text ?? dataJson.error ?? 'Se perdió la señal. Por favor intenta de nuevo.';
```
5. Aplicar el mapa de colores del Global Constraints a todos los hex del archivo.

- [ ] **Step 3: Verificar**

```bash
pnpm lint && pnpm build
```
Expected: limpio. (El smoke del chat en vivo requiere GEMINI_API_KEY; se prueba en Task 11.)

---

### Task 7: Portar componentes visuales

**Files:**
- Create: `components/FluidBackground.tsx`, `components/CustomCursor.tsx`, `components/GradientText.tsx`, `components/ServiceCard.tsx`

**Interfaces:**
- Consumes: `SpaService` de `@/lib/types`.
- Produces: componentes client con misma API que legacy: `<FluidBackground />`, `<CustomCursor />`, `<GradientText>{children}</GradientText>` (default export del archivo GlitchText legacy), `<ServiceCard service={s} onClick={() => ...} index={i} />`.

- [ ] **Step 1: Copiar y adaptar los 4 componentes**

Para cada uno (`legacy/components/FluidBackground.tsx`, `CustomCursor.tsx`, `GlitchText.tsx` -> renombrar archivo a `GradientText.tsx`, `ServiceCard.tsx`):
1. `'use client';` como primera línea.
2. Imports de tipos: `../types` -> `@/lib/types`.
3. Aplicar el mapa de colores del Global Constraints (los hex aparecen en gradientes de FluidBackground, colores del cursor y bordes/overlays de ServiceCard).
4. NO cambiar lógica, animaciones ni JSX.

- [ ] **Step 2: Verificar**

```bash
pnpm lint
```
Expected: limpio.

---

### Task 8: Página principal parte 1 (shell, nav, hero, footer)

**Files:**
- Create: `components/sections/Navbar.tsx`, `components/sections/Hero.tsx`, `components/sections/Footer.tsx`, `components/HomePage.tsx`
- Modify: `app/page.tsx`

**Interfaces:**
- Consumes: `FluidBackground`, `CustomCursor`, `GradientText`, `AIChat`.
- Produces: `<HomePage />` (client component raíz que contiene TODO el estado que hoy vive en legacy App.tsx); `app/page.tsx` server component que solo renderiza `<HomePage />`. `Navbar({ mobileMenuOpen, setMobileMenuOpen })`, `Hero()` y `Footer()` como client components.

- [ ] **Step 1: Crear HomePage.tsx como shell**

`components/HomePage.tsx` replica la estructura de `legacy/App.tsx`: copiar las líneas 111-311 (estado y handlers del componente App) y el wrapper del return (líneas 312-316 y cierre), con:
1. `'use client';` primera línea.
2. Imports: componentes desde `@/components/...`, data desde `@/lib/services` (`SPA_SERVICES`, `FAQ_ITEMS`), tipos desde `@/lib/types`.
3. Las imágenes importadas con `import heroImage from './src/assets/...'` se reemplazan por constantes string: `const heroImage = '/media/spa_cabin_hero_1782918660892.jpg';` y `const featuredImage = '/media/skincare_treatment_1782918671588.jpg';`.
4. Por ahora renderiza `<CustomCursor />`, `<FluidBackground />`, `<Navbar .../>`, `<Hero />`, `<Footer />`, `<AIChat />`; las demás secciones se agregan en Tasks 9-11.
5. El handler `handleCalBookingSubmit` se reemplaza en Task 10 (dejar el del legacy tal cual por ahora).

`app/page.tsx`:
```tsx
import HomePage from '@/components/HomePage';

export default function Home() {
  return <HomePage />;
}
```

- [ ] **Step 2: Portar Navbar, Hero y Footer**

- `Navbar.tsx`: copiar `legacy/App.tsx` líneas 317-408 (nav completo + menú móvil). Recibe props `{ mobileMenuOpen, setMobileMenuOpen }`.
- `Hero.tsx`: copiar líneas 409-487 (header 100svh con parallax `useScroll`). El `useScroll`/`useTransform` (`y`, `opacity`, legacy líneas 112-114) se mueve DENTRO de Hero.
- `Footer.tsx`: copiar líneas 1395-1421. Añadir al final del footer, junto al copyright, el enlace: `<a href="https://merktop.com" target="_blank" rel="noopener noreferrer">Powered by Merktop</a>` con clase `text-brand-brown/60 hover:text-brand-caramel text-xs tracking-widest uppercase transition-colors`.
- Los tres: `'use client';`, mapa de colores, imports `@/`.

- [ ] **Step 3: Verificar render**

```bash
pnpm lint && pnpm build && pnpm dev &
sleep 5 && curl -s localhost:3000 | grep -o 'Yoly Studio' | head -1
```
Expected: build limpio y "Yoly Studio" en el HTML.

---

### Task 9: Página principal parte 2 (servicios, experiencia, instagram, FAQ, modal)

**Files:**
- Create: `components/sections/Services.tsx`, `components/sections/Experience.tsx`, `components/sections/InstagramCta.tsx`, `components/sections/Faq.tsx`, `components/ServiceModal.tsx`
- Modify: `components/HomePage.tsx`

**Interfaces:**
- Consumes: `ServiceCard`, `GradientText`, `SPA_SERVICES`, `FAQ_ITEMS`, `SpaService`.
- Produces: `Services({ onSelect }: { onSelect: (s: SpaService) => void })`, `Experience()`, `InstagramCta()`, `Faq({ openIdx, setOpenIdx })`, `ServiceModal({ service, onClose, onNavigate, ...bookingProps })`.

- [ ] **Step 1: Portar secciones desde legacy/App.tsx**

- `Services.tsx`: líneas 488-517 (`<section id="servicios">`).
- `Experience.tsx`: líneas 518-594 (`<section id="experiencia">`).
- `InstagramCta.tsx`: líneas 595-671 (`<section id="instagram">`; conserva el link a https://www.instagram.com/yolystudio.fit).
- `Faq.tsx`: líneas 1331-1394 (acordeón con `openFaqIdx`).
- `ServiceModal.tsx`: líneas 1425-1637 (el `<AnimatePresence>{selectedService && ...}`), incluyendo el mini-form de booking del modal y sus estados (`bookingName`, etc., legacy líneas 135-142 y handlers 182-311): mover esos estados DENTRO de ServiceModal para que HomePage no los cargue.
- Todos: `'use client';`, mapa de colores, imports `@/`, imágenes locales `/media/...`.

- [ ] **Step 2: Integrar en HomePage y verificar**

Renderizar en orden: Navbar, Hero, Services, Experience, InstagramCta, (VideoShowcase va aquí en Task 10), Reservas (Task 10), Faq, Footer, AIChat, ServiceModal.

```bash
pnpm lint && pnpm build
```
Expected: limpio; en dev, las 4 secciones visibles con anchors funcionando.

---

### Task 10: VideoShowcase + centro de reservas con Stripe

**Files:**
- Create: `components/sections/VideoShowcase.tsx`, `components/sections/Reservas.tsx`
- Modify: `components/HomePage.tsx`

**Interfaces:**
- Consumes: `POST /api/reservas` (Task 5), `SPA_SERVICES`.
- Produces: `<VideoShowcase />`; `<Reservas />` (calendario 3 pasos que al confirmar llama al API y redirige a Stripe o muestra ticket).

- [ ] **Step 1: VideoShowcase.tsx (componente nuevo, código completo)**

```tsx
'use client';

import { motion } from 'framer-motion';
import { Sparkles, Heart } from 'lucide-react';

export default function VideoShowcase() {
  return (
    <section id="estudio" className="relative z-10 py-20 md:py-32 overflow-hidden border-t border-black/[0.04]">
      <div className="max-w-6xl mx-auto px-4 md:px-6 grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16 items-center">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className="order-2 md:order-1"
        >
          <div className="flex items-center gap-2 mb-6">
            <Sparkles className="w-4 h-4 text-brand-caramel" />
            <span className="text-xs font-bold uppercase tracking-[0.25em] text-brand-brown">Dentro del estudio</span>
          </div>
          <h2 className="font-heading text-4xl md:text-5xl text-brand-ink mb-6 leading-tight">
            Vive la experiencia <span className="italic text-brand-caramel">Yoly Studio</span>
          </h2>
          <p className="text-brand-brown leading-relaxed mb-8 max-w-md">
            Un santuario boutique en Miami donde cada detalle está pensado para tu bienestar.
            Descubre el ambiente, la calidez y el cuidado que nos distinguen.
          </p>
          <a
            href="#reservas"
            className="inline-flex items-center gap-2 px-8 py-4 bg-brand-ink text-brand-cream text-xs font-bold uppercase tracking-widest rounded-full hover:bg-brand-bronze transition-colors"
            data-hover="true"
          >
            <Heart className="w-4 h-4" /> Reserva tu momento
          </a>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.92 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.9, ease: 'easeOut' }}
          className="order-1 md:order-2 flex justify-center"
        >
          <div className="relative w-full max-w-[320px]">
            <div className="absolute -inset-6 bg-gradient-to-tr from-brand-caramel/25 via-brand-sand/40 to-transparent rounded-[3rem] blur-2xl" aria-hidden />
            <div className="relative rounded-[2.2rem] overflow-hidden border border-white/50 shadow-2xl shadow-brand-bronze/20 bg-white/30 backdrop-blur-sm p-2">
              <video
                className="w-full aspect-[480/816] object-cover rounded-[1.8rem]"
                src="/media/yoly-studio.mp4"
                poster="/media/yoly-studio-poster.jpg"
                autoPlay
                muted
                loop
                playsInline
                preload="metadata"
              />
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Portar Reservas.tsx y conectar Stripe**

Copiar `legacy/App.tsx` líneas 672-1330 (`<section id="reservas">`) más sus estados (legacy líneas 119-132: `calStep`, `selectedCategory`, `calService`, `calDate`, `calMonth`, `calYear`, `calTime`, `calName`, `calEmail`, `calPhone`, `calNotes`, `calSubmitting`, `calSuccess`, `calSuccessTicket`) DENTRO del componente, con `'use client';`, mapa de colores e imports `@/`.

Reemplazar COMPLETO el `handleCalBookingSubmit` del legacy (líneas 156-180, que simula con setTimeout) por:

```tsx
const [calError, setCalError] = useState<string | null>(null);

const handleCalBookingSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  if (!calDate || !calTime || !calName || !calEmail || !calPhone) return;
  setCalSubmitting(true);
  setCalError(null);
  try {
    const res = await fetch('/api/reservas', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({
        serviceId: calService.id,
        dateISO: calDate.toISOString().slice(0, 10),
        time: calTime,
        name: calName,
        email: calEmail,
        phone: calPhone,
        notes: calNotes || undefined,
      }),
    });
    const data = await res.json();
    if (res.ok && data.url) {
      window.location.href = data.url; // Stripe Checkout
      return;
    }
    if (res.ok && data.ticket) {
      // Servicio sin pago online (notaría): ticket directo
      setCalSuccess(true);
      setCalSuccessTicket({
        code: data.ticket,
        service: calService,
        date: calDate,
        time: calTime,
        name: calName,
        email: calEmail,
        phone: calPhone,
        notes: calNotes,
      });
      return;
    }
    setCalError(data.error ?? 'No pudimos procesar tu reserva. Intenta de nuevo.');
  } catch {
    setCalError('Error de conexión. Por favor intenta de nuevo.');
  } finally {
    setCalSubmitting(false);
  }
};
```

Y bajo el botón de confirmar del paso 3, añadir el render del error:
```tsx
{calError && (
  <p className="mt-4 text-sm text-red-700 bg-red-50 border border-red-200 rounded-xl px-4 py-3">{calError}</p>
)}
```

En el paso 3 del formulario, si `calService.priceCents !== null`, el texto del botón de confirmar cambia a `Pagar ${calService.price} y reservar` (mantener clases existentes del botón legacy); si es null conserva el texto original.

- [ ] **Step 3: Integrar en HomePage (orden final) y verificar**

Orden: Navbar, Hero, Services, Experience, **VideoShowcase**, InstagramCta, Reservas, Faq, Footer, AIChat, ServiceModal.

```bash
pnpm lint && pnpm build
```
Expected: limpio. En dev: el video reproduce en loop sin sonido y el submit de notaría muestra ticket.

---

### Task 11: Página de confirmación de pago + verificación final

**Files:**
- Create: `app/reserva/confirmada/page.tsx`

**Interfaces:**
- Consumes: `getStripe`, `ticketFromSessionId`.
- Produces: página server `/reserva/confirmada?session_id=...` que verifica el pago y muestra el ticket.

- [ ] **Step 1: app/reserva/confirmada/page.tsx**

```tsx
import Link from 'next/link';
import { CheckCircle2, AlertTriangle } from 'lucide-react';
import { getStripe } from '@/lib/stripe';
import { ticketFromSessionId } from '@/lib/tickets';

export const dynamic = 'force-dynamic';

function Estado({ icon, title, children }: { icon: React.ReactNode; title: string; children: React.ReactNode }) {
  return (
    <main className="min-h-screen flex items-center justify-center bg-brand-cream px-4">
      <div className="max-w-lg w-full bg-white/70 backdrop-blur rounded-3xl border border-black/[0.05] shadow-xl p-8 md:p-12 text-center">
        <div className="flex justify-center mb-6">{icon}</div>
        <h1 className="font-heading text-3xl text-brand-ink mb-4">{title}</h1>
        <div className="text-brand-brown leading-relaxed">{children}</div>
        <Link
          href="/"
          className="inline-block mt-8 px-8 py-4 bg-brand-ink text-brand-cream text-xs font-bold uppercase tracking-widest rounded-full hover:bg-brand-bronze transition-colors"
        >
          Volver al estudio
        </Link>
      </div>
    </main>
  );
}

export default async function ConfirmadaPage({
  searchParams,
}: {
  searchParams: Promise<{ session_id?: string }>;
}) {
  const { session_id } = await searchParams;
  const stripe = getStripe();

  if (!session_id || !stripe) {
    return (
      <Estado icon={<AlertTriangle className="w-12 h-12 text-brand-bronze" />} title="No pudimos verificar tu pago">
        <p>Falta la referencia de pago o el sistema no está disponible. Si el cargo se realizó, contáctanos y lo resolvemos de inmediato.</p>
      </Estado>
    );
  }

  const session = await stripe.checkout.sessions.retrieve(session_id).catch(() => null);
  if (!session) {
    return (
      <Estado icon={<AlertTriangle className="w-12 h-12 text-brand-bronze" />} title="Referencia no encontrada">
        <p>No encontramos esta sesión de pago. Verifica el enlace o intenta reservar de nuevo.</p>
      </Estado>
    );
  }

  const m = session.metadata ?? {};
  if (session.payment_status !== 'paid') {
    return (
      <Estado icon={<AlertTriangle className="w-12 h-12 text-brand-bronze" />} title="Pago pendiente">
        <p>Tu pago aún no se ha completado. Puedes intentarlo de nuevo desde el centro de reservas.</p>
      </Estado>
    );
  }

  const ticket = ticketFromSessionId(session.id, m.dateISO ?? '');
  return (
    <Estado icon={<CheckCircle2 className="w-12 h-12 text-brand-caramel" />} title="¡Reserva confirmada!">
      <p className="mb-6">Gracias {m.name}. Tu pago fue recibido y tu espacio está reservado.</p>
      <div className="text-left bg-brand-cream rounded-2xl border border-black/[0.05] p-6 space-y-2 text-sm">
        <p><span className="font-bold text-brand-ink">Ticket:</span> {ticket}</p>
        <p><span className="font-bold text-brand-ink">Servicio:</span> {m.serviceName}</p>
        <p><span className="font-bold text-brand-ink">Fecha:</span> {m.dateISO} · {m.time}</p>
        <p><span className="font-bold text-brand-ink">Contacto:</span> {m.email} · {m.phone}</p>
        {m.notes ? <p><span className="font-bold text-brand-ink">Notas:</span> {m.notes}</p> : null}
      </div>
      <p className="mt-6 text-sm">Yoly confirmará tu cita personalmente. Recibirás el recibo de Stripe en tu email.</p>
    </Estado>
  );
}
```

- [ ] **Step 2: Verificación final completa (DONE del spec)**

```bash
pnpm lint && pnpm test && pnpm build
pnpm dev &
sleep 5
curl -s localhost:3000 | grep -c 'yoly-studio.mp4'          # Expected: >= 1 (video presente)
curl -s localhost:3000 | grep -o 'Powered by Merktop'        # Expected: match
curl -s -o /dev/null -w '%{http_code}\n' localhost:3000/reserva/confirmada  # Expected: 200 (estado de error controlado)
# Flujo de reservas: los 3 curl del Task 5 Step 3
# Chat: con GEMINI_API_KEY real en .env:
curl -s -X POST localhost:3000/api/chat -H 'content-type: application/json' -d '{"message":"Hola","history":[]}'
# Expected: {"text":"...respuesta elegante..."} (o 503 controlado sin key)
```

- [ ] **Step 3: Checklist visual en navegador (dev)**

- Hero, nav y anchors (#servicios, #experiencia, #estudio, #instagram, #reservas) funcionan.
- Video en loop, muted, con marco glassmorphism, a mitad de página.
- Paleta de branding aplicada (sin rastros de `#FAF8F5`/`#b48c68`: `grep -rn '#FAF8F5\|#b48c68' app components lib` debe devolver vacío).
- Reserva de estética con STRIPE_SECRET_KEY de test: redirige a checkout.stripe.com; pagar con 4242 4242 4242 4242 regresa a /reserva/confirmada con ticket.
- Mobile: probar viewport 390px (menú móvil, video full-width, calendario usable).
