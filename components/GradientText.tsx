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
  default: 'font-heading font-normal tracking-[0.1em]',
  hero: 'font-display font-light tracking-[0.28em] uppercase leading-[0.92]',
} as const;

const GRADIENT_STYLES = {
  default:
    'bg-gradient-to-r from-[#8B5E2F] via-[#B19073] via-[#E8D4B8] via-[#B19073] to-[#8B5E2F]',
  hero:
    'bg-gradient-to-r from-[#6B4A22] via-[#A27043] via-[#D4B87A] via-[#F5ECD8] via-[#C9A84C] via-[#A27043] to-[#6B4A22]',
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
        className={`absolute inset-0 -z-20 block ${gradientClass} bg-[length:220%_auto] bg-clip-text text-transparent blur-2xl opacity-30 scale-105`}
        style={{
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
        }}
      >
        {text}
      </span>

      {/* Base metallic layer */}
      <span
        className={`block text-transparent ${gradientClass} bg-[length:220%_auto] bg-clip-text opacity-90`}
        style={{
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
        }}
      >
        {text}
      </span>

      {/* Animated shimmer */}
      <motion.span
        className={`absolute inset-0 z-10 block ${gradientClass} bg-[length:220%_auto] bg-clip-text text-transparent will-change-[background-position]`}
        animate={{
          backgroundPosition: ['0% center', '220% center'],
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
            WebkitTextStroke: '0.35px rgba(255, 248, 235, 0.35)',
          }}
        >
          {text}
        </span>
      )}
    </Component>
  );
};

export default GradientText;
