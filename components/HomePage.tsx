'use client';

import React, { useState, useEffect } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import { Link } from '@/i18n/routing';
import FluidBackground from '@/components/FluidBackground';
import CustomCursor from '@/components/CustomCursor';
import Navbar from '@/components/sections/Navbar';
import Hero from '@/components/sections/Hero';
import Services from '@/components/sections/Services';
import Experience from '@/components/sections/Experience';
import VideoShowcase from '@/components/sections/VideoShowcase';
import InstagramCta from '@/components/sections/InstagramCta';
import Faq from '@/components/sections/Faq';
import Footer from '@/components/sections/Footer';
import ServiceModal from '@/components/ServiceModal';
import { getSpaServices } from '@/lib/services';
import { SpaService } from '@/lib/types';

const HomePage: React.FC = () => {
  const t = useTranslations('bookingCta');
  const locale = useLocale();
  const services = getSpaServices(locale);

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [selectedService, setSelectedService] = useState<SpaService | null>(null);
  const [openFaqIdx, setOpenFaqIdx] = useState<number | null>(null);

  const closeModal = () => setSelectedService(null);

  const navigateService = (direction: 'next' | 'prev') => {
    if (!selectedService) return;
    const currentIndex = services.findIndex((s) => s.id === selectedService.id);
    const nextIndex = direction === 'next' ? (currentIndex + 1) % services.length : (currentIndex - 1 + services.length) % services.length;
    setSelectedService(services[nextIndex]);
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!selectedService) return;
      if (e.key === 'ArrowLeft') navigateService('prev');
      if (e.key === 'ArrowRight') navigateService('next');
      if (e.key === 'Escape') closeModal();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedService, services]);

  return (
    <div className="relative min-h-screen text-brand-ink selection:bg-brand-bronze/30 selection:text-black cursor-auto md:cursor-none overflow-x-hidden">
      <CustomCursor />
      <FluidBackground />
      <Navbar mobileMenuOpen={mobileMenuOpen} setMobileMenuOpen={setMobileMenuOpen} />
      <Hero />
      <Services onSelect={setSelectedService} />
      <Experience />
      <VideoShowcase />
      <InstagramCta />

      <section id="reservas" className="relative z-10 py-16 md:py-20 px-4 md:px-6 bg-brand-ink text-brand-cream overflow-hidden">
        <div className="pointer-events-none absolute inset-0 opacity-40" style={{ background: 'radial-gradient(circle at 50% 0%, rgba(162,112,67,0.35), transparent 60%)' }} aria-hidden />
        <div className="relative z-10 max-w-3xl mx-auto text-center flex flex-col items-center gap-5">
          <span className="text-xs font-mono uppercase tracking-[0.3em] text-brand-caramel">{t('eyebrow')}</span>
          <h2 className="font-heading text-3xl md:text-5xl font-normal leading-tight">{t('title')}</h2>
          <p className="text-brand-sand/80 text-sm md:text-base max-w-xl font-light leading-relaxed">{t('description')}</p>
          <Link href="/reservas" className="mt-2 inline-flex items-center gap-2 px-8 py-4 bg-brand-bronze text-white text-xs font-bold uppercase tracking-widest rounded-full hover:bg-brand-caramel transition-colors" data-hover="true">
            {t('cta')}
          </Link>
        </div>
      </section>

      <Faq openIdx={openFaqIdx} setOpenIdx={setOpenFaqIdx} />
      <Footer />
      <ServiceModal service={selectedService} onClose={closeModal} onNavigate={navigateService} />
    </div>
  );
};

export default HomePage;
