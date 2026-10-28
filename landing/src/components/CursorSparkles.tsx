import React, { useEffect, useRef } from 'react';
import { CURSOR_SPARKLES_SETTINGS } from '../config/effectsSettings';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  maxLife: number;
  life: number;
  opacity: number;
  isStar: boolean;
}

interface CursorSparklesProps {
  cursorX: number;
  cursorY: number;
  isMoving: boolean;
  isActive: boolean;
}

export const CursorSparkles: React.FC<CursorSparklesProps> = ({
  cursorX,
  cursorY,
  isMoving,
  isActive,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const particlesRef = useRef<Particle[]>([]);
  const lastPosRef = useRef<{ x: number; y: number }>({ x: cursorX, y: cursorY });
  const animFrameIdRef = useRef<number | null>(null);

  // Update particles and spawn new ones
  useEffect(() => {
    if (!isActive) return;

    const dx = cursorX - lastPosRef.current.x;
    const dy = cursorY - lastPosRef.current.y;
    const dist = Math.hypot(dx, dy);

    // Only emit particles if cursor is moving and covered some distance
    if (isMoving && dist > CURSOR_SPARKLES_SETTINGS.minDistanceToEmitPx) {
      const isReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      const count = isReduced
        ? 1
        : Math.min(
            CURSOR_SPARKLES_SETTINGS.maxParticlesPerBurst,
            Math.max(1, Math.floor(dist / 14))
          );

      for (let i = 0; i < count; i++) {
        // Interpolate along movement vector for continuous smooth trail
        const lerp = Math.random();
        const spawnX = lastPosRef.current.x + dx * lerp + (Math.random() - 0.5) * 4;
        const spawnY = lastPosRef.current.y + dy * lerp + (Math.random() - 0.5) * 4;

        const angle = Math.random() * Math.PI * 2;
        const speed = 0.2 + Math.random() * 0.8;

        particlesRef.current.push({
          x: spawnX,
          y: spawnY,
          vx: Math.cos(angle) * speed + dx * 0.05,
          vy: Math.sin(angle) * speed + dy * 0.05 + CURSOR_SPARKLES_SETTINGS.downwardDrift,
          size: 1.2 + Math.random() * 1.8,
          maxLife: CURSOR_SPARKLES_SETTINGS.baseLifetimeFrames + Math.random() * 20,
          life: 0,
          opacity: 0.7 + Math.random() * 0.3,
          isStar: Math.random() < CURSOR_SPARKLES_SETTINGS.starParticleProbability,
        });
      }
    }

    lastPosRef.current = { x: cursorX, y: cursorY };
  }, [cursorX, cursorY, isMoving, isActive]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const handleResize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      canvas.style.width = `${window.innerWidth}px`;
      canvas.style.height = `${window.innerHeight}px`;
    };

    handleResize();
    window.addEventListener('resize', handleResize);

    const drawStar = (
      ctx: CanvasRenderingContext2D,
      cx: number,
      cy: number,
      spikes: number,
      outerRadius: number,
      innerRadius: number
    ) => {
      let rot = (Math.PI / 2) * 3;
      let x = cx;
      let y = cy;
      const step = Math.PI / spikes;

      ctx.beginPath();
      ctx.moveTo(cx, cy - outerRadius);
      for (let i = 0; i < spikes; i++) {
        x = cx + Math.cos(rot) * outerRadius;
        y = cy + Math.sin(rot) * outerRadius;
        ctx.lineTo(x, y);
        rot += step;

        x = cx + Math.cos(rot) * innerRadius;
        y = cy + Math.sin(rot) * innerRadius;
        ctx.lineTo(x, y);
        rot += step;
      }
      ctx.lineTo(cx, cy - outerRadius);
      ctx.closePath();
      ctx.fill();
    };

    const render = () => {
      const ctx = canvas.getContext('2d');
      if (ctx) {
        const dpr = Math.min(window.devicePixelRatio || 1, 2);
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        const particles = particlesRef.current;
        for (let i = particles.length - 1; i >= 0; i--) {
          const p = particles[i];
          p.life++;
          p.x += p.vx;
          p.y += p.vy;
          p.vx *= CURSOR_SPARKLES_SETTINGS.velocityDamping;
          p.vy *= CURSOR_SPARKLES_SETTINGS.velocityDamping;

          const progress = p.life / p.maxLife;
          if (progress >= 1) {
            particles.splice(i, 1);
            continue;
          }

          // Smooth fade and shrink
          const alpha = (1 - progress) * p.opacity;
          const currentSize = p.size * (1 - progress * 0.6) * dpr;
          const drawX = p.x * dpr;
          const drawY = p.y * dpr;

          ctx.save();
          ctx.fillStyle = `rgba(255, 255, 255, ${alpha})`;
          ctx.shadowColor = 'rgba(255, 255, 255, 0.8)';
          ctx.shadowBlur = 4 * dpr;

          if (p.isStar) {
            drawStar(ctx, drawX, drawY, 4, currentSize * 1.5, currentSize * 0.4);
          } else {
            ctx.beginPath();
            ctx.arc(drawX, drawY, currentSize, 0, Math.PI * 2);
            ctx.fill();
          }
          ctx.restore();
        }

        // Draw delicate subtle cursor dot at current mouse position
        if (isActive && cursorX > 0 && cursorY > 0) {
          const cx = cursorX * dpr;
          const cy = cursorY * dpr;

          ctx.save();
          ctx.fillStyle = 'rgba(255, 255, 255, 0.85)';
          ctx.shadowColor = 'rgba(255, 255, 255, 0.9)';
          ctx.shadowBlur = 5 * dpr;
          ctx.beginPath();
          ctx.arc(cx, cy, CURSOR_SPARKLES_SETTINGS.cursorDotRadius * dpr, 0, Math.PI * 2);
          ctx.fill();
          ctx.restore();
        }
      }

      animFrameIdRef.current = requestAnimationFrame(render);
    };

    animFrameIdRef.current = requestAnimationFrame(render);

    return () => {
      window.removeEventListener('resize', handleResize);
      if (animFrameIdRef.current) {
        cancelAnimationFrame(animFrameIdRef.current);
      }
    };
  }, [isActive, cursorX, cursorY]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 pointer-events-none select-none z-40"
    />
  );
};
