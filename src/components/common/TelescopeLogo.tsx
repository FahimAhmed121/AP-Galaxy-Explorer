import React from 'react';

interface TelescopeLogoProps {
  className?: string;
  size?: number;
  showText?: boolean;
  textColor?: string;
}

export default function TelescopeLogo({ 
  className = '', 
  size = 120, 
  showText = false,
  textColor = 'text-gold'
}: TelescopeLogoProps) {
  // Fallback to the beautiful custom SVG Telescope Logo
  return (
    <div className={`flex flex-col items-center justify-center gap-2 ${className}`}>
      <svg 
        width={size} 
        height={size * 0.58} 
        viewBox="0 0 960 560" 
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
        className="drop-shadow-lg"
      >
        {/* Background glow behind telescope */}
        <defs>
          <radialGradient id="logoGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#c5a059" stopOpacity="0.15" />
            <stop offset="100%" stopColor="#c5a059" stopOpacity="0" />
          </radialGradient>
        </defs>
        <circle cx="280" cy="240" r="220" fill="url(#logoGlow)" />

        {/* Tripod Legs */}
        {/* Back Leg (darker, thinner) */}
        <line 
          x1="280" 
          y1="240" 
          x2="370" 
          y2="490" 
          stroke="#41396b" 
          strokeWidth="32" 
          strokeLinecap="round" 
        />
        {/* Left Leg */}
        <line 
          x1="280" 
          y1="240" 
          x2="190" 
          y2="490" 
          stroke="#554d86" 
          strokeWidth="34" 
          strokeLinecap="round" 
        />
        {/* Right Leg */}
        <line 
          x1="280" 
          y1="240" 
          x2="280" 
          y2="500" 
          stroke="#4a4276" 
          strokeWidth="36" 
          strokeLinecap="round" 
        />

        {/* Central Tripod Joint Mount (Light Blue Circle) */}
        <circle cx="280" cy="240" r="50" fill="#d0f2fe" />

        {/* Telescope Body (pointing upward and to the left) */}
        {/* All parts are rotated 20.5 degrees around (280, 240) to align nicely */}
        <g transform="rotate(20.5, 280, 240)">
          {/* 1. Back/Eyepiece thin section (pinkish-red) */}
          <rect 
            x="480" 
            y="215" 
            width="110" 
            height="50" 
            rx="12" 
            fill="#ee5572" 
          />
          
          {/* 2. Middle rear section (purple/blue) */}
          <rect 
            x="420" 
            y="200" 
            width="80" 
            height="80" 
            rx="16" 
            fill="#7b5195" 
          />

          {/* 3. Main heavy tube (pinkish-red) */}
          <rect 
            x="180" 
            y="170" 
            width="260" 
            height="140" 
            rx="20" 
            fill="#ee5572" 
          />

          {/* 4. Front main lens section (purple/blue) */}
          <rect 
            x="100" 
            y="150" 
            width="90" 
            height="180" 
            rx="24" 
            fill="#5a4288" 
          />

          {/* 5. Lens collar / rim section (dark purple) */}
          <rect 
            x="60" 
            y="140" 
            width="46" 
            height="200" 
            rx="14" 
            fill="#412e65" 
          />
        </g>
      </svg>
      {showText && (
        <span className={`text-[10px] md:text-xs font-mono font-medium tracking-[0.25em] uppercase ${textColor}`}>
          Astronomy Pathshala
        </span>
      )}
    </div>
  );
}
