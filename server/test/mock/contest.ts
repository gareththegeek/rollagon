import { Contest } from '../../src/services/Game'

export const mockContest = (id: string, sort: number): Contest => ({
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
