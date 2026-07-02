'use client';

import React from 'react';
import { Instagram } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="relative z-10 border-t border-black/[0.05] py-12 md:py-16 bg-brand-cream">
      <div className="max-w-7xl mx-auto px-6 md:px-12 flex flex-col md:flex-row justify-between items-start md:items-end gap-8">
        <div>
          <div className="flex items-center gap-3 mb-3">
            <img
              src="/media/logo.jpg"
              alt="Yoly Studio logo"
              className="w-12 h-12 rounded-full object-cover border border-brand-caramel/40 shadow-md shrink-0"
            />
            <div className="font-heading text-xl md:text-2xl font-bold tracking-tight text-gray-950 flex flex-col leading-none">
              <div className="flex items-center gap-1.5">
                <span className="font-bold tracking-widest text-brand-bronze">YOLY</span>
                <span className="font-light text-gray-500">STUDIO</span>
              </div>
              <span className="text-[8px] font-mono tracking-[0.2em] text-brand-caramel mt-1 uppercase">Estética, Bienestar & Notaría</span>
            </div>
          </div>
          <p className="text-gray-500 text-xs md:text-sm max-w-sm mb-4 leading-relaxed font-light">
            Santuario boutique de cosmetología licenciada y servicios notariales en Miami, Florida. Diseñado para embellecer tu piel, relajar tu cuerpo y facilitar tus documentos legales oficiales en un solo lugar.
          </p>
          <div className="text-[10px] font-mono text-gray-400 flex flex-col gap-1">
            <span>© {new Date().getFullYear()} Yoly Studio. Todos los derechos reservados. Lic. Florida Cosmetology.</span>
            <a href="https://merktop.com" target="_blank" rel="noopener noreferrer" className="text-brand-brown/60 hover:text-brand-caramel text-xs tracking-widest uppercase transition-colors">
              Powered by Merktop
            </a>
          </div>
        </div>

        <div className="flex gap-6 md:gap-8 flex-wrap items-center">
          <a href="https://www.instagram.com/yolystudio.fit" target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-brand-caramel font-bold uppercase text-xs tracking-widest transition-colors cursor-pointer flex items-center gap-1.5" data-hover="true">
            <Instagram className="w-4 h-4" /> Instagram
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
