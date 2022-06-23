import { useSelector } from 'react-redux'
import { removeContestAsync, selectContestId, selectContestStatus } from '../../slices/contestSlice'
import { Tags } from '../../components/tags/Tags'
import { StrifeRoll } from '../../components/dice/StrifeRoll'
import { selectGameId } from '../../slices/gameSlice'
import { useAppDispatch } from '../../app/hooks'
import { AppDispatch } from '../../app/store'
import { selectIsStrifePlayer } from '../../slices/playerSlice'
import { selectCurrentStrife } from '../../slices/strifeSlice'
import { Button } from '../../components/Button'

const abandonContestHandler = (dispatch: AppDispatch, gameId: string, contestId: string) => () => {
    dispatch(removeContestAsync({ gameId, contestId }))
}

export const Challenge = () => {
    const dispatch = useAppDispatch()
    const gameId = useSelector(selectGameId)
    const contestId = useSelector(selectContestId)
    const strife = useSelector(selectCurrentStrife)
    const isStrifePlayer = useSelector(selectIsStrifePlayer)
    const status = useSelector(selectContestStatus)

    if (gameId === undefined || contestId === undefined || strife === undefined) {
        return <></>
    }

    const { harmTags } = strife

    return (
        <div className="mb-10">
            <section>
                <h2>
                    <div className="flex place-content-between">
                        {status === 'complete' ? <span>Contest Results</span> : <span>Join the Contest</span>}
                        {isStrifePlayer && status !== 'complete' && (
                            <Button
                                className="py-2"
                                primary={false}
                                onClick={abandonContestHandler(dispatch, gameId, contestId)}
                            >
                                Close Contest
                            </Button>
                        )}
                    </div>
                </h2>
                {status === 'complete' ? (
                    <p className="mb-16">
                        A record of how the Heroes fared in the Contest. Heroes should narrate their results in
                        ascending order - the Strife player should respond with the Opponents reactions.
                    </p>
                ) : (
                    <p className="mb-16">This is the challenge that the Heroes must strive to overcome.</p>
                )}
            </section>
            <section>
                <h3 className="mb-8">The Challenge</h3>
                <StrifeRoll className="mb-6" strife={strife} />
                <Tags tags={harmTags} />
            </section>
        </div>
    )
}
