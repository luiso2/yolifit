'use client';

import React from 'react';
import { Instagram, Mail, Phone } from 'lucide-react';
import { useTranslations } from 'next-intl';

const CONTACT_EMAIL = 'info@clinicyolystudiofit.com';
const CONTACT_PHONE_HREF = 'tel:+13052199262';

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
              <span className="mt-1 leading-none">
                <span className="font-medium text-brand-bronze">Yoly</span>
                <span className="font-light text-brand-caramel">Studio</span>
              </span>
            </div>
          </div>
          <p className="text-gray-500 text-xs md:text-sm max-w-sm mb-4 leading-relaxed font-light">{t('description')}</p>

          <div className="mb-5 flex flex-col gap-2">
            <p className="text-[10px] font-mono uppercase tracking-[0.2em] text-brand-bronze font-semibold">{t('contact')}</p>
            <a
              href={`mailto:${CONTACT_EMAIL}`}
              className="inline-flex items-center gap-2 text-sm text-gray-700 hover:text-brand-bronze transition-colors font-light"
              data-hover="true"
            >
              <Mail className="w-4 h-4 shrink-0 text-brand-caramel" aria-hidden />
              {t('email')}
            </a>
            <a
              href={CONTACT_PHONE_HREF}
              className="inline-flex items-center gap-2 text-sm text-gray-700 hover:text-brand-bronze transition-colors font-light"
              data-hover="true"
            >
              <Phone className="w-4 h-4 shrink-0 text-brand-caramel" aria-hidden />
              {t('phone')}
            </a>
          </div>

          <div className="flex flex-col gap-3">
            <span className="text-[10px] font-mono text-gray-400">{t('copyright', { year: new Date().getFullYear() })}</span>
            <a
              href="https://merktop.com"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex w-fit items-center gap-2 rounded-full border border-brand-bronze/30 bg-brand-bronze/10 px-4 py-2 text-[11px] font-mono font-semibold uppercase tracking-[0.18em] text-brand-bronze shadow-sm shadow-brand-bronze/10 transition-all hover:border-brand-caramel hover:bg-brand-bronze hover:text-white hover:shadow-md hover:shadow-brand-bronze/20"
              data-hover="true"
            >
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
