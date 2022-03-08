import axios from 'axios'
import { API_FQDN } from './constants'
import { Contestant } from './contests'

export const create = async (gameId: string, contestId: string, playerId: string): Promise<Contestant> => {
    const timestamp = new Date().toISOString()
    const result = await axios.post(`${API_FQDN}/api/games/${gameId}/contests/${contestId}/contestants`, { playerId, timestamp })
    return result.data
}
