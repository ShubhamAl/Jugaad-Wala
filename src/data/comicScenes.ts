import type { ComicSceneData } from '../types/game'

export const comicScenes: Record<string, ComicSceneData> = {
  'ramesh-intro': {
    id: 'ramesh-intro',
    title: 'Episode 1: The Sweaty Summer Standoff',
    actionLabel: 'OPEN WORKBENCH',
    panels: [
      {
        id: 'arrival',
        setting: 'garage-door',
        expression: 'neutral',
        speaker: 'Ramesh bhai',
        dialogue: 'Oye Chhotu! Bhai zara urgent case dekhna... pura mohalla pighal raha hai!',
        caption: '1:15 PM · Heat index 43°C in the galli.',
      },
      {
        id: 'show-fan',
        setting: 'counter',
        expression: 'worried',
        speaker: 'Ramesh bhai',
        dialogue: 'Table fan chalte chalte "phurr" karke dhuwan chhod diya aur so gaya.',
      },
      {
        id: 'worry',
        setting: 'garage-door',
        expression: 'worried',
        speaker: 'Ramesh bhai',
        dialogue: 'Naya lene jaaun toh 2000 rupaye mangta hai dukanwala! Ghar pe biwi gussa hai.',
      },
      {
        id: 'request',
        setting: 'counter',
        expression: 'neutral',
        speaker: 'Ramesh bhai',
        dialogue: 'Mujhe pata hai tu Jugaad ka badshah hai. Kuch taar-patti laga ke chala de!',
      },
    ],
  },
  'ramesh-success': {
    id: 'ramesh-success',
    title: 'The Great Indian Jugaad Triumphs!',
    actionLabel: 'COLLECT CASH & CONTINUE',
    panels: [
      {
        id: 'surprised',
        setting: 'counter',
        expression: 'happy',
        speaker: 'Ramesh bhai',
        dialogue: 'Arrey baap re! Yeh toh hawa chhodne laga! Sann-sann karke ghoom raha hai!',
      },
      {
        id: 'working',
        setting: 'garage-door',
        expression: 'happy',
        speaker: 'Ramesh bhai',
        dialogue: 'Wire aur electrical tape ka kya zabardast janta connection maara hai tune!',
      },
      {
        id: 'gratitude',
        setting: 'counter',
        expression: 'happy',
        speaker: 'Ramesh bhai',
        dialogue: 'Yeh le ₹150 aur thandi chai pee mere taraf se! Tu toh rockstar nikla bhai!',
        caption: 'Status: Ramesh survived the afternoon. Fan status: 100% Jugaad certified.',
      },
    ],
  },
  'ramesh-failure': {
    id: 'ramesh-failure',
    title: 'A Silent Motor and Cold Stares',
    actionLabel: 'TRY JUGAAD AGAIN',
    panels: [
      {
        id: 'confused',
        setting: 'counter',
        expression: 'disappointed',
        speaker: 'Ramesh bhai',
        dialogue: 'Switch dabaya toh bas ek halki si "tik" aayi aur kuch nahi...',
      },
      {
        id: 'complaint',
        setting: 'garage-door',
        expression: 'disappointed',
        speaker: 'Ramesh bhai',
        dialogue: 'Lagta hai wire ulta laga diya ya tape theek se chipkaya nahi tune.',
      },
      {
        id: 'exit',
        setting: 'garage-door',
        expression: 'disappointed',
        speaker: 'Ramesh bhai',
        dialogue: 'Wapas check kar workbench pe... garmi se dimaag ka dahi ho raha hai!',
      },
    ],
  },
  'sharma-intro': {
    id: 'sharma-intro',
    title: 'Episode 2: The Final Over Crisis',
    actionLabel: 'OPEN WORKBENCH',
    panels: [
      {
        id: 'sharma-1',
        setting: 'garage-door',
        expression: 'neutral',
        speaker: 'Sharma Uncle',
        dialogue: 'Arey beta! Akhri teen over bache hain aur radio ne achanak dum tod diya!',
        caption: '3:45 PM · Match is down to the wire.',
      },
      {
        id: 'sharma-2',
        setting: 'counter',
        expression: 'worried',
        speaker: 'Sharma Uncle',
        dialogue: 'Battery thandi pad gayi aur tuning dial ka screw dheet ho gaya hai.',
      },
      {
        id: 'sharma-3',
        setting: 'counter',
        expression: 'neutral',
        speaker: 'Sharma Uncle',
        dialogue: 'Jaldi se battery badal aur dial tight kar de... Ravi Shastri ki aawaz sunni hai!',
      },
    ],
  },
  'sharma-success': {
    id: 'sharma-success',
    title: 'Commentary Restored: SIX ON THE LAST BALL!',
    actionLabel: 'COLLECT CASH & CONTINUE',
    panels: [
      {
        id: 'sharma-win-1',
        setting: 'counter',
        expression: 'happy',
        speaker: 'Sharma Uncle',
        dialogue: 'SHABASH! "WHAT A SHOT OVER EXTRA COVER!" Aawaz bilkul clear aane lagi!',
      },
      {
        id: 'sharma-win-2',
        setting: 'garage-door',
        expression: 'happy',
        speaker: 'Sharma Uncle',
        dialogue: 'Yeh le ₹220 pura inam! Teri dukan ka naam main mohalle ke WhatsApp group mein daalunga!',
        caption: 'India won by 4 runs. Sharma Uncle gave a 5-star Google review.',
      },
    ],
  },
  'sharma-failure': {
    id: 'sharma-failure',
    title: 'Static Screams & Missed Moments',
    actionLabel: 'RE-OPEN RADIO WORKBENCH',
    panels: [
      {
        id: 'sharma-fail-1',
        setting: 'counter',
        expression: 'disappointed',
        speaker: 'Sharma Uncle',
        dialogue: 'Bas "khshhhhh" aawaz aa rahi hai beta... wicket gir gaya hoga wahan!',
      },
      {
        id: 'sharma-fail-2',
        setting: 'garage-door',
        expression: 'disappointed',
        speaker: 'Sharma Uncle',
        dialogue: 'Check the battery slot and tighten the screw properly!',
      },
    ],
  },
}
