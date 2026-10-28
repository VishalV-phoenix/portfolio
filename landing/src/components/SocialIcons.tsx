import React, { useState } from 'react';
import { PROFILE_CONFIG, SocialLink } from '../config/profile';
import { WaterGlass } from './WaterGlass';

interface SocialIconItemProps {
  social: SocialLink;
  isForest?: boolean;
}

const SocialIconItem: React.FC<SocialIconItemProps> = ({ social, isForest }) => {
  const [hasError, setHasError] = useState(false);

  const handleError = () => {
    setHasError(true);
  };

  const iconContent = !hasError ? (
    <img
      src={social.iconSvg}
      alt={social.name}
      onError={handleError}
      className="w-4.5 h-4.5 sm:w-5 sm:h-5 object-contain opacity-90 group-hover:opacity-100 group-hover:scale-110 transition-all duration-200"
      loading="lazy"
    />
  ) : (
    <span className="text-xs uppercase font-medium tracking-tighter opacity-80">
      {social.name.slice(0, 2)}
    </span>
  );

  // When rendered on the enchanted forest screen, apply the golden WaterGlass treatment
  if (isForest) {
    return (
      <WaterGlass
        as="a"
        href={social.url}
        variant="icon"
        theme="gold"
        elevation="subtle"
        showGlint={true}
        rippleOnHover={true}
        rippleOnClick={true}
        target={social.id === 'email' ? '_self' : '_blank'}
        rel="noopener noreferrer"
        aria-label={social.name}
        title={social.name}
        className="!w-10 !h-10 sm:!w-11 sm:!h-11 group pointer-events-auto"
      >
        {iconContent}
      </WaterGlass>
    );
  }

  // On the default black introduction screen, preserve the original subtle styling
  return (
    <a
      href={social.url}
      target={social.id === 'email' ? '_self' : '_blank'}
      rel="noopener noreferrer"
      aria-label={social.name}
      title={social.name}
      className="group relative flex items-center justify-center w-10 h-10 sm:w-11 sm:h-11 rounded-full transition-all duration-200 pointer-events-auto focus:outline-none focus-visible:ring-2 focus-visible:ring-white/80 active:scale-95 bg-white/5 hover:bg-white/15 text-[#fcfcfb] border border-white/10 hover:border-white/25"
    >
      {iconContent}
    </a>
  );
};

export const SocialIcons: React.FC<{
  isForest?: boolean;
  className?: string;
  style?: React.CSSProperties;
}> = ({
  isForest,
  className = '',
  style,
}) => {
  return (
    <nav
      aria-label="Social and Contact links"
      className={`flex items-center justify-center gap-3 sm:gap-4 pointer-events-auto ${className}`}
      style={style}
    >
      {PROFILE_CONFIG.socials.map((social) => (
        <SocialIconItem key={social.id} social={social} isForest={isForest} />
      ))}
    </nav>
  );
};
