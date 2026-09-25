import { create } from 'zustand'
import { customers, firstCustomer } from '../data/customers'
import { starterInventory } from '../data/items'
import { applyItemToRepair, isRepairReady } from '../game/systems/repairSystem'
import type { GamePhase, GameState, InventoryItem, RepairOutcome, RepairState } from '../types/game'
import { audioManager } from '../utils/audioManager'

interface GameStore {
  // Navigation State Machine
  gameState: GameState
  gamePhase: GamePhase
  currentCustomerIndex: number
  currentSceneId: string

  // Repair & Workshop State
  repairState: RepairState
  outcome: RepairOutcome
  feedback: string
  selectedInventoryItem: string | null
  appliedItems: string[]
  inventory: InventoryItem[]
  toolboxOpen: boolean

  // Player Stats
  money: number
  customerSatisfaction: number

  // Settings
  soundEnabled: boolean
  musicEnabled: boolean
  volume: number
  debugOpen: boolean

  // Actions
  setGameState: (state: GameState) => void
  setGamePhase: (phase: GamePhase) => void
  goToMenu: () => void
  startGame: () => void
  startRepair: () => void
  selectInventoryItem: (itemId: string | null) => void
  applySelectedItem: (targetZoneId?: string) => void
  testRepair: () => void
  finishTest: () => void
  forceFailure: () => void
  nextCustomer: () => void
  toggleToolbox: () => void
  resetRepair: () => void

  // Settings Actions
  toggleSound: () => void
  toggleMusic: () => void
  setVolume: (val: number) => void
  toggleDebug: () => void
}

const initialRepairState: RepairState = 'BROKEN'

