export type ContestStatusType = 'new' | 'targetSet' | 'complete'
export type DiceType = 'd4' | 'd6' | 'd8' | 'd10' | 'd12'
export type HarmTagType = 'sacred' | 'perilous' | 'mythic' | 'epic'

export interface Dice {
    type: DiceType
    roll: number | undefined
}

export interface DicePool {
    rolled: boolean
    score: number | undefined
    dice: Dice[]
}

export interface Contestant {
    playerId: string
    ready: boolean
    prevail: boolean
    dicePool: DicePool
}

export interface Strife {
    strifeLevel: number
    dicePool: DicePool
    harmTags: HarmTagType[]
    targetNumber: number | undefined
}

export interface Contest {
    id: string
    sort: number
    status: ContestStatusType
    strife: Strife
    contestants: { [id: string]: Contestant }
}

export interface Player {
    id: string
    name: string
}

export interface Game {
    id: string
    name: string
    createdOn: string
    contests: { [id: string]: Contest }
    players: { [id: string]: Player }
}
