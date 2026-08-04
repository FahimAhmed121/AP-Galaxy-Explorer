import React, { useState, useEffect } from 'react';
import { Compass, Navigation, Radio, ChevronDown, ChevronUp, Orbit, Eye, Layers } from 'lucide-react';
import { Spaceship, Galaxy } from '../../types';
import { GALAXIES } from '../../data/galaxies';
import { useGameStore } from '../../store/useGameStore';
import { eventBus } from '../../core/events';
import { SCANNER_CONFIG } from '../../core/config';

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
  const [mode, setMode] = useState<'TACTICAL' | 'SECTOR'>('TACTICAL');
  const [tacticalRange, setTacticalRange] = useState<number>(1400); // World units range around player

  // Live real-time ship position state driven by Phaser physics ticks
  const [liveShip, setLiveShip] = useState<{ x: number; y: number; angle: number }>({
    x: ship.x,
    y: ship.y,
    angle: ship.angle,
  });

  const isBN = settings.language === 'BN';
  const t = (en: string, bn: string) => (isBN ? bn : en);

  // Subscribe to real-time 60fps Phaser ship position events
  useEffect(() => {
    const handlePosChange = (data: { x: number; y: number; angle: number }) => {
      setLiveShip({ x: data.x, y: data.y, angle: data.angle });
    };

    eventBus.on('SHIP_POSITION_CHANGED', handlePosChange);
    return () => {
      eventBus.off('SHIP_POSITION_CHANGED', handlePosChange);
    };
  }, []);

  // Sync props ship position fallback
  useEffect(() => {
    setLiveShip({ x: ship.x, y: ship.y, angle: ship.angle });
  }, [ship.x, ship.y, ship.angle]);

  const radarSize = 160;
  const cx = radarSize / 2; // 80
  const cy = radarSize / 2; // 80
  const rMax = 70; // Outer circle radius

  // Calculate direction & distance to all galaxies
  const galaxyPointers = GALAXIES.map((g) => {
    const dx = g.x - liveShip.x;
    const dy = g.y - liveShip.y;
    const dist = Math.hypot(dx, dy);
    const angle = Math.atan2(dy, dx);
    const isDiscovered = profile.discoveredGalaxyIds.includes(g.id);
    return {
      galaxy: g,
      dist,
      angle,
      dx,
      dy,
      isDiscovered,
    };
  }).sort((a, b) => a.dist - b.dist);

  const nearestGalaxy = galaxyPointers[0];

  // Alpha Station world coordinates (Safe Sector Hub)
  const stationWorldX = worldWidth / 2 - 800;
  const stationWorldY = worldHeight / 2;
  const stationDx = stationWorldX - liveShip.x;
  const stationDy = stationWorldY - liveShip.y;
  const stationDist = Math.hypot(stationDx, stationDy);

  return (
    <div className="absolute bottom-4 right-4 z-20 pointer-events-none flex flex-col items-end gap-2 font-sans select-none">
      
      {/* Nearest Target Navigation Pointer Banner */}
      {nearestGalaxy && isExpanded && (
        <div className="p-2 rounded-lg bg-slate-950/90 border border-amber-500/40 backdrop-blur-md pointer-events-auto flex items-center gap-2.5 text-xs font-mono shadow-xl">
          <div
            className="p-1.5 rounded bg-amber-500/20 text-amber-400 transition-transform duration-100"
            style={{ transform: `rotate(${nearestGalaxy.angle + Math.PI / 2}rad)` }}
          >
            <Navigation size={14} />
          </div>
          <div>
            <div className="text-[9px] text-slate-400 uppercase tracking-wider flex items-center gap-1.5 font-bold">
              <span>{t('NEAREST TARGET', 'নিকটতম টার্গেট')}</span>
              {nearestGalaxy.isDiscovered ? (
                <span className="text-emerald-400 text-[8px] font-bold px-1 rounded bg-emerald-950/80 border border-emerald-500/40">[MAPPED]</span>
              ) : (
                <span className="text-cyan-400 text-[8px] font-bold px-1 rounded bg-cyan-950/80 border border-cyan-500/40">[UNEXPLORED]</span>
              )}
            </div>
            <div className="text-[11px] font-bold text-amber-300 flex items-center gap-1.5 mt-0.5">
              <span>{nearestGalaxy.galaxy.name}</span>
              <span className="text-slate-400 font-normal">({Math.round(nearestGalaxy.dist)} ly)</span>
            </div>
          </div>
        </div>
      )}

      {/* Main Radar Container */}
      <div className="pointer-events-auto flex flex-col items-end">
        {/* Toggle Collapse & Mode Controls */}
        <div className="mb-1 flex items-center gap-1">
          {isExpanded && (
            <button
              onClick={() => setMode(mode === 'TACTICAL' ? 'SECTOR' : 'TACTICAL')}
              className="px-2 py-0.5 rounded bg-black/80 hover:bg-slate-900 border border-slate-700 text-cyan-300 text-[9px] font-mono flex items-center gap-1 backdrop-blur-md cursor-pointer transition-all shadow-md"
              title="Toggle Tactical Radar vs Full Sector Overview"
            >
              <Layers size={10} />
              <span>{mode === 'TACTICAL' ? 'SECTOR MAP' : 'TACTICAL RADAR'}</span>
            </button>
          )}

          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="px-2 py-0.5 rounded bg-black/80 hover:bg-slate-900 border border-slate-700 text-cyan-400 text-[9px] font-mono flex items-center gap-1 backdrop-blur-md cursor-pointer transition-all shadow-md"
          >
            <Radio size={10} className={isExpanded ? 'animate-pulse text-emerald-400' : 'text-slate-400'} />
            <span>{isExpanded ? 'COLLAPSE' : 'EXPAND MINIMAP'}</span>
            {isExpanded ? <ChevronDown size={10} /> : <ChevronUp size={10} />}
          </button>
        </div>

        {isExpanded && (
          <div className="relative w-[160px] h-[160px] rounded-lg bg-slate-950/95 border border-cyan-500/40 backdrop-blur-xl overflow-hidden p-1 shadow-2xl transition-all select-none">
            
            {/* Background Tactical Grid Lines */}
            <div className="absolute inset-0 border border-cyan-500/20 rounded-full m-1 pointer-events-none" />
            <div className="absolute inset-0 border border-cyan-500/10 rounded-full m-7 pointer-events-none" />
            <div className="absolute top-1/2 left-0 w-full h-px bg-cyan-500/20 pointer-events-none" />
            <div className="absolute top-0 left-1/2 w-px h-full bg-cyan-500/20 pointer-events-none" />

            {/* A. MODE 1: TACTICAL RADAR (PLAYER CENTERED, REAL-TIME WORLD SPACE CONVERSION) */}
            {mode === 'TACTICAL' && (
              <>
                {/* Scanner Range Circle Ring centered on player */}
                {(() => {
                  const scale = rMax / tacticalRange;
                  const scanRadiusPx = SCANNER_CONFIG.scanRadius * scale;
                  return (
                    <div
                      className="absolute rounded-full border border-cyan-400/30 bg-cyan-500/5 pointer-events-none animate-pulse"
                      style={{
                        width: `${scanRadiusPx * 2}px`,
                        height: `${scanRadiusPx * 2}px`,
                        left: `${cx - scanRadiusPx}px`,
                        top: `${cy - scanRadiusPx}px`,
                      }}
                    />
                  );
                })()}

                {/* Safe Station Marker (Alpha Hub) */}
                {(() => {
                  const scale = rMax / tacticalRange;
                  const inRange = stationDist <= tacticalRange;
                  let sx = cx + stationDx * scale;
                  let sy = cy + stationDy * scale;

                  if (!inRange) {
                    const angle = Math.atan2(stationDy, stationDx);
                    sx = cx + Math.cos(angle) * (rMax - 4);
                    sy = cy + Math.sin(angle) * (rMax - 4);
                  }

                  return (
                    <div
                      className={`absolute w-3 h-3 -ml-1.5 -mt-1.5 rounded-full flex items-center justify-center text-[7px] text-white font-mono shadow-[0_0_8px_#6366f1] cursor-pointer group z-10 ${
                        inRange ? 'bg-indigo-500 border border-white' : 'bg-indigo-800/80 border border-indigo-400/50 opacity-70'
                      }`}
                      style={{ left: `${sx}px`, top: `${sy}px` }}
                      title={`Alpha Station (${Math.round(stationDist)} ly)`}
                    >
                      <Orbit size={8} />
                      <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1 hidden group-hover:block bg-black text-[9px] text-indigo-300 px-1.5 py-0.5 rounded border border-indigo-500 whitespace-nowrap z-30 font-mono">
                        Alpha Hub ({Math.round(stationDist)} ly)
                      </div>
                    </div>
                  );
                })()}

                {/* Relative Galaxies in Tactical Space */}
                {galaxyPointers.map((gp) => {
                  const scale = rMax / tacticalRange;
                  const inRange = gp.dist <= tacticalRange;
                  let gx = cx + gp.dx * scale;
                  let gy = cy + gp.dy * scale;

                  if (!inRange) {
                    // Edge Indicator along perimeter ring
                    gx = cx + Math.cos(gp.angle) * (rMax - 4);
                    gy = cy + Math.sin(gp.angle) * (rMax - 4);
                  }

                  return (
                    <div
                      key={gp.galaxy.id}
                      onClick={() => onWarpToGalaxy(gp.galaxy)}
                      className={`absolute rounded-full cursor-pointer transition-transform group ${
                        inRange
                          ? 'w-3 h-3 -ml-1.5 -mt-1.5 hover:scale-150 z-20'
                          : 'w-2 h-2 -ml-1 -mt-1 opacity-75 z-10'
                      } ${
                        gp.isDiscovered
                          ? 'ring-2 ring-amber-400 shadow-[0_0_8px_#f59e0b]'
                          : 'ring-1 ring-cyan-400/80'
                      }`}
                      style={{
                        left: `${gx}px`,
                        top: `${gy}px`,
                        backgroundColor: gp.galaxy.visualColor,
                      }}
                      title={`${gp.galaxy.name} (${Math.round(gp.dist)} ly)`}
                    >
                      {/* Tooltip on hover */}
                      <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1 hidden group-hover:block bg-black text-[9px] text-white px-1.5 py-0.5 rounded border border-white/20 whitespace-nowrap z-30 font-mono">
                        {gp.galaxy.name} ({Math.round(gp.dist)} ly) {gp.isDiscovered ? '✓' : ''}
                      </div>
                    </div>
                  );
                })}

                {/* Player Ship Marker (Always Centered in Tactical Mode) */}
                <div
                  className="absolute w-4 h-4 -ml-2 -mt-2 z-30 flex items-center justify-center pointer-events-none"
                  style={{ left: `${cx}px`, top: `${cy}px` }}
                >
                  <div
                    className="text-white drop-shadow-[0_0_8px_#38bdf8]"
                    style={{ transform: `rotate(${liveShip.angle + Math.PI / 2}rad)` }}
                  >
                    <Navigation size={13} className="fill-cyan-400 text-white" />
                  </div>
                </div>
              </>
            )}

            {/* B. MODE 2: FULL SECTOR OVERVIEW MAP */}
            {mode === 'SECTOR' && (
              <>
                {/* Sector Galaxies */}
                {GALAXIES.map((g) => {
                  const scaleX = radarSize / worldWidth;
                  const scaleY = radarSize / worldHeight;
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
                    >
                      <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1 hidden group-hover:block bg-black text-[9px] text-white px-1.5 py-0.5 rounded border border-white/20 whitespace-nowrap z-30 font-mono">
                        {g.name} {isDiscovered ? '✓' : ''}
                      </div>
                    </div>
                  );
                })}

                {/* Moving Player Marker in Sector Mode */}
                {(() => {
                  const scaleX = radarSize / worldWidth;
                  const scaleY = radarSize / worldHeight;
                  const px = liveShip.x * scaleX;
                  const py = liveShip.y * scaleY;
                  return (
                    <div
                      className="absolute w-3 h-3 -ml-1.5 -mt-1.5 z-30 flex items-center justify-center pointer-events-none"
                      style={{ left: `${px}px`, top: `${py}px` }}
                    >
                      <div
                        className="text-white drop-shadow-[0_0_6px_#ffffff]"
                        style={{ transform: `rotate(${liveShip.angle + Math.PI / 2}rad)` }}
                      >
                        <Navigation size={12} className="fill-white" />
                      </div>
                    </div>
                  );
                })()}
              </>
            )}

            {/* Radar Footer Label & Range Control */}
            <div className="absolute bottom-1 left-1.5 right-1.5 flex items-center justify-between text-[8px] font-mono text-cyan-400 uppercase tracking-widest opacity-90">
              <div className="flex items-center gap-1 font-bold">
                <Compass size={10} />
                <span>{mode === 'TACTICAL' ? 'TACTICAL' : 'SECTOR'}</span>
              </div>
              {mode === 'TACTICAL' && (
                <button
                  onClick={() => setTacticalRange(tacticalRange === 1400 ? 2800 : tacticalRange === 2800 ? 5000 : 1400)}
                  className="px-1 py-0.2 rounded bg-black/60 border border-cyan-500/40 text-[7px] text-cyan-300 font-mono cursor-pointer hover:bg-cyan-950"
                  title="Cycle Tactical Zoom Range"
                >
                  {tacticalRange}LY
                </button>
              )}
            </div>

          </div>
        )}
      </div>

    </div>
  );
}
