/**
 * Pure math and state helpers for the magic circle and portal reveal interactions.
 * Decoupled for fast unit-testing and deterministic simulation.
 */

export interface ProximityState {
  distance: number;
  progress: number; // 0.0 to 1.0
  isComplete: boolean;
  opacity: number;  // 0.0 to 1.0
}

/**
 * Calculates circle completion progress based on cursor distance from the hotspot
 * or across the configurable horizontal activation width.
 *
 * When activationWidth is specified:
 * - cursorX > activationWidth: dormant (progress = 0, opacity = 0)
 * - cursorX <= activationWidth: active across the left side of the screen,
 *   smoothly ramping progress from 0 up to 1 as cursor approaches the hotspot.
 * - When within triggerRadius or reaching full progress: progress = 1, isComplete = true.
 *
 * When activationWidth is omitted:
 * - Falls back to classic Euclidean distance calculation for backwards compatibility.
 */
export function calculateProximityProgress(
  cursorX: number,
  cursorY: number,
  hotspotX: number,
  hotspotY: number,
  maxDistance: number = 220,
  triggerRadius: number = 32,
  activationWidth?: number,
  viewportHeight?: number
): ProximityState {
  if (activationWidth !== undefined) {
    // 1. Outside the horizontal activation boundary (right side of screen)
    if (cursorX > activationWidth || cursorX < 0) {
      return {
        distance: Math.max(0, cursorX - hotspotX),
        progress: 0,
        isComplete: false,
        opacity: 0,
      };
    }

    // 2. Vertical falloff: keep hotspot vertically centered with generous vertical range
    const vHeight = viewportHeight || 900;
    const maxVerticalDistance = vHeight * 0.44; // Covers ~88% of vertical height
    const dy = Math.abs(cursorY - hotspotY);
    if (dy > maxVerticalDistance) {
      return {
        distance: Math.hypot(cursorX - hotspotX, dy),
        progress: 0,
        isComplete: false,
        opacity: 0,
      };
    }

    // Vertical attenuation (1 at center, smooth quadratic roll-off near top/bottom edges)
    const verticalFactor = Math.max(0, 1 - Math.pow(dy / maxVerticalDistance, 2));

    // Distance to anchor hotspot
    const distToHotspot = Math.hypot(cursorX - hotspotX, dy);

    // 3. Core completion zone: within snap radius of anchor hotspot or deep left zone
    if (distToHotspot <= triggerRadius || (cursorX <= hotspotX + triggerRadius && dy <= triggerRadius * 1.5)) {
      return {
        distance: distToHotspot,
        progress: 1,
        isComplete: true,
        opacity: 1,
      };
    }

    // 4. Smooth ramp across the entire activation width (from activationWidth down to hotspotX + triggerRadius)
    const activeRange = Math.max(1, activationWidth - (hotspotX + triggerRadius));
    const distanceIntoZone = activationWidth - cursorX;
    const horizontalProgress = Math.max(0, Math.min(1, distanceIntoZone / activeRange));

    const combinedProgress = Math.max(0, Math.min(1, horizontalProgress * verticalFactor));

    if (combinedProgress >= 0.96) {
      return {
        distance: distToHotspot,
        progress: 1,
        isComplete: true,
        opacity: 1,
      };
    }

    // Progressive opacity (faint entrance at boundary, radiant near center)
    const opacity = combinedProgress > 0 ? Math.min(1, Math.max(0.18, combinedProgress * 1.35)) : 0;

    return {
      distance: distToHotspot,
      progress: combinedProgress,
      isComplete: false,
      opacity,
    };
  }

  // Classic Euclidean calculation when activationWidth is omitted (e.g. unit tests)
  const dx = cursorX - hotspotX;
  const dy = cursorY - hotspotY;
  const distance = Math.hypot(dx, dy);

  if (distance >= maxDistance) {
    return {
      distance,
      progress: 0,
      isComplete: false,
      opacity: 0,
    };
  }

  if (distance <= triggerRadius) {
    return {
      distance,
      progress: 1,
      isComplete: true,
      opacity: 1,
    };
  }

  // Smooth ramp between maxDistance and triggerRadius
  const rawProgress = (maxDistance - distance) / (maxDistance - triggerRadius);
  const clampedProgress = Math.max(0, Math.min(1, rawProgress));

  // Opacity starts fading in slightly after entering the sphere of influence
  const opacity = Math.min(1, clampedProgress * 1.25);

  return {
    distance,
    progress: clampedProgress,
    isComplete: false,
    opacity,
  };
}

/**
 * Computes maximum radius needed from the hotspot so a circle covers the entire viewport.
 */
export function calculateMaxRevealRadius(
  viewportWidth: number,
  viewportHeight: number,
  hotspotX: number,
  hotspotY: number
): number {
  const cornerDists = [
    Math.hypot(hotspotX, hotspotY),
    Math.hypot(viewportWidth - hotspotX, hotspotY),
    Math.hypot(hotspotX, viewportHeight - hotspotY),
    Math.hypot(viewportWidth - hotspotX, viewportHeight - hotspotY),
  ];
  return Math.max(...cornerDists) * 1.05; // 5% cushion for complete coverage
}

/**
 * Easing functions for smooth organic transitions
 */
export function easeOutCubic(t: number): number {
  return 1 - Math.pow(1 - t, 3);
}

export function easeInOutSine(t: number): number {
  return -(Math.cos(Math.PI * t) - 1) / 2;
}

/**
 * Step animation state for reveal expansion and contraction.
 */
export function stepRevealProgress(
  current: number,
  isHolding: boolean,
  expandSpeed: number = 1.4,
  contractSpeed: number = 0.9,
  deltaTimeSec: number = 0.016
): number {
  if (isHolding) {
    const next = current + expandSpeed * deltaTimeSec;
    return Math.min(1, next);
  } else {
    const next = current - contractSpeed * deltaTimeSec;
    return Math.max(0, next);
  }
}
