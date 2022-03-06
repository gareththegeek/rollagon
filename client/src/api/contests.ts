import axios from 'axios'
import { API_FQDN } from './constants'
import { Strife } from './strife'

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
    prevail: boolean | undefined
    dicePool: DicePool
}

export interface Contest {
    id: string
    sort: number
    status: ContestStatusType
    strife: Strife
    contestants: { [id: string]: Contestant }
}

export const create = async (gameId: string): Promise<Contest> => {
    const response = await axios.post(`${API_FQDN}/api/games/${gameId}/contests`)
    return response.data
}
