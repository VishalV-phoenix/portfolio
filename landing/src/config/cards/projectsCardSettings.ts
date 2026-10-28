/**
 * ============================================================================
 * PROJECTS CARD VISUAL & LAYOUT SETTINGS
 * ============================================================================
 * Centralized, editable layout parameters for the Projects milestone card.
 * Adjust card width, padding, thumbnail dimensions, and grid layouts here.
 * ============================================================================
 */

export interface ProjectsCardSettings {
  /** Maximum card width across mobile and desktop breakpoints */
  maxWidthClass: string;
  /** Internal padding inside the card container */
  paddingClass: string;
  /** Maximum height constraint on mobile screens to ensure reachability */
  mobileMaxHeightClass: string;

  /** Grid column configuration for the 2-project gallery view */
  galleryGridColsClass: string;
  /** Spacing gap between project cards in the gallery view */
  galleryGridGapClass: string;
  /** Inner padding for individual project preview cards */
  projectCardPaddingClass: string;
  /** Border radius for individual project preview cards */
  projectCardRadiusClass: string;

  /** Thumbnail container height for collapsed gallery view */
  collapsedThumbnailHeightClass: string;
  /** Image preview height for expanded project view */
  expandedImageHeightClass: string;
  /** Maximum height for the expanded project details scrollable container */
  expandedScrollContainerMaxHeightClass: string;

  /** Badge styling for technology tags in collapsed view */
  tagBadgeClass: string;
  /** Badge styling for technology tags in expanded view */
  expandedTagBadgeClass: string;
}

export const PROJECTS_CARD_SETTINGS: ProjectsCardSettings = {
  maxWidthClass: 'max-w-3xl sm:max-w-4xl',
  paddingClass: 'p-3 sm:p-6',
  mobileMaxHeightClass: 'max-h-[calc(100dvh-5rem)] sm:max-h-none',

  galleryGridColsClass: 'grid-cols-1 md:grid-cols-2',
  galleryGridGapClass: 'gap-2.5 sm:gap-4',
  projectCardPaddingClass: 'p-3 sm:p-4',
  projectCardRadiusClass: 'rounded-xl',

  collapsedThumbnailHeightClass: 'h-20 sm:h-28 md:h-32',
  expandedImageHeightClass: 'h-44 sm:h-56',
  expandedScrollContainerMaxHeightClass: 'max-h-[72vh] sm:max-h-[76vh]',

  tagBadgeClass: 'px-2 py-0.5 text-[10px] sm:text-[11px] rounded-full bg-white/10 text-neutral-300 font-mono border border-white/10',
  expandedTagBadgeClass: 'px-2.5 py-0.5 text-xs rounded-full bg-white/10 text-neutral-200 font-mono border border-white/10',
};
