'use client';

import React from 'react';
import { motion } from 'framer-motion';
import GradientText from '@/components/GradientText';

const heroImage = '/media/yoly-experience.jpg';

const BIO_PARAGRAPHS = [
  'Yoly es una profesional venezolana que ha hecho de su pasión por el bienestar y la belleza una misión de vida. Enfermera profesional con experiencia en área quirúrgica, ha combinado sus conocimientos en salud con una sólida formación en estética avanzada para brindar tratamientos seguros, personalizados y con resultados de alta calidad.',
  'Especialista en Estados Unidos en el cuidado integral del rostro y el cuerpo, su enfoque va más allá de la estética: busca mejorar la confianza, el bienestar y la calidad de vida de cada persona que deposita su confianza en sus manos.',
  'Su compromiso con la excelencia, la actualización constante y la atención humana la han convertido en una profesional reconocida por su dedicación, ética y amor por lo que hace.',
  'Para Yoly, cada tratamiento es una oportunidad para resaltar la belleza natural de sus clientes, ofreciendo siempre un servicio basado en el conocimiento, la experiencia y el cuidado.',
];

const Experience: React.FC = () => {
  return (
    <section id="experiencia" className="relative z-10 py-20 md:py-32 bg-brand-sand/35 border-t border-black/[0.05] overflow-hidden">
      <div className="absolute top-1/2 right-[-20%] w-[55vw] h-[55vw] bg-brand-bronze/20 rounded-full blur-[60px] pointer-events-none will-change-transform" style={{ transform: 'translateZ(0)' }} />

      <div className="max-w-7xl mx-auto px-6 md:px-12 relative">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 md:gap-16 items-center">

          {/* Left side: Bio */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            className="lg:col-span-5 order-2 lg:order-1"
          >
            <p className="text-brand-bronze font-mono tracking-widest uppercase text-xs mb-2">Perfil profesional</p>
            <h2 className="text-3xl md:text-5xl font-heading font-normal mb-6 leading-tight text-gray-950">
              ¿Quién es <GradientText text="Yoly" className="text-4xl md:text-6xl inline font-normal normal-case" />?
            </h2>

            <div className="space-y-4 md:space-y-5 text-sm md:text-base text-gray-700 font-light leading-relaxed">
              {BIO_PARAGRAPHS.map((paragraph) => (
                <p key={paragraph.slice(0, 24)}>{paragraph}</p>
              ))}

              <blockquote className="pt-2 border-l-2 border-brand-caramel/50 pl-4 md:pl-5">
                <p className="font-script text-2xl md:text-3xl text-brand-bronze leading-snug normal-case">
                  &ldquo;La verdadera belleza nace cuando el cuidado, la salud y el bienestar se unen en perfecta armonía.&rdquo;
                </p>
              </blockquote>
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
                <div className="font-script text-2xl md:text-3xl text-brand-sand/95 mb-1 md:mb-2 leading-none">
                  Clinical
                </div>
                <div className="text-4xl md:text-6xl font-heading font-light tracking-wide text-white/50">
                  Yoly
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
