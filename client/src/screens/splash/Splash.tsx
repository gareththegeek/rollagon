import React, { ChangeEvent, useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router'
import { useAppDispatch } from '../../app/hooks'
import { createGameAsync, selectGameId, setGameId } from './splashSlice'

export const Splash = () => {
    const dispatch = useAppDispatch()
    const navigate = useNavigate()
    const gameId = useSelector(selectGameId)
    const [text, setText] = useState('')

    useEffect(() => {
        if (gameId !== undefined) {
            navigate(`/join/${gameId}`, { replace: true })
        }
    }, [gameId])
    
    return (
        <>
            <button onClick={() => dispatch(createGameAsync())}>Create Game</button>
            <input value={text} onChange={(e) => setText(e.target.value)} />
            <button onClick={() => dispatch(setGameId(text))}>Join Game</button>
        </>
    )
}
