/**
 * ============================================================================
 * Golden Sparkle Cursor Effect (GoldenCursorEffect)
 * Standalone, high-performance custom cursor trail producing glowing golden
 * dust and delicate twinkling sparkles along the mouse path.
 *
 * Designed for dark aesthetic portfolios. When the mouse stops, the cursor
 * becomes invisible and existing particles fade away naturally.
 *
 * v2 — Smooth cursor path via exponential interpolation.
 * Particle emission follows the *smoothed* position (updated every RAF frame)
 * using distance-based spacing so the trail stays consistent regardless of
 * mouse-event frequency or speed.
 * ============================================================================
 */

(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        define([], factory);
    } else if (typeof module === 'object' && module.exports) {
        module.exports = factory();
    } else {
        root.GoldenCursorEffect = factory();
    }
})(typeof self !== 'undefined' ? self : this, function () {
    'use strict';

    // Default warm golden color palette
    const DEFAULT_COLORS = [
        { r: 255, g: 215, b: 85 },  // Brilliant Gold (#ffd755)
        { r: 245, g: 175, b: 45 },  // Warm Amber (#f5af2d)
        { r: 255, g: 242, b: 195 }, // Soft Champagne Ivory (#fff2c3)
        { r: 230, g: 155, b: 20 }   // Deep Fiery Goldenrod (#e69b14)
    ];

    class GoldenCursorEffect {
        /**
         * @param {Object} [options] Configuration overrides
         * @param {string|HTMLElement} [options.targetArea] - Selector or element where the cursor is active
         * @param {boolean} [options.enabled=true] - Master toggle
         * @param {boolean} [options.hideNativeCursor=true] - Hide default cursor inside target area
         * @param {number} [options.particleSpacing=6] - Distance (px) traveled per particle emission
         * @param {number} [options.maxParticles=120] - Hard cap on active particles
         * @param {number} [options.sizeMin=0.9] - Minimum particle radius (px)
         * @param {number} [options.sizeMax=2.4] - Maximum particle radius (px)
         * @param {number} [options.lifespanMin=0.45] - Minimum particle lifetime (s)
         * @param {number} [options.lifespanMax=0.75] - Maximum particle lifetime (s)
         * @param {Array<{r:number,g:number,b:number}>} [options.colors] - Array of RGB color objects
         * @param {number} [options.glowIntensity=1.0] - Outer glow halo scale factor
         * @param {number} [options.sparkleChance=0.10] - Probability of bright 4-point cross sparkles
         * @param {Object} [options.movement] - Movement and physics parameters
         * @param {number} [options.smoothing] - Cursor smoothing response time in seconds (0.02 - 0.15)
         */
        constructor(options = {}) {
            // Priority: direct options -> LOADER2_SETTINGS.cursorTrail -> PORTFOLIO_SETTINGS.cursorTrail -> GOLDEN_CURSOR_SETTINGS -> defaults
            const loader2Cfg = (typeof LOADER2_SETTINGS !== 'undefined' && LOADER2_SETTINGS.cursorTrail)
                ? LOADER2_SETTINGS.cursorTrail
                : {};
            const globalCfg = (typeof PORTFOLIO_SETTINGS !== 'undefined' && PORTFOLIO_SETTINGS.cursorTrail)
                ? PORTFOLIO_SETTINGS.cursorTrail
                : {};
            const fallbackCfg = (typeof GOLDEN_CURSOR_SETTINGS !== 'undefined')
                ? GOLDEN_CURSOR_SETTINGS
                : {};

            const merged = Object.assign({}, fallbackCfg, globalCfg, loader2Cfg, options);
            const movCfg = Object.assign({}, fallbackCfg.movement, globalCfg.movement, loader2Cfg.movement, options.movement);

            this.options = {
                enabled: merged.enabled !== false,
                hideNativeCursor: merged.hideNativeCursor !== false,
                targetArea: merged.targetArea || options.target || '.loader2-wrapper',
                particleSpacing: merged.particleSpacing ?? 6,
                maxParticles: merged.maxParticles ?? 120,
                sizeMin: merged.sizeMin ?? 0.9,
                sizeMax: merged.sizeMax ?? 2.4,
                lifespanMin: merged.lifespanMin ?? 0.45,
                lifespanMax: merged.lifespanMax ?? 0.75,
                colors: merged.colors || DEFAULT_COLORS,
                glowIntensity: merged.glowIntensity ?? 1.0,
                sparkleChance: merged.sparkleChance ?? 0.10,
                sparkleCoreColor: merged.sparkleCoreColor || { r: 255, g: 255, b: 235 },
                respectReducedMotion: merged.respectReducedMotion ?? false,
                baseOpacity: merged.baseOpacity ?? 0.90,
                zIndex: merged.zIndex ?? 25,
                /**
                 * Smoothing response time in seconds.
                 * Smaller = snappier (less smooth); larger = more fluid (more lag).
                 * Internally used as the RC time-constant for a first-order low-pass filter:
                 *   alpha = 1 - exp(-dt / smoothing)
                 * Range: 0.02 (instant) to 0.15 (very smooth, noticeable lag)
                 * Default: 0.06
                 */
                smoothing: merged.smoothing ?? 0.06,
                movement: {
                    speedMin: movCfg.speedMin ?? 10,
                    speedMax: movCfg.speedMax ?? 32,
                    buoyancy: movCfg.buoyancy ?? -14,
                    drag: movCfg.drag ?? 0.04
                }
            };

            // Touch screen & reduced motion checks
            this.isTouch = this._checkTouchDevice();
            this.prefersReducedMotion = this._checkReducedMotion();

            this.target = null;
            this.canvas = null;
            this.ctx = null;
            this.width = 0;
            this.height = 0;
            this.dpr = 1;

            this.particles = [];

            // ----------------------------------------------------------------
            // Dual-position tracking:
            //   rawX/rawY   — latest position from mousemove events (noisy)
            //   smoothX/Y   — exponentially smoothed position (updated per RAF)
            //   emitX/Y     — last position where a particle was emitted
            // ----------------------------------------------------------------
            this.rawX = null;
            this.rawY = null;
            this.smoothX = null;
            this.smoothY = null;
            this.emitX = null;
            this.emitY = null;
            this.distAccumulator = 0;

            this.lastMoveTime = 0;
            this.isMoving = false;
            this.isInsideTarget = false;

            this.rafId = null;
            this.isRunning = false;
            this.lastTime = 0;

            // Bound event handlers
            this._handleMouseMove = this._onMouseMove.bind(this);
            this._handleMouseEnter = this._onMouseEnter.bind(this);
            this._handleMouseLeave = this._onMouseLeave.bind(this);
            this._handleResize = this._onResize.bind(this);
            this._handleVisibility = this._onVisibilityChange.bind(this);

            if (this.options.enabled && !this.isTouch && !this.prefersReducedMotion) {
                this.init();
            }
        }

        _checkTouchDevice() {
            if (typeof window === 'undefined') return true;
            return (
                'ontouchstart' in window ||
                (navigator.maxTouchPoints && navigator.maxTouchPoints > 0) ||
                (window.matchMedia && window.matchMedia('(pointer: coarse)').matches)
            );
        }

        _checkReducedMotion() {
            if (!this.options.respectReducedMotion) return false;
            if (typeof window === 'undefined') return false;
            return (
                window.matchMedia &&
                window.matchMedia('(prefers-reduced-motion: reduce)').matches
            );
        }

        init() {
            this.target = typeof this.options.targetArea === 'string'
                ? document.querySelector(this.options.targetArea)
                : this.options.targetArea;

            if (!this.target) {
                this.target = document.body;
            }

            if (!this.target) return;

            // Create canvas
            this.canvas = document.createElement('canvas');
            this.canvas.className = 'golden-cursor-canvas';
            this.canvas.style.zIndex = String(this.options.zIndex || 25);
            this.ctx = this.canvas.getContext('2d', { alpha: true });

            // Apply native cursor hiding to target if configured
            if (this.options.hideNativeCursor) {
                this.target.classList.add('golden-cursor-active');
            }

            // Mount canvas inside target
            if (getComputedStyle(this.target).position === 'static') {
                this.target.style.position = 'relative';
            }
            this.target.appendChild(this.canvas);

            this._onResize();

            // Bind events
            window.addEventListener('resize', this._handleResize, { passive: true });
            window.addEventListener('orientationchange', this._handleResize, { passive: true });
            document.addEventListener('visibilitychange', this._handleVisibility);

            this.target.addEventListener('mousemove', this._handleMouseMove, { passive: true });
            this.target.addEventListener('mouseenter', this._handleMouseEnter, { passive: true });
            this.target.addEventListener('mouseleave', this._handleMouseLeave, { passive: true });
        }

        _onResize() {
            if (!this.canvas || !this.target) return;

            const rect = this.target.getBoundingClientRect();
            const w = rect.width || window.innerWidth || 1000;
            const h = rect.height || window.innerHeight || 800;

            this.width = w;
            this.height = h;
            this.dpr = Math.min(window.devicePixelRatio || 1, 2);

            const targetW = Math.floor(w * this.dpr);
            const targetH = Math.floor(h * this.dpr);

            if (this.canvas.width !== targetW || this.canvas.height !== targetH) {
                this.canvas.width = targetW;
                this.canvas.height = targetH;
            }
        }

        _onMouseEnter(e) {
            this.isInsideTarget = true;
            // Reset all positions so the smoothed cursor snaps to the entry point
            this.rawX = null;
            this.rawY = null;
            this.smoothX = null;
            this.smoothY = null;
            this.emitX = null;
            this.emitY = null;
            this.distAccumulator = 0;
            if (this.options.hideNativeCursor && this.target) {
                this.target.classList.add('golden-cursor-active');
            }
        }

        _onMouseLeave(e) {
            this.isInsideTarget = false;
            this.rawX = null;
            this.rawY = null;
            // Keep smoothX/Y and emitX/Y so the trail doesn't cut off abruptly;
            // the RAF loop will let existing particles finish fading naturally.
            this.distAccumulator = 0;
            this.isMoving = false;
        }

        /**
         * Mouse move handler — only records the raw position.
         * Particle emission happens in _tick() along the smoothed path.
         */
        _onMouseMove(e) {
            if (!this.canvas) return;

            const rect = this.canvas.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            if (x < 0 || y < 0 || x > this.width || y > this.height) {
                this.isInsideTarget = false;
                this.rawX = null;
                this.rawY = null;
                return;
            }

            this.isInsideTarget = true;
            this.isMoving = true;
            this.lastMoveTime = performance.now();

            // Record raw mouse position — smoothing is applied per RAF frame
            if (this.rawX === null) {
                // First point: snap smoothed position directly so there is no initial lag
                this.rawX = x;
                this.rawY = y;
                this.smoothX = x;
                this.smoothY = y;
                this.emitX = x;
                this.emitY = y;
            } else {
                this.rawX = x;
                this.rawY = y;
            }

            // Awaken animation loop if sleeping
            if (!this.isRunning) {
                this._startLoop();
            }
        }

        /**
         * Spawn a single particle at (x, y) with a given motion direction.
         * @param {number} x
         * @param {number} y
         * @param {number} dirX - Normalized x component of travel direction
         * @param {number} dirY - Normalized y component of travel direction
         */
        _spawnParticle(x, y, dirX, dirY) {
            if (this.particles.length >= this.options.maxParticles) {
                // Drop oldest particle if pool ceiling reached
                this.particles.shift();
            }

            const colors = this.options.colors && this.options.colors.length > 0
                ? this.options.colors
                : DEFAULT_COLORS;
            const color = colors[Math.floor(Math.random() * colors.length)];

            const isSparkle = Math.random() < (this.options.sparkleChance ?? 0.10);

            const szMin = this.options.sizeMin ?? 0.9;
            const szMax = this.options.sizeMax ?? 2.4;
            const size = szMin + Math.random() * (szMax - szMin);

            const lfMin = this.options.lifespanMin ?? 0.45;
            const lfMax = this.options.lifespanMax ?? 0.75;
            const lifespan = lfMin + Math.random() * (lfMax - lfMin);

            const mov = this.options.movement;
            const spMin = mov.speedMin ?? 10;
            const spMax = mov.speedMax ?? 32;
            const speed = spMin + Math.random() * (spMax - spMin);

            // Radial outward dispersion angle with subtle backward drag relative to travel direction
            const angle = Math.random() * Math.PI * 2;
            const vx = Math.cos(angle) * speed - dirX * (speed * 0.25);
            const vy = Math.sin(angle) * speed - dirY * (speed * 0.25);

            this.particles.push({
                x,
                y,
                vx,
                vy,
                size,
                lifespan,
                age: 0,
                color,
                isSparkle,
                sparklePhase: Math.random() * Math.PI * 2,
                rotation: Math.random() * Math.PI * 2,
                rotationSpeed: (Math.random() - 0.5) * 4.0,
                buoyancy: mov.buoyancy ?? -14,
                drag: mov.drag ?? 0.04
            });
        }

        _startLoop() {
            if (!this.isRunning) {
                this.isRunning = true;
                this.lastTime = performance.now();
                this.rafId = requestAnimationFrame(this._tick.bind(this));
            }
        }

        _stopLoop() {
            if (this.isRunning) {
                this.isRunning = false;
                if (this.rafId) {
                    cancelAnimationFrame(this.rafId);
                    this.rafId = null;
                }
            }
        }

        _onVisibilityChange() {
            if (document.hidden) {
                this._stopLoop();
                this.clear();
            } else if (this.particles.length > 0) {
                this._startLoop();
            }
        }

        /**
         * Main RAF tick — three responsibilities:
         *   1. Advance the smoothed cursor position toward the raw mouse position
         *   2. Emit particles along the smoothed path using distance-based spacing
         *   3. Update physics and render all active particles
         */
        _tick(now) {
            if (!this.isRunning) return;

            const dt = Math.min((now - this.lastTime) / 1000, 0.1);
            this.lastTime = now;

            // ------------------------------------------------------------------
            // 1. Idle detection — stop emitting when mouse has been still >40 ms
            // ------------------------------------------------------------------
            if (now - this.lastMoveTime > 40) {
                this.isMoving = false;
            }

            // ------------------------------------------------------------------
            // 2. Advance smoothed cursor position (frame-rate independent).
            //
            //    First-order exponential low-pass filter:
            //      alpha = 1 - exp(-dt / tau)
            //    where tau = options.smoothing (seconds).
            //
            //    Smaller tau  => snappier response (less smoothing)
            //    Larger tau   => more fluid / delayed trail
            // ------------------------------------------------------------------
            if (this.rawX !== null && this.smoothX !== null) {
                const tau = Math.max(0.001, this.options.smoothing);
                const alpha = 1 - Math.exp(-dt / tau);

                this.smoothX += (this.rawX - this.smoothX) * alpha;
                this.smoothY += (this.rawY - this.smoothY) * alpha;

                // ----------------------------------------------------------
                // 3. Emit particles along the smoothed path — only when moving.
                // ----------------------------------------------------------
                if (this.isMoving && this.emitX !== null) {
                    const dx = this.smoothX - this.emitX;
                    const dy = this.smoothY - this.emitY;
                    const dist = Math.sqrt(dx * dx + dy * dy);

                    if (dist > 0) {
                        this.distAccumulator += dist;

                        const spacing = Math.max(1, this.options.particleSpacing || 6);
                        const invDist = 1 / dist;
                        const dirX = dx * invDist;
                        const dirY = dy * invDist;

                        // Cap steps per frame to avoid spikes on very fast movements
                        const maxSteps = Math.min(Math.floor(this.distAccumulator / spacing), 30);

                        for (let i = 0; i < maxSteps; i++) {
                            // Interpolate along the segment from emitX/Y to smoothX/Y
                            const t = Math.min(((i + 1) * spacing) / dist, 1);
                            const px = this.emitX + dx * t + (Math.random() - 0.5) * 2.0;
                            const py = this.emitY + dy * t + (Math.random() - 0.5) * 2.0;
                            this._spawnParticle(px, py, dirX, dirY);
                        }

                        if (maxSteps > 0) {
                            this.distAccumulator -= maxSteps * spacing;
                            // Advance emit cursor by the distance actually covered
                            const tCovered = Math.min((maxSteps * spacing) / dist, 1);
                            this.emitX += dx * tCovered;
                            this.emitY += dy * tCovered;
                        }
                    }
                } else if (!this.isMoving) {
                    // When stopped, sync emit position to current smooth position
                    // so the next movement resumes seamlessly without a gap.
                    this.emitX = this.smoothX;
                    this.emitY = this.smoothY;
                    this.distAccumulator = 0;
                }
            }

            this._updateAndRender(dt);

            // Sleep RAF loop when no active particles remain and movement is idle
            if (this.particles.length === 0 && !this.isMoving) {
                this.clear();
                this._stopLoop();
                return;
            }

            this.rafId = requestAnimationFrame(this._tick.bind(this));
        }

        _updateAndRender(dt) {
            const ctx = this.ctx;
            if (!ctx) return;

            ctx.save();
            ctx.scale(this.dpr, this.dpr);
            ctx.clearRect(0, 0, this.width, this.height);

            const baseOpacity = this.options.baseOpacity ?? 0.90;
            const glowIntensity = this.options.glowIntensity ?? 1.0;

            const surviving = [];

            for (let i = 0; i < this.particles.length; i++) {
                const p = this.particles[i];
                p.age += dt;

                if (p.age >= p.lifespan) {
                    continue; // Particle expired
                }

                // Physics update: buoyancy upward drift + air drag damping
                p.vy += p.buoyancy * dt;
                p.vx *= (1 - p.drag);
                p.vy *= (1 - p.drag);
                p.x += p.vx * dt;
                p.y += p.vy * dt;
                p.rotation += p.rotationSpeed * dt;

                // Lifecycle fade: rapid bloom (first 10%) followed by smooth quadratic fade out
                const progress = p.age / p.lifespan;
                const fadeIn = Math.min(1.0, progress / 0.10);
                const fadeOut = Math.pow(Math.max(0, 1 - (progress - 0.10) / 0.90), 1.7);
                const alpha = baseOpacity * fadeIn * fadeOut;

                if (alpha <= 0.005) continue;

                // ------------------------------------------------------------
                // 1. Regular Golden Dust & Micro Embers
                // ------------------------------------------------------------
                if (!p.isSparkle) {
                    // Soft outer glow halo
                    ctx.beginPath();
                    ctx.arc(p.x, p.y, p.size * (2.0 * glowIntensity), 0, Math.PI * 2);
                    ctx.fillStyle = `rgba(${p.color.r}, ${p.color.g}, ${p.color.b}, ${alpha * 0.22})`;
                    ctx.fill();

                    // Luminous core dust
                    ctx.beginPath();
                    ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
                    ctx.fillStyle = `rgba(${p.color.r}, ${p.color.g}, ${p.color.b}, ${alpha})`;
                    ctx.fill();
                } else {
                    // --------------------------------------------------------
                    // 2. Twinkling 4-Point Micro Sparkles
                    // --------------------------------------------------------
                    const twinkle = 0.70 + 0.30 * Math.sin(p.age * 22 + p.sparklePhase);
                    const spAlpha = Math.min(1.0, alpha * 1.15) * twinkle;
                    const core = this.options.sparkleCoreColor;

                    // Sparkle outer halo
                    ctx.beginPath();
                    ctx.arc(p.x, p.y, p.size * 2.5 * glowIntensity, 0, Math.PI * 2);
                    ctx.fillStyle = `rgba(${p.color.r}, ${p.color.g}, ${p.color.b}, ${spAlpha * 0.32})`;
                    ctx.fill();

                    // 4-point cross twinkle glint
                    ctx.save();
                    ctx.translate(p.x, p.y);
                    ctx.rotate(p.rotation);

                    const arm = p.size * 2.4;
                    ctx.beginPath();
                    ctx.moveTo(-arm, 0);
                    ctx.lineTo(arm, 0);
                    ctx.moveTo(0, -arm);
                    ctx.lineTo(0, arm);
                    ctx.strokeStyle = `rgba(${core.r}, ${core.g}, ${core.b}, ${spAlpha * 0.85})`;
                    ctx.lineWidth = 0.9;
                    ctx.stroke();

                    // Hot white-gold core dot
                    ctx.beginPath();
                    ctx.arc(0, 0, p.size * 0.85, 0, Math.PI * 2);
                    ctx.fillStyle = `rgba(${core.r}, ${core.g}, ${core.b}, ${spAlpha})`;
                    ctx.fill();

                    ctx.restore();
                }

                surviving.push(p);
            }

            this.particles = surviving;
            ctx.restore();
        }

        clear() {
            if (this.ctx && this.canvas) {
                this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
            }
            this.particles = [];
        }

        destroy() {
            this._stopLoop();
            this.clear();

            if (this.target) {
                this.target.removeEventListener('mousemove', this._handleMouseMove);
                this.target.removeEventListener('mouseenter', this._handleMouseEnter);
                this.target.removeEventListener('mouseleave', this._handleMouseLeave);
                this.target.classList.remove('golden-cursor-active');
            }

            window.removeEventListener('resize', this._handleResize);
            window.removeEventListener('orientationchange', this._handleResize);
            document.removeEventListener('visibilitychange', this._handleVisibility);

            if (this.canvas && this.canvas.parentNode) {
                this.canvas.parentNode.removeChild(this.canvas);
            }

            this.canvas = null;
            this.ctx = null;
            this.target = null;
        }
    }

    return GoldenCursorEffect;
});
