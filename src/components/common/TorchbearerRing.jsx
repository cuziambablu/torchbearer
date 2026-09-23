import React from 'react';

/**
 * TorchbearerRing: High-fidelity, ethereal glowing ring motif.
 * Inspired by modern luminous hardware/software identities (Linear, OpenAI, Vercel).
 */
export default function TorchbearerRing({
  size = 'hero', // 'hero' | 'auth' | 'card' | 'badge' | 'mini'
  className = '',
  animated = true,
  withAura = true,
}) {
  const sizeMap = {
    hero: 'w-[420px] h-[420px] sm:w-[560px] sm:h-[560px] md:w-[720px] md:h-[720px]',
    auth: 'w-[320px] h-[320px] sm:w-[420px] sm:h-[420px]',
    card: 'w-[140px] h-[140px]',
    badge: 'w-16 h-16',
    mini: 'w-6 h-6',
  };

  const ringClass = sizeMap[size] || sizeMap.hero;

  return (
    <div className={`relative flex items-center justify-center pointer-events-none select-none ${ringClass} ${className}`}>
      {/* 1. Deep Atmospheric Warm Bloom */}
      {withAura && (
        <>
          <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-[#FF2400]/20 via-[#FF5A00]/25 to-[#FFC400]/15 blur-[90px] transform scale-125 opacity-70 animate-pulse" />
          <div className="absolute inset-10 rounded-full bg-[#FF7300]/10 blur-[60px] opacity-60" />
        </>
      )}

      {/* 2. Precision Luminous Multi-Layer SVG Ring */}
      <svg
        viewBox="0 0 400 400"
        className={`w-full h-full relative z-10 ${animated ? 'animate-ring-rotate' : ''}`}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          {/* Main Spectrum Gradient */}
          <linearGradient id="torchSpectrum" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FF2400" />
            <stop offset="28%" stopColor="#FF4D00" />
            <stop offset="55%" stopColor="#FF7300" />
            <stop offset="80%" stopColor="#FFB300" />
            <stop offset="100%" stopColor="#FFE66D" />
          </linearGradient>

          {/* Soft Glow Layer Filter */}
          <filter id="softGlow" x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur stdDeviation="10" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Ambient Halo Track */}
        <circle
          cx="200"
          cy="200"
          r="150"
          stroke="url(#torchSpectrum)"
          strokeWidth="14"
          strokeOpacity="0.25"
          filter="url(#softGlow)"
        />

        {/* Primary Sharp Glowing Ring */}
        <circle
          cx="200"
          cy="200"
          r="150"
          stroke="url(#torchSpectrum)"
          strokeWidth="8"
          strokeLinecap="round"
          strokeDasharray="800 150"
        />

        {/* Luminous Leading Edge Spark */}
        <circle
          cx="200"
          cy="200"
          r="150"
          stroke="#FFFFFF"
          strokeWidth="3"
          strokeOpacity="0.85"
          strokeLinecap="round"
          strokeDasharray="80 860"
          strokeDashoffset="120"
        />
      </svg>
    </div>
  );
}
