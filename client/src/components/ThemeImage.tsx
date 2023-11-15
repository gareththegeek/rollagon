import { useEffect } from "react"
import { useSelector } from "react-redux"
import { fetchThemesAsync, selectThemeImage } from "../slices/themeSlice"
import { useAppDispatch } from "../app/hooks"

const ThemeImage = ({ image, ...rest }: any) => {
    const src = useSelector(selectThemeImage(image))
    const dispatch = useAppDispatch()
    useEffect(() => {
        if (!src) {
            dispatch(fetchThemesAsync())
        }
    }, [src, dispatch])

    return <img alt="" src={src} {...rest} />
}

export default ThemeImage
