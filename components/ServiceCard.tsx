'use client';

/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import React from 'react';
import { motion } from 'framer-motion';
import { SpaService } from '@/lib/types';
import { ArrowUpRight, Sparkles, Clock, DollarSign } from 'lucide-react';

interface ServiceCardProps {
  service: SpaService;
  onClick: () => void;
}

const ServiceCard: React.FC<ServiceCardProps> = ({ service, onClick }) => {
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
      {/* Image Background with Zoom & Exquisite Soft Filter */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.img
          src={service.image}
          alt={service.name}
          className="h-full w-full object-cover will-change-transform"
          variants={{
            rest: { scale: 1, opacity: 0.75, filter: 'saturate(0.85) brightness(1.05)' },
            hover: { scale: 1.08, opacity: 1, filter: 'saturate(1.1) brightness(1)' }
          }}
          referrerPolicy="no-referrer"
          transition={{ duration: 0.8, ease: [0.33, 1, 0.68, 1] }}
        />
        <div className="absolute inset-0 bg-brand-cream/55 group-hover:bg-brand-sand/25 transition-colors duration-500" />
      </div>

      {/* Elegant Frame Accents */}
      <div className="absolute inset-4 border border-brand-bronze/10 group-hover:border-brand-bronze/30 transition-colors duration-500 pointer-events-none rounded-2xl" />

      {/* Overlay Info */}
      <div className="absolute inset-0 p-8 md:p-10 flex flex-col justify-between pointer-events-none">
        <div className="flex justify-between items-start">
           <span className="text-xs font-mono font-medium tracking-wider border border-brand-caramel/40 bg-white/80 text-brand-ink px-4 py-2 rounded-full backdrop-blur-md flex items-center gap-1.5">
             <Sparkles className="w-3.5 h-3.5 text-brand-bronze" />
             {service.category}
           </span>
           <motion.div
             variants={{
               rest: { opacity: 0, x: 20, y: -20 },
               hover: { opacity: 1, x: 0, y: 0 }
             }}
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
            <span>Desde {service.price}</span>
          </div>

          <div className="overflow-hidden">
            <motion.h3
              className="font-heading text-2xl md:text-3xl font-light uppercase text-brand-ink tracking-tight will-change-transform"
              variants={{
                rest: { y: 0 },
                hover: { y: -4 }
              }}
              transition={{ duration: 0.4 }}
            >
              {service.name}
            </motion.h3>
          </div>

          <motion.p
            className="text-xs font-semibold uppercase tracking-widest text-brand-bronze mt-3 will-change-transform"
            variants={{
              rest: { opacity: 0, y: 10 },
              hover: { opacity: 1, y: 0 }
            }}
            transition={{ duration: 0.4, delay: 0.1 }}
          >
            Ver detalles & reservar
          </motion.p>
        </div>
      </div>
    </motion.div>
  );
};

export default ServiceCard;
