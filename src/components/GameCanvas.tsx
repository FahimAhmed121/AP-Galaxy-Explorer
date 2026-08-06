import React, { useEffect, useRef, useState } from 'react';
import { Compass } from 'lucide-react';
import { Spaceship, Galaxy } from '../types';
import { GALAXIES } from '../data/galaxies';
import { useGameStore } from '../store/useGameStore';

import ShipStatusHUD from './hud/ShipStatusHUD';
import RadarHUD from './hud/RadarHUD';
import PilotDashboardModal from './hud/PilotDashboardModal';
import GameOverModal from './hud/GameOverModal';
import DiscoveryOverlay from './hud/DiscoveryOverlay';
import WarpJumpOverlay from './hud/WarpJumpOverlay';
import GameContainer from './common/GameContainer';
import { eventBus } from '../core/events';
import { WORLD_SIZE } from '../core/constants';

interface GameCanvasProps {
  onDiscoverGalaxy: (galaxyId: string) => void;
  discoveredIds: string[];
  soundEnabled: boolean;
  onExitToMenu: () => void;
  savedShipState: Spaceship | null;
  onSaveShipState: (ship: Spaceship) => void;
  onOpenArchive: () => void;
  onOpenSettings: () => void;
}

export default function GameCanvas({
  onDiscoverGalaxy,
  soundEnabled,
  onExitToMenu,
  savedShipState,
  onSaveShipState,
  onOpenArchive,
  onOpenSettings,
}: GameCanvasProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const { settings, profile, saveShipState, addStardust } = useGameStore();

  const isBN = settings.language === 'BN';
  const t = (en: string, bn: string) => (isBN ? bn : en);

  // Modals & Overlay state
  const [isGameOver, setIsGameOver] = useState(false);
  const [showDashboard, setShowDashboard] = useState(false);
  const [nearGalaxy, setNearGalaxy] = useState<Galaxy | null>(null);

  // Ship State mirror
  const [hudShip, setHudShip] = useState<Spaceship>(
    savedShipState || {
      x: WORLD_SIZE / 2,
      y: WORLD_SIZE / 2 - 800,
      vx: 0,
      vy: 0,
      angle: -Math.PI / 2,
      radius: 18,
      health: 100,
      maxHealth: 100,
      shield: 100,
      maxShield: 100,
      stardust: profile.stardustReserves ?? 0,
      score: profile.totalScore || 0,
      level: 1,
      speedUpgrade: 1,
      shieldUpgrade: 1,
      weaponUpgrade: 1,
      magnetUpgrade: 1,
    }
  );

  const [isScanOrDiscoveryActive, setIsScanOrDiscoveryActive] = useState(false);

  // 1. Sync Ship Stats & State from Phaser EventBus
  useEffect(() => {
    const handleResetGame = () => {
      setHudShip({
        x: WORLD_SIZE / 2,
        y: WORLD_SIZE / 2 - 800,
        vx: 0,
        vy: 0,
        angle: -Math.PI / 2,
        radius: 18,
        health: 100,
        maxHealth: 100,
        shield: 100,
        maxShield: 100,
        stardust: 0,
        score: 0,
        level: 1,
        speedUpgrade: 1,
        shieldUpgrade: 1,
        weaponUpgrade: 1,
        magnetUpgrade: 1,
      });
      setIsScanOrDiscoveryActive(false);
      setIsGameOver(false);
      setNearGalaxy(null);
    };
    const handlePos = (data: { x: number; y: number; angle: number; speed: number }) => {
      setHudShip((prev) => {
        const next = { ...prev, x: data.x, y: data.y, angle: data.angle };
        // Check near galaxy
        let currentNear: Galaxy | null = null;
        GALAXIES.forEach((g) => {
          const dist = Math.hypot(data.x - g.x, data.y - g.y);
          if (dist < g.radius * 1.6) {
            currentNear = g;
          }
        });
        setNearGalaxy(currentNear);
        return next;
      });
    };

    const handleHealth = (data: { current: number; max: number }) => {
      setHudShip((prev) => ({ ...prev, health: data.current, maxHealth: data.max }));
    };

    const handleShield = (data: { current: number; max: number }) => {
      setHudShip((prev) => ({ ...prev, shield: data.current, maxShield: data.max }));
    };

    const handleEnergy = (data: { current: number; max: number }) => {
      setHudShip((prev) => ({ ...prev, energy: data.current, maxEnergy: data.max }));
    };

    const handleStats = (data: Partial<Spaceship>) => {
      setHudShip((prev) => {
        const updated = { ...prev, ...data };
        onSaveShipState(updated);
        return updated;
      });
    };

    const handleStardustCollected = (data: { amount: number }) => {
      addStardust(data.amount);
    };

    const handlePlayerDestroyed = () => {
      setIsGameOver(true);
    };

    const handleScanStarted = () => setIsScanOrDiscoveryActive(true);
    const handleScanEnded = () => setIsScanOrDiscoveryActive(false);
    const handleDiscoveryStarted = () => setIsScanOrDiscoveryActive(true);
    const handleDiscoveryFinished = () => setIsScanOrDiscoveryActive(false);
    const handleLearningStarted = () => setIsScanOrDiscoveryActive(true);
    const handleLearningFinished = () => setIsScanOrDiscoveryActive(false);

    eventBus.on('SHIP_POSITION_CHANGED', handlePos);
    eventBus.on('SHIP_HEALTH_CHANGED', handleHealth);
    eventBus.on('SHIP_SHIELD_CHANGED', handleShield);
    eventBus.on('SHIP_ENERGY_CHANGED', handleEnergy);
    eventBus.on('SHIP_STATS_CHANGED', handleStats);
    eventBus.on('STARDUST_COLLECTED', handleStardustCollected);
    eventBus.on('PLAYER_DESTROYED', handlePlayerDestroyed);

    eventBus.on('SCAN_STARTED', handleScanStarted);
    eventBus.on('SCAN_COMPLETED', handleScanEnded);
    eventBus.on('SCAN_CANCELLED', handleScanEnded);
    eventBus.on('DISCOVERY_STARTED', handleDiscoveryStarted);
    eventBus.on('DISCOVERY_FINISHED', handleDiscoveryFinished);
    eventBus.on('LEARNING_STARTED', handleLearningStarted);
    eventBus.on('LEARNING_FINISHED', handleLearningFinished);
    eventBus.on('RESET_GAME', handleResetGame);

    return () => {
      eventBus.off('SHIP_POSITION_CHANGED', handlePos);
      eventBus.off('SHIP_HEALTH_CHANGED', handleHealth);
      eventBus.off('SHIP_SHIELD_CHANGED', handleShield);
      eventBus.off('SHIP_ENERGY_CHANGED', handleEnergy);
      eventBus.off('SHIP_STATS_CHANGED', handleStats);
      eventBus.off('STARDUST_COLLECTED', handleStardustCollected);
      eventBus.off('PLAYER_DESTROYED', handlePlayerDestroyed);

      eventBus.off('SCAN_STARTED', handleScanStarted);
      eventBus.off('SCAN_COMPLETED', handleScanEnded);
      eventBus.off('SCAN_CANCELLED', handleScanEnded);
      eventBus.off('DISCOVERY_STARTED', handleDiscoveryStarted);
      eventBus.off('DISCOVERY_FINISHED', handleDiscoveryFinished);
      eventBus.off('LEARNING_STARTED', handleLearningStarted);
      eventBus.off('LEARNING_FINISHED', handleLearningFinished);
      eventBus.off('RESET_GAME', handleResetGame);
    };
  }, [addStardust, onSaveShipState]);

  // 2. Keyboard Event Listeners for Dashboard
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'KeyP' || e.code === 'Tab') {
        e.preventDefault();
        setShowDashboard((prev) => !prev);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Handle Ship Upgrades & Updates
  const handleUpdateShip = (updatedShip: Spaceship) => {
    setHudShip(updatedShip);
    saveShipState(updatedShip);
    onSaveShipState(updatedShip);

    // Notify Phaser PlayerShip entity
    eventBus.emit('UPDATE_SHIP_STATS', updatedShip);
  };

  const handleRespawn = () => {
    setIsGameOver(false);
    const respawnShip = {
      ...hudShip,
      health: hudShip.maxHealth,
      shield: hudShip.maxShield,
      x: WORLD_SIZE / 2,
      y: WORLD_SIZE / 2 - 800,
    };
    handleUpdateShip(respawnShip);
  };

  return (
    <div ref={containerRef} className="relative w-full h-screen overflow-hidden bg-[#050508] select-none font-sans">
      {/* 1. Phaser 3 Game Engine WebGL Canvas */}
      <GameContainer className="absolute inset-0 z-0" />

      {/* 2. Top Status HUD Bar */}
      {(() => {
        const nearestGalaxy = GALAXIES.reduce(
          (closest, g) => {
            const dist = Math.hypot(hudShip.x - g.x, hudShip.y - g.y);
            return dist < closest.dist ? { galaxy: g, dist } : closest;
          },
          { galaxy: GALAXIES[0], dist: Infinity }
        ).galaxy;
        const currentGalaxyName = nearGalaxy?.name || nearestGalaxy?.name || 'Milky Way Sector';

        return (
          <ShipStatusHUD
            ship={hudShip}
            currentGalaxyName={currentGalaxyName}
            onOpenDashboard={() => setShowDashboard(true)}
            onOpenArchive={onOpenArchive}
            onOpenSettings={onOpenSettings}
          />
        );
      })()}

      {/* Discovery Experience AURA & Metadata Overlay */}
      <DiscoveryOverlay />

      {/* Warp Jump Hyperspace Cinematic Overlay */}
      <WarpJumpOverlay />

      {/* 3. Bottom Right Radar & Map Navigation */}
      <RadarHUD
        ship={hudShip}
        worldWidth={WORLD_SIZE}
        worldHeight={WORLD_SIZE}
        onWarpToGalaxy={(galaxy) => onDiscoverGalaxy(galaxy.id)}
      />

      {/* 4. Near Galaxy Discovery Prompt */}
      {nearGalaxy && !isGameOver && !isScanOrDiscoveryActive && !showDashboard && (
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-30 pointer-events-auto">
          <div className="px-5 py-3 rounded-2xl bg-slate-950/85 border border-amber-400/40 shadow-2xl shadow-amber-500/10 backdrop-blur-lg flex flex-col sm:flex-row items-center gap-4 text-center sm:text-left transition-all">
            <div className="p-2.5 rounded-xl bg-amber-400/10 text-amber-400 border border-amber-400/20">
              <Compass size={22} />
            </div>
            <div>
              <div className="text-[10px] font-mono text-amber-400 uppercase tracking-widest font-semibold">
                {t('CELESTIAL DISCOVERY ZONE', 'মহাজাগতিক আবিষ্কার অঞ্চল')}
              </div>
              <div className="text-sm sm:text-base font-serif italic text-slate-100 font-bold">
                {nearGalaxy.name}
              </div>
            </div>
            <button
              onClick={() => eventBus.emit('TRIGGER_SCAN')}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-mono font-bold text-xs uppercase tracking-wider shadow-lg shadow-cyan-500/20 active:scale-95 transition-all cursor-pointer border border-cyan-300/30"
            >
              {t('PRESS [E] TO SCAN GALAXY', 'গ্যালাক্সি স্ক্যান করুন [E]')}
            </button>
          </div>
        </div>
      )}

      {/* 5. Pilot Dashboard Station Modal */}
      {showDashboard && (
        <PilotDashboardModal
          ship={hudShip}
          onUpdateShip={handleUpdateShip}
          onWarpToGalaxy={(galaxy) => {
            setShowDashboard(false);
            onDiscoverGalaxy(galaxy.id);
          }}
          onClose={() => setShowDashboard(false)}
        />
      )}

      {/* 6. Game Over Modal */}
      {isGameOver && (
        <GameOverModal
          ship={hudShip}
          onRespawn={handleRespawn}
          onReturnMenu={onExitToMenu}
        />
      )}
    </div>
  );
}
