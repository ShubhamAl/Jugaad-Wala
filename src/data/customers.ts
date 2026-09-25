import type { CustomerData } from '../types/game'

export const customers: CustomerData[] = [
  {
    id: 'customer-001',
    name: 'Ramesh bhai',
    label: 'Ramesh bhai (Neighbour)',
    problemText: 'Bhai, yeh fan achanak ruk gaya! It is burning hot outside and my kids cannot sleep without hava. Please kuch jugaad karo!',
    introSceneId: 'ramesh-intro',
    successSceneId: 'ramesh-success',
    failureSceneId: 'ramesh-failure',
    repairId: 'table-fan',
    reward: 150,
    satisfactionReward: 10,
  },
  {
    id: 'customer-002',
    name: 'Sharma Uncle',
    label: 'Sharma Uncle (Cricket Fanatic)',
    problemText: 'Antenna hil gaya aur battery bhi gul hai! India-Pakistan final shuru hone wala hai, commentary sunna hai mujhe!',
    introSceneId: 'sharma-intro',
    successSceneId: 'sharma-success',
    failureSceneId: 'sharma-failure',
    repairId: 'transistor-radio',
    reward: 220,
    satisfactionReward: 15,
  },
]

export const firstCustomer: CustomerData = customers[0]
