import React, { useEffect, useState } from 'react'
import { NavigateFunction, useNavigate, useParams } from 'react-router-dom'
import { Player } from '../../api/players'
import { useAppDispatch } from '../../app/hooks'
import { AppDispatch } from '../../app/store'
import { Players } from '../../components/Players'
import { setGameId } from '../../slices/gameSlice'
import { getPlayersAsync, joinHeroAsync, joinStrifeAsync } from '../../slices/playerSlice'

const joinStrifeClick = (dispatch: AppDispatch, navigate: NavigateFunction, gameId: string) => () => {
    dispatch(joinStrifeAsync(gameId))
    navigate('/game')
}

const joinHeroClick = async (dispatch: AppDispatch, navigate: NavigateFunction, gameId: string, player: Player) => {
    await dispatch(joinHeroAsync({ gameId, player }))
    navigate('/game')
}

export const Lobby = () => {
    const dispatch = useAppDispatch()
    const navigate = useNavigate()
    const [text, setText] = useState('')
    const { gameId } = useParams()

    useEffect(() => {
        dispatch(setGameId(gameId))
        dispatch(getPlayersAsync(gameId!))
    }, [])

    return (
        <>
            <input value={text} onChange={(e) => setText(e.target.value)} />
            <button onClick={() => joinHeroClick(dispatch, navigate, gameId!, { name: text })}>Join as new Hero</button>
            <button onClick={joinStrifeClick(dispatch, navigate, gameId!)}>Join as Strife Player</button>
            <Players onClick={(player: Player) => joinHeroClick(dispatch, navigate, gameId!, player)} />
        </>
    )
}
