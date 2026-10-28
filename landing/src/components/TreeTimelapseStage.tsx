import React, { useEffect, useRef } from 'react';

interface TreeTimelapseStageProps {
  /**
   * Tree growth scroll scrub progress (0.0 to 1.0)
   * 0.0 = Sapling (Frame 0)
   * 1.0 = Full Mature Sacred Tree (Frame 239)
   */
  progress: number;
  /**
   * Tunnel transition progress (0.0 to 1.0)
   * Controls when the tree stage becomes visible inside the tunnel aperture
   */
  tunnelProgress: number;
  /**
   * Active visibility flag
   */
  isVisible: boolean;
}

const TOTAL_FRAMES = 240;

function getFrameUrl(index: number): string {
  const frameNum = String(index + 1).padStart(3, '0');
  return `/tree-magic/ezgif-frame-${frameNum}.jpg`;
}

export const TreeTimelapseStage: React.FC<TreeTimelapseStageProps> = ({
  progress,
  tunnelProgress,
  isVisible,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const framesRef = useRef<(HTMLImageElement | null)[]>(new Array(TOTAL_FRAMES).fill(null));
  const loadedStatusRef = useRef<boolean[]>(new Array(TOTAL_FRAMES).fill(false));
  const currentDrawnIndexRef = useRef<number>(-1);
  const targetFrameIndexRef = useRef<number>(0);
  const rafScheduledRef = useRef<boolean>(false);
  const overlayCanvasRef = useRef<HTMLCanvasElement | null>(null);


  // 1. High-fidelity Cover canvas rendering algorithm
  const drawFrame = (img: HTMLImageElement) => {
    const canvas = canvasRef.current;
    if (!canvas || !img || !img.complete || img.naturalWidth === 0) return;
    const ctx = canvas.getContext('2d', { alpha: false });
    if (!ctx) return;

    // Enable highest quality bicubic interpolation
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';

    const cw = canvas.width;
    const ch = canvas.height;
    const iw = img.naturalWidth;
    const ih = img.naturalHeight;

    // Cover math: fills entire backing canvas without distortion
    const scale = Math.max(cw / iw, ch / ih);
    const dw = iw * scale;
    const dh = ih * scale;
    const dx = (cw - dw) / 2;
    const dy = (ch - dh) / 2;

    ctx.fillStyle = '#000000';
    ctx.fillRect(0, 0, cw, ch);
    ctx.drawImage(img, 0, 0, iw, ih, dx, dy, dw, dh);

    // Overlay to conceal watermark in lockstep with cover scaling
    const overlay = overlayCanvasRef.current;
    if (overlay) {
      const ox = dx + 1700 * scale;
      const oy = dy + 775 * scale;
      const ow = overlay.width * scale;
      const oh = overlay.height * scale;
      ctx.drawImage(overlay, ox, oy, ow, oh);
    }
  };

  // Best-available-frame fallback: searches outwards for closest loaded frame
  const getBestAvailableFrame = (index: number) => {
    const frames = framesRef.current;
    const loaded = loadedStatusRef.current;

    if (loaded[index] && frames[index] && frames[index]!.complete && frames[index]!.naturalWidth > 0) {
      return { img: frames[index]!, index };
    }

    for (let offset = 1; offset < TOTAL_FRAMES; offset++) {
      const lower = index - offset;
      if (lower >= 0 && loaded[lower] && frames[lower] && frames[lower]!.complete && frames[lower]!.naturalWidth > 0) {
        return { img: frames[lower]!, index: lower };
      }
      const upper = index + offset;
      if (upper < TOTAL_FRAMES && loaded[upper] && frames[upper] && frames[upper]!.complete && frames[upper]!.naturalWidth > 0) {
        return { img: frames[upper]!, index: upper };
      }
    }
    return null;
  };

  const renderFrame = () => {
    rafScheduledRef.current = false;
    const best = getBestAvailableFrame(targetFrameIndexRef.current);
    if (best && (currentDrawnIndexRef.current !== best.index || currentDrawnIndexRef.current === -1)) {
      drawFrame(best.img);
      currentDrawnIndexRef.current = best.index;
    }
  };

  const scheduleRender = () => {
    if (!rafScheduledRef.current) {
      rafScheduledRef.current = true;
      requestAnimationFrame(renderFrame);
    }
  };

  // High-DPI backing store resolution (eliminates blur from default 300x150 canvas)
  const resizeCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const targetWidth = Math.round(window.innerWidth * dpr);
    const targetHeight = Math.round(window.innerHeight * dpr);

    if (canvas.width !== targetWidth || canvas.height !== targetHeight) {
      canvas.width = targetWidth;
      canvas.height = targetHeight;
      currentDrawnIndexRef.current = -1; // Force redraw at new backing resolution
      scheduleRender();
    }
  };

  // 2. Preloader Lifecycle: Preload & decode Frame 0 immediately at full quality
  useEffect(() => {
    const firstImg = new Image();
    firstImg.src = getFrameUrl(0);
    framesRef.current[0] = firstImg;

    const onFrame0Ready = () => {
      loadedStatusRef.current[0] = true;
      scheduleRender();
      preloadRemainingFrames();
    };

    firstImg.onload = onFrame0Ready;
    if (typeof firstImg.decode === 'function') {
      firstImg.decode().then(onFrame0Ready).catch(() => {});
    }

    firstImg.onerror = () => {
      preloadRemainingFrames();
    };

    function preloadRemainingFrames() {
      let idx = 1;
      function loadNextBatch() {
        const batchEnd = Math.min(TOTAL_FRAMES, idx + 8);
        for (; idx < batchEnd; idx++) {
          const currentIdx = idx;
          const img = new Image();
          img.src = getFrameUrl(currentIdx);
          framesRef.current[currentIdx] = img;

          img.onload = () => {
            loadedStatusRef.current[currentIdx] = true;
            // If the user is currently waiting on this frame or showing a fallback, redraw immediately
            if (
              targetFrameIndexRef.current === currentIdx ||
              currentDrawnIndexRef.current !== targetFrameIndexRef.current
            ) {
              scheduleRender();
            }
          };
        }
        if (idx < TOTAL_FRAMES) {
          setTimeout(loadNextBatch, 25);
        }
      }
      setTimeout(loadNextBatch, 50);
    }

    // Preload & preprocess watermark concealing overlay (white grass.png)
    const grassImg = new Image();
    grassImg.src = '/assets/white%20grass.png';
    grassImg.onload = () => {
      const gw = grassImg.naturalWidth;
      const gh = grassImg.naturalHeight;
      const offscreen = document.createElement('canvas');
      offscreen.width = gw;
      offscreen.height = gh;
      const offCtx = offscreen.getContext('2d');
      if (offCtx) {
        offCtx.drawImage(grassImg, 0, 0);
        try {
          const imgData = offCtx.getImageData(0, 0, gw, gh);
          const data = imgData.data;
          const featherTop =18;
          const featherLeft = 2;

          for (let y = 0; y < gh; y++) {
            for (let x = 0; x < gw; x++) {
              let m = 1.0;
              if (y < featherTop) {
                m *= y / featherTop;
              }
              if (x < featherLeft) {
                m *= x / featherLeft;
              }
              const smoothM = m * m * (3 - 2 * m);
              const idx = (y * gw + x) * 4;
              data[idx + 3] = Math.round(data[idx + 3] * smoothM);
            }
          }
          offCtx.putImageData(imgData, 0, 0);
          overlayCanvasRef.current = offscreen;
        } catch {
          overlayCanvasRef.current = offscreen;
        }
        currentDrawnIndexRef.current = -1;
        scheduleRender();
      }
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    window.addEventListener('orientationchange', resizeCanvas);

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      window.removeEventListener('orientationchange', resizeCanvas);
    };
  }, []);

  // When visibility changes to true, ensure canvas is properly sized and rendered
  useEffect(() => {
    if (isVisible) {
      currentDrawnIndexRef.current = -1;
      resizeCanvas();
      scheduleRender();
    }
  }, [isVisible]);

  // 3. Scroll scrub synchronization (strictly maps 0..1 to 0..239)
  useEffect(() => {
    const clampedProgress = Math.max(0, Math.min(1, progress));
    const targetIndex = Math.min(
      TOTAL_FRAMES - 1,
      Math.max(0, Math.floor(clampedProgress * (TOTAL_FRAMES - 1)))
    );

    if (targetFrameIndexRef.current !== targetIndex) {
      targetFrameIndexRef.current = targetIndex;
      scheduleRender();
    }
  }, [progress]);

  // Calculate opening aperture mask during tunnel transition
  let clipPathStyle = 'none';
  if (tunnelProgress > 0 && tunnelProgress < 1.0) {
    if (tunnelProgress < 0.5) {
      clipPathStyle = 'circle(0% at 50% 50%)';
    } else {
      const apertureNorm = (tunnelProgress - 0.5) / 0.5;
      const radiusPercent = Math.pow(apertureNorm, 1.8) * 110;
      clipPathStyle = `circle(${radiusPercent}% at 50% 50%)`;
    }
  }

  return (
    <div
      className="fixed inset-0 z-10 w-screen h-screen min-h-[100dvh] overflow-hidden bg-black pointer-events-none select-none"
      style={{
        clipPath: clipPathStyle,
        WebkitClipPath: clipPathStyle,
        visibility: isVisible ? 'visible' : 'hidden',
        transition: 'none',
      }}
      aria-label="Magic Tree Timelapse"
    >
      <canvas
        ref={canvasRef}
        id="tree-canvas"
        className="block w-full h-full object-cover"
      />
    </div>
  );
};
