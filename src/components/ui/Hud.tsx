import { useGameStore } from '../../store/gameStore'

export function Hud() {
  const money = useGameStore((state) => state.money)
  const satisfaction = useGameStore((state) => state.customerSatisfaction)
  const visibleSatisfaction = Math.min(10, Math.max(0, satisfaction))

  return (
    <header className="game-hud" aria-label="Game status">
      <div className="hud-brand">
        <span className="hud-sign">JG</span>
        <div><strong>JUGAAD GARAGE</strong><small>repair &amp; improvisation</small></div>
      </div>
      <div className="hud-stats">
        <span className="money">₹{money}</span>
        <span className="satisfaction" aria-label={`Customer satisfaction ${satisfaction} out of 10`}>
          {'●'.repeat(visibleSatisfaction)}{'○'.repeat(10 - visibleSatisfaction)}
        </span>
      </div>
    </header>
  )
}
