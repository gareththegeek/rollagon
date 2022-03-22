import { useSelector } from 'react-redux'
import { Strife } from '../../api/strife'
import { useAppDispatch } from '../../app/hooks'
import { AppDispatch } from '../../app/store'
import { rollTargetNumberAsync, selectContestId } from '../../slices/contestSlice'
import { selectGameId } from '../../slices/gameSlice'
import { DicePoolEditor } from '../../components/dice/DicePoolEditor'
import { StrifeLevelEditor } from './StifeLevelEditor'
import { HarmTagsEditor } from '../../components/tags/HarmTagsEditor'
import { HarmTagType } from '../../api/strife'
import {
    strifeDiceChangeAsync,
    strifeLevelChangeAsync,
    harmTagsChangeAsync,
    selectCurrentStrife
} from '../../slices/strifeSlice'
import { selectIsLoading } from '../../slices/statusSlice'
import { selectIsStrifePlayer } from '../../slices/playerSlice'
import { Box } from '../../components/Box'
import { Button } from '../../components/Button'

const diceChangeHandler =
    (dispatch: AppDispatch, gameId: string, contestId: string, strife: Strife) => (type: string, quantity: number) => {
        dispatch(strifeDiceChangeAsync({ gameId, contestId, strife, type, quantity }))
    }

const strifeLevelChangeHandler =
    (dispatch: AppDispatch, gameId: string, contestId: string, strife: Strife) => (strifeLevel: number) => {
        dispatch(strifeLevelChangeAsync({ gameId, contestId, strife, strifeLevel }))
    }

const harmTagsChangeHandler =
    (dispatch: AppDispatch, gameId: string, contestId: string, strife: Strife) => (harmTags: HarmTagType[]) => {
        dispatch(harmTagsChangeAsync({ gameId, contestId, strife, harmTags }))
    }

const rollContestHandler = (dispatch: AppDispatch, gameId: string, contestId: string) => () => {
    dispatch(rollTargetNumberAsync({ gameId, contestId }))
}

export const CreateContest = () => {
    const dispatch = useAppDispatch()
    const gameId = useSelector(selectGameId)
    const isStrifePlayer = useSelector(selectIsStrifePlayer)
    const strife = useSelector(selectCurrentStrife)
    const isLoading = useSelector(selectIsLoading)
    const contestId = useSelector(selectContestId)

    if (gameId === undefined || contestId === undefined || strife === undefined) {
        return <></>
    }

    if (!isStrifePlayer) {
        return <Box className="text-center">Waiting for next Contest...</Box>
    }

    return (
        <Box>
            <h2 className="text-2xl mb-6">Create a Contest</h2>
            <div className="my-6">
                <h3 className="my-2">Strife Level</h3>
                <StrifeLevelEditor current={strife.strifeLevel} onChange={strifeLevelChangeHandler(dispatch, gameId, contestId, strife)} />
            </div>
            <div className="my-6">
                <h3 className="my-2">Dice Pool</h3>
                <DicePoolEditor
                    dice={[6, 8, 10, 12]}
                    dicePool={strife.dicePool}
                    enabled={true}
                    onChange={diceChangeHandler(dispatch, gameId, contestId, strife)}
                />
            </div>
            <div className="my-6">
                <h3 className="my-2">Harm Tags</h3>
                <HarmTagsEditor onChange={harmTagsChangeHandler(dispatch, gameId, contestId, strife)} />
            </div>
            <Button disabled={isLoading} onClick={rollContestHandler(dispatch, gameId, contestId)} highlight={true}>
                Roll the Contest
            </Button>
        </Box>
    )
}
