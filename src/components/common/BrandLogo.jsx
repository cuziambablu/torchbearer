import React, { useState } from 'react';
import { Link } from 'react-router-dom';

export default function BrandLogo({
  size = 'md',
  showText = true,
  className = '',
  variant = 'default', // 'default' | 'dark' | 'light'
  isDark = false,
  subtitle,
  href = '/'
}) {
  const [imgError, setImgError] = useState(false);

  const isDarkMode = isDark || variant === 'dark';

  const sizeClasses = {
    sm: { icon: 'w-7 h-7', text: 'text-base', sub: 'text-[9px]' },
    md: { icon: 'w-9 h-9', text: 'text-lg', sub: 'text-[10px]' },
    lg: { icon: 'w-11 h-11', text: 'text-2xl', sub: 'text-xs' },
    xl: { icon: 'w-14 h-14', text: 'text-3xl', sub: 'text-sm' }
  }[size] || { icon: 'w-9 h-9', text: 'text-lg', sub: 'text-[10px]' };

  const textColor = isDarkMode ? 'text-white' : 'text-slate-900';
  const subColor = isDarkMode ? 'text-amber-400' : 'text-amber-600';

  const logoContent = (
    <div className={`inline-flex items-center gap-3 select-none ${className}`}>
      {/* Glowing Circular Ring Logo Emblem */}
      <div className={`relative flex items-center justify-center flex-shrink-0 rounded-full ${sizeClasses.icon} transition-transform duration-300 group-hover:scale-105`}>
        {!imgError ? (
          <img
            src="/logo.png"
            alt="Torchbearer AI"
            onError={() => setImgError(true)}
            className="w-full h-full object-contain filter drop-shadow-[0_2px_8px_rgba(249,115,22,0.35)]"
          />
        ) : (
          <svg
            viewBox="0 0 100 100"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="w-full h-full drop-shadow-[0_2px_10px_rgba(249,115,22,0.45)]"
          >
            <circle cx="50" cy="50" r="38" stroke="url(#ringGrad)" strokeWidth="12" strokeLinecap="round" />
            <defs>
              <linearGradient id="ringGrad" x1="15" y1="15" x2="85" y2="85" gradientUnits="userSpaceOnUse">
                <stop stopColor="#dc2626" />
                <stop offset="0.35" stopColor="#ea580c" />
                <stop offset="0.7" stopColor="#f59e0b" />
                <stop offset="1" stopColor="#fef08a" />
              </linearGradient>
            </defs>
          </svg>
        )}
      </div>

      {showText && (
        <div className="flex flex-col text-left">
          <div className="flex items-center gap-1.5">
            <span className={`font-black tracking-tight ${sizeClasses.text} ${textColor} leading-none`}>
              TORCHBEARER
            </span>
            <span className="px-1.5 py-0.5 rounded-md text-[10px] font-black uppercase tracking-wider bg-gradient-to-r from-amber-500 via-orange-500 to-red-500 text-white leading-none shadow-xs">
              AI
            </span>
          </div>
          <span className={`font-bold tracking-wider uppercase ${subColor} ${sizeClasses.sub} mt-0.5`}>
            {subtitle || 'Light the way'}
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
