import React from 'react';
import {
  X,
  BookOpen,
  Star,
  Sparkles,
  Rocket,
  Globe,
  Facebook,
  Youtube,
  Instagram,
  Linkedin,
  Github,
  Mail,
  ExternalLink,
  Users,
  Compass,
  Telescope,
  Atom,
} from 'lucide-react';
import { useGameStore } from '../../store/useGameStore';

interface AboutCreditsProps {
  type: 'ABOUT' | 'CREDITS';
  onClose: () => void;
}

export default function AboutCredits({ type, onClose }: AboutCreditsProps) {
  const { settings } = useGameStore();
  const isBN = settings.language === 'BN';
  const t = (en: string, bn: string) => (isBN ? bn : en);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md font-sans select-none">
      <div 
        id="about-credits-modal"
        className="relative w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden rounded-sm border border-white/10 bg-[#050508]/95 text-slate-100 shadow-2xl glow-gold"
      >
        {/* Futuristic glowing gold border */}
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-gold via-yellow-600 to-gold z-10"></div>

        {/* Close Button */}
        <button
          id="close-modal-btn"
          onClick={onClose}
          className="absolute top-4 right-4 z-20 p-2 text-slate-400 hover:text-gold rounded-full bg-white/5 hover:bg-white/10 transition-colors cursor-pointer"
          title={t('Close', 'বন্ধ করুন')}
          aria-label="Close dialog"
        >
          <X size={16} />
        </button>

        {/* Modal Scrollable Body */}
        <div className="p-6 md:p-8 overflow-y-auto space-y-6">
          {type === 'ABOUT' ? (
            <div id="about-section" className="space-y-6">
              {/* Header */}
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-sm bg-gold/10 text-gold border border-gold/20 shrink-0">
                  <BookOpen size={22} />
                </div>
                <div>
                  <h2 className="text-2xl font-serif italic text-white font-medium">
                    {t('Astronomy Pathshala', 'অ্যাস্ট্রোনমি পাঠশালা')}
                  </h2>
                  <p className="text-xs text-gold font-mono uppercase tracking-[0.2em]">
                    {t('Empowering the next generation with space science', 'মহাকাশ বিজ্ঞানে আগামী প্রজন্মকে অনুপ্রাণিত করা')}
                  </p>
                </div>
              </div>

              {/* Short Introduction (2-4 concise sentences) */}
              <div className="space-y-3 text-slate-300 text-xs md:text-sm leading-relaxed">
                <p>
                  <strong>Astronomy Pathshala</strong> is Bangladesh's first and largest edtech platform dedicated to space-science education, established in 2020.
                </p>
                <p>
                  We make astronomy and space exploration accessible, engaging, and affordable for K–12 and university students, educators, and curious minds.
                </p>
                <p>
                  Through interactive digital tools like <strong>AP Galaxy Explorer</strong>, expert courses, hands-on workshops, and telescope sky-observation sessions, we inspire learners across the country to discover the cosmos.
                </p>
              </div>

              {/* What We Do (4 Compact Visual Cards) */}
              <div>
                <h3 className="text-[11px] font-mono font-bold uppercase tracking-wider text-gold mb-3">
                  {t('What We Do', 'আমাদের কার্যক্রম')}
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="p-3.5 rounded-sm bg-white/[0.02] border border-white/5 flex items-start gap-3">
                    <div className="p-2 rounded bg-gold/10 text-gold shrink-0 mt-0.5">
                      <BookOpen size={16} />
                    </div>
                    <div>
                      <h4 className="text-xs font-semibold text-white tracking-wide">
                        {t('Learn', 'শিক্ষা')}
                      </h4>
                      <p className="text-[11px] text-slate-400 mt-0.5 leading-snug">
                        {t('Accessible and affordable space-science education.', 'সহজ ও সাশ্রয়ী মহাকাশ বিজ্ঞান শিক্ষা।')}
                      </p>
                    </div>
                  </div>

                  <div className="p-3.5 rounded-sm bg-white/[0.02] border border-white/5 flex items-start gap-3">
                    <div className="p-2 rounded bg-gold/10 text-gold shrink-0 mt-0.5">
                      <Telescope size={16} />
                    </div>
                    <div>
                      <h4 className="text-xs font-semibold text-white tracking-wide">
                        {t('Explore', 'অনুসন্ধান')}
                      </h4>
                      <p className="text-[11px] text-slate-400 mt-0.5 leading-snug">
                        {t('Practical sky observation and interactive astronomy experiences.', 'টেলিস্কোপ দিয়ে আকাশ পর্যবেক্ষণ ও বাস্তবিক অভিজ্ঞতা।')}
                      </p>
                    </div>
                  </div>

                  <div className="p-3.5 rounded-sm bg-white/[0.02] border border-white/5 flex items-start gap-3">
                    <div className="p-2 rounded bg-gold/10 text-gold shrink-0 mt-0.5">
                      <Compass size={16} />
                    </div>
                    <div>
                      <h4 className="text-xs font-semibold text-white tracking-wide">
                        {t('Discover', 'আবিষ্কার')}
                      </h4>
                      <p className="text-[11px] text-slate-400 mt-0.5 leading-snug">
                        {t('Structured courses, workshops, and gamified educational tools.', 'অনলাইন কোর্স, ওয়ার্কশপ ও ডিজিটাল লার্নিং প্ল্যাটফর্ম।')}
                      </p>
                    </div>
                  </div>

                  <div className="p-3.5 rounded-sm bg-white/[0.02] border border-white/5 flex items-start gap-3">
                    <div className="p-2 rounded bg-gold/10 text-gold shrink-0 mt-0.5">
                      <Sparkles size={16} />
                    </div>
                    <div>
                      <h4 className="text-xs font-semibold text-white tracking-wide">
                        {t('Inspire', 'অনুপ্রেরণা')}
                      </h4>
                      <p className="text-[11px] text-slate-400 mt-0.5 leading-snug">
                        {t('Mentoring young minds and nurturing future space pioneers.', 'তরুণ শিক্ষার্থীদের বিজ্ঞানমনস্ক ও দক্ষ মানবসম্পদে রূপান্তর।')}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Mission Statement Card */}
              <div className="p-3.5 rounded-sm bg-gold/5 border border-gold/20 flex items-center gap-3">
                <Star size={18} className="text-gold shrink-0 fill-gold/20" />
                <p className="text-xs text-slate-200 leading-relaxed">
                  <span className="font-mono font-bold text-gold uppercase tracking-wider mr-1">
                    {t('Our Mission:', 'আমাদের লক্ষ্য:')}
                  </span>
                  {t(
                    'Making quality space-science education accessible and affordable for learners across Bangladesh.',
                    'সমগ্র বাংলাদেশের শিক্ষার্থীদের জন্য মানসম্মত মহাকাশ বিজ্ঞান শিক্ষাকে সহজলভ্য ও সাশ্রয়ী করা।'
                  )}
                </p>
              </div>

              {/* Official Social / Media Links */}
              <div>
                <h3 className="text-[11px] font-mono font-bold uppercase tracking-wider text-gold mb-3">
                  {t('Connect With Us', 'যোগাযোগ ও সামাজিক মাধ্যম')}
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5">
                  {/* Website */}
                  <a
                    href="https://astronomypathshala.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2.5 rounded-sm bg-white/[0.02] hover:bg-gold/10 border border-white/10 hover:border-gold/50 flex items-center justify-between text-xs text-slate-200 hover:text-gold transition-colors group cursor-pointer"
                  >
                    <div className="flex items-center gap-2">
                      <Globe size={15} className="text-gold" />
                      <span className="font-medium">Website</span>
                    </div>
                    <ExternalLink size={12} className="text-slate-500 group-hover:text-gold transition-colors" />
                  </a>

                  {/* Facebook Page */}
                  <a
                    href="https://www.facebook.com/astronomypathshala"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2.5 rounded-sm bg-white/[0.02] hover:bg-blue-600/10 border border-white/10 hover:border-blue-500/50 flex items-center justify-between text-xs text-slate-200 hover:text-blue-400 transition-colors group cursor-pointer"
                  >
                    <div className="flex items-center gap-2">
                      <Facebook size={15} className="text-blue-400" />
                      <span className="font-medium">Facebook Page</span>
                    </div>
                    <ExternalLink size={12} className="text-slate-500 group-hover:text-blue-400 transition-colors" />
                  </a>

                  {/* Facebook Group */}
                  <a
                    href="https://www.facebook.com/groups/1682010375163061"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2.5 rounded-sm bg-white/[0.02] hover:bg-blue-600/10 border border-white/10 hover:border-blue-500/50 flex items-center justify-between text-xs text-slate-200 hover:text-blue-400 transition-colors group cursor-pointer"
                  >
                    <div className="flex items-center gap-2">
                      <Users size={15} className="text-blue-400" />
                      <span className="font-medium">Facebook Group</span>
                    </div>
                    <ExternalLink size={12} className="text-slate-500 group-hover:text-blue-400 transition-colors" />
                  </a>

                  {/* YouTube */}
                  <a
                    href="https://youtube.com/@astronomypathshalaofficial"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2.5 rounded-sm bg-white/[0.02] hover:bg-red-600/10 border border-white/10 hover:border-red-500/50 flex items-center justify-between text-xs text-slate-200 hover:text-red-400 transition-colors group cursor-pointer"
                  >
                    <div className="flex items-center gap-2">
                      <Youtube size={15} className="text-red-400" />
                      <span className="font-medium">YouTube</span>
                    </div>
                    <ExternalLink size={12} className="text-slate-500 group-hover:text-red-400 transition-colors" />
                  </a>

                  {/* Instagram */}
                  <a
                    href="https://www.instagram.com/astronomypathshala"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2.5 rounded-sm bg-white/[0.02] hover:bg-pink-600/10 border border-white/10 hover:border-pink-500/50 flex items-center justify-between text-xs text-slate-200 hover:text-pink-400 transition-colors group cursor-pointer"
                  >
                    <div className="flex items-center gap-2">
                      <Instagram size={15} className="text-pink-400" />
                      <span className="font-medium">Instagram</span>
                    </div>
                    <ExternalLink size={12} className="text-slate-500 group-hover:text-pink-400 transition-colors" />
                  </a>
                </div>
              </div>
            </div>
          ) : (
            <div id="credits-section" className="space-y-6">
              {/* Header */}
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-sm bg-gold/10 text-gold border border-gold/20 shrink-0">
                  <Rocket size={22} />
                </div>
                <div>
                  <h2 className="text-2xl font-serif italic text-white font-medium">
                    AP Galaxy Explorer
                  </h2>
                  <p className="text-xs text-gold font-mono uppercase tracking-[0.2em]">
                    {t('Mission Credits & Attributions', 'মিশন কৃতজ্ঞতা ও স্বীকৃতি')}
                  </p>
                </div>
              </div>

              {/* Primary Credit: Game Lead Developer */}
              <div className="p-4 md:p-5 rounded-sm bg-gold/5 border border-gold/30 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono font-bold uppercase tracking-[0.25em] text-gold">
                    {t('Game Lead Developer', 'গেম লিড ডেভেলপার')}
                  </span>
                  <div className="flex items-center gap-1 text-[10px] font-mono text-gold/70">
                    <Sparkles size={11} className="text-gold" />
                    <span>Lead Architect</span>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg md:text-xl font-bold text-white font-serif tracking-wide">
                    Md. Fahim Ahmed
                  </h3>
                  <p className="text-xs text-slate-300 font-mono mt-0.5">
                    COO, Astronomy Pathshala
                  </p>
                </div>

                {/* Developer Profile Links */}
                <div className="flex flex-wrap items-center gap-3 pt-2">
                  <a
                    href="https://www.linkedin.com/in/fahim-ahmed12"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-3 py-1.5 rounded-sm bg-blue-600/10 hover:bg-blue-600/20 border border-blue-500/30 hover:border-blue-500 text-blue-300 text-xs font-mono font-medium transition-colors group cursor-pointer"
                  >
                    <Linkedin size={14} className="text-blue-400" />
                    <span>LinkedIn</span>
                    <ExternalLink size={11} className="text-blue-400/60 group-hover:text-blue-300" />
                  </a>

                  <a
                    href="https://github.com/FahimAhmed121"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-3 py-1.5 rounded-sm bg-white/5 hover:bg-white/10 border border-white/20 hover:border-white/40 text-slate-200 text-xs font-mono font-medium transition-colors group cursor-pointer"
                  >
                    <Github size={14} className="text-slate-300" />
                    <span>GitHub</span>
                    <ExternalLink size={11} className="text-slate-400 group-hover:text-slate-200" />
                  </a>
                </div>
              </div>

              {/* Organization & Team Acknowledgements */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {/* Organization */}
                <div className="p-3.5 rounded-sm bg-white/[0.02] border border-white/5 space-y-1">
                  <div className="flex items-center gap-2 text-gold text-xs font-mono font-bold uppercase tracking-wider">
                    <Star size={13} />
                    <span>Astronomy Pathshala</span>
                  </div>
                  <p className="text-[11px] text-slate-300 leading-relaxed">
                    {t(
                      'The educational organization behind AP Galaxy Explorer, pioneering accessible space-science learning.',
                      'মহাকাশ বিজ্ঞান শিক্ষাকে সহজলভ্য ও আকর্ষণীয় করতে নিবেদিত শিক্ষামূলক প্রতিষ্ঠান।'
                    )}
                  </p>
                </div>

                {/* Educational Content & Science */}
                <div className="p-3.5 rounded-sm bg-white/[0.02] border border-white/5 space-y-1">
                  <div className="flex items-center gap-2 text-gold text-xs font-mono font-bold uppercase tracking-wider">
                    <Atom size={13} />
                    <span>{t('Science & Pedagogy', 'বিজ্ঞান ও গবেষণা')}</span>
                  </div>
                  <p className="text-[11px] text-slate-300 leading-relaxed">
                    {t(
                      'Curated astrophysical datasets, spectroscopic facts, and interactive quiz challenges checked for scientific rigor.',
                      'যাচাইকৃত জ্যোতির্বিজ্ঞান তথ্য, বর্ণালী মান ও কুইজ মডিউল।'
                    )}
                  </p>
                </div>
              </div>

              {/* Media & Astronomical Imagery Credits */}
              <div className="p-3.5 rounded-sm bg-white/[0.02] border border-white/5 space-y-1.5">
                <div className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400">
                  {t('Astrophysical Imagery & Media Attributions', 'মহাকাশ চিত্র ও তথ্য স্বীকৃতি')}
                </div>
                <p className="text-[11px] text-slate-300 leading-relaxed">
                  Deep-space galaxy imagery, morphological classifications, and astrophysical distance data courtesy of <strong className="text-slate-100">NASA</strong>, <strong className="text-slate-100">ESA</strong>, <strong className="text-slate-100">CSA</strong>, and the <strong className="text-slate-100">Space Telescope Science Institute (STScI)</strong> via Hubble Space Telescope & James Webb Space Telescope public archives.
                </p>
              </div>

              {/* Technology Stack */}
              <div className="p-3 rounded-sm bg-black/60 border border-white/10 text-center">
                <p className="text-[11px] text-slate-400 font-mono">
                  {t('Built with', 'নির্মিত হয়েছে')}: <span className="text-slate-200 font-medium">Phaser • React • TypeScript • Zustand • Tailwind CSS • Vite</span>
                </p>
              </div>

              {/* Feedback & Bug Reporting */}
              <div className="p-3.5 rounded-sm bg-cyan-950/20 border border-cyan-500/20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
                <div className="space-y-0.5">
                  <div className="flex items-center gap-1.5 text-cyan-300 font-mono font-bold text-[11px] uppercase tracking-wider">
                    <Mail size={13} />
                    <span>{t('Suggestions & Bug Reports', 'মতামত বা ত্রুটি প্রতিবেদন')}</span>
                  </div>
                  <p className="text-[10px] text-slate-400 font-mono">
                    Subject format: <span className="text-cyan-200">[AP Galaxy Explorer] Suggestion / Bug - &lt;Topic&gt;</span>
                  </p>
                </div>

                <a
                  href="mailto:astronomypathshalateam@gmail.com?subject=%5BAP%20Galaxy%20Explorer%5D%20Suggestion%20%2F%20Bug%20Report"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/40 text-cyan-300 hover:text-cyan-200 rounded-sm font-mono text-[11px] transition-colors shrink-0 cursor-pointer"
                >
                  <Mail size={12} />
                  <span>astronomypathshalateam@gmail.com</span>
                </a>
              </div>
            </div>
          )}
        </div>

        {/* Bottom Modal Actions */}
        <div className="p-4 md:px-8 border-t border-white/10 bg-black/40 flex justify-end shrink-0">
          <button
            id="modal-close-action"
            onClick={onClose}
            className="px-5 py-2 text-xs font-mono font-bold uppercase tracking-wider rounded-sm bg-white/5 border border-white/10 hover:border-gold hover:text-gold text-slate-200 transition-colors cursor-pointer"
          >
            {t('Close', 'বন্ধ করুন')}
          </button>
        </div>
      </div>
    </div>
  );
}

