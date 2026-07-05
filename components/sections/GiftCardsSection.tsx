'use client';

import React from 'react';
import { Gift } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/routing';

const GiftCardsSection: React.FC = () => {
  const t = useTranslations('giftCards.section');

  return (
    <section id="gift-cards" className="relative z-10 py-20 md:py-28 px-4 md:px-6 bg-white/30 border-t border-b border-black/[0.04]">
      <div className="max-w-3xl mx-auto text-center flex flex-col items-center gap-5">
        <span className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-brand-bronze/10 text-brand-bronze border border-brand-bronze/20">
          <Gift className="w-6 h-6" />
        </span>
        <span className="text-xs font-mono uppercase tracking-[0.3em] text-brand-bronze">{t('eyebrow')}</span>
        <h2 className="font-heading text-3xl md:text-5xl font-normal leading-tight text-brand-ink">{t('title')}</h2>
        <p className="text-brand-brown/80 text-sm md:text-base max-w-xl font-light leading-relaxed">{t('description')}</p>
        <Link
          href="/gift-cards"
          className="mt-2 inline-flex items-center gap-2 px-8 py-4 bg-brand-bronze text-white text-xs font-bold uppercase tracking-widest rounded-full hover:bg-brand-caramel transition-colors"
          data-hover="true"
        >
          {t('cta')}
        </Link>
      </div>
    </section>
  );
};

export default GiftCardsSection;
