import { useSelector } from 'react-redux'
import { selectCurrentContest } from '../../slices/contestSlice'
import { DicePool } from '../../components/dice/DicePool'
import { Tags } from './Tags'

export const Contest = () => {
    const contest = useSelector(selectCurrentContest)

    if (contest === undefined) {
        return <></>
    }

    const {
        dicePool,
        strifeLevel,
        harmTags
    } = contest.strife

    return <div>
        <div>
            <h2>Contest</h2>
            <div>Strife Level:</div><div>{strifeLevel}</div>
            <div>Dice:</div><DicePool dicePool={dicePool} />
            <div>Tags:</div><Tags tags={harmTags} />
        </div>
    </div>
}
