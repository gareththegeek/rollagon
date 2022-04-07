import axios from 'axios'
import { API_FQDN } from './constants'

export interface Note {
    id: string
    timestamp: string
    text: string
}

export const create = async (gameId: string, text: string): Promise<Note> => {
    const timestamp = new Date().toISOString()
    const response = await axios.post(`${API_FQDN}/api/games/${gameId}/notes`, { timestamp, text })
    return response.data
}

export const remove = async (gameId: string, noteId: string): Promise<boolean> => {
    await axios.delete(`${API_FQDN}/api/games/${gameId}/notes/${noteId}`)
    return true
}
