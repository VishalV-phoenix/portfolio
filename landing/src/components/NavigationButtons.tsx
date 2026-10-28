import React from 'react';
import { PROFILE_CONFIG } from '../config/profile';
import { LANDING_SETTINGS, getPositionStyle } from '../config/landingSettings';
import { SectionId } from './SectionModal';
import { WaterGlass } from './WaterGlass';

interface NavigationButtonsProps {
  onSelectSection: (section: SectionId) => void;
  onHomeClick: () => void;
  onNavigateMilestone?: (milestoneId: 'projects' | 'skills' | 'about' | 'contact') => void;
  isRevealed?: boolean;
  isMobile?: boolean;
  style?: React.CSSProperties;
}

export const NavigationButtons: React.FC<NavigationButtonsProps> = ({
  onSelectSection,
  onHomeClick,
  onNavigateMilestone,
  isRevealed = false,
  isMobile = false,
  style,
}) => {
  const offset = isRevealed
    ? LANDING_SETTINGS.forestReveal.navigationButtons
    : LANDING_SETTINGS.defaultIntro.navigationButtons;

  const positionStyle = getPositionStyle(offset, isMobile);

  return (
    <div
      className="fixed top-3 md:top-7 left-0 right-0 z-40 px-2 md:px-4 select-none max-w-4xl mx-auto overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      role="navigation"
      aria-label="Main Navigation"
      style={{
        ...positionStyle,
        ...style,
      }}
    >
      <div className="flex items-center justify-center gap-1.5 md:gap-3.5 min-w-full w-max mx-auto">
        {PROFILE_CONFIG.navItems.map((item) => {
          const handleClick = () => {
            if (item.id === 'home') {
              onHomeClick();
            } else if (
              onNavigateMilestone &&
              (item.id === 'projects' || item.id === 'skills' || item.id === 'about' || item.id === 'contact')
            ) {
              onNavigateMilestone(item.id);
            } else {
              onSelectSection(item.id as SectionId);
            }
          };

          // On forest-reveal screen, render the golden WaterGlass pill
          if (isRevealed) {
            return (
              <WaterGlass
                key={item.id}
                as="button"
                variant="nav"
                theme="gold"
                elevation="subtle"
                showGlint={true}
                rippleOnHover={true}
                rippleOnClick={true}
                onClick={handleClick}
                className="!min-h-0 !py-1 md:!py-2 !px-2.5 md:!px-5 text-[11px] md:text-sm font-medium text-[#fcfcfb] !cursor-pointer !rounded-full transition-all duration-200 active:scale-95 shrink-0"
              >
                {item.label}
              </WaterGlass>
            );
          }

          // On default black introduction screen, restore the original white navigation pills
          return (
            <button
              key={item.id}
              onClick={handleClick}
              className="px-2.5 md:px-5 py-1 md:py-2 text-[11px] md:text-sm font-medium text-black bg-[#fcfcfb] hover:bg-white hover:shadow-lg active:scale-95 rounded-full transition-all duration-200 shadow-sm border border-black/5 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/80 cursor-pointer shrink-0"
            >
              {item.label}
            </button>
          );
        })}
      </div>
    </div>
  );
};
