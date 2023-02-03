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
import { useTranslation } from 'react-i18next'

const abandonContestHandler = (dispatch: AppDispatch, gameId: string, contestId: string) => () => {
    dispatch(removeContestAsync({ gameId, contestId }))
}

export const Challenge = () => {
    const { t } = useTranslation()
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
                padding="py-0.5 lg:py-1 px-4"
                className={mobile ? 'lg:hidden' : 'hidden lg:flex'}
                primary={false}
                onClick={abandonContestHandler(dispatch, gameId, contestId)}
            >
                {t('Close Contest')}
            </Button>
        )
    }

    return (
        <>
            <section className="gap-3">
                <h2>
                    <div className="flex flex-col lg:flex-row lg:place-content-between lg:items-center">
                        {status === 'complete' ? <span>{t('Contest Results')}</span> : <span>{t('Join the Contest')}</span>}
                        {cancelButton(false)}
                    </div>
                </h2>
                {cancelButton(true)}
                {status === 'complete' ? (
                    <p>
                        {t('A record of how the Heroes fared in the Contest. Heroes should narrate their results in ascending order - the Strife player should respond with the Opponents reactions.')}
                    </p>
                ) : (
                    <p>{t('This is the challenge that the Heroes must strive to overcome.')}</p>
                )}
            </section>
            <section>
                <div className="flex gap-3 items-center">
                    <StrifeTarget strife={strife} />
                    <div className="flex-grow"><h3 className="pb-2">{t('The Challenge')}</h3></div>
                </div>
                <StrifeRoll strife={strife} />
                <Tags tags={harmTags} />
            </section>
        </>
    )
}
