'use client';

import React from 'react';
import Image from 'next/image';
import { motion, useScroll, useTransform } from 'framer-motion';

const Hero: React.FC = () => {
  const { scrollYProgress } = useScroll();
  const y = useTransform(scrollYProgress, [0, 1], [0, -80]);
  const opacity = useTransform(scrollYProgress, [0, 0.25], [1, 0]);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      const headerOffset = 90;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.scrollY - headerOffset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  return (
    <header className="relative min-h-[100svh] flex flex-col items-center justify-center overflow-hidden px-4 md:px-6 pt-28 pb-16 md:pt-24 md:pb-12">
      {/* Large atmospheric background photo, right side only, desktop only so it never sits under the mobile text flow */}
      <motion.div
        aria-hidden
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.4, ease: 'circOut' }}
        className="hidden md:block absolute inset-y-0 right-0 z-0 w-[52%] pointer-events-none"
        style={{
          maskImage: 'linear-gradient(to right, transparent, rgba(0,0,0,0.9) 55%, black 75%)',
          WebkitMaskImage: 'linear-gradient(to right, transparent, rgba(0,0,0,0.9) 55%, black 75%)'
        }}
      >
        <Image
          src="/media/yoly-laptop-hero.jpg"
          alt=""
          fill
          priority
          sizes="58vw"
          className="object-cover object-top opacity-55"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-brand-cream via-transparent to-transparent" />
      </motion.div>

      <motion.div
        style={{ y, opacity }}
        className="z-10 w-full max-w-6xl"
      >
        {/* Text column */}
        <div className="flex flex-col items-center md:items-start text-center md:text-left md:max-w-sm">
          {/* Studio Identity tag */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.1 }}
            className="flex items-center gap-2 md:gap-4 text-[10px] md:text-xs font-mono text-brand-bronze tracking-[0.25em] uppercase mb-5 bg-white/60 px-5 py-2.5 rounded-full border border-brand-bronze/15 shadow-sm backdrop-blur-md"
          >
            <span>Cosmetóloga & Full Specialist</span>
            <span className="w-1.5 h-1.5 bg-brand-caramel rounded-full animate-pulse" />
            <span>Notary Public Certificada</span>
          </motion.div>

          {/* Main Title */}
          <div className="relative w-full flex flex-col items-center md:items-start">
            <h1 className="text-center md:text-left leading-none">
              <span className="block font-script text-[2.5rem] md:text-[3.5rem] lg:text-[4rem] text-brand-bronze leading-none mb-2 md:mb-4">
                Clinic
              </span>
              <span className="block text-[13vw] md:text-[4.75rem] lg:text-[5.5rem] font-heading font-medium leading-[0.95]">
                <span className="text-brand-bronze">Yoly</span>{' '}
                <span className="font-light text-gray-500">Studio</span>
              </span>
            </h1>

            {/* Elegant Glow Ring */}
            <motion.div
              className="absolute -z-20 w-[40vw] h-[40vw] bg-brand-bronze/30 blur-[50px] rounded-full pointer-events-none will-change-transform"
              animate={{ scale: [0.95, 1.05, 0.95], opacity: [0.3, 0.5, 0.3] }}
              transition={{ duration: 10, repeat: Infinity }}
              style={{ transform: 'translateZ(0)' }}
            />
          </div>

          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 1.5, delay: 0.4, ease: 'circOut' }}
            className="w-full max-w-lg h-px bg-gradient-to-r from-transparent via-brand-caramel/40 to-transparent mt-5 md:mt-8 mb-5 md:mb-8 md:from-brand-caramel/40 md:via-brand-caramel/10 md:to-transparent"
          />

          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, duration: 1 }}
            className="text-sm md:text-lg font-light max-w-xl mx-auto md:mx-0 text-gray-700 leading-relaxed px-4 md:px-0"
          >
            &quot;Faciales premium, rejuvenecimiento de alta gama y tratamientos corporales personalizados, combinados con servicios oficiales de notaría para tu total comodidad.&quot;
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9, duration: 1 }}
            className="mt-8 flex flex-col sm:flex-row gap-4"
          >
            <button
              onClick={() => scrollToSection('servicios')}
              className="px-8 py-3.5 bg-brand-bronze text-white hover:bg-brand-brown transition-all text-xs font-semibold tracking-widest uppercase font-heading rounded-none shadow-md"
              data-hover="true"
            >
              Ver Tratamientos
            </button>
            <button
              onClick={() => scrollToSection('experiencia')}
              className="px-8 py-3.5 border border-brand-bronze/30 text-brand-bronze hover:bg-white/40 transition-all text-xs font-semibold tracking-widest uppercase font-heading rounded-none"
              data-hover="true"
            >
              Conocer a Yoly
            </button>
          </motion.div>
        </div>
      </motion.div>
    </header>
  );
};

export default Hero;
