import React, { useEffect, useRef, useState, useCallback } from 'react';
import { Telescope, Radio, Cpu, Sparkles, ChevronRight, SkipForward, Rocket, CheckCircle } from 'lucide-react';
import TelescopeLogo from '../common/TelescopeLogo';
import { audioEngine } from '../../engine/audioEngine';
import { useGameStore } from '../../store/useGameStore';

interface OpeningCinematicProps {
  onComplete: () => void;
}

export const OpeningCinematic: React.FC<OpeningCinematicProps> = ({ onComplete }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [step, setStep] = useState<number>(0); 
  // Step 0: AP Logo
  // Step 1: Fade to Black & Earth + Stars
  // Step 2: Mission Narration Text
  // Step 3: AP Explorer Orbital Station Pan & Ship in Hangar
  // Step 4: AURA Welcome & Mission Briefing
  // Step 5: Launch Countdown & Warp Jump

  const [narrationIndex, setNarrationIndex] = useState<number>(0);
  const [countdown, setCountdown] = useState<number | null>(null);
  const [isWarping, setIsWarping] = useState<boolean>(false);
  const { settings } = useGameStore();

  const narrationLines = [
    "Earth has lost contact with thousands of deep space galaxies.",
    "Astronomy Pathshala has launched the AP Explorer Program.",
    "You are the newest certified Explorer.",
    "Your mission:",
    "• Scan and identify distant galaxies",
    "• Review classified scientific briefings",
    "• Upload research data to the Galactic Archive",
    "• Become the Master Explorer of the Universe."
  ];

  // Handle Skip
  const handleSkip = useCallback(() => {
    audioEngine.playSound('warp', settings.soundEnabled, settings.sfxVolume);
    setIsWarping(true);
    setTimeout(() => {
      onComplete();
    }, 1200);
  }, [onComplete, settings.soundEnabled, settings.sfxVolume]);

  // Listen for ESC key skip
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        handleSkip();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleSkip]);

  // Step Timeline Management (35-45 seconds total sequence)
  useEffect(() => {
    let t1: any, t2: any, t3: any, t4: any;

    // Step 0 -> Step 1 (AP Logo display -> Earth & Stars)
    t1 = setTimeout(() => {
      setStep(1);
    }, 4500);

    // Step 1 -> Step 2 (Earth -> Narration Text)
    t2 = setTimeout(() => {
      setStep(2);
    }, 8500);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(t4);
    };
  }, []);

  // Narration line progression
  useEffect(() => {
    if (step !== 2) return;

    audioEngine.playSound('aura-speak', settings.soundEnabled, settings.sfxVolume);

    const interval = setInterval(() => {
      setNarrationIndex((prev) => {
        if (prev < narrationLines.length - 1) {
          audioEngine.playSound('aura-speak', settings.soundEnabled, settings.sfxVolume);
          return prev + 1;
        } else {
          clearInterval(interval);
          // Advance to Orbital Station after narration finishes
          setTimeout(() => setStep(3), 3000);
          return prev;
        }
      });
    }, 2800);

    return () => clearInterval(interval);
  }, [step, settings.soundEnabled, settings.sfxVolume]);

  // Step 3 -> Step 4 (Orbital Station view -> AURA Welcome)
  useEffect(() => {
    if (step === 3) {
      audioEngine.playSound('scan-pulse', settings.soundEnabled, settings.sfxVolume);
      const timer = setTimeout(() => {
        setStep(4);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [step, settings.soundEnabled, settings.sfxVolume]);

  // Launch Protocol Trigger
  const handleStartLaunch = () => {
    setStep(5);
    setCountdown(3);
    audioEngine.playSound('powerup', settings.soundEnabled, settings.sfxVolume);

    let count = 3;
    const interval = setInterval(() => {
      count -= 1;
      if (count > 0) {
        setCountdown(count);
        audioEngine.playSound('scan-pulse', settings.soundEnabled, settings.sfxVolume);
      } else if (count === 0) {
        setCountdown(0);
        audioEngine.playSound('thrust', settings.soundEnabled, settings.sfxVolume);
      } else {
        clearInterval(interval);
        setIsWarping(true);
        audioEngine.playSound('warp', settings.soundEnabled, settings.sfxVolume);
        setTimeout(() => {
          onComplete();
        }, 1600);
      }
    }, 1200);
  };

  // Canvas Background Engine: Earth, Stars & Orbital Station Animation
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let w = (canvas.width = window.innerWidth);
    let h = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      w = canvas.width = window.innerWidth;
      h = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    // Stars
    const stars = Array.from({ length: 200 }, () => ({
      x: Math.random() * w,
      y: Math.random() * h,
      size: Math.random() * 1.8 + 0.4,
      alpha: Math.random(),
      speed: Math.random() * 0.2 + 0.05,
    }));

    // Service drones around orbital station
    const drones = Array.from({ length: 4 }, (_, i) => ({
      angle: (i * Math.PI) / 2,
      dist: 180 + Math.random() * 40,
      speed: 0.015 + Math.random() * 0.01,
    }));

    let stationRotation = 0;

    const render = () => {
      ctx.fillStyle = '#050508';
      ctx.fillRect(0, 0, w, h);

      // Render Stars
      stars.forEach((s) => {
        if (isWarping) {
          // Stretch stars into warp streaks
          ctx.strokeStyle = 'rgba(56, 189, 248, 0.8)';
          ctx.lineWidth = s.size;
          ctx.beginPath();
          ctx.moveTo(s.x, s.y);
          ctx.lineTo(s.x + (s.x - w / 2) * 1.5, s.y + (s.y - h / 2) * 1.5);
          ctx.stroke();
        } else {
          ctx.fillStyle = `rgba(255, 255, 255, ${s.alpha})`;
          ctx.beginPath();
          ctx.arc(s.x, s.y, s.size, 0, Math.PI * 2);
          ctx.fill();
        }
      });

      // SECTION 2: AP Explorer Orbital Station & Earth Canvas Rendering
      if (step >= 1 && step <= 4 && !isWarping) {
        // Draw Distant Earth
        const earthX = w * 0.75;
        const earthY = h * 0.7;
        const earthRadius = 180;

        // Atmosphere aura
        const atmosGrad = ctx.createRadialGradient(earthX, earthY, earthRadius * 0.9, earthX, earthY, earthRadius * 1.3);
        atmosGrad.addColorStop(0, 'rgba(56, 189, 248, 0.4)');
        atmosGrad.addColorStop(0.5, 'rgba(30, 58, 138, 0.15)');
        atmosGrad.addColorStop(1, 'rgba(5, 5, 8, 0)');
        ctx.fillStyle = atmosGrad;
        ctx.beginPath();
        ctx.arc(earthX, earthY, earthRadius * 1.3, 0, Math.PI * 2);
        ctx.fill();

        // Earth Body
        const earthGrad = ctx.createRadialGradient(earthX - 40, earthY - 40, 10, earthX, earthY, earthRadius);
        earthGrad.addColorStop(0, '#38bdf8');
        earthGrad.addColorStop(0.4, '#0284c7');
        earthGrad.addColorStop(0.8, '#0f172a');
        earthGrad.addColorStop(1, '#050508');
        ctx.fillStyle = earthGrad;
        ctx.beginPath();
        ctx.arc(earthX, earthY, earthRadius, 0, Math.PI * 2);
        ctx.fill();

        // AP Explorer Orbital Station Rendering (Step 3 & 4)
        if (step >= 3) {
          const stX = w * 0.35;
          const stY = h * 0.45;
          stationRotation += 0.003;

          ctx.save();
          ctx.translate(stX, stY);

          // Station Outer Ring & Docking Lights
          ctx.strokeStyle = '#0284c7';
          ctx.lineWidth = 4;
          ctx.beginPath();
          ctx.arc(0, 0, 140, 0, Math.PI * 2);
          ctx.stroke();

          // Rotating Spokes & Solar Panels
          ctx.rotate(stationRotation);
          for (let i = 0; i < 4; i++) {
            ctx.rotate(Math.PI / 2);
            ctx.strokeStyle = '#38bdf8';
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.moveTo(0, 0);
            ctx.lineTo(140, 0);
            ctx.stroke();

            // Solar Panel Array
            ctx.fillStyle = '#1e293b';
            ctx.strokeStyle = '#38bdf8';
            ctx.fillRect(80, -15, 50, 30);
            ctx.strokeRect(80, -15, 50, 30);

            // Docking Beacon Lights
            ctx.fillStyle = (Date.now() / 300 + i) % 2 > 1 ? '#00d2ff' : '#f59e0b';
            ctx.beginPath();
            ctx.arc(140, 0, 4, 0, Math.PI * 2);
            ctx.fill();
          }
          ctx.restore();

          // Service Drones orbiting station
          drones.forEach((d) => {
            d.angle += d.speed;
            const dx = stX + Math.cos(d.angle) * d.dist;
            const dy = stY + Math.sin(d.angle) * d.dist;

            ctx.fillStyle = '#38bdf8';
            ctx.beginPath();
            ctx.arc(dx, dy, 2.5, 0, Math.PI * 2);
            ctx.fill();

            // Drone light beam
            ctx.strokeStyle = 'rgba(56, 189, 248, 0.3)';
            ctx.beginPath();
            ctx.moveTo(dx, dy);
            ctx.lineTo(stX, stY);
            ctx.stroke();
          });
        }
      }

      animId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animId);
    };
  }, [step, isWarping]);

  return (
    <div className="fixed inset-0 z-50 bg-[#050508] text-white flex flex-col justify-between items-center overflow-hidden font-sans select-none">
      
      {/* Background Canvas */}
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full block z-0" />

      {/* Top Header Bar: Skip Button */}
      <div className="z-20 w-full p-6 flex justify-between items-center bg-gradient-to-b from-black/80 to-transparent">
        <div className="flex items-center gap-2 font-mono text-xs text-cyan-400">
          <Radio size={14} className="animate-pulse" />
          <span className="uppercase tracking-widest font-bold">MISSION ONBOARDING // AP EXP-01</span>
        </div>

        <button
          onClick={handleSkip}
          className="px-4 py-2 rounded-lg bg-black/60 hover:bg-cyan-950/80 border border-cyan-500/30 text-cyan-300 font-mono text-xs flex items-center gap-2 backdrop-blur-md transition-all cursor-pointer shadow-lg"
        >
          <span>SKIP INTRO (ESC)</span>
          <SkipForward size={14} />
        </button>
      </div>

      {/* CENTER STAGE CINEMATIC PHASES */}
      <div className="z-10 flex-1 flex flex-col items-center justify-center p-6 w-full max-w-4xl text-center">
        
        {/* STEP 0: Astronomy Pathshala Logo Intro */}
        {step === 0 && (
          <div className="space-y-6 animate-fade-in transition-all">
            <TelescopeLogo size={160} className="mx-auto animate-pulse" />
            <div className="space-y-2">
              <span className="text-xs font-mono tracking-[0.3em] text-gold uppercase font-bold">
                ASTRONOMY PATHSHALA PRESENTS
              </span>
              <h1 className="text-4xl md:text-6xl font-serif italic text-white font-bold tracking-wide">
                AP GALAXY EXPLORER
              </h1>
            </div>
          </div>
        )}

        {/* STEP 1 & 2: Mission Narration & Deep Space Context */}
        {(step === 1 || step === 2) && (
          <div className="space-y-6 max-w-2xl bg-black/70 p-8 rounded-2xl border border-cyan-500/30 backdrop-blur-xl shadow-2xl animate-fade-in">
            <div className="flex items-center justify-center gap-2 text-xs font-mono text-cyan-400 font-bold uppercase tracking-widest">
              <Sparkles size={14} />
              <span>GALACTIC BRIEFING</span>
            </div>

            <div className="space-y-4 text-left font-mono text-sm md:text-base leading-relaxed text-slate-200 min-h-[160px]">
              {narrationLines.slice(0, narrationIndex + 1).map((line, idx) => (
                <p key={idx} className={`transition-opacity duration-500 ${idx === narrationIndex ? 'text-cyan-300 font-bold animate-pulse' : 'text-slate-400'}`}>
                  {line}
                </p>
              ))}
            </div>
          </div>
        )}

        {/* STEP 3 & 4: AP Explorer Orbital Station & AURA Welcome */}
        {(step === 3 || step === 4) && (
          <div className="space-y-6 max-w-xl bg-slate-900/80 p-8 rounded-2xl border border-cyan-400/50 backdrop-blur-xl shadow-2xl animate-fade-in">
            <div className="flex items-center gap-3 border-b border-cyan-500/30 pb-4 text-left">
              <div className="w-12 h-12 rounded-full bg-cyan-950 border border-cyan-400 flex items-center justify-center text-cyan-300 shadow-md">
                <Cpu size={24} className="animate-pulse" />
              </div>
              <div>
                <span className="text-[10px] font-mono text-cyan-400 font-bold uppercase tracking-wider block">
                  ORBITAL STATION AURA // AI VOICE ASSISTANT
                </span>
                <h2 className="text-xl font-serif italic font-bold text-white">
                  Welcome, Explorer.
                </h2>
              </div>
            </div>

            <p className="text-sm md:text-base text-slate-200 text-left font-sans italic leading-relaxed">
              "Your exploration vessel is fully primed inside Hangar Bay 01. The navigational map is locked to Safe Exploration Sector Alpha. Engage launch protocol when ready."
            </p>

            {step === 4 && (
              <button
                onClick={handleStartLaunch}
                className="w-full py-4 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-mono text-sm font-bold flex items-center justify-center gap-2 shadow-xl shadow-cyan-500/20 transition-all cursor-pointer animate-pulse"
              >
                <Rocket size={18} />
                <span>ENGAGE LAUNCH PROTOCOL</span>
                <ChevronRight size={18} />
              </button>
            )}
          </div>
        )}

        {/* STEP 5: Launch Countdown & Warp Tunnel */}
        {step === 5 && (
          <div className="space-y-6 text-center animate-pulse">
            <div className="w-24 h-24 mx-auto rounded-full bg-cyan-950/80 border-2 border-cyan-400 flex items-center justify-center text-cyan-300 shadow-2xl">
              <Rocket size={48} className="animate-bounce" />
            </div>

            <div className="space-y-2 font-mono">
              <span className="text-xs text-cyan-400 font-bold uppercase tracking-widest block">
                HANGAR DOORS OPEN // ENGINE THRUST MAXIMUM
              </span>
              <h1 className="text-6xl md:text-8xl font-black text-white">
                {countdown !== null && countdown > 0 ? countdown : 'WARP JUMP!'}
              </h1>
            </div>
          </div>
        )}

      </div>

      {/* Bottom Bar Indicator */}
      <div className="z-20 w-full p-6 text-center bg-gradient-to-t from-black/80 to-transparent">
        <span className="text-[10px] font-mono text-slate-500 uppercase tracking-[0.3em]">
          Astronomy Pathshala • Deep Space Explorer Terminal v1.95
        </span>
      </div>

    </div>
  );
};

export default OpeningCinematic;
