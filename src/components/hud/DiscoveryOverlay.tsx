import React, { useEffect, useState, useRef, useCallback } from 'react';
import { Sparkles, CheckCircle2, ArrowRight, X } from 'lucide-react';
import { Galaxy } from '../../core/types';
import { eventBus } from '../../core/events';
import { logger } from '../../core/logger';

export const DiscoveryOverlay: React.FC = () => {
  const [activeGalaxy, setActiveGalaxy] = useState<Galaxy | null>(null);
  const [isVisible, setIsVisible] = useState<boolean>(false);

  // Refs to eliminate stale closures and ensure event safety
  const activeGalaxyRef = useRef<Galaxy | null>(null);
  const autoDismissTimerRef = useRef<NodeJS.Timeout | null>(null);
  const hasEmittedFinishedRef = useRef<boolean>(false);

  // Helper to clear any active auto-dismiss timer
  const clearTimer = useCallback(() => {
    if (autoDismissTimerRef.current) {
      clearTimeout(autoDismissTimerRef.current);
      autoDismissTimerRef.current = null;
    }
  }, []);

  // Centralized, deterministic event emitter that guarantees DISCOVERY_FINISHED is emitted exactly once
  const finishDiscovery = useCallback((galaxy: Galaxy, triggerBriefing: boolean) => {
    clearTimer();

    if (triggerBriefing) {
      logger.info(`DiscoveryOverlay: Emitting DISCOVERY_READY for [${galaxy.name}].`);
      eventBus.emit('DISCOVERY_READY', { galaxyData: galaxy });
    }

    if (!hasEmittedFinishedRef.current) {
      hasEmittedFinishedRef.current = true;
      logger.info(`DiscoveryOverlay: Emitting DISCOVERY_FINISHED for [${galaxy.name}].`);
      eventBus.emit('DISCOVERY_FINISHED', { galaxyId: galaxy.id });
    }

    setIsVisible(false);
    setActiveGalaxy(null);
    activeGalaxyRef.current = null;
  }, [clearTimer]);

  useEffect(() => {
    const handleOverlayShown = (payload: { galaxyData: Galaxy; auraText: string }) => {
      const galaxy = payload.galaxyData;
      if (!galaxy) return;

      logger.info(`DiscoveryOverlay: DISCOVERY_OVERLAY_SHOWN received for [${galaxy.name}].`);

      clearTimer();
      hasEmittedFinishedRef.current = false;

      // Update ref FIRST (synchronous) so callbacks access fresh reference
      activeGalaxyRef.current = galaxy;
      setActiveGalaxy(galaxy);
      setIsVisible(true);

      // Auto-dismiss after 3.2s: auto-triggers briefing & finishes discovery
      autoDismissTimerRef.current = setTimeout(() => {
        const currentGalaxy = activeGalaxyRef.current;
        if (currentGalaxy) {
          logger.info(`DiscoveryOverlay: Auto-dismiss timer (3.2s) expired for [${currentGalaxy.name}]. Triggering briefing.`);
          finishDiscovery(currentGalaxy, true);
        }
      }, 3200);
    };

    const handleStarted = (payload: { galaxyId: string; galaxyName: string; galaxyData: Galaxy }) => {
      const galaxy = payload.galaxyData;
      if (!galaxy) return;

      clearTimer();
      hasEmittedFinishedRef.current = false;

      activeGalaxyRef.current = galaxy;
      setActiveGalaxy(galaxy);
      setIsVisible(true);
    };

    const handleFinished = () => {
      clearTimer();
      hasEmittedFinishedRef.current = true;
      setIsVisible(false);
      setActiveGalaxy(null);
      activeGalaxyRef.current = null;
    };

    eventBus.on('DISCOVERY_OVERLAY_SHOWN', handleOverlayShown);
    eventBus.on('DISCOVERY_STARTED', handleStarted);
    eventBus.on('DISCOVERY_FINISHED', handleFinished);

    return () => {
      clearTimer();
      eventBus.off('DISCOVERY_OVERLAY_SHOWN', handleOverlayShown);
      eventBus.off('DISCOVERY_STARTED', handleStarted);
      eventBus.off('DISCOVERY_FINISHED', handleFinished);
    };
  }, [clearTimer, finishDiscovery]);

  const handleDismiss = () => {
    const galaxy = activeGalaxyRef.current || activeGalaxy;
    if (galaxy) {
      finishDiscovery(galaxy, false);
    } else {
      setIsVisible(false);
    }
  };

  const handleOpenBriefing = () => {
    const galaxy = activeGalaxyRef.current || activeGalaxy;
    if (galaxy) {
      finishDiscovery(galaxy, true);
    } else {
      setIsVisible(false);
    }
  };

  if (!isVisible || !activeGalaxy) {
    return null;
  }

  return (
    <div className="fixed bottom-20 left-1/2 -translate-x-1/2 z-30 w-[92vw] max-w-xl pointer-events-auto font-sans select-none animate-slide-up transition-all duration-300">
      <div className="relative p-3.5 rounded-xl bg-slate-950/90 border border-emerald-500/50 shadow-2xl backdrop-blur-xl flex items-center justify-between gap-3 overflow-hidden">
        
        {/* Subtle Background Accent */}
        <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/10 via-transparent to-cyan-500/10 pointer-events-none" />

        {/* Left: Icon & Discovery Specs */}
        <div className="flex items-center gap-3 min-w-0 z-10">
          <div className="relative flex-shrink-0 w-10 h-10 rounded-lg bg-emerald-950/80 border border-emerald-400 flex items-center justify-center text-emerald-300 shadow-md shadow-emerald-950/50">
            <CheckCircle2 size={20} className="animate-pulse" />
            <Sparkles size={12} className="absolute -top-1 -right-1 text-amber-300" />
          </div>

          <div className="min-w-0">
            <div className="flex items-center gap-2 text-[9px] font-mono text-emerald-400 uppercase tracking-widest font-bold">
              <span>CELESTIAL DISCOVERY</span>
              <span className="text-slate-500">•</span>
              <span className="text-cyan-300">{activeGalaxy.type}</span>
            </div>
            <h3 className="text-sm md:text-base font-serif italic font-bold text-white tracking-wide truncate mt-0.5">
              {activeGalaxy.name}
            </h3>
            <p className="text-[10px] font-mono text-slate-400 truncate">
              {activeGalaxy.constellation} • {activeGalaxy.distance}
            </p>
          </div>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-2 z-10 flex-shrink-0">
          <button
            onClick={handleOpenBriefing}
            className="px-3 py-1.5 rounded bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-mono text-[10px] font-extrabold uppercase tracking-wider flex items-center gap-1 shadow-md cursor-pointer transition-all"
          >
            <span>BRIEFING</span>
            <ArrowRight size={12} />
          </button>

          <button
            onClick={handleDismiss}
            className="p-1 rounded bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-white border border-slate-700/60 cursor-pointer transition-colors"
            title="Dismiss Notification"
          >
            <X size={14} />
          </button>
        </div>

      </div>
    </div>
  );
};

export default DiscoveryOverlay;
