import { FC, useState } from 'react'
import { useSelector } from 'react-redux'
import { generateInviteLink } from '../../api/players'
import { useAppDispatch } from '../../app/hooks'
import {
    selectGameId,
    selectIsAboutTab,
    selectIsContestsTab,
    selectIsNotesTab,
    setTab,
    TabType
} from '../../slices/gameSlice'
import { Divider } from '../Divider'
import { Players } from '../players/Players'
import { SmallButton } from '../SmallButton'

export interface MenuProps {
    onTabChange?: (tab: string) => void | undefined
}

const inviteLinkHandler = (gameId: string, setTransition: React.Dispatch<React.SetStateAction<boolean>>) => () => {
    const url = generateInviteLink(gameId)
    navigator.clipboard.writeText(url)
    setTimeout(() => {
        setTransition(true)
        setTimeout(() => {
            setTransition(false)
        }, 2500)
    }, 0)
}

export const Menu: FC<MenuProps> = ({ onTabChange }) => {
    const gameId = useSelector(selectGameId)
    const dispatch = useAppDispatch()

    const isContestsTab = useSelector(selectIsContestsTab)
    const isNotesTab = useSelector(selectIsNotesTab)
    const isAboutTab = useSelector(selectIsAboutTab)

    const [transition, setTransition] = useState(false)

    const setTabHandler = (tab: string) => {
        dispatch(setTab(tab))
        if (onTabChange !== undefined) {
            onTabChange(tab)
        }
    }

    return (
        <>
            <nav className="flex flex-col items-stretch md:items-end">
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
            <Divider fullWidth={true} />
            {gameId !== undefined && (
                <SmallButton
                    className="w-full md:w-auto mr-0 mt-8 mb-4"
                    onClick={inviteLinkHandler(gameId, setTransition)}
                >
                    {transition ? 'Copied to clipboard!' : 'Copy Invite Link'}
                </SmallButton>
            )}
            <Players />
            <Divider fullWidth={true} />
            <nav className="flex flex-col items-stretch md:items-end">
                <SmallButton className="mt-8" selected={isAboutTab} onClick={() => setTabHandler(TabType.About)}>
                    About This App
                </SmallButton>
            </nav>
        </>
    )
}
