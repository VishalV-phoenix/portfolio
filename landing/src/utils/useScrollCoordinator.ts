import { useState, useEffect, useRef, useCallback } from 'react';

export interface ScrollStages {
  scrollY: number;
  viewportHeight: number;
  totalTrackHeight: number;
  /**
   * Stage A: Phoenix V Loader
   * 0.0 = fully visible at top
   * 1.0 = fully receded and faded out
   */
  progressA: number;
  /**
   * Stage B: Landing Page
   * Active plateau between 1.0H and 2.0H
   */
  isLandingActive: boolean;
  landingOpacity: number;
  landingScale: number;
  landingTranslateZ: number;
  /**
   * Stage C: Magical Tunnel Transition
   * 0.0 = not started
   * 1.0 = camera passed through tunnel into Frame 0
   */
  progressC: number;
  /**
   * Stage D: Tree-Growth Timelapse
   * 0.0 = sapling (Frame 0)
   * 1.0 = fully mature golden tree (Frame 239)
   */
  progressD: number;
  /**
   * Stage E: Portfolio Sections
   * 0.0 = tree timelapse finishes
   * 1.0 = end of portfolio content
   */
  progressE: number;
  scrollToStage: (stage: 'loader' | 'landing' | 'tunnel' | 'tree' | 'portfolio') => void;
}

