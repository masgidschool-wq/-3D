class SoundManager {
  private ctx: AudioContext | null = null;
  public isMuted: boolean = false;
  private musicInterval: any = null;
  public isMusicPlaying: boolean = false;

  private initCtx() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  public toggleMute(): boolean {
    this.isMuted = !this.isMuted;
    if (this.isMuted && this.musicInterval) {
      clearInterval(this.musicInterval);
      this.isMusicPlaying = false;
    } else if (!this.isMuted && !this.isMusicPlaying) {
      this.startCozyAmbientMusic();
    }
    return this.isMuted;
  }

  // Play pleasant pentatonic chime music periodically
  public startCozyAmbientMusic() {
    if (this.isMusicPlaying || this.isMuted) return;
    this.initCtx();
    this.isMusicPlaying = true;

    const notes = [261.63, 293.66, 329.63, 392.00, 440.00, 523.25, 587.33, 659.25]; // C D E G A C D E
    let noteIdx = 0;

    this.musicInterval = setInterval(() => {
      if (this.isMuted || !this.ctx) return;
      // Arpeggiate soft synth bell
      const freq = notes[noteIdx % notes.length];
      const oct = Math.random() > 0.5 ? 1 : 0.5;
      this.playTone(freq * oct, 'sine', 1.8, 0.08);

      // Harmony note
      if (Math.random() > 0.4) {
        const harmFreq = notes[(noteIdx + 3) % notes.length];
        setTimeout(() => {
          this.playTone(harmFreq, 'triangle', 2.0, 0.04);
        }, 300);
      }

      noteIdx = (noteIdx + Math.floor(Math.random() * 3) + 1) % notes.length;
    }, 2800);
  }

  public stopMusic() {
    if (this.musicInterval) {
      clearInterval(this.musicInterval);
      this.musicInterval = null;
    }
    this.isMusicPlaying = false;
  }

  private playTone(freq: number, type: OscillatorType, duration: number, maxVol: number) {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx) return;

    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = type;
      osc.frequency.setValueAtTime(freq, this.ctx.currentTime);

      gain.gain.setValueAtTime(0.001, this.ctx.currentTime);
      gain.gain.linearRampToValueAtTime(maxVol, this.ctx.currentTime + 0.1);
      gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + duration);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start();
      osc.stop(this.ctx.currentTime + duration);
    } catch (e) {
      console.warn('Audio error:', e);
    }
  }

  // Sound effects
  public playAlarm() {
    if (this.isMuted) return;
    this.initCtx();
    for (let i = 0; i < 3; i++) {
      setTimeout(() => {
        this.playTone(880, 'square', 0.15, 0.1);
      }, i * 200);
    }
  }

  public playBirdChirp() {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx) return;

    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(2000, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(3200, this.ctx.currentTime + 0.1);
      osc.frequency.exponentialRampToValueAtTime(2400, this.ctx.currentTime + 0.2);

      gain.gain.setValueAtTime(0.05, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.25);

      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();
      osc.stop(this.ctx.currentTime + 0.25);
    } catch (e) {}
  }

  public playStep() {
    if (this.isMuted) return;
    this.playTone(120 + Math.random() * 30, 'triangle', 0.08, 0.03);
  }

  public playWaterSplash() {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx) return;

    // White noise / water stream
    const bufferSize = this.ctx.sampleRate * 0.4;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const output = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      output[i] = Math.random() * 2 - 1;
    }

    const whiteNoise = this.ctx.createBufferSource();
    whiteNoise.buffer = buffer;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.value = 1200;
    filter.Q.value = 3;

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0.08, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.4);

    whiteNoise.connect(filter);
    filter.connect(gain);
    gain.connect(this.ctx.destination);

    whiteNoise.start();
  }

  public playCoin() {
    if (this.isMuted) return;
    this.playTone(987.77, 'sine', 0.1, 0.12);
    setTimeout(() => this.playTone(1318.51, 'sine', 0.25, 0.12), 80);
  }

  public playFanfare() {
    if (this.isMuted) return;
    const notes = [523.25, 659.25, 783.99, 1046.50];
    notes.forEach((n, idx) => {
      setTimeout(() => {
        this.playTone(n, 'triangle', 0.3, 0.15);
      }, idx * 120);
    });
  }

  public playBell() {
    if (this.isMuted) return;
    this.playTone(2093, 'sine', 0.5, 0.15);
  }

  public playClick() {
    if (this.isMuted) return;
    this.playTone(600, 'sine', 0.05, 0.05);
  }

  public playCatMeow() {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx) return;
    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(600, this.ctx.currentTime);
      osc.frequency.linearRampToValueAtTime(850, this.ctx.currentTime + 0.2);
      osc.frequency.linearRampToValueAtTime(500, this.ctx.currentTime + 0.4);

      gain.gain.setValueAtTime(0.001, this.ctx.currentTime);
      gain.gain.linearRampToValueAtTime(0.1, this.ctx.currentTime + 0.1);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.45);

      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();
      osc.stop(this.ctx.currentTime + 0.45);
    } catch (e) {}
  }

  public playDogBark() {
    if (this.isMuted) return;
    this.playTone(180, 'sawtooth', 0.12, 0.1);
    setTimeout(() => this.playTone(220, 'sawtooth', 0.15, 0.1), 100);
  }

  public playPrayerHum() {
    if (this.isMuted) return;
    this.playTone(130.81, 'sine', 3.0, 0.08); // Deep C note
    setTimeout(() => this.playTone(164.81, 'sine', 3.0, 0.06), 200); // E
  }
}

export const soundManager = new SoundManager();
