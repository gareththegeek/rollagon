import axios from 'axios'
import { API_FQDN } from './constants'

export interface Player {
    id?: string
    name: string
}

export const get = async (gameId: string): Promise<Player[]> => {
    const response = await axios.get(`${API_FQDN}/api/games/${gameId}/players`)
    return response.data as Player[]
}

export const create = async (gameId: string, player: Player): Promise<Player> => {
    const response = await axios.post(`${API_FQDN}/api/games/${gameId}/players`, player)
    return response.data
}
