import React, { useState } from 'react';
import { X, Volume2, VolumeX, Globe, RotateCcw, User, ShieldCheck, Gamepad2 } from 'lucide-react';
import { useGameStore } from '../../store/useGameStore';
import { audioEngine } from '../../engine/audioEngine';

interface SettingsModalProps {
  onClose: () => void;
}

export default function SettingsModal({ onClose }: SettingsModalProps) {
  const { settings, profile, updateSettings, setExplorerName, resetProgress } = useGameStore();
  const [nameInput, setNameInput] = useState(profile.name);
  const [showConfirmReset, setShowConfirmReset] = useState(false);

  const isBN = settings.language === 'BN';
  const t = (en: string, bn: string) => (isBN ? bn : en);

  const handleNameSave = () => {
    setExplorerName(nameInput);
  };

  const handleSoundToggle = () => {
    const newSoundState = !settings.soundEnabled;
    updateSettings({ soundEnabled: newSoundState });
    audioEngine.updateMusicVolume(newSoundState, settings.bgmVolume);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md font-sans select-none">
      <div 
        id="game-settings-modal"
        className="relative w-full max-w-lg overflow-hidden rounded-sm border border-white/10 bg-[#050508]/95 text-slate-100 shadow-2xl flex flex-col glow-gold"
      >
        {/* Top Gold Bar */}
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-gold via-yellow-600 to-gold"></div>

        {/* Header */}
        <div className="p-5 border-b border-white/10 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded bg-gold/10 text-gold border border-gold/20">
              <Gamepad2 size={20} />
            </div>
            <div>
              <h2 className="text-xl font-serif italic text-white font-medium">
                {t('Mission Settings', 'মিশন সেটিংস')}
              </h2>
              <p className="text-[10px] font-mono text-gold uppercase tracking-[0.2em]">
                {t('Preferences & Flight Controls', 'পছন্দসমূহ ও নিয়ন্ত্রণ')}
              </p>
            </div>
          </div>

          <button
            id="close-settings-btn"
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-gold rounded-full bg-white/5 hover:bg-white/10 transition-colors cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6 overflow-y-auto max-h-[70vh]">
          {/* Explorer Profile Call Sign */}
          <div className="p-4 rounded-sm border border-white/10 bg-white/[0.02] space-y-3">
            <div className="flex items-center gap-2 text-gold text-xs font-mono font-bold uppercase tracking-wider">
              <User size={14} />
              <span>{t('Explorer Call Sign', 'অভিযাত্রী নাম')}</span>
            </div>
            <div className="flex gap-2">
              <input
                type="text"
                value={nameInput}
                onChange={(e) => setNameInput(e.target.value)}
                maxLength={24}
                className="flex-1 px-3 py-2 bg-black/60 border border-white/15 rounded-sm text-sm text-white font-mono focus:border-gold focus:outline-none"
              />
              <button
                onClick={handleNameSave}
                className="px-4 py-2 bg-gold/20 hover:bg-gold/30 text-gold border border-gold/40 rounded-sm text-xs font-mono font-bold uppercase cursor-pointer"
              >
                {t('Save', 'সংরক্ষণ')}
              </button>
            </div>
          </div>

          {/* Audio Settings */}
          <div className="p-4 rounded-sm border border-white/10 bg-white/[0.02] space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-gold text-xs font-mono font-bold uppercase tracking-wider">
                {settings.soundEnabled ? <Volume2 size={14} /> : <VolumeX size={14} />}
                <span>{t('Audio & Ambient Drone', 'শব্দ ও ব্যাকগ্রাউন্ড মিউজিক')}</span>
              </div>
              <button
                onClick={handleSoundToggle}
                className={`px-3 py-1 rounded-sm border text-[10px] font-mono font-bold uppercase tracking-wider cursor-pointer ${
                  settings.soundEnabled
                    ? 'bg-gold text-black border-gold'
                    : 'bg-white/5 text-slate-400 border-white/10'
                }`}
              >
                {settings.soundEnabled ? t('ENABLED', 'সক্রিয়') : t('MUTED', 'নিষ্ক্রিয়')}
              </button>
            </div>

            {settings.soundEnabled && (
              <div className="space-y-3 pt-2">
                <div>
                  <div className="flex justify-between text-[11px] font-mono text-slate-300 mb-1">
                    <span>{t('Ambient Deep Space Music', 'মহাকাশ সঙ্গীত')}</span>
                    <span>{Math.round(settings.bgmVolume * 100)}%</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.05"
                    value={settings.bgmVolume}
                    onChange={(e) => {
                      const val = parseFloat(e.target.value);
                      updateSettings({ bgmVolume: val });
                      audioEngine.updateMusicVolume(true, val);
                    }}
                    className="w-full accent-gold bg-black/60 cursor-pointer"
                  />
                </div>

                <div>
                  <div className="flex justify-between text-[11px] font-mono text-slate-300 mb-1">
                    <span>{t('Sound Effects (SFX)', 'শব্দ প্রভাব (SFX)')}</span>
                    <span>{Math.round(settings.sfxVolume * 100)}%</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.05"
                    value={settings.sfxVolume}
                    onChange={(e) => {
                      const val = parseFloat(e.target.value);
                      updateSettings({ sfxVolume: val });
                    }}
                    className="w-full accent-gold bg-black/60 cursor-pointer"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Language Selection */}
          <div className="p-4 rounded-sm border border-white/10 bg-white/[0.02] flex items-center justify-between">
            <div className="flex items-center gap-2 text-gold text-xs font-mono font-bold uppercase tracking-wider">
              <Globe size={14} />
              <span>{t('Language / ভাষা', 'ভাষা / Language')}</span>
            </div>
            <div className="flex bg-black/60 p-1 border border-white/10 rounded-sm">
              <button
                onClick={() => updateSettings({ language: 'EN' })}
                className={`px-3 py-1 text-[10px] font-mono font-bold uppercase rounded-sm cursor-pointer ${
                  settings.language === 'EN' ? 'bg-gold text-black' : 'text-slate-400'
                }`}
              >
                English
              </button>
              <button
                onClick={() => updateSettings({ language: 'BN' })}
                className={`px-3 py-1 text-[10px] font-mono font-bold uppercase rounded-sm cursor-pointer ${
                  settings.language === 'BN' ? 'bg-gold text-black' : 'text-slate-400'
                }`}
              >
                বাংলা
              </button>
            </div>
          </div>

          {/* Flight Controls Key Guide */}
          <div className="p-4 rounded-sm border border-white/10 bg-white/[0.02] space-y-2 font-mono text-xs text-slate-300">
            <div className="text-gold text-xs font-bold uppercase tracking-wider mb-2">
              {t('Flight Controls Scheme', 'উড্ডয়ন নিয়ন্ত্রণ গাইড')}
            </div>
            <div className="grid grid-cols-2 gap-2 text-[11px]">
              <div><span className="text-gold font-bold">W / Up Arrow:</span> Thrusters</div>
              <div><span className="text-gold font-bold">A/D / Left/Right:</span> Steer Ship</div>
              <div><span className="text-gold font-bold">Spacebar / Left Click:</span> Plasma Lasers</div>
              <div><span className="text-gold font-bold">S / Down Arrow:</span> Reverse Thrusters</div>
            </div>
          </div>

          {/* Danger Zone - Reset Progress */}
          <div className="p-4 rounded-sm border border-red-500/20 bg-red-950/10 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-red-400 text-xs font-mono font-bold uppercase tracking-wider">
                <RotateCcw size={14} />
                <span>{t('Reset Mission Data', 'মিশন তথ্য রিসেট')}</span>
              </div>
              <button
                onClick={() => setShowConfirmReset(true)}
                className="px-3 py-1 bg-red-500/20 hover:bg-red-500/30 text-red-300 border border-red-500/30 rounded-sm text-[10px] font-mono font-bold uppercase cursor-pointer"
              >
                {t('Reset Progress', 'রিসেট করুন')}
              </button>
            </div>

            {showConfirmReset && (
              <div className="p-3 bg-red-950/40 border border-red-500/40 rounded-sm space-y-2 text-[11px] text-red-200 font-mono">
                <p>{t('Are you sure? This clears all discovered galaxies, scores, and badges.', 'আপনি কি নিশ্চিত? এটি আপনার আবিষ্কৃত সকল তথ্য মুছে ফেলবে।')}</p>
                <div className="flex gap-2 justify-end">
                  <button
                    onClick={() => setShowConfirmReset(false)}
                    className="px-2 py-1 bg-white/10 text-white rounded text-[10px]"
                  >
                    {t('Cancel', 'বাতিল')}
                  </button>
                  <button
                    onClick={() => {
                      resetProgress();
                      setShowConfirmReset(false);
                      onClose();
                    }}
                    className="px-2 py-1 bg-red-600 text-white rounded text-[10px] font-bold"
                  >
                    {t('Confirm Reset', 'হ্যাঁ, রিসেট করুন')}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-white/10 bg-black/40 flex items-center justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-sm bg-white/5 hover:bg-white/10 border border-white/10 text-slate-200 uppercase tracking-wider text-[10px] font-mono font-bold cursor-pointer"
          >
            {t('Done', 'সম্পন্ন')}
          </button>
        </div>
      </div>
    </div>
  );
}
