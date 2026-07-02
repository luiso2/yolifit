'use client';

/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/


import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

const StarField = () => {
  // Stars are generated on the client only: Math.random() during SSR causes hydration mismatches
  const [stars, setStars] = useState<
    { id: number; size: number; x: number; y: number; duration: number; delay: number; opacity: number }[]
  >([]);

  useEffect(() => {
    setStars(Array.from({ length: 15 }).map((_, i) => ({
      id: i,
      size: Math.random() * 2 + 1,
      x: Math.random() * 100,
      y: Math.random() * 100,
      duration: Math.random() * 3 + 2,
      delay: Math.random() * 2,
      opacity: Math.random() * 0.5 + 0.2
    })));
  }, []);

  return (
    <div className="absolute inset-0 z-0 pointer-events-none">
      {stars.map((star) => (
        <motion.div
          key={star.id}
          className="absolute rounded-full bg-[#B19073] will-change-[opacity,transform]"
          style={{
            left: `${star.x}%`,
            top: `${star.y}%`,
            width: star.size,
            height: star.size,
            transform: 'translateZ(0)'
          }}
          initial={{ opacity: star.opacity, scale: 1 }}
          animate={{
            opacity: [star.opacity, 0.8, star.opacity],
            scale: [1, 1.3, 1],
          }}
          transition={{
            duration: star.duration * 2.5,
            repeat: Infinity,
            ease: "easeInOut",
            delay: star.delay,
          }}
        />
      ))}
    </div>
  );
};

const FluidBackground: React.FC = () => {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden bg-gradient-to-br from-[#F6F1EA] via-[#EDE5DA] to-[#EDE5DA]">

      <StarField />

      {/* Blob 1: Soft warm peach/rose-gold */}
      <motion.div
        className="absolute top-[-10%] left-[-10%] w-[90vw] h-[90vw] bg-[#E2B493] rounded-full mix-blend-multiply filter blur-[50px] opacity-35 will-change-transform"
        animate={{
          x: [0, 40, -20, 0],
          y: [0, -20, 20, 0],
        }}
        transition={{
          duration: 30,
          repeat: Infinity,
          ease: "linear"
        }}
        style={{ transform: 'translateZ(0)' }}
      />

      {/* Blob 2: Luxurious gold champagne */}
      <motion.div
        className="absolute top-[25%] right-[-20%] w-[100vw] h-[80vw] bg-[#CF9C69] rounded-full mix-blend-multiply filter blur-[50px] opacity-25 will-change-transform"
        animate={{
          x: [0, -40, 20, 0],
          y: [0, 40, -20, 0],
        }}
        transition={{
          duration: 35,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        style={{ transform: 'translateZ(0)' }}
      />

      {/* Blob 3: Soft pearlescent sage/cream */}
      <motion.div
        className="absolute bottom-[-20%] left-[20%] w-[80vw] h-[80vw] bg-[#D4C5B8] rounded-full mix-blend-multiply filter blur-[50px] opacity-30 will-change-transform"
        animate={{
          x: [0, 60, -60, 0],
          y: [0, -40, 40, 0],
        }}
        transition={{
          duration: 40,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        style={{ transform: 'translateZ(0)' }}
      />

      {/* Static Grain Overlay */}
      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.04] mix-blend-overlay pointer-events-none"></div>

      {/* Vignette */}
      <div className="absolute inset-0 pointer-events-none" style={{ background: 'radial-gradient(ellipse at center, transparent 60%, rgba(0,0,0,0.03) 100%)' }} />
    </div>
  );
};

export default FluidBackground;
