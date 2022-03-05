import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { NavigateFunction, useNavigate } from 'react-router-dom'
import { useAppDispatch } from '../../app/hooks'
import { AppDispatch } from '../../app/store'
import { createGameAsync } from '../../slices/gameSlice'

const createGameClick = (dispatch: AppDispatch, navigate: NavigateFunction) => async () => {
    const gameId = await dispatch(createGameAsync()).unwrap()
    navigate(`/join/${gameId}`)
}

export const Splash = () => {
    const dispatch = useAppDispatch()
    const navigate = useNavigate()
    const [text, setText] = useState('')

    return (
        <>
            <button onClick={createGameClick(dispatch, navigate)}>Create Game</button>
            <input value={text} onChange={(e) => setText(e.target.value)} />
            <button onClick={() => navigate(`/join/${text}`)}>Join Game</button>
        </>
    )
}
