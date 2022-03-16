import React, { useState } from 'react'
import { NavigateFunction, useNavigate } from 'react-router-dom'
import { useAppDispatch } from '../../app/hooks'
import { AppDispatch } from '../../app/store'
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
        <div className="container max-w-screen-sm mx-auto text-center flex flex-col">
            <h1 className="text-5xl">Paragon Dice Roller</h1>
            <button onClick={createGameClick(dispatch, navigate)}>Create Game</button>
            <input value={text} onChange={(e) => setText(e.target.value)} />
            <button onClick={() => navigate(`/join/${text}`)}>Join Game</button>
        </div>
    )
}
