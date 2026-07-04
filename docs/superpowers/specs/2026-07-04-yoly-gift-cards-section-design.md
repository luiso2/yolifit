# Yoly Gift Cards Section — Design

**Fecha:** 2026-07-04
**Repo objetivo:** `yoly-studio-fit` (website Next.js 15, next-intl es/en, Tailwind 4, Railway servicio Yolifit)

## Objetivo

Agregar una sección de gift cards al sitio de Yoly (clinicyolystudiofit.com) para que los clientes compren/regalen una gift card, reutilizando el motor de gift cards que Merktop ya tiene. **Sin cambios en el backend de Merktop.**

## Contexto (lo que ya existe)

- Merktop expone un endpoint público de compra: `POST /pub/gift-cards/buy` (crea una gift card `pending`, mina una Stripe Checkout Session en la cuenta conectada del merchant y devuelve la URL). El pago dispara un webhook que activa la card y envía un email con la marca del negocio.
- Las rutas `/pub/*` del worker tienen CORS `*` (accesibles desde cualquier origen).
- El worker vive en `https://merktop-payments.odd-forest-9504.workers.dev`. La página de gracias post-compra es `/gift/thanks?code=…` (en payments.merktop.com), ya branded por `brand_theme`.
- El sitio de Yoly ya habla con Merktop mediante API routes server-side (patrón de `app/api/reservas/route.ts`).
- Business de Yoly: `5982fadb-48aa-4119-bc18-a61db8733d70`, `charges_enabled=1`, email branded ya configurado (dominio clinicyolystudiofit.com), `brand_theme` cargado (cream `#F6F1EA`, bronce `#A27043`, Cormorant/Outfit).

## Alcance (decisiones tomadas)

- **Superficie:** una sección en la home + una página dedicada `/[locale]/gift-cards`.
- **Integración:** form nativo con la estética de Yoly → API route del propio sitio → worker `/pub/gift-cards/buy` → Stripe. El cliente no sale del dominio hasta el redirect a Stripe.
- **Monto:** solo monto libre (un input en USD). Mínimo $5.00 (500 centavos, límite de Stripe/Merktop); máximo $100,000. Sin botones preset.
- **Campos:** `buyer_name` (obligatorio), `buyer_email` (obligatorio); `recipient_name`, `recipient_email`, `message` (opcionales, para regalar a otra persona; message máx 500).
- **Pantalla de gracias:** la de Merktop (`/gift/thanks?code=…`), que el worker ya fija como `success_url`. Muestra el código con la marca de Yoly.
- **Idiomas:** ES/EN (next-intl).
- **Navegación:** enlace "Gift Cards" en el nav de escritorio y en el drawer mobile.

## Fuera de alcance (YAGNI)

- Consultar el saldo de una gift card (el backend existe, pero no se pidió).
- Página de gracias propia dentro del sitio de Yoly (usar la de Merktop).
- Cualquier cambio en el backend de Merktop (worker, D1, emails).

## Contrato del endpoint (Merktop, existente — no se modifica)

```
POST {MERKTOP_WORKER_URL}/pub/gift-cards/buy
Body JSON:
  business_id:     string  (Yoly)
  amount:          number  (centavos, 500 .. 10_000_000)
  buyer_name:      string  (1..120)
  buyer_email:     string  (email)
  recipient_name:  string | null  (opcional, <=120)
  recipient_email: string | null  (opcional, email)
  message:         string | null  (opcional, <=500)

200 -> { url: <stripe checkout url>, code: <gift card code> }
400 -> { error: "invalid_input" }
409 -> { error: "merchant_not_ready" }
502 -> { error: "checkout_failed", message }
```

## Arquitectura y componentes

### Flujo de datos

```
[cliente] GiftCardForm
   → POST /api/gift-cards/buy            (mismo origen, sitio de Yoly)
   → [server sitio] fetch {MERKTOP_WORKER_URL}/pub/gift-cards/buy   (server-to-server, agrega business_id)
   → { url }                            (URL de Stripe Checkout)
   → [cliente] window.location = url    (Stripe Checkout, cuenta de Yoly)
   → paga
   → [Merktop webhook] activa la gift card + envía email branded (dominio de Yoly)
   → Stripe redirige a /gift/thanks?code=… (Merktop, branded)
```