export function useScrollCoordinator(isLocked: boolean = false): ScrollStages {
  const [scrollY, setScrollY] = useState(0);
  const [viewportHeight, setViewportHeight] = useState(
    typeof window !== 'undefined' ? window.innerHeight : 900
  );

  const tickingRef = useRef(false);
  const rafIdRef = useRef<number | null>(null);
  const lastNormalizedPosRef = useRef(0);
  // Track that we have verified window.scrollY is truly at 0 after the initial lock is released
  const isZeroConfirmedRef = useRef(false);

  // Stage boundaries defined in Viewport Height (H) multipliers
  // Stage A: 0.0H to 1.2H (1.2H span)
  // Stage B: 1.0H to 2.6H (interactive plateau: 1.2H to 2.0H)
  // Stage C: 2.0H to 3.6H (1.6H span)
  // Stage D: 3.6H to 8.6H (5.0H span)
  // Stage E: 8.6H to 10.5H (1.9H span)
  const totalTrackHeight = Math.round(10.5 * viewportHeight);

  // 1. Post-mount defense & zero verification
  useEffect(() => {
    if (typeof window !== 'undefined') {
      if ('scrollRestoration' in history) {
        history.scrollRestoration = 'manual';
      }
      if (window.scrollY !== 0) {
        window.scrollTo(0, 0);
      }
    }
  }, []);

  // 2. Transition synchronization: when isLocked is true, zero is not yet confirmed for normal scrolling
  useEffect(() => {
    if (isLocked) {
      isZeroConfirmedRef.current = false;
      if (window.scrollY !== 0) {
        window.scrollTo(0, 0);
      }
      setScrollY(0);
      lastNormalizedPosRef.current = 0;
    } else {
      // Unlocking: enforce window.scrollY === 0
      if (window.scrollY !== 0) {
        window.scrollTo(0, 0);
      } else {
        isZeroConfirmedRef.current = true;
      }
      setScrollY(0);
      lastNormalizedPosRef.current = 0;
    }
  }, [isLocked]);

  // 3. Passive, throttled scroll handler guarded by isLocked with RAF cancellation on transition
  useEffect(() => {
    const handleScroll = () => {
      if (!tickingRef.current) {
        tickingRef.current = true;
        rafIdRef.current = requestAnimationFrame(() => {
          const currentY = window.scrollY || window.pageYOffset || 0;

          // While locked during initial loader, enforce 0 and prevent normalization contamination
          if (isLocked) {
            if (currentY !== 0) {
              window.scrollTo(0, 0);
            }
            setScrollY(0);
            lastNormalizedPosRef.current = 0;
            tickingRef.current = false;
            return;
          }

          // Edge case safeguard: after unlocking, verify that window.scrollY has confirmed zero
          // before accepting normal scroll updates. If a spurious or layout scroll arrives before zero is confirmed:
          if (!isZeroConfirmedRef.current) {
            if (currentY !== 0) {
              window.scrollTo(0, 0);
              setScrollY(0);
              lastNormalizedPosRef.current = 0;
              tickingRef.current = false;
              return;
            } else {
              isZeroConfirmedRef.current = true;
            }
          }

          setScrollY(currentY);
          if (totalTrackHeight > 0) {
            lastNormalizedPosRef.current = currentY / totalTrackHeight;
          }
          tickingRef.current = false;
        });
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (rafIdRef.current !== null) {
        cancelAnimationFrame(rafIdRef.current);
        rafIdRef.current = null;
      }
      tickingRef.current = false;
    };
  }, [totalTrackHeight, isLocked]);

  // 4. Viewport resize and visualViewport handler (prevents jump on mobile toolbar or orientation change)
  useEffect(() => {
    const handleResize = () => {
      const newH = window.innerHeight;
      const prevNormalized = lastNormalizedPosRef.current;
      setViewportHeight(newH);

      // Smoothly preserve normalized relative position if user had scrolled and not locked
      if (!isLocked && isZeroConfirmedRef.current && prevNormalized > 0) {
        const newTargetY = prevNormalized * (10.5 * newH);
        window.scrollTo({ top: newTargetY, behavior: 'instant' });
      }
    };

    window.addEventListener('resize', handleResize, { passive: true });
    if (window.visualViewport) {
      window.visualViewport.addEventListener('resize', handleResize);
    }

    return () => {
      window.removeEventListener('resize', handleResize);
      if (window.visualViewport) {
        window.visualViewport.removeEventListener('resize', handleResize);
      }
    };
  }, [isLocked]);

  // Compute stage progress variables (strictly deterministic and reversible from scrollY)
  const H = viewportHeight;

  // 1. Stage A: Loader (0.0H to 1.2H)
  const progressA = Math.max(0, Math.min(1, scrollY / (1.2 * H)));

  // 2. Stage B: Landing Scene
  // Fades in as loader recedes (0.0H to 1.2H), stays 100% through 2.0H, then scales/fades in tunnel (2.0H to 3.6H)
  let landingOpacity = 1;
  let landingScale = 1;
  let landingTranslateZ = 0;

  if (scrollY < 1.2 * H) {
    // Emerging underneath loader
    const tEnter = Math.max(0, Math.min(1, scrollY / (1.0 * H)));
    landingOpacity = tEnter;
    landingScale = 0.94 + 0.06 * tEnter;
    landingTranslateZ = -100 * (1 - tEnter);
  } else if (scrollY <= 2.0 * H) {
    // Pinned active engagement plateau
    landingOpacity = 1;
    landingScale = 1;
    landingTranslateZ = 0;
  } else if (scrollY <= 3.6 * H) {
    // Scaling down into 3D perspective during tunnel transition
    const tExit = Math.max(0, Math.min(1, (scrollY - 2.0 * H) / (1.6 * H)));
    landingOpacity = Math.max(0, 1 - tExit * 2.5); // Fades out by progress 0.4
    landingScale = 1 - 0.35 * tExit;
    landingTranslateZ = -350 * tExit;
  } else {
    landingOpacity = 0;
    landingScale = 0.65;
    landingTranslateZ = -350;
  }

  const isLandingActive = scrollY >= 0.8 * H && scrollY <= 2.2 * H;

  // 3. Stage C: Magical Tunnel Transition (2.0H to 3.6H)
  const progressC = Math.max(0, Math.min(1, (scrollY - 2.0 * H) / (1.6 * H)));

  // 4. Stage D: Tree Timelapse (3.6H to 8.6H)
  const progressD = Math.max(0, Math.min(1, (scrollY - 3.6 * H) / (5.0 * H)));

  // 5. Stage E: Portfolio Sections (8.6H to 10.5H)
  const progressE = Math.max(0, Math.min(1, (scrollY - 8.6 * H) / (1.9 * H)));

  const scrollToStage = useCallback(
    (stage: 'loader' | 'landing' | 'tunnel' | 'tree' | 'portfolio') => {
      isZeroConfirmedRef.current = true;
      let targetY = 0;
      switch (stage) {
        case 'loader':
          targetY = 0;
          break;
        case 'landing':
          targetY = 1.35 * H;
          break;
        case 'tunnel':
          targetY = 2.4 * H;
          break;
        case 'tree':
          targetY = 3.65 * H;
          break;
        case 'portfolio':
          targetY = 8.7 * H;
          break;
      }
      window.scrollTo({ top: targetY, behavior: 'smooth' });
    },
    [H]
  );

  return {
    scrollY,
    viewportHeight,
    totalTrackHeight,
    progressA,
    isLandingActive,
    landingOpacity,
    landingScale,
    landingTranslateZ,
    progressC,
    progressD,
    progressE,
    scrollToStage,
  };
}
