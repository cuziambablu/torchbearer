import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import logoImg from '../../assets/logo.png';

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
    md: { icon: 'w-8 h-8', text: 'text-lg', sub: 'text-[10px]' },
    lg: { icon: 'w-10 h-10', text: 'text-2xl', sub: 'text-xs' },
    xl: { icon: 'w-14 h-14', text: 'text-3xl', sub: 'text-sm' }
  }[size] || { icon: 'w-8 h-8', text: 'text-lg', sub: 'text-[10px]' };

  const textColor = isDarkMode ? 'text-white' : 'text-slate-900';

  const logoContent = (
    <div className={`inline-flex items-center gap-2.5 select-none bg-transparent group ${className}`}>
      {/* Signature Glowing Ring Logo */}
      <div className={`relative flex items-center justify-center flex-shrink-0 bg-transparent ${sizeClasses.icon} transition-transform duration-300 group-hover:scale-105`}>
        {!imgError ? (
          <img
            src={logoImg}
            alt="Torchbearer AI"
            onError={() => setImgError(true)}
            className="w-full h-full object-contain bg-transparent border-0 outline-none select-none filter drop-shadow-[0_2px_10px_rgba(255,77,0,0.35)]"
          />
        ) : (
          <svg
            viewBox="0 0 100 100"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="w-full h-full drop-shadow-[0_2px_12px_rgba(255,77,0,0.45)]"
          >
            <defs>
              <linearGradient id="brandRingGrad" x1="10%" y1="10%" x2="90%" y2="90%">
                <stop offset="0%" stopColor="#FF2400" />
                <stop offset="30%" stopColor="#FF4D00" />
                <stop offset="65%" stopColor="#FF7300" />
                <stop offset="85%" stopColor="#FFC400" />
                <stop offset="100%" stopColor="#FFE66D" />
              </linearGradient>
            </defs>
            <circle cx="50" cy="50" r="36" stroke="url(#brandRingGrad)" strokeWidth="12" strokeLinecap="round" />
            <circle cx="50" cy="50" r="36" stroke="#FFFFFF" strokeWidth="2.5" strokeOpacity="0.8" strokeDasharray="40 160" strokeDashoffset="15" />
          </svg>
        )}
      </div>

      {showText && (
        <div className="flex flex-col text-left">
          <div className="flex items-center gap-1.5 leading-none">
            <span className={`font-black tracking-tight ${sizeClasses.text} ${textColor}`}>
              TORCHBEARER
            </span>
            <span className="px-1.5 py-0.5 text-[9px] font-extrabold uppercase bg-gradient-to-r from-[#FF2400] via-[#FF7300] to-[#FFC400] text-white rounded-md tracking-wider shadow-xs">
              AI
            </span>
          </div>
          {subtitle && (
            <span className={`font-semibold tracking-wider uppercase text-torch-500 mt-0.5 ${sizeClasses.sub}`}>
              {subtitle}
            </span>
          )}
        </div>
      )}
    </div>
  );

  if (!href) return logoContent;

  return (
    <Link to={href} className="inline-flex items-center focus:outline-none focus-visible:ring-2 focus-visible:ring-torch-500 rounded-lg">
      {logoContent}
    </Link>
  );
}
