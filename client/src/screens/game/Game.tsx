import React, { useEffect } from 'react'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router'
import { useAppDispatch } from '../../app/hooks'
import { Players } from '../../components/players/Players'
import { selectContestStatus } from '../../slices/contestSlice'
import { getGameAsync, selectGameId } from '../../slices/gameSlice'
import { selectIsStrifePlayer } from '../../slices/playerSlice'
import { Challenge } from './Challenge'
import { EnterContest } from './EnterContest'
import { CreateContest } from './CreateContest'
import { ContestResult } from './ContestResult'

export const Game = () => {
    const dispatch = useAppDispatch()
    const navigate = useNavigate()
    const gameId = useSelector(selectGameId)
    const contestStatus = useSelector(selectContestStatus)
    console.log(contestStatus)
    const isStrifePlayer = useSelector(selectIsStrifePlayer)

    useEffect(() => {
        if (gameId !== undefined) {
            dispatch(getGameAsync(gameId!))
        } else {
            navigate('/')
        }
    }, [dispatch, navigate, gameId])

    if (gameId === undefined) {
        return <></>
    }
    
    return (
        <div>
            Game
            {contestStatus === 'new' && isStrifePlayer && <CreateContest />}
            {contestStatus !== 'new' && <Challenge />}
            {contestStatus === 'targetSet' && <EnterContest />}
            {contestStatus === 'complete' && <ContestResult />}
            <Players />
        </div>
    )
}
