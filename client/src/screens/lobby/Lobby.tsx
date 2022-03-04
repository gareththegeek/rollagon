import React, { useEffect, useState } from 'react'
import { NavigateFunction, useNavigate, useParams } from 'react-router-dom'
import { Player } from '../../api/players'
import { useAppDispatch } from '../../app/hooks'
import { AppDispatch } from '../../app/store'
import { Players } from '../../components/Players'
import { join, setGameId } from '../splash/gameSlice'
import { getPlayersAsync, createPlayerAsync, joinStrife, joinHero } from './playerSlice'

const joinClick = (dispatch: AppDispatch, navigate: NavigateFunction) => {
    dispatch(join())
    navigate('/game')
}

const joinStrifeClick = (dispatch: AppDispatch, navigate: NavigateFunction) => () => {
    dispatch(joinStrife())
    joinClick(dispatch, navigate)
}

const joinHeroClick = (dispatch: AppDispatch, navigate: NavigateFunction, player: Player) => {
    dispatch(joinHero(player))
    joinClick(dispatch, navigate)
}

const createHeroClick = async (dispatch: AppDispatch, navigate: NavigateFunction, gameId: string, name: string) => {
    const player = await dispatch(createPlayerAsync({ gameId, player: { name } }))
    dispatch(joinHero(player))
    joinClick(dispatch, navigate)
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
            <button onClick={() => createHeroClick(dispatch, navigate, gameId!, text)}>Join as new Hero</button>
            <button onClick={joinStrifeClick(dispatch, navigate)}>Join as Strife Player</button>
            <Players onClick={(player: Player) => joinHeroClick(dispatch, navigate, player)} />
        </>
    )
}
