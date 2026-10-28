/**
 * ============================================================================
 * EFFECTS & INTERACTION VISUAL SETTINGS
 * ============================================================================
 * Centralized, editable settings for cursor particle sparkles, desktop scroll
 * progress indicator, and loader affordance parameters.
 * ============================================================================
 */

export interface CursorSparklesConfig {
  /** Minimum cursor distance moved in pixels before emitting new trail particles */
  minDistanceToEmitPx: number;
  /** Maximum particles emitted per frame during fast cursor movement */
  maxParticlesPerBurst: number;
  /** Velocity damping factor per frame (0.90 to 0.99) */
  velocityDamping: number;
  /** Gentle downward gravity drift added each frame */
  downwardDrift: number;
  /** Probability (0.0 to 1.0) of spawning a 4-point star particle instead of a circle */
  starParticleProbability: number;
  /** Base lifetime in frames before particle completely fades out */
  baseLifetimeFrames: number;
  /** Radius multiplier for the persistent cursor dot */
  cursorDotRadius: number;
}

export interface ScrollProgressConfig {
  /** Inset from the top and bottom edge of the viewport in pixels */
  verticalInsetPx: number;
  /** Width of the vertical dark track rail in pixels */
  railWidthPx: number;
  /** Diameter of the luminous endpoint bead in pixels */
  beadDiameterPx: number;
  /** Critically-damped spring tension coefficient */
  springTension: number;
  /** Critically-damped spring damping friction coefficient */
  springFriction: number;
}

export interface LoaderAffordanceConfig {
  /** Delay in milliseconds after loader completion before showing the scroll indicator */
  indicatorDelayMs: number;
  /** Rate at which the scroll indicator fades out as the user begins scrolling */
  indicatorFadeMultiplier: number;
  /** Scroll progress threshold after which the indicator is hidden */
  indicatorHiddenThreshold: number;
}

export const CURSOR_SPARKLES_SETTINGS: CursorSparklesConfig = {
  minDistanceToEmitPx: 2,
  maxParticlesPerBurst: 3,
  velocityDamping: 0.96,
  downwardDrift: 0.15,
  starParticleProbability: 0.35,
  baseLifetimeFrames: 25,
  cursorDotRadius: 1.8,
};

export const SCROLL_PROGRESS_SETTINGS: ScrollProgressConfig = {
  verticalInsetPx: 18,
  railWidthPx: 3,
  beadDiameterPx: 5,
  springTension: 260,
  springFriction: 30,
};

export const LOADER_AFFORDANCE_SETTINGS: LoaderAffordanceConfig = {
  indicatorDelayMs: 1000,
  indicatorFadeMultiplier: 3.5,
  indicatorHiddenThreshold: 0.3,
};
