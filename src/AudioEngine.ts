/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

// Simple lightweight synthesizer utilizing Web Audio API
class AudioEngine {
  private ctx: AudioContext | null = null;
  public enabled: boolean = true;

  private init() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
  }

  // A heavy metal lever/gear click sound
  public playClank() {
    if (!this.enabled) return;
    this.init();
    if (!this.ctx) return;

    // Restart context if suspended by browser security
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }

    const now = this.ctx.currentTime;
    
    // Low frequency thump (gasket/heavy switch)
    const osc1 = this.ctx.createOscillator();
    const gain1 = this.ctx.createGain();
    
    osc1.type = 'triangle';
    osc1.frequency.setValueAtTime(140, now);
    osc1.frequency.exponentialRampToValueAtTime(40, now + 0.12);
    
    gain1.gain.setValueAtTime(0.3, now);
    gain1.gain.exponentialRampToValueAtTime(0.01, now + 0.12);
    
    // High frequency metal "ring"
    const osc2 = this.ctx.createOscillator();
    const gain2 = this.ctx.createGain();
    
    osc2.type = 'sine';
    osc2.frequency.setValueAtTime(1200, now);
    osc2.frequency.setValueAtTime(800, now + 0.02);
    
    gain2.gain.setValueAtTime(0.12, now);
    gain2.gain.exponentialRampToValueAtTime(0.01, now + 0.08);
    
    // Connect to destination
    osc1.connect(gain1);
    gain1.connect(this.ctx.destination);
    
    osc2.connect(gain2);
    gain2.connect(this.ctx.destination);
    
    osc1.start(now);
    osc1.stop(now + 0.13);
    
    osc2.start(now);
    osc2.stop(now + 0.09);
  }

  // A rising tech laser wave for complete animations or level ups
  public playLaserUnlock() {
    if (!this.enabled) return;
    this.init();
    if (!this.ctx) return;

    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    
    osc.type = 'sine';
    osc.frequency.setValueAtTime(150, now);
    osc.frequency.exponentialRampToValueAtTime(1800, now + 0.45);
    
    gain.gain.setValueAtTime(0.15, now);
    gain.gain.linearRampToValueAtTime(0.2, now + 0.08);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.5);
    
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    
    osc.start(now);
    osc.stop(now + 0.5);
    
    // Double beep at the end
    setTimeout(() => {
      this.playBeep(900, 0.08, 0.1);
    }, 450);
  }

  // A light cybernetic interface beep
  public playBeep(freq = 600, duration = 0.05, volume = 0.08) {
    if (!this.enabled) return;
    this.init();
    if (!this.ctx) return;

    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(freq, now);
    
    gain.gain.setValueAtTime(volume, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + duration);
    
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    
    osc.start(now);
    osc.stop(now + duration);
  }

  // Sci-fi power surge noise for complete tab transitions
  public playPowerIgnition() {
    if (!this.enabled) return;
    this.init();
    if (!this.ctx) return;

    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const filter = this.ctx.createBiquadFilter();
    const gain = this.ctx.createGain();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(60, now);
    osc.frequency.exponentialRampToValueAtTime(150, now + 0.3);

    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(400, now);
    filter.frequency.exponentialRampToValueAtTime(1200, now + 0.3);
    filter.Q.setValueAtTime(12, now);

    gain.gain.setValueAtTime(0.08, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(now);
    osc.stop(now + 0.4);
  }
}

export const audioEngine = new AudioEngine();
