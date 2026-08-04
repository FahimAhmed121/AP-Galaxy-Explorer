import React, { useState } from 'react';
import { Compass, Sparkles } from 'lucide-react';

interface GalaxyImageProps {
  src?: string;
  alt: string;
  className?: string;
  containerClassName?: string;
  visualColor?: string;
  type?: string;
  referrerPolicy?: React.HTMLAttributeReferrerPolicy;
  isCircular?: boolean;
}

export const GalaxyImage: React.FC<GalaxyImageProps> = ({
  src,
  alt,
  className = 'w-full h-full object-cover',
  containerClassName = 'w-full h-full relative overflow-hidden bg-slate-950',
  visualColor = '#38bdf8',
  type,
  referrerPolicy = 'no-referrer',
  isCircular = false,
}) => {
  const [hasError, setHasError] = useState(!src);

  if (src && !hasError) {
    return (
      <div className={containerClassName}>
        <img
          src={src}
          alt={alt}
          referrerPolicy={referrerPolicy}
          onError={() => setHasError(true)}
          className={className}
        />
      </div>
    );
  }

  // Fallback: Procedural Deep-Space Graphic Viewport
  return (
    <div
      className={`${containerClassName} flex flex-col items-center justify-center text-center p-2`}
      style={{
        background: `radial-gradient(circle, ${visualColor}30 0%, rgba(5, 8, 22, 0.95) 80%)`,
      }}
    >
      {/* Dashed Orbit Ring */}
      <div
        className={`absolute inset-2 border border-dashed rounded-full animate-[spin_25s_linear_infinite] opacity-40 pointer-events-none`}
        style={{ borderColor: visualColor }}
      />

      <div
        className="relative z-10 w-10 h-10 rounded-full flex items-center justify-center border shadow-lg mb-1"
        style={{
          backgroundColor: `${visualColor}20`,
          borderColor: visualColor,
          color: visualColor,
        }}
      >
        <Sparkles size={18} className="animate-pulse" />
      </div>

      <span className="relative z-10 text-[10px] font-mono font-bold text-white tracking-wider line-clamp-1 px-1">
        {alt}
      </span>

      {type && (
        <span
          className="relative z-10 text-[8px] font-mono uppercase tracking-widest px-1.5 py-0.5 rounded mt-0.5 border"
          style={{
            backgroundColor: `${visualColor}15`,
            borderColor: `${visualColor}40`,
            color: visualColor,
          }}
        >
          {type}
        </span>
      )}
    </div>
  );
};

export default GalaxyImage;
