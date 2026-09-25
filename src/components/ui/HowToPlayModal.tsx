import { ArrowLeft, MessageSquare, Wrench, Trophy, CheckCircle2 } from 'lucide-react'
import { useGameStore } from '../../store/gameStore'
import { GameButton } from './GameButton'

export function HowToPlayModal() {
  const goToMenu = useGameStore((state) => state.goToMenu)
  const startGame = useGameStore((state) => state.startGame)

  const tutorialPanels = [
    {
      step: '01',
      title: 'HEAR THE CRISIS',
      icon: <MessageSquare size={28} className="tutorial-icon" />,
      desc: 'Customers arrive with beloved broken electronics. Listen closely to understand the fault!',
      badge: 'Step 1: Dialogue',
    },
    {
      step: '02',
      title: 'APPLY DESI JUGAAD',
      icon: <Wrench size={28} className="tutorial-icon" />,
      desc: 'No expensive spares! Pick tools, copper wire, electrical tape, or rubber bands to fix the circuit.',
      badge: 'Step 2: 2D Workshop',
    },
    {
      step: '03',
      title: 'TEST & EARN ₹ CASH',
      icon: <Trophy size={28} className="tutorial-icon" />,
      desc: 'Hit TEST to see if your fix holds! Satisfied neighbours shower you with rupees & street rep.',
      badge: 'Step 3: Verdict',
    },
  ]

  return (
    <div className="modal-backdrop" role="presentation" onMouseDown={goToMenu}>
      <section
        className="how-to-play-panel"
        role="dialog"
        aria-modal="true"
        aria-label="How to Play"
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

        <header className="how-to-play-header">
          <p className="eyebrow">CHHOTU'S QUICK HANDBOOK</p>
          <h2>HOW TO PLAY JUGAAD REPAIR SHOP</h2>
          <p className="subtext">
            Three comic rules to master the art of neighborhood electronics repair:
          </p>
        </header>

        <div className="tutorial-panels-grid">
          {tutorialPanels.map((panel) => (
            <article key={panel.step} className="tutorial-card">
              <div className="tutorial-badge">{panel.badge}</div>
              <div className="tutorial-step-number">{panel.step}</div>
              <div className="tutorial-icon-box">{panel.icon}</div>
              <h3>{panel.title}</h3>
              <p>{panel.desc}</p>
              <div className="tutorial-check">
                <CheckCircle2 size={16} /> <span>Ready</span>
              </div>
            </article>
          ))}
        </div>

        <footer className="how-to-play-footer">
          <GameButton variant="secondary" onClick={goToMenu}>
            <ArrowLeft size={18} className="inline-icon" />
            BACK TO MENU
          </GameButton>
          <GameButton onClick={startGame}>
            START REPAIRING NOW
          </GameButton>
        </footer>
      </section>
    </div>
  )
}
