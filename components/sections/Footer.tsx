'use client';

import React from 'react';
import { Instagram } from 'lucide-react';
import { useTranslations } from 'next-intl';

const Footer: React.FC = () => {
  const t = useTranslations('footer');

  return (
    <footer className="relative z-10 border-t border-black/[0.05] py-12 md:py-16 bg-brand-cream">
      <div className="max-w-7xl mx-auto px-6 md:px-12 flex flex-col md:flex-row justify-between items-start md:items-end gap-8">
        <div>
          <div className="flex items-center gap-3 mb-3">
            <img src="/media/logo.png" alt="Clinic YolyStudio logo" className="w-12 h-12 object-contain shrink-0" />
            <div className="font-heading text-xl md:text-2xl tracking-tight text-gray-950 flex flex-col leading-none">
              <span className="font-script text-2xl text-brand-bronze leading-none">Clinic</span>
              <span className="font-medium text-brand-bronze mt-1 leading-none">
                Yoly<span className="font-light text-brand-caramel">Studio</span>
              </span>
            </div>
          </div>
          <p className="text-gray-500 text-xs md:text-sm max-w-sm mb-4 leading-relaxed font-light">{t('description')}</p>
          <div className="text-[10px] font-mono text-gray-400 flex flex-col gap-1">
            <span>{t('copyright', { year: new Date().getFullYear() })}</span>
            <a href="https://merktop.com" target="_blank" rel="noopener noreferrer" className="text-brand-brown/60 hover:text-brand-caramel text-xs tracking-widest uppercase transition-colors">
              Powered by Merktop
            </a>
          </div>
        </div>

        <div className="flex gap-6 md:gap-8 flex-wrap items-center">
          <a href="https://www.instagram.com/yolystudio.fit" target="_blank" rel="noopener noreferrer" className="font-bold uppercase text-xs tracking-widest transition-opacity hover:opacity-80 cursor-pointer flex items-center gap-1.5 text-brand-caramel" data-hover="true">
            <Instagram className="w-4 h-4 shrink-0 text-[#E1306C]" aria-hidden />
            {t('instagram')}
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
