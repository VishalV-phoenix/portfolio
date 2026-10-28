/**
 * ============================================================================
 * SKILLS CARD VISUAL & LAYOUT SETTINGS
 * ============================================================================
 * Centralized, editable layout parameters for the Skills milestone card.
 * Adjust card dimensions, responsive grid columns, container scroll limits,
 * and filter tab styles here.
 * ============================================================================
 */

export interface SkillsCardSettings {
  /** Maximum card width across mobile and desktop breakpoints */
  maxWidthClass: string;
  /** Internal padding inside the card container */
  paddingClass: string;
  /** Maximum height for the scrollable categories list */
  categoriesContainerMaxHeightClass: string;

  /** Grid column configuration for skill badge items */
  skillsGridColsClass: string;
  /** Grid gap between individual skill badge items */
  skillsGridGapClass: string;

  /** Styling applied to the currently active category filter tab */
  activeTabClass: string;
  /** Styling applied to inactive category filter tabs */
  inactiveTabClass: string;

  /** Container styling for individual skill badge cards */
  skillItemClass: string;
}

export const SKILLS_CARD_SETTINGS: SkillsCardSettings = {
  maxWidthClass: 'max-w-3xl sm:max-w-4xl',
  paddingClass: 'p-4 sm:p-6',
  categoriesContainerMaxHeightClass: 'max-h-[52vh] sm:max-h-[58vh]',

  skillsGridColsClass: 'grid-cols-2 sm:grid-cols-3 md:grid-cols-4',
  skillsGridGapClass: 'gap-2',

  activeTabClass: 'bg-amber-400/20 text-amber-300 border-amber-400/50 font-medium',
  inactiveTabClass: 'bg-white/5 text-neutral-400 border-white/10 hover:text-white hover:bg-white/10',

  skillItemClass:
    'flex items-center gap-2.5 px-2.5 py-1.5 sm:py-2 rounded-lg bg-black/40 border border-white/10 hover:border-amber-400/40 hover:bg-white/[0.07] transition-all duration-200 group cursor-default',
};
