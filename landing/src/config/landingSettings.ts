/**
 * =============================================================================
 * LANDING PAGE POSITIONING SETTINGS
 * =============================================================================
 *
 * This configuration file allows you to adjust the horizontal (left/right)
 * and vertical (up/down) positions of text, buttons, and social icons on
 * both screens of your landing page:
 *
 *   1. Default Intro State  (black background with "Hi there, Vishal V here")
 *   2. Forest Reveal State  (after the magic circle expands and reveals the forest)
 *
 * -----------------------------------------------------------------------------
 * QUICK USAGE GUIDE:
 * -----------------------------------------------------------------------------
 * Every position setting has:
 *   - `x`: Horizontal offset in pixels.
 *          Positive (+) moves RIGHT  (e.g.,  x: 20  moves 20px to the right)
 *          Negative (-) moves LEFT   (e.g.,  x: -20 moves 20px to the left)
 *          Zero     (0) stays in its default centered/aligned position.
 *
 *   - `y`: Vertical offset in pixels.
 *          Positive (+) moves DOWN   (e.g.,  y: 30  moves 30px down)
 *          Negative (-) moves UP     (e.g.,  y: -30 moves 30px up)
 *          Zero     (0) stays in its default position.
 *
 * -----------------------------------------------------------------------------
 * MOBILE OVERRIDES (Optional):
 * -----------------------------------------------------------------------------
 * By default, your `x` and `y` values apply to ALL screen sizes (desktop & mobile).
 * If you want a DIFFERENT position specifically on small mobile screens (<768px),
 * you can add a `mobile` block:
 *
 *   heading: {
 *     x: 0,
 *     y: -25,              // Moves 25px UP on desktop screens
 *     mobile: {
 *       x: 0,
 *       y: -10,            // Moves only 10px UP on mobile screens
 *     },
 *   },
 *
 * =============================================================================
 */

import type React from 'react';

/**
 * Defines horizontal and vertical offsets in pixels.
 */
export interface PositionOffset {
  /**
   * Horizontal offset in pixels.
   * - Positive (+) = Move RIGHT
   * - Negative (-) = Move LEFT
   * - 0 = Default position
   */
  x: number;

  /**
   * Vertical offset in pixels.
   * - Positive (+) = Move DOWN
   * - Negative (-) = Move UP
   * - 0 = Default position
   */
  y: number;

  /**
   * Optional mobile overrides (screens narrower than 768px).
   * If not provided, the desktop `x` and `y` offsets above are used everywhere.
   */
  mobile?: {
    /** Mobile horizontal offset in pixels. Positive = right, negative = left. */
    x?: number;
    /** Mobile vertical offset in pixels. Positive = down, negative = up. */
    y?: number;
  };
}

/**
 * Settings structure covering both landing page states.
 */
export interface LandingSettings {
  /** Settings for the initial black monochrome screen */
  defaultIntro: {
    /** Top navigation buttons bar (Home, Projects, Skills, Achievements, Contact) */
    navigationButtons: PositionOffset;
    /** Container holding all intro text (greeting, heading, tagline, and icons) */
    introGroup: PositionOffset;
    /** "Hi there," greeting text */
    greeting: PositionOffset;
    /** Main "Vishal V" heading */
    heading: PositionOffset;
    /** Small "here" text next to the heading */
    suffix: PositionOffset;
    /** Intro tagline paragraph */
    tagline: PositionOffset;
    /** Social icons group (Email, LinkedIn, GitHub) in the intro screen */
    socialIcons: PositionOffset;
  };

  /** Settings for the state after the magical forest is revealed */
  forestReveal: {
    /** Top navigation buttons bar in the forest reveal state */
    navigationButtons: PositionOffset;
    /** Bottom container holding both the revealed tagline and social icons */
    bottomGroup: PositionOffset;
    /** Revealed tagline pill box */
    tagline: PositionOffset;
    /** Revealed social icons group at the bottom */
    socialIcons: PositionOffset;
  };
}

/**
 * Centralized positioning settings.
 * All offsets default to { x: 0, y: 0 } so the original layout is perfectly preserved.
 */
