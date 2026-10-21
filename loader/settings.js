/**
 * ============================================================================
 * PHOENIX V LOADER (LOADER2) - DEDICATED SETTINGS FILE
 * ============================================================================
 *
 * This configuration controls all visual and animation parameters for the
 * Phoenix V 3D Coin Loader in /loader2/.
 *
 * It is completely isolated from the main portfolio settings in /config/settings.js
 * and will not affect the existing map loader or the Magic Tree page.
 *
 * Sections:
 *   1. LAYOUT & RESPONSIVE POSITIONING
 *   2. 3D COIN ROTATION & DEPTH (Spinning V)
 *   3. METALLIC SILHOUETTE SHINE
 *   4. GOLDEN GLOWING LOADING LINE
 *   5. AMBIENT FLOATING GOLDEN PARTICLES
 *   6. COMPLETION & FADE TRANSITION
 * ============================================================================
 */

(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        define([], factory);
    } else if (typeof module === 'object' && module.exports) {
        module.exports = factory();
    } else {
        const settings = factory();
        root.LOADER2_SETTINGS = settings;

        // Automatically sync settings to CSS variables when DOM is ready
        if (typeof document !== 'undefined') {
            if (document.readyState === 'loading') {
                document.addEventListener('DOMContentLoaded', function () {
                    settings.applyToCSS();
                });
            } else {
                settings.applyToCSS();
            }
        }
    }
})(typeof self !== 'undefined' ? self : this, function () {
    'use strict';

    const LOADER2_SETTINGS = {

        // ====================================================================
        // 1. LAYOUT & RESPONSIVE POSITIONING
        // ====================================================================
        layout: {
            /**
             * Vertical center position of the logo + loading line group.
             * Measured as a percentage from the top of the viewport.
             * 75% means the group center is located 25% above the bottom edge.
             * Unit: Percentage (%)
             * Default: 75
             * Suggested range: 65 to 80
             */
            verticalPositionPercent: 75,

            /**
             * Minimum distance in pixels from the bottom edge of the screen to
             * ensure the group is never clipped or pushed offscreen on short displays
             * (e.g. mobile landscape, short laptop windows).
             * Unit: Pixels (px)
             * Default: 80
             * Suggested range: 60 to 120
             */
            minBottomPaddingPx: 80,

            /**
             * Minimum distance in pixels from the top edge of the screen on very
             * short viewports to prevent clipping at the top.
             * Unit: Pixels (px)
             * Default: 60
             * Suggested range: 40 to 100
             */
            minTopPaddingPx: 60,

            /**
             * Display width of the Phoenix V logo on desktop screens (>768px).
             * Unit: Pixels (px)
             * Default: 175
             * Suggested range: 140 to 220
             */
            logoWidthDesktop: 175,

            /**
             * Display width of the Phoenix V logo on mobile screens (<=768px).
             * Unit: Pixels (px)
             * Default: 125
             * Suggested range: 95 to 145
             */
            logoWidthMobile: 125,

            /**
             * Vertical spacing between the bottom of the logo and the loading line.
             * Unit: Pixels (px)
             * Default: 32
             * Suggested range: 20 to 50
             */
            logoToLineSpacing: 32,

            /**
             * Total width of the loading line on desktop screens (>768px).
             * Unit: Pixels (px)
             * Default: 220
             * Suggested range: 180 to 280
             */
            lineWidthDesktop: 220,

            /**
             * Total width of the loading line on mobile screens (<=768px).
             * Unit: Pixels (px)
             * Default: 160
             * Suggested range: 130 to 200
             */
            lineWidthMobile: 160,

            /**
             * Thickness / height of the loading line.
             * Unit: Pixels (px)
             * Default: 2.5
             * Suggested range: 1.5 to 4.0
             */
            lineHeight: 2.5,
        },


        // ====================================================================
        // 2. 3D COIN ROTATION & DEPTH
        // ====================================================================
        coin: {
            /**
             * Time in seconds for one full 360-degree Y-axis rotation.
             * Higher values = slower, more majestic rotation;
             * Lower values = faster coin spin.
             * Unit: Seconds (s)
             * Default: 6.5
             * Suggested range: 4.5 to 9.0
             */
            rotationPeriod: 6.5,

            /**
             * Rotation direction around Y-axis.
             * 'normal' (clockwise looking from above) or 'reverse' (counter-clockwise).
             * Default: 'normal'
             */
            rotationDirection: 'normal',

            /**
             * 3D perspective depth in pixels applied to the coin container.
             * Lower values = stronger 3D perspective distortion;
             * Higher values = flatter, subtle orthographic 3D effect.
             * Unit: Pixels (px)
             * Default: 1000
             * Suggested range: 700 to 1500
             */
            perspective: 1400,

            /**
             * Simulated rim thickness in pixels (distance between front and back faces).
             * Simulates solid coin depth as it rotates edge-on.
             * Unit: Pixels (px)
             * Default: 3.0
             * Suggested range: 1.5 to 5.0
             */
            rimThickness: 1.0,

            /**
             * Metallic rim border color displayed along the edges during rotation.
             * Default: '#b8860b' (Dark Goldenrod)
             */
            rimColor: '#000000',

            /**
             * Brightness/darkness multiplier for the reverse (back) side of the coin.
             * Slightly darkening the back creates natural self-shadowing and depth.
             * Unit: Fraction (0.0 to 1.0)
             * Default: 0.85
             * Suggested range: 0.70 to 0.95
             */
            backsideBrightness: 0.95,
        },


        // ====================================================================
        // 3. METALLIC SILHOUETTE SHINE
        // ====================================================================
        shine: {
            /**
             * Master switch to enable or disable the sweeping metallic light shine.
             * Default: true
             */
            enabled: false,

            /**
             * Duration of a single shine sweep across the logo face.
             * Unit: Seconds (s)
             * Default: 1.3
             * Suggested range: 0.8 to 2.2
             */
            sweepDuration: 1.3,

            /**
             * Delay / pause between consecutive shine sweeps.
             * Unit: Seconds (s)
             * Default: 3.5
             * Suggested range: 2.0 to 6.0
             */
            sweepInterval: 3.5,

            /**
             * Peak brightness / opacity of the shine beam.
             * Higher values = stronger, brighter glint;
             * Lower values = softer, more subtle sheen.
             * Unit: Fraction (0.0 to 1.0)
             * Default: 0.65
             * Suggested range: 0.35 to 0.85
             */
            intensity: 0.05,

            /**
             * Width of the shine beam relative to the logo width.
             * Unit: Percentage (%)
             * Default: 35
             * Suggested range: 20 to 55
             */
            beamWidthPercent: 35,

            /**
             * Angle of the sweeping shine beam across the logo.
             * Unit: Degrees (deg)
             * Default: 115
             * Suggested range: 90 to 140
             */
            beamAngle: 105,

            /**
             * Primary highlight color of the shine beam center.
             * Default: 'rgba(255, 255, 255, 0.9)'
             */
            highlightColor: 'rgba(255, 255, 255, 0.9)',

            /**
             * Warm gold edge color surrounding the shine beam.
             * Default: 'rgba(255, 215, 120, 0.45)'
             */
            warmGoldColor: 'rgba(0, 0, 0, 0.45)',
        },


        // ====================================================================
        // 4. GOLDEN GLOWING LOADING LINE
        // ====================================================================
        line: {
            /**
             * Progress behavior mode:
             *  - 'timed': Simulates smooth 0% to 100% progress over progressDuration ms.
             *  - 'indeterminate': An ambient rhythmic breathing/scanning glow bar.
             * Default: 'timed'
             */
            mode: 'timed',

            /**
             * Total duration of the simulated loading sequence from 0% to 100%.
             * (Only active when mode is 'timed').
             * Unit: Milliseconds (ms)
             * Default: 3500
             * Suggested range: 2000 to 6000
             */
            progressDuration: 3500,

            /**
             * Background track channel color beneath the active loading line.
             * Default: 'rgba(35, 22, 10, 0.7)'
             */
            trackColor: 'rgba(35, 22, 10, 0.7)',

            /**
             * Start color of the active progress gradient (deep gold/amber).
             * Default: '#f19914'
             */
            progressColorStart: '#e28c0c',

            /**
             * Leading tip color of the active progress bar (brilliant white-gold).
             * Default: '#fff2b2'
             */
            progressColorEnd: '#fff2b2',

            /**
             * Multiplier for the layered outer glowing aura around the loading line.
             * Higher values = more radiant bloom; Lower values = crisp, subtle line.
             * Unit: Multiplier (0.0 to 2.0)
             * Default: 1.0
             * Suggested range: 0.5 to 1.5
             */
            glowIntensity: 1.5,

            /**
             * Whether to render a bright glowing particle/flare at the leading edge
             * of the progress line as it advances.
             * Default: true
             */
            showLeadingFlare: true,
        },


        // ====================================================================
        // 5. AMBIENT FLOATING GOLDEN PARTICLES (LOADER2 DEDICATED)
        // ====================================================================
        particles: {
            /**
             * Master switch to enable or disable background magical golden dust.
             * Default: true
             */
            enabled: true,


            // ----------------------------------------------------------------
            // QUANTITY & SPAWN PROGRESSION
            // ----------------------------------------------------------------

            /**
             * Number of particles already visible and gently floating across the screen
             * immediately upon page open so the screen does not feel empty at launch.
             * Unit: Particle count
             * Default: 10
             * Suggested range: 6 to 15
             */
            initialFloatingCount: 10,

            /**
             * Number of particles that initially start cascading down from the top.
             * Starts small (e.g. 5) and gradually increases over time.
             * Unit: Particle count
             * Default: 5
             * Suggested range: 3 to 8
             */
            initialFallingCount: 5,

            /**
             * Fallback alias for initialFallingCount
             */
            initialCount: 5,
            minParticles: 5,

            /**
             * Maximum active particle count on desktop screens (>768px).
             * The particle count smoothly ramps up to this target.
             * Unit: Particle count
             * Default: 90
             * Suggested range: 70 to 110
             */
            countDesktop: 60,

            /**
             * Maximum active particle count on mobile screens (<=768px).
             * Unit: Particle count
             * Default: 45
             * Suggested range: 25 to 50
             */
            countMobile: 45,

            /**
             * Duration in milliseconds over which particle count smoothly climbs
             * to the target maximum. A higher value makes the increase more gradual.
             * Unit: Milliseconds (ms)
             * Default: 5000
             * Suggested range: 3500 to 7000
             */
            rampDuration: 5000,

            /**
             * Delay in milliseconds between spawning new cascading particles at the start.
             * Higher values ensure a slow, gentle trickle of ~5 particles at first.
             * Unit: Milliseconds (ms)
             * Default: 320
             * Suggested range: 200 to 450
             */
            spawnIntervalInitial: 320,

            /**
             * Minimum delay in milliseconds between spawning new cascading particles
             * once full cascade density is achieved.
             * Unit: Milliseconds (ms)
             * Default: 45
             * Suggested range: 30 to 70
             */
            spawnIntervalMin: 45,


            // ----------------------------------------------------------------
            // ORIGIN & DOWNWARD MOVEMENT
            // ----------------------------------------------------------------

            /**
             * Whether particles spawn exclusively from the top of the viewport
             * and cascade downwards (true) or float statically across the screen (false).
             * Default: true
             */
            spawnFromTop: true,

            /**
             * Downward falling speed multiplier.
             * Higher = faster descent; Lower = slow, dreamy float.
             * Unit: Multiplier factor
             * Default: 0.85
             * Suggested range: 0.5 to 1.5
             */
            fallSpeed: 0.5,

            /**
             * Amplitude of subtle organic horizontal sway as particles descend.
             * Unit: Multiplier factor
             * Default: 0.35
             * Suggested range: 0.15 to 0.6
             */
            swayAmount: 0.5,

            /**
             * Legacy master speed multiplier for overall animation velocity.
             * Default: 0.75
             * Suggested range: 0.5 to 1.2
             */
            speed: 0.75,


            // ----------------------------------------------------------------
            // LIFESPAN & FADE
            // ----------------------------------------------------------------

            /**
             * Base lifespan in milliseconds before a particle completely fades out.
             * Unit: Milliseconds (ms)
             * Default: 4200
             * Suggested range: 3000 to 6000
             */
            baseLifespan: 4200,

            /**
             * When true, particle lifetime and fade rate depend directly on size
             * and brightness: larger & brighter particles burn and glow longer,
             * while tiny faint particles fade away sooner.
             * Default: true
             */
            fadeBySizeAndBrightness: true,


            // ----------------------------------------------------------------
            // SIZE
            // ----------------------------------------------------------------

            /**
             * Minimum radius for typical small ambient dust particles.
             * Unit: Pixels (px)
             * Default: 1.2
             * Suggested range: 0.8 to 1.8
             */
            sizeMin: 1.2,

            /**
             * Maximum radius for typical small ambient dust particles.
             * Unit: Pixels (px)
             * Default: 2.8
             * Suggested range: 2.0 to 3.5
             */
            sizeMax: 2.8,

            /**
             * Probability (0.0 – 1.0) of spawning a slightly larger ember particle.
             * Default: 0.15 (15% of particles)
             * Suggested range: 0.08 to 0.25
             */
            largeEmberChance: 0.15,

            /**
             * Minimum radius for large ember particles.
             * Unit: Pixels (px)
             * Default: 3.2
             * Suggested range: 2.5 to 4.0
             */
            largeEmberSizeMin: 3.2,

            /**
             * Maximum radius for large ember particles.
             * Unit: Pixels (px)
             * Default: 4.8
             * Suggested range: 3.5 to 5.5
             */
            largeEmberSizeMax: 4.8,


            // ----------------------------------------------------------------
            // BRIGHTNESS & OPACITY
            // ----------------------------------------------------------------

            /**
             * Minimum peak opacity for particle cores.
             * Unit: Fraction (0.0 to 1.0)
             * Default: 0.35
             * Suggested range: 0.2 to 0.5
             */
            alphaMin: 8.85,

            /**
             * Maximum peak opacity for particle cores.
             * Unit: Fraction (0.0 to 1.0)
             * Default: 0.90
             * Suggested range: 0.7 to 1.0
             */
            alphaMax: 9.90,

            /**
             * Outer glow halo radius multiplier relative to particle core size.
             * Higher values = larger, softer bloom around each particle.
             * Default: 2.8
             * Suggested range: 1.8 to 3.5
             */
            haloGlowScale: 3.0,

            /**
             * Opacity of the soft outer glow halo surrounding each particle.
             * Unit: Fraction (0.0 to 1.0)
             * Default: 0.20
             * Suggested range: 0.10 to 0.35
             */
            haloGlowAlpha: 0.15,


            // ----------------------------------------------------------------
            // COLOR
            // ----------------------------------------------------------------

            /**
             * Warm golden color palette for floating dust.
             * Each entry is an RGB object { r, g, b } with values 0–255.
             * Add, remove, or tweak colors freely.
             */
            colors: [
                //{r:255,g:255,b:255},
                { r: 255, g: 215, b: 0 },    // Pure Gold
                { r: 255, g: 180, b: 30 },   // Warm Amber-Gold
                { r: 255, g: 200, b: 60 },   // Bright Golden-Yellow
                { r: 240, g: 155, b: 15 },   // Deep Amber
            ],


            // ----------------------------------------------------------------
            // CURSOR INTERACTION
            // ----------------------------------------------------------------

            /**
             * Radius in pixels around the mouse cursor that induces a gentle breeze.
             * Unit: Pixels (px)
             * Default: 140
             * Suggested range: 80 to 220
             */
            breezeRadius: 140,

            /**
             * Strength of the gentle cursor breeze pushing particles away.
             * Higher values = stronger breeze; Lower values = subtle drift.
             * Unit: Multiplier
             * Default: 0.40
             * Suggested range: 0.2 to 1.0
             */
            breezeStrength: 0.40,

            /**
             * Enable or disable cursor reactivity on the falling particles.
             * (Cursor trail itself is managed separately and remains untouched).
             * Default: true
             */
            enableCursorInteraction: true,

            /**
             * Recovery rate pulling particles back to ambient trajectory after cursor push.
             * Default: 0.05
             */
            velocityDamping: 0.05,


            // ----------------------------------------------------------------
            // PERFORMANCE
            // ----------------------------------------------------------------

            /**
             * Automatically pauses the animation when the browser tab is hidden
             * to eliminate CPU/GPU usage in the background.
             * Default: true
             */
            pauseWhenHidden: true,

            /**
             * Maximum device pixel ratio (DPR) cap for the particle canvas.
             * Prevents excessive GPU load on high-resolution Retina/4K displays.
             * Default: 2
             * Suggested range: 1 to 2
             */
            maxDpr: 2,
        },

        // ====================================================================
        // 6. TOP GOLDEN LIGHT / CELESTIAL GLOW
        // ====================================================================
        topGlow: {
            /**
             * Master switch to enable or disable the subtle golden light at the top of the screen.
             * Default: true
             */
            enabled: true,

            /**
             * Overall opacity of the golden light (super subtle aura).
             * Unit: Fraction (0.0 to 1.0)
             * Default: 0.65
             * Suggested range: 0.35 to 0.85
             */
            opacity: 0.65,

            /**
             * Vertical reach of the glow downwards from the top edge.
             * Unit: CSS string (vh or px)
             * Default: '48vh'
             * Suggested range: '35vh' to '65vh'
             */
            height: '48vh',

            /**
             * Horizontal width spread percentage of the soft light cone at top.
             * Unit: CSS percentage (%)
             * Default: 85
             * Suggested range: 60 to 100
             */
            spreadWidthPercent: 85,

            /**
             * Core hotspot brightness at the top edge center.
             * Gives the impression that a golden light source is shining from just above.
             * Unit: Fraction (0.0 to 1.0)
             * Default: 0.50
             * Suggested range: 0.25 to 0.75
             */
            coreBrightness: 0.50,

            /**
             * Primary warm gold ambient color.
             * Default: 'rgba(255, 210, 90, 0.24)'
             */
            glowColor: 'rgba(255, 210, 90, 0.24)',

            /**
             * Secondary deep amber falloff tone.
             * Default: 'rgba(215, 150, 30, 0.08)'
             */
            ambientColor: 'rgba(215, 150, 30, 0.08)',

            /**
             * Ambient breathing pulse animation period in seconds.
             * Set to 0 to disable pulsing and keep a static glow.
             * Unit: Seconds (s)
             * Default: 5.0
             * Suggested range: 3.5 to 7.5
             */
            pulseDuration: 5.0,
        },

        // ====================================================================
        // 7. COMPLETION & FADE TRANSITION
        // ====================================================================
        transition: {
            /**
             * Whether to automatically initiate the fade-out once the loading line reaches 100%.
             * Set to false if you want the loader to stay permanently visible during design testing.
             * Default: false (keeps test page visible for inspection)
             */
            autoCompleteOn100: false,

            /**
             * Pause duration in milliseconds after reaching 100% before starting the fade-out.
             * Unit: Milliseconds (ms)
             * Default: 600
             * Suggested range: 300 to 1500
             */
            holdDuration: 600,

            /**
             * Duration of the smooth opacity fade-out animation when completing.
             * Unit: Milliseconds (ms)
             * Default: 800
             * Suggested range: 400 to 1400
             */
            fadeOutDuration: 800,
        },

        // ====================================================================
        // HELPER: APPLY SETTINGS TO CSS CUSTOM PROPERTIES
        // ====================================================================
        applyToCSS: function () {
            if (typeof document === 'undefined') return;
            const root = document.documentElement;
            if (!root) return;

            // Layout variables
            root.style.setProperty('--l2-v-pos', this.layout.verticalPositionPercent + '%');
            root.style.setProperty('--l2-min-bottom-pad', this.layout.minBottomPaddingPx + 'px');
            root.style.setProperty('--l2-min-top-pad', this.layout.minTopPaddingPx + 'px');
            root.style.setProperty('--l2-logo-w-desktop', this.layout.logoWidthDesktop + 'px');
            root.style.setProperty('--l2-logo-w-mobile', this.layout.logoWidthMobile + 'px');
            root.style.setProperty('--l2-logo-line-spacing', this.layout.logoToLineSpacing + 'px');
            root.style.setProperty('--l2-line-w-desktop', this.layout.lineWidthDesktop + 'px');
            root.style.setProperty('--l2-line-w-mobile', this.layout.lineWidthMobile + 'px');
            root.style.setProperty('--l2-line-h', this.layout.lineHeight + 'px');

            // Coin variables
            root.style.setProperty('--l2-coin-period', this.coin.rotationPeriod + 's');
            root.style.setProperty('--l2-coin-direction', this.coin.rotationDirection === 'reverse' ? 'reverse' : 'normal');
            root.style.setProperty('--l2-coin-perspective', this.coin.perspective + 'px');
            root.style.setProperty('--l2-rim-thickness', this.coin.rimThickness + 'px');
            root.style.setProperty('--l2-rim-color', this.coin.rimColor);
            root.style.setProperty('--l2-back-brightness', String(this.coin.backsideBrightness));

            // Shine variables
            root.style.setProperty('--l2-shine-duration', this.shine.sweepDuration + 's');
            root.style.setProperty('--l2-shine-interval', (this.shine.sweepDuration + this.shine.sweepInterval) + 's');
            root.style.setProperty('--l2-shine-intensity', String(this.shine.intensity));
            root.style.setProperty('--l2-shine-width', this.shine.beamWidthPercent + '%');
            root.style.setProperty('--l2-shine-angle', this.shine.beamAngle + 'deg');
            root.style.setProperty('--l2-shine-highlight', this.shine.highlightColor);
            root.style.setProperty('--l2-shine-warm-gold', this.shine.warmGoldColor);

            // Line variables
            root.style.setProperty('--l2-line-track', this.line.trackColor);
            root.style.setProperty('--l2-line-start', this.line.progressColorStart);
            root.style.setProperty('--l2-line-end', this.line.progressColorEnd);
            root.style.setProperty('--l2-line-glow-scale', String(this.line.glowIntensity));

            // Top glow variables
            if (this.topGlow) {
                root.style.setProperty('--l2-top-glow-display', this.topGlow.enabled !== false ? 'block' : 'none');
                root.style.setProperty('--l2-top-glow-opacity', String(this.topGlow.opacity ?? 0.40));
                root.style.setProperty('--l2-top-glow-height', typeof this.topGlow.height === 'number' ? (this.topGlow.height + 'px') : (this.topGlow.height || '46vh'));
                root.style.setProperty('--l2-top-glow-width', (this.topGlow.spreadWidthPercent ?? 85) + '%');
                root.style.setProperty('--l2-top-glow-core', String(this.topGlow.coreBrightness ?? 0.35));
                root.style.setProperty('--l2-top-glow-color', this.topGlow.glowColor || 'rgba(255, 205, 80, 0.16)');
                root.style.setProperty('--l2-top-glow-ambient', this.topGlow.ambientColor || 'rgba(215, 150, 30, 0.05)');
                root.style.setProperty('--l2-top-glow-pulse', (this.topGlow.pulseDuration || 4.5) + 's');
            }

            // Transition variables
            root.style.setProperty('--l2-fade-duration', this.transition.fadeOutDuration + 'ms');
        }
    };

    return LOADER2_SETTINGS;
});
