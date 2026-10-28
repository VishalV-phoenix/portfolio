import React, { useEffect, useRef, useState } from 'react';
import { SCROLL_PROGRESS_SETTINGS } from '../config/effectsSettings';

interface ScrollProgressIndicatorProps {
  scrollY: number;
  viewportHeight: number;
  totalTrackHeight: number;
  isVisible?: boolean;
}

/**
 * Custom Minimal Golden Scroll Progress Spine
 *
 * Renders a persistent thin vertical rail and a growing warm golden spine fill
 * with a luminous leading tip bead along the far right edge of the viewport.
 *
 * Uses a critically damped, snappy spring filter for organic responsiveness
 * without noticeable follow lag. Respects prefers-reduced-motion.
 *
 * Exclusively active on desktop viewports (>=768px). Completely absent on mobile.
 */
export const ScrollProgressIndicator: React.FC<ScrollProgressIndicatorProps> = ({
  scrollY,
  viewportHeight,
  totalTrackHeight,
  isVisible = true,
}) => {
  // Calculate true maximum scrollable distance (total document height - window height)
  const maxScroll = Math.max(1, totalTrackHeight - viewportHeight);
  const targetProgress = Math.max(0, Math.min(1, scrollY / maxScroll));

  // State for rendered spring-interpolated progress
  const [springProgress, setSpringProgress] = useState(targetProgress);

  // Physics animation refs
  const currentPosRef = useRef(targetProgress);
  const velocityRef = useRef(0);
  const targetRef = useRef(targetProgress);
  const rafRef = useRef<number | null>(null);
  const lastTimeRef = useRef<number>(performance.now());

  targetRef.current = targetProgress;

  useEffect(() => {
    // Respect user preference for reduced motion
    const prefersReducedMotion =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (prefersReducedMotion) {
      currentPosRef.current = targetProgress;
      velocityRef.current = 0;
      setSpringProgress(targetProgress);
      return;
    }

    // Snappy critically-damped spring: fast synchronization with zero bounce/overshoot
    const tension = SCROLL_PROGRESS_SETTINGS.springTension;
    const friction = SCROLL_PROGRESS_SETTINGS.springFriction;

    const animate = (now: number) => {
      const dt = Math.min((now - lastTimeRef.current) / 1000, 0.064);
      lastTimeRef.current = now;

      const diff = targetRef.current - currentPosRef.current;
      const springForce = diff * tension;
      const dampingForce = -friction * velocityRef.current;
      const acceleration = springForce + dampingForce;

      velocityRef.current += acceleration * dt;
      currentPosRef.current += velocityRef.current * dt;

      // Settle condition: stopped and close to target
      if (Math.abs(diff) < 0.0002 && Math.abs(velocityRef.current) < 0.0005) {
        currentPosRef.current = targetRef.current;
        velocityRef.current = 0;
        setSpringProgress(targetRef.current);
        rafRef.current = null;
        return;
      }

      setSpringProgress(Math.max(0, Math.min(1, currentPosRef.current)));
      rafRef.current = requestAnimationFrame(animate);
    };

    if (rafRef.current === null) {
      lastTimeRef.current = performance.now();
      rafRef.current = requestAnimationFrame(animate);
    }

    return () => {
      if (rafRef.current !== null) {
        cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
      }
    };
  }, [targetProgress]);

  // Height of the track rail
  const trackHeight = Math.max(0, viewportHeight - SCROLL_PROGRESS_SETTINGS.verticalInsetPx * 2);
  const displayProgress = Math.max(0, Math.min(1, springProgress));
  const beadTranslateY = displayProgress * trackHeight;

  return (
    <div
      className="hidden md:flex fixed right-2 z-45 flex-col items-center pointer-events-none select-none transition-opacity duration-300"
      style={{
        top: `${SCROLL_PROGRESS_SETTINGS.verticalInsetPx}px`,
        bottom: `${SCROLL_PROGRESS_SETTINGS.verticalInsetPx}px`,
        width: '6px',
        opacity: isVisible ? 1 : 0,
      }}
      aria-hidden="true"
    >
      {/* Persistent Subtle Dark Rail */}
      <div
        className="relative h-full rounded-full overflow-visible"
        style={{
          width: `${SCROLL_PROGRESS_SETTINGS.railWidthPx}px`,
          backgroundColor: 'rgba(2, 2, 2, 0.08)',
          boxShadow: 'inset 0 0 1px rgba(0, 0, 0, 0.8), 0 0 1px rgba(255, 255, 255, 0.04)',
        }}
      >
        {/* Growing Golden Spine Fill */}
        <div
          className="absolute top-0 left-0 w-full h-full rounded-full"
          style={{
            background:
              'linear-gradient(to bottom, rgba(214, 173, 69, 0.25) 0%, rgba(214, 173, 69, 0.8) 65%, #F5D77F 100%)',
            boxShadow: '0 0 4px rgba(214, 173, 69, 0.4), 0 0 8px rgba(214, 173, 69, 0.2)',
            transformOrigin: 'top center',
            transform: `scaleY(${displayProgress})`,
            willChange: 'transform',
          }}
        />

        {/* Luminous Leading Endpoint Bead at the active tip of the spine */}
        <div
          className="absolute top-0 left-1/2 rounded-full pointer-events-none transition-opacity duration-200"
          style={{
            width: `${SCROLL_PROGRESS_SETTINGS.beadDiameterPx}px`,
            height: `${SCROLL_PROGRESS_SETTINGS.beadDiameterPx}px`,
            marginLeft: `-${SCROLL_PROGRESS_SETTINGS.beadDiameterPx / 2}px`,
            marginTop: `-${SCROLL_PROGRESS_SETTINGS.beadDiameterPx / 2}px`,
            background: '#FFF2BD',
            boxShadow:
              '0 0 4px #F5D77F, 0 0 10px rgba(214, 173, 69, 0.7), 0 0 18px rgba(214, 173, 69, 0.35)',
            transform: `translateY(${beadTranslateY}px)`,
            willChange: 'transform',
            opacity: displayProgress > 0.002 ? 1 : 0,
          }}
        />
      </div>
    </div>
  );
};
