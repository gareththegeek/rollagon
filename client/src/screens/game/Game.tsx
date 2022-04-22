import React, { useEffect } from 'react'
import { useSelector } from 'react-redux'
import { useNavigate, useParams } from 'react-router'
import { useAppDispatch } from '../../app/hooks'
import { Players } from '../../components/players/Players'
import { selectContestStatus } from '../../slices/contestSlice'
import { getGameAsync, selectGameId } from '../../slices/gameSlice'
import { Challenge } from './Challenge'
import { EnterContest } from './EnterContest'
import { CreateContest } from './CreateContest'
import { ContestResult } from './ContestResult'
import { Notes } from '../../components/notes/Notes'

export const Game = () => {
    const dispatch = useAppDispatch()
    const navigate = useNavigate()
    const gameId = useSelector(selectGameId)
    const params = useParams()
    const contestStatus = useSelector(selectContestStatus)

    useEffect(() => {
        if (gameId !== undefined) {
            dispatch(getGameAsync(gameId!))
        } else if (params.gameId !== undefined) {
            navigate(`/join/${params.gameId}`)
        } else {
            navigate('/')
        }
    }, [dispatch, navigate, gameId, params.gameId])

    if (gameId === undefined) {
        return <></>
    }
    
    return (
        <div>
            {contestStatus === 'new' && <CreateContest />}
            {contestStatus !== 'new' && <Challenge />}
            {contestStatus === 'targetSet' && <EnterContest />}
            {contestStatus === 'complete' && <ContestResult />}
            <Notes />
            <Players />
        </div>
    )
}
