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
    const timestamp = new Date().toISOString()
    const response = await axios.post(`${API_FQDN}/api/games/${gameId}/players`, { ...player, timestamp })
    return response.data
}

const getAbsolute = (function () {
    let a: HTMLAnchorElement | undefined = undefined

    return (url: string) => {
        if (a === undefined) {
            a = document.createElement('a')
        }
        a.href = url

        return a.href
    }
})()

export const generateInviteLink = (gameId: string, theme?: string): string =>
    getAbsolute(`/join/${gameId}${!!theme ? `?theme=${theme}` : ''}`)
