/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { PhoenixLoaderStage } from './components/PhoenixLoaderStage';
import { MagicTunnelTransition } from './components/MagicTunnelTransition';
import { TreeTimelapseStage } from './components/TreeTimelapseStage';
import { PortfolioShowcaseStage } from './components/PortfolioShowcaseStage';
import { CursorSparkles } from './components/CursorSparkles';
import { MagicCircle } from './components/MagicCircle';
import { ForestScene } from './components/ForestScene';
import { NavigationButtons } from './components/NavigationButtons';
import { SectionModal, SectionId } from './components/SectionModal';
import { SocialIcons } from './components/SocialIcons';
import { ScrollProgressIndicator } from './components/ScrollProgressIndicator';
import { PROFILE_CONFIG } from './config/profile';
import { LANDING_SETTINGS, MAGIC_CIRCLE_SETTINGS, getPositionStyle } from './config/landingSettings';
import { useScrollCoordinator } from './utils/useScrollCoordinator';
import {
  calculateProximityProgress,
  calculateMaxRevealRadius,
  stepRevealProgress,
  easeOutCubic,
} from './utils/magicCircle';

import { CARD_SNAP_CENTERS } from './config/cards/sharedCardSettings';


export default function App() {
  const [cursorPos, setCursorPos] = useState<{ x: number; y: number }>({ x: -100, y: -100 });
  const [isMoving, setIsMoving] = useState(false);
  const [isDesktop, setIsDesktop] = useState(true);

  // Active section modal state (Projects, Skills, Achievements, Contact)
  const [activeSection, setActiveSection] = useState<SectionId>(null);

  // Scroll Lock during initial Phoenix V loader sequence
  const [isLoaderLoading, setIsLoaderLoading] = useState(() => {
    if (typeof window !== 'undefined' && window.Loader2Coin && typeof window.Loader2Coin.getProgress === 'function') {
      return window.Loader2Coin.getProgress() < 1;
    }
    return true;
  });
  const hasCompletedInitialLoadRef = useRef(false);

  // Unified Scroll Coordinator (locked during initial loader sequence)
  const {
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
  } = useScrollCoordinator(isLoaderLoading);

  // Dynamic Stage D Scroll Attraction:
  // Scopes CSS proximity snapping exclusively to Stage D tree milestone cards,
  // completely disabling it in Stages A, B, C, and E, or if reduced-motion is requested.
  useEffect(() => {
    const isTreeStageActive = progressD > 0.02 && progressD < 0.96 && progressE === 0;
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');

    const updateSnap = () => {
      if (mediaQuery.matches || !isTreeStageActive) {
        document.documentElement.style.removeProperty('scroll-snap-type');
      } else {
        document.documentElement.style.scrollSnapType = 'y proximity';
      }
    };

    updateSnap();

    if (typeof mediaQuery.addEventListener === 'function') {
      mediaQuery.addEventListener('change', updateSnap);
      return () => {
        mediaQuery.removeEventListener('change', updateSnap);
        document.documentElement.style.removeProperty('scroll-snap-type');
      };
    }

    return () => {
      document.documentElement.style.removeProperty('scroll-snap-type');
    };
  }, [progressD, progressE]);

  const handleLoaderComplete = useCallback(() => {
    hasCompletedInitialLoadRef.current = true;
    setIsLoaderLoading(false);
  }, []);

  // Listen for loader completion to release the scroll lock
  useEffect(() => {
    if (hasCompletedInitialLoadRef.current) {
      setIsLoaderLoading(false);
      return;
    }

    if (window.Loader2Coin && typeof window.Loader2Coin.getProgress === 'function' && window.Loader2Coin.getProgress() >= 1) {
      hasCompletedInitialLoadRef.current = true;
      setIsLoaderLoading(false);
      return;
    }

    let fallbackTimer: number;

    const unlockScroll = () => {
      if (hasCompletedInitialLoadRef.current) return;
      hasCompletedInitialLoadRef.current = true;
      if (fallbackTimer) window.clearTimeout(fallbackTimer);
      if (window.scrollY !== 0) {
        window.scrollTo(0, 0);
      }
      setIsLoaderLoading(false);
    };

    window.addEventListener('loader2Completed', unlockScroll, { once: true });

    // Safety fallback: loader timed sequence is ~3.5s; 6.5s timeout guarantees page never stays locked
    fallbackTimer = window.setTimeout(unlockScroll, 6500);

    return () => {
      window.removeEventListener('loader2Completed', unlockScroll);
      window.clearTimeout(fallbackTimer);
    };
  }, []);

  // Enforce scroll lock strictly during the initial loading sequence
  useEffect(() => {
    if (!isLoaderLoading) return;

    const preventScroll = (e: Event) => {
      e.preventDefault();
    };

    const preventScrollKeys = (e: KeyboardEvent) => {
      const scrollKeys = ['ArrowDown', 'ArrowUp', 'PageDown', 'PageUp', 'Home', 'End', ' ', 'Spacebar'];
      if (scrollKeys.includes(e.key)) {
        e.preventDefault();
      }
    };

    const originalHtmlOverflowY = document.documentElement.style.overflowY;
    const originalBodyOverflowY = document.body.style.overflowY;

    document.documentElement.style.overflowY = 'hidden';
    document.body.style.overflowY = 'hidden';

    window.addEventListener('wheel', preventScroll, { passive: false });
    window.addEventListener('touchmove', preventScroll, { passive: false });
    window.addEventListener('keydown', preventScrollKeys);

    return () => {
      document.documentElement.style.overflowY = originalHtmlOverflowY;
      document.body.style.overflowY = originalBodyOverflowY;
      window.removeEventListener('wheel', preventScroll);
      window.removeEventListener('touchmove', preventScroll);
      window.removeEventListener('keydown', preventScrollKeys);
      if (window.scrollY !== 0) {
        window.scrollTo(0, 0);
      }
    };
  }, [isLoaderLoading]);

  // Viewport metrics
  const [viewport, setViewport] = useState<{ width: number; height: number }>({
    width: typeof window !== 'undefined' ? window.innerWidth : 1440,
    height: typeof window !== 'undefined' ? window.innerHeight : 900,
  });

  // Fixed middle-left reveal hotspot location & expanded configurable activation width
  const hotspotXRatio = viewport.width < 768 ? 0.16 : (MAGIC_CIRCLE_SETTINGS.hotspotXPercent / 100);
  const hotspot = {
    x: viewport.width * hotspotXRatio,
    y: viewport.height * (MAGIC_CIRCLE_SETTINGS.hotspotYPercent / 100),
  };

  const activationWidth = viewport.width * (MAGIC_CIRCLE_SETTINGS.activationWidthPercent / 100);

  const maxRadius = calculateMaxRevealRadius(
    viewport.width,
    viewport.height,
    hotspot.x,
    hotspot.y
  );

  // Proximity State: calculated from cursor distance to fixed hotspot
  const [proximity, setProximity] = useState({
    distance: 9999,
    progress: 0,
    isComplete: false,
    opacity: 0,
  });

  // Reveal Animation State & Permanent Retention
  const [isHolding, setIsHolding] = useState(false);
  const [revealProgress, setRevealProgress] = useState(0);
  const [isPermanentlyRevealed, setIsPermanentlyRevealed] = useState(false);

  const moveTimeoutRef = useRef<number | null>(null);
  const isHoldingRef = useRef(false);
  const isCompleteRef = useRef(false);
  const isPermanentlyRevealedRef = useRef(false);
  const lingerUntilRef = useRef<number>(0);
  const animFrameRef = useRef<number | null>(null);

  isHoldingRef.current = isHolding;
  isCompleteRef.current = proximity.isComplete;
  isPermanentlyRevealedRef.current = isPermanentlyRevealed;

  // Viewport resize handling
  useEffect(() => {
    const handleResize = () => {
      setViewport({
        width: window.innerWidth,
        height: window.innerHeight,
      });
      setIsDesktop(!('ontouchstart' in window) || window.innerWidth >= 768);
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Update proximity based on cursor distance to fixed hotspot & expanded 60% activation width
  useEffect(() => {
    if (isPermanentlyRevealed || cursorPos.x < 0 || cursorPos.y < 0) return;
    const prox = calculateProximityProgress(
      cursorPos.x,
      cursorPos.y,
      hotspot.x,
      hotspot.y,
      Math.min(viewport.width * 0.28, 240), // sphere of influence
      MAGIC_CIRCLE_SETTINGS.triggerSnapRadius, // trigger snap radius
      activationWidth,
      viewport.height
    );
    setProximity(prox);
  }, [cursorPos, hotspot.x, hotspot.y, activationWidth, viewport.height, isPermanentlyRevealed]);

  // Main reveal animation loop: expands on hold, becomes permanent at 100%
  useEffect(() => {
    let lastTime = performance.now();

    const updateLoop = (now: number) => {
      const dt = Math.min((now - lastTime) / 1000, 0.1);
      lastTime = now;

      setRevealProgress((prev) => {
        if (isPermanentlyRevealedRef.current) {
          return 1;
        }

        if (isHoldingRef.current) {
          // Smooth organic expansion originating from hotspot
          const next = stepRevealProgress(prev, true, 1.15, 0.7, dt);
          if (next >= 0.998) {
            // Reached 100%: locks in permanently as requested
            setIsPermanentlyRevealed(true);
            isPermanentlyRevealedRef.current = true;
            return 1;
          }
          return next;
        } else {
          // If released before 100%, linger then contract
          if (now < lingerUntilRef.current) {
            return prev;
          }
          const next = stepRevealProgress(prev, false, 1.15, 0.75, dt);
          return next;
        }
      });

      animFrameRef.current = requestAnimationFrame(updateLoop);
    };

    animFrameRef.current = requestAnimationFrame(updateLoop);
    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, []);

  // Global window mouse movement tracking for seamless shared cursor everywhere
  useEffect(() => {
    if (!isDesktop) return;

    const handleGlobalMouseMove = (e: MouseEvent) => {
      setCursorPos({ x: e.clientX, y: e.clientY });
      setIsMoving(true);

      if (moveTimeoutRef.current) {
        window.clearTimeout(moveTimeoutRef.current);
      }

      moveTimeoutRef.current = window.setTimeout(() => {
        setIsMoving(false);
      }, 120);
    };

    const handleGlobalMouseLeave = () => {
      setIsMoving(false);
      if (!isPermanentlyRevealedRef.current) {
        setIsHolding(false);
      }
      setCursorPos({ x: -100, y: -100 });
    };

    window.addEventListener('mousemove', handleGlobalMouseMove, { passive: true });
    window.addEventListener('mouseleave', handleGlobalMouseLeave);

    return () => {
      window.removeEventListener('mousemove', handleGlobalMouseMove);
      window.removeEventListener('mouseleave', handleGlobalMouseLeave);
    };
  }, [isDesktop]);

  // Mouse down: LEFT mouse button (e.button === 0) activates reveal when circle is complete
  const handleMouseDown = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (e.button === 0) {
      if (isPermanentlyRevealedRef.current) return;
      if (isCompleteRef.current) {
        e.preventDefault();
        setIsHolding(true);
      }
    }
  }, []);

  // Mouse up: Release
  const handleMouseUp = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (e.button === 0) {
      // If permanently revealed, releasing does NOT close or shrink!
      if (isPermanentlyRevealedRef.current) {
        return;
      }
      if (isHoldingRef.current) {
        setIsHolding(false);
        lingerUntilRef.current = performance.now() + 400;
      }
    }
  }, []);

  // Mobile Touch handlers
  const handleTouchStart = useCallback(
    (e: React.TouchEvent<HTMLDivElement>) => {
      if (isPermanentlyRevealedRef.current) return;
      if (e.touches.length > 0) {
        const touch = e.touches[0];
        setCursorPos({ x: touch.clientX, y: touch.clientY });
        setIsMoving(true);

        const prox = calculateProximityProgress(
          touch.clientX,
          touch.clientY,
          hotspot.x,
          hotspot.y,
          Math.min(viewport.width * 0.35, 240),
          MAGIC_CIRCLE_SETTINGS.triggerSnapRadius,
          activationWidth,
          viewport.height
        );
        setProximity(prox);

        if (prox.isComplete) {
          setIsHolding(true);
        }
      }
    },
    [hotspot.x, hotspot.y, activationWidth, viewport.height]
  );

  const handleTouchMove = useCallback(
    (e: React.TouchEvent<HTMLDivElement>) => {
      if (isPermanentlyRevealedRef.current) return;
      if (e.touches.length > 0) {
        const touch = e.touches[0];
        setCursorPos({ x: touch.clientX, y: touch.clientY });
        setIsMoving(true);

        const prox = calculateProximityProgress(
          touch.clientX,
          touch.clientY,
          hotspot.x,
          hotspot.y,
          Math.min(viewport.width * 0.35, 240),
          MAGIC_CIRCLE_SETTINGS.triggerSnapRadius,
          activationWidth,
          viewport.height
        );
        setProximity(prox);

        if (prox.isComplete && !isHoldingRef.current) {
          setIsHolding(true);
        }
      }
    },
    [hotspot.x, hotspot.y, activationWidth, viewport.height]
  );

  const handleTouchEnd = useCallback(() => {
    setIsMoving(false);
    if (isPermanentlyRevealedRef.current) return;
    if (isHoldingRef.current) {
      setIsHolding(false);
      lingerUntilRef.current = performance.now() + 400;
    }
  }, []);

  // Target milestone navigation state for Stage D tree milestones
  const [navigatedMilestone, setNavigatedMilestone] = useState<{
    id: string;
    targetD: number;
    timestamp: number;
  } | null>(null);

  // Navigation: Home button returns cleanly to the Landing stage without wipe
  const handleHomeClick = useCallback(() => {
    setActiveSection(null);
    setNavigatedMilestone(null);
    scrollToStage('landing');
    // If user is already on the landing stage and clicks home, toggles reset
    if (scrollY <= 2.2 * viewportHeight && isPermanentlyRevealedRef.current) {
      setIsPermanentlyRevealed(false);
      isPermanentlyRevealedRef.current = false;
      setIsHolding(false);
      isHoldingRef.current = false;
      setRevealProgress(0);
    }
  }, [scrollToStage, scrollY, viewportHeight]);

  // Smoothly scrolls to the targeted Stage D milestone card and sets target state for opacity activation
  const handleNavigateMilestone = useCallback(
    (milestoneId: 'projects' | 'skills' | 'about' | 'contact') => {
      const snap = CARD_SNAP_CENTERS.find((s) => s.id === milestoneId);
      if (!snap) return;

      setActiveSection(null);

      const targetY = Math.round((3.6 + snap.centerD * 5.0) * viewportHeight);
      const prefersReducedMotion =
        typeof window !== 'undefined' &&
        window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      const behavior: ScrollBehavior = prefersReducedMotion ? 'auto' : 'smooth';

      window.scrollTo({ top: targetY, behavior });

      setNavigatedMilestone({
        id: milestoneId,
        targetD: snap.centerD,
        timestamp: Date.now(),
      });
    },
    [viewportHeight]
  );

  // Cancel pending milestone navigation on user manual scroll input
  useEffect(() => {
    if (!navigatedMilestone) return;

    const handleUserInterrupt = () => {
      setNavigatedMilestone(null);
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      const keys = ['ArrowDown', 'ArrowUp', 'PageDown', 'PageUp', 'Home', 'End', ' ', 'Spacebar'];
      if (keys.includes(e.key)) {
        setNavigatedMilestone(null);
      }
    };

    window.addEventListener('wheel', handleUserInterrupt, { passive: true });
    window.addEventListener('touchmove', handleUserInterrupt, { passive: true });
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('wheel', handleUserInterrupt);
      window.removeEventListener('touchmove', handleUserInterrupt);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [navigatedMilestone]);

  const smoothRevealProgress = isPermanentlyRevealed ? 1 : easeOutCubic(revealProgress);
  const isForestDominant = isPermanentlyRevealed || smoothRevealProgress > 0.85;

  return (
    <main
      className="relative w-full min-h-screen bg-black select-none cursor-none text-white overflow-x-hidden"
      style={{ touchAction: 'pan-y' }}
      data-testid="portfolio-container"
      data-state={isForestDominant ? 'revealed' : 'monochrome'}
    >
      {/* ====================================================================
          VIRTUAL SCROLL TRACK: Creates standard native smooth scroll depth
          Total height = 10.5H (~1050vh), calculated dynamically
          ==================================================================== */}
      <div
        style={{ height: `${totalTrackHeight}px` }}
        className="w-full pointer-events-none relative"
        aria-hidden="true"
      >
        {/* Stage D Milestone Card Subtle Scroll Attraction Snap Anchors */}
        {CARD_SNAP_CENTERS.map((snap) => (
          <div
            key={snap.id}
            style={{
              position: 'absolute',
              top: `${Math.round((3.6 + snap.centerD * 5.0) * viewportHeight)}px`,
              left: 0,
              width: '100%',
              height: '2px',
              opacity: 0,
              pointerEvents: 'none',
              scrollSnapAlign: 'start',
            }}
            aria-hidden="true"
          />
        ))}
      </div>

      {/* ====================================================================
          STAGE A: PHOENIX V LOADER (z-index: 30)
          Opens on initial load; smoothly fades, scales down, and recedes
          into depth as the user scrolls down (0.0H to 1.2H)
          ==================================================================== */}
      <PhoenixLoaderStage progress={progressA} onComplete={handleLoaderComplete} />

      {/* ====================================================================
          STAGE C: SCROLL-DRIVEN MAGICAL TUNNEL TRANSITION (z-index: 25)
          Forms in center of landing scene (2.0H), camera flies through
          concentric 3D glowing rings and particle vortex into Tree Frame 0
          ==================================================================== */}
      <MagicTunnelTransition progress={progressC} />

      {/* ====================================================================
          STAGE B: LANDING INTRO & MAGIC CIRCLE REVEAL (z-index: 20)
          Persistently mounted across all stages; transforms into 3D depth
          during the tunnel transition without unmounting or resetting
          ==================================================================== */}
      <div
        className="fixed inset-0 z-20 w-screen h-screen min-h-[100dvh] overflow-hidden bg-black select-none"
        style={{
          opacity: landingOpacity,
          transform: `perspective(1000px) scale(${landingScale}) translateZ(${landingTranslateZ}px)`,
          pointerEvents: isLandingActive ? 'auto' : 'none',
          visibility: landingOpacity > 0.005 ? 'visible' : 'hidden',
          transition: 'none',
        }}
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onTouchCancel={handleTouchEnd}
      >
        {/* Full-Viewport Fantasy Forest Scene with Embedded "Vishal V" */}
        <ForestScene
          revealProgress={smoothRevealProgress}
          hotspotX={hotspot.x}
          hotspotY={hotspot.y}
          maxRadius={maxRadius}
          isPermanent={isPermanentlyRevealed}
        />

        {/* Circular Reveal Hint: follows cursor, active only prior to permanent reveal */}
        {!isPermanentlyRevealed && (
          <MagicCircle
            cursorX={cursorPos.x}
            cursorY={cursorPos.y}
            progress={proximity.progress}
            isComplete={proximity.isComplete}
            opacity={proximity.opacity}
            isRevealing={smoothRevealProgress > 0.05}
          />
        )}


        {/* DEFAULT SCREEN CONTENT: Centered Introduction Group, Tagline & Social Icons */}
        <div
          className="fixed inset-0 z-20 flex flex-col items-center justify-center text-center px-4 pointer-events-none select-none transition-opacity duration-300"
          style={{
            opacity: isPermanentlyRevealed ? 0 : Math.max(0, 1 - smoothRevealProgress * 1.35),
            pointerEvents: isPermanentlyRevealed || smoothRevealProgress > 0.4 ? 'none' : 'auto',
          }}
          aria-label="Introduction"
        >
          <div
            className="flex flex-col items-center justify-center max-w-2xl mx-auto"
            style={getPositionStyle(LANDING_SETTINGS.defaultIntro.introGroup, !isDesktop)}
          >
            {/* Small text above: "Hi there," */}
            <div
              className="font-cormorant text-xl sm:text-2xl md:text-3xl text-[#fcfcfb]/85 font-normal tracking-wide mb-1 sm:mb-2 animate-ethereal-entrance"
              style={getPositionStyle(LANDING_SETTINGS.defaultIntro.greeting, !isDesktop)}
            >
              {PROFILE_CONFIG.introGreeting}
            </div>

            {/* Main line: "Vishal V" + "here" on the same line */}
            <div className="flex items-baseline justify-center flex-wrap gap-x-3 sm:gap-x-4 mb-4 sm:mb-5 animate-ethereal-entrance">
              <h1
                className="font-cormorant text-[clamp(2.5rem,7vw,6.5rem)] font-medium text-center whitespace-nowrap leading-none text-[#fcfcfb] tracking-[0.08em]"
                style={getPositionStyle(LANDING_SETTINGS.defaultIntro.heading, !isDesktop)}
              >
                {PROFILE_CONFIG.name}
              </h1>
              <span
                className="font-cormorant text-xl sm:text-2xl md:text-3xl text-[#fcfcfb]/85 font-normal tracking-wide inline-block"
                style={getPositionStyle(LANDING_SETTINGS.defaultIntro.suffix, !isDesktop)}
              >
                {PROFILE_CONFIG.introSuffix}
              </span>
            </div>

            {/* Tagline */}
            <p
              className="font-sans text-xs sm:text-sm md:text-base text-[#fcfcfb]/90 font-light tracking-wide max-w-lg leading-relaxed mb-2 sm:mb-2.5 animate-ethereal-entrance px-4"
              style={getPositionStyle(LANDING_SETTINGS.defaultIntro.tagline, !isDesktop)}
            >
              {PROFILE_CONFIG.tagline}
            </p>

            {/* Location (Default Intro: small understated plain text) */}
            <div
              className="font-sans text-[11px] sm:text-xs text-[#fcfcfb]/70 font-light tracking-[0.14em] uppercase mb-6 sm:mb-8 animate-ethereal-entrance px-4 select-none"
              style={getPositionStyle(LANDING_SETTINGS.defaultIntro.tagline, !isDesktop)}
            >
              {PROFILE_CONFIG.location}
            </div>

            {/* 3 Clickable Social / Contact Icons */}
            <div
              className="animate-ethereal-entrance"
              style={getPositionStyle(LANDING_SETTINGS.defaultIntro.socialIcons, !isDesktop)}
            >
              <SocialIcons />
            </div>
          </div>
        </div>

        {/* REVEALED FOREST SCREEN CONTENT: Tagline & Social Icons beneath embedded name */}
        <div
          className="fixed inset-x-0 bottom-8 sm:bottom-12 md:bottom-14 z-20 flex flex-col items-center justify-center text-center px-4 pointer-events-none select-none transition-opacity duration-500"
          style={{
            opacity: isPermanentlyRevealed ? 1 : Math.max(0, (smoothRevealProgress - 0.75) / 0.25),
            pointerEvents: isForestDominant ? 'auto' : 'none',
            ...getPositionStyle(LANDING_SETTINGS.forestReveal.bottomGroup, !isDesktop),
          }}
        >
          {/* Tagline & Location Container */}
          <div
            className="relative flex flex-col items-center justify-center pointer-events-auto select-none"
            style={getPositionStyle(LANDING_SETTINGS.forestReveal.tagline, !isDesktop)}
          >
            {/* Tagline: Restored translucent dark glassmorphism capsule */}
            <p
              className="font-sans text-xs sm:text-sm md:text-base text-[#fcfcfb] font-normal tracking-wide max-w-md sm:max-w-lg leading-relaxed px-5 py-2 rounded-full bg-black/45 backdrop-blur-md border border-white/10 shadow-2xl text-center"
              style={{
                textShadow: '0 2px 14px rgba(0, 0, 0, 0.95), 0 0 25px rgba(0, 0, 0, 0.85)',
              }}
            >
              {PROFILE_CONFIG.tagline}
            </p>

            {/* Location capsule: Subtle translucent dark glassmorphism */}
            <div
              className="mt-2 sm:mt-2.5 mb-4 sm:mb-5 px-3.5 sm:px-4 py-1 sm:py-1.5 rounded-full bg-black/35 backdrop-blur-md border border-white/10 shadow-lg inline-flex items-center justify-center select-none"
            >
              <span
                className="font-sans text-[10px] sm:text-[11px] text-[#fcfcfb]/85 font-normal tracking-[0.15em] uppercase text-center"
                style={{
                  textShadow: '0 1px 8px rgba(0, 0, 0, 0.9), 0 0 15px rgba(0, 0, 0, 0.8)',
                }}
              >
                {PROFILE_CONFIG.location}
              </span>
            </div>
          </div>

          <SocialIcons
            isForest
            style={getPositionStyle(LANDING_SETTINGS.forestReveal.socialIcons, !isDesktop)}
          />
        </div>
      </div>

      {/* ====================================================================
          STAGE D: TREE-GROWTH TIMELAPSE (z-index: 10)
          Cover canvas preloading 240 sequential frames, scrubbing 0 to 239
          over 3.6H to 8.6H, with Frame 0 ready immediately for tunnel exit
          ==================================================================== */}
      <TreeTimelapseStage
        progress={progressD}
        tunnelProgress={progressC}
        isVisible={progressC > 0.4 || progressD > 0 || progressE > 0}
      />

      {/* ====================================================================
          STAGE D/E: PORTFOLIO SHOWCASE & CONTENT (z-index: 15)
          Revealed over growing tree backdrop (Stage D) & mature tree (Stage E)
          ==================================================================== */}
      <PortfolioShowcaseStage
        treeProgress={progressD}
        progress={progressE}
        targetMilestone={navigatedMilestone}
        onMilestoneArrived={() => setNavigatedMilestone(null)}
      />

      {/* ====================================================================
          SHARED GOLDEN SPARKLE CUSTOM CURSOR (z-index: 60)
          Consistently active across all stages (Loader, Landing, Tunnel, Tree, Showcase)
          ==================================================================== */}
      {isDesktop && (
        <div className="fixed inset-0 pointer-events-none select-none z-[60]">
          <CursorSparkles
            cursorX={cursorPos.x}
            cursorY={cursorPos.y}
            isMoving={isMoving}
            isActive={cursorPos.x >= 0 && cursorPos.y >= 0}
          />
        </div>
      )}

      {/* ====================================================================
          DESKTOP GOLDEN SCROLL PROGRESS INDICATOR (z-index: 45)
          Minimal, ethereal glowing line segment along viewport right edge;
          exclusively rendered on desktop viewports (>=768px), hidden during loader
          ==================================================================== */}
      {isDesktop && (
        <ScrollProgressIndicator
          scrollY={scrollY}
          viewportHeight={viewportHeight}
          totalTrackHeight={totalTrackHeight}
          isVisible={progressA > 0.5 && !isLoaderLoading}
        />
      )}

      {/* ====================================================================
          FIXED UI OVERLAYS (z-index: 40 & 50)
          Navigation buttons & Section Modals
          Hidden during Stage A (Phoenix V loader) and smoothly revealed for Stage B+
          ==================================================================== */}
      <NavigationButtons
        onSelectSection={(sec) => setActiveSection(sec)}
        onNavigateMilestone={handleNavigateMilestone}
        onHomeClick={handleHomeClick}
        isRevealed={isForestDominant}
        isMobile={!isDesktop}
        style={{
          opacity: progressA <= 0.6 ? 0 : Math.min(1, (progressA - 0.6) / 0.4),
          pointerEvents: progressA > 0.85 ? 'auto' : 'none',
          visibility: progressA <= 0.5 ? 'hidden' : 'visible',
          transition: 'opacity 0.25s ease-out',
        }}
      />

      <SectionModal
        activeSection={activeSection}
        onClose={() => setActiveSection(null)}
      />
                    </main>
  );
}
