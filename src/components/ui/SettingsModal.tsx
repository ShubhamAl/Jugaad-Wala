import { ArrowLeft, Volume2, VolumeX, Music, Sliders } from 'lucide-react'
import { useGameStore } from '../../store/gameStore'
import { GameButton } from './GameButton'

export function SettingsModal() {
  const goToMenu = useGameStore((state) => state.goToMenu)
  const soundEnabled = useGameStore((state) => state.soundEnabled)
  const musicEnabled = useGameStore((state) => state.musicEnabled)
  const volume = useGameStore((state) => state.volume)
  const toggleSound = useGameStore((state) => state.toggleSound)
  const toggleMusic = useGameStore((state) => state.toggleMusic)
  const setVolume = useGameStore((state) => state.setVolume)

  return (
    <div className="modal-backdrop" role="presentation" onMouseDown={goToMenu}>
      <section
        className="settings-modal-panel"
        role="dialog"
        aria-modal="true"
        aria-label="Settings"
        onMouseDown={(e) => e.stopPropagation()}
      >
        <button
          className="modal-close"
          type="button"
          aria-label="Back to Menu"
          onClick={goToMenu}
        >
          ×
        </button>

        <header className="settings-header">
          <p className="eyebrow">SHOP CONFIGURATION</p>
          <h2>AUDIO & PREFERENCES</h2>
        </header>

        <div className="settings-content">
          <div className="settings-row-item">
            <div className="setting-label-group">
              {soundEnabled ? <Volume2 size={22} className="setting-icon" /> : <VolumeX size={22} className="setting-icon muted" />}
              <div>
                <strong>Sound Effects (SFX)</strong>
                <p>Sparks, ratchet clicks, test buzzer</p>
              </div>
            </div>
            <button
              type="button"
              className={`toggle-switch ${soundEnabled ? 'is-on' : 'is-off'}`}
              onClick={toggleSound}
            >
              {soundEnabled ? 'ON' : 'MUTED'}
            </button>
          </div>

          <div className="settings-row-item">
            <div className="setting-label-group">
              <Music size={22} className="setting-icon" />
              <div>
                <strong>Background Ambience</strong>
                <p>Neighborhood market soundscape</p>
              </div>
            </div>
            <button
              type="button"
              className={`toggle-switch ${musicEnabled ? 'is-on' : 'is-off'}`}
              onClick={toggleMusic}
            >
              {musicEnabled ? 'ON' : 'OFF'}
            </button>
          </div>

          <div className="settings-row-item volume-slider-row">
            <div className="setting-label-group">
              <Sliders size={22} className="setting-icon" />
              <div>
                <strong>Master Volume: {Math.round(volume * 100)}%</strong>
                <p>Overall audio intensity</p>
              </div>
            </div>
            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={volume}
              onChange={(e) => setVolume(parseFloat(e.target.value))}
              className="retro-range-slider"
            />
          </div>
        </div>

        <footer className="settings-footer">
          <GameButton onClick={goToMenu} variant="secondary">
            <ArrowLeft size={18} className="inline-icon" />
            BACK TO MENU
          </GameButton>
        </footer>
      </section>
    </div>
  )
}