export const LANDING_SETTINGS: LandingSettings = {
  // ===========================================================================
  // 1. DEFAULT INTRO SCREEN SETTINGS (Black background)
  // ===========================================================================
  defaultIntro: {
    /**
     * Top Navigation Buttons Bar (Home, Projects, Skills, Achievements, Contact)
     * - Adjusts the entire button row near the top of the intro screen.
     * - Positive x: right | Negative x: left
     * - Positive y: down  | Negative y: up
     */
    navigationButtons: {
      x: 0,
      y: 0,
    },

    /**
     * Complete Intro Text Group (Container)
     * - Moves the entire central box (greeting + name + tagline + icons) together.
     * - Positive x: right | Negative x: left
     * - Positive y: down  | Negative y: up
     */
    introGroup: {
      x: 0,
      y: 40,
    },

    /**
     * "Hi there," Greeting Text
     * - Moves the greeting independently.
     * - Positive x: right | Negative x: left
     * - Positive y: down  | Negative y: up
     */
    greeting: {
      x: -80,
      y: 0,
    },

    /**
     * Main "Vishal V" Heading
     * - Moves the large serif name independently.
     * - Positive x: right | Negative x: left
     * - Positive y: down  | Negative y: up
     */
    heading: {
      x: 0,
      y: 0,
    },

    /**
     * Small "here" Text
     * - Moves the small suffix word beside the main heading independently.
     * - Positive x: right | Negative x: left
     * - Positive y: down  | Negative y: up
     */
    suffix: {
      x: 0,
      y: 0,
    },

    /**
     * Intro Tagline Paragraph
     * - Moves the tagline text below the name independently.
     * - Positive x: right | Negative x: left
     * - Positive y: down  | Negative y: up
     */
    tagline: {
      x: 0,
      y: 10,
    },

    /**
     * Intro Social Icons Group
     * - Moves the 3 social circle buttons (Email, LinkedIn, GitHub) on the intro screen.
     * - Positive x: right | Negative x: left
     * - Positive y: down  | Negative y: up
     */
    socialIcons: {
      x: 0,
      y: 10,
    },
  },

  // ===========================================================================
  // 2. FOREST REVEAL SCREEN SETTINGS (After the portal opens)
  // ===========================================================================
  forestReveal: {
    /**
     * Top Navigation Buttons Bar (Revealed Forest State)
     * - Independently controls the navigation buttons when the forest is revealed.
     * - Positive x: right | Negative x: left
     * - Positive y: down  | Negative y: up
     */
    navigationButtons: {
      x: 0,
      y: 0,
    },

    /**
     * Bottom Content Group (Container)
     * - Moves the revealed tagline pill AND the social icons together.
     * - Positive x: right | Negative x: left
     * - Positive y: down  | Negative y: up
     */
    bottomGroup: {
      x: 0,
      y: 50,
    },

    /**
     * Revealed Tagline Pill Box
     * - Moves the frosted glass tagline box at the bottom independently.
     * - Positive x: right | Negative x: left
     * - Positive y: down  | Negative y: up
     */
    tagline: {
      x: 0,
      y: -130,
    },

    /**
     * Revealed Social Icons Group
     * - Moves the social circle buttons at the bottom of the forest screen independently.
     * - Positive x: right | Negative x: left
     * - Positive y: down  | Negative y: up
     */
    socialIcons: {
      x: 0,
      y: -130,
    },
  },
};

/**
 * =============================================================================
 * MAGIC CIRCLE INTERACTION SETTINGS
 * =============================================================================
 *
 * Controls the activation area, sensitivity, and positioning of the
 * interactive magic-circle cursor indicator on the landing page.
 */
export interface MagicCircleSettings {
  /**
   * Horizontal activation range measured as a percentage of viewport width from the left edge (0 to 100).
   * - Moving the cursor anywhere within this portion of the screen (from x = 0 up to x = viewportWidth * activationWidthPercent / 100)
   *   activates the magic-circle indicator.
   * - Unit: Percentage (0 - 100)
   * - Default: 60 (covers ~60% of the viewport width from the left edge).
   * - Adjust this value to make the activation zone narrower (e.g. 40) or wider (e.g. 75).
   */
  activationWidthPercent: number;

  /**
   * Vertical center alignment of the activation hotspot as a percentage of viewport height (0 to 100).
   * - Unit: Percentage (0 - 100)
   * - Default: 48 (vertically centered around greeting and name text).
   */
  hotspotYPercent: number;

  /**
   * Horizontal position of the trigger anchor hotspot as a percentage of viewport width (0 to 100).
   * - Used as the origin point for the portal reveal expansion.
   * - Unit: Percentage (0 - 100)
   * - Default: 14 (16 on mobile screens <768px).
   */
  hotspotXPercent: number;

  /**
   * Trigger snap buffer in pixels. Within this distance of full activation, progress snaps to 100% and circle glows complete.
   * - Unit: Pixels (px)
   * - Default: 36
   */
  triggerSnapRadius: number;
}

export const MAGIC_CIRCLE_SETTINGS: MagicCircleSettings = {
  /**
   * Percentage of viewport width from the left edge that activates the magic circle.
   * Default: 60 (covers ~60% of the screen from left).
   */
  activationWidthPercent: 60,

  /**
   * Vertical center alignment (~48% of viewport height).
   */
  hotspotYPercent: 48,

  /**
   * Horizontal hotspot anchor position (~14% of viewport width).
   */
  hotspotXPercent: 14,

  /**
   * Snap distance in pixels to complete the circle.
   */
  triggerSnapRadius: 36,
};

/**
 * Reusable helper function that converts a PositionOffset into a React inline style.
 * Uses CSS `transform: translate(x, y)` which is safe, smooth, hardware-accelerated,
 * and preserves existing responsive layout flow without breaking centering.
 *
 * @param offset - The PositionOffset configuration (or undefined)
 * @param isMobile - True when viewing on mobile screens (<768px wide)
 * @returns React.CSSProperties with the calculated translate transform
 */
export function getPositionStyle(
  offset?: PositionOffset,
  isMobile: boolean = false
): React.CSSProperties {
  if (!offset) return {};

  const x = isMobile && offset.mobile?.x !== undefined ? offset.mobile.x : offset.x;
  const y = isMobile && offset.mobile?.y !== undefined ? offset.mobile.y : offset.y;

  // When both offsets are 0, return empty object to avoid unnecessary style attributes
  if (!x && !y) return {};

  return {
    transform: `translate(${x}px, ${y}px)`,
  };
}



