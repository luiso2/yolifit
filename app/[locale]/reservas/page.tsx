import type { Metadata } from 'next';
import { ArrowLeft } from 'lucide-react';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import Reservas from '@/components/sections/Reservas';
import { Link } from '@/i18n/routing';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'metadata' });
  return {
    title: t('reservasTitle'),
    description: t('reservasDescription'),
  };
}

export default async function ReservasPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: 'reservasPage' });

  return (
    <div className="relative min-h-screen bg-brand-cream text-brand-ink overflow-hidden">
      <div
        className="pointer-events-none absolute -top-1/3 left-1/2 -translate-x-1/2 w-[85vw] h-[85vw] max-w-[900px] max-h-[900px] rounded-full opacity-40 blur-3xl"
        style={{ background: 'radial-gradient(circle, rgba(162,112,67,0.28) 0%, rgba(162,112,67,0) 70%)' }}
        aria-hidden
      />

      <header className="fixed top-0 left-0 right-0 z-40 flex items-center justify-between px-6 md:px-12 py-5 bg-brand-cream/85 backdrop-blur-md border-b border-black/[0.05]">
        <Link
          href="/"
          className="flex items-center gap-3 font-heading text-xl md:text-2xl tracking-tight text-black leading-none"
        >
          <img src="/media/logo.png" alt="Clinic YolyStudio logo" className="w-12 h-12 md:w-14 md:h-14 object-contain shrink-0" />
          <div className="flex flex-col items-start leading-none">
            <span className="font-script text-2xl md:text-[1.75rem] text-brand-bronze leading-none">Clinic</span>
            <span className="font-medium text-brand-bronze mt-1 leading-none">
              Yoly<span className="font-light text-gray-500">Studio</span>
            </span>
          </div>
        </Link>

        <Link
          href="/"
          className="flex items-center gap-2 text-xs font-semibold tracking-widest uppercase text-brand-bronze hover:text-brand-brown transition-colors"
          data-hover="true"
        >
          <ArrowLeft className="w-4 h-4" />
          <span className="hidden sm:inline">{t('backToStudio')}</span>
        </Link>
      </header>

      <main className="relative z-10 min-h-screen flex items-center justify-center px-4 md:px-6 pt-28 pb-8 md:pt-24 md:pb-10">
        <div className="w-full max-w-5xl mx-auto">
          <Reservas />
        </div>
      </main>
    </div>
  );
}
