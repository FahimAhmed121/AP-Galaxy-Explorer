import React from 'react';
import { Compass, Navigation } from 'lucide-react';
import { Spaceship, Galaxy } from '../../types';
import { GALAXIES } from '../../data/galaxies';
import { useGameStore } from '../../store/useGameStore';

interface RadarHUDProps {
  ship: Spaceship;
  worldWidth: number;
  worldHeight: number;
  onWarpToGalaxy: (galaxy: Galaxy) => void;
}

export default function RadarHUD({
  ship,
  worldWidth,
  worldHeight,
  onWarpToGalaxy,
}: RadarHUDProps) {
  const { profile, settings } = useGameStore();
  const isBN = settings.language === 'BN';
  const t = (en: string, bn: string) => (isBN ? bn : en);

  const radarSize = 140; // width & height of mini map
  const scaleX = radarSize / worldWidth;
  const scaleY = radarSize / worldHeight;

  // Calculate direction vectors to galaxies
  const galaxyPointers = GALAXIES.map((g) => {
    const dx = g.x - ship.x;
    const dy = g.y - ship.y;
    const dist = Math.hypot(dx, dy);
    const angle = Math.atan2(dy, dx);
    const isDiscovered = profile.discoveredGalaxyIds.includes(g.id);
    return {
      galaxy: g,
      dist,
      angle,
      isDiscovered,
    };
  }).sort((a, b) => a.dist - b.dist);

  const nearestGalaxy = galaxyPointers[0];

  return (
    <div className="absolute bottom-4 right-4 z-20 pointer-events-none flex flex-col items-end gap-2 font-sans select-none">
      {/* Nearest Target Direction Banner */}
      {nearestGalaxy && (
        <div className="p-2 rounded-sm bg-black/80 border border-gold/30 backdrop-blur-md pointer-events-auto flex items-center gap-2 text-xs font-mono">
          <div
            className="p-1 rounded bg-gold/20 text-gold"
            style={{ transform: `rotate(${nearestGalaxy.angle + Math.PI / 2}rad)` }}
          >
            <Navigation size={12} />
          </div>
          <div>
            <div className="text-[9px] text-slate-400 uppercase">
              {t('NEAREST OBJECT', 'নিকটতম গ্যালাক্সি')}
            </div>
            <div className="text-[11px] font-bold text-gold flex items-center gap-1">
              <span>{nearestGalaxy.galaxy.name}</span>
              <span className="text-slate-400 font-normal">({Math.round(nearestGalaxy.dist)} ly)</span>
            </div>
          </div>
        </div>
      )}

      {/* Mini Radar Canvas Container */}
      <div className="relative w-[140px] h-[140px] rounded-sm bg-black/85 border border-white/20 backdrop-blur-md overflow-hidden pointer-events-auto p-1 shadow-2xl">
        {/* Radar Circular Grid Overlay */}
        <div className="absolute inset-0 border border-emerald-500/20 rounded-full m-2 pointer-events-none"></div>
        <div className="absolute inset-0 border border-emerald-500/10 rounded-full m-8 pointer-events-none"></div>
        <div className="absolute top-1/2 left-0 w-full h-px bg-emerald-500/20 pointer-events-none"></div>
        <div className="absolute top-0 left-1/2 w-px h-full bg-emerald-500/20 pointer-events-none"></div>

        {/* Radar Dots for Galaxies */}
        {GALAXIES.map((g) => {
          const gx = g.x * scaleX;
          const gy = g.y * scaleY;
          const isDiscovered = profile.discoveredGalaxyIds.includes(g.id);

          return (
            <div
              key={g.id}
              onClick={() => onWarpToGalaxy(g)}
              className="absolute w-2.5 h-2.5 -ml-1.25 -mt-1.25 rounded-full cursor-pointer hover:scale-150 transition-transform group"
              style={{
                left: `${gx}px`,
                top: `${gy}px`,
                backgroundColor: g.visualColor,
                boxShadow: `0 0 6px ${g.visualColor}`,
              }}
              title={`${g.name} (${isDiscovered ? 'Discovered' : 'Unexplored'})`}
            >
              {/* Tooltip on hover */}
              <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1 hidden group-hover:block bg-black text-[9px] text-white px-1.5 py-0.5 rounded border border-white/20 whitespace-nowrap z-30 font-mono">
                {g.name}
              </div>
            </div>
          );
        })}

        {/* Ship Marker */}
        <div
          className="absolute w-2 h-2 -ml-1 -mt-1 bg-white rounded-full shadow-[0_0_8px_#ffffff] z-10"
          style={{
            left: `${ship.x * scaleX}px`,
            top: `${ship.y * scaleY}px`,
          }}
        ></div>

        {/* Radar Label */}
        <div className="absolute bottom-0.5 left-1 text-[8px] font-mono text-emerald-400 uppercase tracking-widest opacity-80">
          RADAR 2D
        </div>
      </div>
    </div>
  );
}
