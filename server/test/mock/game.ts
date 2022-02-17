import { Game, Player } from '../../src/services/Game'
import { mockPlayer } from './player'

export const mockGame = (id: string): Game => ({
    name: 'Some random game name',
    id,
    createdOn: '2022-02-01T12:34:56.123Z',
    contests: {},
    players: {}
})

export const mockGameWithPlayers = (gameId: string, playerIds: string[]): Game => ({
    ...mockGame(gameId),
    players: playerIds.reduce((a, id) => {
        a[id] = mockPlayer(id)
        return a
    }, {} as { [id: string]: Player })
})
