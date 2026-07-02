'use client';

import { motion } from 'framer-motion';
import { Heart } from 'lucide-react';
import Link from 'next/link';

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
          <p className="text-xs font-bold uppercase tracking-[0.25em] text-brand-brown mb-6">
            Dentro del estudio
          </p>
          <h2 className="font-heading text-4xl md:text-5xl text-brand-ink mb-6 leading-tight">
            Vive la experiencia <span className="font-script text-5xl md:text-6xl text-brand-bronze normal-case">&nbsp;Yoly Studio</span>
          </h2>
          <p className="text-brand-brown leading-relaxed mb-8 max-w-md">
            Un santuario boutique en Miami donde cada detalle está pensado para tu bienestar.
            Descubre el ambiente, la calidez y el cuidado que nos distinguen.
          </p>
          <Link
            href="/reservas"
            className="inline-flex items-center gap-2 px-8 py-4 bg-brand-ink text-brand-cream text-xs font-bold uppercase tracking-widest rounded-full hover:bg-brand-bronze transition-colors"
            data-hover="true"
          >
            <Heart className="w-4 h-4" /> Reserva tu momento
          </Link>
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
              <div className="relative w-full aspect-[480/816] overflow-hidden rounded-[1.8rem]">
                <video
                  className="absolute inset-0 h-full w-full object-cover object-[50%_32%] scale-[1.22]"
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
          </div>
        </motion.div>
      </div>
    </section>
  );
}
