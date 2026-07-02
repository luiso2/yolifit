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
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

const GradientText: React.FC<GradientTextProps> = ({ text, as: Component = 'span', className = '' }) => {
  return (
    <Component className={`relative inline-block font-black tracking-tighter isolate ${className}`}>
      {/* Main Gradient Text */}
      <motion.span
        className="absolute inset-0 z-10 block bg-gradient-to-r from-[#A27043] via-[#B19073] via-[#CF9C69] via-[#B19073] to-[#A27043] bg-[length:200%_auto] bg-clip-text text-transparent will-change-[background-position]"
        animate={{
          backgroundPosition: ['0% center', '200% center'],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "linear",
        }}
        aria-hidden="true"
        style={{
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          transform: 'translateZ(0)',
          backfaceVisibility: 'hidden'
        }}
      >
        {text}
      </motion.span>

      {/* Base layer for solid white fallback */}
      <span
        className="block text-transparent bg-clip-text bg-gradient-to-r from-[#A27043] to-[#B19073]"
        style={{
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent'
        }}
      >
        {text}
      </span>

      {/* Blur Glow Effect - Static to save performance */}
      <span
        className="absolute inset-0 -z-10 block bg-gradient-to-r from-[#EDE5DA] via-[#B19073] via-[#B19073] to-[#EDE5DA] bg-[length:200%_auto] bg-clip-text text-transparent blur-xl md:blur-2xl opacity-20"
        style={{
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          transform: 'translateZ(0)'
        }}
      >
        {text}
      </span>
    </Component>
  );
};

export default GradientText;