export const useGameStore = create<GameStore>((set, get) => ({
  gameState: 'MENU',
  gamePhase: 'PHASE_1_DIALOGUE',
  currentCustomerIndex: 0,
  currentSceneId: firstCustomer.introSceneId,

  repairState: initialRepairState,
  outcome: null,
  feedback: 'Inspect the broken item and check what parts you have.',
  selectedInventoryItem: null,
  appliedItems: [],
  inventory: starterInventory,
  toolboxOpen: true,

  money: 0,
  customerSatisfaction: 5,

  soundEnabled: true,
  musicEnabled: true,
  volume: 0.8,
  debugOpen: false,

  setGameState: (state) => {
    audioManager.play('button')
    set({ gameState: state })
  },

  setGamePhase: (phase) => {
    audioManager.play('button')
    set({ gamePhase: phase })
  },

  goToMenu: () => {
    audioManager.play('button')
    set({
      gameState: 'MENU',
      gamePhase: 'PHASE_1_DIALOGUE',
      repairState: initialRepairState,
      outcome: null,
      selectedInventoryItem: null,
      appliedItems: [],
      feedback: 'Welcome back to Jugaad Repair Shop.',
    })
  },

  startGame: () => {
    audioManager.play('button')
    const customer = customers[get().currentCustomerIndex] || firstCustomer
    set({
      gameState: 'GAME',
      gamePhase: 'PHASE_1_DIALOGUE',
      currentSceneId: customer.introSceneId,
      repairState: initialRepairState,
      outcome: null,
      appliedItems: [],
      selectedInventoryItem: null,
      feedback: 'New customer at the counter. Hear their problem!',
    })
  },

  startRepair: () => {
    audioManager.play('button')
    const customer = customers[get().currentCustomerIndex] || firstCustomer
    set({
      gamePhase: 'PHASE_2_WORKSHOP',
      repairState: 'INSPECTING',
      appliedItems: [],
      selectedInventoryItem: null,
      toolboxOpen: true,
      feedback: `Inspecting ${customer.name}'s item. Open toolbox to pick tools or materials.`,
    })
  },

  selectInventoryItem: (itemId) => {
    if (itemId) audioManager.play('tool')
    set((state) => ({
      selectedInventoryItem: state.selectedInventoryItem === itemId ? null : itemId,
      feedback: itemId ? `Selected "${itemId.replace('-', ' ')}". Click a matching zone on the item or the apply button.` : 'Selection cleared.',
    }))
  },

  applySelectedItem: () => {
    const state = get()
    const customer = customers[state.currentCustomerIndex] || firstCustomer
    if (!state.selectedInventoryItem) {
      set({ feedback: 'Toolbox se koi item pehle select karo!' })
      return
    }

    const result = applyItemToRepair(customer.repairId, state.appliedItems, state.selectedInventoryItem)
    if (result.accepted) {
      audioManager.play('repair')
    } else {
      audioManager.play('failure')
    }

    set({
      appliedItems: result.nextAppliedItems,
      repairState: result.nextState,
      feedback: result.feedback,
      selectedInventoryItem: result.accepted ? null : state.selectedInventoryItem,
    })
  },

  testRepair: () => {
    const state = get()
    const customer = customers[state.currentCustomerIndex] || firstCustomer
    audioManager.play('button')

    if (!isRepairReady(customer.repairId, state.appliedItems)) {
      set({ feedback: 'Abhi test mat karo — jugaad poora nahi hua hai!' })
      return
    }

    set({
      repairState: 'TESTING',
      selectedInventoryItem: null,
      feedback: 'Testing... hold your breath and flip the switch!',
    })

    window.setTimeout(() => {
      get().finishTest()
    }, 1200)
  },

  finishTest: () => {
    const state = get()
    const customer = customers[state.currentCustomerIndex] || firstCustomer
    audioManager.play('success')

    set((s) => ({
      repairState: 'FIXED',
      outcome: 'success',
      gamePhase: 'PHASE_3_REACTION',
      currentSceneId: customer.successSceneId,
      money: s.money + customer.reward,
      customerSatisfaction: Math.min(10, s.customerSatisfaction + customer.satisfactionReward),
      feedback: 'JUGAAD KAMYAB! Customer is thrilled!',
    }))
  },

  forceFailure: () => {
    const state = get()
    const customer = customers[state.currentCustomerIndex] || firstCustomer
    audioManager.play('failure')

    set((s) => ({
      repairState: 'FAILED',
      outcome: 'failure',
      gamePhase: 'PHASE_3_REACTION',
      currentSceneId: customer.failureSceneId || customer.introSceneId,
      customerSatisfaction: Math.max(0, s.customerSatisfaction - 3),
      feedback: 'Puff of smoke! The jugaad fell apart!',
    }))
  },

  nextCustomer: () => {
    audioManager.play('button')
    const nextIdx = (get().currentCustomerIndex + 1) % customers.length
    const nextCust = customers[nextIdx]
    set({
      currentCustomerIndex: nextIdx,
      currentSceneId: nextCust.introSceneId,
      gamePhase: 'PHASE_1_DIALOGUE',
      repairState: initialRepairState,
      outcome: null,
      appliedItems: [],
      selectedInventoryItem: null,
      feedback: `A new customer (${nextCust.name}) has arrived at the counter!`,
    })
  },

  toggleToolbox: () => {
    audioManager.play('button')
    set((state) => ({ toolboxOpen: !state.toolboxOpen }))
  },

  resetRepair: () => {
    audioManager.play('tool')
    set({
      repairState: 'INSPECTING',
      appliedItems: [],
      selectedInventoryItem: null,
      feedback: 'Workbench reset. Try a different combination of items.',
    })
  },

  toggleSound: () => {
    const next = !get().soundEnabled
    audioManager.setSfxEnabled(next)
    if (next) audioManager.play('button')
    set({ soundEnabled: next })
  },

  toggleMusic: () => {
    const next = !get().musicEnabled
    audioManager.setMusicEnabled(next)
    audioManager.play('button')
    set({ musicEnabled: next })
  },

  setVolume: (val) => {
    audioManager.setVolume(val)
    set({ volume: val })
  },

  toggleDebug: () => {
    set((state) => ({ debugOpen: !state.debugOpen }))
  },
}))
