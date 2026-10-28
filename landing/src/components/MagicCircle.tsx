import React from 'react';

interface MagicCircleProps {
  cursorX: number;
  cursorY: number;
  progress: number; // 0 to 1 based on distance to fixed hotspot
  isComplete: boolean;
  opacity: number;  // 0 to 1
  isRevealing: boolean;
}

export const MagicCircle: React.FC<MagicCircleProps> = ({
  cursorX,
  cursorY,
  progress,
  isComplete,
  opacity,
  isRevealing,
}) => {
  // Diameter ~30px (radius 15px) as requested: 28-34px on desktop
  const radius = 15;
  const circumference = 2 * Math.PI * radius;
  const strokeOffset = circumference * (1 - Math.min(1, Math.max(0, progress)));

  if (opacity <= 0.01 || cursorX < 0 || cursorY < 0) {
    return null;
  }

  // Smooth fade out while portal is expanding
  const displayOpacity = isRevealing ? opacity * 0.2 : opacity;

  return (
    <div
      className="fixed pointer-events-none select-none z-30 flex items-center justify-center transition-opacity duration-150"
      style={{
        left: cursorX - 24,
        top: cursorY - 24,
        width: 48,
        height: 48,
        opacity: displayOpacity,
      }}
      aria-hidden="true"
    >
      <svg
        className={`w-[48px] h-[48px] -rotate-90 transform transition-transform duration-200 ${
          isComplete ? 'scale-105' : 'scale-100'
        }`}
        viewBox="0 0 48 48"
        style={{
          filter: isComplete
            ? 'drop-shadow(0 0 6px rgba(255, 255, 255, 0.75))'
            : 'drop-shadow(0 0 3px rgba(255, 255, 255, 0.25))',
        }}
      >
        {/* Faint Guide Ring */}
        <circle
          cx="24"
          cy="24"
          r={radius}
          fill="none"
          stroke="rgba(255, 255, 255, 0.12)"
          strokeWidth="0.9"
        />

        {/* Dynamic Progress Circle */}
        <circle
          cx="24"
          cy="24"
          r={radius}
          fill="none"
          stroke={isComplete ? '#ffffff' : 'rgba(255, 255, 255, 0.85)'}
          strokeWidth={isComplete ? '1.4' : '1.0'}
          strokeDasharray={circumference}
          strokeDashoffset={strokeOffset}
          strokeLinecap="round"
          className="transition-[stroke-dashoffset] duration-75 ease-out"
        />

        {/* Subtle center white glint when complete */}
        {isComplete && (
          <circle
            cx="24"
            cy="24"
            r="1.2"
            fill="#ffffff"
            className="animate-pulse"
          />
        )}
      </svg>
    </div>
  );
};
