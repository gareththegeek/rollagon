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
import { H2 } from '../../components/H2'
import { FieldSet } from '../../components/FieldSet'
import { BigButton } from '../../components/BigButton'
import { Placeholder } from '../../components/Placeholder'

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
        return (
            <>
                <H2>Between Contests</H2>
                <p className="mb-16">You are a glorious Hero - strive to take on worthy opponents. If a challenge isn't glorious, you can accomplish it without need for a Contest.</p>
                <Placeholder>Waiting for the next Glorious Contest</Placeholder>
            </>
        )
    }

    return (
        <>
            <H2>Create a Contest</H2>
            <p className="pb-6">Create a contest whenever the heroes come into conflict with a worthy opponent.</p>
            <FieldSet
                title="Set the Strife Level"
                guidance="Adjust the strife level for permanent or temporary advantages or disadvantages."
            >
                <StrifeLevelEditor
                    current={strife.strifeLevel}
                    onChange={strifeLevelChangeHandler(dispatch, gameId, contestId, strife)}
                />
            </FieldSet>
            <FieldSet
                title="Build the Opponent's Dice Pool"
                guidance="Add dice for the Opponent’s Name, Epithets, and any Bonus dice."
            >
                <div className="flex flex-row flex-wrap">
                    <DicePoolEditor
                        dice={[6, 8, 10, 12]}
                        dicePool={strife.dicePool}
                        enabled={true}
                        onChange={diceChangeHandler(dispatch, gameId, contestId, strife)}
                    />
                </div>
            </FieldSet>
            <FieldSet
                title="Choose Harm Tags"
                guidance={
                    <ul>
                        <li>
                            <b>Sacred</b> - Heroes spend Divine Favor if they suffer in the Contest.
                        </li>
                        <li>
                            <b>Perilous</b> - Heroes mark Pathos if they suffer in the Contest.
                        </li>
                        <li>
                            <b>Mythic</b> - Heroes spend Divine Favor to enter the Contest.
                        </li>
                        <li>
                            <b>Epic</b> - Heroes mark Pathos to enter the Contest."
                        </li>
                    </ul>
                }
            >
                <HarmTagsEditor onChange={harmTagsChangeHandler(dispatch, gameId, contestId, strife)} />
            </FieldSet>
            <BigButton className="mt-10" disabled={isLoading} onClick={rollContestHandler(dispatch, gameId, contestId)}>
                Roll the Contest
            </BigButton>
        </>
    )
}
