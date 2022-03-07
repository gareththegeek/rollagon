import { useSelector } from 'react-redux'
import { selectContestId, selectCurrentStrife } from '../../slices/contestSlice'
import { Tags } from './Tags'
import { StrifeRoll } from '../../components/dice/StrifeRoll'
import { selectGameId } from '../../slices/gameSlice'

export const Challenge = () => {
    const strife = useSelector(selectCurrentStrife)

    if (strife === undefined) {
        return <></>
    }

    const {
        dicePool,
        strifeLevel,
        harmTags
    } = strife

    return <div>
        <div>
            <h2>Challenge</h2>
            <StrifeRoll strife={strife} />
            <div>Tags:</div><Tags tags={harmTags} />
        </div>
    </div>
}
