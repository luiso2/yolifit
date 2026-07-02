'use client';

import React from 'react';
import { motion } from 'framer-motion';
import ServiceCard from '@/components/ServiceCard';
import { SPA_SERVICES } from '@/lib/services';
import { SpaService } from '@/lib/types';

interface ServicesProps {
  onSelect: (service: SpaService) => void;
}

const Services: React.FC<ServicesProps> = ({ onSelect }) => {
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
            <p className="text-brand-caramel font-mono uppercase tracking-[0.25em] text-xs md:text-sm mb-2">Tratamientos Especializados</p>
            <h2 className="text-4xl md:text-6xl font-heading font-normal uppercase leading-[1.1] text-gray-950">
              Estética, Cuidado <br />
              <span className="italic font-light text-brand-bronze">& Bienestar</span>
            </h2>
          </div>
          <p className="text-gray-600 text-sm max-w-md mt-4 md:mt-0 leading-relaxed font-light">
            Diseños de cabina de vanguardia y tratamientos personalizados de cosmetología, masajes reductores y rejuvenecimiento celular. Todos aplicados bajo estricto rigor clínico.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 border-t border-l border-black/[0.06] bg-white/20 backdrop-blur-sm">
          {SPA_SERVICES.map((service) => (
            <ServiceCard key={service.id} service={service} onClick={() => onSelect(service)} />
          ))}
        </div>
      </motion.div>
    </section>
  );
};

export default Services;
