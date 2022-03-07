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
    const timestamp = new Date().toISOString()
    const response = await axios.post(`${API_FQDN}/api/games/${gameId}/contests`, { timestamp })
    return response.data
}

export interface ContestUpdatePayload {
    id: string
    status: ContestStatusType
}

export const update = async (gameId: string, { id, status }: ContestUpdatePayload): Promise<Contest> => {
    const timestamp = new Date().toISOString()
    const response = await axios.put(`${API_FQDN}/api/games/${gameId}/contests/${id}`, { status, timestamp })
    return response.data
}

export const remove = async (gameId: string, contestId: string): Promise<boolean> => {
    await axios.delete(`${API_FQDN}/api/games/${gameId}/contests/${contestId}`)
    return true
}