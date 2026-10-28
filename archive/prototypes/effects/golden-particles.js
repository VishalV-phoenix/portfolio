/**
 * ============================================================================
 * Golden Particle System (GoldenParticles)
 * Standalone, high-performance ambient magical dust & ember simulation.
 *
 * Designed for dark aesthetic portfolios, canvas overlays, and scroll-linked
 * progression effects with subtle cursor-breeze reactivity.
 * ============================================================================
 */

(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        define([], factory);
    } else if (typeof module === 'object' && module.exports) {
        module.exports = factory();
    } else {
        root.GoldenParticleSystem = factory();
    }
})(typeof self !== 'undefined' ? self : this, function () {
    'use strict';

    // Default warm golden forest palette
    const DEFAULT_COLORS = [
        { r: 255, g: 204, b: 102 }, // warm gold (#ffcc66)
        { r: 240, g: 168, b: 48 },  // muted amber (#f0a830)
        { r: 255, g: 245, b: 220 }, // soft ivory (#fff5dc)
        { r: 230, g: 184, b: 0 }    // deep goldenrod (#e6b800)
    ];

    class GoldenParticleSystem {
        /**
         * @param {Object} options Configuration options
         * @param {HTMLElement} [options.container] - Parent element to append canvas into
         * @param {HTMLCanvasElement} [options.canvas] - Existing canvas to use (optional)
         * @param {number} [options.minParticles=18] - Base particle count at progress = 0 (sapling)
         * @param {number} [options.maxParticles=95] - Peak particle count at progress = 1 (desktop)
         * @param {number} [options.mobileMaxParticles=42] - Peak particle count on mobile viewports (<=768px)
         * @param {Array<{r:number,g:number,b:number}>} [options.colors] - Array of RGB color objects
         * @param {number} [options.speed=1.0] - Speed factor for ambient organic drift
         * @param {number} [options.breezeRadius=140] - Cursor breeze radius in pixels
         * @param {number} [options.breezeStrength=0.5] - Cursor push strength
         * @param {boolean} [options.enableCursorInteraction=true] - Enable/disable cursor reactivity
         * @param {number} [options.initialProgress=0] - Initial progress value (0 to 1)
         * @param {boolean} [options.autoStart=true] - Automatically start animation loop
         */
        constructor(options = {}) {
            const globalCfg = (typeof PORTFOLIO_SETTINGS !== 'undefined' && PORTFOLIO_SETTINGS.particles)
                ? PORTFOLIO_SETTINGS.particles
                : {};
            const gQty = globalCfg.quantity || {};
            const gApp = globalCfg.appearance || {};
            const gMov = globalCfg.movement || {};
            const gCur = globalCfg.cursor || {};
            const gPerf = globalCfg.performance || {};

            this.options = Object.assign({
                container: null,
                canvas: null,
                minParticles: gQty.minParticles ?? 18,
                maxParticles: gQty.maxParticles ?? 95,
                mobileMaxParticles: gQty.mobileMaxParticles ?? 42,
                colors: gApp.colors || DEFAULT_COLORS,
                speed: gMov.speed ?? 0.9,
                breezeRadius: gCur.radius ?? 140,
                breezeStrength: gCur.strength ?? 0.55,
                enableCursorInteraction: gCur.enabled ?? true,
                initialProgress: 0,
                autoStart: true,
                sizeMin: gApp.sizeMin ?? 0.8,
                sizeMax: gApp.sizeMax ?? 2.1,
                largeEmberChance: gApp.largeEmberChance ?? 0.12,
                largeEmberSizeMin: gApp.largeEmberSizeMin ?? 2.2,
                largeEmberSizeMax: gApp.largeEmberSizeMax ?? 3.0,
                alphaMin: gApp.alphaMin ?? 0.25,
                alphaMax: gApp.alphaMax ?? 0.80,
                haloGlowScale: gApp.haloGlowScale ?? 2.2,
                haloGlowAlpha: gApp.haloGlowAlpha ?? 0.18,
                alphaFadeSpeed: gMov.alphaFadeSpeed ?? 0.06,
                velocityDamping: gMov.velocityDamping ?? 0.05,
                maxDpr: gPerf.maxDpr ?? 2,
                pauseWhenHidden: gPerf.pauseWhenHidden ?? true
            }, options);

            // Setup canvas
            this.isCustomCanvas = !!this.options.canvas;
            this.canvas = this.options.canvas || document.createElement('canvas');
            this.canvas.className = 'golden-particles-canvas';
            this.ctx = this.canvas.getContext('2d', { alpha: true });

            if (!this.isCustomCanvas && this.options.container) {
                this.options.container.appendChild(this.canvas);
            }

            // Dimensions and display ratio
            this.width = 0;
            this.height = 0;
            this.dpr = 1;

            // State
            this.progress = Math.max(0, Math.min(1, this.options.initialProgress || 0));
            this.isRunning = false;
            this.rafId = null;
            this.isMobile = false;

            // Cursor state
            this.cursor = {
                x: -9999,
                y: -9999,
                targetX: -9999,
                targetY: -9999,
                active: false
            };

            // Touch environment detection
            this.isTouchDevice = ('ontouchstart' in window) ||
                (navigator.maxTouchPoints > 0) ||
                (window.matchMedia && window.matchMedia('(hover: none)').matches);

            // Particle pool (fixed size to avoid GC churn)
            this.poolSize = Math.max(this.options.maxParticles, this.options.mobileMaxParticles) + 15;
            this.particles = new Array(this.poolSize);
            this.initParticlePool();

            // Bind handlers
            this._handleResize = this.resize.bind(this);
            this._handleMouseMove = this._onMouseMove.bind(this);
            this._handleMouseLeave = this._onMouseLeave.bind(this);
            this._handleVisibilityChange = this._onVisibilityChange.bind(this);
            this._tick = this._tick.bind(this);

            // Register event listeners
            window.addEventListener('resize', this._handleResize, { passive: true });
            window.addEventListener('orientationchange', this._handleResize, { passive: true });
            document.addEventListener('visibilitychange', this._handleVisibilityChange);

            if (this.options.enableCursorInteraction && !this.isTouchDevice) {
                window.addEventListener('mousemove', this._handleMouseMove, { passive: true });
                window.addEventListener('mouseleave', this._handleMouseLeave, { passive: true });
            }

            // Initial sizing
            this.resize();
            this.updateTargetDensity();

            if (this.options.autoStart) {
                this.start();
            }
        }

        /**
         * Pre-allocate fixed particle pool for 60fps rendering without GC pauses
         */
        initParticlePool() {
            const colors = this.options.colors && this.options.colors.length > 0
                ? this.options.colors
                : DEFAULT_COLORS;

            for (let i = 0; i < this.poolSize; i++) {
                const color = colors[Math.floor(Math.random() * colors.length)];
                // Sizes: mostly tiny dust, occasional embers
                const isLarge = Math.random() < this.options.largeEmberChance;
                const size = isLarge
                    ? this.options.largeEmberSizeMin + Math.random() * (this.options.largeEmberSizeMax - this.options.largeEmberSizeMin)
                    : this.options.sizeMin + Math.random() * (this.options.sizeMax - this.options.sizeMin);

                // Base opacity
                const baseAlpha = isLarge
                    ? 0.4 + Math.random() * 0.35
                    : this.options.alphaMin + Math.random() * (this.options.alphaMax - this.options.alphaMin);

                this.particles[i] = {
                    x: Math.random() * (this.width || 1000),
                    y: Math.random() * (this.height || 1000),
                    vx: 0,
                    vy: 0,
                    // Ambient drift (gentle upward float + subtle sideways sway)
                    baseVx: (Math.random() - 0.5) * 0.25 * this.options.speed,
                    baseVy: (-0.18 - Math.random() * 0.35) * this.options.speed,
                    size: size,
                    baseAlpha: baseAlpha,
                    currentAlpha: 0,
                    targetAlpha: 0,
                    color: color,
                    twinklePhase: Math.random() * Math.PI * 2,
                    twinkleSpeed: 0.015 + Math.random() * 0.035,
                    active: false
                };
            }
        }

        /**
         * Re-align particle when wrapping across boundaries
         */
        _recycleParticle(p, fromBottom = true) {
            p.x = Math.random() * this.width;
            p.y = fromBottom
                ? this.height + 5 + Math.random() * 15
                : Math.random() * this.height;
            p.vx = 0;
            p.vy = 0;
            p.baseVx = (Math.random() - 0.5) * 0.25 * this.options.speed;
            p.baseVy = (-0.18 - Math.random() * 0.35) * this.options.speed;
            p.twinklePhase = Math.random() * Math.PI * 2;
        }

        /**
         * Update particle active counts based on current progress & viewport
         */
        updateTargetDensity() {
            this.isMobile = (window.innerWidth || this.width) <= 768;
            const maxCount = this.isMobile
                ? this.options.mobileMaxParticles
                : this.options.maxParticles;
            const minCount = Math.min(this.options.minParticles, maxCount);

            // Interpolate target active particles based on growth progress [0, 1]
            const targetCount = Math.round(minCount + this.progress * (maxCount - minCount));

            for (let i = 0; i < this.poolSize; i++) {
                const p = this.particles[i];
                if (i < targetCount) {
                    p.targetAlpha = p.baseAlpha;
                    if (!p.active) {
                        p.active = true;
                        // Stagger initial activation position
                        if (p.currentAlpha === 0 && Math.random() > 0.4) {
                            p.x = Math.random() * this.width;
                            p.y = Math.random() * this.height;
                        }
                    }
                } else {
                    p.targetAlpha = 0;
                }
            }
        }

        /**
         * Set current tree growth / effect progress (0 to 1)
         * @param {number} value - Normalized progress between 0 and 1
         */
        setProgress(value) {
            const clamped = Math.max(0, Math.min(1, Number(value) || 0));
            if (this.progress !== clamped) {
                this.progress = clamped;
                this.updateTargetDensity();
            }
        }

        /**
         * Alias for setProgress
         * @param {number} value
         */
        setIntensity(value) {
            this.setProgress(value);
        }

        /**
         * Dynamic options update
         * @param {Object} newOptions
         */
        setOptions(newOptions = {}) {
            Object.assign(this.options, newOptions);
            this.updateTargetDensity();
        }

        /**
         * Resize canvas respecting DPR
         */
        resize() {
            if (!this.canvas) return;

            const rect = this.canvas.parentElement
                ? this.canvas.parentElement.getBoundingClientRect()
                : { width: window.innerWidth, height: window.innerHeight };

            this.width = Math.max(1, Math.floor(rect.width || window.innerWidth));
            this.height = Math.max(1, Math.floor(rect.height || window.innerHeight));
            this.dpr = Math.min(window.devicePixelRatio || 1, this.options.maxDpr || 2);

            const targetCanvasWidth = Math.floor(this.width * this.dpr);
            const targetCanvasHeight = Math.floor(this.height * this.dpr);

            if (this.canvas.width !== targetCanvasWidth || this.canvas.height !== targetCanvasHeight) {
                this.canvas.width = targetCanvasWidth;
                this.canvas.height = targetCanvasHeight;
            }

            this.updateTargetDensity();
        }

        /**
         * Cursor movement listener
         */
        _onMouseMove(e) {
            if (!this.options.enableCursorInteraction || this.isTouchDevice) return;

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

        /**
         * Cursor leave listener
         */
        _onMouseLeave() {
            this.cursor.active = false;
        }

        /**
         * Pause animation loop when tab is hidden to save battery & CPU
         */
        _onVisibilityChange() {
            if (this.options.pauseWhenHidden) {
                if (document.hidden) {
                    this.stop();
                } else if (this.options.autoStart) {
                    this.start();
                }
            }
        }

        /**
         * Start animation loop
         */
        start() {
            if (!this.isRunning) {
                this.isRunning = true;
                this.rafId = requestAnimationFrame(this._tick);
            }
        }

        /**
         * Stop animation loop
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
         * Main frame loop
         */
        _tick() {
            if (!this.isRunning) return;

            // Smooth cursor easing
            if (this.cursor.active) {
                this.cursor.x += (this.cursor.targetX - this.cursor.x) * 0.2;
                this.cursor.y += (this.cursor.targetY - this.cursor.y) * 0.2;
            } else {
                this.cursor.x = -9999;
                this.cursor.y = -9999;
            }

            this.updateAndRender();
            this.rafId = requestAnimationFrame(this._tick);
        }

        /**
         * Update simulation and render particles onto canvas
         */
        updateAndRender() {
            const ctx = this.ctx;
            if (!ctx) return;

            // Clear frame
            ctx.save();
            ctx.scale(this.dpr, this.dpr);
            ctx.clearRect(0, 0, this.width, this.height);

            const breezeRadius = this.options.breezeRadius;
            const breezeRadiusSq = breezeRadius * breezeRadius;
            const breezeStrength = this.options.breezeStrength;
            const cursorActive = this.cursor.active && this.options.enableCursorInteraction && !this.isTouchDevice;
            const cx = this.cursor.x;
            const cy = this.cursor.y;

            for (let i = 0; i < this.poolSize; i++) {
                const p = this.particles[i];

                // Smoothly fade particle alpha toward target (fade in or fade out)
                if (p.currentAlpha !== p.targetAlpha) {
                    p.currentAlpha += (p.targetAlpha - p.currentAlpha) * this.options.alphaFadeSpeed;
                    if (p.targetAlpha === 0 && p.currentAlpha < 0.005) {
                        p.currentAlpha = 0;
                        p.active = false;
                    }
                }

                // Skip drawing fully dormant particles
                if (p.currentAlpha <= 0.001) continue;

                // Organic pulsation & sway
                p.twinklePhase += p.twinkleSpeed;
                const sway = Math.sin(p.twinklePhase) * 0.2;

                // Cursor breeze displacement
                if (cursorActive) {
                    const dx = p.x - cx;
                    const dy = p.y - cy;
                    const distSq = dx * dx + dy * dy;

                    if (distSq < breezeRadiusSq && distSq > 1) {
                        const dist = Math.sqrt(distSq);
                        // Soft falloff curve (smoothstep-like)
                        const normDist = dist / breezeRadius;
                        const force = (1 - normDist) * (1 - normDist) * breezeStrength;

                        p.vx += (dx / dist) * force * 1.2;
                        p.vy += (dy / dist) * force * 1.2;
                    }
                }

                // Damping towards base ambient trajectory
                p.vx += (p.baseVx + sway - p.vx) * this.options.velocityDamping;
                p.vy += (p.baseVy - p.vy) * this.options.velocityDamping;

                // Integrate position
                p.x += p.vx;
                p.y += p.vy;

                // Screen edge wrap
                if (p.y < -12) {
                    this._recycleParticle(p, true);
                } else if (p.y > this.height + 15) {
                    p.y = -5;
                }
                if (p.x < -15) {
                    p.x = this.width + 10;
                } else if (p.x > this.width + 15) {
                    p.x = -10;
                }

                // Render glowing dust
                // Subtle twinkle factor (0.75 to 1.0)
                const twinkle = 0.8 + 0.2 * Math.sin(p.twinklePhase * 1.5);
                const renderAlpha = Math.max(0, Math.min(1, p.currentAlpha * twinkle));

                // 1. Soft outer halo for organic golden glow
                if (p.size > 1.2 && renderAlpha > 0.25) {
                    ctx.beginPath();
                    ctx.arc(p.x, p.y, p.size * this.options.haloGlowScale, 0, Math.PI * 2);
                    ctx.fillStyle = `rgba(${p.color.r}, ${p.color.g}, ${p.color.b}, ${renderAlpha * this.options.haloGlowAlpha})`;
                    ctx.fill();
                }

                // 2. Crisp dust core
                ctx.beginPath();
                ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(${p.color.r}, ${p.color.g}, ${p.color.b}, ${renderAlpha})`;
                ctx.fill();
            }

            ctx.restore();
        }

        /**
         * Clean up all event listeners, canvas, and animation frame
         */
        destroy() {
            this.stop();

            window.removeEventListener('resize', this._handleResize);
            window.removeEventListener('orientationchange', this._handleResize);
            document.removeEventListener('visibilitychange', this._handleVisibilityChange);
            window.removeEventListener('mousemove', this._handleMouseMove);
            window.removeEventListener('mouseleave', this._handleMouseLeave);

            if (!this.isCustomCanvas && this.canvas && this.canvas.parentElement) {
                this.canvas.parentElement.removeChild(this.canvas);
            }

            this.particles = [];
            this.ctx = null;
            this.canvas = null;
        }
    }

    return GoldenParticleSystem;
});
