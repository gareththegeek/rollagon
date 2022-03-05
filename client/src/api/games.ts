import axios from 'axios'
import { API_FQDN } from './constants'
import { Contest } from './contests'
import { Player } from './players'

export interface Game {
    id: string
    createdOn: string
    contests: { [id: string]: Contest }
    players: { [id: string]: Player }
}

export const create = async () => {
    const response = await axios.post(`${API_FQDN}/api/games`)
    return response.data
}

export const get = async (gameId: string): Promise<Game> => {
    const response = await axios.get(`${API_FQDN}/api/games/${gameId}`)
    return response.data
}
