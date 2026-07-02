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
  variant?: 'default' | 'hero' | 'hero-sub';
}

const VARIANT_STYLES = {
  default: 'font-sans font-bold not-italic tracking-[0.12em] uppercase',
  hero: 'font-sans font-bold not-italic tracking-[0.06em] uppercase leading-[0.9]',
  'hero-sub': 'font-sans font-light not-italic tracking-[0.55em] uppercase leading-none',
} as const;

const GRADIENT_STYLES = {
  default:
    'bg-gradient-to-r from-brand-brown via-brand-bronze via-brand-caramel via-brand-bronze to-brand-brown',
  hero:
    'bg-gradient-to-r from-brand-brown via-brand-bronze via-brand-caramel via-brand-bronze to-brand-brown',
  'hero-sub':
    'bg-gradient-to-r from-brand-bronze via-brand-caramel via-brand-bronze to-brand-caramel',
} as const;

const GradientText: React.FC<GradientTextProps> = ({
  text,
  as: Component = 'span',
  className = '',
  variant = 'default',
}) => {
  const isHero = variant === 'hero' || variant === 'hero-sub';
  const gradientClass = GRADIENT_STYLES[variant];
  const variantClass = VARIANT_STYLES[variant];

  return (
    <Component className={`relative inline-block isolate ${variantClass} ${className}`}>
      <span
        aria-hidden
        className={`absolute inset-0 -z-20 block ${gradientClass} bg-[length:220%_auto] bg-clip-text text-transparent blur-xl scale-105 ${isHero ? 'opacity-20' : 'opacity-25'}`}
        style={{
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
        }}
      >
        {text}
      </span>

      <span
        className={`block text-transparent ${gradientClass} bg-[length:220%_auto] bg-clip-text opacity-100`}
        style={{
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
        }}
      >
        {text}
      </span>

      <motion.span
        className={`absolute inset-0 z-10 block ${gradientClass} bg-[length:220%_auto] bg-clip-text text-transparent will-change-[background-position]`}
        animate={{
          backgroundPosition: ['0% center', '220% center'],
        }}
        transition={{
          duration: isHero ? 16 : 12,
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
    </Component>
  );
};

export default GradientText;
