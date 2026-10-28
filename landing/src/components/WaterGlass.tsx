/**
 * ============================================================================
 * ENCHANTED WATER GLASS UI - REUSABLE COMPONENT
 * ============================================================================
 * Ultra-realistic optical liquid glass component inspired by:
 * - Image 1: Crystal liquid water capsule with specular highlights & golden sparkles
 * - Image 2: Prismatic iridescent capsule with chromatic edge dispersion,
 *   cyan bottom bounce light, emerald green tint, and corner bubble glint.
 * ============================================================================
 */

import React, { useRef, useState, useCallback } from 'react';
import './WaterGlass.css';
import { WATER_GLASS_SETTINGS, getWaterGlassCssVariables } from '../config/waterGlassSettings';

export type WaterGlassVariant = 'nav' | 'icon' | 'panel' | 'custom';
export type WaterGlassTheme = 'prismatic' | 'crystal' | 'gold';
export type WaterGlassElevation = 'subtle' | 'medium' | 'deep';

export interface WaterGlassProps extends React.HTMLAttributes<HTMLElement> {
  /**
   * Component variant tailored for different UI roles.
   * - 'nav': compact pill capsule for navigation links or action buttons
   * - 'icon': circular glass disk for social links or actions
   * - 'panel': larger rounded rectangular card for content showcases
   * - 'custom': raw water-glass surface without variant-specific sizing
   * @default 'nav'
   */
  variant?: WaterGlassVariant;

  /**
   * Optical aesthetic theme:
   * - 'prismatic': Iridescent spectral dispersion (Image 2 - YOUR TEXT)
   *   with golden amber top rim, emerald accent, and glowing cyan bottom bounce.
   * - 'crystal': Ultra-clear liquid water capsule (Image 1 - Generate)
   *   with pristine specular highlights and high transparency.
   * - 'gold': Deep obsidian water pool with warm golden dust & amber caustics.
   * @default 'prismatic'
   */
  theme?: WaterGlassTheme;

  /**
   * Rendered HTML element tag.
   * Defaults to 'button' for 'nav' and 'icon', and 'div' for 'panel'.
   */
  as?: 'button' | 'a' | 'div';

  /**
   * Link destination when rendered as an anchor ('a').
   */
  href?: string;

  target?: string;

  rel?: string;

  /**
   * Disables interactive states and click handling.
   * @default false
   */
  disabled?: boolean;

  /**
   * Whether to render the specular corner bubble glint bead
   * prominently seen at ~10 o'clock on Image 2.
   * @default true
   */
  showGlint?: boolean;

  /**
   * Whether to display golden 4-point sparkle stars alongside content,
   * matching Image 1's "Generate ✨" aesthetic.
   * @default false
   */
  sparkles?: boolean;

  /**
   * Forces dark charcoal text coloring for light backdrops
   * matching Image 1's "Generate" text on gray.
   * @default false
   */
  darkText?: boolean;

  /**
   * Adds subtle downward caustic reflection/shadow under text
   * matching Image 1's text reflection.
   * @default true
   */
  textReflection?: boolean;

  /**
   * Overall water glass effect intensity multiplier (0.0 to 2.0).
   * @default 1.0
   */
  intensity?: number;

  /**
   * Warm golden reflection strength multiplier (0.0 to 2.0).
   * @default 1.0
   */
  goldReflection?: number;

  /**
   * Glass refraction blur amount in pixels.
   * @default 16
   */
  blurAmount?: number;

  /**
   * Outer ambient shadow depth level.
   * @default 'medium'
   */
  elevation?: WaterGlassElevation;

  /**
   * Whether hover shimmer and reflections are enabled.
   * @default true
   */
  interactive?: boolean;

  /**
   * Whether to spawn a subtle water ripple when the pointer enters the surface.
   * @default true
   */
  rippleOnHover?: boolean;

  /**
   * Whether to spawn an expanding water ripple when the user clicks or taps.
   * @default true
   */
  rippleOnClick?: boolean;

  /**
   * Optional inline styles for custom dimensions, border-radius, or padding.
   */
  style?: React.CSSProperties;

  /**
   * Additional CSS classes.
   */
  className?: string;

  /**
   * Child content (text, icons, badges, nested layouts).
   */
  children?: React.ReactNode;
}

interface RippleItem {
  id: number;
  x: number;
  y: number;
}

/**
 * 4-Point Golden Sparkle Stars Component (Image 1 aesthetic)
 */
