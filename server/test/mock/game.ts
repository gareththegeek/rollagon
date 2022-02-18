import { Contest, Game, Player } from '../../src/services/Game'
import { mockPlayer } from './player'
import { mockContest } from './contest'

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

export const mockGameWithContests = (gameId: string, contestIds: string[]): Game => ({
    ...mockGame(gameId),
    contests: contestIds.reduce((a, id, i) => {
        a[id] = mockContest(id, i + 1)
        return a
    }, {} as { [id: string]: Contest })
})

export const mockGameWithContestsAndPlayers = (gameId: string, contestIds: string[], playerIds: string[]): Game => ({
    ...mockGameWithPlayers(gameId, playerIds),
    contests: contestIds.reduce((a, id, i) => {
        a[id] = mockContest(id, i + 1)
        return a
    }, {} as { [id: string]: Contest })
})
