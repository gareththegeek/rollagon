import { rollDice } from '.'
import { Contest, Contestant, Dice } from '../services/Game'

const calculateScore = (dice: Dice[]): number => {
    if (dice.some(x => x.roll === undefined)) {
        throw new Error('Expected all dice to have been rolled')
    }

    const d4s = [...dice.filter(x => x.type === 'd4')]
    const pool = [...dice.filter(x => x.type !== 'd4')] as [Dice, Dice, ...Dice[]]

    d4s.sort((a, b) => b.roll! - a.roll!)
    pool.sort((a, b) => b.roll! - a.roll!)

    if (pool.length < 2) {
        throw new Error(`Expected at least 2 dice but got ${dice.length}`)
    }

    const base = pool[0].roll! + pool[1].roll!
    const favour = d4s.length > 0 ? d4s[0]!.roll! : 0

    return base + favour
}

export const rollContest = (contest: Contest): Contest => {
    const rolled = Object.values(contest.contestants).map(x => ({
        ...x,
        dicePool: {
            rolled: true,
            score: undefined,
            dice: rollDice(x.dicePool.dice)
        }
    }))

    const scored = rolled.map(x => ({
        ...x,
        dicePool: {
            ...x.dicePool,
            score: calculateScore(x.dicePool.dice)
        }
    }))

    const contestants = scored.map(x => ({
        ...x,
        prevail: x.dicePool.score >= contest.strife.targetNumber!
    }))

    return {
        ...contest,
        status: 'complete',
        contestants: contestants.reduce((a, x) => { a[x.playerId] = x; return a }, {} as { [id: string]: Contestant })
    }
}
