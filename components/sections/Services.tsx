'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { useLocale, useTranslations } from 'next-intl';
import GradientText from '@/components/GradientText';
import ServiceCard from '@/components/ServiceCard';
import { getSpaServices } from '@/lib/services';
import { SpaService } from '@/lib/types';

interface ServicesProps {
  onSelect: (service: SpaService) => void;
}

const Services: React.FC<ServicesProps> = ({ onSelect }) => {
  const t = useTranslations('servicesSection');
  const locale = useLocale();
  const services = getSpaServices(locale);

  return (
    <section id="servicios" className="relative z-10 py-20 md:py-32">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-100px' }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
        className="max-w-[1600px] mx-auto px-4 md:px-12"
      >
        <div className="flex flex-col md:flex-row justify-between items-end mb-12 md:mb-16 px-4">
          <div>
            <p className="text-brand-caramel font-mono uppercase tracking-[0.25em] text-xs md:text-sm mb-2">{t('eyebrow')}</p>
            <h2 className="leading-[1.05] text-gray-950">
              <span className="block text-4xl md:text-6xl font-heading font-semibold uppercase tracking-tight">{t('titleLine1')}</span>
              <span className="block font-script text-[2.5rem] md:text-[3.75rem] lg:text-[4.25rem] text-brand-bronze leading-[0.95] normal-case mt-1 md:mt-2">{t('titleScript')}</span>
            </h2>
          </div>
          <p className="text-gray-600 text-sm max-w-md mt-4 md:mt-0 leading-relaxed font-light">{t('description')}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 border-t border-l border-black/[0.06] bg-white/20 backdrop-blur-sm">
          {services.map((service) => (
            <ServiceCard key={service.id} service={service} onClick={() => onSelect(service)} />
          ))}
        </div>
      </motion.div>
    </section>
  );
};

export default Services;
