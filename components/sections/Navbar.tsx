'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X } from 'lucide-react';
import { useLocale, useTranslations } from 'next-intl';
import { Link, usePathname } from '@/i18n/routing';
import LanguageSwitcher from '@/components/LanguageSwitcher';

interface NavbarProps {
  mobileMenuOpen: boolean;
  setMobileMenuOpen: (open: boolean) => void;
}

const Navbar: React.FC<NavbarProps> = ({ mobileMenuOpen, setMobileMenuOpen }) => {
  const t = useTranslations('nav');
  const locale = useLocale();
  const pathname = usePathname();

  const menuItems = [
    { key: 'services', id: 'servicios', label: t('services') },
    { key: 'experience', id: 'experiencia', label: t('experience') },
    { key: 'reviews', id: 'resenas', label: t('reviews') },
    { key: 'instagram', id: 'instagram', label: t('instagram') },
    { key: 'reservas', id: 'reservas', href: '/reservas', label: t('reservas') },
  ] as const;

  const scrollToSection = (id: string) => {
    setMobileMenuOpen(false);
    if (pathname !== '/') {
      window.location.href = `/${locale}/#${id}`;
      return;
    }
    const element = document.getElementById(id);
    if (element) {
      const headerOffset = 90;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.scrollY - headerOffset;
      window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
    }
  };

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-40 flex items-center gap-4 px-6 md:px-12 py-5 bg-brand-cream/85 backdrop-blur-md border-b border-black/[0.05]">
        <div className="flex items-center gap-3 z-50 shrink-0">
          <img src="/media/logo.png" alt="Clinic YolyStudio logo" className="w-20 h-20 md:w-24 md:h-24 object-contain shrink-0" />
          <div className="font-heading text-xl md:text-2xl tracking-tight text-black cursor-default flex flex-col items-start leading-none">
            <span className="font-script text-2xl md:text-[1.75rem] text-brand-bronze leading-none">Clinic</span>
            <span className="mt-1 leading-none">
              <span className="font-medium text-brand-bronze">Yoly</span>
              <span className="font-light text-brand-caramel">Studio</span>
            </span>
          </div>
        </div>

        <div className="hidden lg:flex flex-1 justify-center gap-8 xl:gap-10 text-xs font-semibold tracking-[0.2em] uppercase text-gray-700 items-center min-w-0">
          {menuItems.map((item) =>
            'href' in item ? (
              <Link
                key={item.key}
                href={item.href}
                className="hover:text-brand-caramel transition-colors cursor-pointer bg-transparent border-none font-heading text-xs tracking-widest uppercase font-medium whitespace-nowrap"
                data-hover="true"
              >
                {item.label}
              </Link>
            ) : (
              <button
                key={item.key}
                onClick={() => scrollToSection(item.id)}
                className="hover:text-brand-caramel transition-colors cursor-pointer bg-transparent border-none font-heading text-xs tracking-widest uppercase font-medium whitespace-nowrap"
                data-hover="true"
              >
                {item.label}
              </button>
            ),
          )}
        </div>

        <div className="hidden lg:flex items-center gap-3 shrink-0 ml-auto">
          <LanguageSwitcher />
          <Link
            href="/reservas"
            className="border border-brand-bronze hover:bg-brand-bronze hover:text-white px-7 py-2.5 text-xs font-semibold tracking-widest uppercase transition-all duration-300 text-brand-bronze cursor-pointer bg-transparent font-heading whitespace-nowrap"
            data-hover="true"
          >
            {t('bookNow')}
          </Link>
        </div>

        <div className="lg:hidden flex items-center gap-3 z-50 ml-auto shrink-0">
          <button
            className="text-gray-800 relative w-10 h-10 flex items-center justify-center"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </nav>

      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 26, stiffness: 180 }}
            className="fixed inset-y-0 right-0 left-0 z-30 bg-brand-cream/90 backdrop-blur-xl flex flex-col items-center justify-center gap-6 lg:hidden px-6 shadow-2xl"
          >
            {menuItems.map((item, idx) =>
              'href' in item ? (
                <motion.div key={item.key} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 + idx * 0.08, ease: 'easeOut', duration: 0.4 }}>
                  <Link
                    href={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className="text-3xl font-heading font-medium text-gray-900 hover:text-brand-caramel transition-colors uppercase bg-transparent border-none cursor-pointer"
                  >
                    {item.label}
                  </Link>
                </motion.div>
              ) : (
                <motion.button
                  key={item.key}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.15 + idx * 0.08, ease: 'easeOut', duration: 0.4 }}
                  onClick={() => scrollToSection(item.id)}
                  className="text-3xl font-heading font-medium text-gray-900 hover:text-brand-caramel transition-colors uppercase bg-transparent border-none cursor-pointer"
                >
                  {item.label}
                </motion.button>
              ),
            )}

            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.5, ease: 'easeOut', duration: 0.4 }}>
              <Link
                href="/reservas"
                onClick={() => setMobileMenuOpen(false)}
                className="mt-6 inline-block border border-brand-bronze px-8 py-3.5 text-xs font-bold tracking-widest uppercase bg-brand-bronze text-white hover:bg-brand-brown rounded-xl transition-all shadow-md shadow-brand-bronze/15 cursor-pointer"
              >
                {t('bookNow')}
              </Link>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;
