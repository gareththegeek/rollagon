import { Contest } from '../../src/services/Game'

export const mockContest = (id: string, sort: number): Contest => ({
    timestamp: '2022-01-01T00:00:00.000Z',
    id,
    sort,
    status: 'new',
    strife: {
        strifeLevel: 5,
        targetNumber: undefined,
        harmTags: [],
        dicePool: {
            score: undefined,
            rolled: false,
            dice: []
        }
    },
    contestants: {}
})
