/**
 * ============================================================================
 * SHARED MILESTONE CARD SETTINGS & TIMING COORDINATION
 * ============================================================================
 * Single source of truth for:
 * 1. Milestone timing windows during tree-growth (Stage D)
 * 2. Automatic derivation of snap centers consumed by App navigation
 * 3. Standardized transparent vs. opaque card background styles
 * 4. Card motion transforms and animation durations
 * ============================================================================
 */

export type MilestoneCardId = 'projects' | 'skills' | 'about' | 'contact';

export interface MilestoneTiming {
  id: MilestoneCardId;
  start: number;
  fadeInEnd: number;
  fadeOutStart: number;
  end: number;
}

export interface CardSnapCenter {
  id: MilestoneCardId;
  centerD: number;
}

/**
 * 4 comfortable milestone windows over tree growth (progressD: 0.0 to 1.0)
 * Preserves the exact verified timings:
 * - Projects: [0.01, 0.06, 0.16, 0.20] -> Center = 0.11
 * - Skills:   [0.22, 0.28, 0.38, 0.44] -> Center = 0.33
 * - About:    [0.46, 0.53, 0.60, 0.69] -> Center = 0.565
 * - Contact:  [0.76, 0.82, 0.92, 0.98] -> Center = 0.87
 */
export const MILESTONE_TIMINGS: MilestoneTiming[] = [
  { id: 'projects', start: 0.01, fadeInEnd: 0.06, fadeOutStart: 0.16, end: 0.20 },
  { id: 'skills', start: 0.22, fadeInEnd: 0.28, fadeOutStart: 0.38, end: 0.44 },
  { id: 'about', start: 0.46, fadeInEnd: 0.53, fadeOutStart: 0.60, end: 0.69 },
  { id: 'contact', start: 0.76, fadeInEnd: 0.82, fadeOutStart: 0.92, end: 0.98 },
];

/**
 * Derived plateau centers for navigation and scroll-snap anchors.
 * Mathematically derived from the midpoint of [fadeInEnd, fadeOutStart] for each milestone,
 * ensuring zero timing discrepancies between App.tsx and PortfolioShowcaseStage.tsx.
 */
export const CARD_SNAP_CENTERS: CardSnapCenter[] = MILESTONE_TIMINGS.map((m) => ({
  id: m.id,
  centerD: Number(((m.fadeInEnd + m.fadeOutStart) / 2).toFixed(4)),
}));

/**
 * Standardized background-opacity styles for all 4 Stage D milestone cards:
 * - State A (Transparent): default on scroll, initial entrance, and after outside click
 * - State B (Opaque): activated on pointer enter/move, persists until outside click
 */
export const MILESTONE_CARD_STYLES = {
  transparent: 'bg-black/50 backdrop-blur-md border-white/10 shadow-lg md:bg-white/5 md:backdrop-blur-none',
  opaque: 'bg-neutral-950/85 backdrop-blur-xl border-amber-400/50 shadow-2xl',
} as const;

export interface SharedCardSettings {
  /** Vertical travel displacement in pixels during scroll fade-in / fade-out (default: 30) */
  translateYOffsetPx: number;
  /** Transition duration for card state changes (default: 300) */
  transitionDurationMs: number;
  /** Base card rounded corner class (default: 'rounded-2xl') */
  roundedCornerClass: string;
}

export const SHARED_CARD_SETTINGS: SharedCardSettings = {
  translateYOffsetPx: 30,
  transitionDurationMs: 300,
  roundedCornerClass: 'rounded-2xl',
};
