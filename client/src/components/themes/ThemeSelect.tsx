import { ChangeEvent, useEffect } from 'react'
import { useAppDispatch } from '../../app/hooks'
import { fetchThemesAsync, selectCurrentTheme, selectThemes, setCurrentThemeAsync } from '../../slices/themeSlice'
import { useSelector } from 'react-redux'
import { Placeholder } from '../Placeholder'
import { Error } from '../header/Error'
import { AppDispatch } from '../../app/store'

interface ThemeProps {}

interface Theme {
    name: string
    folder: string
}

const renderTheme = (theme: Theme) => (
    <option key={theme.folder} value={theme.folder}>
        {theme.name}
    </option>
)

const handleChangeTheme =
    (dispatch: AppDispatch) =>
    ({ target: { value } }: ChangeEvent<HTMLSelectElement>) => {
        dispatch(setCurrentThemeAsync(value))
    }

export const ThemeSelect = (props: ThemeProps) => {
    const dispatch = useAppDispatch()
    const themes = useSelector(selectThemes)
    const current = useSelector(selectCurrentTheme)
    useEffect(() => {
        dispatch(fetchThemesAsync())
    }, [dispatch])

    if (themes.loading) {
        return <Placeholder>Loading themes...</Placeholder>
    }
    if (themes.error) {
        return <Error error={{ message: themes.error }} />
    }

    return (
        <fieldset className="flex gap-4 w-full justify-end items-baseline">
            <label>Select game</label>
            <select className="px-4 py-2 bg-grey-300" defaultValue={current} onChange={handleChangeTheme(dispatch)}>
                {themes.themes.map(renderTheme)}
            </select>
        </fieldset>
    )
}
