'use client';

import React, { useState, useEffect } from 'react';
import FluidBackground from '@/components/FluidBackground';
import CustomCursor from '@/components/CustomCursor';
import Navbar from '@/components/sections/Navbar';
import Hero from '@/components/sections/Hero';
import Services from '@/components/sections/Services';
import Experience from '@/components/sections/Experience';
import VideoShowcase from '@/components/sections/VideoShowcase';
import InstagramCta from '@/components/sections/InstagramCta';
import Reservas from '@/components/sections/Reservas';
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

      <Reservas />

      <Faq openIdx={openFaqIdx} setOpenIdx={setOpenFaqIdx} />

      <Footer />

      {/* Render Yoly AI chatbot directly for interactive aesthetics & notary advice */}
      <AIChat />

      <ServiceModal service={selectedService} onClose={closeModal} onNavigate={navigateService} />
    </div>
  );
};

export default HomePage;
