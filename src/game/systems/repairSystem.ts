import { repairsMap } from '../../data/repairs'
import type { RepairState } from '../../types/game'

export interface ItemApplication {
  accepted: boolean
  nextAppliedItems: string[]
  nextState: RepairState
  feedback: string
}

export function applyItemToRepair(
  repairId: string,
  appliedItems: string[],
  itemId: string
): ItemApplication {
  const repair = repairsMap[repairId]
  if (!repair) {
    return {
      accepted: false,
      nextAppliedItems: appliedItems,
      nextState: 'BROKEN',
      feedback: 'Item not recognized.',
    }
  }

  const recipe = repair.availableRecipes[0]

  if (appliedItems.includes(itemId)) {
    return {
      accepted: false,
      nextAppliedItems: appliedItems,
      nextState: appliedItems.length === recipe.itemIds.length ? 'READY_TO_TEST' : 'REPAIRING',
      feedback: 'Yeh part pehle se hi apply ho chuka hai!',
    }
  }

  const expectedItem = recipe.itemIds[appliedItems.length]

  if (itemId !== expectedItem) {
    const isUsefulLater = recipe.itemIds.includes(itemId)
    const feedback = isUsefulLater
      ? 'Order galat hai! Pehle dusra step pura karo.'
      : 'Yeh item yahan match nahi ho raha. Toolbox mein kuch aur dekho!'

    return {
      accepted: false,
      nextAppliedItems: appliedItems,
      nextState: appliedItems.length === 0 ? 'INSPECTING' : 'REPAIRING',
      feedback,
    }
  }

  const nextAppliedItems = [...appliedItems, itemId]
  const complete = nextAppliedItems.length === recipe.itemIds.length

  let feedback = 'Step successfully completed!'
  if (complete) {
    feedback = 'Jugaad setup ready! Ab TEST button dabao to see if it works!'
  } else if (repairId === 'table-fan') {
    feedback = 'Wire lag gaya! Ab insulation ke liye electrical tape se wrap karo.'
  } else if (repairId === 'transistor-radio') {
    feedback = 'Battery fit ho gayi! Ab screw driver se tuning dial tight karo.'
  }

  return {
    accepted: true,
    nextAppliedItems,
    nextState: complete ? 'READY_TO_TEST' : 'REPAIRING',
    feedback,
  }
}

export function isRepairReady(repairId: string, appliedItems: string[]): boolean {
  const repair = repairsMap[repairId]
  if (!repair) return false
  const recipe = repair.availableRecipes[0]
  return (
    appliedItems.length === recipe.itemIds.length &&
    recipe.itemIds.every((item, index) => appliedItems[index] === item)
  )
}
