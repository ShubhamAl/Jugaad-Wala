import { useState } from 'react'
import {
  Wrench,
  RotateCcw,
  Sparkles,
  Zap,
  Info,
  CheckCircle,
  Play,
  Flame,
} from 'lucide-react'
import { customers } from '../../data/customers'
import { repairsMap } from '../../data/repairs'
import { useGameStore } from '../../store/gameStore'
import { GameButton } from '../ui/GameButton'

export function WorkshopPhase() {
  const currentCustomerIndex = useGameStore((state) => state.currentCustomerIndex)
  const repairState = useGameStore((state) => state.repairState)
  const appliedItems = useGameStore((state) => state.appliedItems)
  const selectedInventoryItem = useGameStore((state) => state.selectedInventoryItem)
  const selectInventoryItem = useGameStore((state) => state.selectInventoryItem)
  const applySelectedItem = useGameStore((state) => state.applySelectedItem)
  const testRepair = useGameStore((state) => state.testRepair)
  const forceFailure = useGameStore((state) => state.forceFailure)
  const resetRepair = useGameStore((state) => state.resetRepair)
  const feedback = useGameStore((state) => state.feedback)
  const inventory = useGameStore((state) => state.inventory)

  const customer = customers[currentCustomerIndex] || customers[0]
  const repair = repairsMap[customer.repairId] || repairsMap['table-fan']
  const dropZones = repair.dropZones || []

  const [hoveredZone, setHoveredZone] = useState<string | null>(null)

  const isFan = customer.repairId === 'table-fan'
  const isTesting = repairState === 'TESTING'

  // Determine drop zone click
  const handleZoneClick = (requiredItem: string) => {
    if (!selectedInventoryItem) {
      // Auto-select required item if available in inventory
      const hasItem = inventory.find((it) => it.id === requiredItem)
      if (hasItem) {
        selectInventoryItem(requiredItem)
      } else {
        useGameStore.setState({ feedback: `You need "${requiredItem.replace('-', ' ')}" for this spot!` })
      }
      return
    }

    applySelectedItem()
  }

  return (
    <div className="workshop-phase-container">
      {/* Workshop Top Banner */}
      <div className="workshop-top-banner">
        <div className="workbench-title-box">
          <span className="station-tag">PHASE 2 · 2D WORKBENCH</span>
          <h2>REPAIRING: {repair.name.toUpperCase()}</h2>
        </div>
        <div className="workbench-status-pill">
          <span className={`status-indicator ${repairState.toLowerCase()}`} />
          <strong>STATUS: {repairState}</strong>
        </div>
      </div>

      {/* Main 2D Workbench Table */}
      <div className="workbench-table-surface">
        {/* Wood grain & workbench markings */}
        <div className="workbench-mat">
          {/* Schematic / Blueprint Note */}
          <div className="blueprint-tag">
            <span className="bp-number">JOB #{customer.id.slice(-3)}</span>
            <p><strong>FAULT:</strong> {repair.damage}</p>
            <div className="required-steps-list">
              {repair.requiredSteps.map((step, idx) => {
                const isDone = appliedItems.length > idx
                return (
                  <span key={idx} className={`step-item ${isDone ? 'done' : ''}`}>
                    {isDone ? <CheckCircle size={12} className="inline-icon" /> : '○'} {step}
                  </span>
                )
              })}
            </div>
          </div>

          {/* Interactive 2D Item Schematic Display */}
          <div className={`item-2d-canvas ${isFan ? 'fan-mode' : 'radio-mode'} ${isTesting ? 'is-testing-shake' : ''}`}>
            {isFan ? (
              // 2D Table Fan Visual Representation
              <div className="fan-schematic">
                <div className={`fan-cage ${isTesting ? 'spinning-blades' : ''}`}>
                  <div className="blade blade-1" />
                  <div className="blade blade-2" />
                  <div className="blade blade-3" />
                  <div className="fan-center-cap">USHA</div>
                </div>
                <div className="fan-neck" />
                <div className="fan-base">
                  <span className="brand-dial">SPEED: 1-2-3</span>
                </div>
                {/* Exposed Wire Cable */}
                <div className="fan-power-cord">
                  <div className={`cord-line ${appliedItems.includes('wire') ? 'has-copper' : 'broken-gap'}`} />
                  {appliedItems.includes('electrical-tape') && (
                    <div className="tape-wrap-visual">TAPE SEALED</div>
                  )}
                </div>
              </div>
            ) : (
              // 2D Transistor Radio Visual Representation
              <div className="radio-schematic">
                <div className="radio-casing">
                  <div className="radio-speaker-grille">
                    <span /><span /><span /><span /><span />
                  </div>
                  <div className="radio-dial-display">
                    <span className="frequency-marker">MW 540 • 800 • 1200 kHz</span>
                  </div>
                  <div className={`radio-antenna ${appliedItems.includes('screwdriver') ? 'screwed-tight' : 'loose'}`} />
                  <div className="radio-battery-cavity">
                    {appliedItems.includes('old-battery') ? (
                      <div className="battery-installed">BATTERY 9V [OK]</div>
                    ) : (
                      <div className="battery-empty">SLOT EMPTY</div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Clickable Drop Zones over the faulty areas */}
            {dropZones.map((zone) => {
              const isApplied = appliedItems.includes(zone.requiredItemId)
              const isTargeted = selectedInventoryItem === zone.requiredItemId

              return (
                <div
                  key={zone.id}
                  className={`drop-zone-marker ${isApplied ? 'is-fixed' : ''} ${isTargeted ? 'is-targeted' : ''}`}
                  style={{ top: `${zone.y}%`, left: `${zone.x}%` }}
                  onClick={() => handleZoneClick(zone.requiredItemId)}
                  onMouseEnter={() => setHoveredZone(zone.hint)}
                  onMouseLeave={() => setHoveredZone(null)}
                  title={zone.label}
                >
                  <div className="drop-zone-ping" />
                  <div className="drop-zone-badge">
                    {isApplied ? (
                      <CheckCircle size={16} className="text-green" />
                    ) : (
                      <Zap size={16} className="text-yellow" />
                    )}
                    <span>{isApplied ? 'FIXED' : zone.label}</span>
                  </div>
                </div>
              )
            })}

            {/* Sparks / Smoke Overlay when testing */}
            {isTesting && (
              <div className="testing-effects-overlay">
                <Sparkles className="spark-particle spark-1" size={32} />
                <Sparkles className="spark-particle spark-2" size={28} />
                <span className="comic-sfx-text">VRRRRRR!</span>
              </div>
            )}
          </div>

          {/* Feedback & Hint Bar */}
          <div className="workbench-feedback-strip" role="status">
            <Info size={16} className="feedback-icon" />
            <span>{hoveredZone || feedback}</span>
          </div>
        </div>

        {/* 2D Toolbox Panel */}
        <aside className="workbench-toolbox">
          <div className="toolbox-header">
            <p className="eyebrow">CHHOTU'S TOOLBOX</p>
            <h3>PARTS & MATERIALS</h3>
            <span className="toolbox-tip">
              {selectedInventoryItem ? 'Click zone or Apply' : 'Select an item to apply'}
            </span>
          </div>

          <div className="toolbox-items-grid">
            {inventory.map((item) => {
              const isSelected = selectedInventoryItem === item.id
              const isAlreadyUsed = appliedItems.includes(item.id)

              return (
                <button
                  key={item.id}
                  type="button"
                  className={`tool-card ${isSelected ? 'selected' : ''} ${isAlreadyUsed ? 'used' : ''}`}
                  onClick={() => selectInventoryItem(item.id)}
                  title={`${item.name}: ${item.description}`}
                >
                  <span className="tool-icon">{item.icon}</span>
                  <strong className="tool-name">{item.name}</strong>
                  <span className="tool-qty">×{item.quantity}</span>
                  {isAlreadyUsed && <span className="applied-pill">APPLIED</span>}
                </button>
              )
            })}
          </div>

          {/* Quick Apply Button if item selected */}
          <div className="toolbox-apply-action">
            <GameButton
              disabled={!selectedInventoryItem || isTesting}
              onClick={() => applySelectedItem()}
              className="apply-selected-btn"
            >
              <Wrench size={16} className="inline-icon" />
              {selectedInventoryItem
                ? `APPLY ${selectedInventoryItem.replace('-', ' ').toUpperCase()}`
                : 'SELECT ITEM FIRST'}
            </GameButton>
          </div>
        </aside>
      </div>

      {/* Workshop Bottom Controls */}
      <footer className="workshop-footer-actions">
        <div className="left-controls">
          <GameButton variant="secondary" onClick={resetRepair} disabled={isTesting}>
            <RotateCcw size={16} className="inline-icon" />
            RESET FIX
          </GameButton>
        </div>

        <div className="right-controls">
          {repairState !== 'READY_TO_TEST' && (
            <GameButton variant="secondary" onClick={forceFailure} disabled={isTesting}>
              <Flame size={16} className="inline-icon" />
              TEST ANYWAY (RISKY)
            </GameButton>
          )}

          <GameButton
            onClick={testRepair}
            disabled={repairState !== 'READY_TO_TEST' || isTesting}
            className={`test-jugaad-btn ${repairState === 'READY_TO_TEST' ? 'ready-pulse' : ''}`}
          >
            <Play size={18} className="inline-icon" />
            {isTesting ? 'TESTING IN PROGRESS...' : 'TEST JUGAAD!'}
          </GameButton>
        </div>
      </footer>
    </div>
  )
}
