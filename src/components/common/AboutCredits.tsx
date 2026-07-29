import React from 'react';
import { X, BookOpen, Star, Award, Sparkles, User, Code, Palette, Rocket } from 'lucide-react';

interface AboutCreditsProps {
  type: 'ABOUT' | 'CREDITS';
  onClose: () => void;
}

export default function AboutCredits({ type, onClose }: AboutCreditsProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div 
        id="about-credits-modal"
        className="relative w-full max-w-2xl overflow-hidden rounded-sm border border-white/10 bg-[#050508]/95 text-slate-100 shadow-2xl glow-gold"
      >
        {/* Futuristic glowing border */}
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-gold via-yellow-600 to-gold"></div>

        {/* Close Button */}
        <button
          id="close-modal-btn"
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-gold rounded-full bg-white/5 hover:bg-white/10 transition-colors cursor-pointer"
        >
          <X size={16} />
        </button>

        <div className="p-6 md:p-8">
          {type === 'ABOUT' ? (
            <div id="about-section">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-3 rounded-sm bg-gold/10 text-gold border border-gold/20">
                  <BookOpen size={22} />
                </div>
                <div>
                  <h2 className="text-2xl font-serif italic text-white font-medium">About Astronomy Pathshala</h2>
                  <p className="text-xs text-gold font-mono uppercase tracking-[0.2em]">Igniting Cosmic Curiosity</p>
                </div>
              </div>

              <div className="space-y-4 text-slate-300 text-xs md:text-sm leading-relaxed">
                <p>
                  <strong>Astronomy Pathshala</strong> is a premier space education platform dedicated to nurturing scientific thinking, space research interest, and celestial curiosity among students, educators, and stargazers of all ages.
                </p>
                <p>
                  We believe that the universe shouldn't be locked behind complex equations. Our mission is to democratize space science by making astronomical concepts interactive, intuitive, and fun. Through real-life workshops, planetarium experiences, telescope viewings, and gamified digital learning like <strong>AP Galaxy Explorer</strong>, we help make the cosmos accessible to everyone.
                </p>
                
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-4">
                  <div className="p-3 rounded-sm bg-white/[0.02] border border-white/5 flex flex-col items-center text-center">
                    <Star className="text-gold mb-1" size={18} />
                    <span className="text-[11px] font-semibold text-white tracking-wide">Interactive Modules</span>
                    <span className="text-[9px] text-slate-400 mt-0.5">Learn by doing</span>
                  </div>
                  <div className="p-3 rounded-sm bg-white/[0.02] border border-white/5 flex flex-col items-center text-center">
                    <Award className="text-gold mb-1" size={18} />
                    <span className="text-[11px] font-semibold text-white tracking-wide">Cosmic Badges</span>
                    <span className="text-[9px] text-slate-400 mt-0.5">Quiz certificates</span>
                  </div>
                  <div className="p-3 rounded-sm bg-white/[0.02] border border-white/5 flex flex-col items-center text-center">
                    <Sparkles className="text-gold mb-1" size={18} />
                    <span className="text-[11px] font-semibold text-white tracking-wide">Sky Watching</span>
                    <span className="text-[9px] text-slate-400 mt-0.5">Empowering telescopes</span>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div id="credits-section">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-3 rounded-sm bg-gold/10 text-gold border border-gold/20">
                  <Rocket size={22} />
                </div>
                <div>
                  <h2 className="text-2xl font-serif italic text-white font-medium">Explorer Credits</h2>
                  <p className="text-xs text-gold font-mono uppercase tracking-[0.2em]">Mission Operations Team</p>
                </div>
              </div>

              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 rounded-sm bg-white/[0.01] border border-white/5 flex gap-3 items-start">
                    <div className="p-2 bg-gold/10 rounded-sm text-gold mt-1">
                      <Code size={16} />
                    </div>
                    <div>
                      <h4 className="font-semibold text-white text-xs uppercase tracking-wider">Game Director & Lead Developer</h4>
                      <p className="text-[10px] text-slate-400 mt-0.5">Astronomy Pathshala Tech Team</p>
                      <p className="text-[10px] text-slate-500 mt-1.5 leading-relaxed">Responsible for space physics simulation, canvas algorithms, and game design.</p>
                    </div>
                  </div>

                  <div className="p-4 rounded-sm bg-white/[0.01] border border-white/5 flex gap-3 items-start">
                    <div className="p-2 bg-gold/10 rounded-sm text-gold mt-1">
                      <BookOpen size={16} />
                    </div>
                    <div>
                      <h4 className="font-semibold text-white text-xs uppercase tracking-wider">Astro-Pedagogy & Curriculum</h4>
                      <p className="text-[10px] text-slate-400 mt-0.5">Education & Research Division</p>
                      <p className="text-[10px] text-slate-500 mt-1.5 leading-relaxed">Curated galaxies dataset, checked educational facts, and verified quiz questions.</p>
                    </div>
                  </div>

                  <div className="p-4 rounded-sm bg-white/[0.01] border border-white/5 flex gap-3 items-start">
                    <div className="p-2 bg-gold/10 rounded-sm text-gold mt-1">
                      <Palette size={16} />
                    </div>
                    <div>
                      <h4 className="font-semibold text-white text-xs uppercase tracking-wider">Art Direction & VFX Design</h4>
                      <p className="text-[10px] text-slate-400 mt-0.5">Creative Studio</p>
                      <p className="text-[10px] text-slate-500 mt-1.5 leading-relaxed">Designed procedural space-time jump shaders, ship aesthetics, and UI elements.</p>
                    </div>
                  </div>

                  <div className="p-4 rounded-sm bg-white/[0.01] border border-white/5 flex gap-3 items-start">
                    <div className="p-2 bg-gold/10 rounded-sm text-gold mt-1">
                      <User size={16} />
                    </div>
                    <div>
                      <h4 className="font-semibold text-white text-xs uppercase tracking-wider">Playtesters Support</h4>
                      <p className="text-[10px] text-slate-400 mt-0.5">AP Astronomy Club Students</p>
                      <p className="text-[10px] text-slate-500 mt-1.5 leading-relaxed">Special thanks to hundreds of young stargazers who playtested and improved controls.</p>
                    </div>
                  </div>
                </div>

                <div className="p-3 rounded-sm bg-black/60 border border-white/10 text-center">
                  <p className="text-[10px] text-slate-400 font-mono">
                    Powered by <span className="text-gold">Vite + React + Tailwind CSS</span>. Dedicated to space enthusiasts everywhere.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Bottom Action */}
          <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-white/10">
            <button
              id="modal-close-action"
              onClick={onClose}
              className="px-5 py-2.5 text-xs font-mono font-bold uppercase tracking-wider rounded-sm bg-white/5 border border-white/10 hover:border-gold hover:text-gold text-slate-200 transition-colors cursor-pointer"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
