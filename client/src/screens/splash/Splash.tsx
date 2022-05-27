import React, { ChangeEvent, useState } from 'react'
import { NavigateFunction, useNavigate } from 'react-router-dom'
import { useAppDispatch } from '../../app/hooks'
import { AppDispatch } from '../../app/store'
import { A } from '../../components/A'
import { BigButton } from '../../components/BigButton'
import { H1 } from '../../components/H1'
import { H3 } from '../../components/H3'
import { Input } from '../../components/Input'
import { createGameAsync } from '../../slices/gameSlice'

const createGameClick = (dispatch: AppDispatch, navigate: NavigateFunction) => async () => {
    const result = await dispatch(createGameAsync())
    if (result.meta.requestStatus === 'fulfilled') {
        navigate(`/join/${result.payload}`)
    }
}

export const Splash = () => {
    const dispatch = useAppDispatch()
    const navigate = useNavigate()
    const [text, setText] = useState('')

    return (
        <>
            <H1>Agon Dice Roller</H1>
            <p className="text-xl font-normal">This is a fan-made dice-rolling app for AGON. AGON is an action-packed roleplaying game about epic Heroes who face trials from the Gods in an ancient world of myth and legend. Learn more about it, and the Paragon system, at <A href="http://agon-rpg.com">agon-rpg.com</A></p>
            <H3>Start a New Session</H3>
            <p className="text-xl">Start a new session. You'll be able to invite other players with a unique URL.</p>
            <BigButton onClick={createGameClick(dispatch, navigate)} highlight={true}>
                Start New Game
            </BigButton>
            <H3>Have an Invite Link?</H3>
            <p className="text-xl">Paste it below or in your browser and click Join Game.</p>
            <Input
                value={text}
                onChange={(e: ChangeEvent<HTMLInputElement>) => setText(e.target.value)}
                placeholder="Existing game id"
            />
            <BigButton onClick={() => navigate(`/join/${text}`)} highlight={true}>Join Game</BigButton>
            <H3>About this Game</H3>
            <p className="text-xl py-2">At least one person playing should be familiar with the AGON rulebook.</p>
            <p className="text-xl py-2">This app is a lightweight dicerolling app, focused on resolving and narrating AGON Contests. It is not a campaign or character tracker - you'll still need to manage that on your own.</p>
            <p className="text-xl py-2">This app was created by <A href="">@gareth</A> and <A href="">@sporgory</A> with the help of the <A href="">AGON fan Discord community</A>.</p>
            <p className="text-xl py-2 mb-48">If you’d like to give feedback or get involved, check out the <A href="https://github.com/gareththegeek/rollagon">GitHub repo</A>.</p>
        </>
    )
}