### Archivos nuevos (yoly-studio-fit)

1. **`app/api/gift-cards/buy/route.ts`** — POST handler server-side. Valida el body, inyecta el `business_id` de Yoly desde env, reenvía a `${MERKTOP_WORKER_URL}/pub/gift-cards/buy`, y devuelve `{ url }` o un error mapeado. Nunca expone la URL del worker al cliente. Rechaza `amount < 500` sin llamar al worker.

2. **`components/GiftCardForm.tsx`** (client) — estado: `amountUsd` (string), `buyerName`, `buyerEmail`, `recipientName`, `recipientEmail`, `message`, `busy`, `error`. Convierte el monto USD a centavos, valida `>= 500`, hace `POST /api/gift-cards/buy` y en éxito `window.location.href = data.url`. Estética premium de Yoly (Cormorant/Outfit, cream/bronce, glassmorphism, mobile-first). Bloque de "destinatario (opcional)" separado visualmente.

3. **`app/[locale]/gift-cards/page.tsx`** (server) — metadata (title/description, `robots` normal), header con logo/título de Yoly, y `<GiftCardForm/>`. Usa `getTranslations('giftCards')`.

4. **`components/sections/GiftCardsSection.tsx`** — bloque en la home: eyebrow + título + descripción + CTA ("Regala una gift card") que enlaza a `/gift-cards`. Ícono/imagen de regalo, estilo consistente con las demás secciones.

### Archivos modificados

5. **`messages/es.json` + `messages/en.json`** — namespace `giftCards` (section, page, form, errors) y `nav.giftCards`.

6. **`components/sections/Navbar.tsx`** — item "Gift Cards" que enlaza a `/gift-cards` (link, no ancla de scroll), en el contenedor de escritorio y dentro del drawer mobile.

7. **Home** (`components/HomePage.tsx` o donde se componen las secciones) — insertar `<GiftCardsSection/>` en un punto natural (p. ej. después de reseñas, antes del CTA final de reservas).

8. **Config / env (Railway, servicio Yolifit)** — `MERKTOP_WORKER_URL=https://merktop-payments.odd-forest-9504.workers.dev` y `MERKTOP_BUSINESS_ID=5982fadb-48aa-4119-bc18-a61db8733d70`. Leídas solo en la API route (server-side), nunca `NEXT_PUBLIC_*`.

### Errores

- **Form:** monto < $5 → mensaje inline (`errors.minAmount`). Email inválido → validación HTML5 (`type=email required`).
- **API route:** worker 409 → `errors.notReady` ("Gift cards no disponibles por ahora"). 502 → `errors.checkoutFailed` ("No pudimos iniciar el pago, intenta de nuevo"). Timeout/red → `errors.connection`.
- La URL del worker nunca llega al cliente.

### Testing

- `app/api/gift-cards/buy` (jest, patrón del sitio; mock del `fetch` al worker):
  - Input válido → llama al worker con `business_id` de Yoly y devuelve `{ url }`.
  - `amount < 500` → 400 sin llamar al worker.
  - Worker 409 → mapea a `notReady`.
  - Worker 502 → mapea a `checkoutFailed`.
- Helper de parseo de monto (USD string → centavos) con test (redondeo, valores inválidos, negativos).

### Deploy

- Setear las dos env vars en Railway (Yolifit).
- `git push origin master` → Railway auto-deploy (requiere autorización explícita de Jose en el turno, por el gate de auto-mode).

## Criterio de terminación (DONE)

- La home de Yoly muestra la sección de gift cards (ES/EN) con CTA que lleva a `/gift-cards`.
- `/[locale]/gift-cards` renderiza el form nativo con la marca de Yoly y monto libre.
- Un envío válido redirige a Stripe Checkout (cuenta de Yoly) por el monto ingresado.
- Tras pagar, la gift card queda activa y el email branded llega al destinatario/comprador (flujo backend ya probado).
- `tsc --noEmit`, `next build` y los tests de la API route pasan.
