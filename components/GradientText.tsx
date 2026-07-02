'use client';

/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import React from 'react';
import { motion } from 'framer-motion';

interface GradientTextProps {
  text: string;
  as?: 'h1' | 'h2' | 'h3' | 'p' | 'span';
  className?: string;
  variant?: 'default' | 'hero';
}

const VARIANT_STYLES = {
  default: 'font-heading italic tracking-[0.1em]',
  hero: 'font-display font-light italic tracking-[0.16em] uppercase leading-[0.92]',
} as const;

const GRADIENT_STYLES = {
  default:
    'bg-gradient-to-r from-[#8B6914] via-[#C9A227] via-[#F0E0B8] via-[#C9A227] to-[#8B6914]',
  hero:
    'bg-gradient-to-r from-[#7A5A12] via-[#A67C00] via-[#D4AF37] via-[#F7E7B0] via-[#FFE9A8] via-[#D4AF37] via-[#B8860B] via-[#9A7B1F] to-[#7A5A12]',
} as const;

const GradientText: React.FC<GradientTextProps> = ({
  text,
  as: Component = 'span',
  className = '',
  variant = 'default',
}) => {
  const isHero = variant === 'hero';
  const gradientClass = GRADIENT_STYLES[variant];
  const variantClass = VARIANT_STYLES[variant];

  return (
    <Component
      className={`relative inline-block isolate ${variantClass} ${className}`}
      style={isHero ? { fontFeatureSettings: '"liga" 1, "kern" 1, "salt" 1' } : undefined}
    >
      {/* Soft gold aura */}
      <span
        aria-hidden
        className={`absolute inset-0 -z-20 block ${gradientClass} bg-[length:240%_auto] bg-clip-text text-transparent blur-2xl scale-105 ${isHero ? 'opacity-50' : 'opacity-30'}`}
        style={{
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
        }}
      >
        {text}
      </span>

      {/* Base metallic layer */}
      <span
        className={`block text-transparent ${gradientClass} bg-[length:240%_auto] bg-clip-text ${isHero ? 'opacity-100 saturate-125' : 'opacity-90'}`}
        style={{
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
        }}
      >
        {text}
      </span>

      {/* Animated shimmer */}
      <motion.span
        className={`absolute inset-0 z-10 block ${gradientClass} bg-[length:240%_auto] bg-clip-text text-transparent will-change-[background-position] ${isHero ? 'saturate-150 brightness-105' : ''}`}
        animate={{
          backgroundPosition: ['0% center', '240% center'],
        }}
        transition={{
          duration: isHero ? 14 : 10,
          repeat: Infinity,
          ease: 'linear',
        }}
        aria-hidden="true"
        style={{
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          transform: 'translateZ(0)',
          backfaceVisibility: 'hidden',
        }}
      >
        {text}
      </motion.span>

      {/* Fine highlight edge for hero */}
      {isHero && (
        <span
          aria-hidden
          className="absolute inset-0 z-20 block text-transparent pointer-events-none"
          style={{
            WebkitTextStroke: '0.4px rgba(255, 228, 150, 0.55)',
          }}
        >
          {text}
        </span>
      )}
    </Component>
  );
};

export default GradientText;
