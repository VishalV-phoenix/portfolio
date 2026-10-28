/**
 * ============================================================================
 * ABOUT CARD VISUAL & LAYOUT SETTINGS
 * ============================================================================
 * Centralized, editable layout parameters for the About Me milestone card.
 * Uses the verified 768px (md:) responsive boundary for mobile scrolling fallback
 * and desktop layout framing.
 * ============================================================================
 */

export interface AboutCardSettings {
  /** Maximum card width across mobile and desktop breakpoints */
  maxWidthClass: string;
  /** Internal padding inside the card container */
  paddingClass: string;
  /** Mobile viewport height limit and scroll fallback (preserves 768px md: boundary) */
  mobileMaxHeightClass: string;

  /** Spacing between biography paragraphs */
  paragraphSpacingClass: string;
  /** Base typography styles for biography text */
  paragraphTextClass: string;

  /** Styling applied to gold keyword highlight spans */
  highlightBadgeClass: string;
  /** Badge styling for domain focus tags */
  tagBadgeClass: string;
}

export const ABOUT_CARD_SETTINGS: AboutCardSettings = {
  maxWidthClass: 'max-w-2xl md:max-w-3xl',
  paddingClass: 'p-4 md:p-7',
  mobileMaxHeightClass: 'max-h-[calc(100dvh-5rem)] md:max-h-none',

  paragraphSpacingClass: 'space-y-2.5 md:space-y-3',
  paragraphTextClass: 'text-xs md:text-sm text-neutral-300 leading-relaxed',

  highlightBadgeClass:
    'bg-amber-400 text-neutral-950 font-medium px-1.5 py-0.5 rounded box-decoration-clone',
  tagBadgeClass:
    'px-2 py-0.5 md:px-2.5 md:py-1 text-[10px] md:text-xs rounded-full bg-white/5 text-neutral-300 font-mono border border-white/10',
};
