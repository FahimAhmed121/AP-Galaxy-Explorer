import React, { useState } from 'react';
import {
  X,
  SlidersHorizontal,
  User,
  Award,
  Shield,
  Zap,
  Crosshair,
  Magnet,
  Sparkles,
  Navigation,
  Rocket,
  Palette,
  CheckCircle,
  Lock,
  Cpu,
  Heart,
} from 'lucide-react';
import { Spaceship, Galaxy } from '../../types';
import { GALAXIES } from '../../data/galaxies';
import { useGameStore } from '../../store/useGameStore';
import {
  EXPLORER_BADGES,
  SHIP_SKINS,
  THRUSTER_FX,
  SCANNER_FX,
  PASSIVE_PERKS,
  getXpForLevel,
} from '../../data/progressionData';

interface PilotDashboardModalProps {
  ship: Spaceship;
  onUpdateShip: (updatedShip: Spaceship) => void;
  onWarpToGalaxy: (galaxy: Galaxy) => void;
  onClose: () => void;
}

export default function PilotDashboardModal({
  ship,
  onUpdateShip,
  onWarpToGalaxy,
  onClose,
}: PilotDashboardModalProps) {
  const { profile, settings, spendStardust, equipCosmetic, unlockCosmetic, toggleEquipPerk } =
    useGameStore();
  const [activeTab, setActiveTab] = useState<'UPGRADES' | 'CUSTOMIZE' | 'DOSSIER' | 'ATLAS'>('UPGRADES');
  const [customCategory, setCustomCategory] = useState<'SKIN' | 'THRUSTER' | 'SCANNER' | 'PERKS'>('SKIN');

  const isBN = settings.language === 'BN';
  const t = (en: string, bn: string) => (isBN ? bn : en);

  // Upgrade costs logic
  const speedCost = Math.floor(60 * Math.pow(2.0, Math.max(0, ship.speedUpgrade - 1)));
  const shieldCost = Math.floor(75 * Math.pow(2.0, Math.max(0, ship.shieldUpgrade - 1)));
  const weaponCost = Math.floor(90 * Math.pow(2.0, Math.max(0, ship.weaponUpgrade - 1)));
  const magnetCost = Math.floor(50 * Math.pow(2.0, Math.max(0, (ship.magnetUpgrade || 1) - 1)));
  const hullRepairCost = 25;
  const isHullDamaged = ship.health < ship.maxHealth;

  const handleUpgrade = (type: 'speed' | 'shield' | 'weapon' | 'magnet', cost: number) => {
    if (ship.stardust < cost) return;

    const newStardust = ship.stardust - cost;
    let newShip = { ...ship, stardust: newStardust };

    if (type === 'speed') {
      newShip.speedUpgrade += 1;
    } else if (type === 'shield') {
      newShip.shieldUpgrade += 1;
      newShip.maxShield += 30;
      newShip.shield += 30;
    } else if (type === 'weapon') {
      newShip.weaponUpgrade += 1;
    } else if (type === 'magnet') {
      newShip.magnetUpgrade = (newShip.magnetUpgrade || 0) + 1;
    }

    spendStardust(cost);
    onUpdateShip(newShip);
  };

  const handleRepairHull = () => {
    if (ship.stardust < hullRepairCost || !isHullDamaged) return;
    const newStardust = ship.stardust - hullRepairCost;
    const newHealth = Math.min(ship.maxHealth, ship.health + 30);
    const newShip = { ...ship, stardust: newStardust, health: newHealth };

    spendStardust(hullRepairCost);
    onUpdateShip(newShip);
  };

  const level = profile.level || 1;
  const currentXp = profile.xp || 0;
  const currentLevelXpFloor = getXpForLevel(level);
  const nextLevelXpCeil = getXpForLevel(level + 1);
  const xpInCurrentLevel = Math.max(0, currentXp - currentLevelXpFloor);
  const xpNeededForLevel = Math.max(1, nextLevelXpCeil - currentLevelXpFloor);
  const progressPercent = Math.min(100, Math.floor((xpInCurrentLevel / xpNeededForLevel) * 100));

  const equipped = profile.equippedCosmetics || {
    shipSkin: 'skin_standard_cobalt',
    thrusterFx: 'thruster_plasma_blue',
    scannerFx: 'scanner_cyan_pulse',
  };

  const unlockedCosmetics = profile.unlockedCosmetics || [
    'skin_standard_cobalt',
    'thruster_plasma_blue',
    'scanner_cyan_pulse',
  ];

  const unlockedPerks = profile.unlockedPerks || ['perk_scanner_boost_1', 'perk_engine_tuning_1'];
  const equippedPerks = profile.equippedPerks || ['perk_scanner_boost_1'];
  const maxActivePerks = profile.maxActivePerks || 2;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md font-sans select-none">
      <div
        id="pilot-dashboard-modal"
        className="relative w-full max-w-3xl max-h-[90vh] overflow-hidden rounded-sm border border-white/10 bg-[#050508]/95 text-slate-100 shadow-2xl flex flex-col glow-gold"
      >
        {/* Top Gold Accent */}
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-gold via-yellow-600 to-gold"></div>

        {/* Modal Header */}
        <div className="p-5 border-b border-white/10 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded bg-gold/10 text-gold border border-gold/20">
              <SlidersHorizontal size={20} />
            </div>
            <div>
              <h2 className="text-xl font-serif italic text-white font-medium">
                {t('Pilot Command Station', 'পাইলট কমান্ড স্টেশন')}
              </h2>
              <p className="text-[10px] font-mono text-gold uppercase tracking-[0.2em]">
                {t('AP Explorer Sub-systems & Dossier', 'এপি এক্সপ্লোরার সিস্টেম ও ডসিয়ার')}
              </p>
            </div>
          </div>

          <button
            id="close-pilot-dashboard-btn"
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-gold rounded-full bg-white/5 hover:bg-white/10 transition-colors cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="p-3 bg-black/40 border-b border-white/10 flex gap-2 shrink-0 overflow-x-auto">
          <button
            onClick={() => setActiveTab('UPGRADES')}
            className={`flex-1 py-2 px-3 text-xs font-mono font-bold uppercase tracking-wider rounded-sm flex items-center justify-center gap-1.5 cursor-pointer transition-all whitespace-nowrap ${
              activeTab === 'UPGRADES'
                ? 'bg-gold text-black shadow-md'
                : 'bg-white/5 text-slate-400 hover:text-white'
            }`}
          >
            <Zap size={14} />
            <span>{t('Upgrades', 'আপগ্রেড')}</span>
          </button>

          <button
            onClick={() => setActiveTab('CUSTOMIZE')}
            className={`flex-1 py-2 px-3 text-xs font-mono font-bold uppercase tracking-wider rounded-sm flex items-center justify-center gap-1.5 cursor-pointer transition-all whitespace-nowrap ${
              activeTab === 'CUSTOMIZE'
                ? 'bg-gold text-black shadow-md'
                : 'bg-white/5 text-slate-400 hover:text-white'
            }`}
          >
            <Palette size={14} />
            <span>{t('Customize', 'কাস্টমাইজ')}</span>
          </button>

          <button
            onClick={() => setActiveTab('DOSSIER')}
            className={`flex-1 py-2 px-3 text-xs font-mono font-bold uppercase tracking-wider rounded-sm flex items-center justify-center gap-1.5 cursor-pointer transition-all whitespace-nowrap ${
              activeTab === 'DOSSIER'
                ? 'bg-gold text-black shadow-md'
                : 'bg-white/5 text-slate-400 hover:text-white'
            }`}
          >
            <User size={14} />
            <span>{t('Dossier & Badges', 'ডসিয়ার ও ব্যাজ')}</span>
          </button>

          <button
            onClick={() => setActiveTab('ATLAS')}
            className={`flex-1 py-2 px-3 text-xs font-mono font-bold uppercase tracking-wider rounded-sm flex items-center justify-center gap-1.5 cursor-pointer transition-all whitespace-nowrap ${
              activeTab === 'ATLAS'
                ? 'bg-gold text-black shadow-md'
                : 'bg-white/5 text-slate-400 hover:text-white'
            }`}
          >
            <Navigation size={14} />
            <span>{t('Warp Map', 'ওয়ার্প মানচিত্র')}</span>
          </button>
        </div>

        {/* Tab Content */}
        <div className="p-6 overflow-y-auto max-h-[60vh] space-y-4">
          {/* UPGRADES TAB */}
          {activeTab === 'UPGRADES' && (
            <div className="space-y-4">
              {/* Available Stardust Header */}
              <div className="p-3 rounded-sm bg-amber-500/10 border border-amber-500/20 flex items-center justify-between">
                <div className="flex items-center gap-2 text-amber-300 font-mono text-xs">
                  <Sparkles size={16} />
                  <span>{t('Stardust Energy Reserves:', 'স্টারডাস্ট শক্তি রিজার্ভ:')}</span>
                </div>
                <span className="text-lg font-mono font-bold text-amber-300">{ship.stardust} units</span>
              </div>

              {/* Upgrades List */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Speed Upgrade */}
                <div className="p-4 rounded-sm border border-white/10 bg-white/[0.02] flex flex-col justify-between gap-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="text-xs font-mono font-bold text-white uppercase flex items-center gap-1.5">
                        <Rocket size={14} className="text-cyan-400" />
                        <span>{t('Ion Impulse Engine', 'আইয়ন প্রপালশন ইঞ্জিন')}</span>
                      </div>
                      <p className="text-[10px] text-slate-400 mt-1">
                        {t('Increases ship thrust and maximum flight speed.', 'জাহাজের থ্রাস্ট এবং সর্বোচ্চ বেগ বাড়ায়।')}
                      </p>
                    </div>
                    <span className="text-[10px] font-mono bg-cyan-950 text-cyan-300 px-2 py-0.5 rounded border border-cyan-800">
                      Lvl {ship.speedUpgrade}
                    </span>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-white/5">
                    <span className="text-xs font-mono text-amber-300 font-bold">{speedCost} Stardust</span>
                    <button
                      onClick={() => handleUpgrade('speed', speedCost)}
                      disabled={ship.stardust < speedCost}
                      className={`px-3 py-1.5 rounded-sm text-[10px] font-mono font-bold uppercase tracking-wider cursor-pointer transition-all ${
                        ship.stardust >= speedCost
                          ? 'bg-gold text-black hover:bg-yellow-400'
                          : 'bg-white/5 text-slate-600 border border-white/5 cursor-not-allowed'
                      }`}
                    >
                      {t('Upgrade', 'আপগ্রেড')}
                    </button>
                  </div>
                </div>

                {/* Shield Upgrade */}
                <div className="p-4 rounded-sm border border-white/10 bg-white/[0.02] flex flex-col justify-between gap-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="text-xs font-mono font-bold text-white uppercase flex items-center gap-1.5">
                        <Shield size={14} className="text-cyan-400" />
                        <span>{t('Deflector Shield Matrix', 'ডিফ্লেক্টর শিল্ড ম্যাট্রিক্স')}</span>
                      </div>
                      <p className="text-[10px] text-slate-400 mt-1">
                        {t('Expands shield capacity (+30 Max Shield).', 'শিল্ড ক্ষমতা (+৩০ ম্যাক্স শিল্ড) বাড়ায়।')}
                      </p>
                    </div>
                    <span className="text-[10px] font-mono bg-cyan-950 text-cyan-300 px-2 py-0.5 rounded border border-cyan-800">
                      Lvl {ship.shieldUpgrade}
                    </span>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-white/5">
                    <span className="text-xs font-mono text-amber-300 font-bold">{shieldCost} Stardust</span>
                    <button
                      onClick={() => handleUpgrade('shield', shieldCost)}
                      disabled={ship.stardust < shieldCost}
                      className={`px-3 py-1.5 rounded-sm text-[10px] font-mono font-bold uppercase tracking-wider cursor-pointer transition-all ${
                        ship.stardust >= shieldCost
                          ? 'bg-gold text-black hover:bg-yellow-400'
                          : 'bg-white/5 text-slate-600 border border-white/5 cursor-not-allowed'
                      }`}
                    >
                      {t('Upgrade', 'আপগ্রেড')}
                    </button>
                  </div>
                </div>

                {/* Plasma Cannons */}
                <div className="p-4 rounded-sm border border-white/10 bg-white/[0.02] flex flex-col justify-between gap-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="text-xs font-mono font-bold text-white uppercase flex items-center gap-1.5">
                        <Crosshair size={14} className="text-red-400" />
                        <span>{t('Plasma Laser Cannons', 'প্লাজমা লেজার কামান')}</span>
                      </div>
                      <p className="text-[10px] text-slate-400 mt-1">
                        {t('Boosts laser fire damage against space debris.', 'মহাকাশ গ্রহাণুর বিরুদ্ধে লেজার ক্ষতি বাড়ায়।')}
                      </p>
                    </div>
                    <span className="text-[10px] font-mono bg-red-950 text-red-300 px-2 py-0.5 rounded border border-red-800">
                      Lvl {ship.weaponUpgrade}
                    </span>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-white/5">
                    <span className="text-xs font-mono text-amber-300 font-bold">{weaponCost} Stardust</span>
                    <button
                      onClick={() => handleUpgrade('weapon', weaponCost)}
                      disabled={ship.stardust < weaponCost}
                      className={`px-3 py-1.5 rounded-sm text-[10px] font-mono font-bold uppercase tracking-wider cursor-pointer transition-all ${
                        ship.stardust >= weaponCost
                          ? 'bg-gold text-black hover:bg-yellow-400'
                          : 'bg-white/5 text-slate-600 border border-white/5 cursor-not-allowed'
                      }`}
                    >
                      {t('Upgrade', 'আপগ্রেড')}
                    </button>
                  </div>
                </div>

                {/* Vacuum Magnet */}
                <div className="p-4 rounded-sm border border-white/10 bg-white/[0.02] flex flex-col justify-between gap-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="text-xs font-mono font-bold text-white uppercase flex items-center gap-1.5">
                        <Magnet size={14} className="text-amber-400" />
                        <span>{t('Vacuum Dust Magnet', 'ভ্যাকিউম ডাস্ট ম্যাগনেট')}</span>
                      </div>
                      <p className="text-[10px] text-slate-400 mt-1">
                        {t('Pulls nearby stardust automatically towards ship.', 'কাছাকাছি থাকা স্টারডাস্ট স্বয়ংক্রিয়ভাবে আকর্ষণ করে।')}
                      </p>
                    </div>
                    <span className="text-[10px] font-mono bg-amber-950 text-amber-300 px-2 py-0.5 rounded border border-amber-800">
                      Lvl {ship.magnetUpgrade || 0}
                    </span>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-white/5">
                    <span className="text-xs font-mono text-amber-300 font-bold">{magnetCost} Stardust</span>
                    <button
                      onClick={() => handleUpgrade('magnet', magnetCost)}
                      disabled={ship.stardust < magnetCost}
                      className={`px-3 py-1.5 rounded-sm text-[10px] font-mono font-bold uppercase tracking-wider cursor-pointer transition-all ${
                        ship.stardust >= magnetCost
                          ? 'bg-gold text-black hover:bg-yellow-400'
                          : 'bg-white/5 text-slate-600 border border-white/5 cursor-not-allowed'
                      }`}
                    >
                      {t('Upgrade', 'আপগ্রেড')}
                    </button>
                  </div>
                </div>

                {/* Hull Repair Nanobots */}
                <div className="p-4 rounded-sm border border-emerald-500/20 bg-emerald-950/10 flex flex-col justify-between gap-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="text-xs font-mono font-bold text-emerald-300 uppercase flex items-center gap-1.5">
                        <Heart size={14} className="text-emerald-400" />
                        <span>{t('Hull Repair Nanobots', 'হাল মেরামত ন্যানোবটস')}</span>
                      </div>
                      <p className="text-[10px] text-slate-400 mt-1">
                        {t('Deploys micro-drones to restore ship structural integrity (+30 HP).', 'জাহাজের অবকাঠামো পুনর্গঠনের জন্য মাইক্রো-ড্রোন মোতায়েন করে (+৩০ HP)।')}
                      </p>
                    </div>
                    <span className="text-[10px] font-mono bg-emerald-950 text-emerald-300 px-2 py-0.5 rounded border border-emerald-800">
                      {Math.round(ship.health)}/{ship.maxHealth} HP
                    </span>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-white/5">
                    <span className="text-xs font-mono text-amber-300 font-bold">{hullRepairCost} Stardust</span>
                    <button
                      onClick={handleRepairHull}
                      disabled={ship.stardust < hullRepairCost || !isHullDamaged}
                      className={`px-3 py-1.5 rounded-sm text-[10px] font-mono font-bold uppercase tracking-wider cursor-pointer transition-all ${
                        ship.stardust >= hullRepairCost && isHullDamaged
                          ? 'bg-emerald-500 text-black hover:bg-emerald-400'
                          : 'bg-white/5 text-slate-600 border border-white/5 cursor-not-allowed'
                      }`}
                    >
                      {!isHullDamaged ? t('Full Hull', 'পূর্ণ হাল') : t('Repair (+30 HP)', 'মেরামত (+৩০ HP)')}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* CUSTOMIZE TAB */}
          {activeTab === 'CUSTOMIZE' && (
            <div className="space-y-4">
              {/* Category sub-buttons */}
              <div className="flex gap-2 border-b border-white/10 pb-3">
                <button
                  onClick={() => setCustomCategory('SKIN')}
                  className={`px-3 py-1.5 text-xs font-mono font-bold uppercase rounded-sm border transition-all ${
                    customCategory === 'SKIN'
                      ? 'border-gold bg-gold/20 text-gold'
                      : 'border-white/10 bg-white/5 text-slate-400 hover:text-white'
                  }`}
                >
                  {t('Ship Skins', 'জাহাজের স্কিন')}
                </button>
                <button
                  onClick={() => setCustomCategory('THRUSTER')}
                  className={`px-3 py-1.5 text-xs font-mono font-bold uppercase rounded-sm border transition-all ${
                    customCategory === 'THRUSTER'
                      ? 'border-gold bg-gold/20 text-gold'
                      : 'border-white/10 bg-white/5 text-slate-400 hover:text-white'
                  }`}
                >
                  {t('Thruster FX', 'থ্রাস্টার এফএক্স')}
                </button>
                <button
                  onClick={() => setCustomCategory('SCANNER')}
                  className={`px-3 py-1.5 text-xs font-mono font-bold uppercase rounded-sm border transition-all ${
                    customCategory === 'SCANNER'
                      ? 'border-gold bg-gold/20 text-gold'
                      : 'border-white/10 bg-white/5 text-slate-400 hover:text-white'
                  }`}
                >
                  {t('Scanner FX', 'স্ক্যানার এফএক্স')}
                </button>
                <button
                  onClick={() => setCustomCategory('PERKS')}
                  className={`px-3 py-1.5 text-xs font-mono font-bold uppercase rounded-sm border transition-all ${
                    customCategory === 'PERKS'
                      ? 'border-gold bg-gold/20 text-gold'
                      : 'border-white/10 bg-white/5 text-slate-400 hover:text-white'
                  }`}
                >
                  {t('Passive Perks', 'প্যাসিভ পার্কস')}
                </button>
              </div>

              {/* SHIP SKINS */}
              {customCategory === 'SKIN' && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {SHIP_SKINS.map((skin) => {
                    const isUnlocked = unlockedCosmetics.includes(skin.id);
                    const isEquipped = equipped.shipSkin === skin.id;
                    const canAfford = (profile.stardustReserves || 0) >= skin.unlockCost;
                    const levelReqMet = level >= skin.unlockLevel;

                    return (
                      <div
                        key={skin.id}
                        className={`p-3.5 rounded-sm border flex items-center justify-between gap-3 transition-all ${
                          isEquipped
                            ? 'border-gold bg-gold/10'
                            : isUnlocked
                            ? 'border-white/10 bg-white/[0.02] hover:border-white/20'
                            : 'border-white/5 bg-white/[0.01] opacity-75'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div
                            className="w-8 h-8 rounded-full border-2 border-white/20 flex items-center justify-center shrink-0"
                            style={{ backgroundColor: `#${skin.colors.primary.toString(16).padStart(6, '0')}` }}
                          >
                            <div
                              className="w-4 h-4 rounded-full"
                              style={{ backgroundColor: `#${skin.colors.secondary.toString(16).padStart(6, '0')}` }}
                            />
                          </div>
                          <div>
                            <div className="text-xs font-mono font-bold text-white flex items-center gap-1.5">
                              <span>{skin.name}</span>
                              {isEquipped && <CheckCircle size={12} className="text-gold" />}
                            </div>
                            <p className="text-[10px] text-slate-400">{skin.description}</p>
                          </div>
                        </div>

                        <div>
                          {isEquipped ? (
                            <span className="text-[9px] font-mono uppercase text-gold font-bold px-2 py-1 bg-gold/10 rounded">
                              {t('EQUIPPED', 'ইকুইপড')}
                            </span>
                          ) : isUnlocked ? (
                            <button
                              onClick={() => equipCosmetic('SHIP_SKIN', skin.id)}
                              className="px-2.5 py-1 text-[10px] font-mono font-bold uppercase rounded bg-gold text-black hover:bg-yellow-400 cursor-pointer"
                            >
                              {t('EQUIP', 'ইকুইপ')}
                            </button>
                          ) : (
                            <button
                              disabled={!canAfford || !levelReqMet}
                              onClick={() => unlockCosmetic(skin.id)}
                              className={`px-2.5 py-1 text-[10px] font-mono font-bold uppercase rounded flex items-center gap-1 ${
                                canAfford && levelReqMet
                                  ? 'bg-amber-500 text-black hover:bg-amber-400 cursor-pointer'
                                  : 'bg-white/5 text-slate-500 border border-white/5 cursor-not-allowed'
                              }`}
                            >
                              <Lock size={10} />
                              <span>
                                {!levelReqMet
                                  ? `Lvl ${skin.unlockLevel}`
                                  : `${skin.unlockCost} Stardust`}
                              </span>
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* THRUSTER FX */}
              {customCategory === 'THRUSTER' && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {THRUSTER_FX.map((thruster) => {
                    const isUnlocked = unlockedCosmetics.includes(thruster.id);
                    const isEquipped = equipped.thrusterFx === thruster.id;
                    const canAfford = (profile.stardustReserves || 0) >= thruster.unlockCost;
                    const levelReqMet = level >= thruster.unlockLevel;

                    return (
                      <div
                        key={thruster.id}
                        className={`p-3.5 rounded-sm border flex items-center justify-between gap-3 transition-all ${
                          isEquipped
                            ? 'border-gold bg-gold/10'
                            : isUnlocked
                            ? 'border-white/10 bg-white/[0.02] hover:border-white/20'
                            : 'border-white/5 bg-white/[0.01] opacity-75'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div
                            className="w-8 h-8 rounded-full border-2 border-white/20 flex items-center justify-center shrink-0"
                            style={{ backgroundColor: `#${thruster.colors.primary.toString(16).padStart(6, '0')}` }}
                          >
                            <Zap size={14} className="text-white" />
                          </div>
                          <div>
                            <div className="text-xs font-mono font-bold text-white flex items-center gap-1.5">
                              <span>{thruster.name}</span>
                              {isEquipped && <CheckCircle size={12} className="text-gold" />}
                            </div>
                            <p className="text-[10px] text-slate-400">{thruster.description}</p>
                          </div>
                        </div>

                        <div>
                          {isEquipped ? (
                            <span className="text-[9px] font-mono uppercase text-gold font-bold px-2 py-1 bg-gold/10 rounded">
                              {t('EQUIPPED', 'ইকুইপড')}
                            </span>
                          ) : isUnlocked ? (
                            <button
                              onClick={() => equipCosmetic('THRUSTER_FX', thruster.id)}
                              className="px-2.5 py-1 text-[10px] font-mono font-bold uppercase rounded bg-gold text-black hover:bg-yellow-400 cursor-pointer"
                            >
                              {t('EQUIP', 'ইকুইপ')}
                            </button>
                          ) : (
                            <button
                              disabled={!canAfford || !levelReqMet}
                              onClick={() => unlockCosmetic(thruster.id)}
                              className={`px-2.5 py-1 text-[10px] font-mono font-bold uppercase rounded flex items-center gap-1 ${
                                canAfford && levelReqMet
                                  ? 'bg-amber-500 text-black hover:bg-amber-400 cursor-pointer'
                                  : 'bg-white/5 text-slate-500 border border-white/5 cursor-not-allowed'
                              }`}
                            >
                              <Lock size={10} />
                              <span>
                                {!levelReqMet
                                  ? `Lvl ${thruster.unlockLevel}`
                                  : `${thruster.unlockCost} Stardust`}
                              </span>
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* SCANNER FX */}
              {customCategory === 'SCANNER' && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {SCANNER_FX.map((scanner) => {
                    const isUnlocked = unlockedCosmetics.includes(scanner.id);
                    const isEquipped = equipped.scannerFx === scanner.id;
                    const canAfford = (profile.stardustReserves || 0) >= scanner.unlockCost;
                    const levelReqMet = level >= scanner.unlockLevel;

                    return (
                      <div
                        key={scanner.id}
                        className={`p-3.5 rounded-sm border flex items-center justify-between gap-3 transition-all ${
                          isEquipped
                            ? 'border-gold bg-gold/10'
                            : isUnlocked
                            ? 'border-white/10 bg-white/[0.02] hover:border-white/20'
                            : 'border-white/5 bg-white/[0.01] opacity-75'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div
                            className="w-8 h-8 rounded-full border-2 border-white/20 flex items-center justify-center shrink-0"
                            style={{ backgroundColor: `#${scanner.colors.primary.toString(16).padStart(6, '0')}` }}
                          >
                            <Crosshair size={14} className="text-white" />
                          </div>
                          <div>
                            <div className="text-xs font-mono font-bold text-white flex items-center gap-1.5">
                              <span>{scanner.name}</span>
                              {isEquipped && <CheckCircle size={12} className="text-gold" />}
                            </div>
                            <p className="text-[10px] text-slate-400">{scanner.description}</p>
                          </div>
                        </div>

                        <div>
                          {isEquipped ? (
                            <span className="text-[9px] font-mono uppercase text-gold font-bold px-2 py-1 bg-gold/10 rounded">
                              {t('EQUIPPED', 'ইকুইপড')}
                            </span>
                          ) : isUnlocked ? (
                            <button
                              onClick={() => equipCosmetic('SCANNER_FX', scanner.id)}
                              className="px-2.5 py-1 text-[10px] font-mono font-bold uppercase rounded bg-gold text-black hover:bg-yellow-400 cursor-pointer"
                            >
                              {t('EQUIP', 'ইকুইপ')}
                            </button>
                          ) : (
                            <button
                              disabled={!canAfford || !levelReqMet}
                              onClick={() => unlockCosmetic(scanner.id)}
                              className={`px-2.5 py-1 text-[10px] font-mono font-bold uppercase rounded flex items-center gap-1 ${
                                canAfford && levelReqMet
                                  ? 'bg-amber-500 text-black hover:bg-amber-400 cursor-pointer'
                                  : 'bg-white/5 text-slate-500 border border-white/5 cursor-not-allowed'
                              }`}
                            >
                              <Lock size={10} />
                              <span>
                                {!levelReqMet
                                  ? `Lvl ${scanner.unlockLevel}`
                                  : `${scanner.unlockCost} Stardust`}
                              </span>
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* PASSIVE PERKS */}
              {customCategory === 'PERKS' && (
                <div className="space-y-3 font-mono">
                  <div className="p-3 bg-white/[0.02] border border-white/10 rounded flex items-center justify-between text-xs">
                    <span className="text-slate-300">
                      {t('Active Perk Slots:', 'সক্রিয় পার্ক স্লট:')} {equippedPerks.length} / {maxActivePerks}
                    </span>
                    <span className="text-[10px] text-amber-400">
                      {t('Equipped perks provide passive gameplay buffs', 'ইকুইপড পার্ক প্যাসিভ সুবিধা প্রদান করে')}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 gap-2.5">
                    {PASSIVE_PERKS.map((perk) => {
                      const isUnlocked = unlockedPerks.includes(perk.id) || level >= perk.unlockLevel;
                      const isEquipped = equippedPerks.includes(perk.id);

                      return (
                        <div
                          key={perk.id}
                          className={`p-3 rounded border flex items-center justify-between gap-3 ${
                            isEquipped
                              ? 'border-gold/60 bg-gold/10'
                              : isUnlocked
                              ? 'border-white/10 bg-black/40'
                              : 'border-white/5 bg-white/[0.01] opacity-60'
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <div className="p-2 rounded bg-cyan-950 text-cyan-400 border border-cyan-800">
                              <Cpu size={16} />
                            </div>
                            <div>
                              <div className="text-xs font-bold text-white flex items-center gap-2">
                                <span>{perk.name}</span>
                                <span className="text-[9px] text-cyan-400 bg-cyan-950/60 px-1.5 py-0.5 rounded border border-cyan-800">
                                  {perk.category}
                                </span>
                              </div>
                              <p className="text-[10px] text-slate-400 mt-0.5">{perk.description}</p>
                            </div>
                          </div>

                          <div>
                            {isUnlocked ? (
                              <button
                                onClick={() => toggleEquipPerk(perk.id)}
                                className={`px-3 py-1 text-[10px] font-bold uppercase rounded cursor-pointer ${
                                  isEquipped
                                    ? 'bg-amber-500 text-black hover:bg-amber-400'
                                    : 'bg-white/10 text-white hover:bg-white/20'
                                }`}
                              >
                                {isEquipped ? t('ACTIVE', 'সক্রিয়') : t('EQUIP', 'ইকুইপ')}
                              </button>
                            ) : (
                              <div className="flex items-center gap-1 text-[10px] text-slate-500">
                                <Lock size={12} />
                                <span>Lvl {perk.unlockLevel}</span>
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* DOSSIER TAB */}
          {activeTab === 'DOSSIER' && (
            <div className="space-y-4 font-mono">
              {/* Profile Card & Level Progress */}
              <div className="p-4 rounded-sm border border-gold/30 bg-black/60 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gold/20 border border-gold flex items-center justify-center font-bold text-gold text-sm">
                      Lvl {level}
                    </div>
                    <div>
                      <div className="text-sm font-bold text-white">{profile.name}</div>
                      <div className="text-xs text-gold mt-0.5">{profile.rankTitle}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-[10px] text-slate-400">{t('TOTAL SCORE', 'মোট স্কোর')}</div>
                    <div className="text-lg font-bold text-gold">{profile.totalScore} pts</div>
                  </div>
                </div>

                {/* Level Progress Bar */}
                <div className="space-y-1">
                  <div className="flex justify-between text-[10px] text-slate-400">
                    <span>{t(`XP Progress (Level ${level})`, `এক্সপি অগ্রগতি (লেভেল ${level})`)}</span>
                    <span className="text-gold font-bold">
                      {currentXp} / {nextLevelXpCeil} XP ({progressPercent}%)
                    </span>
                  </div>
                  <div className="w-full h-2 rounded bg-white/10 overflow-hidden border border-white/10">
                    <div
                      className="h-full bg-gradient-to-r from-amber-500 to-gold transition-all duration-300"
                      style={{ width: `${progressPercent}%` }}
                    />
                  </div>
                </div>
              </div>

              {/* Stats Summary */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                <div className="p-3 bg-white/[0.02] border border-white/5 rounded text-center">
                  <div className="text-[10px] text-slate-400">{t('Discovered', 'আবিষ্কৃত')}</div>
                  <div className="text-base font-bold text-cyan-400 mt-0.5">
                    {profile.discoveredGalaxyIds.length} / {GALAXIES.length}
                  </div>
                </div>

                <div className="p-3 bg-white/[0.02] border border-white/5 rounded text-center">
                  <div className="text-[10px] text-slate-400">{t('Total XP', 'মোট এক্সপি')}</div>
                  <div className="text-base font-bold text-amber-400 mt-0.5">{profile.xp} XP</div>
                </div>

                <div className="p-3 bg-white/[0.02] border border-white/5 rounded text-center">
                  <div className="text-[10px] text-slate-400">{t('Quizzes', 'কুইজ উত্তর')}</div>
                  <div className="text-base font-bold text-emerald-400 mt-0.5">
                    {Object.keys(profile.quizBestScores || {}).length}
                  </div>
                </div>

                <div className="p-3 bg-white/[0.02] border border-white/5 rounded text-center">
                  <div className="text-[10px] text-slate-400">{t('Badges', 'ব্যাজ')}</div>
                  <div className="text-base font-bold text-gold mt-0.5">
                    {profile.unlockedBadges?.length || 0} / {EXPLORER_BADGES.length}
                  </div>
                </div>
              </div>

              {/* Badges Grid */}
              <div className="space-y-2">
                <div className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                  <Award size={14} className="text-gold" />
                  <span>{t('Explorer Merit Badges', 'অভিযাত্রী মেধা ব্যাজ')}</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {EXPLORER_BADGES.map((badge) => {
                    const isEarned = profile.unlockedBadges?.includes(badge.id);

                    return (
                      <div
                        key={badge.id}
                        className={`p-3 rounded border flex items-center gap-3 ${
                          isEarned
                            ? 'border-gold/40 bg-gold/5 text-white'
                            : 'border-white/5 bg-white/[0.01] text-slate-500 opacity-60'
                        }`}
                      >
                        <div
                          className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 ${
                            isEarned ? 'bg-gold/20 text-gold border border-gold/40' : 'bg-white/5 text-slate-600'
                          }`}
                        >
                          <Award size={18} />
                        </div>
                        <div>
                          <div className="text-xs font-bold text-white flex items-center gap-1.5">
                            <span>{badge.title}</span>
                            {isEarned && <CheckCircle size={12} className="text-gold" />}
                          </div>
                          <p className="text-[10px] text-slate-400 mt-0.5">{badge.description}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* ATLAS TAB */}
          {activeTab === 'ATLAS' && (
            <div className="space-y-3 font-mono">
              <p className="text-xs text-slate-400">
                {t('Select any discovered galaxy coordinates to initiate hyper-warp vectoring:', 'হাইপার-ওয়ার্প চ্যানেল সক্রিয় করতে গ্যালাক্সি নির্বাচন করুন:')}
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {GALAXIES.map((g) => {
                  const isDiscovered = profile.discoveredGalaxyIds.includes(g.id);

                  return (
                    <div
                      key={g.id}
                      className={`p-3 rounded-sm border flex items-center justify-between ${
                        isDiscovered
                          ? 'border-gold/30 bg-black/60 hover:border-gold cursor-pointer'
                          : 'border-white/5 bg-white/[0.01] opacity-60'
                      }`}
                      onClick={() => {
                        if (isDiscovered) {
                          onWarpToGalaxy(g);
                          onClose();
                        }
                      }}
                    >
                      <div>
                        <div className="text-xs font-bold text-white" style={{ color: isDiscovered ? g.visualColor : '#94a3b8' }}>
                          {g.name}
                        </div>
                        <div className="text-[10px] text-slate-400">
                          Coords: [{g.x}, {g.y}]
                        </div>
                      </div>

                      {isDiscovered ? (
                        <button className="px-2.5 py-1 bg-gold/10 hover:bg-gold/20 text-gold border border-gold/30 rounded text-[9px] uppercase font-bold">
                          {t('WARP', 'ওয়ার্প')}
                        </button>
                      ) : (
                        <span className="text-[9px] text-slate-600 uppercase">{t('LOCKED', 'লকড')}</span>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-white/10 bg-black/40 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-sm bg-white/5 hover:bg-white/10 border border-white/10 text-slate-200 uppercase tracking-wider text-[10px] font-mono font-bold cursor-pointer"
          >
            {t('Resume Exploration', 'ফিরে যান')}
          </button>
        </div>
      </div>
    </div>
  );
}
