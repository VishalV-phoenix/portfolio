import React from 'react';
import forestImg from '../assets/images/enchanted_forest.png';

interface ForestSceneProps {
  revealProgress: number; // 0 to 1
  hotspotX: number;
  hotspotY: number;
  maxRadius: number;
  isPermanent?: boolean;
}

export const ForestScene: React.FC<ForestSceneProps> = ({
  revealProgress,
  hotspotX,
  hotspotY,
  maxRadius,
  isPermanent = false,
}) => {
  const currentRadius = revealProgress * maxRadius;
  const isFullyOpen = isPermanent || revealProgress >= 0.999;

  return (
    <div
      className="fixed inset-0 w-screen h-screen min-h-[100dvh] pointer-events-none overflow-hidden select-none bg-black z-0"
      style={{
        opacity: revealProgress > 0.001 ? 1 : 0,
        transition: 'opacity 0.15s ease-out',
        // When fully open, remove clip-path entirely for guaranteed edge-to-edge coverage
        clipPath: isFullyOpen
          ? 'none'
          : `circle(${currentRadius}px at ${hotspotX}px ${hotspotY}px)`,
        WebkitClipPath: isFullyOpen
          ? 'none'
          : `circle(${currentRadius}px at ${hotspotX}px ${hotspotY}px)`,
      }}
      data-testid="forest-scene"
    >
      {/* Exact Uploaded Enchanted Forest Image: Full edge-to-edge coverage without borders or distortion */}
      <img
        src={forestImg || '/enchanted_forest.png'}
        alt="Enchanted Forest with Winding Path and Glowing Sapling"
        className="w-full h-full min-h-[100dvh] object-cover object-[center_45%] sm:object-[center_48%]"
        loading="eager"
        decoding="sync"
      />

      {/* Atmospheric Portal Edge Ring Glow (active only during the opening transition) */}
      {!isFullyOpen && revealProgress > 0.01 && revealProgress < 0.98 && (
        <div
          className="absolute rounded-full pointer-events-none"
          style={{
            left: hotspotX - currentRadius,
            top: hotspotY - currentRadius,
            width: currentRadius * 2,
            height: currentRadius * 2,
            boxShadow:
              'inset 0 0 50px rgba(255, 225, 140, 0.5), 0 0 40px rgba(255, 190, 80, 0.55)',
            border: '1.5px solid rgba(255, 240, 180, 0.75)',
            mixBlendMode: 'screen',
          }}
        />
      )}
    </div>
  );
};
