import React from 'react'
import { Loading } from './Loading'
import { Menu } from './Menu'
import { useCustomTranslation } from '../../app/useCustomTranslation'

export const Header = () => {
    const { t } = useCustomTranslation()
    return (
        <header className="hidden md:block border-r-2 mr-10 lg:mr-20 xl:mr-32 pr-6 box-content">
            <div className="flex flex-col items-end sticky top-16">
                <Loading />
                <h3 className="w-64 text-right border-b-0 mt-2 text-black">{t('Agon Roller')}</h3>
                <div className="w-full flex flex-col items-stretch md:items-end">
                    <Menu />
                </div>
            </div>
        </header>
    )
}
