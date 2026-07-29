import React, { useState } from 'react';
import { X, BookOpen, Award, Compass, Search, ExternalLink, CheckCircle, Video, Play, Layers, MapPin, Calendar } from 'lucide-react';
import { GALAXIES } from '../../data/galaxies';
import { useGameStore } from '../../store/useGameStore';
import { Galaxy } from '../../types';

interface ArchiveModalProps {
  onClose: () => void;
  onOpenGalaxy: (galaxy: Galaxy) => void;
}

export default function ArchiveModal({ onClose, onOpenGalaxy }: ArchiveModalProps) {
  const { profile, settings } = useGameStore();
  const [filter, setFilter] = useState<'ALL' | 'DISCOVERED' | 'LOCKED'>('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  const isBN = settings.language === 'BN';
  const t = (en: string, bn: string) => (isBN ? bn : en);

  const filteredGalaxies = GALAXIES.filter((g) => {
    const isDiscovered = profile.discoveredGalaxyIds.includes(g.id);
    if (filter === 'DISCOVERED' && !isDiscovered) return false;
    if (filter === 'LOCKED' && isDiscovered) return false;

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchName = g.name.toLowerCase().includes(q);
      const matchType = g.type.toLowerCase().includes(q);
      const matchConst = g.constellation.toLowerCase().includes(q);
      return matchName || matchType || matchConst;
    }
    return true;
  });

  const completionPct = Math.round((profile.discoveredGalaxyIds.length / GALAXIES.length) * 100);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md font-sans select-none">
      <div 
        id="galactic-archive-modal"
        className="relative w-full max-w-4xl max-h-[90vh] overflow-hidden rounded-sm border border-white/10 bg-[#050508]/95 text-slate-100 shadow-2xl flex flex-col glow-gold"
      >
        {/* Top Gold Accent Bar */}
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-gold via-yellow-600 to-gold"></div>

        {/* Modal Header */}
        <div className="p-5 md:p-6 border-b border-white/10 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded bg-gold/10 text-gold border border-gold/20">
              <BookOpen size={20} />
            </div>
            <div>
              <h2 className="text-xl md:text-2xl font-serif italic text-white font-medium">
                {t('Galactic Catalog & Archives', 'গ্যালাকটিক ক্যাটালগ ও আর্কাইভ')}
              </h2>
              <p className="text-xs font-mono text-gold uppercase tracking-[0.2em] mt-0.5">
                {t(`Explorer Archives • ${completionPct}% Completion`, `অভিযাত্রী আর্কাইভ • ${completionPct}% সম্পন্ন`)}
              </p>
            </div>
          </div>

          <button
            id="close-archive-btn"
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-gold rounded-full bg-white/5 hover:bg-white/10 transition-colors cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        {/* Filter and Search Bar */}
        <div className="p-4 bg-black/40 border-b border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3 shrink-0">
          {/* Tab Filters */}
          <div className="flex bg-white/[0.03] p-1 rounded-sm border border-white/5 w-full sm:w-auto">
            <button
              onClick={() => setFilter('ALL')}
              className={`px-3 py-1.5 text-[10px] font-mono font-bold uppercase tracking-wider rounded-sm transition-all cursor-pointer flex-1 sm:flex-initial ${
                filter === 'ALL' ? 'bg-gold text-black shadow-md' : 'text-slate-400 hover:text-white'
              }`}
            >
              {t(`All (${GALAXIES.length})`, `সকল (${GALAXIES.length})`)}
            </button>
            <button
              onClick={() => setFilter('DISCOVERED')}
              className={`px-3 py-1.5 text-[10px] font-mono font-bold uppercase tracking-wider rounded-sm transition-all cursor-pointer flex-1 sm:flex-initial ${
                filter === 'DISCOVERED' ? 'bg-gold text-black shadow-md' : 'text-slate-400 hover:text-white'
              }`}
            >
              {t(`Discovered (${profile.discoveredGalaxyIds.length})`, `আবিষ্কৃত (${profile.discoveredGalaxyIds.length})`)}
            </button>
            <button
              onClick={() => setFilter('LOCKED')}
              className={`px-3 py-1.5 text-[10px] font-mono font-bold uppercase tracking-wider rounded-sm transition-all cursor-pointer flex-1 sm:flex-initial ${
                filter === 'LOCKED' ? 'bg-gold text-black shadow-md' : 'text-slate-400 hover:text-white'
              }`}
            >
              {t(`Locked (${GALAXIES.length - profile.discoveredGalaxyIds.length})`, `লকড (${GALAXIES.length - profile.discoveredGalaxyIds.length})`)}
            </button>
          </div>

          {/* Search Box */}
          <div className="relative w-full sm:w-64">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
            <input
              type="text"
              placeholder={t('Search galaxies...', 'গ্যালাক্সি অনুসন্ধান...')}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 rounded-sm border border-white/10 bg-black/60 text-xs text-white placeholder-slate-500 font-mono focus:outline-none focus:border-gold"
            />
          </div>
        </div>

        {/* Galaxy Grid */}
        <div className="p-5 overflow-y-auto grid grid-cols-1 md:grid-cols-2 gap-4 max-h-[60vh]">
          {filteredGalaxies.map((g) => {
            const isDiscovered = profile.discoveredGalaxyIds.includes(g.id);
            const bestScore = profile.quizBestScores[g.id];

            return (
              <div
                key={g.id}
                className={`p-4 rounded-sm border flex flex-col justify-between gap-3 transition-all ${
                  isDiscovered
                    ? 'border-gold/30 bg-black/60 hover:border-gold/60 shadow-lg'
                    : 'border-white/5 bg-white/[0.01] opacity-75'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span
                      className="text-sm font-serif italic font-bold tracking-wide"
                      style={{ color: isDiscovered ? g.visualColor : '#64748b' }}
                    >
                      {g.name}
                    </span>
                    <span
                      className={`px-2 py-0.5 rounded-sm text-[9px] font-mono font-bold uppercase ${
                        isDiscovered
                          ? 'bg-gold/10 text-gold border border-gold/30'
                          : 'bg-white/[0.02] text-slate-600 border border-white/5'
                      }`}
                    >
                      {isDiscovered ? t('DISCOVERED', 'আবিষ্কৃত') : t('LOCKED', 'লকড')}
                    </span>
                  </div>

                  {isDiscovered ? (
                    <div className="space-y-2">
                      {g.realImageUrl && (
                        <div className="w-full h-28 rounded bg-slate-900 overflow-hidden border border-white/10 relative">
                          <img
                            src={g.realImageUrl}
                            alt={g.name}
                            referrerPolicy="no-referrer"
                            className="w-full h-full object-cover opacity-85 hover:scale-105 transition-transform duration-500"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end p-2">
                            <span className="text-[9px] font-mono text-slate-300">
                              {g.type}
                            </span>
                          </div>
                        </div>
                      )}

                      <p className="text-xs text-slate-300 leading-relaxed line-clamp-2">
                        {isBN && g.banglaTranslation ? g.banglaTranslation.description : g.description}
                      </p>

                      <div className="grid grid-cols-2 gap-2 pt-2 border-t border-white/5 text-[10px] font-mono text-slate-400">
                        <div>
                          {t('Dist:', 'দূরত্ব:')} <span className="text-white font-bold">{g.distance}</span>
                        </div>
                        <div>
                          {t('Const:', 'তারামণ্ডল:')} <span className="text-white font-bold">{g.constellation}</span>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="py-8 flex flex-col items-center justify-center text-center font-mono text-slate-600">
                      <Compass size={28} className="opacity-20 mb-2" />
                      <span className="text-xs uppercase tracking-wider">{t('Coordinates Unexplored', 'স্থানাঙ্ক অনাবিষ্কৃত')}</span>
                      <span className="text-[10px] text-slate-700 mt-1">
                        {t(`Fly to coordinates [X: ${g.x}, Y: ${g.y}] in Space Sandbox`, `স্পেস স্যান্ডবক্সে [X: ${g.x}, Y: ${g.y}] স্থানাঙ্কে যান`)}
                      </span>
                    </div>
                  )}
                </div>

                {/* Footer Action */}
                <div className="pt-3 border-t border-white/5 flex items-center justify-between">
                  {isDiscovered ? (
                    <>
                      <div className="text-[10px] font-mono text-slate-400">
                        {t('Best Quiz Score:', 'সর্বোত্তম স্কোর:')}{' '}
                        <span className="text-gold font-bold">
                          {bestScore !== undefined ? `${bestScore} / ${g.quizzes.length}` : t('Not taken', 'দেওয়া হয়নি')}
                        </span>
                      </div>

                      <button
                        onClick={() => {
                          onOpenGalaxy(g);
                          onClose();
                        }}
                        className="px-3 py-1.5 rounded-sm bg-gold/10 hover:bg-gold/20 text-gold border border-gold/30 text-[10px] font-mono font-bold uppercase tracking-wider cursor-pointer transition-colors"
                      >
                        {t('View Spec Card', 'বিবরণী দেখুন')}
                      </button>
                    </>
                  ) : (
                    <span className="text-[10px] font-mono text-slate-600 italic">
                      {t('Discover in game to unlock educational archive', 'আর্কাইভ আনলক করতে গেমে আবিষ্কার করুন')}
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom Footer */}
        <div className="p-4 border-t border-white/10 bg-black/40 flex items-center justify-between text-xs text-slate-500 font-mono shrink-0">
          <span>{t('Astronomy Pathshala Catalog System', 'অ্যাস্ট্রোনমি পাঠশালা ক্যাটালগ সিস্টেম')}</span>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-sm bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 uppercase tracking-wider text-[10px] font-bold cursor-pointer"
          >
            {t('Close Catalog', 'বন্ধ করুন')}
          </button>
        </div>
      </div>
    </div>
  );
}
