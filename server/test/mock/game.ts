import { Game } from '../../src/services/Game'

export const mockGame = (id: string): Game => ({
    id,
    name: 'Some random game name',
    createdOn: '2022-02-01T12:34:56.123Z',
    contests: {},
    players: {}
})
