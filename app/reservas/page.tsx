import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import Reservas from '@/components/sections/Reservas';

export const metadata: Metadata = {
  title: 'Reservas | Yoly Studio',
  description:
    'Reserva tu experiencia de bienestar o servicio de notaría en Yoly Studio, Miami. Elige tu servicio, fecha y hora en un solo lugar.',
};

export default function ReservasPage() {
  return (
    <div className="relative min-h-screen bg-brand-cream text-brand-ink overflow-hidden">
      {/* Soft radial accent, no FluidBackground on this page for a calmer, static feel */}
      <div
        className="pointer-events-none absolute -top-1/3 left-1/2 -translate-x-1/2 w-[85vw] h-[85vw] max-w-[900px] max-h-[900px] rounded-full opacity-40 blur-3xl"
        style={{ background: 'radial-gradient(circle, rgba(162,112,67,0.28) 0%, rgba(162,112,67,0) 70%)' }}
        aria-hidden
      />

      {/* Minimal fixed header */}
      <header className="fixed top-0 left-0 right-0 z-40 flex items-center justify-between px-6 md:px-12 py-5 bg-brand-cream/85 backdrop-blur-md border-b border-black/[0.05]">
        <Link
          href="/"
          className="font-heading text-xl md:text-2xl font-bold tracking-tight text-black flex flex-col items-start leading-none"
        >
          <div className="flex items-center gap-1.5">
            <span className="font-semibold tracking-widest text-brand-bronze">YOLY</span>
            <span className="font-light text-gray-500">STUDIO</span>
          </div>
          <span className="text-[9px] font-mono tracking-[0.25em] text-brand-caramel mt-1">ESTÉTICA & NOTARÍA</span>
        </Link>

        <Link
          href="/"
          className="flex items-center gap-2 text-xs font-semibold tracking-widest uppercase text-brand-bronze hover:text-brand-brown transition-colors"
          data-hover="true"
        >
          <ArrowLeft className="w-4 h-4" />
          <span className="hidden sm:inline">Volver al estudio</span>
        </Link>
      </header>

      {/* Wizard: vertically centered on desktop, no need to hunt for the continue button */}
      <main className="relative z-10 min-h-screen flex items-center justify-center px-4 md:px-6 pt-28 pb-8 md:pt-24 md:pb-10">
        <div className="w-full max-w-5xl mx-auto">
          <Reservas />
        </div>
      </main>
    </div>
  );
}
