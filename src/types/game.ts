export type GameState = 'MENU' | 'HOW_TO_PLAY' | 'SETTINGS' | 'GAME'

export type GamePhase = 'PHASE_1_DIALOGUE' | 'PHASE_2_WORKSHOP' | 'PHASE_3_REACTION'

export type RepairState =
  | 'BROKEN'
  | 'INSPECTING'
  | 'REPAIRING'
  | 'READY_TO_TEST'
  | 'TESTING'
  | 'FIXED'
  | 'FAILED'

export type RepairOutcome = 'success' | 'failure' | null
export type CustomerExpression = 'neutral' | 'worried' | 'happy' | 'disappointed'

export interface InventoryItem {
  id: string
  name: string
  category: 'tool' | 'material' | 'component'
  description: string
  icon: string
  quantity: number
  usable: boolean
  tags: string[]
}

export interface RepairRecipe {
  id: string
  itemIds: string[]
  description: string
}

export interface DropZone {
  id: string
  label: string
  requiredItemId: string
  status: 'empty' | 'fixed' | 'wrong'
  x: number // percentage
  y: number // percentage
  hint: string
}

export interface RepairableObject {
  id: string
  name: string
  state: RepairState
  damage: string
  requiredSteps: string[]
  availableRecipes: RepairRecipe[]
  dropZones?: DropZone[]
}

export interface ComicPanelData {
  id: string
  setting: string
  expression: CustomerExpression
  dialogue: string
  speaker: string
  caption?: string
}

export interface ComicSceneData {
  id: string
  title: string
  panels: ComicPanelData[]
  actionLabel: string
}

export interface CustomerData {
  id: string
  name: string
  label: string
  problemText: string
  itemImage?: string
  introSceneId: string
  successSceneId: string
  failureSceneId?: string
  repairId: string
  reward: number
  satisfactionReward: number
}
