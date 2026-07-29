import React, { useEffect, useRef, useState } from 'react';
import { initPhaserGame, destroyPhaserGame } from '../../phaser/Game';
import { eventBus } from '../../core/events';
import { logger } from '../../core/logger';
import { Sparkles } from 'lucide-react';

interface GameContainerProps {
  onGameReady?: () => void;
  className?: string;
}

export const GameContainer: React.FC<GameContainerProps> = ({ onGameReady, className = '' }) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    if (!containerRef.current) return;

    logger.info('GameContainer: Mounting Phaser Game Canvas...');

    const handlePhaserReady = () => {
      logger.info('GameContainer: Phaser Engine signal received (PHASER_READY).');
      setIsReady(true);
      if (onGameReady) {
        onGameReady();
      }
    };

    // Register event listener
    eventBus.on('PHASER_READY', handlePhaserReady);

    // Initialize Game
    try {
      initPhaserGame(containerRef.current);
    } catch (err) {
      logger.error('GameContainer: Error during game initialization', err);
    }

    // Cleanup on component unmount
    return () => {
      logger.info('GameContainer: Unmounting... Destroying Phaser instance.');
      eventBus.off('PHASER_READY', handlePhaserReady);
      destroyPhaserGame();
    };
  }, [onGameReady]);

  return (
    <div className={`relative w-full h-full bg-[#050508] overflow-hidden ${className}`}>
      {/* 1. Phaser Mounting Container */}
      <div ref={containerRef} className="w-full h-full absolute inset-0 z-0" />

      {/* 2. Loading Spinner Overlay before Engine Ready */}
      {!isReady && (
        <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-[#050508] text-slate-200 font-mono">
          <div className="flex items-center gap-2 px-4 py-2 rounded border border-cyan-500/30 bg-cyan-950/20 text-cyan-400 text-xs animate-pulse">
            <Sparkles size={14} className="animate-spin text-amber-400" />
            <span>INITIALIZING PHASER 3 ENGINE...</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default GameContainer;
