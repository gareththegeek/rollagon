import React, { useState } from 'react'
import { SmallButton } from '../SmallButton'
import { H3 } from '../H3'
import { Loading } from './Loading'
import { Divider } from '../Divider'
import { Players } from '../players/Players'
import { useSelector } from 'react-redux'
import {
    selectGameId,
    selectIsContestsTab,
    selectIsNotesTab,
    setTab,
    TabType
} from '../../slices/gameSlice'
import { generateInviteLink } from '../../api/players'
import { AppDispatch } from '../../app/store'
import { useAppDispatch } from '../../app/hooks'

const inviteLinkHandler =
    (
        gameId: string,
        setOpacity: React.Dispatch<React.SetStateAction<boolean>>,
        setTransition: React.Dispatch<React.SetStateAction<boolean>>
    ) =>
    () => {
        const url = generateInviteLink(gameId)
        navigator.clipboard.writeText(url)
        setOpacity(true)
        setTimeout(() => {
            setTransition(true)
            setOpacity(false)
            setTimeout(() => {
                setTransition(false)
            }, 1000)
        }, 0)
    }

const setTabHandler = (dispatch: AppDispatch, tab: string) => () => {
    dispatch(setTab(tab))
}

export const Header = () => {
    const gameId = useSelector(selectGameId)
    const dispatch = useAppDispatch()

    const isContestsTab = useSelector(selectIsContestsTab)
    const isNotesTab = useSelector(selectIsNotesTab)
    //const isAboutTab = useSelector(selectIsAboutTab)

    const [opacity, setOpacity] = useState(false)
    const [transition, setTransition] = useState(false)

    return (
        <header className="border-r-2 mr-32 pr-6 box-content">
            <div className="flex flex-col items-end sticky top-16">
                <Loading />
                <H3 className="w-64 text-right border-b-0 mt-2 text-black">Agon Roller</H3>
                <nav className="flex flex-col items-end">
                    <SmallButton
                        className="mr-0 mb-4"
                        selected={isContestsTab}
                        onClick={setTabHandler(dispatch, TabType.Contests)}
                    >
                        Contests
                    </SmallButton>
                    <SmallButton
                        className="mr-0 mb-5"
                        selected={isNotesTab}
                        onClick={setTabHandler(dispatch, TabType.Notes)}
                    >
                        Notes
                    </SmallButton>
                </nav>
                <div className="flex w-full">
                    <Divider />
                </div>
                <div className="relative">
                    <div
                        className={`${transition ? 'transition-opacity duration-1000' : ''} ${
                            opacity ? 'opacity-1' : 'opacity-0'
                        } absolute mb-2 text-center text-base`}
                    >
                        Copied to clipboard!
                    </div>
                    {gameId !== undefined && (
                        <SmallButton
                            className="mr-0 mt-8 mb-4"
                            onClick={inviteLinkHandler(gameId, setOpacity, setTransition)}
                        >
                            Copy Invite Link
                        </SmallButton>
                    )}
                </div>
                <Players />
                {/* TODO Implement About Page */}
                {/* <div className="flex w-full mt-5">
                    <Divider />
                </div>
                <SmallButton
                    className="mr-0 mt-8"
                    selected={isAboutTab}
                    onClick={setTabHandler(dispatch, TabType.About)}
                >
                    About This App
                </SmallButton> */}
            </div>
        </header>
    )
}
