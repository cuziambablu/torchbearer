import React, { useState, useEffect } from 'react';
import {
  resolveOrganizationIdentity,
  getOrganizationInitials,
  getOrganizationAvatarStyle
} from '../../utils/organizationUtils';

export default function OrganizationLogo({
  organization = '',
  logoUrl = null,
  websiteUrl = null,
  size = 'md',
  className = '',
  shape = 'rounded-2xl',
  showInitialOnFail = true,
  alt = null
}) {
  const identity = resolveOrganizationIdentity(organization, websiteUrl, logoUrl);
  
  // All candidates to try in order
  const candidateUrls = Array.from(
    new Set([logoUrl, ...(identity.fallbackLogoUrls || [])].filter(Boolean))
  );

  const [urlIndex, setUrlIndex] = useState(0);
  const [hasFailedAll, setHasFailedAll] = useState(candidateUrls.length === 0);
  const [isLoaded, setIsLoaded] = useState(false);

  // Reset state when organization or logoUrl changes
  useEffect(() => {
    setUrlIndex(0);
    setHasFailedAll(candidateUrls.length === 0);
    setIsLoaded(false);
  }, [organization, logoUrl]);

  const currentSrc = !hasFailedAll && candidateUrls.length > 0 ? candidateUrls[urlIndex] : null;

  const handleImageError = () => {
    if (urlIndex + 1 < candidateUrls.length) {
      setUrlIndex(urlIndex + 1);
    } else {
      setHasFailedAll(true);
    }
  };

  const handleImageLoad = () => {
    setIsLoaded(true);
  };

  // Dimensions mapping
  const sizeClasses = {
    xs: 'w-7 h-7 text-[10px] p-1',
    sm: 'w-9 h-9 text-xs p-1.5',
    md: 'w-11 h-11 text-xs p-2',
    lg: 'w-14 h-14 text-sm p-2.5',
    xl: 'w-16 h-16 sm:w-20 sm:h-20 text-base sm:text-lg p-3'
  };

  const avatarStyle = getOrganizationAvatarStyle(identity.name);
  const initials = identity.initials || getOrganizationInitials(organization);

  return (
    <div
      className={`relative flex-shrink-0 flex items-center justify-center overflow-hidden bg-white border border-slate-200/90 shadow-xs transition-transform duration-200 ${shape} ${sizeClasses[size] || sizeClasses.md} ${className}`}
      title={identity.name || organization}
    >
      {currentSrc && !hasFailedAll ? (
        <img
          src={currentSrc}
          alt={alt || `${identity.name} logo`}
          onError={handleImageError}
          onLoad={handleImageLoad}
          loading="lazy"
          className={`w-full h-full object-contain transition-opacity duration-200 ${
            isLoaded ? 'opacity-100' : 'opacity-0'
          }`}
        />
      ) : null}

      {/* Fallback Initials Avatar (shown when images are loading or failed) */}
      {(hasFailedAll || !isLoaded) && showInitialOnFail && (
        <div
          className={`absolute inset-0 flex items-center justify-center font-black tracking-tight bg-gradient-to-tr ${avatarStyle.bg} ${avatarStyle.text} select-none`}
        >
          <span>{initials}</span>
        </div>
      )}
    </div>
  );
}
