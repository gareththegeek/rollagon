import React, { ChangeEvent, useState } from 'react'
import { Trans, useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import { NavigateFunction, useNavigate } from 'react-router-dom'
import { useAppDispatch } from '../../app/hooks'
import { AppDispatch } from '../../app/store'
import { A } from '../../components/A'
import { BigButton } from '../../components/BigButton'
import { Input } from '../../components/Input'
import { createGameAsync } from '../../slices/gameSlice'
import { selectIsLoading } from '../../slices/statusSlice'

const createGameClick = (dispatch: AppDispatch, navigate: NavigateFunction) => async () => {
    const result = await dispatch(createGameAsync())
    if (result.meta.requestStatus === 'fulfilled') {
        navigate(`/join/${result.payload}`)
    }
}

export const Splash = () => {
    const dispatch = useAppDispatch()
    const navigate = useNavigate()
    const isLoading = useSelector(selectIsLoading)
    const [text, setText] = useState('')
    const { t } = useTranslation()

    return (
        <div className="max-w-screen-md md:mx-auto mt-8 md:mt-16">
            <main>
                <section>
                    <h1>Agon Dice Roller</h1>
                    <p>
                        <Trans i18nKey="AboutAgonDiceRoller">
                            This is a fan-made dice-rolling app for AGON. AGON is an action-packed roleplaying game about epic Heroes who face trials from the Gods in an ancient world of myth and legend. Learn more about it, and the Paragon system, at <A href="http://agon-rpg.com">agon-rpg.com</A>
                        </Trans>
                    </p>
                </section>
                <section>
                    <h3>{t('Start a New Session')}</h3>
                    <p>{t('Start a new session. You\'ll be able to invite other players with a unique URL.')}</p>
                    <BigButton disabled={isLoading} onClick={createGameClick(dispatch, navigate)}>
                        {t('Start New Game')}
                    </BigButton>
                </section>
                <section>
                    <h3>{t('Have an Invite Link?')}</h3>
                    <p>{t('Paste it below or in your browser and click Join Game.')}</p>
                    <Input
                        className="w-full"
                        aria-label={t('Existing game id') ?? ""}
                        value={text}
                        onChange={(e: ChangeEvent<HTMLInputElement>) => setText(e.target.value)}
                        placeholder={t('Existing game id') ?? ""}
                    />
                    <BigButton onClick={() => navigate(`/join/${text}`)}>{t('Join Game')}</BigButton>
                </section>
                <aside className="flex flex-col">
                    <h3>{t('About this App')}</h3>
                    <p>
                        <Trans i18nKey="AboutRules">
                            At least one person playing should be familiar with the AGON rulebook.
                        </Trans>
                    </p>
                    <p>
                        <Trans i18nKey="AboutApp">
                            This app is a lightweight dicerolling app, focused on resolving and narrating AGON Contests. It is not a campaign or character tracker - you'll still need to manage that on your own.
                        </Trans>
                    </p>
                    <p>
                        <Trans i18nKey="AboutAgon">
                            This app was created by <A href="https://www.reddit.com/user/gareththegeek/">@gareth</A> and <A href="https://twitter.com/sporgory">@sporgory</A> with the help of the <A href="https://discord.gg/2kWxhJywGq">AGON fan Discord community</A>.
                        </Trans>
                    </p>
                    <p>
                        <Trans i18nKey="AboutFeedback">
                            If you'd like to give feedback or get involved, check out the <A href="https://github.com/gareththegeek/rollagon">GitHub repo</A>.
                        </Trans>
                    </p>
                </aside>
            </main>
        </div>
    )
}
