import { useState } from 'react'
import { Trophy, Coins, Star, ArrowRight, RotateCcw, Home } from 'lucide-react'
import { comicScenes } from '../../data/comicScenes'
import { customers } from '../../data/customers'
import { useGameStore } from '../../store/gameStore'
import { GameButton } from '../ui/GameButton'
import { CustomerCharacter } from '../comic/CustomerCharacter'

export function ReactionPhase() {
  const currentCustomerIndex = useGameStore((state) => state.currentCustomerIndex)
  const outcome = useGameStore((state) => state.outcome)
  const money = useGameStore((state) => state.money)
  const customerSatisfaction = useGameStore((state) => state.customerSatisfaction)
  const nextCustomer = useGameStore((state) => state.nextCustomer)
  const startRepair = useGameStore((state) => state.startRepair)
  const goToMenu = useGameStore((state) => state.goToMenu)

  const customer = customers[currentCustomerIndex] || customers[0]
  const isSuccess = outcome === 'success'

  const sceneKey = isSuccess ? customer.successSceneId : (customer.failureSceneId || customer.introSceneId)
  const scene = comicScenes[sceneKey] || comicScenes['ramesh-success']

  const [panelIndex, setPanelIndex] = useState(0)
  const panel = scene.panels[panelIndex] || scene.panels[0]
  const isLastPanel = panelIndex >= scene.panels.length - 1

  return (
    <div className={`reaction-phase-container ${isSuccess ? 'verdict-success' : 'verdict-failure'}`}>
      {/* Top Verdict Ribbon */}
      <div className="phase-header-ribbon">
        <div className={`verdict-stamp-badge ${isSuccess ? 'stamp-win' : 'stamp-fail'}`}>
          {isSuccess ? '★ JUGAAD PASSED! ★' : '✖ JUGAAD FAILED! ✖'}
        </div>
        <div className="phase-subinfo">
          <span>{scene.title}</span>
          <span className="dot-sep">•</span>
          <span>Panel {panelIndex + 1}/{scene.panels.length}</span>
        </div>
      </div>

      {/* Main Comic Panel */}
      <div className="reaction-comic-stage">
        {/* Environment Background */}
        <div className="stage-backdrop result-bg">
          <div className="speed-lines" />
          {isSuccess && <div className="confetti-dots" />}
        </div>

        {/* Character Portrait */}
        <div className="dialogue-character-wrapper">
          <CustomerCharacter
            expression={panel.expression}
            name={customer.name}
          />
          <div className="character-nameplate">
            <strong>{customer.name}</strong>
            <small>{isSuccess ? 'Delighted Customer' : 'Skeptical Customer'}</small>
          </div>
        </div>

        {/* Comic Speech Bubble */}
        <div className="comic-speech-bubble-box verdict-speech">
          <div className="speech-tail" />
          <div className="speaker-tag">{panel.speaker} exclaims:</div>
          <p className="speech-quote">“{panel.dialogue}”</p>
          {panel.caption && (
            <div className="comic-caption-strip">
              <em>{panel.caption}</em>
            </div>
          )}
        </div>

        {/* Reward / Score Card */}
        <div className="reaction-reward-card">
          <div className="reward-header">
            <Trophy size={20} className="reward-trophy-icon" />
            <strong>JOB SETTLEMENT</strong>
          </div>

          <div className="reward-details-row">
            <div className="reward-stat-box">
              <Coins size={22} className="stat-icon text-yellow" />
              <div>
                <span className="stat-label">{isSuccess ? 'Cash Earned' : 'Cash Earned'}</span>
                <strong className="stat-value">{isSuccess ? `+₹${customer.reward}` : '₹0'}</strong>
              </div>
            </div>

            <div className="reward-stat-box">
              <Star size={22} className="stat-icon text-amber" />
              <div>
                <span className="stat-label">Satisfaction</span>
                <strong className="stat-value">
                  {isSuccess ? `+${customer.satisfactionReward}` : '-3'}
                </strong>
              </div>
            </div>
          </div>

          <div className="total-wallet-strip">
            <span>Total Shop Cash: <strong>₹{money}</strong></span>
            <span>Rep: <strong>{customerSatisfaction}/10 ★</strong></span>
          </div>
        </div>
      </div>

      {/* Footer Actions */}
      <footer className="reaction-action-footer">
        <div className="reaction-left-nav">
          <GameButton variant="secondary" onClick={goToMenu}>
            <Home size={16} className="inline-icon" />
            BACK TO MENU
          </GameButton>
          {!isSuccess && (
            <GameButton variant="secondary" onClick={startRepair}>
              <RotateCcw size={16} className="inline-icon" />
              RETRY REPAIR
            </GameButton>
          )}
        </div>

        <div className="reaction-right-nav">
          {!isLastPanel ? (
            <GameButton onClick={() => setPanelIndex((p) => p + 1)}>
              NEXT REACTION <ArrowRight size={18} className="inline-icon" />
            </GameButton>
          ) : (
            <GameButton onClick={nextCustomer} className="next-customer-cta pulsate">
              <ArrowRight size={20} className="inline-icon" />
              NEXT CUSTOMER
            </GameButton>
          )}
        </div>
      </footer>
    </div>
  )
}
