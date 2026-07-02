'use client';

import React from 'react';
import { Instagram, Heart } from 'lucide-react';
import GradientText from '@/components/GradientText';

const featuredImage = '/media/skincare_treatment_1782918671588.jpg';

const InstagramCta: React.FC = () => {
  const scrollToSection = (id: string) => {
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
    <section id="instagram" className="relative z-10 py-20 md:py-32 bg-white/30 border-t border-b border-black/[0.04]">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <div className="text-center mb-12 md:mb-16">
          <a
            href="https://www.instagram.com/yolystudio.fit"
            target="_blank"
            rel="noopener noreferrer"
            className="flex justify-center items-center gap-2 text-brand-bronze font-mono tracking-widest uppercase text-xs mb-3 hover:text-brand-caramel transition-colors"
          >
            <Instagram className="w-4 h-4" />
            <span>@yolystudio.fit</span>
          </a>
          <h2 className="text-3xl md:text-5xl font-heading font-normal text-gray-950 uppercase leading-tight max-w-2xl mx-auto">
            El Ritual del <GradientText text="AUTOCUIDADO" className="text-4xl md:text-6xl inline font-normal" />
          </h2>
          <p className="text-gray-600 text-sm mt-3 max-w-lg mx-auto font-light">
            Únete a nuestra comunidad donde compartimos consejos de skincare profesional, mitos de la cosmetología y hábitos de bienestar diario.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          {/* Post quote frame */}
          <div className="lg:col-span-7 flex flex-col justify-between bg-white/70 border border-brand-bronze/10 rounded-3xl p-6 md:p-10 shadow-sm backdrop-blur-md">
            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-brand-bronze to-brand-bronze flex items-center justify-center font-bold text-xs text-white">YS</div>
                <div>
                  <h4 className="font-bold text-sm text-gray-900">yolystudio.fit</h4>
                  <p className="text-xs text-gray-500 font-mono">Miami, Florida</p>
                </div>
              </div>
              <span className="text-xs font-mono bg-brand-bronze/35 px-3 py-1 rounded-full text-brand-bronze font-semibold border border-brand-bronze/10">Publicación Destacada</span>
            </div>

            <div className="flex-1 flex flex-col justify-center">
              <blockquote className="text-lg md:text-xl font-light italic leading-relaxed text-gray-800 border-l-2 border-brand-caramel pl-6 py-2 my-4">
                &quot;Un facial no es un lujo, es una disciplina de salud. Tu piel es el reflejo de tu bienestar interno y del cuidado diario que le otorgas.&quot;
              </blockquote>
              <p className="text-xs md:text-sm text-gray-600 leading-relaxed mt-3 font-light">
                En esta publicación celebramos nuestro ritual de Rejuvenecimiento Premium. El uso de micro-agujas de titanio estimula suavemente las defensas regeneradoras de tu dermis, permitiendo que el ácido hialurónico penetre hasta un 90% más profundo. La textura y suavidad resultante son inigualables.
              </p>
            </div>

            <div className="mt-8 flex flex-wrap gap-4 items-center justify-between border-t border-black/[0.05] pt-6">
              <div className="flex gap-6 text-xs font-mono text-gray-500">
                <span className="flex items-center gap-1.5"><Heart className="w-4 h-4 text-rose-500" /> 1,580 Me gusta</span>
                <span className="flex items-center gap-1.5"><Instagram className="w-4 h-4 text-brand-bronze" /> 92 Comentarios</span>
              </div>
              <button
                onClick={() => scrollToSection('servicios')}
                className="px-6 py-3 border border-brand-bronze/20 hover:bg-brand-bronze hover:text-white transition-all text-xs font-semibold tracking-widest uppercase font-heading rounded-none text-brand-bronze bg-transparent"
                data-hover="true"
              >
                Reservar Tratamiento
              </button>
            </div>
          </div>

          {/* Custom generated 1:1 beautiful image (representing clean skincare and beauty) */}
          <div className="lg:col-span-5 flex items-center justify-center">
            <div className="relative w-full aspect-square max-w-[420px] lg:max-w-none bg-white border border-brand-bronze/10 rounded-3xl p-3 shadow-sm">
              <div className="absolute top-6 right-6 z-15 bg-black/40 border border-white/20 p-2 rounded-full backdrop-blur-sm shadow-md text-white">
                <Instagram className="w-4.5 h-4.5" />
              </div>
              <div className="w-full h-full rounded-2xl overflow-hidden relative group">
                <img
                  src={featuredImage}
                  alt="Facial Skincare Treatment at Yoly Studio"
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-6">
                  <span className="text-[10px] font-mono font-semibold tracking-widest text-white uppercase">Ritual Facial Premium Rejuvenecedor</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default InstagramCta;
