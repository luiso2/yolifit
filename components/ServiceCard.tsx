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
      className="group relative h-[420px] md:h-[500px] w-full overflow-hidden border-b border-white/10 bg-black cursor-pointer"
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
          className="h-full w-full object-cover grayscale will-change-transform"
          variants={{
            rest: { scale: 1, opacity: 0.4, filter: 'grayscale(100%)' },
            hover: { scale: 1.08, opacity: 0.8, filter: 'grayscale(0%)' }
          }}
          referrerPolicy="no-referrer"
          transition={{ duration: 0.8, ease: [0.33, 1, 0.68, 1] }}
        />
        <div className="absolute inset-0 bg-black/60 group-hover:bg-[#2A241C]/40 transition-colors duration-500" />
      </div>

      {/* Elegant Frame Accents */}
      <div className="absolute inset-4 border border-white/5 group-hover:border-white/20 transition-colors duration-500 pointer-events-none rounded-2xl" />

      {/* Overlay Info */}
      <div className="absolute inset-0 p-8 md:p-10 flex flex-col justify-between pointer-events-none">
        <div className="flex justify-between items-start">
           <span className="text-xs font-mono font-medium tracking-wider border border-[#B19073]/40 bg-black/70 text-[#EDE5DA] px-4 py-2 rounded-full backdrop-blur-md flex items-center gap-1.5">
             <Sparkles className="w-3.5 h-3.5 text-[#EDE5DA]" />
             {service.category}
           </span>
           <motion.div
             variants={{
               rest: { opacity: 0, x: 20, y: -20 },
               hover: { opacity: 1, x: 0, y: 0 }
             }}
             className="bg-[#EDE5DA] text-black rounded-full p-3 will-change-transform shadow-lg"
           >
             <ArrowUpRight className="w-5 h-5" />
           </motion.div>
        </div>

        <div>
          <div className="flex items-center gap-2 mb-2 text-[#EDE5DA] text-xs font-mono tracking-widest uppercase">
            <Clock className="w-3.5 h-3.5" />
            <span>{service.duration}</span>
            <span className="text-white/30">•</span>
            <span>Desde {service.price}</span>
          </div>

          <div className="overflow-hidden">
            <motion.h3
              className="font-heading text-2xl md:text-3xl font-light uppercase text-white mix-blend-difference tracking-tight will-change-transform"
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
            className="text-xs font-semibold uppercase tracking-widest text-[#EDE5DA] mt-3 will-change-transform"
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
