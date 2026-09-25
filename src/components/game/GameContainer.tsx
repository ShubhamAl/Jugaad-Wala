import { ArrowLeft, Coins, Star, Settings } from 'lucide-react'
import { useGameStore } from '../../store/gameStore'
import { customers } from '../../data/customers'
import { DialoguePhase } from './DialoguePhase'
import { WorkshopPhase } from './WorkshopPhase'
import { ReactionPhase } from './ReactionPhase'

export function GameContainer() {
  const gamePhase = useGameStore((state) => state.gamePhase)
  const currentCustomerIndex = useGameStore((state) => state.currentCustomerIndex)
  const money = useGameStore((state) => state.money)
  const satisfaction = useGameStore((state) => state.customerSatisfaction)
  const goToMenu = useGameStore((state) => state.goToMenu)
  const setGameState = useGameStore((state) => state.setGameState)

  const customer = customers[currentCustomerIndex] || customers[0]

  return (
    <main className="game-container-wrapper" id="game-screen">
      {/* Top Shop HUD Bar */}
      <header className="game-hud-bar">
        <div className="hud-left-actions">
          <button
            type="button"
            className="hud-back-btn"
            onClick={goToMenu}
            title="Return to Main Menu"
          >
            <ArrowLeft size={18} />
            <span>MENU</span>
          </button>

          <div className="hud-shop-identity">
            <span className="shop-logo-badge">JG</span>
            <div>
              <strong>JUGAAD REPAIR SHOP</strong>
              <small>Counter · Customer #{currentCustomerIndex + 1}: {customer.name}</small>
            </div>
          </div>
        </div>

        {/* Phase Stepper Tracker */}
        <div className="hud-phase-stepper">
          <div className={`stepper-pill ${gamePhase === 'PHASE_1_DIALOGUE' ? 'active' : 'completed'}`}>
            <span>1</span> DIALOGUE
          </div>
          <span className="stepper-arrow">›</span>
          <div className={`stepper-pill ${gamePhase === 'PHASE_2_WORKSHOP' ? 'active' : gamePhase === 'PHASE_3_REACTION' ? 'completed' : ''}`}>
            <span>2</span> WORKBENCH
          </div>
          <span className="stepper-arrow">›</span>
          <div className={`stepper-pill ${gamePhase === 'PHASE_3_REACTION' ? 'active' : ''}`}>
            <span>3</span> VERDICT
          </div>
        </div>

        {/* Player Stats & Settings */}
        <div className="hud-stats-group">
          <div className="stat-pill cash-pill" title="Shop Cash">
            <Coins size={16} className="text-yellow" />
            <span>₹{money}</span>
          </div>

          <div className="stat-pill sat-pill" title={`Street Reputation: ${satisfaction}/10`}>
            <Star size={16} className="text-amber" />
            <span>{satisfaction}/10</span>
          </div>

          <button
            type="button"
            className="hud-settings-icon-btn"
            onClick={() => setGameState('SETTINGS')}
            title="Audio Settings"
          >
            <Settings size={18} />
          </button>
        </div>
      </header>

      {/* 16:9 Responsive 2D Comic Game Container */}
      <section className="comic-16-9-frame" aria-label="Jugaad 2D Game Screen">
        <div className="comic-panel-inner">
          {gamePhase === 'PHASE_1_DIALOGUE' && <DialoguePhase />}
          {gamePhase === 'PHASE_2_WORKSHOP' && <WorkshopPhase />}
          {gamePhase === 'PHASE_3_REACTION' && <ReactionPhase />}
        </div>
      </section>
    </main>
  )
}
