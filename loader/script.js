/**
 * ============================================================================
 * PHOENIX V LOADER (LOADER2) - MAIN COORDINATOR
 * ============================================================================
 *
 * Wires together the two Loader 2 sub-modules and the cursor trail:
 *
 *   coin.js       — 3D spinning V coin + golden loading line + fade transition
 *   particles.js  — ambient floating golden particles
 *
 * Settings are read from settings.js (LOADER2_SETTINGS).
 * Cursor trail is managed by /cursor/settings.js + /cursor/golden-cursor.js.
 *
 * Load order in index.html:
 *   1. settings.js
 *   2. golden-particles.js  (external lib)
 *   3. golden-cursor.js     (external lib)
 *   4. particles.js         (this project — particles module)
 *   5. coin.js              (this project — coin/line module)
 *   6. script.js            (this file — coordinator)
 * ============================================================================
 */

(function () {
    'use strict';

    const CFG = (typeof LOADER2_SETTINGS !== 'undefined') ? LOADER2_SETTINGS : {};
    const cursorCfg = CFG.cursorTrail || {};

    const wrapper = document.querySelector('.loader2-wrapper');

    let cursorInstance = null;

    // ------------------------------------------------------------------------
    // CURSOR TRAIL (managed here as it spans the whole loader stage)
    // ------------------------------------------------------------------------
    function initLoaderCursor() {
        if (cursorCfg.enabled === false) return;

        if (typeof GoldenCursorEffect !== 'undefined' && !cursorInstance) {
            cursorInstance = new GoldenCursorEffect(Object.assign({
                targetArea: wrapper || '.loader2-wrapper'
            }, cursorCfg));
        }
    }

    // ------------------------------------------------------------------------
    // PUBLIC API (unified interface over all sub-modules)
    // ------------------------------------------------------------------------
    window.PhoenixLoader2 = {
        setProgress: function (f) {
            if (window.Loader2Coin) window.Loader2Coin.setProgress(f);
            if (window.Loader2Particles) window.Loader2Particles.setProgress(f);
        },
        complete:    function ()  { if (window.Loader2Coin) window.Loader2Coin.complete(); },
        reset:       function ()  {
            if (window.Loader2Particles) window.Loader2Particles.reset();
            if (window.Loader2Coin) window.Loader2Coin.reset();
        },
        getProgress:         function () { return window.Loader2Coin ? window.Loader2Coin.getProgress() : 0; },
        getParticleInstance: function () { return window.Loader2Particles ? window.Loader2Particles.getInstance() : null; },
        getCursorInstance:   function () { return cursorInstance; }
    };

    // ------------------------------------------------------------------------
    // INITIALIZATION
    // ------------------------------------------------------------------------
    function init() {
        // Sync CSS custom properties from settings
        if (CFG.applyToCSS) CFG.applyToCSS();

        // Start ambient floating particles (particles.js module)
        if (window.Loader2Particles) window.Loader2Particles.init();

        // Start golden sparkle cursor trail
        initLoaderCursor();

        // Start spinning coin + loading line progress (coin.js module)
        if (window.Loader2Coin) window.Loader2Coin.start();
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();
