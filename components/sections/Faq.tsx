'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus } from 'lucide-react';
import { useLocale, useTranslations } from 'next-intl';
import { getFaqItems } from '@/lib/services';

interface FaqProps {
  openIdx: number | null;
  setOpenIdx: (idx: number | null) => void;
}

const Faq: React.FC<FaqProps> = ({ openIdx, setOpenIdx }) => {
  const t = useTranslations('faq');
  const locale = useLocale();
  const faqItems = getFaqItems(locale);

  return (
    <section className="relative z-10 py-20 bg-white border-t border-black/[0.03]">
      <div className="max-w-4xl mx-auto px-6">
        <div className="text-center mb-14">
          <span className="text-[10px] font-mono text-brand-bronze uppercase tracking-[0.25em] font-bold block mb-3">{t('eyebrow')}</span>
          <h2 className="text-2xl md:text-4xl font-heading font-medium text-gray-900 tracking-tight">{t('title')}</h2>
          <div className="w-12 h-0.5 bg-brand-caramel mx-auto mt-4 opacity-60" />
        </div>

        <div className="space-y-4">
          {faqItems.map((item, idx) => {
            const isOpen = openIdx === idx;
            return (
              <div key={idx} className="border-b border-brand-bronze/10 pb-5 pt-2">
                <button type="button" onClick={() => setOpenIdx(isOpen ? null : idx)} className="w-full flex items-center justify-between text-left gap-4 py-2 bg-transparent border-none cursor-pointer group focus:outline-none">
                  <span className="font-heading font-medium text-sm md:text-base text-gray-800 group-hover:text-brand-bronze transition-colors duration-300">{item.question}</span>
                  <span className="shrink-0 w-6 h-6 rounded-full bg-brand-cream border border-black/[0.03] flex items-center justify-center text-brand-bronze group-hover:bg-brand-bronze group-hover:text-white transition-all duration-300">
                    <motion.div animate={{ rotate: isOpen ? 45 : 0 }} transition={{ duration: 0.2 }} className="flex items-center justify-center">
                      <Plus className="w-3.5 h-3.5" />
                    </motion.div>
                  </span>
                </button>

                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      key="content"
                      initial="collapsed"
                      animate="open"
                      exit="collapsed"
                      variants={{ open: { opacity: 1, height: 'auto', marginTop: 12 }, collapsed: { opacity: 0, height: 0, marginTop: 0 } }}
                      transition={{ duration: 0.3, ease: [0.04, 0.62, 0.23, 0.98] }}
                      className="overflow-hidden"
                    >
                      <div className="text-gray-600 text-xs md:text-sm leading-relaxed font-light pl-1 bg-brand-cream/40 p-4 rounded-2xl border border-black/[0.01]">{item.answer}</div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Faq;
