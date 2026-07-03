import { CheckCircle2, AlertTriangle } from 'lucide-react';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { Link } from '@/i18n/routing';
import { getStripe } from '@/lib/stripe';
import { ticketFromSessionId } from '@/lib/tickets';

export const dynamic = 'force-dynamic';

async function ConfirmadaContent({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ session_id?: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: 'confirmacion' });
  const { session_id } = await searchParams;
  const stripe = getStripe();

  const backLink = (
    <Link
      href="/"
      className="inline-block mt-8 px-8 py-4 bg-brand-ink text-brand-cream text-xs font-bold uppercase tracking-widest rounded-full hover:bg-brand-bronze transition-colors"
    >
      {t('backToStudio')}
    </Link>
  );

  const shell = (icon: React.ReactNode, title: string, body: React.ReactNode) => (
    <main className="min-h-screen flex items-center justify-center bg-brand-cream px-4">
      <div className="max-w-lg w-full bg-white/70 backdrop-blur rounded-3xl border border-black/[0.05] shadow-xl p-8 md:p-12 text-center">
        <div className="flex justify-center mb-6">{icon}</div>
        <h1 className="font-heading text-3xl text-brand-ink mb-4">{title}</h1>
        <div className="text-brand-brown leading-relaxed">{body}</div>
        {backLink}
      </div>
    </main>
  );

  if (!session_id || !stripe) {
    return shell(
      <AlertTriangle className="w-12 h-12 text-brand-bronze" />,
      t('paymentNotVerified'),
      <p>{t('paymentNotVerifiedBody')}</p>,
    );
  }

  const session = await stripe.checkout.sessions.retrieve(session_id).catch(() => null);
  if (!session) {
    return shell(
      <AlertTriangle className="w-12 h-12 text-brand-bronze" />,
      t('referenceNotFound'),
      <p>{t('referenceNotFoundBody')}</p>,
    );
  }

  const m = session.metadata ?? {};
  if (session.payment_status !== 'paid') {
    return shell(
      <AlertTriangle className="w-12 h-12 text-brand-bronze" />,
      t('paymentPending'),
      <p>{t('paymentPendingBody')}</p>,
    );
  }

  const ticket = ticketFromSessionId(session.id, m.dateISO ?? '');
  return shell(
    <CheckCircle2 className="w-12 h-12 text-brand-caramel" />,
    t('confirmed'),
    <>
      <p className="mb-6">{t('thankYou', { name: m.name ?? '' })}</p>
      <div className="text-left bg-brand-cream rounded-2xl border border-black/[0.05] p-6 space-y-2 text-sm">
        <p>
          <span className="font-bold text-brand-ink">{t('ticket')}:</span> {ticket}
        </p>
        <p>
          <span className="font-bold text-brand-ink">{t('service')}:</span> {m.serviceName}
        </p>
        <p>
          <span className="font-bold text-brand-ink">{t('date')}:</span> {m.dateISO} · {m.time}
        </p>
        <p>
          <span className="font-bold text-brand-ink">{t('contact')}:</span> {m.email} · {m.phone}
        </p>
        {m.notes ? (
          <p>
            <span className="font-bold text-brand-ink">{t('notes')}:</span> {m.notes}
          </p>
        ) : null}
      </div>
      <p className="mt-6 text-sm">{t('followUp')}</p>
    </>,
  );
}

export default function ConfirmadaPage(props: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ session_id?: string }>;
}) {
  return <ConfirmadaContent {...props} />;
}
