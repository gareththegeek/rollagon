import axios from 'axios'
import { API_FQDN } from './constants'

export const create = async () => {
    const response = await axios.post(`${API_FQDN}/api/games`)
    return response.data
}
