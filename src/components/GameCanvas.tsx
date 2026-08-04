import React, { useEffect, useRef, useState } from 'react';
import { Compass, Navigation, Radio, RotateCcw, Home, Sparkles, SlidersHorizontal } from 'lucide-react';
import { Spaceship, Asteroid, Laser, Particle, StardustItem, Galaxy } from '../types';
import { GALAXIES } from '../data/galaxies';
import { useGameStore } from '../store/useGameStore';
import { audioEngine } from '../engine/audioEngine';

import ShipStatusHUD from './hud/ShipStatusHUD';
import RadarHUD from './hud/RadarHUD';
import PilotDashboardModal from './hud/PilotDashboardModal';
import GameOverModal from './hud/GameOverModal';
import DiscoveryOverlay from './hud/DiscoveryOverlay';
import WarpJumpOverlay from './hud/WarpJumpOverlay';
import GameContainer from './common/GameContainer';
import { eventBus } from '../core/events';

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

import { WORLD_SIZE } from '../core/constants';

export default function GameCanvas({
  onDiscoverGalaxy,
  discoveredIds,
  soundEnabled,
  onExitToMenu,
  savedShipState,
  onSaveShipState,
  onOpenArchive,
  onOpenSettings,
}: GameCanvasProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const { settings, profile, saveShipState } = useGameStore();
  const isBN = settings.language === 'BN';
  const t = (en: string, bn: string) => (isBN ? bn : en);

  // Modals & Overlay state
  const [isGameOver, setIsGameOver] = useState(false);
  const [showDashboard, setShowDashboard] = useState(false);
  const [nearGalaxy, setNearGalaxy] = useState<Galaxy | null>(null);
  const [screenShake, setScreenShake] = useState(0);

  // Ship State
  const shipRef = useRef<Spaceship>(
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
      stardust: 50,
      score: 0,
      level: 1,
      speedUpgrade: 1,
      shieldUpgrade: 1,
      weaponUpgrade: 1,
      magnetUpgrade: 1,
    }
  );

  // React state mirror for HUD updates
  const [hudShip, setHudShip] = useState<Spaceship>({ ...shipRef.current });

  // Sync ship position & stats real-time from Phaser eventBus
  useEffect(() => {
    const handlePos = (data: { x: number; y: number; angle: number; speed: number }) => {
      shipRef.current.x = data.x;
      shipRef.current.y = data.y;
      shipRef.current.angle = data.angle;
      setHudShip((prev) => ({
        ...prev,
        x: data.x,
        y: data.y,
        angle: data.angle,
      }));
    };

    const handleHealth = (data: { current: number; max: number }) => {
      shipRef.current.health = data.current;
      shipRef.current.maxHealth = data.max;
      setHudShip((prev) => ({ ...prev, health: data.current, maxHealth: data.max }));
    };

    const handleShield = (data: { current: number; max: number }) => {
      shipRef.current.shield = data.current;
      shipRef.current.maxShield = data.max;
      setHudShip((prev) => ({ ...prev, shield: data.current, maxShield: data.max }));
    };

    const handleEnergy = (data: { current: number; max: number }) => {
      shipRef.current.energy = data.current;
      shipRef.current.maxEnergy = data.max;
      setHudShip((prev) => ({ ...prev, energy: data.current, maxEnergy: data.max }));
    };

    eventBus.on('SHIP_POSITION_CHANGED', handlePos);
    eventBus.on('SHIP_HEALTH_CHANGED', handleHealth);
    eventBus.on('SHIP_SHIELD_CHANGED', handleShield);
    eventBus.on('SHIP_ENERGY_CHANGED', handleEnergy);

    return () => {
      eventBus.off('SHIP_POSITION_CHANGED', handlePos);
      eventBus.off('SHIP_HEALTH_CHANGED', handleHealth);
      eventBus.off('SHIP_SHIELD_CHANGED', handleShield);
      eventBus.off('SHIP_ENERGY_CHANGED', handleEnergy);
    };
  }, []);

  // Game Entities Refs
  const asteroidsRef = useRef<Asteroid[]>([]);
  const lasersRef = useRef<Laser[]>([]);
  const particlesRef = useRef<Particle[]>([]);
  const stardustItemsRef = useRef<StardustItem[]>([]);
  const starsRef = useRef<{ x: number; y: number; size: number; alpha: number }[]>([]);

  // Key controls
  const keysRef = useRef<{ [key: string]: boolean }>({});
  const lastShotRef = useRef<number>(0);

  // Initialize Starfield & Asteroid belt
  useEffect(() => {
    // Generate background stars
    const stars: { x: number; y: number; size: number; alpha: number }[] = [];
    for (let i = 0; i < 600; i++) {
      stars.push({
        x: Math.random() * WORLD_SIZE,
        y: Math.random() * WORLD_SIZE,
        size: Math.random() * 2 + 0.5,
        alpha: Math.random() * 0.8 + 0.2,
      });
    }
    starsRef.current = stars;

    // Generate initial asteroids
    const asteroids: Asteroid[] = [];
    for (let i = 0; i < 45; i++) {
      const type = Math.random() > 0.6 ? 'large' : Math.random() > 0.3 ? 'medium' : 'small';
      const radius = type === 'large' ? 36 : type === 'medium' ? 24 : 14;
      let x = Math.random() * WORLD_SIZE;
      let y = Math.random() * WORLD_SIZE;

      // Keep safe distance from initial ship position
      while (Math.hypot(x - shipRef.current.x, y - shipRef.current.y) < 500) {
        x = Math.random() * WORLD_SIZE;
        y = Math.random() * WORLD_SIZE;
      }

      asteroids.push({
        id: `ast-${i}-${Date.now()}`,
        x,
        y,
        vx: (Math.random() - 0.5) * 1.8,
        vy: (Math.random() - 0.5) * 1.8,
        radius,
        health: type === 'large' ? 60 : type === 'medium' ? 35 : 18,
        maxHealth: type === 'large' ? 60 : type === 'medium' ? 35 : 18,
        points: type === 'large' ? 100 : type === 'medium' ? 50 : 25,
        type,
      });
    }
    asteroidsRef.current = asteroids;
  }, []);

  // Keyboard Event Listeners
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      keysRef.current[e.code] = true;

      // Quick Key Commands
      if (e.code === 'KeyE' && nearGalaxy && !isGameOver) {
        onDiscoverGalaxy(nearGalaxy.id);
      }
      if (e.code === 'KeyP' || e.code === 'Tab') {
        e.preventDefault();
        setShowDashboard((prev) => !prev);
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      keysRef.current[e.code] = false;
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [nearGalaxy, isGameOver, onDiscoverGalaxy]);

  // Main 60FPS Game Engine Loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let lastTime = performance.now();

    const gameLoop = (currentTime: number) => {
      const dt = Math.min((currentTime - lastTime) / 1000, 0.08);
      lastTime = currentTime;

      // Canvas Resizing
      const width = (canvas.width = window.innerWidth);
      const height = (canvas.height = window.innerHeight);

      const ship = shipRef.current;

      if (!isGameOver) {
        // --- 1. SHIP CONTROLS & PHYSICS ---
        const turnSpeed = 3.8;
        if (keysRef.current['KeyA'] || keysRef.current['ArrowLeft']) {
          ship.angle -= turnSpeed * dt;
        }
        if (keysRef.current['KeyD'] || keysRef.current['ArrowRight']) {
          ship.angle += turnSpeed * dt;
        }

        const acceleration = 260 + ship.speedUpgrade * 45;
        if (keysRef.current['KeyW'] || keysRef.current['ArrowUp']) {
          ship.vx += Math.cos(ship.angle) * acceleration * dt;
          ship.vy += Math.sin(ship.angle) * acceleration * dt;

          audioEngine.playSound('thrust', soundEnabled, settings.sfxVolume * 0.3);

          // Thruster Particle Tail
          particlesRef.current.push({
            x: ship.x - Math.cos(ship.angle) * ship.radius,
            y: ship.y - Math.sin(ship.angle) * ship.radius,
            vx: -Math.cos(ship.angle) * 120 + (Math.random() - 0.5) * 40,
            vy: -Math.sin(ship.angle) * 120 + (Math.random() - 0.5) * 40,
            color: Math.random() > 0.5 ? '#f59e0b' : '#ef4444',
            alpha: 0.9,
            decay: 2.5,
            size: Math.random() * 4 + 2,
          });
        }
        if (keysRef.current['KeyS'] || keysRef.current['ArrowDown']) {
          ship.vx -= Math.cos(ship.angle) * (acceleration * 0.4) * dt;
          ship.vy -= Math.sin(ship.angle) * (acceleration * 0.4) * dt;
        }

        // Plasma Laser Firing
        const now = Date.now();
        const fireRate = 220 - ship.weaponUpgrade * 20;
        if ((keysRef.current['Space'] || keysRef.current['KeyF']) && now - lastShotRef.current > fireRate) {
          lastShotRef.current = now;
          audioEngine.playSound('laser', soundEnabled, settings.sfxVolume);

          const laserDamage = 20 + ship.weaponUpgrade * 10;
          lasersRef.current.push({
            id: `laser-${Date.now()}`,
            x: ship.x + Math.cos(ship.angle) * (ship.radius + 8),
            y: ship.y + Math.sin(ship.angle) * (ship.radius + 8),
            vx: Math.cos(ship.angle) * 750 + ship.vx * 0.5,
            vy: Math.sin(ship.angle) * 750 + ship.vy * 0.5,
            angle: ship.angle,
            radius: 4,
            damage: laserDamage,
          });
        }

        // Apply friction
        const friction = 0.982;
        ship.vx *= Math.pow(friction, dt * 60);
        ship.vy *= Math.pow(friction, dt * 60);

        // Update Ship Position
        ship.x += ship.vx * dt;
        ship.y += ship.vy * dt;

        // World Bounds Clamp
        ship.x = Math.max(ship.radius, Math.min(WORLD_SIZE - ship.radius, ship.x));
        ship.y = Math.max(ship.radius, Math.min(WORLD_SIZE - ship.radius, ship.y));

        // Shield Recharge
        if (ship.shield < ship.maxShield) {
          ship.shield = Math.min(ship.maxShield, ship.shield + 4 * dt);
        }

        // --- 2. UPDATE LASERS ---
        lasersRef.current.forEach((laser) => {
          laser.x += laser.vx * dt;
          laser.y += laser.vy * dt;
        });
        // Remove lasers out of world bounds or lifetime
        lasersRef.current = lasersRef.current.filter(
          (l) => l.x >= 0 && l.x <= WORLD_SIZE && l.y >= 0 && l.y <= WORLD_SIZE
        );

        // --- 3. UPDATE ASTEROIDS & COLLISIONS ---
        const nextAsteroids: Asteroid[] = [];
        asteroidsRef.current.forEach((ast) => {
          ast.x += ast.vx * dt;
          ast.y += ast.vy * dt;

          // Wrap asteroids around world edge
          if (ast.x < -100) ast.x = WORLD_SIZE + 100;
          if (ast.x > WORLD_SIZE + 100) ast.x = -100;
          if (ast.y < -100) ast.y = WORLD_SIZE + 100;
          if (ast.y > WORLD_SIZE + 100) ast.y = -100;

          let astDestroyed = false;

          // Check Laser-Asteroid collision
          lasersRef.current.forEach((laser, lIdx) => {
            if (astDestroyed) return;
            const dist = Math.hypot(laser.x - ast.x, laser.y - ast.y);
            if (dist < laser.radius + ast.radius) {
              // Destroy laser
              lasersRef.current.splice(lIdx, 1);
              ast.health -= laser.damage;

              // Hit spark particles
              for (let p = 0; p < 6; p++) {
                particlesRef.current.push({
                  x: laser.x,
                  y: laser.y,
                  vx: (Math.random() - 0.5) * 150,
                  vy: (Math.random() - 0.5) * 150,
                  color: '#38bdf8',
                  alpha: 1,
                  decay: 3.5,
                  size: Math.random() * 3 + 1,
                });
              }

              if (ast.health <= 0) {
                astDestroyed = true;
                ship.score += ast.points;
                audioEngine.playSound('explosion', soundEnabled, settings.sfxVolume);

                // Spawn Stardust
                const dustCount = ast.type === 'large' ? 5 : ast.type === 'medium' ? 3 : 1;
                for (let d = 0; d < dustCount; d++) {
                  stardustItemsRef.current.push({
                    id: `dust-${Date.now()}-${Math.random()}`,
                    x: ast.x + (Math.random() - 0.5) * ast.radius,
                    y: ast.y + (Math.random() - 0.5) * ast.radius,
                    value: 10,
                    size: 6,
                  });
                }

                // Split larger asteroids into smaller fragments
                if (ast.type === 'large') {
                  for (let s = 0; s < 2; s++) {
                    nextAsteroids.push({
                      id: `ast-split-${Date.now()}-${s}`,
                      x: ast.x,
                      y: ast.y,
                      vx: (Math.random() - 0.5) * 2.5,
                      vy: (Math.random() - 0.5) * 2.5,
                      radius: 22,
                      health: 30,
                      maxHealth: 30,
                      points: 50,
                      type: 'medium',
                    });
                  }
                } else if (ast.type === 'medium') {
                  for (let s = 0; s < 2; s++) {
                    nextAsteroids.push({
                      id: `ast-split-${Date.now()}-${s}`,
                      x: ast.x,
                      y: ast.y,
                      vx: (Math.random() - 0.5) * 3,
                      vy: (Math.random() - 0.5) * 3,
                      radius: 12,
                      health: 15,
                      maxHealth: 15,
                      points: 25,
                      type: 'small',
                    });
                  }
                }
              }
            }
          });

          // Check Ship-Asteroid collision
          if (!astDestroyed) {
            const shipDist = Math.hypot(ship.x - ast.x, ship.y - ast.y);
            if (shipDist < ship.radius + ast.radius) {
              astDestroyed = true;
              audioEngine.playSound('impact', soundEnabled, settings.sfxVolume);
              setScreenShake(8);

              // Calculate damage
              const damage = ast.type === 'large' ? 35 : ast.type === 'medium' ? 20 : 10;
              if (ship.shield > 0) {
                const shieldDmg = Math.min(ship.shield, damage);
                ship.shield -= shieldDmg;
                const leftover = damage - shieldDmg;
                if (leftover > 0) ship.health -= leftover;
              } else {
                ship.health -= damage;
              }

              // Check Hull Destruction
              if (ship.health <= 0) {
                ship.health = 0;
                setIsGameOver(true);
              }
            }
          }

          if (!astDestroyed) {
            nextAsteroids.push(ast);
          }
        });
        asteroidsRef.current = nextAsteroids;

        // --- 4. STARDUST MAGNETIC ATTRACTION ---
        const magnetRange = 100 + (ship.magnetUpgrade || 1) * 45;
        stardustItemsRef.current = stardustItemsRef.current.filter((dust) => {
          const dist = Math.hypot(ship.x - dust.x, ship.y - dust.y);

          if (dist < magnetRange) {
            const pullSpeed = 280;
            const angle = Math.atan2(ship.y - dust.y, ship.x - dust.x);
            dust.x += Math.cos(angle) * pullSpeed * dt;
            dust.y += Math.sin(angle) * pullSpeed * dt;
          }

          if (dist < ship.radius + dust.size) {
            ship.stardust += dust.value;
            ship.score += 15;
            audioEngine.playSound('powerup', soundEnabled, settings.sfxVolume * 0.5);
            return false;
          }
          return true;
        });

        // --- 5. GALAXY ORBIT PROXIMITY DETECTION ---
        let currentNear: Galaxy | null = null;
        GALAXIES.forEach((g) => {
          const dist = Math.hypot(ship.x - g.x, ship.y - g.y);
          if (dist < g.radius * 1.6) {
            currentNear = g;
          }
        });
        setNearGalaxy(currentNear);

        // Update HUD ship state mirror
        setHudShip({ ...ship });
        onSaveShipState(ship);
      }

      // --- 6. PARTICLES UPDATE ---
      particlesRef.current.forEach((p) => {
        p.x += p.vx * dt;
        p.y += p.vy * dt;
        p.alpha -= p.decay * dt;
      });
      particlesRef.current = particlesRef.current.filter((p) => p.alpha > 0);

      // --- 7. RENDERING STAGE ---
      // Apply screen shake offset
      let shakeX = 0;
      let shakeY = 0;
      if (screenShake > 0) {
        shakeX = (Math.random() - 0.5) * screenShake;
        shakeY = (Math.random() - 0.5) * screenShake;
        setScreenShake((prev) => Math.max(0, prev - dt * 25));
      }

      // Smooth Camera tracking centering the ship
      const cameraX = ship.x - width / 2 + shakeX;
      const cameraY = ship.y - height / 2 + shakeY;

      // Clear Canvas
      ctx.fillStyle = '#050508';
      ctx.fillRect(0, 0, width, height);

      ctx.save();
      ctx.translate(-cameraX, -cameraY);

      // Draw Grid Lines in World Space
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.03)';
      ctx.lineWidth = 1;
      const gridSize = 250;
      const startX = Math.floor(cameraX / gridSize) * gridSize;
      const startY = Math.floor(cameraY / gridSize) * gridSize;
      const endX = cameraX + width;
      const endY = cameraY + height;

      for (let x = startX; x < endX; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, cameraY);
        ctx.lineTo(x, cameraY + height);
        ctx.stroke();
      }
      for (let y = startY; y < endY; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(cameraX, y);
        ctx.lineTo(cameraX + width, y);
        ctx.stroke();
      }

      // Draw Stars
      starsRef.current.forEach((s) => {
        if (s.x >= cameraX && s.x <= endX && s.y >= cameraY && s.y <= endY) {
          ctx.fillStyle = `rgba(255, 255, 255, ${s.alpha})`;
          ctx.beginPath();
          ctx.arc(s.x, s.y, s.size, 0, Math.PI * 2);
          ctx.fill();
        }
      });

      // Draw World Boundaries
      ctx.strokeStyle = 'rgba(239, 68, 68, 0.4)';
      ctx.lineWidth = 4;
      ctx.strokeRect(0, 0, WORLD_SIZE, WORLD_SIZE);

      // Draw Galaxies
      GALAXIES.forEach((g) => {
        // Draw Galaxy Halo / Core
        const grad = ctx.createRadialGradient(g.x, g.y, 10, g.x, g.y, g.radius * 1.5);
        grad.addColorStop(0, g.visualColor);
        grad.addColorStop(0.6, `${g.visualColor}30`);
        grad.addColorStop(1, 'rgba(0, 0, 0, 0)');

        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(g.x, g.y, g.radius * 1.5, 0, Math.PI * 2);
        ctx.fill();

        // Galaxy Orbit Ring
        ctx.strokeStyle = `${g.visualColor}60`;
        ctx.lineWidth = 1.5;
        ctx.setLineDash([8, 8]);
        ctx.beginPath();
        ctx.arc(g.x, g.y, g.radius * 1.4, 0, Math.PI * 2);
        ctx.stroke();
        ctx.setLineDash([]);

        // Galaxy Name Label
        ctx.font = 'bold 12px "Courier New", monospace';
        ctx.fillStyle = '#ffffff';
        ctx.textAlign = 'center';
        ctx.fillText(g.name.toUpperCase(), g.x, g.y + g.radius * 1.7);
      });

      // Draw Asteroids
      asteroidsRef.current.forEach((ast) => {
        ctx.fillStyle = '#334155';
        ctx.strokeStyle = '#64748b';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(ast.x, ast.y, ast.radius, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
      });

      // Draw Stardust Items
      stardustItemsRef.current.forEach((dust) => {
        ctx.fillStyle = '#f59e0b';
        ctx.shadowColor = '#f59e0b';
        ctx.shadowBlur = 8;
        ctx.beginPath();
        ctx.arc(dust.x, dust.y, dust.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;
      });

      // Draw Lasers
      lasersRef.current.forEach((l) => {
        ctx.strokeStyle = '#38bdf8';
        ctx.lineWidth = 3;
        ctx.shadowColor = '#38bdf8';
        ctx.shadowBlur = 10;
        ctx.beginPath();
        ctx.moveTo(l.x, l.y);
        ctx.lineTo(l.x - Math.cos(l.angle) * 14, l.y - Math.sin(l.angle) * 14);
        ctx.stroke();
        ctx.shadowBlur = 0;
      });

      // Draw Particles
      particlesRef.current.forEach((p) => {
        ctx.fillStyle = p.color;
        ctx.globalAlpha = p.alpha;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.globalAlpha = 1.0;
      });

      // Draw Ship
      if (!isGameOver) {
        ctx.save();
        ctx.translate(ship.x, ship.y);
        ctx.rotate(ship.angle);

        // Shield Halo
        if (ship.shield > 0) {
          ctx.strokeStyle = `rgba(56, 189, 248, ${0.3 + (ship.shield / ship.maxShield) * 0.4})`;
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.arc(0, 0, ship.radius + 6, 0, Math.PI * 2);
          ctx.stroke();
        }

        // Ship Body Triangle
        ctx.fillStyle = '#f59e0b';
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(ship.radius + 4, 0);
        ctx.lineTo(-ship.radius, -ship.radius * 0.7);
        ctx.lineTo(-ship.radius * 0.5, 0);
        ctx.lineTo(-ship.radius, ship.radius * 0.7);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();

        ctx.restore();
      }

      ctx.restore(); // Restore camera transformation

      animId = requestAnimationFrame(gameLoop);
    };

    animId = requestAnimationFrame(gameLoop);

    return () => {
      cancelAnimationFrame(animId);
    };
  }, [isGameOver, soundEnabled, settings.sfxVolume]);

  // Respawn Handler
  const handleRespawn = () => {
    shipRef.current.health = shipRef.current.maxHealth;
    shipRef.current.shield = shipRef.current.maxShield;
    shipRef.current.x = WORLD_SIZE / 2;
    shipRef.current.y = WORLD_SIZE / 2;
    shipRef.current.vx = 0;
    shipRef.current.vy = 0;
    setIsGameOver(false);
  };

  return (
    <div ref={containerRef} className="relative w-full h-screen overflow-hidden bg-[#050508] select-none font-sans">
      {/* 1. Phaser 3 Game Engine Canvas */}
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
      {nearGalaxy && !isGameOver && (
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-30 pointer-events-auto">
          <div className="px-5 py-3 rounded-2xl bg-slate-950/75 border border-amber-400/40 shadow-2xl shadow-amber-500/10 backdrop-blur-lg flex flex-col sm:flex-row items-center gap-4 text-center sm:text-left transition-all">
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
              onClick={() => onDiscoverGalaxy(nearGalaxy.id)}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-amber-400 to-yellow-500 hover:from-amber-300 hover:to-yellow-400 text-slate-950 font-mono font-bold text-xs uppercase tracking-wider shadow-lg shadow-amber-500/20 active:scale-95 transition-all cursor-pointer border border-amber-300/30"
            >
              {t('Press E to Warp Jump', 'ওয়ার্প লাফ দিন (E)')}
            </button>
          </div>
        </div>
      )}

      {/* 5. Pilot Dashboard Station Modal */}
      {showDashboard && (
        <PilotDashboardModal
          ship={hudShip}
          onUpdateShip={(updatedShip) => {
            shipRef.current = updatedShip;
            setHudShip({ ...updatedShip });
            saveShipState(updatedShip);
          }}
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
