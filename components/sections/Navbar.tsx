'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface NavbarProps {
  mobileMenuOpen: boolean;
  setMobileMenuOpen: (open: boolean) => void;
}

const MENU_ITEMS = ['Servicios', 'Experiencia', 'Instagram', 'Reservas'];

const Navbar: React.FC<NavbarProps> = ({ mobileMenuOpen, setMobileMenuOpen }) => {
  const pathname = usePathname();

  const scrollToSection = (id: string) => {
    setMobileMenuOpen(false);
    if (pathname !== '/') {
      window.location.href = `/#${id}`;
      return;
    }
    const element = document.getElementById(id);
    if (element) {
      const headerOffset = 90;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.scrollY - headerOffset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  return (
    <>
      {/* Navigation - Luxurious Minimal Blur */}
      <nav className="fixed top-0 left-0 right-0 z-40 flex items-center justify-between px-6 md:px-12 py-5 bg-brand-cream/85 backdrop-blur-md border-b border-black/[0.05]">
        <div className="flex items-center gap-3 z-50">
          <img
            src="/media/logo.png"
            alt="Yoly Studio logo"
            className="w-11 h-11 md:w-12 md:h-12 object-contain shrink-0"
          />
          <div className="font-heading text-xl md:text-2xl tracking-tight text-black cursor-default flex flex-col items-start leading-none">
            <span className="font-script text-2xl md:text-[1.75rem] text-brand-bronze leading-none">
              Clinical
            </span>
            <div className="flex items-center gap-1.5 mt-1">
              <span className="font-medium text-brand-bronze">Yoly</span>
              <span className="font-light text-gray-500">Studio</span>
            </div>
          </div>
        </div>

        {/* Desktop Menu */}
        <div className="hidden lg:flex gap-10 text-xs font-semibold tracking-[0.2em] uppercase text-gray-700">
          {MENU_ITEMS.map((item) =>
            item === 'Reservas' ? (
              <Link
                key={item}
                href="/reservas"
                className="hover:text-brand-caramel transition-colors cursor-pointer bg-transparent border-none font-heading text-xs tracking-widest uppercase font-medium"
                data-hover="true"
              >
                {item}
              </Link>
            ) : (
              <button
                key={item}
                onClick={() => scrollToSection(item.toLowerCase())}
                className="hover:text-brand-caramel transition-colors cursor-pointer bg-transparent border-none font-heading text-xs tracking-widest uppercase font-medium"
                data-hover="true"
              >
                {item}
              </button>
            ),
          )}
        </div>
        <Link
          href="/reservas"
          className="hidden lg:inline-block border border-brand-bronze hover:bg-brand-bronze hover:text-white px-7 py-2.5 text-xs font-semibold tracking-widest uppercase transition-all duration-300 text-brand-bronze cursor-pointer bg-transparent font-heading"
          data-hover="true"
        >
          Reservar Ahora
        </Link>

        {/* Mobile Menu Toggle */}
        <button
          className="lg:hidden text-gray-800 z-50 relative w-10 h-10 flex items-center justify-center"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </nav>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 26, stiffness: 180 }}
            className="fixed inset-y-0 right-0 left-0 z-30 bg-brand-cream/90 backdrop-blur-xl flex flex-col items-center justify-center gap-6 lg:hidden px-6 shadow-2xl"
          >
            {MENU_ITEMS.map((item, idx) =>
              item === 'Reservas' ? (
                <motion.div
                  key={item}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.15 + idx * 0.08, ease: 'easeOut', duration: 0.4 }}
                >
                  <Link
                    href="/reservas"
                    onClick={() => setMobileMenuOpen(false)}
                    className="text-3xl font-heading font-medium text-gray-900 hover:text-brand-caramel transition-colors uppercase bg-transparent border-none cursor-pointer"
                  >
                    {item}
                  </Link>
                </motion.div>
              ) : (
                <motion.button
                  key={item}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.15 + idx * 0.08, ease: 'easeOut', duration: 0.4 }}
                  onClick={() => {
                    scrollToSection(item.toLowerCase());
                    setMobileMenuOpen(false);
                  }}
                  className="text-3xl font-heading font-medium text-gray-900 hover:text-brand-caramel transition-colors uppercase bg-transparent border-none cursor-pointer"
                >
                  {item}
                </motion.button>
              ),
            )}

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.5, ease: 'easeOut', duration: 0.4 }}
            >
              <Link
                href="/reservas"
                onClick={() => setMobileMenuOpen(false)}
                className="mt-6 inline-block border border-brand-bronze px-8 py-3.5 text-xs font-bold tracking-widest uppercase bg-brand-bronze text-white hover:bg-brand-brown rounded-xl transition-all shadow-md shadow-brand-bronze/15 cursor-pointer"
              >
                Reservar Ahora
              </Link>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="absolute bottom-10 flex gap-6"
            >
              <a href="https://www.instagram.com/yolystudio.fit" target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-brand-caramel transition-colors font-mono text-xs tracking-wider">@yolystudio.fit</a>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;
