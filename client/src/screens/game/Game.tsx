import React, { useEffect, useState } from 'react'
import { useCustomTranslation } from '../../app/useCustomTranslation'
import { useSelector } from 'react-redux'
import { useNavigate, useParams } from 'react-router'
import { useAppDispatch } from '../../app/hooks'
import { selectContestStatus } from '../../slices/contestSlice'
import { getGameAsync, selectGameId, selectTab, TabType } from '../../slices/gameSlice'
import { Challenge } from './Challenge'
import { EnterContest } from './EnterContest'
import { CreateContest } from './CreateContest'
import { ContestResult } from './ContestResult'
import { Notes } from '../../components/notes/Notes'
import { Header } from '../../components/header/Header'
import { About } from '../about/About'
import { BurgerMenu } from '../../components/header/BurgerMenu'
import { BurgerButton } from '../../components/header/BurgerButton'
import { Errors } from '../../components/header/Errors'

export const Game = () => {
    const dispatch = useAppDispatch()
    const navigate = useNavigate()
    const gameId = useSelector(selectGameId)
    const params = useParams()
    const contestStatus = useSelector(selectContestStatus)
    const tab = useSelector(selectTab)
    const { t } = useCustomTranslation()

    const [menuOpen, setMenuOpen] = useState(false)

    const handleMenuClick = () => {
        setMenuOpen(!menuOpen)
    }

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
        <div className="md:flex md:items-stretch max-w-screen-xl md:mx-auto">
            <h4 className="flex md:hidden -mx-3 border-b-2 py-3 fixed top-0 w-full bg-grey-100 z-10">
                <BurgerButton onClick={handleMenuClick} isOpen={menuOpen} />
                {t('Agon Dice Roller')}
            </h4>
            {menuOpen ? (
                <BurgerMenu onTabChange={() => setMenuOpen(false)} />
            ) : (
                <>
                    <Header />
                    <main className="mt-16 w-full min-h-screen">
                        <Errors />
                        {tab === TabType.Contests && (
                            <>
                                {contestStatus === 'new' && <CreateContest />}
                                {contestStatus !== 'new' && <Challenge />}
                                {contestStatus === 'targetSet' && <EnterContest />}
                                {contestStatus === 'complete' && <ContestResult />}
                            </>
                        )}
                        {tab === TabType.Notes && <Notes />}
                        {tab === TabType.About && <About />}
                    </main>
                </>
            )}
        </div>
    )
}
