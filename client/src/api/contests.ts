import axios from 'axios'
import { API_FQDN } from './constants'
import { Contestant } from './contestants'
import { Strife } from './strife'

export type ContestStatusType = 'new' | 'targetSet' | 'complete'

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