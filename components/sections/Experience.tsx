'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { useTranslations } from 'next-intl';
import GradientText from '@/components/GradientText';

const heroImage = '/media/yoly-experience.jpg';

const Experience: React.FC = () => {
  const t = useTranslations('experience');
  const bio = t.raw('bio') as string[];

  return (
    <section id="experiencia" className="relative z-10 py-20 md:py-32 bg-brand-sand/35 border-t border-black/[0.05] overflow-hidden">
      <div className="absolute top-1/2 right-[-20%] w-[55vw] h-[55vw] bg-brand-bronze/20 rounded-full blur-[60px] pointer-events-none will-change-transform" style={{ transform: 'translateZ(0)' }} />

      <div className="max-w-7xl mx-auto px-6 md:px-12 relative">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 md:gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            className="lg:col-span-5 order-2 lg:order-1"
          >
            <p className="text-brand-bronze font-mono tracking-widest uppercase text-xs mb-2">{t('eyebrow')}</p>
            <h2 className="text-3xl md:text-5xl font-heading font-normal mb-6 leading-tight text-gray-950">
              {t('title').split('Yoly')[0]}
              <GradientText text="Yoly" className="text-4xl md:text-6xl inline font-normal normal-case" />
              {t('title').split('Yoly')[1]}
            </h2>

            <div className="space-y-4 md:space-y-5 text-sm md:text-base text-gray-700 font-light leading-relaxed">
              {bio.map((paragraph) => (
                <p key={paragraph.slice(0, 24)}>{paragraph}</p>
              ))}
              <blockquote className="pt-2 border-l-2 border-brand-caramel/50 pl-4 md:pl-5">
                <p className="font-script text-2xl md:text-3xl text-brand-bronze leading-snug normal-case">&ldquo;{t('quote')}&rdquo;</p>
              </blockquote>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            className="lg:col-span-7 relative h-[380px] md:h-[600px] w-full order-1 lg:order-2"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-brand-bronze to-brand-bronze rounded-3xl rotate-1 opacity-20 blur-lg" />
            <div className="relative h-full w-full rounded-3xl overflow-hidden border border-black/[0.05] group shadow-xl bg-brand-cream">
              <img src={heroImage} alt={t('portraitAlt')} className="h-full w-full object-cover object-center transition-transform duration-[2s] group-hover:scale-105 will-change-transform" referrerPolicy="no-referrer" />
              <div className="absolute inset-x-0 bottom-0 z-10 bg-gradient-to-t from-brand-ink/90 via-brand-ink/55 to-transparent pt-20 pb-6 px-6 md:pt-28 md:pb-10 md:px-10">
                <div className="text-3xl md:text-5xl font-heading font-semibold tracking-wide text-white portrait-neon-title">
                  {t('portraitName')}
                </div>
                <div className="text-[10px] md:text-xs font-mono font-medium tracking-[0.16em] uppercase mt-2 text-brand-caramel portrait-neon-sub leading-relaxed max-w-[280px] md:max-w-sm">
                  {t('credentialsLine1')}
                  <br />
                  {t('credentialsLine2')}
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
