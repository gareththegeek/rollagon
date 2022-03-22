import React, { ChangeEvent, useState } from 'react'
import { NavigateFunction, useNavigate } from 'react-router-dom'
import { useAppDispatch } from '../../app/hooks'
import { AppDispatch } from '../../app/store'
import { Button } from '../../components/Button'
import { H1 } from '../../components/H1'
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
            <H1>Paragon Dice Roller</H1>
            <div className="m-8">
                <h2 className="mb-2 text-xl">Create a new game and share the link with your friends</h2>
                <Button onClick={createGameClick(dispatch, navigate)} highlight={true}>Create Game</Button>
            </div>
            <div className="m-8">
                <h2 className="mb-2">Already got a game id? Enter it here</h2>
                <Input
                    value={text}
                    onChange={(e: ChangeEvent<HTMLInputElement>) => setText(e.target.value)}
                    placeholder="Existing game id"
                />
                <Button onClick={() => navigate(`/join/${text}`)}>
                    Join Game
                </Button>
            </div>
        </>
    )
}
