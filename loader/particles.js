/**
 * ============================================================================
 * PHOENIX V LOADER (LOADER2) - CASCADING PARTICLES MODULE
 * ============================================================================
 *
 * Implements golden particles cascading down from the top of the viewport:
 * - ~10 particles already visible and gently floating across the screen immediately
 *   upon open so the screen never feels empty at launch.
 * - Initially ~5 particles start coming down from the top.
 * - The cascade rate and density increase gradually with time up to ~90 particles.
 * - Each particle fades smoothly with time, with lifetime and fade duration
 *   depending directly on particle size and peak brightness.
 * - Cursor breeze interactivity is preserved without touching the cursor trail.
 *
 * All settings are configured in LOADER2_SETTINGS.particles (settings.js).
 *
 * Exposes: window.Loader2Particles
 *   .init()        — start the particle simulation
 *   .destroy()     — stop and remove canvas
 *   .reset()       — restart simulation afresh
 *   .setProgress() — adjust target density dynamically based on progress
 *   .getInstance() — return the underlying engine instance
 * ============================================================================
 */

(function () {
    'use strict';

    // Default warm golden color palette (fallback if not in settings)
    const DEFAULT_COLORS = [
        { r: 255, g: 215, b: 0 },    // Pure Gold
        { r: 255, g: 180, b: 30 },   // Warm Amber-Gold
        { r: 255, g: 200, b: 60 },   // Bright Golden-Yellow
        { r: 240, g: 155, b: 15 },   // Deep Amber
    ];

    class Loader2CascadingParticleSystem {
        constructor(options = {}) {
            const rawCfg = (typeof LOADER2_SETTINGS !== 'undefined' && LOADER2_SETTINGS.particles)
                ? LOADER2_SETTINGS.particles
                : {};

            this.options = Object.assign({
                container: document.getElementById('loader2Particles'),

                // Quantity & ramp
                initialFloatingCount: rawCfg.initialFloatingCount ?? 10,
                initialFallingCount:  rawCfg.initialFallingCount  ?? rawCfg.initialCount ?? rawCfg.minParticles ?? 5,
                countDesktop:         rawCfg.countDesktop         ?? 90,
                countMobile:          rawCfg.countMobile          ?? 45,
                rampDuration:         rawCfg.rampDuration         ?? 5000,
                spawnIntervalInitial: rawCfg.spawnIntervalInitial ?? 320,
                spawnIntervalMin:     rawCfg.spawnIntervalMin     ?? 45,

                // Origin & motion
                spawnFromTop: rawCfg.spawnFromTop !== false,
                fallSpeed:    rawCfg.fallSpeed    ?? 0.50,
                swayAmount:   rawCfg.swayAmount   ?? 0.50,
                speed:        rawCfg.speed        ?? 0.75,

                // Lifespan & fade
                baseLifespan:            rawCfg.baseLifespan            ?? 4200,
                fadeBySizeAndBrightness: rawCfg.fadeBySizeAndBrightness !== false,

                // Size
                sizeMin:           rawCfg.sizeMin           ?? 1.2,
                sizeMax:           rawCfg.sizeMax           ?? 2.8,
                largeEmberChance:  rawCfg.largeEmberChance  ?? 0.15,
                largeEmberSizeMin: rawCfg.largeEmberSizeMin ?? 3.2,
                largeEmberSizeMax: rawCfg.largeEmberSizeMax ?? 4.8,

                // Brightness & halo
                alphaMin:      rawCfg.alphaMin      ?? 0.35,
                alphaMax:      rawCfg.alphaMax      ?? 0.90,
                haloGlowScale: rawCfg.haloGlowScale ?? 2.8,
                haloGlowAlpha: rawCfg.haloGlowAlpha ?? 0.20,

                // Palette
                colors: (rawCfg.colors && rawCfg.colors.length > 0) ? rawCfg.colors : DEFAULT_COLORS,

                // Cursor breeze
                enableCursorInteraction: rawCfg.enableCursorInteraction !== false,
                breezeRadius:            rawCfg.breezeRadius            ?? 140,
                breezeStrength:          rawCfg.breezeStrength          ?? 0.40,
                velocityDamping:         rawCfg.velocityDamping         ?? 0.05,

                // Performance
                pauseWhenHidden: rawCfg.pauseWhenHidden !== false,
                maxDpr:          rawCfg.maxDpr          ?? 2
            }, options);

            // Container & Canvas
            this.container = this.options.container || document.body;
            this.canvas = document.createElement('canvas');
            this.canvas.className = 'golden-particles-canvas';
            this.ctx = this.canvas.getContext('2d', { alpha: true });
            this.container.appendChild(this.canvas);

            // Dimensions
            this.width = 0;
            this.height = 0;
            this.dpr = 1;
            this.isMobile = false;

            // Loop state
            this.isRunning = false;
            this.rafId = null;
            this.startTime = 0;
            this.lastFrameTime = 0;
            this.lastSpawnTime = 0;
            this.externalProgress = 0;

            // Cursor state
            this.cursor = {
                x: -9999,
                y: -9999,
                targetX: -9999,
                targetY: -9999,
                active: false
            };
            this.isTouchDevice = ('ontouchstart' in window) ||
                (navigator.maxTouchPoints > 0) ||
                (window.matchMedia && window.matchMedia('(hover: none)').matches);

            // Particle Pool (Pre-allocated for zero GC allocations during RAF)
            this.maxPoolSize = Math.max(this.options.countDesktop, this.options.countMobile) + 35;
            this.particles = new Array(this.maxPoolSize);
            this._initPool();

            // Bindings
            this._handleResize = this.resize.bind(this);
            this._handleMouseMove = this._onMouseMove.bind(this);
            this._handleMouseLeave = this._onMouseLeave.bind(this);
            this._handleVisibility = this._onVisibilityChange.bind(this);
            this._tick = this._tick.bind(this);

            // Event listeners
            window.addEventListener('resize', this._handleResize, { passive: true });
            window.addEventListener('orientationchange', this._handleResize, { passive: true });
            document.addEventListener('visibilitychange', this._handleVisibility);

            if (this.options.enableCursorInteraction && !this.isTouchDevice) {
                window.addEventListener('mousemove', this._handleMouseMove, { passive: true });
                window.addEventListener('mouseleave', this._handleMouseLeave, { passive: true });
            }

            this.resize();
            this.start();
        }

        /**
         * Pre-allocate blank particle records
         */
        _initPool() {
            for (let i = 0; i < this.maxPoolSize; i++) {
                this.particles[i] = {
                    active: false,
                    isFloating: false,
                    x: 0,
                    y: 0,
                    vx: 0,
                    vy: 0,
                    baseVy: 0,
                    size: 1.5,
                    peakAlpha: 0.8,
                    color: DEFAULT_COLORS[0],
                    age: 0,
                    lifetime: 4000,
                    swayPhase: 0,
                    swaySpeed: 0.02,
                    swayWidth: 0.3
                };
            }
        }

        /**
         * Spawn an initial ambient floating particle already distributed across the screen
         * so the screen never looks pitch-black or empty upon open.
         */
        _spawnFloatingParticle(p) {
            const colors = this.options.colors;
            const color = colors[Math.floor(Math.random() * colors.length)];

            const isLarge = Math.random() < this.options.largeEmberChance;
            const size = isLarge
                ? this.options.largeEmberSizeMin + Math.random() * (this.options.largeEmberSizeMax - this.options.largeEmberSizeMin)
                : this.options.sizeMin + Math.random() * (this.options.sizeMax - this.options.sizeMin);

            const peakAlpha = isLarge
                ? Math.min(1.0, 0.70 + Math.random() * 0.28)
                : this.options.alphaMin + Math.random() * (this.options.alphaMax - this.options.alphaMin);

            const speedScale = this.options.fallSpeed * this.options.speed;
            const vy = (0.25 + Math.random() * 0.35) * speedScale;

            // Calibrated lifetime so floating particles linger and drift gracefully
            const effectiveBaseLifespan = Math.max(9000, (this.options.baseLifespan * 0.85) / Math.max(0.25, this.options.fallSpeed));
            let lifetime = effectiveBaseLifespan;
            if (this.options.fadeBySizeAndBrightness) {
                const sizeSpan = Math.max(0.1, this.options.sizeMax - this.options.sizeMin);
                const sizeNorm = Math.min(1.5, Math.max(0, (size - this.options.sizeMin) / sizeSpan));
                const alphaSpan = Math.max(0.1, this.options.alphaMax - this.options.alphaMin);
                const alphaNorm = Math.min(1.2, Math.max(0, (peakAlpha - this.options.alphaMin) / alphaSpan));
                const lifeFactor = 0.75 + (0.45 * sizeNorm) + (0.35 * alphaNorm);
                lifetime = Math.round(effectiveBaseLifespan * lifeFactor);
            }

            p.active = true;
            p.isFloating = true;
            p.x = 0.05 * (this.width || window.innerWidth) + Math.random() * 0.90 * (this.width || window.innerWidth);
            // Distributed across the screen from 12% to 85% height
            p.y = 0.12 * (this.height || window.innerHeight) + Math.random() * 0.73 * (this.height || window.innerHeight);
            p.vx = (Math.random() - 0.5) * 0.20;
            p.vy = vy;
            p.baseVy = vy;
            p.size = size;
            p.peakAlpha = peakAlpha;
            p.color = color;
            p.lifetime = lifetime;
            // Age starts at 15% - 25% so they are already at full radiant glow immediately
            p.age = p.lifetime * (0.15 + Math.random() * 0.10);
            p.swayPhase = Math.random() * Math.PI * 2;
            p.swaySpeed = 0.012 + Math.random() * 0.020;
            p.swayWidth = (0.25 + Math.random() * 0.45) * this.options.swayAmount;
        }

        /**
         * Spawn or re-spawn a single particle at the top of the viewport
         */
        _spawnParticleAtTop(p, staggerY = true) {
            const colors = this.options.colors;
            const color = colors[Math.floor(Math.random() * colors.length)];

            // Size determination
            const isLarge = Math.random() < this.options.largeEmberChance;
            const size = isLarge
                ? this.options.largeEmberSizeMin + Math.random() * (this.options.largeEmberSizeMax - this.options.largeEmberSizeMin)
                : this.options.sizeMin + Math.random() * (this.options.sizeMax - this.options.sizeMin);

            // Peak brightness
            const peakAlpha = isLarge
                ? Math.min(1.0, 0.70 + Math.random() * 0.28)
                : this.options.alphaMin + Math.random() * (this.options.alphaMax - this.options.alphaMin);

            const speedScale = this.options.fallSpeed * this.options.speed;
            const vy = (0.65 + Math.random() * 0.75 + (isLarge ? 0.25 : 0)) * speedScale;

            // Lifespan calculation calibrated to fall speed
            const effectiveBaseLifespan = Math.max(8000, (this.options.baseLifespan * 0.85) / Math.max(0.25, this.options.fallSpeed));
            let lifetime = effectiveBaseLifespan;
            if (this.options.fadeBySizeAndBrightness) {
                const sizeSpan = Math.max(0.1, this.options.sizeMax - this.options.sizeMin);
                const sizeNorm = Math.min(1.5, Math.max(0, (size - this.options.sizeMin) / sizeSpan));
                const alphaSpan = Math.max(0.1, this.options.alphaMax - this.options.alphaMin);
                const alphaNorm = Math.min(1.2, Math.max(0, (peakAlpha - this.options.alphaMin) / alphaSpan));
                const lifeFactor = 0.65 + (0.50 * sizeNorm) + (0.40 * alphaNorm);
                lifetime = Math.round(effectiveBaseLifespan * lifeFactor);
            }

            p.active = true;
            p.isFloating = false;
            p.x = Math.random() * (this.width || window.innerWidth);
            p.y = staggerY
                ? -8 - Math.random() * 30
                : -5 - Math.random() * 12;

            p.vx = (Math.random() - 0.5) * 0.25;
            p.vy = vy;
            p.baseVy = vy;
            p.size = size;
            p.peakAlpha = peakAlpha;
            p.color = color;
            p.age = 0;
            p.lifetime = lifetime;
            p.swayPhase = Math.random() * Math.PI * 2;
            p.swaySpeed = 0.015 + Math.random() * 0.025;
            p.swayWidth = (0.25 + Math.random() * 0.5) * this.options.swayAmount;
        }

        /**
         * Initialize the starting wave:
         * 1. ~10 ambient floating particles across the screen (so it's not empty).
         * 2. ~5 particles at the top starting to come down.
         */
        _spawnInitialWave() {
            const floatTarget = Math.min(this.options.initialFloatingCount, this.maxPoolSize);
            for (let i = 0; i < floatTarget; i++) {
                this._spawnFloatingParticle(this.particles[i]);
            }

            const fallTarget = Math.min(this.options.initialFallingCount, this.maxPoolSize - floatTarget);
            for (let j = 0; j < fallTarget; j++) {
                this._spawnParticleAtTop(this.particles[floatTarget + j], true);
            }
        }

        /**
         * Resize canvas to container / window dimensions
         */
        resize() {
            if (!this.canvas) return;

            const rect = this.canvas.parentElement
                ? this.canvas.parentElement.getBoundingClientRect()
                : { width: window.innerWidth, height: window.innerHeight };

            this.width = Math.max(1, Math.floor(rect.width || window.innerWidth));
            this.height = Math.max(1, Math.floor(rect.height || window.innerHeight));
            this.isMobile = (window.innerWidth || this.width) <= 768;

            this.dpr = Math.min(window.devicePixelRatio || 1, this.options.maxDpr || 2);

            const targetWidth = Math.floor(this.width * this.dpr);
            const targetHeight = Math.floor(this.height * this.dpr);

            if (this.canvas.width !== targetWidth || this.canvas.height !== targetHeight) {
                this.canvas.width = targetWidth;
                this.canvas.height = targetHeight;
            }
        }

        /**
         * Cursor movement tracking
         */
        _onMouseMove(e) {
            if (!this.options.enableCursorInteraction || this.isTouchDevice || !this.canvas) return;
            const rect = this.canvas.getBoundingClientRect();
            this.cursor.targetX = e.clientX - rect.left;
            this.cursor.targetY = e.clientY - rect.top;
            this.cursor.active = (
                this.cursor.targetX >= 0 &&
                this.cursor.targetX <= this.width &&
                this.cursor.targetY >= 0 &&
                this.cursor.targetY <= this.height
            );
        }

        _onMouseLeave() {
            this.cursor.active = false;
        }

        _onVisibilityChange() {
            if (this.options.pauseWhenHidden) {
                if (document.hidden) {
                    this.stop();
                } else {
                    this.start();
                }
            }
        }

        /**
         * Start the animation loop
         */
        start() {
            if (!this.isRunning) {
                this.isRunning = true;
                this.startTime = performance.now();
                this.lastFrameTime = performance.now();
                this.lastSpawnTime = performance.now();
                this._spawnInitialWave();
                this.rafId = requestAnimationFrame(this._tick);
            }
        }

        /**
         * Stop the animation loop
         */
        stop() {
            if (this.isRunning) {
                this.isRunning = false;
                if (this.rafId) {
                    cancelAnimationFrame(this.rafId);
                    this.rafId = null;
                }
            }
        }

        /**
         * Reset simulation back to initial state
         */
        reset() {
            for (let i = 0; i < this.maxPoolSize; i++) {
                this.particles[i].active = false;
                this.particles[i].age = 0;
            }
            this.startTime = performance.now();
            this.lastFrameTime = performance.now();
            this.lastSpawnTime = performance.now();
            this._spawnInitialWave();
            if (!this.isRunning) this.start();
        }

        /**
         * Set optional progress fraction (0.0 to 1.0)
         */
        setProgress(fraction) {
            this.externalProgress = Math.max(0, Math.min(1, Number(fraction) || 0));
        }

        /**
         * Calculate target active particle count:
         * Starts at initial total (10 floating + 5 falling = 15) and climbs smoothly up to max count (e.g. 90).
         */
        _getCurrentTargetCount(now) {
            const maxAllowed = this.isMobile
                ? this.options.countMobile
                : this.options.countDesktop;

            const initialTotal = Math.min(
                this.options.initialFloatingCount + this.options.initialFallingCount,
                maxAllowed
            );

            const elapsed = Math.max(0, now - this.startTime);
            const timeProgress = Math.min(1, elapsed / this.options.rampDuration);

            // Progressive curve with a gentle start (power 1.25) so initial increase is gradual
            const rampProgress = Math.max(timeProgress, this.externalProgress);
            const rampFactor = Math.pow(rampProgress, 1.25);

            return {
                targetCount: Math.round(initialTotal + rampFactor * (maxAllowed - initialTotal)),
                rampProgress: rampProgress
            };
        }

        /**
         * Main animation tick
         */
        _tick(now) {
            if (!this.isRunning) return;

            const dt = Math.min(50, Math.max(8, now - this.lastFrameTime));
            this.lastFrameTime = now;

            // Smooth cursor interpolation
            if (this.cursor.active) {
                this.cursor.x += (this.cursor.targetX - this.cursor.x) * 0.2;
                this.cursor.y += (this.cursor.targetY - this.cursor.y) * 0.2;
            } else {
                this.cursor.x = -9999;
                this.cursor.y = -9999;
            }

            this._updateAndRender(dt, now);
            this.rafId = requestAnimationFrame(this._tick);
        }

        /**
         * Simulation step & render
         */
        _updateAndRender(dt, now) {
            const ctx = this.ctx;
            if (!ctx) return;

            // Clear frame
            ctx.save();
            ctx.scale(this.dpr, this.dpr);
            ctx.clearRect(0, 0, this.width, this.height);

            const { targetCount, rampProgress } = this._getCurrentTargetCount(now);

            // Cursor breeze parameters
            const breezeRadius = this.options.breezeRadius;
            const breezeRadiusSq = breezeRadius * breezeRadius;
            const breezeStrength = this.options.breezeStrength;
            const cursorActive = this.cursor.active && this.options.enableCursorInteraction && !this.isTouchDevice;
            const cx = this.cursor.x;
            const cy = this.cursor.y;

            let activeCount = 0;

            // 1. UPDATE AND DRAW EXISTING ACTIVE PARTICLES
            for (let i = 0; i < this.maxPoolSize; i++) {
                const p = this.particles[i];
                if (!p.active) continue;

                p.age += dt;
                const lifeProgress = p.age / p.lifetime;

                // Particle reached end of its life or fell below viewport
                if (lifeProgress >= 1.0 || p.y > this.height + 25) {
                    p.active = false;
                    continue;
                }

                activeCount++;

                // Organic horizontal sway
                p.swayPhase += p.swaySpeed;
                const swayOffset = Math.sin(p.swayPhase) * p.swayWidth;

                // Cursor breeze displacement (gentle lateral push)
                if (cursorActive) {
                    const dx = p.x - cx;
                    const dy = p.y - cy;
                    const distSq = dx * dx + dy * dy;

                    if (distSq < breezeRadiusSq && distSq > 1) {
                        const dist = Math.sqrt(distSq);
                        const norm = (1 - dist / breezeRadius);
                        const force = norm * norm * breezeStrength;

                        p.vx += (dx / dist) * force * 1.2;
                        p.vy += (dy / dist) * force * 0.8;
                    }
                }

                // Smooth velocity damping back towards ambient downward cascade
                p.vx += (swayOffset - p.vx) * this.options.velocityDamping;
                p.vy += (p.baseVy - p.vy) * this.options.velocityDamping;

                // Integrate position
                p.x += p.vx;
                p.y += p.vy;

                // Horizontal screen wrap
                if (p.x < -20) p.x = this.width + 15;
                else if (p.x > this.width + 20) p.x = -15;

                // -------------------------------------------------------------
                // FADE WITH TIME (depending on size & brightness)
                // -------------------------------------------------------------
                let lifeAlpha;
                if (lifeProgress < 0.12) {
                    lifeAlpha = lifeProgress / 0.12;
                } else if (lifeProgress < 0.40) {
                    lifeAlpha = 1.0;
                } else {
                    const fadeNorm = (lifeProgress - 0.40) / 0.60;
                    // Quadratic ease-out curve for soft warm dissipation
                    lifeAlpha = Math.max(0, 1.0 - Math.pow(fadeNorm, 1.35));
                }

                // Micro sparkle / twinkle
                const twinkle = 0.86 + 0.14 * Math.sin(p.swayPhase * 2.2);
                const renderAlpha = Math.max(0, Math.min(1, p.peakAlpha * lifeAlpha * twinkle));

                if (renderAlpha < 0.005) continue;

                // --- 1. Soft Outer Golden Halo Glow ---
                if (p.size > 1.0 && renderAlpha > 0.12) {
                    ctx.beginPath();
                    ctx.arc(p.x, p.y, p.size * this.options.haloGlowScale, 0, Math.PI * 2);
                    ctx.fillStyle = `rgba(${p.color.r}, ${p.color.g}, ${p.color.b}, ${renderAlpha * this.options.haloGlowAlpha})`;
                    ctx.fill();
                }

                // --- 2. Crisp Dust / Ember Core ---
                ctx.beginPath();
                ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(${p.color.r}, ${p.color.g}, ${p.color.b}, ${renderAlpha})`;
                ctx.fill();
            }

            // 2. GRADUAL SPAWN OF NEW CASCADING PARTICLES FROM TOP
            // Spawn interval adapts smoothly: starts slow (e.g. ~320ms) and accelerates as density increases
            const currentInterval = Math.max(
                this.options.spawnIntervalMin,
                this.options.spawnIntervalInitial - rampProgress * (this.options.spawnIntervalInitial - this.options.spawnIntervalMin)
            );

            if (now - this.lastSpawnTime >= currentInterval && activeCount < targetCount) {
                const dormant = this.particles.find(p => !p.active);
                if (dormant) {
                    this._spawnParticleAtTop(dormant, false);
                    this.lastSpawnTime = now;
                }
            }

            ctx.restore();
        }

        /**
         * Clean up all event listeners, canvas, and RAF
         */
        destroy() {
            this.stop();

            window.removeEventListener('resize', this._handleResize);
            window.removeEventListener('orientationchange', this._handleResize);
            document.removeEventListener('visibilitychange', this._handleVisibility);
            window.removeEventListener('mousemove', this._handleMouseMove);
            window.removeEventListener('mouseleave', this._handleMouseLeave);

            if (this.canvas && this.canvas.parentElement) {
                this.canvas.parentElement.removeChild(this.canvas);
            }

            this.particles = [];
            this.ctx = null;
            this.canvas = null;
        }
    }

    // ------------------------------------------------------------------------
    // SINGLETON INSTANCE & PUBLIC API
    // ------------------------------------------------------------------------
    let particleInstance = null;

    function initLoaderParticles() {
        const particleCfg = (typeof LOADER2_SETTINGS !== 'undefined' && LOADER2_SETTINGS.particles)
            ? LOADER2_SETTINGS.particles
            : {};

        if (particleCfg.enabled === false) return;

        if (!particleInstance) {
            particleInstance = new Loader2CascadingParticleSystem();
        } else {
            particleInstance.reset();
        }
    }

    function destroyLoaderParticles() {
        if (particleInstance) {
            particleInstance.destroy();
            particleInstance = null;
        }
    }

    function setProgress(fraction) {
        if (particleInstance) {
            particleInstance.setProgress(fraction);
        }
    }

    window.Loader2Particles = {
        init:        initLoaderParticles,
        destroy:     destroyLoaderParticles,
        reset:       function () { if (particleInstance) particleInstance.reset(); else initLoaderParticles(); },
        setProgress: setProgress,
        getInstance: function () { return particleInstance; }
    };

})();
