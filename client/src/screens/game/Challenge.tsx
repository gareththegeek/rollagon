import { useSelector } from 'react-redux'
import { createContestAsync, removeContestAsync, selectContestId, selectContestStatus } from '../../slices/contestSlice'
import { Tags } from '../../components/tags/Tags'
import { StrifeRoll } from '../../components/dice/StrifeRoll'
import { selectGameId } from '../../slices/gameSlice'
import { useAppDispatch } from '../../app/hooks'
import { AppDispatch } from '../../app/store'
import { selectIsStrifePlayer } from '../../slices/playerSlice'
import { selectCurrentStrife } from '../../slices/strifeSlice'
import { Box } from '../../components/Box'
import { Button } from '../../components/Button'
import { H3 } from '../../components/H3'

const abandonContestHandler = (dispatch: AppDispatch, gameId: string, contestId: string) => () => {
    dispatch(removeContestAsync({ gameId, contestId }))
}

const createContestHandler = (dispatch: AppDispatch, gameId: string) => () => {
    dispatch(createContestAsync(gameId))
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
        <Box>
            <div className="flex justify-between">
                <H3 className="text-2xl mb-6">Challenge</H3>
                {isStrifePlayer && status !== 'complete' && (
                    <Button onClick={abandonContestHandler(dispatch, gameId, contestId)}>Abandon Contest</Button>
                )}
            </div>
            <StrifeRoll strife={strife} />
            <Tags tags={harmTags} />
            {isStrifePlayer && status === 'complete' && (
                <Button className="mt-8" onClick={createContestHandler(dispatch, gameId)}>Create New Contest</Button>
            )}
        </Box>
    )
}
