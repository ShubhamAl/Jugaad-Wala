export type SoundName =
  | 'button'
  | 'tool'
  | 'repair'
  | 'success'
  | 'failure'
  | 'whoosh'
  | 'spark'

class AudioManager {
  private ctx: AudioContext | null = null
  private sfxEnabled = true
  private musicEnabled = true
  private volume = 0.8

  private getContext(): AudioContext | null {
    if (typeof window === 'undefined') return null
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext
      if (AudioCtx) {
        this.ctx = new AudioCtx()
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume()
    }
    return this.ctx
  }

  setSfxEnabled(enabled: boolean) {
    this.sfxEnabled = enabled
  }

  getSfxEnabled() {
    return this.sfxEnabled
  }

  setMusicEnabled(enabled: boolean) {
    this.musicEnabled = enabled
  }

  getMusicEnabled() {
    return this.musicEnabled
  }

  toggleMusic(): boolean {
    const next = !this.musicEnabled
    this.setMusicEnabled(next)
    return next
  }

  setVolume(vol: number) {
    this.volume = Math.max(0, Math.min(1, vol))
  }

  getVolume() {
    return this.volume
  }

  startBgm() {}
  stopBgm() {}

  // =========================================================================
  // SOUND EFFECTS
  // =========================================================================

  play(sound: SoundName) {
    if (!this.sfxEnabled) return
    const ctx = this.getContext()
    if (!ctx) return

    try {
      const now = ctx.currentTime
      const gain = ctx.createGain()
      gain.gain.setValueAtTime(this.volume * 0.3, now)
      gain.connect(ctx.destination)

      if (sound === 'button') {
        const osc = ctx.createOscillator()
        osc.type = 'triangle'
        osc.frequency.setValueAtTime(320, now)
        osc.frequency.exponentialRampToValueAtTime(480, now + 0.08)
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08)
        osc.connect(gain)
        osc.start(now)
        osc.stop(now + 0.08)
      } else if (sound === 'tool') {
        // Metallic clink
        const osc = ctx.createOscillator()
        osc.type = 'sawtooth'
        osc.frequency.setValueAtTime(800, now)
        osc.frequency.exponentialRampToValueAtTime(200, now + 0.09)
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.09)
        osc.connect(gain)
        osc.start(now)
        osc.stop(now + 0.09)
      } else if (sound === 'repair' || sound === 'spark') {
        // Cheerful comic chime
        ;[523.25, 659.25, 783.99].forEach((freq, i) => {
          const osc = ctx.createOscillator()
          const noteGain = ctx.createGain()
          osc.type = 'sine'
          osc.frequency.setValueAtTime(freq, now + i * 0.06)
          noteGain.gain.setValueAtTime(this.volume * 0.25, now + i * 0.06)
          noteGain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.06 + 0.15)
          osc.connect(noteGain)
          noteGain.connect(ctx.destination)
          osc.start(now + i * 0.06)
          osc.stop(now + i * 0.06 + 0.15)
        })
      } else if (sound === 'success') {
        // Victorious fanfare
        ;[440, 554.37, 659.25, 880].forEach((freq, i) => {
          const osc = ctx.createOscillator()
          const noteGain = ctx.createGain()
          osc.type = 'triangle'
          const start = now + i * 0.1
          osc.frequency.setValueAtTime(freq, start)
          noteGain.gain.setValueAtTime(this.volume * 0.35, start)
          noteGain.gain.exponentialRampToValueAtTime(0.001, start + 0.35)
          osc.connect(noteGain)
          noteGain.connect(ctx.destination)
          osc.start(start)
          osc.stop(start + 0.35)
        })
      } else if (sound === 'failure') {
        // Sad trombone drop
        ;[320, 290, 260, 210].forEach((freq, i) => {
          const osc = ctx.createOscillator()
          const noteGain = ctx.createGain()
          osc.type = 'sawtooth'
          const start = now + i * 0.14
          osc.frequency.setValueAtTime(freq, start)
          noteGain.gain.setValueAtTime(this.volume * 0.2, start)
          noteGain.gain.exponentialRampToValueAtTime(0.001, start + 0.18)
          osc.connect(noteGain)
          noteGain.connect(ctx.destination)
          osc.start(start)
          osc.stop(start + 0.18)
        })
      } else if (sound === 'whoosh') {
        const osc = ctx.createOscillator()
        osc.type = 'sine'
        osc.frequency.setValueAtTime(150, now)
        osc.frequency.exponentialRampToValueAtTime(600, now + 0.12)
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.12)
        osc.connect(gain)
        osc.start(now)
        osc.stop(now + 0.12)
      }
    } catch {
      // Audio playback fails silently if browser blocks before gesture
    }
  }
}

export const audioManager = new AudioManager()
