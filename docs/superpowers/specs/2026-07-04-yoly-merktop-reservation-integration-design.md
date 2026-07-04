# Diseño: conexión del website de Yoly con Merktop (reservas con seña de $60)

Fecha: 2026-07-04
Estado: en revisión del usuario
Repos afectados: `yoly-studio-fit` (website Next.js, lo principal) y config en `merktop-payments` (business de Yoly).

## Contexto (sub-proyecto C del proyecto de reservas de Yoly)

Objetivo del proyecto: que las reservas del website `clinicyolystudiofit.com` cobren una
seña de $60 que guarde la tarjeta, y Yoly cobre el precio real del servicio después con el
extra charge del dashboard de Merktop. Patrón "como Ava": el website es dueño de la agenda,
Merktop es dueño del dinero, unidos por un webhook.

Sub-proyectos:
- **A (HECHO y desplegado):** "modo reserva" en Merktop (deposit link que cobra seña fija,
  guarda la tarjeta, sin saldo). Migración + worker + web en prod, verificado en vivo.
- **B (parcial, se cierra aquí):** el reservation link de $60 de Yoly ya existe en prod:
  `https://payments.merktop.com/pay/d/e69614c2-d285-430e-99d1-a1e2c1d299c6`
  (`deposit_amount=6000`, `reservation_mode=1`, business `5982fadb-48aa-4119-bc18-a61db8733d70`).
  Falta: setear su `webhook_url` + `webhook_secret` (parte de este sub-proyecto).
- **C (este spec):** el backend de reservas del website + la config del webhook.

### Estado actual del website (verificado)
- Next.js 15 (App Router), jest, desplegado en Railway (servicio "Yolifit", proyecto
  "clientes", dominio `clinicyolystudiofit.com`). NO tiene base de datos ni variables custom
  (ni Stripe, ni Gemini, ni DATABASE_URL): en prod cada reserva solo genera un "ticket" sin
  cobrar ni guardar nada.
- El wizard (`components/sections/Reservas.tsx`) es un calendario de 3 pasos
  (servicio -> fecha/hora -> datos) con slots ESTATICOS por dia de semana
  (`getTimeSlots`, sin disponibilidad real). Captura serviceId, dateISO, time, name, email,
  phone, notes y hace `POST /api/reservas`, luego `window.location.href = data.url` si la
  respuesta trae `url` (o muestra un ticket si trae `ticket`).
- `app/api/reservas/route.ts` hoy: valida con `bookingSchema`, y como todos los servicios
  tienen `priceCents: null`, siempre devuelve `{ ticket }` (el branch de Stripe nunca corre).
- Catalogo: `lib/services/es.ts` / `en.ts`, 23 servicios, cada uno con `duration` como texto
  ("60 minutos", "90 minutos", etc.).

## Objetivo y criterio DONE

Cuando un cliente reserva en el website, paga una seña de $60 por el canal Merktop, la
reserva queda registrada en la DB del website, y el webhook `deposit.paid` la marca pagada y
bloquea el horario. El calendario deja de mostrar horarios ya reservados.

DONE (verificado en vivo, staging o prod):
1. Reservar un servicio + fecha/hora + datos -> `POST /api/reservas` crea un booking
   `pending_deposit` en Postgres y redirige a
   `/pay/d/e69614c2-...?ref=<ref>&for=<ISO>`.
2. Pagar la seña de $60 -> Merktop dispara `deposit.paid` -> `POST /api/merktop/webhook`
   (firma valida) marca el booking `paid`.
3. El calendario ya NO ofrece el horario que quedo `paid` (segun la duracion del servicio).
4. El boton "Test connection" del dashboard de Merktop (ping) llega al webhook y responde 200.

## Arquitectura

```
Cliente en clinicyolystudiofit.com -> wizard (servicio + fecha/hora + datos)
  -> POST /api/reservas
       - valida, busca la duracion del servicio, verifica que el slot este libre
       - crea booking pending_deposit en Postgres + genera ref (YS-YYYYMMDD-XXXX)
       - responde { url: <PAY_URL>?ref=<ref>&for=<startsAtISO> }
  -> redirect a Merktop, cliente paga $60 (sena), tarjeta guardada
       - Merktop envia email de confirmacion al cliente + aviso a Yoly
  -> Merktop -> POST clinicyolystudiofit.com/api/merktop/webhook (deposit.paid, firmado)
       - el website verifica la firma HMAC, marca el booking paid por ref, bloquea el slot
  -> El dia de la cita, Yoly cobra el precio real (Cobrar extra) desde el dashboard de Merktop
```

