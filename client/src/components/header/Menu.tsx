import { FC, useState } from 'react'
import { useCustomTranslation } from '../../app/useCustomTranslation'
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
import { selectCurrentTheme } from '../../slices/themeSlice'

export interface MenuProps {
    onTabChange?: (tab: string) => void | undefined
}

const inviteLinkHandler = (gameId: string, theme: string | undefined, setTransition: React.Dispatch<React.SetStateAction<boolean>>) => () => {
    const url = generateInviteLink(gameId, theme)
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
    const theme = useSelector(selectCurrentTheme)
    const dispatch = useAppDispatch()
    const { t } = useCustomTranslation()

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
                    onClick={inviteLinkHandler(gameId, theme, setTransition)}
                >
                    {transition ? t('Copied to clipboard!') : t('Copy Invite Link')}
                </SmallButton>
            )}
            <Players />
            <Divider fullWidth={true} />
            <nav className="flex flex-col items-stretch md:items-end">
                <SmallButton className="mt-8" selected={isAboutTab} onClick={() => setTabHandler(TabType.About)}>
                    {t('About this App')}
                </SmallButton>
                <a href="https://www.buymeacoffee.com/gareththegeek" target="_blank" rel="noreferrer">
                    <SmallButton className="mt-8 flex items-center w-full justify-center">
                        <img src="/images/coffee.svg" alt="Buy Me A Coffee" style={{height: "32px"}} />
                        Buy me a coffee
                    </SmallButton>
                </a>
            </nav>
        </>
    )
}
