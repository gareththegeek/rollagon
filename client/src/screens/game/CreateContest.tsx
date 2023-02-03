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
import { FieldSet } from '../../components/FieldSet'
import { BigButton } from '../../components/BigButton'
import { Placeholder } from '../../components/Placeholder'
import { Trans, useTranslation } from 'react-i18next'

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
    const { t } = useTranslation()
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
            <section>
                <h2>{t('Between Contests')}</h2>
                <p>
                    {t(
                        "You are a glorious Hero - strive to take on worthy opponents. If a challenge isn't glorious, you can accomplish it without need for a Contest."
                    )}
                </p>
                <Placeholder>{t('Waiting for the next Glorious Contest')}</Placeholder>
            </section>
        )
    }

    return (
        <>
            <section>
                <h2>{t('Create a Contest')}</h2>
                <p>{t('Create a contest whenever the heroes come into conflict with a worthy opponent.')}</p>
            </section>
            <FieldSet
                title={t('Set the Strife Level')}
                guidance={t('Adjust the strife level for permanent or temporary advantages or disadvantages.') ?? ''}
            >
                <StrifeLevelEditor
                    current={strife.strifeLevel}
                    onChange={strifeLevelChangeHandler(dispatch, gameId, contestId, strife)}
                />
            </FieldSet>
            <FieldSet
                title={t("Build the Opponent's Dice Pool")}
                guidance={t("Add dice for the Opponent's Name, Epithets, and any Bonus dice.") ?? ''}
            >
                <div className="flex flex-col xl:flex-row flex-wrap gap-2 md:gap-4">
                    <DicePoolEditor
                        dice={[6, 8, 10, 12]}
                        dicePool={strife.dicePool}
                        enabled={true}
                        onChange={diceChangeHandler(dispatch, gameId, contestId, strife)}
                    />
                </div>
            </FieldSet>
            <FieldSet
                title={t('Choose Harm Tags')}
                guidance={
                    <ul>
                        <li>
                            <Trans i18nKey="ChooseSacredHarm">
                                <b>Sacred</b> - Heroes spend Divine Favor if they suffer in the Contest.
                            </Trans>
                        </li>
                        <li>
                            <Trans i18nKey="ChoosePerilousHarm">
                                <b>Perilous</b> - Heroes mark Pathos if they suffer in the Contest.
                            </Trans>
                        </li>
                        <li>
                            <Trans i18nKey="ChooseMythicHarm">
                                <b>Mythic</b> - Heroes spend Divine Favor to enter the Contest.
                            </Trans>
                        </li>
                        <li>
                            <Trans i18nKey="ChooseEpicHarm">
                                <b>Epic</b> - Heroes mark Pathos to enter the Contest.
                            </Trans>
                        </li>
                    </ul>
                }
            >
                <HarmTagsEditor onChange={harmTagsChangeHandler(dispatch, gameId, contestId, strife)} />
            </FieldSet>
            <BigButton disabled={isLoading} onClick={rollContestHandler(dispatch, gameId, contestId)}>
                {t('Roll the Contest')}
            </BigButton>
        </>
    )
}
