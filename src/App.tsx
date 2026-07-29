import React, { useEffect } from 'react';
import { GameState, Galaxy, Spaceship } from './types';
import { GALAXIES } from './data/galaxies';
import MainMenu from './components/views/MainMenu';
import OpeningCinematic from './components/views/OpeningCinematic';
import GameCanvas from './components/GameCanvas';
import GalaxyInfo from './components/educational/GalaxyInfo';
import Certificate from './components/educational/Certificate';
import ArchiveModal from './components/views/ArchiveModal';
import SettingsModal from './components/views/SettingsModal';
import { useGameStore } from './store/useGameStore';
import { audioEngine } from './engine/audioEngine';
import { Rocket, Sparkles } from 'lucide-react';

export default function App() {
  const {
    gameState,
    selectedGalaxy,
    settings,
    profile,
    savedShipState,
    setGameState,
    setSelectedGalaxy,
    discoverGalaxy,
    recordQuizScore,
    saveShipState,
  } = useGameStore();

  // Start background space ambient music on load if sound is enabled
  useEffect(() => {
    audioEngine.startAmbientMusic(settings.soundEnabled, settings.bgmVolume);
    return () => {
      audioEngine.stopAmbientMusic();
    };
  }, []);

  // Sync audio engine whenever sound settings change
  useEffect(() => {
    audioEngine.updateMusicVolume(settings.soundEnabled, settings.bgmVolume);
  }, [settings.soundEnabled, settings.bgmVolume]);

  // Handle ship state saving from GameCanvas
  const handleSaveShipState = (ship: Spaceship) => {
    saveShipState(ship);
  };

  // Trigger Galaxy Discovery & Hyperspace Warp
  const handleDiscoverGalaxy = (galaxyId: string) => {
    const galaxy = GALAXIES.find((g) => g.id === galaxyId);
    if (!galaxy) return;

    setSelectedGalaxy(galaxy);
    discoverGalaxy(galaxyId);
    setGameState('WARPING');
    
    // Play hyperspace warp sound
    audioEngine.playSound('warp', settings.soundEnabled, settings.sfxVolume);

    // After 1.8s warp jump, enter Galaxy Spec Card
    setTimeout(() => {
      setGameState('GALAXY_INFO');
    }, 1800);
  };

  // Successfully complete MCQ Quiz
  const handleQuizSuccess = () => {
    if (!selectedGalaxy) return;

    recordQuizScore(selectedGalaxy.id, selectedGalaxy.quizzes.length, selectedGalaxy.quizzes.length);
    setGameState('CERTIFICATE');
  };

  // Return to Space Sandbox
  const handleReturnToSpace = () => {
    setSelectedGalaxy(null);
    setGameState('PLAYING');
  };

  return (
    <main className="w-full h-screen relative bg-[#050508] text-slate-100 overflow-hidden font-sans select-none">
      
      {/* 1. STATE: MENU */}
      {gameState === 'MENU' && (
        <MainMenu
          onStartGame={() => setGameState('INTRO_CUTSCENE')}
          onOpenArchive={() => setGameState('ARCHIVE')}
          onOpenSettings={() => setGameState('SETTINGS')}
        />
      )}

      {/* 1.5. STATE: INTRO_CUTSCENE */}
      {gameState === 'INTRO_CUTSCENE' && (
        <OpeningCinematic
          onComplete={() => setGameState('PLAYING')}
        />
      )}

      {/* 2. STATE: PLAYING */}
      {gameState === 'PLAYING' && (
        <GameCanvas
          onDiscoverGalaxy={handleDiscoverGalaxy}
          discoveredIds={profile.discoveredGalaxyIds}
          soundEnabled={settings.soundEnabled}
          onExitToMenu={() => setGameState('MENU')}
          savedShipState={savedShipState}
          onSaveShipState={handleSaveShipState}
          onOpenArchive={() => setGameState('ARCHIVE')}
          onOpenSettings={() => setGameState('SETTINGS')}
        />
      )}

      {/* 3. STATE: WARPING (Hyperspace jump cutscene) */}
      {gameState === 'WARPING' && selectedGalaxy && (
        <div 
          id="hyperspace-warp-stage" 
          className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#050508] overflow-hidden select-none"
        >
          {/* Concentric warp speed lines */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="absolute w-[200vw] h-[200vh] rounded-full border-[60px] border-cyan-500/10 animate-ping opacity-70 duration-1000"></div>
            <div className="absolute w-[150vw] h-[150vh] rounded-full border-[40px] border-indigo-500/15 animate-ping opacity-60 duration-700"></div>
            <div className="absolute w-[100vw] h-[100vh] rounded-full border-[20px] border-purple-500/20 animate-ping opacity-50 duration-500"></div>
            
            {/* Flying warp lines */}
            <div className="warp-streaks absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(0,0,0,0)_0%,rgba(5,5,8,0.95)_100%)]">
              <div className="absolute top-1/2 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-cyan-400 to-transparent transform rotate-12 scale-x-150 animate-pulse"></div>
              <div className="absolute top-1/2 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-indigo-400 to-transparent transform -rotate-45 scale-x-150 animate-pulse"></div>
              <div className="absolute top-1/2 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-purple-400 to-transparent transform rotate-45 scale-x-150 animate-pulse"></div>
            </div>
          </div>

          {/* Immersive HUD warnings */}
          <div className="z-10 text-center space-y-4 px-6 animate-pulse font-mono">
            <div className="mx-auto w-16 h-16 rounded-full bg-cyan-950/40 border border-cyan-500/40 flex items-center justify-center text-cyan-400 shadow-lg shadow-cyan-950/50">
              <Rocket size={32} className="animate-bounce" />
            </div>

            <div className="space-y-1">
              <h2 className="text-xs font-bold uppercase tracking-widest text-cyan-400">
                🚀 HYPERDRIVE COUPLER ENGAGED
              </h2>
              <h1 className="text-3xl md:text-5xl font-black text-white tracking-tight leading-none uppercase">
                SPACE-TIME WARP JUMP
              </h1>
            </div>

            <div className="p-3.5 rounded border border-white/10 bg-black/60 max-w-sm mx-auto shadow-2xl">
              <p className="text-[10px] text-slate-400">
                COORDINATE LOCK ACQUIRED:
              </p>
              <p className="text-sm font-bold mt-1 text-gold uppercase tracking-wide">
                🪐 {selectedGalaxy.name}
              </p>
              <div className="mt-2 text-[9px] text-slate-500 flex justify-center items-center gap-1">
                <Sparkles size={10} className="text-amber-400" />
                <span>APPROACH VELOCITY: LIGHT SPEED</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 4. STATE: GALAXY_INFO */}
      {gameState === 'GALAXY_INFO' && selectedGalaxy && (
        <GalaxyInfo
          galaxy={selectedGalaxy}
          soundEnabled={settings.soundEnabled}
          onReturnToSpace={handleReturnToSpace}
          onQuizSuccess={handleQuizSuccess}
          discoveredIds={profile.discoveredGalaxyIds}
        />
      )}

      {/* 5. STATE: CERTIFICATE */}
      {gameState === 'CERTIFICATE' && selectedGalaxy && (
        <Certificate
          galaxy={selectedGalaxy}
          soundEnabled={settings.soundEnabled}
          onReturnToSpace={handleReturnToSpace}
        />
      )}

      {/* 6. MODAL: ARCHIVE */}
      {gameState === 'ARCHIVE' && (
        <ArchiveModal
          onClose={() => setGameState('MENU')}
          onOpenGalaxy={(galaxy) => {
            setSelectedGalaxy(galaxy);
            setGameState('GALAXY_INFO');
          }}
        />
      )}

      {/* 7. MODAL: SETTINGS */}
      {gameState === 'SETTINGS' && (
        <SettingsModal onClose={() => setGameState('MENU')} />
      )}
    </main>
  );
}
