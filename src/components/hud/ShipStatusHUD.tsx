import React from 'react';
import { Shield, Heart, Zap, Sparkles, Award, User, Settings, BookOpen, SlidersHorizontal } from 'lucide-react';
import { Spaceship } from '../../types';
import { useGameStore } from '../../store/useGameStore';

interface ShipStatusHUDProps {
  ship: Spaceship;
  onOpenDashboard: () => void;
  onOpenArchive: () => void;
  onOpenSettings: () => void;
}

export default function ShipStatusHUD({
  ship,
  onOpenDashboard,
  onOpenArchive,
  onOpenSettings,
}: ShipStatusHUDProps) {
  const { profile, settings } = useGameStore();
  const isBN = settings.language === 'BN';
  const t = (en: string, bn: string) => (isBN ? bn : en);

  const healthPct = Math.max(0, Math.min(100, (ship.health / ship.maxHealth) * 100));
  const shieldPct = Math.max(0, Math.min(100, (ship.shield / ship.maxShield) * 100));
  const energyVal = ship.energy ?? 100;
  const maxEnergyVal = ship.maxEnergy ?? 100;
  const energyPct = Math.max(0, Math.min(100, (energyVal / maxEnergyVal) * 100));

  return (
    <div className="absolute top-0 left-0 w-full p-3 md:p-4 z-20 pointer-events-none flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 font-sans select-none">
      {/* Top Left: Ship Vitals (Health, Shield & Plasma Energy) */}
      <div className="flex flex-col gap-2 p-2.5 rounded-sm bg-black/70 border border-white/10 backdrop-blur-md pointer-events-auto min-w-[240px]">
        {/* Pilot Identity */}
        <div className="flex items-center justify-between border-b border-white/10 pb-1 text-[10px] font-mono">
          <div className="flex items-center gap-1.5 text-gold font-bold uppercase tracking-wider">
            <User size={12} />
            <span>{profile.name}</span>
          </div>
          <span className="text-slate-400 bg-white/5 px-1.5 py-0.5 rounded text-[9px]">
            {profile.rankTitle}
          </span>
        </div>

        {/* Health Bar */}
        <div className="space-y-0.5">
          <div className="flex justify-between items-center text-[10px] font-mono">
            <span className="text-red-400 flex items-center gap-1">
              <Heart size={10} className="fill-red-500/20" /> {t('HULL INTEGRITY', 'হাল স্থায়িত্ব')}
            </span>
            <span className="text-white font-bold">{Math.ceil(ship.health)}/{ship.maxHealth}</span>
          </div>
          <div className="w-full h-1.5 rounded-full bg-slate-900 border border-red-900/40 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-red-600 to-red-400 transition-all duration-200"
              style={{ width: `${healthPct}%` }}
            ></div>
          </div>
        </div>

        {/* Shield Bar */}
        <div className="space-y-0.5">
          <div className="flex justify-between items-center text-[10px] font-mono">
            <span className="text-cyan-400 flex items-center gap-1">
              <Shield size={10} className="fill-cyan-500/20" /> {t('DEFLECTOR SHIELD', 'ডিফ্লেক্টর শিল্ড')}
            </span>
            <span className="text-white font-bold">{Math.ceil(ship.shield)}/{ship.maxShield}</span>
          </div>
          <div className="w-full h-1.5 rounded-full bg-slate-900 border border-cyan-900/40 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-cyan-600 to-cyan-400 transition-all duration-200"
              style={{ width: `${shieldPct}%` }}
            ></div>
          </div>
        </div>

        {/* Plasma Energy Bar */}
        <div className="space-y-0.5">
          <div className="flex justify-between items-center text-[10px] font-mono">
            <span className="text-amber-400 flex items-center gap-1">
              <Zap size={10} className="fill-amber-500/20" /> {t('PLASMA ENERGY', 'প্লাজমা এনার্জি')}
            </span>
            <span className="text-white font-bold">{Math.ceil(energyVal)}/{maxEnergyVal}</span>
          </div>
          <div className="w-full h-1.5 rounded-full bg-slate-900 border border-amber-900/40 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-amber-600 to-amber-400 transition-all duration-200"
              style={{ width: `${energyPct}%` }}
            ></div>
          </div>
        </div>
      </div>

      {/* Top Center: Score, Stardust & Mission Objective */}
      <div className="flex items-center gap-3 p-2.5 rounded-sm bg-black/70 border border-white/10 backdrop-blur-md pointer-events-auto">
        <div className="flex items-center gap-2 font-mono">
          <div className="p-1.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20">
            <Sparkles size={16} />
          </div>
          <div>
            <div className="text-[9px] text-slate-400 uppercase tracking-wider">{t('Stardust', 'স্টারডাস্ট')}</div>
            <div className="text-sm font-bold text-amber-300">{ship.stardust}</div>
          </div>
        </div>

        <div className="h-6 w-px bg-white/10"></div>

        <div className="flex items-center gap-2 font-mono">
          <div className="p-1.5 rounded bg-gold/10 text-gold border border-gold/20">
            <Award size={16} />
          </div>
          <div>
            <div className="text-[9px] text-slate-400 uppercase tracking-wider">{t('Score', 'স্কোর')}</div>
            <div className="text-sm font-bold text-gold">{ship.score}</div>
          </div>
        </div>

        <div className="h-6 w-px bg-white/10"></div>

        {/* Active Mission Objective Indicator */}
        <div className="flex items-center gap-2 font-mono">
          <div className="p-1.5 rounded bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
            <BookOpen size={16} />
          </div>
          <div>
            <div className="text-[9px] text-slate-400 uppercase tracking-wider">{t('Mission Objective', 'মিশন লক্ষ্য')}</div>
            <div className="text-xs font-bold text-cyan-300">
              {t('Map Galaxies', 'গ্যালাক্সি মানচিত্র')}: {profile.discoveredGalaxyIds.length}/10
            </div>
          </div>
        </div>
      </div>

      {/* Top Right: Mission Command Actions */}
      <div className="flex items-center gap-2 pointer-events-auto">
        <button
          onClick={onOpenDashboard}
          className="flex items-center gap-2 px-3 py-2 rounded-sm bg-gold text-black hover:bg-yellow-400 text-xs font-mono font-bold uppercase tracking-wider border border-gold shadow-lg cursor-pointer transition-all active:scale-95"
        >
          <SlidersHorizontal size={14} />
          <span className="hidden md:inline">{t('Pilot Station', 'পাইলট স্টেশন')}</span>
        </button>

        <button
          onClick={onOpenArchive}
          className="p-2 rounded-sm bg-black/70 hover:bg-black border border-white/15 text-slate-200 hover:text-gold cursor-pointer transition-all"
          title={t('Galactic Catalog', 'গ্যালাকটিক আর্কাইভ')}
        >
          <BookOpen size={16} />
        </button>

        <button
          onClick={onOpenSettings}
          className="p-2 rounded-sm bg-black/70 hover:bg-black border border-white/15 text-slate-200 hover:text-gold cursor-pointer transition-all"
          title={t('Settings', 'সেটিংস')}
        >
          <Settings size={16} />
        </button>
      </div>
    </div>
  );
}
