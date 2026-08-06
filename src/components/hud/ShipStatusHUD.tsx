import React from 'react';
import { Shield, Heart, Zap, Sparkles, Award, Settings, BookOpen, SlidersHorizontal } from 'lucide-react';
import { Spaceship } from '../../types';
import { useGameStore } from '../../store/useGameStore';
import { GALAXIES } from '../../data/galaxies';

interface ShipStatusHUDProps {
  ship: Spaceship;
  currentGalaxyName?: string;
  onOpenDashboard: () => void;
  onOpenArchive: () => void;
  onOpenSettings: () => void;
}

export default function ShipStatusHUD({
  ship,
  currentGalaxyName,
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
    <div className="absolute top-0 left-0 w-full p-4 z-20 pointer-events-none flex flex-row items-start justify-between gap-4 font-sans select-none">
      {/* 1. Top Left Panel: Pilot Identity & Ship Vitals */}
      <div className="flex flex-col gap-2 p-3.5 rounded-xl bg-slate-950/80 border border-slate-800/80 backdrop-blur-md pointer-events-auto w-64 shadow-2xl transition-all">
        {/* Pilot Identity */}
        <div className="flex items-center justify-between">
          <div className="truncate">
            <div className="text-xs font-mono font-bold text-amber-400 tracking-wider uppercase truncate">
              {profile.name || 'COSMIC EXPLORER'}
            </div>
            <div className="text-[10px] font-mono text-slate-400 truncate">
              {profile.rankTitle || 'Space Cadet'}
            </div>
          </div>
          <div className="px-2 py-0.5 rounded bg-amber-400/10 border border-amber-400/30 text-[10px] font-mono font-bold text-amber-300 shrink-0">
            Lvl {profile.level || 1}
          </div>
        </div>

        <div className="border-t border-slate-800/80 my-0.5"></div>

        {/* Vitals: Health, Shield & Plasma Energy */}
        <div className="space-y-1.5">
          {/* Hull Integrity */}
          <div className="space-y-0.5">
            <div className="flex justify-between items-center text-[10px] font-mono">
              <span className="text-red-400 flex items-center gap-1 font-semibold">
                <Heart size={10} className="fill-red-500/20" /> {t('Hull Integrity', 'হাল স্থায়িত্ব')}
              </span>
              <span className="text-slate-200 font-bold">{Math.ceil(ship.health)}/{ship.maxHealth}</span>
            </div>
            <div className="w-full h-1.5 rounded-full bg-slate-900/90 border border-red-900/40 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-red-600 to-red-400 transition-all duration-200 rounded-full"
                style={{ width: `${healthPct}%` }}
              ></div>
            </div>
          </div>

          {/* Deflector Shield */}
          <div className="space-y-0.5">
            <div className="flex justify-between items-center text-[10px] font-mono">
              <span className="text-cyan-400 flex items-center gap-1 font-semibold">
                <Shield size={10} className="fill-cyan-500/20" /> {t('Deflector Shield', 'ডিফ্লেক্টর শিল্ড')}
              </span>
              <span className="text-slate-200 font-bold">{Math.ceil(ship.shield)}/{ship.maxShield}</span>
            </div>
            <div className="w-full h-1.5 rounded-full bg-slate-900/90 border border-cyan-900/40 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-cyan-600 to-cyan-400 transition-all duration-200 rounded-full"
                style={{ width: `${shieldPct}%` }}
              ></div>
            </div>
          </div>

          {/* Plasma Energy */}
          <div className="space-y-0.5">
            <div className="flex justify-between items-center text-[10px] font-mono">
              <span className="text-amber-400 flex items-center gap-1 font-semibold">
                <Zap size={10} className="fill-amber-500/20" /> {t('Plasma Energy', 'প্লাজমা এনার্জি')}
              </span>
              <span className="text-slate-200 font-bold">{Math.ceil(energyVal)}/{maxEnergyVal}</span>
            </div>
            <div className="w-full h-1.5 rounded-full bg-slate-900/90 border border-amber-900/40 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-amber-600 to-amber-400 transition-all duration-200 rounded-full"
                style={{ width: `${energyPct}%` }}
              ></div>
            </div>
          </div>
        </div>

        <div className="border-t border-slate-800/80 my-0.5"></div>

        {/* Current Galaxy */}
        <div>
          <div className="text-[9px] font-mono text-slate-400 uppercase tracking-wider">
            {t('Current Galaxy', 'বর্তমান গ্যালাক্সি')}
          </div>
          <div className="text-xs font-serif italic font-bold text-cyan-300 truncate">
            {currentGalaxyName || 'Milky Way Sector'}
          </div>
        </div>
      </div>

      {/* 2. Top Center Panel: Mission Objective & Progression Metrics */}
      <div className="hidden sm:flex items-center gap-4 p-3 px-5 rounded-xl bg-slate-950/80 border border-slate-800/80 backdrop-blur-md pointer-events-auto shadow-2xl">
        {/* Dominant Mission Objective */}
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-amber-400/10 text-amber-400 border border-amber-400/20">
            <BookOpen size={18} />
          </div>
          <div>
            <div className="text-[9px] font-mono text-slate-400 uppercase tracking-widest font-semibold">
              {t('Mission Objective', 'মিশন লক্ষ্য')}
            </div>
            <div className="text-sm font-extrabold text-amber-300 font-mono tracking-tight">
              {t('Map Galaxies', 'গ্যালাক্সি মানচিত্র')}: <span className="text-cyan-300 text-base">{profile.discoveredGalaxyIds.length}/{GALAXIES.length}</span>
            </div>
          </div>
        </div>

        <div className="h-8 w-px bg-slate-800/80"></div>

        {/* Secondary Metrics: Stardust & Score */}
        <div className="flex items-center gap-4 font-mono">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-md bg-amber-500/10 text-amber-400 border border-amber-500/20">
              <Sparkles size={14} />
            </div>
            <div>
              <div className="text-[9px] text-slate-400 uppercase tracking-wider">{t('Stardust', 'স্টারডাস্ট')}</div>
              <div className="text-xs font-bold text-amber-300">{ship.stardust}</div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-md bg-gold/10 text-gold border border-gold/20">
              <Award size={14} />
            </div>
            <div>
              <div className="text-[9px] text-slate-400 uppercase tracking-wider">{t('Score', 'স্কোর')}</div>
              <div className="text-xs font-bold text-gold">{ship.score}</div>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Top Right Controls: Action Bar */}
      <div className="flex items-center gap-2.5 pointer-events-auto">
        <button
          onClick={onOpenDashboard}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-400 to-yellow-500 hover:from-amber-300 hover:to-yellow-400 text-slate-950 font-mono font-bold text-xs uppercase tracking-wider shadow-lg shadow-amber-500/20 cursor-pointer transition-all active:scale-95 border border-amber-300/40"
        >
          <SlidersHorizontal size={15} />
          <span className="hidden md:inline">{t('Pilot Station', 'পাইলট স্টেশন')}</span>
        </button>

        <button
          onClick={onOpenArchive}
          className="p-2.5 rounded-xl bg-slate-950/80 hover:bg-slate-900 border border-slate-800/80 text-slate-200 hover:text-amber-400 cursor-pointer transition-all shadow-xl backdrop-blur-md active:scale-95"
          title={t('Galactic Catalog', 'গ্যালাকটিক আর্কাইভ')}
        >
          <BookOpen size={16} />
        </button>

        <button
          onClick={onOpenSettings}
          className="p-2.5 rounded-xl bg-slate-950/80 hover:bg-slate-900 border border-slate-800/80 text-slate-200 hover:text-amber-400 cursor-pointer transition-all shadow-xl backdrop-blur-md active:scale-95"
          title={t('Settings', 'সেটিংস')}
        >
          <Settings size={16} />
        </button>
      </div>
    </div>
  );
}