El detalle de la reserva (servicio, cliente, fecha) vive en la DB del website; Merktop solo
conoce "se pago una seña de $60 con este ref". La correlacion es el `ref`.

## Componentes

### 1. Base de datos (Postgres dedicado en Railway)

Servicio Postgres nuevo en el proyecto "clientes", solo para Yolifit. Tabla `bookings`:

```sql
CREATE TABLE bookings (
  id             TEXT PRIMARY KEY,       -- uuid
  ref            TEXT NOT NULL UNIQUE,   -- YS-YYYYMMDD-XXXX, correlacion con Merktop
  service_id     TEXT NOT NULL,
  service_name   TEXT NOT NULL,
  duration_min   INTEGER NOT NULL,       -- para bloquear los slots correctos
  starts_at      TIMESTAMPTZ NOT NULL,   -- fecha + hora de la cita
  customer_name  TEXT NOT NULL,
  customer_email TEXT NOT NULL,
  customer_phone TEXT NOT NULL,
  notes          TEXT,
  status         TEXT NOT NULL DEFAULT 'pending_deposit',  -- pending_deposit | paid | canceled
  deposit_pi_id  TEXT,
  created_at     TIMESTAMPTZ NOT NULL DEFAULT now(),
  paid_at        TIMESTAMPTZ
);
CREATE INDEX idx_bookings_day    ON bookings (starts_at) WHERE status = 'paid';
CREATE UNIQUE INDEX idx_bookings_ref ON bookings (ref);
```

Driver: `postgres` (porsager) o `pg`; un modulo `lib/db.ts` con el pool y las queries
(`createBooking`, `getBookingByRef`, `markBookingPaid`, `markBookingCanceled`,
`paidBookingsForDate`). La duracion en minutos se deriva del texto `duration` del catalogo
(helper `durationMinutes("90 minutos") -> 90`), o se agrega un campo `durationMin` al catalogo.

### 2. `POST /api/reservas` (modificar el existente)

- Valida con `bookingSchema` (ya existe).
- Busca el servicio en `getSpaServices(locale)`; deriva `duration_min`.
- Combina `dateISO` + `time` en `starts_at` (zona horaria de Miami, America/New_York).
- Verifica disponibilidad server-side (anti doble-booking): si el rango del slot solapa un
  booking `paid`, responde 409 `slot_taken`.
- Crea el booking `pending_deposit` con un `ref` (`YS-` + fecha + 4 digitos, reusando el
  patron de `lib/tickets.ts`).
- Responde `{ url: ${PAY_URL}?ref=${ref}&for=${startsAtISO} }` donde
  `PAY_URL = process.env.MERKTOP_RESERVATION_PAY_URL`.
- El branch de "ticket" (priceCents === null) se elimina: TODA reserva ahora cobra la seña.

### 3. `POST /api/merktop/webhook` (nuevo)

- Lee el RAW body (sin parsear) para verificar la firma.
- Header `merktop-signature: t=<unixSec>,v1=<hexHmac>`: recomputa
  `HMAC_SHA256(secret, "<t>.<rawBody>")` y compara en tiempo constante. Rechaza (401) si no
  valida, o si `t` tiene mas de 5 minutos (replay). `secret = process.env.MERKTOP_WEBHOOK_SECRET`.
- Dedup: header `merktop-event-id`; ignora (200) un id ya procesado (tabla simple
  `webhook_events(event_id PK, processed_at)` o columna en bookings).
- Parsea `{ id, type, created, data }`. Segun `type`:
  - `deposit.paid` -> `markBookingPaid(data.ref, data.deposit_id/pi, now)` (idempotente: si ya
    esta `paid`, no-op).
  - `deposit.refunded` / `deposit.expired` -> `markBookingCanceled(data.ref)` (libera el slot).
  - `ping` -> responde 200 (test de conexion).
  - otros (`booking.rescheduled`, `booking.updated`, `booking.deleted`) -> fuera de alcance del
    MVP; responde 200 y los ignora (documentado).
- Booking desconocido por `ref` -> 200 e ignora (no reintentar).
- Responde 200 rapido (Merktop reintenta con back-off + outbox durante ~3 dias si no).

### 4. Disponibilidad real (`GET /api/availability?date=YYYY-MM-DD`)

