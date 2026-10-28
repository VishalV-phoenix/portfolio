/**
 * ============================================================================
 * PHOENIX LOADER (LOADER2) TYPE DEFINITIONS
 * ============================================================================
 * Strongly typed interface mirroring the runtime schema of public/loader/settings.js.
 * Provides autocomplete and validation while preserving compatibility with
 * the existing vanilla JavaScript implementation.
 * ============================================================================
 */

export interface Loader2LayoutSettings {
  verticalPositionPercent: number;
  minBottomPaddingPx: number;
  minTopPaddingPx: number;
  logoWidthDesktop: number;
  logoWidthMobile: number;
  logoToLineSpacing: number;
  lineWidthDesktop: number;
  lineWidthMobile: number;
  lineHeight: number;
}

export interface Loader2CoinSettings {
  rotationPeriod: number;
  rotationDirection: 'normal' | 'reverse';
  perspective: number;
  rimThickness: number;
  rimColor: string;
  backsideBrightness: number;
}

export interface Loader2ShineSettings {
  enabled: boolean;
  sweepDuration: number;
  sweepInterval: number;
  intensity: number;
  beamWidthPercent: number;
  beamAngle: number;
  highlightColor: string;
  warmGoldColor: string;
}

export interface Loader2LineSettings {
  mode: 'timed' | 'indeterminate';
  progressDuration: number;
  trackColor: string;
  progressColorStart: string;
  progressColorEnd: string;
  glowIntensity: number;
  showLeadingFlare: boolean;
}

export interface Loader2ParticleColor {
  r: number;
  g: number;
  b: number;
}

export interface Loader2ParticleSettings {
  enabled: boolean;
  initialFloatingCount: number;
  initialFallingCount: number;
  countDesktop: number;
  countMobile: number;
  rampDuration: number;
  spawnIntervalInitial: number;
  spawnIntervalMin: number;
  spawnFromTop: boolean;
  fallSpeed: number;
  swayAmount: number;
  speed: number;
  baseLifespan: number;
  fadeBySizeAndBrightness: boolean;
  sizeMin: number;
  sizeMax: number;
  largeEmberChance: number;
  largeEmberSizeMin: number;
  largeEmberSizeMax: number;
  alphaMin: number;
  alphaMax: number;
  haloGlowScale: number;
  haloGlowAlpha: number;
  colors: Loader2ParticleColor[];
  breezeRadius: number;
  breezeStrength: number;
  enableCursorInteraction: boolean;
  velocityDamping: number;
  pauseWhenHidden: boolean;
  maxDpr: number;
  [key: string]: unknown;
}

export interface Loader2TopGlowSettings {
  enabled: boolean;
  opacity: number;
  height: string | number;
  spreadWidthPercent: number;
  coreBrightness: number;
  glowColor: string;
  ambientColor: string;
  pulseDuration: number;
}

export interface Loader2TransitionSettings {
  autoCompleteOn100: boolean;
  holdDuration: number;
  fadeOutDuration: number;
}

export interface Loader2Settings {
  layout: Loader2LayoutSettings;
  coin: Loader2CoinSettings;
  shine: Loader2ShineSettings;
  line: Loader2LineSettings;
  particles: Loader2ParticleSettings;
  topGlow: Loader2TopGlowSettings;
  transition: Loader2TransitionSettings;
  applyToCSS?: () => void;
  [key: string]: unknown;
}

export interface Loader2CoinAPI {
  setProgress: (fraction: number) => void;
  start: () => void;
  complete: () => void;
  reset: () => void;
  getProgress: () => number;
}

export interface Loader2ParticlesAPI {
  init: () => void;
  destroy: () => void;
  reset: () => void;
  setProgress: (fraction: number) => void;
  getInstance: () => unknown;
}

export interface PhoenixLoader2API {
  setProgress: (fraction: number) => void;
  complete: () => void;
  reset: () => void;
  getProgress: () => number;
  getParticleInstance: () => unknown;
  getCursorInstance: () => unknown;
}

declare global {
  interface Window {
    LOADER2_SETTINGS?: Loader2Settings;
    Loader2Coin?: Loader2CoinAPI;
    Loader2Particles?: Loader2ParticlesAPI;
    PhoenixLoader2?: PhoenixLoader2API;
  }
}