export const GoldenSparkleCluster: React.FC<{ className?: string }> = ({ className = 'w-5 h-5' }) => (
  <svg
    viewBox="0 0 24 24"
    fill="currentColor"
    className={`inline-block text-amber-300 drop-shadow-[0_0_6px_rgba(251,191,36,0.85)] ${className}`}
    aria-hidden="true"
  >
    {/* Primary large sparkle */}
    <path d="M15 2C15 6.418 18.582 10 23 10C18.582 10 15 13.582 15 18C15 13.582 11.418 10 7 10C11.418 10 15 6.418 15 2Z" fill="#FBBF24" />
    <path d="M15 5C15 7.76 17.24 10 20 10C17.24 10 15 12.24 15 15C15 12.24 12.76 10 10 10C12.76 10 15 7.76 15 5Z" fill="#FEF08A" />
    {/* Secondary smaller sparkle */}
    <path d="M6 14C6 16.209 7.791 18 10 18C7.791 18 6 19.791 6 22C6 19.791 4.209 18 2 18C4.209 18 6 16.209 6 14Z" fill="#F59E0B" />
    <path d="M6 16C6 17.105 6.895 18 8 18C6.895 18 6 18.895 6 20C6 18.895 5.105 18 4 18C5.105 18 6 17.105 6 16Z" fill="#FDE047" />
    {/* Tertiary tiny sparkle */}
    <path d="M6 4C6 5.105 6.895 6 8 6C6.895 6 6 6.895 6 8C6 6.895 5.105 6 4 6C5.105 6 6 5.105 6 4Z" fill="#FBBF24" opacity="0.9" />
  </svg>
);

