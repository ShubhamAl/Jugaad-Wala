import { Wrench, Sparkles, Volume2, HelpCircle, Play } from 'lucide-react'
import { useGameStore } from '../../store/gameStore'
import { GameButton } from '../ui/GameButton'

export function TitleScreen() {
  const startGame = useGameStore((state) => state.startGame)
  const setGameState = useGameStore((state) => state.setGameState)

  return (
    <main className="title-screen" id="main-menu">
      <div className="title-sun" />
      <div className="title-power-lines" />
      
      {/* Stamp in upper corner */}
      <div className="title-vintage-badge">
        <span>★ 100% DESI JUGAAAD ★</span>
      </div>

      <section className="title-sign" aria-labelledby="game-title">
        <p className="title-topline">EST. 2004 · REPAIR · REUSE · REJOICE</p>
        <h1 id="game-title">
          <span>JUGAAD</span>
          <span>REPAIR SHOP</span>
        </h1>
        <p className="title-subtitle">
          "Kuch bhi toot sakta hai... aur kuch bhi theek ho sakta hai!"
        </p>

        <div className="title-actions">
          <GameButton onClick={startGame} className="start-btn">
            <Play className="inline-icon" size={20} />
            START GAME
          </GameButton>
          <GameButton
            variant="secondary"
            onClick={() => setGameState('HOW_TO_PLAY')}
          >
            <HelpCircle className="inline-icon" size={18} />
            HOW TO PLAY
          </GameButton>
          <GameButton
            variant="secondary"
            onClick={() => setGameState('SETTINGS')}
          >
            <Volume2 className="inline-icon" size={18} />
            SETTINGS
          </GameButton>
        </div>
      </section>

      <aside className="title-note">
        <b>CHHOTU'S RULE #1:</b>
        <p>No original spare parts? <em>Jugaad first, ask questions later!</em> ⚡</p>
      </aside>

      <div className="title-floor">
        <span title="Sparks"><Sparkles size={36} /></span>
        <span title="Tools"><Wrench size={36} /></span>
        <span title="Chai">☕</span>
      </div>
    </main>
  )
}
