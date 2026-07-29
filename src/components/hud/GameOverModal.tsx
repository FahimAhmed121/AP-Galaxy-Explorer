import React from 'react';
import { RotateCcw, Home, Skull, ShieldAlert } from 'lucide-react';
import { Spaceship } from '../../types';
import { useGameStore } from '../../store/useGameStore';

interface GameOverModalProps {
  ship: Spaceship;
  onRespawn: () => void;
  onReturnMenu: () => void;
}

export default function GameOverModal({
  ship,
  onRespawn,
  onReturnMenu,
}: GameOverModalProps) {
  const { settings } = useGameStore();
  const isBN = settings.language === 'BN';
  const t = (en: string, bn: string) => (isBN ? bn : en);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-lg font-sans select-none">
      <div 
        id="game-over-modal"
        className="relative w-full max-w-md overflow-hidden rounded-sm border border-red-500/30 bg-[#0a0505]/95 text-slate-100 shadow-2xl flex flex-col glow-gold"
      >
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-red-600 via-orange-500 to-red-600"></div>

        <div className="p-6 text-center space-y-4">
          <div className="inline-flex p-4 rounded-full bg-red-500/10 text-red-500 border border-red-500/20 mb-2">
            <ShieldAlert size={36} />
          </div>

          <h2 className="text-2xl font-serif italic text-red-400 font-bold uppercase tracking-wider">
            {t('HULL INTEGRITY COMPROMISED', 'জাহাজ ক্ষতিগ্রস্ত হয়েছে')}
          </h2>

          <p className="text-xs text-slate-400 font-mono">
            {t('Your explorer vessel was destroyed by deep-space hazard impact.', 'গভীর মহাকাশের গ্রহাণু আঘাতে আপনার অনুসন্ধান যানটি ধ্বংস হয়ে গেছে।')}
          </p>

          <div className="p-4 rounded-sm border border-white/10 bg-black/60 font-mono space-y-2 text-xs">
            <div className="flex justify-between">
              <span className="text-slate-400">{t('Final Score:', 'চূড়ান্ত স্কোর:')}</span>
              <span className="text-gold font-bold">{ship.score} pts</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">{t('Stardust Recovered:', 'স্টারডাস্ট সংগৃহীত:')}</span>
              <span className="text-amber-300 font-bold">{ship.stardust} units</span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <button
              onClick={onRespawn}
              className="flex-1 py-3 px-4 rounded-sm bg-gradient-to-r from-gold to-yellow-600 text-black font-mono font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer shadow-lg hover:brightness-110 transition-all"
            >
              <RotateCcw size={14} />
              <span>{t('Re-deploy Explorer', 'পুনরায় রোপণ')}</span>
            </button>

            <button
              onClick={onReturnMenu}
              className="py-3 px-4 rounded-sm bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 font-mono font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer transition-all"
            >
              <Home size={14} />
              <span>{t('Main Menu', 'প্রধান মেনু')}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
