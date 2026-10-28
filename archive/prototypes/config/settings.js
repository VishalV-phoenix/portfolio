/**
 * ============================================================================
 * PORTFOLIO CONFIGURATION SYSTEM
 * Central Settings Control for Visual Effects, Timings & Animation Behaviors
 * ============================================================================
 * 
 * Edit variables in this file to adjust the website's look, timings, speeds,
 * particle densities, and interactions in one single place.
 *
 * All settings are organized into logical sections:
 *  1. LOADER (Map, Route, Footsteps, Destination Flag, Timings)
 *  2. TREE (Canvas, Frames, Scroll scrub duration)
 *  3. PARTICLES (Golden Dust Effect: Density, Colors, Glow, Movement, Cursor)
 *  4. CURSOR TRAIL (Golden Sparkle Custom Cursor: Trail, Spacing, Lifetimes)
 * ============================================================================
 */

(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        define([], factory);
    } else if (typeof module === 'object' && module.exports) {
        module.exports = factory();
    } else {
        const settings = factory();
        root.PORTFOLIO_SETTINGS = settings;

        // Automatically synchronize CSS variables to :root on load
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

    const PORTFOLIO_SETTINGS = {

        // ====================================================================
        // 1. MAP LOADER SETTINGS
        // ====================================================================
        loader: {

            // ----------------------------------------------------------------
            // Background Map Artwork
            // ----------------------------------------------------------------
            background: {
                /**
                 * Opacity of the background parchment map image.
                 * Blends against the pure black (#000000) background underneath.
                 * Unit: Normalized ratio (0.0 = completely invisible, 1.0 = full brightness)
                 * Default: 0.4
                 * Suggested range: 0.2 to 0.8
                 */
                opacity: 0.4,
            },

            // ----------------------------------------------------------------
            // Transition & Screen Timing
            // ----------------------------------------------------------------
            timing: {
                /**
                 * Cinematic pause duration after the traveler arrives at the final
                 * destination, allowing the user to see the completed journey and
                 * final blinking footprint before the loader fades away.
                 * Unit: Milliseconds (ms)
                 * Default: 1200
                 * Suggested range: 600 to 2500
                 */
                holdDuration: 1200,

                /**
                 * Duration of the smooth opacity fade-out when transitioning
                 * from the map loader to the Magic Tree section.
                 * Unit: Milliseconds (ms)
                 * Default: 800
                 * Suggested range: 400 to 1600
                 */
                fadeDuration: 800,
            },

            // ----------------------------------------------------------------
            // Footsteps & Walking Trail
            // ----------------------------------------------------------------
            footsteps: {
                /**
                 * Width/scale of each footprint icon dropped along the trail.
                 * Unit: Pixels (px)
                 * Default: 18
                 * Suggested range: 12 to 32
                 */
                size: 18,

                /**
                 * Distance along the route curve between consecutive footprint stamps.
                 * Smaller values = denser footsteps; larger values = more spaced out.
                 * Unit: Pixels (px)
                 * Default: 45
                 * Suggested range: 25 to 80
                 */
                stepDistance: 45,

                /**
                 * Movement speed of the traveler walking along the path.
                 * Higher values = faster walk (shorter loader duration);
                 * Lower values = slower, more contemplative journey.
                 * Unit: Pixels per second (px/s)
                 * Default: 220
                 * Suggested range: 120 to 380
                 */
                walkSpeed: 220,

                /**
                 * Angle adjustment added to the route tangent to align the footprint SVG.
                 * Unit: Degrees (deg)
                 * Default: 90
                 */
                rotationOffset: 90,

                /**
                 * How long a trail footprint stays fully opaque before starting to fade.
                 * Unit: Milliseconds (ms)
                 * Default: 1000
                 * Suggested range: 500 to 3000
                 */
                lifetime: 1000,

                /**
                 * Duration of the fade-out transition for individual trail footsteps.
                 * Unit: Milliseconds (ms)
                 * Default: 1000
                 * Suggested range: 400 to 2000
                 */
                fadeDuration: 1000,

                /**
                 * Offset distance placing the final waiting footprint slightly behind
                 * the destination flag pole.
                 * Unit: Pixels (px)
                 * Default: 28
                 * Suggested range: 15 to 45
                 */
                finalFootprintGap: 28,

                /**
                 * Pulsing cycle duration for the final blinking footprint on the map.
                 * Unit: Seconds (s)
                 * Default: 1.2
                 * Suggested range: 0.8 to 2.5
                 */
                blinkingPeriod: 1.2,
            },

            // ----------------------------------------------------------------
            // Destination Flag Marker
            // ----------------------------------------------------------------
            flag: {
                /**
                 * Display width of the destination flag image.
                 * Unit: Pixels (px)
                 * Default: 220
                 * Suggested range: 140 to 300
                 */
                size: 220,

                /**
                 * Distance offset from the very end of the SVG path where the traveler
                 * concludes the journey.
                 * Unit: Pixels (px)
                 * Default: 98
                 * Suggested range: 50 to 140
                 */
                endOffset: 98,

                /**
                 * Gentle floating animation cycle duration once the flag reaches destination.
                 * Unit: Seconds (s)
                 * Default: 2.2
                 * Suggested range: 1.4 to 4.0
                 */
                floatPeriod: 2.2,
            },

            // ----------------------------------------------------------------
            // Journey SVG Route
            // ----------------------------------------------------------------
            route: {
                /**
                 * Sampling delta distance used to calculate the path tangent angle.
                 * Unit: Pixels (px)
                 * Default: 3
                 */
                sampleRate: 3,

                /**
                 * Stroke line width of the SVG route curve.
                 * Unit: Pixels (px)
                 * Default: 5
                 */
                strokeWidth: 5,
            },
        },


        // ====================================================================
        // 2. MAGIC TREE TIMELAPSE SETTINGS
        // ====================================================================
        tree: {
            /**
                 * Total number of sequence frames in the tree timelapse animation
                 * (ezgif-frame-001.jpg through ezgif-frame-240.jpg).
                 * Unit: Integer count
                 * Default: 240
                 */
            totalFrames: 240,

            /**
             * Total scroll height of the tree section track.
             * Defines how much scroll distance is required to scrub from 0% to 100% growth.
             * Higher values = slower, smoother scrub requiring more scrolling;
             * Lower values = faster, snappier scrub requiring less scrolling.
             * Unit: Viewport height percentage (vh)
             * Default: 500
             * Suggested range: 300 to 800
             */
            scrollTrackHeightVh: 500,

            /**
             * Maximum device pixel ratio (DPR) cap for rendering the canvas.
             * Prevents excessive GPU load and battery drain on high-resolution Retina/4K displays.
             * Unit: Multiplier ratio (e.g. 1.0, 1.5, 2.0)
             * Default: 2
             * Suggested range: 1 to 2
             */
            maxDpr: 2,
        },


        // ====================================================================
        // 3. REUSABLE GOLDEN PARTICLE SYSTEM SETTINGS
        // ====================================================================
        particles: {

            // ----------------------------------------------------------------
            // Particle Quantity & Growth Progression
            // ----------------------------------------------------------------
            quantity: {
                /**
                 * Minimum active particle count when tree is at progress = 0 (Sapling).
                 * Provides a gentle, minimal magical atmosphere.
                 * Unit: Particle count
                 * Default: 18
                 * Suggested range: 8 to 35
                 */
                minParticles: 18,

                /**
                 * Maximum active particle count when tree is at progress = 1.0 (Full Growth)
                 * on desktop viewports (>768px).
                 * Unit: Particle count
                 * Default: 95
                 * Suggested range: 60 to 160
                 */
                maxParticles: 55,

                /**
                 * Maximum active particle count on mobile screens (<=768px)
                 * to preserve smooth 60fps performance and conserve battery life.
                 * Unit: Particle count
                 * Default: 42
                 * Suggested range: 25 to 60
                 */
                mobileMaxParticles: 42,
            },

            // ----------------------------------------------------------------
            // Appearance, Colors & Glow
            // ----------------------------------------------------------------
            appearance: {
                /**
                 * Color palette for floating dust and embers in RGB format.
                 * Includes warm gold, muted amber, soft ivory, and deep goldenrod.
                 */
                colors: [
                    { r: 255, g: 204, b: 102 }, // Warm Gold (#FFCC66)
                    { r: 240, g: 168, b: 48 },  // Muted Amber (#F0A830)
                    { r: 255, g: 245, b: 220 }, // Soft Ivory (#FFF5DC)
                    { r: 230, g: 184, b: 0 }    // Deep Goldenrod (#E6B800)
                ],

                /**
                 * Radius range for typical ambient dust particles.
                 * Unit: Pixels (px)
                 */
                sizeMin: 1.0,
                sizeMax: 2.7,

                /**
                 * Probability (fraction from 0 to 1) of spawning a slightly larger ember.
                 * Default: 0.12 (12% of particles)
                 * Suggested range: 0.05 to 0.25
                 */
                largeEmberChance: 0.12,

                /**
                 * Radius range for larger magical embers.
                 * Unit: Pixels (px)
                 */
                largeEmberSizeMin: 2.2,
                largeEmberSizeMax: 3.0,

                /**
                 * Base opacity range for particles.
                 * Higher values = brighter, more prominent dust;
                 * Lower values = softer, more ethereal atmosphere.
                 */
                alphaMin: 0.25,
                alphaMax: 1.0,

                /**
                 * Outer glow halo radius multiplier relative to particle core size.
                 * Default: 2.2
                 * Suggested range: 1.5 to 3.5
                 */
                haloGlowScale: 2.5,

                /**
                 * Opacity factor for the soft outer glow halo.
                 * Default: 0.18
                 * Suggested range: 0.08 to 0.35
                 */
                haloGlowAlpha: 0.18,
            },

            // ----------------------------------------------------------------
            // Movement & Organic Drift
            // ----------------------------------------------------------------
            movement: {
                /**
                 * Master speed multiplier for ambient upward drift and floating sway.
                 * Increase for faster, more energetic embers; decrease for slow, calm floating.
                 * Unit: Multiplier factor
                 * Default: 0.9
                 * Suggested range: 0.4 to 2.0
                 */
                speed: 0.9,

                /**
                 * Speed of smooth alpha transitions when particles fade in/out during scrolling.
                 * Higher values = faster response to scroll; Lower values = smoother transitions.
                 * Default: 0.06
                 * Suggested range: 0.03 to 0.15
                 */
                alphaFadeSpeed: 0.16,

                /**
                 * Velocity recovery rate restoring particles to their ambient trajectory
                 * after being displaced by the cursor breeze.
                 * Default: 0.05
                 * Suggested range: 0.02 to 0.12
                 */
                velocityDamping: 0.05,
            },

            // ----------------------------------------------------------------
            // Cursor Interaction (Gentle Breeze)
            // ----------------------------------------------------------------
            cursor: {
                /**
                 * Whether particles subtly react and drift away from the mouse cursor.
                 * Automatically disabled on touch screens to conserve performance.
                 * Default: true
                 */
                enabled: true,

                /**
                 * Effective radius of the cursor's gentle breeze influence.
                 * Unit: Pixels (px)
                 * Default: 140
                 * Suggested range: 80 to 240
                 */
                radius: 140,

                /**
                 * Force of displacement pushing nearby particles away from the cursor.
                 * Higher values = stronger breeze; Lower values = very subtle drift.
                 * Default: 0.55
                 * Suggested range: 0.2 to 1.2
                 */
                strength: 0.55,
            },

            // ----------------------------------------------------------------
            // Performance Optimizations
            // ----------------------------------------------------------------
            performance: {
                /**
                 * Automatically pauses the animation loop when the browser tab is hidden
                 * (using the Page Visibility API) to eliminate CPU/GPU usage in background.
                 * Default: true
                 */
                pauseWhenHidden: true,

                /**
                 * Maximum device pixel ratio (DPR) cap for the particle canvas.
                 * Default: 2
                 */
                maxDpr: 2,
            },
        },


        // ====================================================================
        // 4. GOLDEN SPARKLE CURSOR TRAIL SETTINGS
        // ====================================================================
        cursorTrail: {
            /**
             * Master switch to enable or disable the custom cursor trail.
             * Default: false (enabled on loader2 first; can be enabled portfolio-wide here)
             */
            enabled: false,

            /**
             * Whether to hide the native OS cursor within the active target area.
             * When true, only the golden dust sparkles appear when moving.
             * When movement stops, the cursor becomes completely invisible.
             * Default: true
             */
            hideNativeCursor: true,

            /**
             * CSS selector or DOM element where the custom cursor is active.
             * Examples: '.loader2-wrapper', '#tree-section', 'body'.
             * Default: 'body'
             */
            targetArea: 'body',

            /**
             * Distance in pixels the cursor must travel between consecutive particle emissions.
             * Smaller values = denser, continuous trail; Larger values = sparser trail.
             * Unit: Pixels (px)
             * Default: 6
             * Suggested range: 3 to 12
             */
            particleSpacing: 6,

            /**
             * Maximum number of simultaneous active particles allowed on screen.
             * Hard cap to maintain smooth 60fps performance during rapid mouse sweeps.
             * Default: 120
             * Suggested range: 60 to 200
             */
            maxParticles: 120,

            /**
             * Minimum particle radius in pixels.
             * Unit: Pixels (px)
             * Default: 0.9
             * Suggested range: 0.6 to 1.5
             */
            sizeMin: 0.9,

            /**
             * Maximum particle radius in pixels.
             * Unit: Pixels (px)
             * Default: 2.4
             * Suggested range: 1.8 to 3.5
             */
            sizeMax: 2.4,

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
            lifespanMax: 0.75,

            /**
             * Initial movement spread and buoyancy parameters.
             */
            movement: {
                /**
                 * Minimum initial outward velocity in pixels per second.
                 * Default: 10
                 * Suggested range: 6 to 18
                 */
                speedMin: 10,

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
            glowIntensity: 1.0,

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
        },

        // ====================================================================
        // 5. MAGIC CIRCLE INTERACTION SETTINGS
        // ====================================================================
        magicCircle: {
            /**
             * Horizontal activation range measured as a percentage of viewport width from the left edge (0 to 100).
             * Moving the cursor anywhere within the leftmost 60% of the screen allows the magic circle interaction.
             * Unit: Percentage (0 - 100)
             * Default: 60 (covers ~60% of the viewport width from the left edge)
             * Suggested range: 40 to 80
             */
            activationWidthPercent: 60,

            /**
             * Vertical center alignment of the activation hotspot.
             * Unit: Percentage (0 - 100)
             * Default: 48
             */
            hotspotYPercent: 48,

            /**
             * Horizontal anchor position for the portal origin.
             * Unit: Percentage (0 - 100)
             * Default: 14
             */
            hotspotXPercent: 14,

            /**
             * Snap distance in pixels to complete the circle.
             * Unit: Pixels (px)
             * Default: 36
             */
            triggerSnapRadius: 36,
        },

        // ====================================================================
        // HELPER: APPLY SETTINGS TO CSS CUSTOM PROPERTIES
        // ====================================================================
        /**
         * Pushes relevant configuration values to CSS custom properties on :root
         * so both CSS and JavaScript stay synchronized from this single file.
         */
        applyToCSS: function () {
            if (typeof document === 'undefined') return;

            const root = document.documentElement;
            if (!root) return;

            // Map loader CSS variables
            root.style.setProperty('--map-opacity', String(this.loader.background.opacity));
            root.style.setProperty('--loader-fade-duration', this.loader.timing.fadeDuration + 'ms');
            root.style.setProperty('--footprint-size', this.loader.footsteps.size + 'px');
            root.style.setProperty('--footprint-fade-duration', this.loader.footsteps.fadeDuration + 'ms');
            root.style.setProperty('--final-footprint-blink-period', this.loader.footsteps.blinkingPeriod + 's');
            root.style.setProperty('--final-flag-float-period', this.loader.flag.floatPeriod + 's');

            // Tree CSS variables
            root.style.setProperty('--tree-track-height', this.tree.scrollTrackHeightVh + 'vh');
        }
    };

    return PORTFOLIO_SETTINGS;
});
