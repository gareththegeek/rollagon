import { useSelector } from 'react-redux'
import { useLocation } from 'react-router'
import { selectCurrentTheme, setCurrentThemeAsync } from '../slices/themeSlice'
import { useAppDispatch } from './hooks'

export const useTheme = () => {
    const current = useSelector(selectCurrentTheme)
    const dispatch = useAppDispatch()
    const search = useLocation().search
    const theme = new URLSearchParams(search).get('theme') ?? undefined
    if (!!theme && theme !== current) {
        dispatch(setCurrentThemeAsync(theme))
    }
}
