import React, { useEffect, useRef, useState } from 'react';
import { Play, BookOpen, Star, HelpCircle, Shield, Volume2, VolumeX, Settings, Compass } from 'lucide-react';
import AboutCredits from '../common/AboutCredits';
import TelescopeLogo from '../common/TelescopeLogo';
import { useGameStore } from '../../store/useGameStore';

interface MainMenuProps {
  onStartGame: () => void;
  onOpenArchive: () => void;
  onOpenSettings: () => void;
}

export default function MainMenu({ onStartGame, onOpenArchive, onOpenSettings }: MainMenuProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [modalType, setModalType] = useState<'ABOUT' | 'CREDITS' | null>(null);
  const { settings, toggleSound, profile } = useGameStore();

  const isBN = settings.language === 'BN';
  const t = (en: string, bn: string) => (isBN ? bn : en);

  // Twinkling Starfield and Orbiting Logo Canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    // Star objects
    const stars: { x: number; y: number; size: number; speed: number; alpha: number; dAlpha: number }[] = [];
    const starCount = 140;
    for (let i = 0; i < starCount; i++) {
      stars.push({
        x: Math.random() * width,
        y: Math.random() * height,
        size: Math.random() * 1.5 + 0.5,
        speed: Math.random() * 0.04 + 0.01,
        alpha: Math.random(),
        dAlpha: (Math.random() * 0.015 + 0.005) * (Math.random() > 0.5 ? 1 : -1),
      });
    }

    // Nebulae dust centers
    const nebulae = [
      { x: width * 0.2, y: height * 0.3, radius: 300, color: 'rgba(124, 58, 237, 0.05)' }, // Purple nebula
      { x: width * 0.8, y: height * 0.7, radius: 350, color: 'rgba(30, 58, 138, 0.06)' },  // Deep blue nebula
      { x: width * 0.5, y: height * 0.5, radius: 400, color: 'rgba(197, 160, 89, 0.03)' }, // Warm gold nebula
    ];

    let galacticAngle = 0;

    const render = () => {
      ctx.fillStyle = '#050508'; // Deep space black
      ctx.fillRect(0, 0, width, height);

      // 1. Draw Nebulae
      nebulae.forEach((neb) => {
        const grad = ctx.createRadialGradient(neb.x, neb.y, 0, neb.x, neb.y, neb.radius);
        grad.addColorStop(0, neb.color);
        grad.addColorStop(1, 'rgba(5, 5, 8, 0)');
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(neb.x, neb.y, neb.radius, 0, Math.PI * 2);
        ctx.fill();
      });

      // 2. Twinkle and scroll stars
      stars.forEach((star) => {
        star.y -= star.speed;
        if (star.y < 0) {
          star.y = height;
          star.x = Math.random() * width;
        }

        star.alpha += star.dAlpha;
        if (star.alpha > 1 || star.alpha < 0.1) {
          star.dAlpha = -star.dAlpha;
        }

        ctx.fillStyle = `rgba(255, 255, 255, ${Math.max(0.1, Math.min(star.alpha, 0.9))})`;
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
        ctx.fill();
      });

      // 3. Central glowing background for logo
      galacticAngle += 0.0025;
      const centerX = width / 2;
      const centerY = height * 0.28;

      ctx.save();
      ctx.translate(centerX, centerY);
      ctx.rotate(galacticAngle);

      // Draw beautiful gold spiral galaxy logo backdrop
      for (let arm = 0; arm < 4; arm++) {
        ctx.rotate(Math.PI / 2);
        const grad = ctx.createRadialGradient(0, 0, 5, 80, 40, 130);
        grad.addColorStop(0, 'rgba(197, 160, 89, 0.25)'); // Gold center arm
        grad.addColorStop(0.5, 'rgba(147, 51, 234, 0.1)'); // Purple core blend
        grad.addColorStop(1, 'rgba(0, 0, 0, 0)');
        ctx.fillStyle = grad;

        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.quadraticCurveTo(55, -25, 130, 12);
        ctx.quadraticCurveTo(45, 45, 0, 0);
        ctx.fill();
      }
      ctx.restore();

      // Core central star glow (Luxury gold core)
      const coreGrad = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, 35);
      coreGrad.addColorStop(0, 'rgba(255, 255, 255, 0.95)');
      coreGrad.addColorStop(0.2, 'rgba(197, 160, 89, 0.7)'); // Luxurious Gold halo
      coreGrad.addColorStop(0.6, 'rgba(147, 51, 234, 0.2)'); // Violet corona
      coreGrad.addColorStop(1, 'rgba(5, 5, 8, 0)');
      ctx.fillStyle = coreGrad;
      ctx.beginPath();
      ctx.arc(centerX, centerY, 35, 0, Math.PI * 2);
      ctx.fill();

      animationId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationId);
    };
  }, []);

  return (
    <div className="relative w-full h-screen overflow-hidden flex flex-col justify-between items-center bg-[#050508] font-sans select-none">
      {/* Background Nebula Blur Accents */}
      <div className="absolute top-[-150px] left-[-150px] w-[600px] h-[600px] bg-purple-950/20 rounded-full blur-[130px] pointer-events-none"></div>
      <div className="absolute bottom-[-150px] right-[-150px] w-[600px] h-[600px] bg-blue-950/20 rounded-full blur-[130px] pointer-events-none"></div>

      {/* Dynamic Starfield Background Canvas */}
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full block z-0 pointer-events-none" />

      {/* Top Bar Actions */}
      <div className="absolute top-4 right-4 z-10 flex items-center gap-2">
        <button
          onClick={onOpenSettings}
          className="p-3 rounded-full bg-black/40 border border-white/10 hover:border-gold hover:text-gold text-slate-300 transition-all backdrop-blur-md shadow-lg cursor-pointer"
          title={t('Settings', 'সেটিংস')}
        >
          <Settings size={18} />
        </button>

        <button
          id="sound-toggle-btn"
          onClick={toggleSound}
          className="p-3 rounded-full bg-black/40 border border-white/10 hover:border-gold hover:text-gold text-slate-300 transition-all backdrop-blur-md shadow-lg cursor-pointer"
          title={settings.soundEnabled ? t('Mute Sounds', 'শব্দ নিষ্ক্রিয়') : t('Unmute Sounds', 'শব্দ সক্রিয়')}
        >
          {settings.soundEnabled ? <Volume2 size={18} /> : <VolumeX size={18} />}
        </button>
      </div>

      {/* Top Section: Astronomy Pathshala Branding & Logo */}
      <div className="z-10 mt-10 text-center flex flex-col items-center px-4">
        <TelescopeLogo size={130} className="mb-3 animate-pulse duration-4000" />
        
        <div className="px-5 py-2 rounded-full border border-gold/30 bg-gold/5 backdrop-blur-md flex items-center gap-2 shadow-lg shadow-gold/5 mb-3">
          <Star size={11} className="text-gold fill-gold animate-pulse" />
          <span className="text-[10px] md:text-xs font-mono font-medium tracking-[0.25em] text-gold uppercase">
            Astronomy Pathshala
          </span>
        </div>

        {/* Title */}
        <h1 
          id="game-title" 
          className="text-4xl md:text-6xl lg:text-7xl font-serif text-white italic tracking-wide leading-none drop-shadow-2xl font-medium"
        >
          AP Galaxy Explorer
        </h1>
        <p className="text-slate-400 text-xs md:text-sm max-w-sm md:max-w-md mx-auto mt-3 px-4 leading-relaxed font-sans">
          {t(
            'Navigate deep space hazards, discover grand spiral and ring galaxies, survive asteroid belts, and claim your celestial certificates.',
            'গভীর মহাকাশ অতিক্রম করে সর্পিল ও রিং গ্যালাক্সি আবিষ্কার করুন, গ্রহাণুপুঞ্জ ধ্বংস করুন এবং আপনার অফিসিয়াল শংসাপত্র অর্জন করুন।'
          )}
        </p>
      </div>

      {/* Middle Section: Navigation & Action Cards */}
      <div className="z-10 w-full max-w-sm px-6 flex flex-col gap-3 mb-6">
        {/* PLAY ACTION */}
        <button
          id="start-game-btn"
          onClick={onStartGame}
          className="group relative w-full py-4 px-6 rounded-sm bg-gold text-black font-extrabold flex items-center justify-center gap-3 transition-colors duration-300 hover:bg-gold-hover shadow-xl hover:shadow-gold/20 active:scale-[0.98] cursor-pointer"
        >
          <Play size={16} className="fill-black group-hover:scale-110 transition-transform" />
          <span className="tracking-[0.2em] text-xs uppercase">{t('Start Exploration', 'অভিযাত্রা শুরু করুন')}</span>
        </button>

        {/* GALACTIC CATALOG ARCHIVE */}
        <button
          onClick={onOpenArchive}
          className="w-full py-3 px-4 rounded-sm border border-gold/40 bg-gold/10 hover:bg-gold/20 text-gold flex items-center justify-center gap-2 text-xs font-mono font-bold uppercase tracking-wider cursor-pointer transition-all"
        >
          <Compass size={15} />
          <span>{t('Galactic Catalog & Archives', 'গ্যালাকটিক ক্যাটালগ ও আর্কাইভ')}</span>
        </button>

        {/* ABOUT & CREDITS BUTTONS */}
        <div className="grid grid-cols-2 gap-3">
          <button
            id="about-pathshala-btn"
            onClick={() => setModalType('ABOUT')}
            className="flex items-center justify-center gap-2 py-3 px-4 rounded-sm border border-white/10 bg-black/20 hover:border-gold hover:bg-gold/10 hover:text-gold text-slate-200 transition-all backdrop-blur-md active:scale-95 cursor-pointer text-[10px] uppercase tracking-widest font-mono font-semibold"
          >
            <BookOpen size={13} className="text-gold" />
            <span>{t('About AP', 'পাঠশালা সম্পর্কে')}</span>
          </button>

          <button
            id="credits-btn"
            onClick={() => setModalType('CREDITS')}
            className="flex items-center justify-center gap-2 py-3 px-4 rounded-sm border border-white/10 bg-black/20 hover:border-gold hover:bg-gold/10 hover:text-gold text-slate-200 transition-all backdrop-blur-md active:scale-95 cursor-pointer text-[10px] uppercase tracking-widest font-mono font-semibold"
          >
            <HelpCircle size={13} className="text-gold" />
            <span>{t('Credits', 'কৃতিত্ব')}</span>
          </button>
        </div>
      </div>

      {/* Bottom Section: Space Controls HUD Mini Guide */}
      <div className="z-10 mb-6 px-6 text-center">
        <div className="inline-flex flex-col sm:flex-row items-center gap-2 sm:gap-4 px-5 py-2.5 rounded-sm bg-black/60 border border-white/10 backdrop-blur-md">
          <div className="flex gap-1 items-center">
            <kbd className="bg-white/10 px-1.5 py-0.5 rounded text-[9px] border border-white/20 text-slate-200">W</kbd>
            <kbd className="bg-white/10 px-1.5 py-0.5 rounded text-[9px] border border-white/20 text-slate-200">A</kbd>
            <kbd className="bg-white/10 px-1.5 py-0.5 rounded text-[9px] border border-white/20 text-slate-200">S</kbd>
            <kbd className="bg-white/10 px-1.5 py-0.5 rounded text-[9px] border border-white/20 text-slate-200">D</kbd>
            <span className="text-slate-500 text-[9px] px-1 font-mono">or</span>
            <kbd className="bg-white/10 px-2 py-0.5 rounded text-[9px] border border-white/20 text-slate-200">Arrows</kbd>
            <span className="text-slate-400 text-[10px] tracking-wider uppercase ml-1.5 font-medium">{t('Fly Ship', 'জাহাজ নিয়ন্ত্রণ')}</span>
          </div>
          <div className="hidden sm:block w-px h-3 bg-white/10"></div>
          <div className="flex gap-1 items-center">
            <kbd className="bg-white/10 px-3 py-0.5 rounded text-[9px] border border-white/20 text-slate-200">SPACE</kbd>
            <span className="text-slate-500 text-[9px] px-0.5 font-mono">or</span>
            <span className="text-slate-400 text-[10px] tracking-wider uppercase ml-1 font-medium">{t('Fire Lasers', 'লেজার ফায়ার')}</span>
          </div>
        </div>
        <p className="text-[9px] text-slate-600 mt-2.5 font-mono uppercase tracking-[0.3em]">
          Astronomy Pathshala Desktop Explorer • System Ready
        </p>
      </div>

      {/* Render Modals */}
      {modalType && (
        <AboutCredits type={modalType} onClose={() => setModalType(null)} />
      )}
    </div>
  );
}


