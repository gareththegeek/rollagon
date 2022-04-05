import axios from 'axios'
import { API_FQDN } from './constants'

export type DiceType = 'd4' | 'd6' | 'd8' | 'd10' | 'd12'

export interface Dice {
    type: DiceType
    roll: number | undefined
}

export interface DicePool {
    rolled: boolean
    score: number | undefined
    dice: Dice[]
    nameDie?: Dice | undefined
}

export interface Contestant {
    playerId: string
    timestamp: string
    ready: boolean
    prevail: boolean | undefined
    dicePool: DicePool
}

export const create = async (gameId: string, contestId: string, playerId: string): Promise<Contestant> => {
    const timestamp = new Date().toISOString()
    const result = await axios.post(`${API_FQDN}/api/games/${gameId}/contests/${contestId}/contestants`, { playerId, timestamp })
    return result.data
}

export const update = async (gameId: string, contestId: string, contestant: Contestant): Promise<Contestant> => {
    const timestamp = new Date().toISOString()
    const result = await axios.put(`${API_FQDN}/api/games/${gameId}/contests/${contestId}/contestants/${contestant.playerId}`, { ...contestant, timestamp })
    return result.data
}

export const remove = async (gameId: string, contestId: string, contestantId: string): Promise<boolean> => {
    await axios.delete(`${API_FQDN}/api/games/${gameId}/contests/${contestId}/contestants/${contestantId}`)
    return true
}
