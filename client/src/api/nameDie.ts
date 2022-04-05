import axios from 'axios'
import { API_FQDN } from './constants'
import { Dice, Contestant } from './contestants'

export const update = async (gameId: string, contestId: string, contestantId: string, nameDie: Partial<Dice>): Promise<Contestant> => {
    const result = await axios.put(`${API_FQDN}/api/games/${gameId}/contests/${contestId}/contestants/${contestantId}/nameDie`, nameDie)
    return result.data
}
