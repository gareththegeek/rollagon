import { useSelector } from 'react-redux'
import { Strife } from '../../api/strife'
import { useAppDispatch } from '../../app/hooks'
import { AppDispatch } from '../../app/store'
import { rollTargetNumberAsync, selectContestId, selectContestStoreStatus } from '../../slices/contestSlice'
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
    const strife = useSelector(selectCurrentStrife)
    const status = useSelector(selectContestStoreStatus)
    const contestId = useSelector(selectContestId)

    if (gameId === undefined || contestId === undefined || strife === undefined) {
        return <></>
    }

    return (
        <div>
            <div>
                <h2>Create a Contest</h2>
                <div>
                    <h3>Strife Level</h3>
                    <StrifeLevelEditor onChange={strifeLevelChangeHandler(dispatch, gameId, contestId, strife)} />
                </div>
                <div>
                    <h3>Dice Pool</h3>
                    <DicePoolEditor
                        dice={[6, 8, 10, 12]}
                        dicePool={strife.dicePool}
                        enabled={true}
                        onChange={diceChangeHandler(dispatch, gameId, contestId, strife)}
                    />
                </div>
                <div>
                    <h3>Harm Tags</h3>
                    <HarmTagsEditor onChange={harmTagsChangeHandler(dispatch, gameId, contestId, strife)} />
                </div>
                <button disabled={status === 'loading'} onClick={rollContestHandler(dispatch, gameId, contestId)}>
                    Roll the Contest
                </button>
            </div>
        </div>
    )
}
