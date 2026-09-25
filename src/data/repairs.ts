import type { RepairableObject } from '../types/game'

export const tableFanRepair: RepairableObject = {
  id: 'table-fan',
  name: 'Usha Vintage Table Fan',
  state: 'BROKEN',
  damage: 'Loose wire connector & uninsulated joint.',
  requiredSteps: [
    'Inspect the disconnected power terminal',
    'Bridge connection using copper wire',
    'Insulate and secure joint with electrical tape',
  ],
  availableRecipes: [
    {
      id: 'fan-loose-connection',
      itemIds: ['wire', 'electrical-tape'],
      description: 'A clean copper bridge secured with sturdy tape.',
    },
  ],
  dropZones: [
    {
      id: 'terminal-wire',
      label: 'Exposed Motor Terminal',
      requiredItemId: 'wire',
      status: 'empty',
      x: 38,
      y: 64,
      hint: 'Bridge the terminal gap with copper wire!',
    },
    {
      id: 'tape-joint',
      label: 'Insulation Sleeve',
      requiredItemId: 'electrical-tape',
      status: 'empty',
      x: 62,
      y: 64,
      hint: 'Wrap and insulate with black electrical tape!',
    },
  ],
}

export const transistorRadioRepair: RepairableObject = {
  id: 'transistor-radio',
  name: 'Murphy Transistor Radio',
  state: 'BROKEN',
  damage: 'Dead battery & antenna connection severed.',
  requiredSteps: [
    'Replace weak power cell with fresh battery',
    'Fasten loose antenna with screwdriver',
  ],
  availableRecipes: [
    {
      id: 'radio-repair',
      itemIds: ['old-battery', 'screwdriver'],
      description: 'Jugaad power hookup and tune-up.',
    },
  ],
  dropZones: [
    {
      id: 'battery-slot',
      label: 'Battery Compartment',
      requiredItemId: 'old-battery',
      status: 'empty',
      x: 40,
      y: 60,
      hint: 'Pop in a working power battery!',
    },
    {
      id: 'antenna-joint',
      label: 'Tuning Dial Screw',
      requiredItemId: 'screwdriver',
      status: 'empty',
      x: 65,
      y: 40,
      hint: 'Tighten the calibration screw with a screwdriver!',
    },
  ],
}

export const repairsMap: Record<string, RepairableObject> = {
  'table-fan': tableFanRepair,
  'transistor-radio': transistorRadioRepair,
}
