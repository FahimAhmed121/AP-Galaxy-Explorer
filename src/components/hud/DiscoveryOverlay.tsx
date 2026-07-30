import React, { useEffect, useState } from 'react';
import { Sparkles, Radio, CheckCircle2, Eye, Volume2, Cpu, ChevronRight, ChevronLeft, ArrowRight, X } from 'lucide-react';
import { Galaxy } from '../../core/types';
import { eventBus } from '../../core/events';

export const DiscoveryOverlay: React.FC = () => {
  const [activeGalaxy, setActiveGalaxy] = useState<Galaxy | null>(null);
  const [auraDialoguePages, setAuraDialoguePages] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(0);
  const [stage, setStage] = useState<'HIDDEN' | 'STARTED' | 'AURA' | 'READY'>('HIDDEN');

  useEffect(() => {
    const handleStarted = (payload: { galaxyId: string; galaxyName: string; galaxyData: Galaxy }) => {
      setActiveGalaxy(payload.galaxyData);
      setAuraDialoguePages([
        `Target locked: ${payload.galaxyName}. Radio frequency lock confirmed on deep space channel 9.4 GHz.`,
        `Analyzing spectrographic emissions from constellation ${payload.galaxyData.constellation}... Classification verified as ${payload.galaxyData.type}.`,
        `Estimated distance: ${payload.galaxyData.distance}. Scientific briefing dossier is ready for review.`
      ]);
      setCurrentPage(0);
      setStage('STARTED');
    };

    const handleOverlayShown = (payload: { galaxyData: Galaxy; auraText: string }) => {
      setActiveGalaxy(payload.galaxyData);
      setAuraDialoguePages([
        `Discovery confirmed! We have successfully mapped ${payload.galaxyData.name}.`,
        `Spectrographic classification: ${payload.galaxyData.type}. Located in ${payload.galaxyData.constellation} at ${payload.galaxyData.distance}.`,
        payload.auraText,
        `Astronomy Pathshala NASA Briefing Dossier compiled. Click 'Continue to Briefing' to begin educational review.`
      ]);
      setCurrentPage(0);
      setStage('AURA');
    };

    const handleReady = (payload: { galaxyData: Galaxy }) => {
      setActiveGalaxy(payload.galaxyData);
      setStage('READY');
    };

    const handleFinished = () => {
      setStage('HIDDEN');
      setActiveGalaxy(null);
      setAuraDialoguePages([]);
      setCurrentPage(0);
    };

    eventBus.on('DISCOVERY_STARTED', handleStarted);
    eventBus.on('DISCOVERY_OVERLAY_SHOWN', handleOverlayShown);
    eventBus.on('DISCOVERY_READY', handleReady);
    eventBus.on('DISCOVERY_FINISHED', handleFinished);

    return () => {
      eventBus.off('DISCOVERY_STARTED', handleStarted);
      eventBus.off('DISCOVERY_OVERLAY_SHOWN', handleOverlayShown);
      eventBus.off('DISCOVERY_READY', handleReady);
      eventBus.off('DISCOVERY_FINISHED', handleFinished);
    };
  }, []);

  const handleNext = () => {
    if (currentPage < auraDialoguePages.length - 1) {
      setCurrentPage((prev) => prev + 1);
    } else {
      handleContinueToBriefing();
    }
  };

  const handlePrev = () => {
    if (currentPage > 0) {
      setCurrentPage((prev) => prev - 1);
    }
  };

  const handleSkip = () => {
    eventBus.emit('DISCOVERY_FINISHED', { galaxyId: activeGalaxy?.id });
    setStage('HIDDEN');
  };

  const handleContinueToBriefing = () => {
    if (activeGalaxy) {
      eventBus.emit('DISCOVERY_READY', { galaxyData: activeGalaxy });
      eventBus.emit('DISCOVERY_FINISHED', { galaxyId: activeGalaxy.id });
    }
    setStage('HIDDEN');
  };

  if (stage === 'HIDDEN' || !activeGalaxy) {
    return null;
  }

  const currentAuraText = auraDialoguePages[currentPage] || 'Synthesizing astrophysical metrics...';

  return (
    <div className="fixed inset-0 z-40 pointer-events-none flex flex-col justify-between p-6 md:p-10 select-none font-sans">
      
      {/* 1. TOP NASA MISSION CONTROL STATUS BAR */}
      <div className="flex items-center justify-between w-full max-w-5xl mx-auto">
        <div className="flex items-center gap-3 px-4 py-2 rounded bg-slate-950/85 border border-cyan-500/40 backdrop-blur-md shadow-xl text-cyan-400 font-mono text-xs tracking-wider animate-pulse pointer-events-auto">
          <Radio size={16} className="text-cyan-400 animate-spin" />
          <span className="font-bold uppercase">AURA DEEP-SPACE LINK ACTIVE</span>
          <span className="text-slate-500">|</span>
          <span className="text-emerald-400">CH-9.4 GHz</span>
        </div>

        <button
          onClick={handleSkip}
          className="pointer-events-auto flex items-center gap-2 px-3 py-1.5 rounded bg-red-950/80 hover:bg-red-900 border border-red-500/40 text-red-300 font-mono text-[11px] backdrop-blur-md transition-all cursor-pointer"
        >
          <X size={13} />
          <span>SKIP CINEMATIC (ESC)</span>
        </button>
      </div>

      {/* 2. CENTER-BOTTOM AURA HOLOGRAPHIC ASSISTANT & GALAXY SPEC CARD */}
      <div className="w-full max-w-4xl mx-auto flex flex-col md:flex-row items-stretch gap-4 pointer-events-auto transition-all duration-500">
        
        {/* A. AURA Holographic Avatar Panel & Dialogue Controls */}
        <div className="flex-1 p-5 rounded-lg bg-slate-950/90 border border-cyan-500/30 shadow-2xl backdrop-blur-xl flex flex-col justify-between relative overflow-hidden min-h-[180px]">
          {/* Background scanlines */}
          <div className="absolute inset-0 bg-[linear-gradient(rgba(56,189,248,0.03)_1px,transparent_1px)] bg-[size:100%_4px] pointer-events-none" />

          <div className="flex items-start gap-4 z-10">
            {/* Hologram Circle Icon */}
            <div className="relative flex-shrink-0 w-12 h-12 rounded-full bg-cyan-950/60 border-2 border-cyan-400/80 flex items-center justify-center text-cyan-300 shadow-lg shadow-cyan-500/20">
              <Cpu size={24} className="animate-pulse" />
              <div className="absolute inset-0 rounded-full border border-cyan-400 animate-ping opacity-30" />
            </div>

            {/* Dialogue Body */}
            <div className="space-y-1.5 z-10 flex-1">
              <div className="flex items-center justify-between text-[10px] font-mono text-cyan-400 tracking-widest uppercase">
                <div className="flex items-center gap-2 font-bold">
                  <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
                  <span>AURA // RESEARCH ASSISTANT</span>
                </div>
                <span className="text-slate-400">
                  {currentPage + 1} / {auraDialoguePages.length}
                </span>
              </div>

              <p className="text-sm font-sans text-slate-100 leading-relaxed italic">
                "{currentAuraText}"
              </p>
            </div>
          </div>

          {/* Player-Controlled Progression Buttons (Next, Prev, Skip, Continue) */}
          <div className="pt-3 border-t border-cyan-900/40 flex items-center justify-between z-10 text-xs font-mono">
            <div className="flex items-center gap-2">
              <button
                onClick={handlePrev}
                disabled={currentPage === 0}
                className="px-2.5 py-1 rounded bg-slate-900 border border-slate-700 text-slate-300 hover:bg-slate-800 disabled:opacity-40 disabled:pointer-events-none flex items-center gap-1 cursor-pointer"
              >
                <ChevronLeft size={14} />
                <span>PREV</span>
              </button>
              <button
                onClick={handleNext}
                disabled={currentPage >= auraDialoguePages.length - 1}
                className="px-2.5 py-1 rounded bg-cyan-950 border border-cyan-600 text-cyan-300 hover:bg-cyan-900 disabled:opacity-40 disabled:pointer-events-none flex items-center gap-1 cursor-pointer"
              >
                <span>NEXT</span>
                <ChevronRight size={14} />
              </button>
            </div>

            <button
              onClick={handleContinueToBriefing}
              className="px-3 py-1.5 rounded bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold flex items-center gap-1.5 shadow-lg shadow-emerald-950/50 cursor-pointer"
            >
              <span>CONTINUE TO BRIEFING</span>
              <ArrowRight size={14} />
            </button>
          </div>

        </div>

        {/* B. Discovered Galaxy Metadata Overlay */}
        <div className="flex-1 p-5 rounded-lg bg-slate-950/90 border border-emerald-500/40 shadow-2xl backdrop-blur-xl relative overflow-hidden flex flex-col justify-between">
          <div className="space-y-2">
            <div className="flex items-center justify-between border-b border-emerald-500/20 pb-2">
              <div className="flex items-center gap-1.5 text-[10px] font-mono text-emerald-400 uppercase tracking-widest font-bold">
                <CheckCircle2 size={13} className="text-emerald-400" />
                <span>DISCOVERY CONFIRMED</span>
              </div>
              <span className="text-[10px] font-mono text-slate-500">SECTOR VALIDATED</span>
            </div>

            <div className="pt-1">
              <h2 className="text-xl md:text-2xl font-serif italic font-bold text-white tracking-wide">
                {activeGalaxy.name}
              </h2>
              <p className="text-xs font-mono text-cyan-400 uppercase tracking-wider mt-0.5">
                {activeGalaxy.type}
              </p>
            </div>

            {/* NASA Spec Grid */}
            <div className="grid grid-cols-2 gap-2 pt-2 text-xs font-mono">
              <div className="p-2 rounded bg-black/40 border border-slate-800">
                <span className="text-[9px] text-slate-400 uppercase block">CONSTELLATION</span>
                <span className="text-slate-200 font-bold truncate block">{activeGalaxy.constellation}</span>
              </div>
              <div className="p-2 rounded bg-black/40 border border-slate-800">
                <span className="text-[9px] text-slate-400 uppercase block">DISTANCE FROM EARTH</span>
                <span className="text-emerald-400 font-bold truncate block">{activeGalaxy.distance}</span>
              </div>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
};

export default DiscoveryOverlay;
