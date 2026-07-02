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
