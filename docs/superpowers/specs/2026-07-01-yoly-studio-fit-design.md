# Yoly Studio Fit: Diseño de migración a Next.js con Stripe

Fecha: 2026-07-01
Estado: Aprobado por Jose (enfoque A + Stripe Checkout incluido)

## Objetivo

Convertir el sitio exportado de AI Studio (`yoly-studio-_-estética,-bienestar-&-notaría.zip`, Vite + React SPA) en una app Next.js 15 llamada **Yoly Studio Fit** (`~/Desktop/yoly-studio-fit`), aplicando el branding de las imágenes provistas, insertando el video de WhatsApp a mitad de página, y con pagos reales vía Stripe Checkout en el flujo de reservas.

Criterio DONE: `pnpm build` sin errores, `pnpm lint` (tsc --noEmit) limpio, sitio corre local, flujo de reserva crea una Stripe Checkout Session (modo test) y la página de confirmación muestra el ticket, chat AI responde vía route handler del servidor.

## Contexto del sitio origen

- SPA de una página: hero, 6 servicios (5 estética + 1 notaría), centro de reservas con calendario en 3 pasos, FAQ acordeón, footer.
- Stack origen: Vite, React 19, framer-motion 12, lucide-react, @google/genai (chat Gemini con key expuesta al cliente via vite define).
- Copy completo en español, negocio en Miami FL, Instagram @yolystudio.fit.
- Assets: 4 JPG generados (hero, featured, etc.) + imágenes Unsplash remotas.
- Video: vertical 480x816, 9.57s, 1.9MB, H.264 baseline (compatible con todos los navegadores, no requiere re-encode).

## Decisiones tomadas (con Jose)

1. **Estructura**: app Next.js simple (NO monorepo con workspaces). Convertible después si crece.
2. **Chat AI**: se mantiene, movido a `app/api/chat/route.ts` con `GEMINI_API_KEY` solo en servidor. La key del zip NO entra al repo.
3. **Reservas**: se quedan en el sitio (NO WhatsApp). Pago con **Stripe Checkout** integrado ahora.
4. **Video**: sección `VideoShowcase` entre servicios y el centro de reservas.
5. **Branding**: paleta/tipografía derivadas de las 2 imágenes de branding de WhatsApp (reemplaza el bronce `#b48c68` actual donde difiera). Logo en navbar y footer.
6. **Footer**: "Powered by Merktop" -> https://merktop.com.

## Arquitectura

```
yoly-studio-fit/
├── app/
│   ├── layout.tsx            # metadata SEO, fuente Inter, lang es
│   ├── page.tsx              # página principal (client sections composadas)
│   ├── globals.css           # Tailwind 4 + tokens de branding (@theme)
│   ├── reserva/
│   │   └── confirmada/page.tsx   # success de Stripe: verifica session, muestra ticket
│   └── api/
│       ├── chat/route.ts     # POST: proxy Gemini (server-side key)
│       └── reservas/route.ts # POST: valida con Zod; crea Checkout Session o ticket directo
├── components/               # portados: FluidBackground, CustomCursor, GradientText,
│                             # ServiceCard, AIChat, + nuevos: VideoShowcase, secciones de page
├── lib/
│   ├── services.ts           # data de servicios con priceCents (notaría: null)
│   ├── stripe.ts             # cliente Stripe (lazy, solo servidor)
│   └── tickets.ts            # generación de código YS-YYYYMMDD-XXXX
├── public/media/             # yoly-studio.mp4 + imágenes locales
├── .env / .env.example       # GEMINI_API_KEY, STRIPE_SECRET_KEY, NEXT_PUBLIC_SITE_URL
└── docs/superpowers/specs/   # este documento
```

Stack: Next.js 15 (App Router), TypeScript, Tailwind CSS 4, React 19, framer-motion, lucide-react, stripe, @google/genai, zod, pnpm 10, Node 22. Scripts obligatorios: dev/build/start/lint (CLAUDE.md sección 8; `test` se agrega con jest solo si hay lógica que amerite unit tests: tickets y validación de reservas).

## Flujo de reservas con Stripe

1. Usuario completa el calendario de 3 pasos (servicio -> fecha/hora -> datos).
2. `POST /api/reservas` con `{serviceId, dateISO, time, name, email, phone, notes}`.
3. Validación Zod. Si el servicio tiene `priceCents` (todos los de estética):
   - Se crea Stripe Checkout Session (`mode: payment`, `currency: usd`) con line item del servicio y `metadata` completa de la reserva + `customer_email`.
   - `success_url: /reserva/confirmada?session_id={CHECKOUT_SESSION_ID}`, `cancel_url: /#reservas`.
   - Respuesta `{url}` -> redirect del cliente a Stripe.
4. Si el servicio es notaría (`priceCents: null`): respuesta `{ticket}` directa (sin pago, precio varía según trámite) y la UI muestra el ticket como hoy.
5. `/reserva/confirmada` (server component): recupera la session de Stripe, verifica `payment_status === 'paid'`, deriva el ticket del session id y muestra confirmación con detalle de la reserva (desde metadata).
6. Sin base de datos en esta fase: la fuente de verdad del pago es Stripe Dashboard (metadata contiene todo). Webhook se difiere a la fase de deploy.

Manejo de errores: key de Stripe ausente -> 503 con mensaje claro en UI ("pagos no configurados"); session no pagada -> pantalla de estado pendiente con link para reintentar; validación fallida -> 400 con errores de campo.

## Sección VideoShowcase

- Posición: entre la grilla de servicios y el centro de reservas (mitad de la página).
- Video vertical en marco tipo tarjeta con glassmorphism y glow del color de marca, copy de la marca al lado (desktop: 2 columnas; mobile: video full-width arriba, mobile-first).
- `<video autoplay muted loop playsInline preload="metadata">` + poster (frame extraído con ffmpeg). Animación de entrada con framer-motion al hacer scroll (whileInView).

## Branding

- Extraer paleta exacta de las 2 imágenes de WhatsApp (muestreo de colores dominantes) y definir tokens en `globals.css` con `@theme` de Tailwind 4: fondo, superficie, acento, texto.
- Tipografía Inter (next/font). Lucide icons. Mantener las animaciones existentes (FluidBackground, cursor custom, gradientes) re-coloreadas a la paleta de marca.
- Nombre visible: "Yoly Studio" con descriptor "Estética, Bienestar & Notaría"; handle @yolystudio.fit.

## Seguridad

- `GEMINI_API_KEY` y `STRIPE_SECRET_KEY` SOLO en `.env` (gitignored). `.env.example` con placeholders.
- La key de Gemini que venía en el zip se considera comprometida (estaba destinada al bundle del cliente): se recomienda rotarla; no se copia al repo.
- CORS no aplica (mismo origen). Rate limiting del chat se difiere.

## Testing y verificación

- `pnpm lint` (tsc --noEmit) y `pnpm build` como puertas.
- Tests jest para `lib/tickets.ts` y el schema Zod de reservas (happy path + inválidos).
- Smoke test local: render de la página, video presente, `POST /api/reservas` con key de test de Stripe devuelve URL de checkout válida; sin key devuelve 503 controlado.
