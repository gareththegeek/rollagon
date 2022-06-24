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
import { StrifeTarget } from '../../components/dice/StrifeTarget'

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

    const cancelButton = (mobile: boolean) => {
        if (!isStrifePlayer || status === 'complete') {
            return <></>
        }

        return (
            <Button
                className={`py-2 ${mobile ? 'w-full lg:hidden mb-3' : 'hidden lg:flex'}`}
                primary={false}
                onClick={abandonContestHandler(dispatch, gameId, contestId)}
            >
                Close Contest
            </Button>
        )
    }

    return (
        <div className="mb-10">
            <section>
                <h2>
                    <div className="flex flex-col lg:flex-row lg:place-content-between">
                        {status === 'complete' ? <span>Contest Results</span> : <span>Join the Contest</span>}
                        {cancelButton(false)}
                    </div>
                </h2>
                {cancelButton(true)}
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
                <div className="mb-4 md:mt-12 flex items-center gap-3">
                    <StrifeTarget strife={strife} />
                    <h3 className="flex-grow mt-0">The Challenge</h3>
                </div>
                <StrifeRoll className="mb-6" strife={strife} />
                <Tags tags={harmTags} />
            </section>
        </div>
    )
}
