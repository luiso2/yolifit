'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { useTranslations } from 'next-intl';
import { SpaService } from '@/lib/types';
import { ArrowUpRight, Clock } from 'lucide-react';

interface ServiceCardProps {
  service: SpaService;
  onClick: () => void;
}

const ServiceCard: React.FC<ServiceCardProps> = ({ service, onClick }) => {
  const t = useTranslations('serviceCard');

  return (
    <motion.div
      className="group relative h-[420px] md:h-[500px] w-full overflow-hidden border-b border-r border-black/[0.06] bg-brand-cream cursor-pointer"
      initial="rest"
      whileHover="hover"
      whileTap="hover"
      animate="rest"
      data-hover="true"
      onClick={onClick}
    >
      <div className="absolute inset-0 overflow-hidden">
        {service.video ? (
          <video
            src={service.video}
            autoPlay
            muted
            loop
            playsInline
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
        ) : (
          /* eslint-disable-next-line @next/next/no-img-element */
          <img
            src={service.image}
            alt={service.name}
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            referrerPolicy="no-referrer"
          />
        )}
        <div
          className={`absolute inset-0 transition-opacity duration-500 ${
            service.video ? 'service-media-overlay-video' : 'service-media-overlay-image'
          }`}
        />
      </div>

      <div className="absolute inset-4 border border-brand-bronze/10 group-hover:border-brand-bronze/30 transition-colors duration-500 pointer-events-none rounded-2xl" />

      <div className="absolute inset-0 p-8 md:p-10 flex flex-col justify-between pointer-events-none">
        <div className="flex justify-between items-start">
          <div className="flex flex-wrap gap-2 max-w-[70%]">
            <span className="text-xs font-mono font-medium tracking-wider border border-brand-caramel/40 bg-white/80 text-brand-ink px-4 py-2 rounded-full backdrop-blur-md">
              {service.category}
            </span>
            {service.video ? (
              <span className="text-[10px] font-mono font-semibold tracking-[0.14em] uppercase border border-brand-bronze/30 bg-brand-bronze/90 text-white px-3 py-1.5 rounded-full backdrop-blur-md self-center">
                {t('watchTreatment')}
              </span>
            ) : null}
          </div>
          <motion.div
            variants={{ rest: { opacity: 0, x: 20, y: -20 }, hover: { opacity: 1, x: 0, y: 0 } }}
            className="bg-brand-bronze text-white rounded-full p-3 will-change-transform shadow-lg"
          >
            <ArrowUpRight className="w-5 h-5" />
          </motion.div>
        </div>

        <div>
          <div className="flex items-center gap-2 mb-2 text-brand-brown text-xs font-mono tracking-widest uppercase">
            <Clock className="w-3.5 h-3.5" />
            <span>{service.duration}</span>
            <span className="text-brand-caramel/50">•</span>
            <span>{t('fromPrice', { price: service.price })}</span>
          </div>
          <div className="overflow-hidden">
            <motion.h3
              className="font-heading text-2xl md:text-3xl font-light uppercase text-brand-ink tracking-tight will-change-transform"
              variants={{ rest: { y: 0 }, hover: { y: -4 } }}
              transition={{ duration: 0.4 }}
            >
              {service.name}
            </motion.h3>
          </div>
          <motion.p
            className="text-xs font-semibold uppercase tracking-widest text-brand-bronze mt-3 will-change-transform"
            variants={{ rest: { opacity: 0, y: 10 }, hover: { opacity: 1, y: 0 } }}
            transition={{ duration: 0.4, delay: 0.1 }}
          >
            {t('viewDetails')}
          </motion.p>
        </div>
      </div>
    </motion.div>
  );
};

export default ServiceCard;
