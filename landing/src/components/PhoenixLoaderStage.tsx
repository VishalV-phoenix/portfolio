import React, { useEffect, useRef, useState } from 'react';
import '../styles/loader.css';
import { LOADER_CONTENT } from '../content/loaderContent';
import { LOADER_AFFORDANCE_SETTINGS } from '../config/effectsSettings';

interface PhoenixLoaderStageProps {
  /**
   * Scroll progress of Stage A (0.0 to 1.0)
   * 0.0 = completely visible at top
   * 1.0 = completely receded & faded out as landing page takes over
   */
  progress: number;
  /**
   * Optional callback when entrance loading completes
   */
  onComplete?: () => void;
}

export const PhoenixLoaderStage: React.FC<PhoenixLoaderStageProps> = ({
  progress,
  onComplete,
}) => {
  const hasInitializedRef = useRef(false);
  const [showIndicator, setShowIndicator] = useState(false);
  const indicatorTimerRef = useRef<number | null>(null);

  useEffect(() => {
    if (hasInitializedRef.current) return;
    hasInitializedRef.current = true;

    // Apply CSS variables from settings
    if (window.LOADER2_SETTINGS?.applyToCSS) {
      window.LOADER2_SETTINGS.applyToCSS();
    }

    // Start ambient floating particles simulation (with retry guard if container mounts asynchronously)
    const initParticlesWithRetry = () => {
      if (window.Loader2Particles) {
        window.Loader2Particles.init();
      } else {
        setTimeout(initParticlesWithRetry, 50);
      }
    };
    initParticlesWithRetry();

    // Start 3D spinning coin and loading line progress
    const initCoinWithRetry = () => {
      if (window.Loader2Coin) {
        window.Loader2Coin.start();
      } else {
        setTimeout(initCoinWithRetry, 50);
      }
    };
    initCoinWithRetry();

    // If coin is already complete on initial mount:
    if (window.Loader2Coin && typeof window.Loader2Coin.getProgress === 'function' && window.Loader2Coin.getProgress() >= 1) {
      if (!indicatorTimerRef.current) {
        indicatorTimerRef.current = window.setTimeout(() => {
          setShowIndicator(true);
        }, LOADER_AFFORDANCE_SETTINGS.indicatorDelayMs);
      }
    }

    const handleCompleted = () => {
      onComplete?.();
      if (indicatorTimerRef.current) {
        window.clearTimeout(indicatorTimerRef.current);
      }
      indicatorTimerRef.current = window.setTimeout(() => {
        setShowIndicator(true);
      }, LOADER_AFFORDANCE_SETTINGS.indicatorDelayMs);
    };

    window.addEventListener('loader2Completed', handleCompleted, { once: true });

    return () => {
      window.removeEventListener('loader2Completed', handleCompleted);
      if (indicatorTimerRef.current) {
        window.clearTimeout(indicatorTimerRef.current);
      }
      if (window.Loader2Particles) {
        window.Loader2Particles.destroy();
      }
    };
  }, [onComplete]);

  // Scroll-driven transforms (strictly reversible from scroll position)
  const clampedProgress = Math.max(0, Math.min(1, progress));
  const opacity = Math.max(0, 1 - clampedProgress);
  const scale = 1 - 0.12 * clampedProgress;
  const translateY = -40 * clampedProgress;
  const isHidden = clampedProgress >= 1;
  const pointerEvents = 'none';

  // Ensure loading line resting state is restored if returned to top
  useEffect(() => {
    if (clampedProgress === 0 && window.Loader2Coin && window.Loader2Coin.getProgress() >= 1) {
      const lineFill = document.querySelector('.loading-line-fill') as HTMLElement | null;
      if (lineFill) {
        lineFill.style.width = '100%';
      }
    }
  }, [clampedProgress]);

  return (
    <div
      className="loader2-wrapper"
      id="phoenixLoaderStage"
      aria-label={LOADER_CONTENT.stageAriaLabel}
      style={{
        opacity,
        transform: `scale(${scale}) translateY(${translateY}px)`,
        pointerEvents,
        visibility: isHidden ? 'hidden' : 'visible',
        transition: 'none', // Driven directly by scroll coordinates for 60fps responsiveness
      }}
    >
      {/* Subtle Top Golden Light (Celestial Bloom from above) */}
      <div className="loader2-top-glow" aria-hidden="true">
        <div className="loader2-top-glow-core"></div>
      </div>

      {/* Ambient Golden Particles Overlay */}
      <div id="loader2Particles"></div>

      {/* Center Group (Positioned ~25% Above Viewport Bottom Edge) */}
      <div className="loader2-group">
        {/* 3D Coin Rotation Stage */}
        <div className="coin-stage" aria-label={LOADER_CONTENT.coinAriaLabel}>
          <div className="coin-flipper">
            {/* Simulated Coin Middle Depth Rim */}
            <div className="coin-rim-mid" aria-hidden="true">
              <img
                src="/loader/phoenix-v-logo.png"
                className="coin-image"
                alt=""
              />
            </div>

            {/* Front Face with Metallic Silhouette Shine */}
            <div className="coin-face coin-face-front">
              <img
                src="/loader/phoenix-v-logo.png"
                className="coin-image"
                alt={LOADER_CONTENT.logoAltText}
              />
              <div className="logo-shine-layer" aria-hidden="true"></div>
            </div>

            {/* Reverse Face */}
            <div className="coin-face coin-face-back" aria-hidden="true">
              <img
                src="/loader/phoenix-v-logo.png"
                className="coin-image"
                alt=""
              />
            </div>
          </div>
        </div>

        {/* Golden Glowing Loading Line */}
        <div
          className="loading-line-wrapper"
          role="progressbar"
          aria-valuemin={0}
          aria-valuemax={100}
        >
          <div className="loading-line-track"></div>
          <div className="loading-line-fill">
            <div className="loading-line-flare"></div>
          </div>
        </div>
      </div>

      {/* Subtle Upward Scroll Indicator (Appears 1s after loading finishes near top-center) */}
      <div
        className="loader-scroll-up-indicator"
        style={{
          opacity: showIndicator
            ? Math.max(0, 1 - clampedProgress * LOADER_AFFORDANCE_SETTINGS.indicatorFadeMultiplier)
            : 0,
          visibility:
            showIndicator && clampedProgress < LOADER_AFFORDANCE_SETTINGS.indicatorHiddenThreshold
              ? 'visible'
              : 'hidden',
        }}
        aria-hidden="true"
      >
        <span
          className="font-sans text-[10px] sm:text-[11px] font-medium tracking-[0.28em] text-[#FEF08A]/85 uppercase text-center"
          style={{
            textShadow: '0 0 10px rgba(251, 191, 36, 0.35), 0 1px 4px rgba(0, 0, 0, 0.9)',
          }}
        >
          {LOADER_CONTENT.scrollUpAffordanceText}
        </span>
        <span className="loader-scroll-up-arrow" aria-hidden="true">
          {LOADER_CONTENT.scrollUpArrowSymbol}
        </span>
      </div>
    </div>
  );
};
