'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { MapPin, Star, ExternalLink, PenLine } from 'lucide-react';
import { useLocale, useTranslations } from 'next-intl';
import GradientText from '@/components/GradientText';
import { GOOGLE_BUSINESS, GOOGLE_REVIEWS } from '@/lib/google-business';

function Stars({ count }: { count: number }) {
  return (
    <div className="flex items-center gap-0.5" aria-label={`${count} stars`}>
      {Array.from({ length: 5 }).map((_, index) => (
        <Star
          key={index}
          className={`w-3.5 h-3.5 ${index < count ? 'fill-brand-bronze text-brand-bronze' : 'text-brand-bronze/20'}`}
        />
      ))}
    </div>
  );
}

const Reviews: React.FC = () => {
  const t = useTranslations('reviews');
  const locale = useLocale();

  return (
    <section id="resenas" className="relative z-10 py-20 md:py-32 bg-white/40 border-t border-black/[0.04] overflow-hidden">
      <div
        className="pointer-events-none absolute -left-[10%] top-1/3 w-[40vw] h-[40vw] bg-brand-bronze/10 rounded-full blur-[80px]"
        aria-hidden
      />

      <div className="max-w-7xl mx-auto px-6 md:px-12 relative">
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.7, ease: 'easeOut' }}
          className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-8 mb-12 md:mb-16"
        >
          <div className="max-w-xl">
            <p className="text-brand-bronze font-mono tracking-widest uppercase text-xs mb-2">{t('eyebrow')}</p>
            <h2 className="text-3xl md:text-5xl font-heading font-normal text-gray-950 leading-tight">
              {t('title')}{' '}
              <GradientText text={t('titleHighlight')} className="text-4xl md:text-6xl inline font-normal" />
            </h2>
            <p className="text-gray-600 text-sm md:text-base mt-4 font-light leading-relaxed">{t('description')}</p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 shrink-0">
            <a
              href={GOOGLE_BUSINESS.writeReviewUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-brand-bronze text-white text-xs font-bold uppercase tracking-widest rounded-full hover:bg-brand-caramel transition-colors shadow-lg shadow-brand-bronze/20"
              data-hover="true"
            >
              <PenLine className="w-4 h-4" />
              {t('writeReview')}
            </a>
            <a
              href={GOOGLE_BUSINESS.mapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 px-6 py-3.5 border border-brand-bronze/25 bg-white/80 text-brand-bronze text-xs font-bold uppercase tracking-widest rounded-full hover:bg-brand-bronze hover:text-white transition-colors backdrop-blur-sm"
              data-hover="true"
            >
              <ExternalLink className="w-4 h-4" />
              {t('viewOnGoogle')}
            </a>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-stretch">
          <div className="lg:col-span-7 flex flex-col gap-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="flex flex-wrap items-center gap-4 md:gap-6 p-5 md:p-6 rounded-3xl bg-white/80 border border-brand-bronze/10 shadow-sm backdrop-blur-md"
            >
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-white border border-black/[0.06] flex items-center justify-center shadow-sm">
                  <svg viewBox="0 0 24 24" className="w-6 h-6" aria-hidden>
                    <path
                      fill="#4285F4"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="#34A853"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    />
                    <path
                      fill="#EA4335"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    />
                  </svg>
                </div>
                <div>
                  <p className="font-heading text-lg text-gray-950 leading-none">{GOOGLE_BUSINESS.name}</p>
                  <p className="text-[11px] font-mono text-gray-500 mt-1 flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-brand-bronze" />
                    {GOOGLE_BUSINESS.locationLabel}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 ml-auto">
                <span className="font-heading text-3xl text-brand-bronze leading-none">{GOOGLE_BUSINESS.rating.toFixed(1)}</span>
                <div>
                  <Stars count={GOOGLE_BUSINESS.rating} />
                  <p className="text-[10px] font-mono uppercase tracking-widest text-gray-500 mt-1">{t('googleReviews')}</p>
                </div>
              </div>
            </motion.div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {GOOGLE_REVIEWS.map((review, index) => (
                <motion.article
                  key={review.id}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-40px' }}
                  transition={{ duration: 0.5, delay: index * 0.08 }}
                  className="flex flex-col gap-3 p-5 md:p-6 rounded-3xl bg-brand-cream/80 border border-brand-bronze/10 shadow-sm backdrop-blur-sm hover:border-brand-bronze/25 transition-colors"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="font-heading text-base text-gray-950">{review.author}</p>
                      <p className="text-[10px] font-mono uppercase tracking-widest text-brand-caramel mt-1">{t('verified')}</p>
                    </div>
                    <Stars count={review.rating} />
                  </div>
                  <p className="text-sm text-gray-700 font-light leading-relaxed flex-1">
                    &ldquo;{locale === 'en' ? review.textEn : review.textEs}&rdquo;
                  </p>
                </motion.article>
              ))}
            </div>
          </div>

          <motion.div
            initial={{ opacity: 0, x: 28 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.7, ease: 'easeOut' }}
            className="lg:col-span-5 flex flex-col gap-4"
          >
            <div className="relative flex-1 min-h-[320px] md:min-h-[420px] rounded-3xl overflow-hidden border border-brand-bronze/10 shadow-lg bg-white">
              <iframe
                title={t('mapTitle')}
                src={GOOGLE_BUSINESS.mapsEmbedUrl}
                className="absolute inset-0 w-full h-full border-0"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                allowFullScreen
              />
            </div>
            <div className="rounded-2xl bg-white/80 border border-brand-bronze/10 p-4 md:p-5 backdrop-blur-sm">
              <p className="text-xs font-mono uppercase tracking-widest text-brand-bronze mb-2">{t('locationEyebrow')}</p>
              <p className="font-heading text-lg text-gray-950">{GOOGLE_BUSINESS.name}</p>
              <p className="text-sm text-gray-600 font-light mt-1">{GOOGLE_BUSINESS.locationLabel}</p>
              <a
                href={GOOGLE_BUSINESS.writeReviewUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-brand-bronze hover:text-brand-caramel transition-colors"
                data-hover="true"
              >
                <PenLine className="w-3.5 h-3.5" />
                {t('leaveReviewCta')}
              </a>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Reviews;
