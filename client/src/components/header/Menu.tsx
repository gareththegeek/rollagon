import { FC, useState } from 'react'
import { useSelector } from 'react-redux'
import { generateInviteLink } from '../../api/players'
import { useAppDispatch } from '../../app/hooks'
import { selectGameId, selectIsContestsTab, selectIsNotesTab, setTab, TabType } from '../../slices/gameSlice'
import { Divider } from '../Divider'
import { Players } from '../players/Players'
import { SmallButton } from '../SmallButton'

export interface MenuProps {
    onTabChange?: (tab: string) => void | undefined
}

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

export const Menu: FC<MenuProps> = ({ onTabChange }) => {
    const gameId = useSelector(selectGameId)
    const dispatch = useAppDispatch()

    const isContestsTab = useSelector(selectIsContestsTab)
    const isNotesTab = useSelector(selectIsNotesTab)
    //const isAboutTab = useSelector(selectIsAboutTab)

    const [opacity, setOpacity] = useState(false)
    const [transition, setTransition] = useState(false)

    const setTabHandler = (tab: string) => {
        dispatch(setTab(tab))
        if (onTabChange !== undefined) {
            onTabChange(tab)
        }
    }

    return (
        <>
            <nav className="flex flex-col items-stretch md:items-end relative">
                <SmallButton
                    className="md:w-auto mr-0 mb-4"
                    selected={isContestsTab}
                    onClick={() => setTabHandler(TabType.Contests)}
                >
                    Contests
                </SmallButton>
                <SmallButton
                    className="md:w-auto mr-0 mb-5"
                    selected={isNotesTab}
                    onClick={() => setTabHandler(TabType.Notes)}
                >
                    Notes
                </SmallButton>
            </nav>
            <div className="flex">
                <Divider />
            </div>
            <div
                className={`${transition ? 'transition-opacity duration-1000' : ''} ${
                    opacity ? 'opacity-1' : 'opacity-0'
                } absolute -l-10 mb-2 text-center text-base`}
            >
                Copied to clipboard!
            </div>
            {gameId !== undefined && (
                <SmallButton
                    className="w-full md:w-auto mr-0 mt-8 mb-4"
                    onClick={inviteLinkHandler(gameId, setOpacity, setTransition)}
                >
                    Copy Invite Link
                </SmallButton>
            )}
            <Players />
            {/* TODO Implement About Page */}
            {/* <div className="flex mt-5">
                    <Divider />
                </div>
                <SmallButton
                    className="mr-0 mt-8"
                    selected={isAboutTab}
                    onClick={() => setTabHandler(TabType.About)}
                >
                    About This App
                </SmallButton> */}
        </>
    )
}
