import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { useSearchParams } from 'react-router-dom'
import { Player } from '../../api/players'
import { useAppDispatch } from '../../app/hooks'
import { AppDispatch } from '../../app/store'
import { join, setGameId } from '../splash/gameSlice'
import { getPlayersAsync, createPlayerAsync, joinStrife, selectPlayers, joinHero } from './playerSlice'

const joinStrifeClick = (dispatch: AppDispatch) => () => {
    dispatch(joinStrife())
    dispatch(join())
}

const joinHeroClick = (dispatch: AppDispatch, player: Player) => {
    dispatch(joinHero(player))
    dispatch(join())
}

const createHeroClick = async (dispatch: AppDispatch, gameId: string, name: string) => {
    const player = await dispatch(createPlayerAsync({ gameId, player: { name } }))
    dispatch(joinHero(player))
    dispatch(join())
}

export const Lobby = () => {
    const dispatch = useAppDispatch()
    const [text, setText] = useState('')
    const [searchParams] = useSearchParams()
    const gameId = searchParams.get('gameId')!
    const players = useSelector(selectPlayers)

    useEffect(() => {
        dispatch(setGameId(gameId))
        dispatch(getPlayersAsync(gameId))
    }, [])

    return (
        <>
            <input value={text} onChange={(e) => setText(e.target.value)} />
            <button onClick={() => createHeroClick(dispatch, gameId, text)}>Join as new Hero</button>
            <button onClick={joinStrifeClick(dispatch)}>Join as Strife Player</button>
            <Players players={players} onClick={(player: Player) => joinHeroClick(dispatch, player)} />
        </>
    )
}
