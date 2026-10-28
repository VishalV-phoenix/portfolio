/**
 * =============================================================================
 * WATERGLASS VISUAL CONFIGURATION
 * =============================================================================
 * Centralized, human-editable settings for the Golden WaterGlass effect
 * used on navigation pills and social/contact icons.
 *
 * HOW TO USE:
 * Open this file in VS Code, adjust any number or color below, and save.
 * Vite development server will automatically reload the changes in real time.
 * =============================================================================
 */

export interface WaterGlassConfig {
  // A. Glass Surface Properties
  backdropBlurPx: number;
  baseOpacity: number;
  baseTintRgb: string;
  glassIntensity: number;

  // B. Golden Appearance
  accentGoldRgb: string;
  upperHighlightRgb: string;
  lowerRimRgb: string;
  lowerRimBrightness: number;
  reflectionStrength: number;
  outerGlowStrength: number;
  shadowStrength: number;

  // C. Reflective Highlights & Glint
  specularBrightness: number;
  showCornerGlint: boolean;
  glintScale: number;
  glintOpacity: number;

  // D. Interaction Effects
  shimmerIntensity: number;
  rippleOpacity: number;
  hoverTransitionMs: number;
  activeScale: number;

  // E. Shape & Borders
  borderWidthPx: number;
  borderOpacity: number;
  capsuleRadiusPx: number;
}

export const WATER_GLASS_SETTINGS: WaterGlassConfig = {
  // ---------------------------------------------------------------------------
  // A. GLASS SURFACE
  // ---------------------------------------------------------------------------

  /**
   * Amount of optical refraction background blur behind the glass, in pixels.
   * - Increase (e.g. 24): Softer, more frosted, dreamlike appearance.
   * - Decrease (e.g. 8): Sharper, more transparent, crystalline appearance.
   * Unit: pixels (px). Suggested range: 6 - 32. Default: 16
   */
  backdropBlurPx: 16,

  /**
   * Opacity of the base dark liquid glass surface, from 0.0 to 1.0.
   * - Increase (e.g. 0.85): Darker, richer obsidian pool, higher contrast with text.
   * - Decrease (e.g. 0.45): More transparent, reveals more background forest detail.
   * Unit: normalized ratio (0.0 to 1.0). Default: 0.65
   */
  baseOpacity: 0.65,

  /**
   * Base dark liquid tint channels (Red, Green, Blue).
   * Forms the underlying obsidian/amber depth gradient.
   * Format: 'R, G, B' (0-255). Default: '28, 24, 18' (deep warm charcoal)
   */
  baseTintRgb: '28, 24, 18',

  /**
   * Global intensity multiplier for all glass highlights, borders, and glows.
   * - Increase (e.g. 1.25): Makes the entire water glass effect punchier and brighter.
   * - Decrease (e.g. 0.75): Subtler, more restrained optical presence.
   * Unit: multiplier (0.5 to 1.5). Default: 1.0
   */
  glassIntensity: 1.0,

  // ---------------------------------------------------------------------------
  // B. GOLDEN APPEARANCE
  // ---------------------------------------------------------------------------

  /**
   * Main warm gold/amber accent color channels (Red, Green, Blue).
   * Controls the primary ambient reflections and outer glow hue.
   * Format: 'R, G, B' (0-255). Default: '245, 175, 45' (warm radiant gold)
   */
  accentGoldRgb: '245, 175, 45',

  /**
   * Upper specular highlight and rim border color channels (Red, Green, Blue).
   * Gives the top curved meniscus its soft champagne brilliance.
   * Format: 'R, G, B' (0-255). Default: '255, 245, 210' (champagne light)
   */
  upperHighlightRgb: '255, 245, 210',

  /**
   * Lower rim luminous bounce color channels (Red, Green, Blue).
   * Replaces the cyan bounce light with a magical warm amber under-glow.
   * Format: 'R, G, B' (0-255). Default: '251, 191, 36' (luminous amber)
   */
  lowerRimRgb: '251, 191, 36',

  /**
   * Lower rim under-glow brightness multiplier.
   * - Increase (e.g. 1.2): Stronger golden caustic bounce light along bottom curve.
   * - Decrease (e.g. 0.6): Softer, more muted bottom rim.
   * Unit: multiplier (0.0 to 1.5). Default: 0.95
   */
  lowerRimBrightness: 0.95,

  /**
   * Internal golden reflection strength multiplier.
   * - Increase (e.g. 1.5): Richer golden reflections inside the liquid body.
   * - Decrease (e.g. 0.5): Cleaner, clearer glass with less internal color.
   * Unit: multiplier (0.0 to 2.0). Default: 1.0
   */
  reflectionStrength: 1.0,

  /**
   * Outer ambient golden glow strength around the button perimeter.
   * - Increase (e.g. 0.45): More ethereal, radiant fairy-like aura around the pill.
   * - Decrease (e.g. 0.10): Crisp, clean edge with minimal diffuse glow.
   * Unit: opacity/intensity (0.0 to 1.0). Default: 0.26
   */
  outerGlowStrength: 0.26,

  /**
   * Outer drop shadow intensity behind the glass element.
   * - Increase (e.g. 0.90): Deeper contrast and separation from bright forest backdrop.
   * - Decrease (e.g. 0.40): Flatter, lighter integration with the background.
   * Unit: opacity (0.0 to 1.0). Default: 0.75
   */
  shadowStrength: 0.75,

  // ---------------------------------------------------------------------------
  // C. REFLECTIVE HIGHLIGHTS & GLINT
  // ---------------------------------------------------------------------------

  /**
   * Brightness of the upper curved meniscus highlight line.
   * - Increase (e.g. 1.2): Crisp glossy glass refraction along top edge.
   * - Decrease (e.g. 0.5): Softer, more matte top contour.
   * Unit: multiplier (0.0 to 1.5). Default: 0.95
   */
  specularBrightness: 0.95,

  /**
   * Whether to display the signature specular corner bubble glint bead at ~10 o'clock.
   * - true: Shows small sparkling lens glint bead.
   * - false: Clean edge without corner glint.
   * Default: true
   */
  showCornerGlint: true,

  /**
   * Scale multiplier for the corner glint bead.
   * - Increase (e.g. 1.3): Larger, more prominent optical bead.
   * - Decrease (e.g. 0.7): Tiny delicate pinpoint reflection.
   * Unit: multiplier (0.5 to 1.5). Default: 1.0
   */
  glintScale: 1.0,

  /**
   * Opacity of the corner glint bead.
   * - Increase (e.g. 1.0): Solid bright diamond-like glint.
   * - Decrease (e.g. 0.5): Fainter, subtle optical bead.
   * Unit: opacity (0.0 to 1.0). Default: 0.95
   */
  glintOpacity: 0.95,

  // ---------------------------------------------------------------------------
  // D. INTERACTION EFFECTS
  // ---------------------------------------------------------------------------

  /**
   * Brightness and intensity of the pointer-following liquid shimmer spotlight.
   * - Increase (e.g. 1.4): Shimmer tracks cursor with vivid luminescence.
   * - Decrease (e.g. 0.5): Subtle, whisper-soft cursor response.
   * Unit: multiplier (0.0 to 1.8). Default: 1.0
   */
  shimmerIntensity: 1.0,

  /**
   * Opacity of the expanding water ripple wave on hover and click.
   * - Increase (e.g. 0.90): Highly visible, prominent ripple wave.
   * - Decrease (e.g. 0.35): Barely-there ethereal fluid ripple.
   * Unit: opacity (0.0 to 1.0). Default: 0.70
   */
  rippleOpacity: 0.70,

  /**
   * Transition smoothing duration when hovering or unhovering, in milliseconds.
   * - Increase (e.g. 450): Dreamy, slow-motion liquid response.
   * - Decrease (e.g. 150): Snappy, tactile response.
   * Unit: milliseconds (ms). Default: 280
   */
  hoverTransitionMs: 280,

  /**
   * Scale factor applied when the control is pressed or clicked.
   * - 0.95: Satisfying tactile press-down dip.
   * - 1.0: No scale change on press.
   * Unit: scale factor (0.90 to 1.0). Default: 0.96
   */
  activeScale: 0.96,

  // ---------------------------------------------------------------------------
  // E. SHAPE & BORDERS
  // ---------------------------------------------------------------------------

  /**
   * Thickness of the champagne glass rim border, in pixels.
   * - Increase (e.g. 1.5 or 2): More pronounced metallic/glass frame.
   * - Decrease (e.g. 1): Delicate hairline optical meniscus.
   * Unit: pixels (px). Default: 1
   */
  borderWidthPx: 1,

  /**
   * Visibility / opacity of the champagne rim border.
   * - Increase (e.g. 0.70): Brighter, clearer outline.
   * - Decrease (e.g. 0.25): Border melts into the background.
   * Unit: opacity (0.0 to 1.0). Default: 0.46
   */
  borderOpacity: 0.46,

  /**
   * Capsule border radius for navigation pills, in pixels.
   * - 9999: Perfect pill/capsule shape.
   * - Lower values (e.g. 12): Rounded rectangle card aesthetic.
   * Unit: pixels (px). Default: 9999
   */
  capsuleRadiusPx: 9999,
};

