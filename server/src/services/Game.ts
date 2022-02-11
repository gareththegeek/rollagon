export type ContestState = 'new' | 'targetSet' | 'complete'
export type DiceType = 'd4' | 'd6' | 'd8' | 'd10' | 'd12'
export type HarmTagType = 'sacred' | 'perilous' | 'mythic' | 'epic'

export interface Dice {
    type: DiceType
    roll: number
}

export interface DicePool {
    rolled: boolean
    score: number
    dice: Dice[]
}

export interface Contestant {
    playerName: string
    dicePool: DicePool
}

export interface Contest {
    sort: number
    state: ContestState
    strifeLevel: number
    dicePool: DicePool
    harmTags: HarmTagType[]
    targetNumber: number
    contestants: Contestant[]
}

export interface Player {
    name: string
}

export interface Game {
    id: string
    name: string
    createdOn: string
    contests: Contest[]
    players: Player[]
}
