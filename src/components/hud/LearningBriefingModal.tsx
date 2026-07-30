import React, { useEffect, useState, useCallback } from 'react';
import {
  BookOpen,
  ChevronLeft,
  ChevronRight,
  Cpu,
  CheckCircle,
  Radio,
  X,
  Volume2,
  Sparkles,
  Compass,
  Layers,
  Image as ImageIcon,
  Activity,
  Award,
} from 'lucide-react';
import { Galaxy } from '../../core/types';
import { EducationalContent, LearningCard } from '../../data/educational/types';
import { eventBus } from '../../core/events';
import { quizController } from '../../phaser/systems/QuizController';

export const LearningBriefingModal: React.FC = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [content, setContent] = useState<EducationalContent | null>(null);
  const [activeCardIndex, setActiveCardIndex] = useState<number>(0);

  useEffect(() => {
    const handleStarted = (payload: { galaxyId: string; galaxyName: string; totalCards: number; content: EducationalContent }) => {
      setContent(payload.content);
      setActiveCardIndex(0);
      setIsOpen(true);
    };

    const handleCardChanged = (payload: { currentCardIndex: number }) => {
      setActiveCardIndex(payload.currentCardIndex);
    };

    const handleCompleted = () => {
      setIsOpen(false);
      setContent(null);
      setActiveCardIndex(0);
    };

    eventBus.on('LEARNING_STARTED', handleStarted);
    eventBus.on('LEARNING_CARD_CHANGED', handleCardChanged);
    eventBus.on('LEARNING_COMPLETED', handleCompleted);

    return () => {
      eventBus.off('LEARNING_STARTED', handleStarted);
      eventBus.off('LEARNING_CARD_CHANGED', handleCardChanged);
      eventBus.off('LEARNING_COMPLETED', handleCompleted);
    };
  }, []);

  const handleNext = useCallback(() => {
    if (!content) return;
    if (activeCardIndex < content.cards.length - 1) {
      const nextIdx = activeCardIndex + 1;
      setActiveCardIndex(nextIdx);
      const total = content.cards.length;
      eventBus.emit('LEARNING_CARD_CHANGED', {
        galaxyId: content.galaxyId,
        currentCardIndex: nextIdx,
        totalCards: total,
        progressPercentage: Math.round(((nextIdx + 1) / total) * 100),
      });
    } else {
      handleComplete();
    }
  }, [content, activeCardIndex]);

  const handlePrev = useCallback(() => {
    if (!content || activeCardIndex === 0) return;
    const prevIdx = activeCardIndex - 1;
    setActiveCardIndex(prevIdx);
    const total = content.cards.length;
    eventBus.emit('LEARNING_CARD_CHANGED', {
      galaxyId: content.galaxyId,
      currentCardIndex: prevIdx,
      totalCards: total,
      progressPercentage: Math.round(((prevIdx + 1) / total) * 100),
    });
  }, [content, activeCardIndex]);

  const handleComplete = useCallback(() => {
    if (!content) return;
    const galaxyData: Galaxy = {
      id: content.galaxyId,
      name: content.galaxyName,
      type: content.structure,
      distance: content.distance,
      diameter: content.diameter,
      constellation: content.constellation,
      age: content.age,
      description: content.overview,
      funFacts: content.funFacts,
      visualColor: '#00d2ff',
      iconStyle: 'spiral',
      x: 0,
      y: 0,
      radius: 100,
      quizzes: [],
    };

    eventBus.emit('LEARNING_COMPLETED', {
      galaxyId: content.galaxyId,
      galaxyData,
      timeSpentSeconds: 15,
    });

    setIsOpen(false);

    // Transition smoothly into AURA Assessment
    quizController.startQuiz(galaxyData);
  }, [content]);

  // Keyboard navigation
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' || e.key === ' ' || e.key === 'd') {
        e.preventDefault();
        handleNext();
      } else if (e.key === 'ArrowLeft' || e.key === 'a') {
        e.preventDefault();
        handlePrev();
      } else if (e.key === 'Escape') {
        e.preventDefault();
        handleComplete();
      } else if (e.key === 'Enter' && content && activeCardIndex === content.cards.length - 1) {
        e.preventDefault();
        handleComplete();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, handleNext, handlePrev, handleComplete, content, activeCardIndex]);

  if (!isOpen || !content) return null;

  const currentCard: LearningCard = content.cards[activeCardIndex] || content.cards[0];
  const totalCards = content.cards.length;
  const progressPercentage = Math.round(((activeCardIndex + 1) / totalCards) * 100);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-8 bg-slate-950/90 backdrop-blur-2xl select-none font-sans overflow-y-auto">
      
      {/* Container Frame */}
      <div className="w-full max-w-5xl rounded-xl bg-slate-900/95 border border-cyan-500/40 shadow-2xl flex flex-col overflow-hidden relative text-slate-100 my-auto">
        
        {/* Background Tech Scanline Effect */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(56,189,248,0.02)_1px,transparent_1px)] bg-[size:100%_4px] pointer-events-none" />

        {/* 1. TOP HEADER - NASA MISSION CONTROL TITLE & AURA STATUS */}
        <div className="flex items-center justify-between px-6 py-4 bg-slate-950/80 border-b border-cyan-500/30">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-cyan-950/80 border border-cyan-400/60 flex items-center justify-center text-cyan-300 shadow-md">
              <BookOpen size={20} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono uppercase tracking-widest text-cyan-400 font-bold">NASA SCIENTIFIC BRIEFING</span>
                <span className="text-xs text-slate-600">/</span>
                <span className="text-[10px] font-mono text-emerald-400 uppercase">CLASSIFIED RESEARCH</span>
              </div>
              <h1 className="text-lg md:text-xl font-serif italic font-bold text-white tracking-wide">
                {content.galaxyName}
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded bg-cyan-950/40 border border-cyan-500/30 text-cyan-300 font-mono text-xs">
              <Radio size={14} className="animate-pulse text-cyan-400" />
              <span>AURA BRIEFING ACTIVE</span>
            </div>

            <button
              onClick={handleComplete}
              className="p-2 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors border border-slate-700"
              title="Close Briefing (Esc)"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* 2. MAIN BODY - AURA ASSISTANT HEADER + CARD CONTENT */}
        <div className="p-6 md:p-8 space-y-6 flex-1 overflow-y-auto">
          
          {/* A. AURA Dialogue & Holographic Panel */}
          <div className="p-4 rounded-lg bg-cyan-950/30 border border-cyan-500/30 flex items-start gap-4 relative overflow-hidden backdrop-blur-sm">
            <div className="relative flex-shrink-0 w-12 h-12 rounded-full bg-cyan-900/60 border border-cyan-400 flex items-center justify-center text-cyan-300 shadow-lg">
              <Cpu size={24} className="animate-pulse" />
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-[10px] font-mono text-cyan-400 tracking-wider uppercase font-bold">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping" />
                <span>AURA RESEARCH ASSISTANT // BRIEFING PROTOCOL</span>
              </div>
              <p className="text-xs md:text-sm text-slate-200 italic font-sans">
                "{content.auraIntro}"
              </p>
            </div>
          </div>

          {/* B. Active Learning Card Area */}
          <div className="p-6 md:p-8 rounded-xl bg-slate-950/70 border border-slate-800 shadow-inner space-y-6 relative">
            
            {/* Card Category & Title Header */}
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div className="space-y-1">
                <span className="px-2.5 py-1 rounded bg-cyan-950/80 border border-cyan-500/40 text-cyan-400 font-mono text-[10px] uppercase tracking-wider font-bold">
                  CARD {activeCardIndex + 1} OF {totalCards} : {currentCard.category}
                </span>
                <h2 className="text-xl md:text-2xl font-serif italic font-bold text-white mt-1">
                  {currentCard.title}
                </h2>
                <p className="text-xs font-mono text-slate-400">
                  {currentCard.subtitle}
                </p>
              </div>

              <div className="text-right font-mono text-xs text-slate-400">
                <span className="text-cyan-400 font-bold">{progressPercentage}%</span>
                <span className="block text-[10px] text-slate-500">COMPLETED</span>
              </div>
            </div>

            {/* Active Learning Card Grid: 2-Column Desktop (40% Telescope Visual Showcase + 60% Narrative Content) */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
              
              {/* Left Column: 40-50% Large Scientific Image Showcase Area */}
              <div className="lg:col-span-5 flex flex-col justify-between rounded-xl bg-slate-950 border border-cyan-500/30 overflow-hidden relative min-h-[260px] lg:min-h-[340px] p-4 group">
                
                {/* Telescope Optics Grid Overlay */}
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-cyan-950/40 via-slate-950/80 to-slate-950 pointer-events-none" />
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#0284c710_1px,transparent_1px),linear-gradient(to_bottom,#0284c710_1px,transparent_1px)] bg-[size:16px_16px] pointer-events-none" />
                
                {/* Top Badge: Telescope Observatory Identification */}
                <div className="relative z-10 flex items-center justify-between font-mono text-[10px]">
                  <div className="flex items-center gap-1.5 px-2 py-1 rounded bg-black/80 border border-cyan-500/50 text-cyan-300 font-bold uppercase tracking-wider">
                    <Sparkles size={11} className="text-cyan-400 animate-pulse" />
                    <span>
                      {activeCardIndex % 2 === 0 ? 'NASA / JWST NIRCam' : 'HUBBLE ACS / WFC3'}
                    </span>
                  </div>
                  <span className="text-emerald-400 bg-emerald-950/60 px-1.5 py-0.5 rounded border border-emerald-500/30 text-[9px]">
                    SPECTRAL LOCK
                  </span>
                </div>

                {/* Central Visual Image Display */}
                <div className="relative z-10 my-auto flex flex-col items-center justify-center text-center p-2">
                  {currentCard.visualPlaceholder?.url ? (
                    <div className="relative w-full h-44 rounded-lg overflow-hidden border border-cyan-500/30 shadow-2xl">
                      <img
                        src={currentCard.visualPlaceholder.url}
                        alt={currentCard.title}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none" />
                    </div>
                  ) : (
                    /* Stylized Deep-Space Graphic Viewport */
                    <div className="relative w-full h-44 rounded-lg bg-gradient-to-br from-indigo-950 via-slate-900 to-cyan-950 border border-cyan-500/30 flex items-center justify-center overflow-hidden shadow-inner">
                      {/* Rotating Optics Reticle */}
                      <div className="absolute w-32 h-32 rounded-full border border-dashed border-cyan-400/40 animate-[spin_20s_linear_infinite]" />
                      <div className="absolute w-20 h-20 rounded-full border border-cyan-500/60 animate-ping opacity-25" />
                      
                      <div className="relative z-10 flex flex-col items-center gap-2 p-3">
                        <div className="p-3 rounded-full bg-cyan-950/80 border border-cyan-400 text-cyan-300 shadow-lg shadow-cyan-500/30">
                          <ImageIcon size={28} />
                        </div>
                        <span className="text-xs font-mono font-bold text-white tracking-wider">
                          {currentCard.visualPlaceholder?.title || `${content.galaxyName} Telescope Scan`}
                        </span>
                      </div>
                    </div>
                  )}

                  <p className="mt-2 text-[11px] font-sans italic text-slate-300 leading-snug">
                    "{currentCard.visualPlaceholder?.caption || `Deep-space optical capture of ${content.galaxyName}.`}"
                  </p>
                </div>

                {/* Bottom Telemetry Bar */}
                <div className="relative z-10 pt-2 border-t border-slate-800/80 flex items-center justify-between text-[9px] font-mono text-slate-400">
                  <div className="flex items-center gap-1 text-cyan-400">
                    <Activity size={10} />
                    <span>WAVELENGTH: 0.6µm - 2.0µm</span>
                  </div>
                  <span>SOURCE: STScI / NASA Archive</span>
                </div>
              </div>

              {/* Right Column: 50-60% Educational Narrative & Metrics */}
              <div className="lg:col-span-7 flex flex-col justify-between space-y-4">
                
                {/* Main Narrative Text */}
                <p className="text-sm md:text-base text-slate-200 leading-relaxed font-sans">
                  {currentCard.body}
                </p>

                {/* Key Metrics Grid */}
                {currentCard.keyMetrics && currentCard.keyMetrics.length > 0 && (
                  <div className="grid grid-cols-2 gap-2.5 pt-1">
                    {currentCard.keyMetrics.map((metric, idx) => (
                      <div key={idx} className="p-2.5 rounded-lg bg-black/60 border border-slate-800 space-y-0.5">
                        <span className="text-[9px] font-mono text-slate-400 uppercase tracking-wider block">{metric.label}</span>
                        <span className="text-xs font-mono font-bold text-cyan-300 block truncate">{metric.value}</span>
                      </div>
                    ))}
                  </div>
                )}

                {/* Bullet Points List */}
                {currentCard.bulletPoints && currentCard.bulletPoints.length > 0 && (
                  <div className="space-y-1.5 pt-1">
                    <span className="text-[10px] font-mono text-cyan-400 uppercase tracking-widest block font-bold">
                      KEY ASTROPHYSICAL FINDINGS:
                    </span>
                    <ul className="space-y-1.5 text-xs md:text-sm text-slate-300 font-sans">
                      {currentCard.bulletPoints.map((pt, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 mt-1.5 flex-shrink-0" />
                          <span>{pt}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

              </div>

            </div>

          </div>

        </div>

        {/* 3. FOOTER - PROGRESS BAR & NAVIGATION CONTROLS */}
        <div className="px-6 py-4 bg-slate-950/90 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
          
          {/* Progress Indicator Dots & Bar */}
          <div className="flex items-center gap-4 w-full sm:w-auto">
            <div className="flex items-center gap-1.5">
              {content.cards.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setActiveCardIndex(idx);
                    eventBus.emit('LEARNING_CARD_CHANGED', {
                      galaxyId: content.galaxyId,
                      currentCardIndex: idx,
                      totalCards,
                      progressPercentage: Math.round(((idx + 1) / totalCards) * 100),
                    });
                  }}
                  className={`h-2 rounded-full transition-all ${
                    idx === activeCardIndex
                      ? 'w-6 bg-cyan-400 shadow-sm shadow-cyan-400'
                      : idx < activeCardIndex
                      ? 'w-2 bg-emerald-400'
                      : 'w-2 bg-slate-800'
                  }`}
                  title={`Card ${idx + 1}`}
                />
              ))}
            </div>

            <span className="text-xs font-mono text-slate-400 whitespace-nowrap">
              {activeCardIndex + 1} / {totalCards} Cards
            </span>
          </div>

          {/* Navigation Action Buttons */}
          <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
            <button
              onClick={handlePrev}
              disabled={activeCardIndex === 0}
              className={`px-4 py-2 rounded-lg font-mono text-xs flex items-center gap-1.5 border transition-all ${
                activeCardIndex === 0
                  ? 'opacity-40 cursor-not-allowed border-slate-800 text-slate-600'
                  : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border-slate-700'
              }`}
            >
              <ChevronLeft size={16} />
              <span>PREVIOUS</span>
            </button>

            {activeCardIndex < totalCards - 1 ? (
              <button
                onClick={handleNext}
                className="px-5 py-2 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-mono text-xs font-bold flex items-center gap-1.5 shadow-lg shadow-cyan-500/20 transition-all"
              >
                <span>NEXT CARD</span>
                <ChevronRight size={16} />
              </button>
            ) : (
              <button
                onClick={handleComplete}
                className="px-6 py-2.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-mono text-xs font-bold flex items-center gap-2 shadow-lg shadow-emerald-500/20 transition-all animate-pulse"
              >
                <CheckCircle size={16} />
                <span>COMPLETE BRIEFING</span>
              </button>
            )}
          </div>

        </div>

      </div>

    </div>
  );
};

export default LearningBriefingModal;
