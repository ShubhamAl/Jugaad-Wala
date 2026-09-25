import { useState } from 'react'
import { Wrench, ChevronRight, AlertTriangle } from 'lucide-react'
import { comicScenes } from '../../data/comicScenes'
import { customers } from '../../data/customers'
import { useGameStore } from '../../store/gameStore'
import { GameButton } from '../ui/GameButton'
import { CustomerCharacter } from '../comic/CustomerCharacter'

export function DialoguePhase() {
  const currentCustomerIndex = useGameStore((state) => state.currentCustomerIndex)
  const currentSceneId = useGameStore((state) => state.currentSceneId)
  const startRepair = useGameStore((state) => state.startRepair)

  const customer = customers[currentCustomerIndex] || customers[0]
  const scene = comicScenes[currentSceneId] || comicScenes['ramesh-intro']

  const [panelIndex, setPanelIndex] = useState(0)
  const currentPanel = scene.panels[panelIndex] || scene.panels[0]
  const isLastPanel = panelIndex >= scene.panels.length - 1

  return (
    <div className="dialogue-phase-container">
      {/* Comic Header Ribbon */}
      <div className="phase-header-ribbon">
        <div className="phase-badge">PHASE 1 · CUSTOMER ARRIVAL</div>
        <div className="phase-subinfo">
          <span>{customer.label}</span>
          <span className="dot-sep">•</span>
          <span>Panel {panelIndex + 1} of {scene.panels.length}</span>
        </div>
      </div>

      {/* Main Comic Panel Frame */}
      <div className="dialogue-comic-stage">
        {/* Background Environment */}
        <div className="stage-backdrop garage-door-bg">
          <div className="shutter-lines" />
          <div className="sun-glare" />
          <div className="workshop-signboard">JUGAAD REPAIR COUNTER</div>
        </div>

        {/* Character Portrait */}
        <div className="dialogue-character-wrapper">
          <CustomerCharacter
            expression={currentPanel.expression}
            name={customer.name}
          />
          <div className="character-nameplate">
            <strong>{currentPanel.speaker}</strong>
            <small>Neighbour in distress</small>
          </div>
        </div>

        {/* Broken Item Preview on Counter */}
        <div className="broken-item-preview">
          <div className="item-silhouette">
            <span className="defect-badge">
              <AlertTriangle size={14} /> BROKEN
            </span>
            <div className="item-sketch">
              {customer.repairId === 'table-fan' ? '⚙️ 🌀' : '📻 ⚡'}
            </div>
            <p className="item-label">
              {customer.repairId === 'table-fan' ? 'Usha Table Fan' : 'Murphy Radio'}
            </p>
          </div>
        </div>

        {/* Comic Speech Bubble */}
        <div className="comic-speech-bubble-box">
          <div className="speech-tail" />
          <div className="speaker-tag">{currentPanel.speaker} says:</div>
          <p className="speech-quote">“{currentPanel.dialogue}”</p>
          {currentPanel.caption && (
            <div className="comic-caption-strip">
              <em>{currentPanel.caption}</em>
            </div>
          )}
        </div>
      </div>

      {/* Bottom Action Footer */}
      <footer className="dialogue-action-footer">
        <div className="dialogue-stepper-dots">
          {scene.panels.map((_, i) => (
            <button
              key={i}
              type="button"
              className={`step-dot ${i === panelIndex ? 'active' : ''}`}
              onClick={() => setPanelIndex(i)}
              aria-label={`Jump to panel ${i + 1}`}
            />
          ))}
        </div>

        <div className="dialogue-button-group">
          {!isLastPanel ? (
            <>
              <GameButton
                variant="secondary"
                onClick={() => setPanelIndex((prev) => Math.min(scene.panels.length - 1, prev + 1))}
              >
                NEXT PANEL <ChevronRight size={18} className="inline-icon" />
              </GameButton>
              <GameButton onClick={startRepair} className="repair-cta-btn">
                <Wrench size={18} className="inline-icon" />
                REPAIR NOW
              </GameButton>
            </>
          ) : (
            <GameButton onClick={startRepair} className="repair-cta-btn pulsate">
              <Wrench size={20} className="inline-icon" />
              REPAIR ({customer.name.toUpperCase()})
            </GameButton>
          )}
        </div>
      </footer>
    </div>
  )
}