export const WaterGlass = React.forwardRef<HTMLElement, WaterGlassProps>(function WaterGlass(
  {
    variant = 'nav',
    theme = 'prismatic',
    as,
    href,
    disabled = false,
    showGlint,
    sparkles = false,
    darkText = false,
    textReflection = true,
    intensity,
    goldReflection,
    blurAmount,
    elevation = 'medium',
    interactive = true,
    rippleOnHover = true,
    rippleOnClick = true,
    style,
    className = '',
    children,
    onPointerEnter,
    onPointerMove,
    onPointerLeave,
    onPointerDown,
    onClick,
    ...rest
  },
  forwardedRef
) {
  // Resolve settings with defaults from centralized waterGlassSettings.ts
  const effectiveShowGlint = showGlint !== undefined ? showGlint : WATER_GLASS_SETTINGS.showCornerGlint;
  const effectiveIntensity = intensity !== undefined ? intensity : WATER_GLASS_SETTINGS.glassIntensity;
  const effectiveGoldReflection = goldReflection !== undefined ? goldReflection : WATER_GLASS_SETTINGS.reflectionStrength;
  const effectiveBlurAmount = blurAmount !== undefined ? blurAmount : WATER_GLASS_SETTINGS.backdropBlurPx;
  const internalRef = useRef<HTMLElement | null>(null);
  const rippleIdCounter = useRef(0);
  const [ripples, setRipples] = useState<RippleItem[]>([]);
  const [isHovered, setIsHovered] = useState(false);

  // Determine underlying element tag if not explicitly passed
  const Component = as || (variant === 'panel' ? 'div' : href ? 'a' : 'button');

  // Spawn an ethereal water ripple at given client coordinates relative to container
  const spawnRipple = useCallback(
    (clientX: number, clientY: number) => {
      const el = internalRef.current;
      if (!el || disabled) return;

      const rect = el.getBoundingClientRect();
      const x = clientX - rect.left;
      const y = clientY - rect.top;

      const newId = ++rippleIdCounter.current;
      setRipples((prev) => [...prev.slice(-3), { id: newId, x, y }]);

      // Automatically clean up ripple after animation completes (750ms)
      setTimeout(() => {
        setRipples((prev) => prev.filter((r) => r.id !== newId));
      }, 760);
    },
    [disabled]
  );

  // High-performance pointer tracking: directly update CSS variables without React re-render lag
  const handlePointerMove = useCallback(
    (e: React.PointerEvent<HTMLElement>) => {
      if (interactive && !disabled && internalRef.current) {
        const rect = internalRef.current.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        internalRef.current.style.setProperty('--wg-mouse-x', `${x}px`);
        internalRef.current.style.setProperty('--wg-mouse-y', `${y}px`);
      }
      onPointerMove?.(e);
    },
    [interactive, disabled, onPointerMove]
  );

  // Pointer enter: track initial position, trigger one ripple, activate shimmer
  const handlePointerEnter = useCallback(
    (e: React.PointerEvent<HTMLElement>) => {
      if (interactive && !disabled && internalRef.current) {
        setIsHovered(true);
        const rect = internalRef.current.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        internalRef.current.style.setProperty('--wg-mouse-x', `${x}px`);
        internalRef.current.style.setProperty('--wg-mouse-y', `${y}px`);

        if (rippleOnHover) {
          spawnRipple(e.clientX, e.clientY);
        }
      }
      onPointerEnter?.(e);
    },
    [interactive, disabled, rippleOnHover, spawnRipple, onPointerEnter]
  );

  // Pointer leave: clean up hover state smoothly
  const handlePointerLeave = useCallback(
    (e: React.PointerEvent<HTMLElement>) => {
      if (interactive && !disabled) {
        setIsHovered(false);
      }
      onPointerLeave?.(e);
    },
    [interactive, disabled, onPointerLeave]
  );

  // Pointer down / click: spawn click ripple
  const handlePointerDown = useCallback(
    (e: React.PointerEvent<HTMLElement>) => {
      if (interactive && !disabled && rippleOnClick) {
        spawnRipple(e.clientX, e.clientY);
      }
      onPointerDown?.(e);
    },
    [interactive, disabled, rippleOnClick, spawnRipple, onPointerDown]
  );

  // Combine ref handling
  const setRefs = useCallback(
    (node: HTMLElement | null) => {
      internalRef.current = node;
      if (typeof forwardedRef === 'function') {
        forwardedRef(node);
      } else if (forwardedRef) {
        (forwardedRef as React.MutableRefObject<HTMLElement | null>).current = node;
      }
    },
    [forwardedRef]
  );

  // Build composite CSS custom properties
  // Build composite CSS custom properties directly from centralized settings
  const configVars = getWaterGlassCssVariables(WATER_GLASS_SETTINGS);

  const customCssVars: React.CSSProperties = {
    ...configVars,
    '--wg-intensity': String(effectiveIntensity),
    '--wg-gold': String(effectiveGoldReflection),
    '--wg-blur': `${effectiveBlurAmount}px`,
    ...style,
  } as React.CSSProperties;

  // Build class names
  const classes = [
    'water-glass',
    `water-glass-${variant}`,
    `water-glass-theme-${theme}`,
    `water-glass-elevation-${elevation}`,
    darkText ? 'water-glass-dark-text' : '',
    textReflection ? 'water-glass-text-reflection' : '',
    isHovered ? 'is-hovered' : '',
    disabled ? 'water-glass-disabled' : '',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  // Common accessibility attributes
  const commonProps: Record<string, any> = {
    ref: setRefs,
    className: classes,
    style: customCssVars,
    onPointerEnter: handlePointerEnter,
    onPointerMove: handlePointerMove,
    onPointerLeave: handlePointerLeave,
    onPointerDown: handlePointerDown,
    onClick,
    ...rest,
  };

  if (Component === 'button') {
    commonProps.type = (rest as any).type || 'button';
    commonProps.disabled = disabled;
    commonProps['aria-disabled'] = disabled ? 'true' : undefined;
  } else if (Component === 'a') {
    commonProps.href = disabled ? undefined : href;
    commonProps['aria-disabled'] = disabled ? 'true' : undefined;
    if (disabled) commonProps.tabIndex = -1;
  }

  return React.createElement(
    Component,
    commonProps,
    <>
      {/* 1. Specular corner bubble glint bead (Image 2 signature feature) */}
      {effectiveShowGlint && <span className="water-glass-glint" aria-hidden="true" />}

      {/* 2. Dynamic pointer-following liquid shimmer */}
      {interactive && <div className="water-glass-shimmer" aria-hidden="true" />}

      {/* 3. Curved specular water sheen refraction arc */}
      <div className="water-glass-sheen" aria-hidden="true" />

      {/* 4. Restrained water ripples */}
      {ripples.map((ripple) => (
        <span
          key={ripple.id}
          className="water-glass-ripple"
          style={{
            left: `${ripple.x}px`,
            top: `${ripple.y}px`,
          }}
          aria-hidden="true"
        />
      ))}

      {/* 5. Child content (kept crisp on top) */}
      <div className="water-glass-content">
        {children}
        {sparkles && <GoldenSparkleCluster className="ml-2 w-5 h-5 flex-shrink-0" />}
      </div>
    </>
  );
});

export default WaterGlass;
