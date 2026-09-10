import React from 'react';
import { Link } from 'react-router-dom';

export default function BrandLogo({
  size = 'md',
  showText = true,
  className = '',
  variant = 'default', // 'default' | 'dark' | 'light'
  href = '/'
}) {
  const sizeClasses = {
    sm: { icon: 'w-6 h-6', text: 'text-base', sub: 'text-[9px]' },
    md: { icon: 'w-8 h-8', text: 'text-lg', sub: 'text-[10px]' },
    lg: { icon: 'w-10 h-10', text: 'text-2xl', sub: 'text-xs' },
    xl: { icon: 'w-14 h-14', text: 'text-3xl', sub: 'text-sm' }
  }[size] || { icon: 'w-8 h-8', text: 'text-lg', sub: 'text-[10px]' };

  const textColors = {
    default: 'text-slate-900',
    dark: 'text-white',
    light: 'text-slate-900'
  }[variant] || 'text-slate-900';

  const logoContent = (
    <div className={`inline-flex items-center gap-2.5 select-none ${className}`}>
      {/* Modern Minimal SVG Torch & AI Flame Icon */}
      <div className={`relative flex items-center justify-center flex-shrink-0 ${sizeClasses.icon}`}>
        <svg
          viewBox="0 0 32 32"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full filter drop-shadow-[0_2px_8px_rgba(245,158,11,0.35)] transition-transform duration-300 group-hover:scale-105"
        >
          {/* Torch Handle Base */}
          <path
            d="M13.5 21H18.5L17.5 29C17.5 29.5 17 30 16 30C15 30 14.5 29.5 14.5 29L13.5 21Z"
            fill="url(#torchHandle)"
          />
          {/* Torch Bowl Rim */}
          <path
            d="M11 20C11 19.4477 11.4477 19 12 19H20C20.5523 19 21 19.4477 21 20V21.5H11V20Z"
            fill="#d97706"
          />
          {/* Outer Flame (Warm Golden Amber) */}
          <path
            d="M16 2C16 2 22 7.5 22 14.5C22 18.0899 19.3137 21 16 21C12.6863 21 10 18.0899 10 14.5C10 7.5 16 2 16 2Z"
            fill="url(#outerFlame)"
          />
          {/* Inner Core Flame (Luminous Light / AI Spark) */}
          <path
            d="M16 8C16 8 19 12 19 15C19 16.6569 17.6569 18 16 18C14.3431 18 13 16.6569 13 15C13 12 16 8 16 8Z"
            fill="url(#innerFlame)"
          />
          {/* Digital Spark Node */}
          <circle cx="16" cy="14" r="1.5" fill="#ffffff" className="animate-pulse" />

          {/* Gradients */}
          <defs>
            <linearGradient id="outerFlame" x1="16" y1="2" x2="16" y2="21" gradientUnits="userSpaceOnUse">
              <stop stopColor="#fbbf24" />
              <stop offset="0.45" stopColor="#f59e0b" />
              <stop offset="1" stopColor="#ea580c" />
            </linearGradient>
            <linearGradient id="innerFlame" x1="16" y1="8" x2="16" y2="18" gradientUnits="userSpaceOnUse">
              <stop stopColor="#ffffff" />
              <stop offset="0.7" stopColor="#fef08a" />
              <stop offset="1" stopColor="#fde047" />
            </linearGradient>
            <linearGradient id="torchHandle" x1="16" y1="21" x2="16" y2="30" gradientUnits="userSpaceOnUse">
              <stop stopColor="#78350f" />
              <stop offset="1" stopColor="#451a03" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      {showText && (
        <div className="flex flex-col text-left">
          <div className="flex items-center gap-1.5">
            <span className={`font-black tracking-tight ${sizeClasses.text} ${textColors} leading-none`}>
              TORCHBEARER
            </span>
            <span className="px-1.5 py-0.5 rounded-md text-[10px] font-black uppercase tracking-wider bg-gradient-to-r from-amber-500 to-orange-500 text-white leading-none shadow-xs">
              AI
            </span>
          </div>
          <span className={`font-bold tracking-wider uppercase text-amber-600 dark:text-amber-400 ${sizeClasses.sub} mt-0.5`}>
            Light the way
          </span>
        </div>
      )}
    </div>
  );

  if (href) {
    return (
      <Link to={href} className="group inline-block focus:outline-none">
        {logoContent}
      </Link>
    );
  }

  return logoContent;
}
