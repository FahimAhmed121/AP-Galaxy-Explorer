import React, { useState } from 'react';
import { X, SlidersHorizontal, User, Award, Shield, Zap, Crosshair, Magnet, Sparkles, BookOpen, Navigation, Rocket } from 'lucide-react';
import { Spaceship, Galaxy } from '../../types';
import { GALAXIES } from '../../data/galaxies';
import { useGameStore } from '../../store/useGameStore';

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
  const { profile, settings } = useGameStore();
  const [activeTab, setActiveTab] = useState<'UPGRADES' | 'DOSSIER' | 'ATLAS'>('UPGRADES');

  const isBN = settings.language === 'BN';
  const t = (en: string, bn: string) => (isBN ? bn : en);

  // Upgrade costs logic
  const speedCost = Math.floor(15 * Math.pow(1.6, ship.speedUpgrade));
  const shieldCost = Math.floor(20 * Math.pow(1.6, ship.shieldUpgrade));
  const weaponCost = Math.floor(25 * Math.pow(1.6, ship.weaponUpgrade));
  const magnetCost = Math.floor(15 * Math.pow(1.6, ship.magnetUpgrade || 0));

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

    onUpdateShip(newShip);
  };

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
        <div className="p-3 bg-black/40 border-b border-white/10 flex gap-2 shrink-0">
          <button
            onClick={() => setActiveTab('UPGRADES')}
            className={`flex-1 py-2 text-xs font-mono font-bold uppercase tracking-wider rounded-sm flex items-center justify-center gap-2 cursor-pointer transition-all ${
              activeTab === 'UPGRADES'
                ? 'bg-gold text-black shadow-md'
                : 'bg-white/5 text-slate-400 hover:text-white'
            }`}
          >
            <Zap size={14} />
            <span>{t('Tech Deck Upgrades', 'টেক ডেক আপগ্রেড')}</span>
          </button>

          <button
            onClick={() => setActiveTab('DOSSIER')}
            className={`flex-1 py-2 text-xs font-mono font-bold uppercase tracking-wider rounded-sm flex items-center justify-center gap-2 cursor-pointer transition-all ${
              activeTab === 'DOSSIER'
                ? 'bg-gold text-black shadow-md'
                : 'bg-white/5 text-slate-400 hover:text-white'
            }`}
          >
            <User size={14} />
            <span>{t('Explorer Dossier', 'অভিযাত্রী প্রোফাইল')}</span>
          </button>

          <button
            onClick={() => setActiveTab('ATLAS')}
            className={`flex-1 py-2 text-xs font-mono font-bold uppercase tracking-wider rounded-sm flex items-center justify-center gap-2 cursor-pointer transition-all ${
              activeTab === 'ATLAS'
                ? 'bg-gold text-black shadow-md'
                : 'bg-white/5 text-slate-400 hover:text-white'
            }`}
          >
            <Navigation size={14} />
            <span>{t('Galactic Warp Map', 'ওয়ার্প মানচিত্র')}</span>
          </button>
        </div>

        {/* Tab Content */}
        <div className="p-6 overflow-y-auto max-h-[60vh] space-y-4">
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
              </div>
            </div>
          )}

          {activeTab === 'DOSSIER' && (
            <div className="space-y-4 font-mono">
              <div className="p-4 rounded-sm border border-gold/30 bg-black/60 flex items-center justify-between">
                <div>
                  <div className="text-sm font-bold text-white">{profile.name}</div>
                  <div className="text-xs text-gold mt-0.5">{profile.rankTitle}</div>
                </div>
                <div className="text-right">
                  <div className="text-[10px] text-slate-400">{t('TOTAL SCORE', 'মোট স্কোর')}</div>
                  <div className="text-lg font-bold text-gold">{profile.totalScore} pts</div>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                <div className="p-3 bg-white/[0.02] border border-white/5 rounded text-center">
                  <div className="text-xs text-slate-400">{t('Discovered Galaxies', 'আবিষ্কৃত গ্যালাক্সি')}</div>
                  <div className="text-lg font-bold text-cyan-400 mt-1">
                    {profile.discoveredGalaxyIds.length} / {GALAXIES.length}
                  </div>
                </div>

                <div className="p-3 bg-white/[0.02] border border-white/5 rounded text-center">
                  <div className="text-xs text-slate-400">{t('Explorer XP', 'অভিযাত্রী এক্সপি')}</div>
                  <div className="text-lg font-bold text-amber-400 mt-1">{profile.xp} XP</div>
                </div>

                <div className="p-3 bg-white/[0.02] border border-white/5 rounded text-center">
                  <div className="text-xs text-slate-400">{t('Badges Earned', 'অর্জিত ব্যাজ')}</div>
                  <div className="text-lg font-bold text-gold mt-1">
                    {profile.discoveredGalaxyIds.length > 0 ? profile.discoveredGalaxyIds.length : 0}
                  </div>
                </div>
              </div>
            </div>
          )}

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
