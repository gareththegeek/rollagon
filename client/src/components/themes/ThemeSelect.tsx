import { ChangeEvent, useEffect } from 'react'
import { useAppDispatch } from '../../app/hooks'
import { fetchThemesAsync, selectThemes, setCurrentThemeAsync } from '../../slices/themeSlice'
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
    useEffect(() => {
        console.log('dispatch')
        dispatch(fetchThemesAsync())
    }, [dispatch])

    if (themes.loading) {
        return <Placeholder>Loading themes...</Placeholder>
    }
    if (themes.error) {
        return <Error error={{ message: themes.error }} />
    }

    return (
        <fieldset className="flex gap-4 w-full justify-end">
            <label>Select game</label>
            <select onChange={handleChangeTheme(dispatch)}>{themes.themes.map(renderTheme)}</select>
        </fieldset>
    )
}
