export type ContestStatusType = 'new' | 'targetSet' | 'complete'
export type DiceType = 'd4' | 'd6' | 'd8' | 'd10' | 'd12'
export type HarmTagType = 'sacred' | 'perilous' | 'mythic' | 'epic'

export interface Dice {
    type: DiceType
    roll?: number | undefined
}

export interface DicePool {
    rolled: boolean
    score?: number | undefined
    dice: Dice[]
    nameDie?: Dice | undefined
}

export interface Contestant {
    timestamp?: string | undefined
    playerId: string
    ready: boolean
    prevail?: boolean | undefined
    dicePool: DicePool
}

export interface Strife {
    timestamp?: string | undefined
    strifeLevel: number
    dicePool: DicePool
    harmTags: HarmTagType[]
    targetNumber?: number | undefined
}

export interface Contest {
    id: string
    timestamp?: string | undefined
    sort: number
    status: ContestStatusType
    strife: Strife
    contestants: { [id: string]: Contestant }
}

export interface Player {
    id: string
    timestamp?: string | undefined
    name: string
}

export interface Game {
    id: string
    createdOn: string
    contests: { [id: string]: Contest }
    players: { [id: string]: Player }
}
