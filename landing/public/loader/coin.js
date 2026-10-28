/**
 * ============================================================================
 * PHOENIX V LOADER (LOADER2) - COIN (V LOGO) MODULE
 * ============================================================================
 *
 * Manages the 3D spinning V coin, the golden glowing loading line,
 * and the completion / fade-out transition for Loader 2.
 * Reads config from LOADER2_SETTINGS (set in settings.js).
 *
 * Exposes: window.Loader2Coin
 *   .setProgress(fraction) — set loading line progress (0.0 – 1.0)
 *   .start()               — begin the timed progress animation
 *   .complete()            — trigger completion & fade-out
 *   .reset()               — reset coin + line to initial state
 *   .getProgress()         — return current progress fraction
 * ============================================================================
 */

(function () {
    'use strict';

    const CFG = (typeof LOADER2_SETTINGS !== 'undefined') ? LOADER2_SETTINGS : {};
    const lineCfg = CFG.line || {};
    const transCfg = CFG.transition || {};

    // DOM Elements — dynamic querying ensures elements are found whether mounted statically or by React
    let wrapper = null;
    let lineWrapper = null;
    let lineFill = null;

    function ensureElements() {
        if (!wrapper || !wrapper.isConnected) wrapper = document.querySelector('.loader2-wrapper');
        if (!lineWrapper || !lineWrapper.isConnected) lineWrapper = document.querySelector('.loading-line-wrapper');
        if (!lineFill || !lineFill.isConnected) lineFill = document.querySelector('.loading-line-fill');
        if (lineFill && isCompleted) {
            lineFill.style.width = '100%';
        }
    }

    let progressAnimationId = null;
    let currentProgress = 0;
    let isCompleted = false;

    // ------------------------------------------------------------------------
    // PROGRESS LINE CONTROLLER
    // ------------------------------------------------------------------------
    /**
     * Set progress manually or programmatically (0.0 to 1.0)
     * @param {number} fraction Progress between 0 and 1
     */
    function setProgress(fraction) {
        ensureElements();
        if (!lineFill) return;
        const clamped = Math.max(0, Math.min(1, fraction));
        currentProgress = clamped;

        lineFill.style.width = (clamped * 100) + '%';

        if (clamped > 0 && clamped < 1) {
            lineFill.classList.add('is-active');
        }

        if (window.Loader2Particles) {
            window.Loader2Particles.setProgress(clamped);
        }

        if (clamped >= 1.0 && !isCompleted) {
            lineFill.classList.remove('is-active');
            if (transCfg.autoCompleteOn100) {
                triggerCompletion();
            }
        }
    }

    /**
     * Start timed progress sequence
     */
    function startTimedProgress() {
        ensureElements();
        if (isCompleted) {
            // Already completed entrance; maintain 100% resting state without restarting
            if (lineFill) lineFill.style.width = '100%';
            return;
        }

        if (lineCfg.mode === 'indeterminate') {
            if (lineWrapper) lineWrapper.classList.add('is-indeterminate');
            return;
        }

        const duration = lineCfg.progressDuration || 3500;
        const startTime = performance.now();

        function step(now) {
            const elapsed = now - startTime;
            // Smooth easeOutCubic curve for organic loading feel
            const t = Math.min(1, elapsed / duration);
            const easeProgress = 1 - Math.pow(1 - t, 3);

            setProgress(easeProgress);

            if (t < 1) {
                progressAnimationId = requestAnimationFrame(step);
            }
        }

        progressAnimationId = requestAnimationFrame(step);
    }

    // ------------------------------------------------------------------------
    // COMPLETION & RESTING STATE (Fade/recede is coordinated by scroll)
    // ------------------------------------------------------------------------
    function triggerCompletion() {
        if (isCompleted) return;
        isCompleted = true;

        if (progressAnimationId) {
            cancelAnimationFrame(progressAnimationId);
            progressAnimationId = null;
        }

        // Ensure line finishes at 100%
        ensureElements();
        if (lineFill) lineFill.style.width = '100%';

        // Dispatch completion event for any listener
        window.dispatchEvent(new CustomEvent('loader2Completed'));
    }

    /**
     * Reset the coin + line to initial state for repeated interactive testing
     */
    function resetCoin() {
        ensureElements();
        if (progressAnimationId) cancelAnimationFrame(progressAnimationId);
        isCompleted = false;
        currentProgress = 0;
        if (wrapper) {
            wrapper.style.display = 'block';
            wrapper.classList.remove('fade-out');
        }
        if (lineFill) {
            lineFill.style.width = '0%';
            lineFill.classList.remove('is-active');
        }
        if (window.Loader2Particles) {
            window.Loader2Particles.reset();
        }
        startTimedProgress();
    }

    // ------------------------------------------------------------------------
    // PUBLIC API
    // ------------------------------------------------------------------------
    window.Loader2Coin = {
        setProgress: setProgress,
        start: startTimedProgress,
        complete: triggerCompletion,
        reset: resetCoin,
        getProgress: function () { return currentProgress; }
    };

})();
