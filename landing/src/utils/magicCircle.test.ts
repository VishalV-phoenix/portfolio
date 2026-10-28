import test from 'node:test';
import assert from 'node:assert/strict';
import {
  calculateProximityProgress,
  calculateMaxRevealRadius,
  stepRevealProgress,
  easeOutCubic,
} from './magicCircle.ts';
import { getPositionStyle } from '../config/landingSettings.ts';

test('Proximity: returns 0 progress and 0 opacity when outside maxDistance', () => {
  const result = calculateProximityProgress(500, 500, 100, 100, 200, 30);
  assert.equal(result.progress, 0);
  assert.equal(result.isComplete, false);
  assert.equal(result.opacity, 0);
  assert.ok(result.distance > 200);
});

test('Proximity: completes circle when cursor is within triggerRadius', () => {
  const result = calculateProximityProgress(110, 100, 100, 100, 200, 30);
  assert.equal(result.progress, 1);
  assert.equal(result.isComplete, true);
  assert.equal(result.opacity, 1);
  assert.equal(result.distance, 10);
});

test('Proximity: smoothly ramps progress proportionally as cursor approaches', () => {
  const maxDist = 200;
  const trigger = 30;
  // Midpoint between 200 and 30 is ~115
  const midDist = (maxDist + trigger) / 2;
  const result = calculateProximityProgress(100 + midDist, 100, 100, 100, maxDist, trigger);
  assert.ok(result.progress > 0.45 && result.progress < 0.55);
  assert.equal(result.isComplete, false);
  assert.ok(result.opacity > 0);
});

test('calculateMaxRevealRadius: ensures circle encloses all 4 viewport corners', () => {
  const width = 1920;
  const height = 1080;
  const hX = 300;
  const hY = 540;
  const radius = calculateMaxRevealRadius(width, height, hX, hY);

  // Furthest corner is bottom right: (1920 - 300, 1080 - 540) = (1620, 540)
  const distToFurthestCorner = Math.hypot(1920 - 300, 1080 - 540);
  assert.ok(radius >= distToFurthestCorner, 'Radius must cover furthest corner');
});

test('stepRevealProgress: expands towards 1 when holding and contracts towards 0 when released', () => {
  let val = 0;
  // Step while holding
  val = stepRevealProgress(val, true, 2.0, 1.0, 0.1);
  assert.equal(Math.round(val * 100) / 100, 0.2);

  // Step to clamp at 1
  val = stepRevealProgress(0.95, true, 2.0, 1.0, 0.1);
  assert.equal(val, 1);

  // Step while released
  val = stepRevealProgress(val, false, 2.0, 1.0, 0.1);
  assert.equal(Math.round(val * 100) / 100, 0.9);

  // Step to clamp at 0
  val = stepRevealProgress(0.05, false, 2.0, 1.0, 0.1);
  assert.equal(val, 0);
});

test('easeOutCubic: handles boundaries correctly', () => {
  assert.equal(easeOutCubic(0), 0);
  assert.equal(easeOutCubic(1), 1);
  assert.ok(easeOutCubic(0.5) > 0.5, 'easeOut curve must advance faster early on');
});

test('getPositionStyle: returns empty style when x and y are 0', () => {
  const result = getPositionStyle({ x: 0, y: 0 });
  assert.deepEqual(result, {});
});

test('getPositionStyle: returns translate style when offset is specified', () => {
  const result = getPositionStyle({ x: 15, y: -20 });
  assert.deepEqual(result, { transform: 'translate(15px, -20px)' });
});

test('getPositionStyle: respects mobile overrides when isMobile is true', () => {
  const result = getPositionStyle({ x: 20, y: 10, mobile: { x: 5, y: -5 } }, true);
  assert.deepEqual(result, { transform: 'translate(5px, -5px)' });
});

test('getPositionStyle: falls back to desktop values on mobile when mobile offset is omitted', () => {
  const result = getPositionStyle({ x: 30, y: 40 }, true);
  assert.deepEqual(result, { transform: 'translate(30px, 40px)' });
});

test('Proximity: activates across expanded activationWidth region (60% of viewport width)', () => {
  const viewportW = 1000;
  const viewportH = 800;
  const activationW = 600; // 60% of width
  const hX = 140;
  const hY = 400;
  const trigger = 36;

  // 1. Outside the 60% activation zone (e.g. at x = 750, y = 400)
  const outside = calculateProximityProgress(750, 400, hX, hY, 240, trigger, activationW, viewportH);
  assert.equal(outside.progress, 0);
  assert.equal(outside.isComplete, false);
  assert.equal(outside.opacity, 0);

  // 2. Just inside the 60% activation zone (e.g. at x = 550, y = 400)
  const justInside = calculateProximityProgress(550, 400, hX, hY, 240, trigger, activationW, viewportH);
  assert.ok(justInside.progress > 0 && justInside.progress < 0.4);
  assert.equal(justInside.isComplete, false);
  assert.ok(justInside.opacity > 0);

  // 3. Midway into the active left zone (e.g. at x = 350, y = 400)
  const midway = calculateProximityProgress(350, 400, hX, hY, 240, trigger, activationW, viewportH);
  assert.ok(midway.progress > 0.4 && midway.progress < 0.9);
  assert.equal(midway.isComplete, false);
  assert.ok(midway.opacity > 0.5);

  // 4. Core hotspot region (e.g. at x = 140, y = 400) -> complete
  const complete = calculateProximityProgress(140, 400, hX, hY, 240, trigger, activationW, viewportH);
  assert.equal(complete.progress, 1);
  assert.equal(complete.isComplete, true);
  assert.equal(complete.opacity, 1);
});

