'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
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
import AIChat from '@/components/AIChat';
import ServiceModal from '@/components/ServiceModal';
import { SPA_SERVICES } from '@/lib/services';
import { SpaService } from '@/lib/types';

const HomePage: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [selectedService, setSelectedService] = useState<SpaService | null>(null);
  const [openFaqIdx, setOpenFaqIdx] = useState<number | null>(null);

  const closeModal = () => {
    setSelectedService(null);
  };

  const navigateService = (direction: 'next' | 'prev') => {
    if (!selectedService) return;
    const currentIndex = SPA_SERVICES.findIndex((s) => s.id === selectedService.id);
    let nextIndex;
    if (direction === 'next') {
      nextIndex = (currentIndex + 1) % SPA_SERVICES.length;
    } else {
      nextIndex = (currentIndex - 1 + SPA_SERVICES.length) % SPA_SERVICES.length;
    }
    setSelectedService(SPA_SERVICES[nextIndex]);
  };

  // Handle keyboard navigation for modal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!selectedService) return;
      if (e.key === 'ArrowLeft') navigateService('prev');
      if (e.key === 'ArrowRight') navigateService('next');
      if (e.key === 'Escape') closeModal();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedService]);

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

      {/* Compact reservas CTA: el wizard completo vive en /reservas para que sea estático, sin scroll */}
      <section
        id="reservas"
        className="relative z-10 py-16 md:py-20 px-4 md:px-6 bg-brand-ink text-brand-cream overflow-hidden"
      >
        <div
          className="pointer-events-none absolute inset-0 opacity-40"
          style={{ background: 'radial-gradient(circle at 50% 0%, rgba(162,112,67,0.35), transparent 60%)' }}
          aria-hidden
        />
        <div className="relative z-10 max-w-3xl mx-auto text-center flex flex-col items-center gap-5">
          <span className="text-xs font-mono uppercase tracking-[0.3em] text-brand-caramel">Reservas en línea</span>
          <h2 className="font-heading text-3xl md:text-5xl font-normal leading-tight">Reserva tu experiencia</h2>
          <p className="text-brand-sand/80 text-sm md:text-base max-w-xl font-light leading-relaxed">
            Elige tu tratamiento, fecha y hora en un proceso simple y directo, sin vueltas ni scrolls interminables.
          </p>
          <Link
            href="/reservas"
            className="mt-2 inline-flex items-center gap-2 px-8 py-4 bg-brand-bronze text-white text-xs font-bold uppercase tracking-widest rounded-full hover:bg-brand-caramel transition-colors"
            data-hover="true"
          >
            Reservar ahora
          </Link>
        </div>
      </section>

      <Faq openIdx={openFaqIdx} setOpenIdx={setOpenFaqIdx} />

      <Footer />

      {/* Render Yoly AI chatbot directly for interactive aesthetics & notary advice */}
      <AIChat />

      <ServiceModal service={selectedService} onClose={closeModal} onNavigate={navigateService} />
    </div>
  );
};

export default HomePage;