/**
 * Translates the configuration object into standard CSS custom properties
 * consumed by WaterGlass component elements and WaterGlass.css.
 */
export function getWaterGlassCssVariables(
  settings: WaterGlassConfig = WATER_GLASS_SETTINGS
): Record<string, string> {
  return {
    '--wg-blur': `${settings.backdropBlurPx}px`,
    '--wg-glass-base-opacity': String(settings.baseOpacity),
    '--wg-intensity': String(settings.glassIntensity),
    '--wg-gold-warm': settings.accentGoldRgb,
    '--wg-gold-bright': settings.upperHighlightRgb,
    '--wg-gold-glow': settings.lowerRimRgb,
    '--wg-rim-brightness': String(settings.lowerRimBrightness),
    '--wg-gold': String(settings.reflectionStrength),
    '--wg-outer-glow-intensity': String(settings.outerGlowStrength),
    '--wg-shadow-strength': String(settings.shadowStrength),
    '--wg-specular-brightness': String(settings.specularBrightness),
    '--wg-glint-scale': String(settings.glintScale),
    '--wg-glint-opacity': settings.showCornerGlint ? String(settings.glintOpacity) : '0',
    '--wg-shimmer-intensity': String(settings.shimmerIntensity),
    '--wg-ripple-opacity': String(settings.rippleOpacity),
    '--wg-transition-duration': `${settings.hoverTransitionMs}ms`,
    '--wg-border-width': `${settings.borderWidthPx}px`,
    '--wg-border-opacity': String(settings.borderOpacity),
    '--wg-active-scale': String(settings.activeScale),
  };
}

/** Alias for backward compatibility */
export const DEFAULT_WATER_GLASS_SETTINGS = WATER_GLASS_SETTINGS;
