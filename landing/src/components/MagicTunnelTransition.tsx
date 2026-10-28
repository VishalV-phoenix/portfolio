import React, { useEffect, useRef } from 'react';

interface MagicTunnelTransitionProps {
  /**
   * Tunnel transition progress (0.0 to 1.0)
   * 0.0 = Portal begins to form in center of landing scene
   * 0.5 = Camera passing through concentric glowing golden rings & particle vortex
   * 1.0 = Tunnel entrance expands to fill viewport and seamlessly reveals Tree Frame 0
   */
  progress: number;
}

export const MagicTunnelTransition: React.FC<MagicTunnelTransitionProps> = ({
  progress,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const clampedProgress = Math.max(0, Math.min(1, progress));

  // Only render when transition is active
  const isActive = clampedProgress > 0.001 && clampedProgress < 0.999;

  // Particle vortex canvas simulation
  useEffect(() => {
    if (!isActive || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = (canvas.width = window.innerWidth);
    const height = (canvas.height = window.innerHeight);
    const centerX = width / 2;
    const centerY = height / 2;
    const maxDist = Math.hypot(centerX, centerY);

    ctx.clearRect(0, 0, width, height);

    // Warm golden palette matching GoldenParticleSystem
    const colors = [
      'rgba(255, 215, 85, ',
      'rgba(245, 175, 45, ',
      'rgba(255, 242, 195, ',
      'rgba(230, 155, 20, ',
    ];

    const particleCount = 70;
    for (let i = 0; i < particleCount; i++) {
      // Deterministic seed based on index
      const seed = (i * 9301 + 49297) % 233280;
      const rand1 = seed / 233280;
      const rand2 = ((seed * 9301 + 49297) % 233280) / 233280;
      const angle = rand1 * Math.PI * 2;

      // Radial warp distance accelerated by progress
      const baseDist = rand2 * maxDist;
      const warpSpeed = 1.0 + rand1 * 1.5;
      const currentDist = (baseDist + clampedProgress * maxDist * warpSpeed) % maxDist;

      const px = centerX + Math.cos(angle) * currentDist;
      const py = centerY + Math.sin(angle) * currentDist;

      // Particle size expands as it approaches camera
      const sizeNorm = currentDist / maxDist;
      const size = 0.8 + sizeNorm * 3.2;

      // Opacity peaks in mid-flight and fades at screen edges
      const alpha = Math.sin(sizeNorm * Math.PI) * 0.85 * (1 - Math.abs(clampedProgress - 0.5) * 0.8);
      const color = colors[i % colors.length];

      ctx.beginPath();
      ctx.arc(px, py, size, 0, Math.PI * 2);
      ctx.fillStyle = `${color}${alpha})`;
      ctx.fill();

      // Golden streak / tail along direction of motion
      if (clampedProgress > 0.15 && sizeNorm > 0.2) {
        const tailLength = size * 4 * clampedProgress;
        const tailX = px - Math.cos(angle) * tailLength;
        const tailY = py - Math.sin(angle) * tailLength;

        ctx.beginPath();
        ctx.moveTo(px, py);
        ctx.lineTo(tailX, tailY);
        ctx.strokeStyle = `${color}${alpha * 0.45})`;
        ctx.lineWidth = size * 0.8;
        ctx.stroke();
      }
    }
  }, [isActive, clampedProgress]);

  if (!isActive) {
    return null;
  }

  // Ring configurations with initial 3D Z-depths
  const rings = [
    { zBase: -900, size: 280, border: '1.5px solid rgba(255, 215, 80, 0.45)' },
    { zBase: -700, size: 360, border: '2px solid rgba(255, 195, 60, 0.60)' },
    { zBase: -500, size: 480, border: '1.5px solid rgba(255, 235, 120, 0.70)' },
    { zBase: -300, size: 620, border: '2px solid rgba(245, 175, 45, 0.80)' },
    { zBase: -100, size: 780, border: '2.5px solid rgba(255, 245, 200, 0.90)' },
  ];

  return (
    <div
      className="fixed inset-0 z-25 pointer-events-none overflow-hidden select-none"
      style={{
        perspective: '1200px',
        perspectiveOrigin: '50% 50%',
      }}
      aria-hidden="true"
    >
      {/* 1. Deep Celestial Core Bloom */}
      <div
        className="absolute inset-0 flex items-center justify-center pointer-events-none"
        style={{
          opacity: Math.sin(clampedProgress * Math.PI),
          transform: `scale(${0.6 + clampedProgress * 2.5})`,
          transition: 'none',
        }}
      >
        <div
          className="rounded-full"
          style={{
            width: '600px',
            height: '600px',
            background:
              'radial-gradient(circle, rgba(255, 225, 120, 0.35) 0%, rgba(215, 150, 30, 0.18) 35%, rgba(12, 9, 4, 0.8) 70%, transparent 100%)',
            filter: 'blur(30px)',
          }}
        />
      </div>

      {/* 2. Concentric 3D Tunnel Rings Flying toward Camera */}
      <div
        className="absolute inset-0 flex items-center justify-center"
        style={{
          transformStyle: 'preserve-3d',
        }}
      >
        {rings.map((ring, idx) => {
          // Ring moves along Z axis from negative depth toward +300px
          const ringZ = ring.zBase + clampedProgress * 1350;
          const rotation = (idx % 2 === 0 ? 1 : -1) * clampedProgress * 45;
          const ringOpacity = Math.max(0, Math.min(1, (ringZ + 1000) / 400)) * (ringZ > 250 ? Math.max(0, 1 - (ringZ - 250) / 150) : 1);

          return (
            <div
              key={idx}
              className="absolute rounded-full"
              style={{
                width: `${ring.size}px`,
                height: `${ring.size}px`,
                border: ring.border,
                boxShadow:
                  '0 0 25px rgba(255, 210, 80, 0.4), inset 0 0 20px rgba(255, 180, 40, 0.3)',
                transform: `translateZ(${ringZ}px) rotate(${rotation}deg)`,
                opacity: ringOpacity,
              }}
            />
          );
        })}
      </div>

      {/* 3. Golden Warp Particles Canvas */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full pointer-events-none"
      />

      {/* 4. Soft Vignette Mask around tunnel walls */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(circle at 50% 50%, transparent 40%, rgba(0, 0, 0, 0.75) 80%, #000000 100%)',
          opacity: Math.sin(clampedProgress * Math.PI) * 0.9,
        }}
      />
    </div>
  );
};
