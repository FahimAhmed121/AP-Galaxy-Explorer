import React, { useEffect, useState } from 'react';
import { Sparkles, Radio, CheckCircle2, ShieldCheck, Compass, Eye, Volume2, Cpu } from 'lucide-react';
import { Galaxy } from '../../core/types';
import { eventBus } from '../../core/events';

export const DiscoveryOverlay: React.FC = () => {
  const [activeGalaxy, setActiveGalaxy] = useState<Galaxy | null>(null);
  const [auraText, setAuraText] = useState<string>('');
  const [stage, setStage] = useState<'HIDDEN' | 'STARTED' | 'AURA' | 'READY'>('HIDDEN');

  useEffect(() => {
    const handleStarted = (payload: { galaxyId: string; galaxyName: string; galaxyData: Galaxy }) => {
      setActiveGalaxy(payload.galaxyData);
      setAuraText(`Initiating high-resolution spectrographic analysis of ${payload.galaxyName}...`);
      setStage('STARTED');
    };

    const handleOverlayShown = (payload: { galaxyData: Galaxy; auraText: string }) => {
      setActiveGalaxy(payload.galaxyData);
      setAuraText(payload.auraText);
      setStage('AURA');
    };

    const handleReady = (payload: { galaxyData: Galaxy }) => {
      setActiveGalaxy(payload.galaxyData);
      setStage('READY');
    };

    const handleFinished = () => {
      setStage('HIDDEN');
      setActiveGalaxy(null);
      setAuraText('');
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

  if (stage === 'HIDDEN' || !activeGalaxy) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-40 pointer-events-none flex flex-col justify-between p-6 md:p-10 select-none font-sans">
      
      {/* 1. TOP NASA MISSION CONTROL STATUS BAR */}
      <div className="flex items-center justify-between w-full max-w-5xl mx-auto">
        <div className="flex items-center gap-3 px-4 py-2 rounded bg-slate-950/85 border border-cyan-500/40 backdrop-blur-md shadow-xl text-cyan-400 font-mono text-xs tracking-wider animate-pulse">
          <Radio size={16} className="text-cyan-400 animate-spin" />
          <span className="font-bold uppercase">AURA DEEP-SPACE LINK ACTIVE</span>
          <span className="text-slate-500">|</span>
          <span className="text-emerald-400">CH-9.4 GHz</span>
        </div>

        <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded bg-black/80 border border-slate-700/60 text-slate-400 font-mono text-[11px] backdrop-blur-md">
          <Eye size={13} className="text-slate-400" />
          <span>PRESS <kbd className="px-1.5 py-0.5 rounded bg-slate-800 text-cyan-300 border border-slate-600 font-bold">ESC</kbd> TO SKIP CINEMATIC</span>
        </div>
      </div>

      {/* 2. CENTER-BOTTOM AURA HOLOGRAPHIC ASSISTANT & GALAXY SPEC CARD */}
      <div className="w-full max-w-4xl mx-auto flex flex-col md:flex-row items-stretch gap-4 pointer-events-auto transition-all duration-500">
        
        {/* A. AURA Holographic Avatar Panel */}
        <div className="flex-1 p-5 rounded-lg bg-slate-950/90 border border-cyan-500/30 shadow-2xl backdrop-blur-xl flex items-start gap-4 relative overflow-hidden">
          {/* Background scanlines */}
          <div className="absolute inset-0 bg-[linear-gradient(rgba(56,189,248,0.03)_1px,transparent_1px)] bg-[size:100%_4px] pointer-events-none" />

          {/* Hologram Circle Icon */}
          <div className="relative flex-shrink-0 w-14 h-14 rounded-full bg-cyan-950/60 border-2 border-cyan-400/80 flex items-center justify-center text-cyan-300 shadow-lg shadow-cyan-500/20">
            <Cpu size={28} className="animate-pulse" />
            <div className="absolute inset-0 rounded-full border border-cyan-400 animate-ping opacity-30" />
          </div>

          {/* Dialogue Body */}
          <div className="space-y-1.5 z-10">
            <div className="flex items-center gap-2 text-[10px] font-mono text-cyan-400 tracking-widest uppercase">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
              <span className="font-bold">AURA // RESEARCH ASSISTANT</span>
            </div>

            <p className="text-sm font-sans text-slate-200 leading-relaxed italic">
              "{auraText}"
            </p>

            <div className="pt-1 flex items-center gap-2 text-[10px] font-mono text-slate-400">
              <Volume2 size={12} className="text-cyan-400" />
              <span>SYNTHESIZING ASTROPHYSICAL METRICS</span>
            </div>
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
