import { useSelector } from 'react-redux'
import { removeContestAsync, selectContestId, selectCurrentStrife } from '../../slices/contestSlice'
import { Tags } from '../../components/tags/Tags'
import { StrifeRoll } from '../../components/dice/StrifeRoll'
import { selectGameId } from '../../slices/gameSlice'
import { useAppDispatch } from '../../app/hooks'
import { AppDispatch } from '../../app/store'
import { selectIsStrifePlayer } from '../../slices/playerSlice'

const abandonContestHandler = (dispatch: AppDispatch, gameId: string, contestId: string) => () => {
    dispatch(removeContestAsync({gameId, contestId}))
}

export const Challenge = () => {
    const dispatch = useAppDispatch()
    const gameId = useSelector(selectGameId)
    const contestId = useSelector(selectContestId)
    const strife = useSelector(selectCurrentStrife)
    const isStrifePlayer = useSelector(selectIsStrifePlayer)

    if (gameId === undefined || contestId === undefined || strife === undefined) {
        return <></>
    }

    const { harmTags } = strife

    return (
        <div>
            <div>
                <h2>Challenge</h2>
                <StrifeRoll strife={strife} />
                <Tags tags={harmTags} />
                {isStrifePlayer &&
                    <button onClick={abandonContestHandler(dispatch, gameId, contestId)}>
                        Abandon Contest
                    </button>}
            </div>
        </div>
    )
}
