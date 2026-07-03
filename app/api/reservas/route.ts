import { NextResponse } from 'next/server';
import { bookingSchema } from '@/lib/booking-schema';
import { getSpaServices } from '@/lib/services';
import { getStripe } from '@/lib/stripe';
import { generateTicketCode } from '@/lib/tickets';

export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  const locale = typeof body?.locale === 'string' && body.locale === 'en' ? 'en' : 'es';
  const parsed = bookingSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: locale === 'en' ? 'Invalid booking data' : 'Datos de reserva inválidos', issues: parsed.error.flatten().fieldErrors },
      { status: 400 },
    );
  }
  const data = parsed.data;
  const services = getSpaServices(locale);
  const service = services.find((s) => s.id === data.serviceId);
  if (!service) {
    return NextResponse.json(
      { error: locale === 'en' ? 'Service not found' : 'Servicio no encontrado' },
      { status: 400 },
    );
  }

  if (service.priceCents === null) {
    return NextResponse.json({ ticket: generateTicketCode(new Date(`${data.dateISO}T12:00:00Z`)) });
  }

  const stripe = getStripe();
  if (!stripe) {
    return NextResponse.json(
      {
        error:
          locale === 'en'
            ? 'Online payments are not available right now. Please try again later.'
            : 'Los pagos en línea no están disponibles en este momento. Por favor intenta más tarde.',
      },
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
    success_url: `${origin}/${locale}/reserva/confirmada?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${origin}/${locale}/reservas`,
  });

  return NextResponse.json({ url: session.url });
}
