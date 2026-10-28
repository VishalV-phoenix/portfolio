import type { WaterGlassTheme, WaterGlassElevation, WaterGlassVariant } from '../../components/WaterGlass';

/**
 * ============================================================================
 * CONTACT CARD VISUAL & LAYOUT SETTINGS
 * ============================================================================
 * Centralized, editable layout parameters for the Contact milestone card.
 * Adjust card width, button spacing, and WaterGlass button presentation here.
 * ============================================================================
 */

export interface ContactCardSettings {
  /** Maximum card width across mobile and desktop breakpoints */
  maxWidthClass: string;
  /** Internal padding inside the card container */
  paddingClass: string;
  /** Spacing between contact action buttons */
  buttonGroupGapClass: string;
  /** Styling and dimension overrides for action buttons */
  buttonClassName: string;

  /** WaterGlass optical theme for contact buttons */
  waterGlassTheme: WaterGlassTheme;
  /** WaterGlass elevation level */
  waterGlassElevation: WaterGlassElevation;
  /** WaterGlass component variant */
  waterGlassVariant: WaterGlassVariant;
  /** Enable corner glint on contact buttons */
  showGlint: boolean;
  /** Enable fluid ripples */
  enableRipples: boolean;
}

export const CONTACT_CARD_SETTINGS: ContactCardSettings = {
  maxWidthClass: 'max-w-2xl sm:max-w-3xl',
  paddingClass: 'p-5 sm:p-7',
  buttonGroupGapClass: 'gap-3 sm:gap-4',
  buttonClassName:
    '!min-h-0 !py-2 sm:!py-2.5 !px-5 sm:!px-6 text-xs sm:text-sm font-medium text-[#fcfcfb] !rounded-full transition-all duration-200 active:scale-95 group pointer-events-auto cursor-pointer',

  waterGlassTheme: 'gold',
  waterGlassElevation: 'subtle',
  waterGlassVariant: 'nav',
  showGlint: true,
  enableRipples: true,
};
