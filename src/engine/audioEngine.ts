// Native Web Audio Synthesizer and Ambient Space Drone Engine
class AudioEngine {
  private audioCtx: AudioContext | null = null;
  private musicGain: GainNode | null = null;
  private sfxGain: GainNode | null = null;
  private isMusicPlaying = false;
  private droneOscs: OscillatorNode[] = [];
  private lfoOsc: OscillatorNode | null = null;
  private intervalId: any = null;

  private getContext(): AudioContext | null {
    if (!this.audioCtx && typeof window !== 'undefined') {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioContextClass) {
        this.audioCtx = new AudioContextClass();
      }
    }
    if (this.audioCtx && this.audioCtx.state === 'suspended') {
      this.audioCtx.resume().catch(() => {});
    }
    return this.audioCtx;
  }

  // Play Sound Effect
  playSound(type: string, enabled: boolean = true, volume: number = 0.8) {
    if (!enabled) return;
    try {
      const ctx = this.getContext();
      if (!ctx) return;

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);

      const now = ctx.currentTime;
      const baseGain = 0.15 * volume;

      if (type === 'laser') {
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(720, now);
        osc.frequency.exponentialRampToValueAtTime(180, now + 0.11);
        gain.gain.setValueAtTime(baseGain, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.11);
        osc.start(now);
        osc.stop(now + 0.11);
      } else if (type === 'explosion') {
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(140, now);
        osc.frequency.linearRampToValueAtTime(20, now + 0.35);
        gain.gain.setValueAtTime(baseGain * 2, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);
        osc.start(now);
        osc.stop(now + 0.35);
      } else if (type === 'impact') {
        osc.type = 'sine';
        osc.frequency.setValueAtTime(200, now);
        osc.frequency.exponentialRampToValueAtTime(45, now + 0.08);
        gain.gain.setValueAtTime(baseGain * 1.5, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);
        osc.start(now);
        osc.stop(now + 0.08);
      } else if (type === 'powerup') {
        osc.type = 'sine';
        osc.frequency.setValueAtTime(330, now);
        osc.frequency.linearRampToValueAtTime(660, now + 0.08);
        osc.frequency.linearRampToValueAtTime(1320, now + 0.22);
        gain.gain.setValueAtTime(baseGain, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);
        osc.start(now);
        osc.stop(now + 0.25);
      } else if (type === 'thrust') {
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(70, now);
        osc.frequency.linearRampToValueAtTime(40, now + 0.08);
        gain.gain.setValueAtTime(baseGain * 0.4, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);
        osc.start(now);
        osc.stop(now + 0.08);
      } else if (type === 'warp') {
        osc.type = 'sine';
        osc.frequency.setValueAtTime(90, now);
        osc.frequency.exponentialRampToValueAtTime(1800, now + 1.2);
        gain.gain.setValueAtTime(baseGain * 1.2, now);
        gain.gain.linearRampToValueAtTime(baseGain * 2, now + 0.8);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 1.2);
        osc.start(now);
        osc.stop(now + 1.2);
      } else if (type === 'quiz-correct') {
        osc.type = 'sine';
        osc.frequency.setValueAtTime(523.25, now); // C5
        osc.frequency.setValueAtTime(659.25, now + 0.1); // E5
        osc.frequency.setValueAtTime(783.99, now + 0.2); // G5
        gain.gain.setValueAtTime(baseGain, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);
        osc.start(now);
        osc.stop(now + 0.35);
      } else if (type === 'scan-start') {
        osc.type = 'sine';
        osc.frequency.setValueAtTime(240, now);
        osc.frequency.exponentialRampToValueAtTime(880, now + 0.4);
        gain.gain.setValueAtTime(0.01, now);
        gain.gain.linearRampToValueAtTime(baseGain * 1.5, now + 0.1);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.45);
        osc.start(now);
        osc.stop(now + 0.45);
      } else if (type === 'scan-pulse') {
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(440, now);
        osc.frequency.exponentialRampToValueAtTime(550, now + 0.15);
        gain.gain.setValueAtTime(baseGain * 0.6, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.15);
        osc.start(now);
        osc.stop(now + 0.15);
      } else if (type === 'scan-complete') {
        osc.type = 'sine';
        osc.frequency.setValueAtTime(523.25, now);       // C5
        osc.frequency.setValueAtTime(659.25, now + 0.12);  // E5
        osc.frequency.setValueAtTime(783.99, now + 0.24);  // G5
        osc.frequency.setValueAtTime(1046.50, now + 0.36); // C6
        gain.gain.setValueAtTime(baseGain * 1.8, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.8);
        osc.start(now);
        osc.stop(now + 0.8);
      } else if (type === 'scan-cancel') {
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(320, now);
        osc.frequency.linearRampToValueAtTime(110, now + 0.25);
        gain.gain.setValueAtTime(baseGain * 1.2, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);
        osc.start(now);
        osc.stop(now + 0.25);
      }
    } catch (e) {
      console.warn('Audio play failed', e);
    }
  }

  // Start Procedural Deep Space Ambient Music
  startAmbientMusic(enabled: boolean = true, volume: number = 0.5) {
    if (this.isMusicPlaying || !enabled) return;
    try {
      const ctx = this.getContext();
      if (!ctx) return;

      this.musicGain = ctx.createGain();
      this.musicGain.gain.setValueAtTime(enabled ? volume * 0.25 : 0, ctx.currentTime);
      this.musicGain.connect(ctx.destination);

      const filter = ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(320, ctx.currentTime);
      filter.Q.setValueAtTime(1, ctx.currentTime);
      filter.connect(this.musicGain);

      // Lush minor third/fifth drone frequencies: C2 (65.4Hz), G2 (98.0Hz), Eb2 (77.8Hz)
      const freqs = [65.41, 98.00, 77.78];
      this.droneOscs = [];

      freqs.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, ctx.currentTime);
        osc.detune.setValueAtTime((idx - 1) * 5, ctx.currentTime);
        gain.gain.setValueAtTime(0.08, ctx.currentTime);

        osc.connect(gain);
        gain.connect(filter);
        osc.start(0);

        this.droneOscs.push(osc);
      });

      this.lfoOsc = ctx.createOscillator();
      const lfoGain = ctx.createGain();
      this.lfoOsc.type = 'sine';
      this.lfoOsc.frequency.setValueAtTime(0.05, ctx.currentTime);
      lfoGain.gain.setValueAtTime(100, ctx.currentTime);

      this.lfoOsc.connect(lfoGain);
      lfoGain.connect(filter.frequency);
      this.lfoOsc.start(0);

      const scheduleTwinkle = () => {
        if (!ctx || ctx.state === 'suspended' || !this.isMusicPlaying) return;
        const now = ctx.currentTime;
        const twinkleOsc = ctx.createOscillator();
        const twinkleGain = ctx.createGain();
        const delay = ctx.createDelay();
        const delayGain = ctx.createGain();

        twinkleOsc.type = 'sine';
        const scale = [523.25, 622.25, 783.99, 932.33, 1046.50];
        const randomFreq = scale[Math.floor(Math.random() * scale.length)];
        twinkleOsc.frequency.setValueAtTime(randomFreq, now);

        twinkleGain.gain.setValueAtTime(0, now);
        twinkleGain.gain.linearRampToValueAtTime(0.03 * volume, now + 0.1);
        twinkleGain.gain.exponentialRampToValueAtTime(0.001, now + 2.8);

        delay.delayTime.setValueAtTime(0.45, now);
        delayGain.gain.setValueAtTime(0.25, now);

        twinkleOsc.connect(twinkleGain);
        if (this.musicGain) twinkleGain.connect(this.musicGain);

        twinkleGain.connect(delay);
        delay.connect(delayGain);
        if (this.musicGain) delayGain.connect(this.musicGain);
        delayGain.connect(delay);

        twinkleOsc.start(now);
        twinkleOsc.stop(now + 3.2);
      };

      this.intervalId = setInterval(scheduleTwinkle, 3800);
      this.isMusicPlaying = true;
    } catch (e) {
      console.warn('Ambient space music failed to play', e);
    }
  }

  // Update Music Volume / Mute
  updateMusicVolume(enabled: boolean, volume: number = 0.5) {
    if (this.musicGain && this.audioCtx) {
      const targetVol = enabled ? volume * 0.25 : 0;
      this.musicGain.gain.setTargetAtTime(targetVol, this.audioCtx.currentTime, 0.2);
    }
  }

  stopAmbientMusic() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
    try {
      this.droneOscs.forEach((o) => o.stop());
      this.lfoOsc?.stop();
    } catch (e) {
      // ignore
    }
    this.droneOscs = [];
    this.lfoOsc = null;
    this.isMusicPlaying = false;
  }
}

export const audioEngine = new AudioEngine();
