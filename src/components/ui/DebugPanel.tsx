import { useGameStore } from '../../store/gameStore'

export function DebugPanel() {
  const debugOpen = useGameStore((state) => state.debugOpen)
  const gameState = useGameStore((state) => state.gameState)
  const gamePhase = useGameStore((state) => state.gamePhase)
  const repairState = useGameStore((state) => state.repairState)
  const selectedInventoryItem = useGameStore((state) => state.selectedInventoryItem)
  const appliedItems = useGameStore((state) => state.appliedItems)
  const money = useGameStore((state) => state.money)
  const satisfaction = useGameStore((state) => state.customerSatisfaction)

  if (!debugOpen) return null

  return (
    <aside className="debug-panel" aria-label="Developer Debug Info">
      <strong>DEBUG · F1</strong>
      <span>gameState: {gameState}</span>
      <span>gamePhase: {gamePhase}</span>
      <span>repairState: {repairState}</span>
      <span>selectedItem: {selectedInventoryItem ?? 'none'}</span>
      <span>appliedItems: [{appliedItems.join(', ')}]</span>
      <span>cash: ₹{money} · sat: {satisfaction}/10</span>
    </aside>
  )
}
