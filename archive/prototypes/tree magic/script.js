(() => {
    'use strict';

    const _TREE_CFG = (typeof PORTFOLIO_SETTINGS !== 'undefined' && PORTFOLIO_SETTINGS.tree)
        ? PORTFOLIO_SETTINGS.tree
        : {};

    const TOTAL_FRAMES = _TREE_CFG.totalFrames ?? 240;
    const MAX_DPR = _TREE_CFG.maxDpr ?? 2;

    const canvas = document.getElementById('tree-canvas');
    const ctx = canvas.getContext('2d', { alpha: false });
    const container = document.querySelector('.tree-scroll-container');

    const frames = new Array(TOTAL_FRAMES);
    const loadedStatus = new Array(TOTAL_FRAMES).fill(false);

    let currentDrawnIndex = -1;
    let targetFrameIndex = 0;
    let rafScheduled = false;

    // Dynamically resolve frames path whether loaded from root or subfolder
    const TREE_ASSET_PATH =
        document.querySelector('script[src*="tree magic/script.js"]')
            ? 'tree magic/'
            : '';

    // Helper to get frame filename (ezgif-frame-001.jpg .. ezgif-frame-240.jpg)
    function getFrameUrl(index) {
        const frameNum = String(index + 1).padStart(3, '0');
        return `${TREE_ASSET_PATH}ezgif-frame-${frameNum}.jpg`;
    }

    // Resize canvas respecting devicePixelRatio (capped by settings for performance)
    function resizeCanvas() {
        const dpr = Math.min(window.devicePixelRatio || 1, MAX_DPR);
        const displayWidth = window.innerWidth;
        const displayHeight = window.innerHeight;

        const targetWidth = Math.floor(displayWidth * dpr);
        const targetHeight = Math.floor(displayHeight * dpr);

        if (canvas.width !== targetWidth || canvas.height !== targetHeight) {
            canvas.width = targetWidth;
            canvas.height = targetHeight;
            // Force redraw on resize
            currentDrawnIndex = -1;
            scheduleRender();
        }
    }

    // Draw frame centered with COVER behavior (fills entire viewport, no borders)
    function drawFrame(img) {
        if (!img || !img.complete || img.naturalWidth === 0) return;

        const cw = canvas.width;
        const ch = canvas.height;
        const iw = img.naturalWidth;
        const ih = img.naturalHeight;

        // Cover behavior: use Math.max to fill the entire viewport canvas
        const scale = Math.max(cw / iw, ch / ih);
        const dw = iw * scale;
        const dh = ih * scale;

        // Center horizontally and vertically to keep tree trunk and canopy visible
        const dx = (cw - dw) / 2;
        const dy = (ch - dh) / 2;

        ctx.fillStyle = '#000000';
        ctx.fillRect(0, 0, cw, ch);
        ctx.drawImage(img, 0, 0, iw, ih, dx, dy, dw, dh);
    }

    // Find the closest loaded frame to the target index if target is not loaded yet
    function getBestAvailableFrame(index) {
        if (loadedStatus[index] && frames[index]) {
            return { img: frames[index], index: index };
        }

        // Search outwards for the nearest available loaded frame
        for (let offset = 1; offset < TOTAL_FRAMES; offset++) {
            const lower = index - offset;
            if (lower >= 0 && loadedStatus[lower] && frames[lower]) {
                return { img: frames[lower], index: lower };
            }
            const upper = index + offset;
            if (upper < TOTAL_FRAMES && loadedStatus[upper] && frames[upper]) {
                return { img: frames[upper], index: upper };
            }
        }

        return null;
    }

    // Core render cycle
    function render() {
        rafScheduled = false;

        const best = getBestAvailableFrame(targetFrameIndex);
        if (best && (currentDrawnIndex !== best.index || currentDrawnIndex === -1)) {
            drawFrame(best.img);
            currentDrawnIndex = best.index;
        }
    }

    function scheduleRender() {
        if (!rafScheduled) {
            rafScheduled = true;
            requestAnimationFrame(render);
        }
    }

    // Particle system instance for tree growth atmosphere
    let treeParticles = null;

    function initParticles() {
        if (typeof GoldenParticleSystem !== 'undefined') {
            const wrapper = document.querySelector('.canvas-sticky-wrapper');
            if (wrapper && !treeParticles) {
                // GoldenParticleSystem automatically reads defaults from PORTFOLIO_SETTINGS.particles
                treeParticles = new GoldenParticleSystem({
                    container: wrapper,
                    initialProgress: 0
                });
                window.treeParticles = treeParticles;
            }
        }
    }

    // Compute progress relative to the tree section container
    function updateScrollProgress() {
        if (!container) return;

        const rect = container.getBoundingClientRect();
        const scrollableDistance = container.offsetHeight - window.innerHeight;

        let progress = 0;
        if (scrollableDistance > 0) {
            const currentScrolled = -rect.top;
            progress = currentScrolled / scrollableDistance;
            progress = Math.max(0, Math.min(1, progress));
        }

        const newTargetIndex = Math.min(TOTAL_FRAMES - 1, Math.max(0, Math.floor(progress * (TOTAL_FRAMES - 1))));

        if (newTargetIndex !== targetFrameIndex) {
            targetFrameIndex = newTargetIndex;
            scheduleRender();
        }

        // Forward tree growth progress (0 to 1) to golden particles
        if (treeParticles) {
            treeParticles.setProgress(progress);
        }
    }

    // Preload image assets
    function preloadFrames() {
        // 1. Immediately load first frame
        const firstImg = new Image();
        firstImg.src = getFrameUrl(0);
        frames[0] = firstImg;

        firstImg.onload = () => {
            loadedStatus[0] = true;
            scheduleRender();
            // 2. Start preloading remaining frames after frame 1 is ready
            preloadRemainingFrames();
        };

        firstImg.onerror = () => {
            preloadRemainingFrames();
        };
    }

    function preloadRemainingFrames() {
        for (let i = 1; i < TOTAL_FRAMES; i++) {
            const img = new Image();
            img.src = getFrameUrl(i);
            frames[i] = img;

            img.onload = () => {
                loadedStatus[i] = true;
                if (targetFrameIndex === i) {
                    scheduleRender();
                }
            };
        }
    }

    // Event Listeners
    window.addEventListener('scroll', updateScrollProgress, { passive: true });
    window.addEventListener('resize', resizeCanvas);
    window.addEventListener('orientationchange', resizeCanvas);
    window.addEventListener('loaderArrival', scheduleRender);

    // Initialization
    if ('scrollRestoration' in history) {
        history.scrollRestoration = 'manual';
    }
    window.scrollTo(0, 0);

    initParticles();
    resizeCanvas();
    updateScrollProgress();
    preloadFrames();
})();