- Devuelve, para esa fecha, los slots del dia (`getTimeSlots` por dia de semana, que se
  mantiene como el horario base) MENOS los ocupados por bookings `paid`: un booking de
  `duration_min` a las 10:00 ocupa 10:00 y los slots que caen dentro de [10:00, 10:00+dur).
- `Reservas.tsx` (paso 2 del wizard): al elegir un dia, llama `/api/availability` y deshabilita
  los slots ocupados (hoy `getTimeSlots` es puramente estatico).

### 5. Config (cierra el sub-proyecto B)

- En Merktop, para el business de Yoly (`5982fadb-...`): setear
  `webhook_url = https://clinicyolystudiofit.com/api/merktop/webhook` y
  `webhook_secret = generateWebhookSecret()` (formato `whsec_merktop_<64hex>`). Via el
  dashboard de settings de Merktop o directo en D1. Probar con "Test connection" (ping).
- En Railway (servicio Yolifit): agregar el Postgres dedicado y las variables
  `DATABASE_URL`, `MERKTOP_WEBHOOK_SECRET` (el mismo secret), y
  `MERKTOP_RESERVATION_PAY_URL = https://payments.merktop.com/pay/d/e69614c2-d285-430e-99d1-a1e2c1d299c6`.

## Formato del webhook de Merktop (verificado en src/merchant-webhook.ts)

- Firma: `HMAC_SHA256(secret, "<t>.<rawBody>")`, hex; header `merktop-signature: t=<t>,v1=<sig>`
  (t en segundos unix). Replay: rechazar t mas viejo de 5 min. Dedup: header `merktop-event-id`.
- Body: `{ "id": "evt_...", "type": "deposit.paid", "created": <unixSec>, "data": {...} }`.
- `data` en deposit.paid: `deposit_id, link_id, product, customer_email, customer_name,
  amount_paid, amount_total, amount_balance, currency, status, deposit_paid_at, ref, booking_at`.
  El campo que correlaciona con el booking del website es `ref`.

## Manejo de errores

- `/api/reservas`: slot ocupado -> 409 `slot_taken` (el wizard muestra "ese horario ya no esta
  disponible"); falta `MERKTOP_RESERVATION_PAY_URL` -> 503 con mensaje claro.
- `/api/merktop/webhook`: firma invalida / timestamp viejo -> 401; ref desconocido -> 200
  (ignora); evento duplicado (`merktop-event-id` visto) -> 200 (idempotente).
- Bookings `pending_deposit` abandonados (cliente no pago): NO bloquean el slot (solo los
  `paid` lo hacen), asi que se pueden dejar; opcional un cron/TTL que los borre a las 24h.

## Testing (jest, ya configurado en el website)

- `durationMinutes("90 minutos")` -> 90; casos borde.
- Generacion del `ref` (formato, unicidad).
- Verificacion HMAC del webhook: firma valida -> acepta; alterada -> rechaza; timestamp viejo
  -> rechaza; comparacion en tiempo constante.
- Disponibilidad: un booking `paid` de 90 min a las 10:00 elimina 10:00/10:30/11:00 de los
  slots disponibles; un `pending_deposit` NO los elimina.
- `/api/reservas`: crea el booking y devuelve `url` con `ref` y `for`; slot ocupado -> 409.
- `/api/merktop/webhook`: `deposit.paid` marca `paid` por ref (idempotente en redelivery);
  `ping` -> 200.

## Deploy

- Agregar el servicio Postgres al proyecto "clientes" y las 3 variables al servicio Yolifit.
- Aplicar el schema (`bookings` + indices) en el Postgres nuevo.
- Setear `webhook_url` + `webhook_secret` de Yoly en Merktop; probar con "Test connection".
- Desplegar el website (Railway build del servicio Yolifit) y verificar el flujo end-to-end
  con un pago de prueba reembolsable.

## Fuera de alcance (YAGNI)

- Notificaciones propias del website (email/SMS/WhatsApp): se usa el email que Merktop ya envia.
- Manejar `booking.rescheduled/updated/deleted` desde el dashboard de Merktop en el website
  (se ignoran con 200 en el MVP; se agregan si Yoly gestiona citas desde Merktop).
- Reactivar el chat de Gemini o el Stripe propio del website (no se tocan).
- Panel de administracion de reservas en el website (Yoly gestiona el cobro desde Merktop).
- Multi-servicio en una sola reserva / descripcion firmada del servicio hacia Merktop (el
  servicio vive en la DB del website; Merktop solo cobra la seña).
