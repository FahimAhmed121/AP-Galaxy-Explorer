import React, { useEffect, useState, useRef } from 'react';
import { GALAXIES } from '../../data/galaxies';
import { Galaxy } from '../../types';
import { eventBus } from '../../core/events';
import { audioEngine } from '../../engine/audioEngine';
import { useGameStore } from '../../store/useGameStore';

export type WarpPhase =
  | 'IDLE'
  | 'ENGINE_CHARGE'
  | 'STAR_STRETCH'
  | 'WARP_TUNNEL'
  | 'BRIGHTNESS_BLOOM'
  | 'WARP_CRUISE'
  | 'EXIT_FLASH'
  | 'COMPLETE';

export default function WarpJumpOverlay() {
  const [targetGalaxy, setTargetGalaxy] = useState<Galaxy | null>(null);
  const [phase, setPhase] = useState<WarpPhase>('IDLE');
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const { settings } = useGameStore();

  useEffect(() => {
    const handleWarpTrigger = (payload: { targetGalaxyId: string }) => {
      const galaxy = GALAXIES.find((g) => g.id === payload.targetGalaxyId);
      if (!galaxy) return;

      setTargetGalaxy(galaxy);
      setPhase('ENGINE_CHARGE');
      audioEngine.playSound('warp', settings.sfxVolume > 0, settings.sfxVolume);
    };

    eventBus.on('WARP_JUMP_TRIGGERED', handleWarpTrigger);
    return () => {
      eventBus.off('WARP_JUMP_TRIGGERED', handleWarpTrigger);
    };
  }, [settings.sfxVolume]);

  // Handle cinematic phase timing
  useEffect(() => {
    if (phase === 'IDLE') return;

    let timer: NodeJS.Timeout;

    if (phase === 'ENGINE_CHARGE') {
      timer = setTimeout(() => setPhase('STAR_STRETCH'), 800);
    } else if (phase === 'STAR_STRETCH') {
      timer = setTimeout(() => setPhase('WARP_TUNNEL'), 800);
    } else if (phase === 'WARP_TUNNEL') {
      timer = setTimeout(() => setPhase('BRIGHTNESS_BLOOM'), 1000);
    } else if (phase === 'BRIGHTNESS_BLOOM') {
      timer = setTimeout(() => setPhase('WARP_CRUISE'), 700);
    } else if (phase === 'WARP_CRUISE') {
      timer = setTimeout(() => setPhase('EXIT_FLASH'), 1000);
    } else if (phase === 'EXIT_FLASH') {
      timer = setTimeout(() => {
        setPhase('COMPLETE');
        setTimeout(() => setPhase('IDLE'), 300);
      }, 700);
    }

    return () => clearTimeout(timer);
  }, [phase]);

  // Render Warp Canvas Particle Tunnel Effects
  useEffect(() => {
    if (phase === 'IDLE' || phase === 'COMPLETE') return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    // Create 300 warp tunnel particles
    const particles = Array.from({ length: 300 }, () => ({
      x: (Math.random() - 0.5) * width * 2,
      y: (Math.random() - 0.5) * height * 2,
      z: Math.random() * width,
      size: Math.random() * 2 + 1,
      color: Math.random() > 0.3 ? '#38bdf8' : '#818cf8',
    }));

    const centerX = width / 2;
    const centerY = height / 2;

    const render = () => {
      ctx.fillStyle = phase === 'BRIGHTNESS_BLOOM' || phase === 'EXIT_FLASH'
        ? 'rgba(255, 255, 255, 0.25)'
        : 'rgba(5, 5, 8, 0.3)';
      ctx.fillRect(0, 0, width, height);

      let speedMultiplier = 5;
      if (phase === 'STAR_STRETCH') speedMultiplier = 25;
      if (phase === 'WARP_TUNNEL') speedMultiplier = 60;
      if (phase === 'BRIGHTNESS_BLOOM') speedMultiplier = 120;
      if (phase === 'WARP_CRUISE') speedMultiplier = 80;
      if (phase === 'EXIT_FLASH') speedMultiplier = 30;

      particles.forEach((p) => {
        p.z -= speedMultiplier;
        if (p.z <= 0) {
          p.z = width;
          p.x = (Math.random() - 0.5) * width * 2;
          p.y = (Math.random() - 0.5) * height * 2;
        }

        const k = 250 / p.z;
        const px = p.x * k + centerX;
        const py = p.y * k + centerY;

        if (px >= 0 && px <= width && py >= 0 && py <= height) {
          const prevK = 250 / (p.z + speedMultiplier * 0.8);
          const prevPx = p.x * prevK + centerX;
          const prevPy = p.y * prevK + centerY;

          ctx.strokeStyle = p.color;
          ctx.lineWidth = Math.max(1, (1 - p.z / width) * 4);
          ctx.beginPath();
          ctx.moveTo(prevPx, prevPy);
          ctx.lineTo(px, py);
          ctx.stroke();
        }
      });

      animId = requestAnimationFrame(render);
    };

    render();

    return () => cancelAnimationFrame(animId);
  }, [phase]);

  if (phase === 'IDLE' || phase === 'COMPLETE') return null;

  return (
    <div className="fixed inset-0 z-50 pointer-events-none flex items-center justify-center overflow-hidden font-mono select-none">
      {/* 1. Starfield Warp Tunnel Canvas */}
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />

      {/* 2. Phase-Based HUD Telemetry & Radial Overlay */}
      <div className="relative z-10 flex flex-col items-center justify-center text-center space-y-4">
        
        {/* Phase Name Banner */}
        <div className="px-4 py-2 rounded bg-black/80 border border-cyan-500/60 shadow-2xl backdrop-blur-md">
          <span className="text-cyan-400 font-bold text-xs uppercase tracking-[0.3em] animate-pulse">
            {phase === 'ENGINE_CHARGE' && 'HYPERDRIVE CHARGING...'}
            {phase === 'STAR_STRETCH' && 'LIGHTSPEED ENGAGED'}
            {phase === 'WARP_TUNNEL' && 'ENTERED WARP VECTOR'}
            {phase === 'BRIGHTNESS_BLOOM' && 'SINGULARITY SHIFT'}
            {phase === 'WARP_CRUISE' && 'WARP CRUISE ACTIVE'}
            {phase === 'EXIT_FLASH' && 'DROPPING OUT OF WARP'}
          </span>
        </div>

        {/* Target Galaxy Telemetry */}
        {targetGalaxy && (
          <div className="p-3 rounded bg-black/60 border border-slate-800 text-[11px] text-slate-300 space-y-1">
            <span className="text-gold font-bold block uppercase">{targetGalaxy.name}</span>
            <span className="text-[10px] text-slate-400 block font-mono">
              TARGET COORDINATES: [{targetGalaxy.x}, {targetGalaxy.y}]
            </span>
          </div>
        )}

      </div>

      {/* 3. Screen Flash Overlay for Bloom Phases */}
      {(phase === 'BRIGHTNESS_BLOOM' || phase === 'EXIT_FLASH') && (
        <div className="absolute inset-0 bg-cyan-200/40 mix-blend-overlay transition-opacity duration-300 animate-pulse pointer-events-none" />
      )}
    </div>
  );
}
