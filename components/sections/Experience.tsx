'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Award, ShieldCheck, Heart } from 'lucide-react';
import GradientText from '@/components/GradientText';

const heroImage = '/media/yoly-experience.jpg';

const FEATURES = [
  { icon: Award, title: 'Cosmetóloga Licenciada & Full Specialist', desc: 'Acreditada legalmente con capacitaciones avanzadas en rejuvenecimiento no invasivo, peelings químicos y aparatología regeneradora.' },
  { icon: ShieldCheck, title: 'Notary Public Certificada en Florida', desc: 'Con investidura legal oficial del Estado para certificar, redactar actas, escrituras y autenticar firmas legales de manera rápida y en total privacidad.' },
  { icon: Heart, title: 'Atención 100% Personalizada', desc: 'Cada tipo de piel tiene necesidades únicas. Yoly realiza un diagnóstico inicial exhaustivo antes de realizar cualquier procedimiento estético.' },
];

const Experience: React.FC = () => {
  return (
    <section id="experiencia" className="relative z-10 py-20 md:py-32 bg-brand-sand/35 border-t border-black/[0.05] overflow-hidden">
      <div className="absolute top-1/2 right-[-20%] w-[55vw] h-[55vw] bg-brand-bronze/20 rounded-full blur-[60px] pointer-events-none will-change-transform" style={{ transform: 'translateZ(0)' }} />

      <div className="max-w-7xl mx-auto px-6 md:px-12 relative">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 md:gap-16 items-center">

          {/* Left side: Bio and credentials */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            className="lg:col-span-5 order-2 lg:order-1"
          >
            <p className="text-brand-bronze font-mono tracking-widest uppercase text-xs mb-2">Garantía Profesional</p>
            <h2 className="text-3xl md:text-5xl font-heading font-normal mb-6 leading-tight text-gray-950">
              Sobre <GradientText text="YOLY" className="text-4xl md:text-6xl inline font-normal" />
            </h2>
            <p className="text-sm md:text-base text-gray-700 mb-8 font-light leading-relaxed">
              Yoly es una profesional licenciada como Cosmetóloga y Full Specialist en el estado de Florida. Con años de experiencia y un compromiso inquebrantable con la salud de la piel, su filosofía se basa en potenciar la belleza natural de cada cliente mediante tratamientos hechos a la medida, combinando aparatología de última generación con sueros biológicos de alta pureza.
            </p>

            <div className="space-y-6 md:space-y-8">
              {FEATURES.map((feature, i) => (
                <div key={i} className="flex items-start gap-4">
                  <div className="p-3 rounded-xl bg-white border border-brand-bronze/15 text-brand-bronze shrink-0 shadow-sm">
                    <feature.icon className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm md:text-base font-bold mb-1 text-gray-900">{feature.title}</h4>
                    <p className="text-xs md:text-sm text-gray-600 leading-relaxed font-light">{feature.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Right side: Yoly portrait */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            className="lg:col-span-7 relative h-[380px] md:h-[600px] w-full order-1 lg:order-2"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-brand-bronze to-brand-bronze rounded-3xl rotate-1 opacity-20 blur-lg" />
            <div className="relative h-full w-full rounded-3xl overflow-hidden border border-black/[0.05] group shadow-xl bg-brand-cream">
              <img
                src={heroImage}
                alt="Yoly, cosmetóloga y notaria en Yoly Studio"
                className="h-full w-full object-cover object-center transition-transform duration-[2s] group-hover:scale-105 will-change-transform"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-brand-ink/35 via-transparent to-transparent opacity-70" />

              <div className="absolute bottom-6 left-6 md:bottom-10 md:left-10 z-10 text-white">
                <div className="text-[10px] md:text-xs font-mono tracking-[0.45em] uppercase text-brand-sand/90 mb-2 md:mb-3">
                  Clinical
                </div>
                <div className="text-4xl md:text-6xl font-heading font-light tracking-widest text-white/40">
                  YOLY
                </div>
                <div className="text-xs md:text-sm font-mono tracking-widest uppercase mt-2 text-brand-sand">
                  Cosmetóloga Licenciada & Notary Public
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Experience;
