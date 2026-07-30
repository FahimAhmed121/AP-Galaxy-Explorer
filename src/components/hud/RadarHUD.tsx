import React, { useState } from 'react';
import { Compass, Navigation, Radio, ChevronDown, ChevronUp, MapPin, Orbit } from 'lucide-react';
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
  const [isExpanded, setIsExpanded] = useState<boolean>(true);
  const isBN = settings.language === 'BN';
  const t = (en: string, bn: string) => (isBN ? bn : en);

  const radarSize = 160; // width & height of mini map
  const scaleX = radarSize / worldWidth;
  const scaleY = radarSize / worldHeight;

  // Station coordinate (Safe Sector Alpha Alpha Hub)
  const stationX = (worldWidth / 2 - 800) * scaleX;
  const stationY = (worldHeight / 2) * scaleY;

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
      {nearestGalaxy && isExpanded && (
        <div className="p-2 rounded bg-black/85 border border-gold/40 backdrop-blur-md pointer-events-auto flex items-center gap-2.5 text-xs font-mono shadow-xl">
          <div
            className="p-1 rounded bg-gold/20 text-gold transition-transform duration-200"
            style={{ transform: `rotate(${nearestGalaxy.angle + Math.PI / 2}rad)` }}
          >
            <Navigation size={13} />
          </div>
          <div>
            <div className="text-[9px] text-slate-400 uppercase tracking-wider flex items-center gap-1">
              <span>{t('NEAREST OBJECT', 'নিকটতম স্থান')}</span>
              {nearestGalaxy.isDiscovered ? (
                <span className="text-emerald-400 text-[8px] font-bold">[MAPPED]</span>
              ) : (
                <span className="text-cyan-400 text-[8px] font-bold">[UNEXPLORED]</span>
              )}
            </div>
            <div className="text-[11px] font-bold text-gold flex items-center gap-1.5">
              <span>{nearestGalaxy.galaxy.name}</span>
              <span className="text-slate-400 font-normal">({Math.round(nearestGalaxy.dist)} ly)</span>
            </div>
          </div>
        </div>
      )}

      {/* Mini Radar Canvas Container */}
      <div className="pointer-events-auto flex flex-col items-end">
        {/* Toggle Collapse Button */}
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="mb-1 px-2.5 py-1 rounded bg-black/80 hover:bg-slate-900 border border-slate-700/80 text-cyan-400 text-[10px] font-mono flex items-center gap-1 backdrop-blur-md cursor-pointer transition-all shadow-md"
        >
          <Radio size={12} className={isExpanded ? 'animate-pulse text-emerald-400' : 'text-slate-400'} />
          <span>{isExpanded ? 'COLLAPSE SCANNER' : 'EXPAND MINIMAP'}</span>
          {isExpanded ? <ChevronDown size={12} /> : <ChevronUp size={12} />}
        </button>

        {isExpanded && (
          <div className="relative w-[160px] h-[160px] rounded bg-slate-950/90 border border-cyan-500/30 backdrop-blur-md overflow-hidden p-1 shadow-2xl transition-all">
            {/* Radar Circular Grid Overlay */}
            <div className="absolute inset-0 border border-cyan-500/20 rounded-full m-2 pointer-events-none" />
            <div className="absolute inset-0 border border-cyan-500/10 rounded-full m-8 pointer-events-none" />
            <div className="absolute top-1/2 left-0 w-full h-px bg-cyan-500/20 pointer-events-none" />
            <div className="absolute top-0 left-1/2 w-px h-full bg-cyan-500/20 pointer-events-none" />

            {/* Orbital Station Marker (Safe Sector Alpha) */}
            <div
              className="absolute w-3 h-3 -ml-1.5 -mt-1.5 rounded-full bg-indigo-500 border border-white flex items-center justify-center text-[7px] text-white font-mono shadow-[0_0_8px_#6366f1] cursor-pointer group z-10"
              style={{ left: `${stationX}px`, top: `${stationY}px` }}
              title="Space Station Alpha"
            >
              <Orbit size={8} />
              <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1 hidden group-hover:block bg-black text-[9px] text-indigo-300 px-1.5 py-0.5 rounded border border-indigo-500 whitespace-nowrap z-30 font-mono">
                Alpha Station
              </div>
            </div>

            {/* Radar Dots for Galaxies */}
            {GALAXIES.map((g) => {
              const gx = g.x * scaleX;
              const gy = g.y * scaleY;
              const isDiscovered = profile.discoveredGalaxyIds.includes(g.id);

              return (
                <div
                  key={g.id}
                  onClick={() => onWarpToGalaxy(g)}
                  className={`absolute w-3 h-3 -ml-1.5 -mt-1.5 rounded-full cursor-pointer hover:scale-150 transition-transform group ${
                    isDiscovered ? 'ring-2 ring-amber-400 shadow-[0_0_8px_#f59e0b]' : 'ring-1 ring-cyan-400/60'
                  }`}
                  style={{
                    left: `${gx}px`,
                    top: `${gy}px`,
                    backgroundColor: g.visualColor,
                  }}
                  title={`${g.name} (${isDiscovered ? 'Discovered' : 'Unexplored'})`}
                >
                  {/* Tooltip on hover */}
                  <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1 hidden group-hover:block bg-black text-[9px] text-white px-1.5 py-0.5 rounded border border-white/20 whitespace-nowrap z-30 font-mono">
                    {g.name} {isDiscovered ? '✓' : ''}
                  </div>
                </div>
              );
            })}

            {/* Player Ship Position & Heading Marker */}
            <div
              className="absolute w-3 h-3 -ml-1.5 -mt-1.5 z-20 flex items-center justify-center transition-all duration-75"
              style={{
                left: `${ship.x * scaleX}px`,
                top: `${ship.y * scaleY}px`,
              }}
            >
              <div
                className="text-white drop-shadow-[0_0_6px_#ffffff]"
                style={{ transform: `rotate(${ship.angle + Math.PI / 2}rad)` }}
              >
                <Navigation size={12} className="fill-white" />
              </div>
            </div>

            {/* Radar Label */}
            <div className="absolute bottom-1 left-1.5 text-[8px] font-mono text-cyan-400 uppercase tracking-widest opacity-90 flex items-center gap-1">
              <Compass size={10} />
              <span>RADAR 2D</span>
            </div>
          </div>
        )}
      </div>

    </div>
  );
}
