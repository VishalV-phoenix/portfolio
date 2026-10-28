/**
 * ============================================================================
 * GOLDEN SPARKLE CURSOR EFFECT - DEDICATED SETTINGS FILE
 * ============================================================================
 *
 * Controls all parameters for the custom golden dust and sparkle cursor trail:
 *   - Enabling / disabling the effect
 *   - Native cursor hiding
 *   - Emission spacing and particle limits
 *   - Particle sizes, lifetimes, speeds, and colors
 *   - Twinkling sparkles and halo glow intensity
 * ============================================================================
 */

(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        define([], factory);
    } else if (typeof module === 'object' && module.exports) {
        module.exports = factory();
    } else {
        root.GOLDEN_CURSOR_SETTINGS = factory();
    }
})(typeof self !== 'undefined' ? self : this, function () {
    'use strict';

    const GOLDEN_CURSOR_SETTINGS = {
        /**
         * Master switch to enable or disable the custom cursor trail.
         * Default: true
         */
        enabled: true,

        /**
         * Whether to hide the native OS cursor within the active target area.
         * When true, only the golden dust sparkles appear when moving.
         * When movement stops, the cursor becomes completely invisible.
         * Default: true
         */
        hideNativeCursor: true,

        /**
         * CSS selector or DOM element where the custom cursor is enabled.
         * Set to a specific section (e.g. '.loader2-wrapper', '#tree-section')
         * or 'body' to enable site-wide.
         * Default: '.loader2-wrapper'
         */
        targetArea: '.loader2-wrapper',

        /**
         * Cursor smoothing response time in seconds.
         *
         * Controls how quickly the *rendered* (smoothed) cursor position catches up
         * to the raw mouse position. Implemented as the RC time-constant (tau) of a
         * first-order exponential low-pass filter:
         *
         *   alpha = 1 - exp(-dt / smoothing)
         *   smoothPos += (rawPos - smoothPos) * alpha   [per RAF frame]
         *
         * Particles are emitted along the smoothed path, not the raw mouse path,
         * which eliminates zigzags and jitter from irregular mouse-event timing.
         *
         * Smaller value = snappier trail, less smoothing
         * Larger value  = more fluid trail, slightly more lag
         *
         * Unit: Seconds (s)
         * Default: 0.06
         * Suggested range: 0.02 (instant) to 0.15 (very fluid, noticeable lag)
         */
        smoothing: 0.06,

        /**
         * Distance in pixels the smoothed cursor must travel between consecutive
         * particle emissions. Smaller values = denser, continuous trail.
         *
         * Emission is distance-based (not event-based), so spacing stays consistent
         * regardless of mouse-event frequency or movement speed.
         *
         * Unit: Pixels (px)
         * Default: 6
         * Suggested range: 3 to 12
         */
        particleSpacing: 22,

        /**
         * Maximum number of simultaneous active particles allowed on screen.
         * Hard cap to maintain smooth 60fps performance during rapid mouse sweeps.
         * Default: 120
         * Suggested range: 60 to 200
         */
        maxParticles: 80,

        /**
         * Minimum particle radius in pixels.
         * Unit: Pixels (px)
         * Default: 0.9
         * Suggested range: 0.6 to 1.5
         */
        sizeMin: 1.1,

        /**
         * Maximum particle radius in pixels.
         * Unit: Pixels (px)
         * Default: 2.4
         * Suggested range: 1.8 to 3.5
         */
        sizeMax: 2.5,

        /**
         * Minimum lifespan of a particle before complete fade-out.
         * Unit: Seconds (s)
         * Default: 0.45 (450ms)
         * Suggested range: 0.35 to 0.60
         */
        lifespanMin: 0.45,

        /**
         * Maximum lifespan of a particle before complete fade-out.
         * Unit: Seconds (s)
         * Default: 0.75 (750ms)
         * Suggested range: 0.55 to 0.90
         */
        lifespanMax: 0.55,

        /**
         * Initial movement spread and buoyancy parameters.
         */
        movement: {
            /**
             * Minimum initial outward velocity in pixels per second.
             * Default: 10
             * Suggested range: 6 to 18
             */
            speedMin: 20,

            /**
             * Maximum initial outward velocity in pixels per second.
             * Default: 32
             * Suggested range: 20 to 50
             */
            speedMax: 32,

            /**
             * Upward vertical buoyancy acceleration (simulates delicate floating dust).
             * Negative value means drifting gently upwards.
             * Unit: Pixels per second squared (px/s²)
             * Default: -14
             * Suggested range: -30 to 0
             */
            buoyancy: -14,

            /**
             * Air drag damping factor applied to particle velocity each frame.
             * Default: 0.04
             */
            drag: 0.04,
        },

        /**
         * Warm golden color palette for normal dust and ember particles.
         */
        colors: [
            { r: 255, g: 215, b: 85 },  // Brilliant Gold (#ffd755)
            { r: 245, g: 175, b: 45 },  // Warm Amber (#f5af2d)
            { r: 255, g: 242, b: 195 }, // Soft Champagne Ivory (#fff2c3)
            { r: 230, g: 155, b: 20 }   // Deep Fiery Goldenrod (#e69b14)
        ],

        /**
         * Multiplier for the soft outer glow halo surrounding each particle.
         * Default: 1.0
         * Suggested range: 0.6 to 1.8
         */
        glowIntensity: 1.2,

        /**
         * Probability of emitting an occasional brighter, twinkling 4-point sparkle.
         * Kept restrained (8-12%) so the vast majority of the trail remains delicate dust.
         * Unit: Fraction (0.0 to 1.0)
         * Default: 0.10 (10% of particles)
         * Suggested range: 0.05 to 0.15
         */
        sparkleChance: 0.10,

        /**
         * Intense core color for bright twinkling sparkles.
         * Default: { r: 255, g: 255, b: 235 }
         */
        sparkleCoreColor: { r: 255, g: 255, b: 235 },

        /**
         * Base opacity cap for particles.
         * Unit: Fraction (0.0 to 1.0)
         * Default: 0.90
         * Suggested range: 0.70 to 1.0
         */
        baseOpacity: 0.90,

        /**
         * Canvas stacking z-index layer.
         * Default: 25
         */
        zIndex: 25,
    };

    return GOLDEN_CURSOR_SETTINGS;
});
