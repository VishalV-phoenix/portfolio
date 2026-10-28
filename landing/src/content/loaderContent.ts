/**
 * ============================================================================
 * PHOENIX LOADER USER-FACING COPY & ACCESSIBILITY TEXT
 * ============================================================================
 * Centralized content for Phoenix loader affordance instructions and aria labels.
 * ============================================================================
 */

export interface LoaderContent {
  scrollUpAffordanceText: string;
  scrollUpArrowSymbol: string;
  stageAriaLabel: string;
  coinAriaLabel: string;
  logoAltText: string;
}

export const LOADER_CONTENT: LoaderContent = {
  scrollUpAffordanceText: 'SCROLL UP TO EXPLORE',
  scrollUpArrowSymbol: '↑',
  stageAriaLabel: 'Phoenix V Loader',
  coinAriaLabel: 'Spinning Phoenix V Coin',
  logoAltText: 'Phoenix V Logo',
};
