import React, { FC } from 'react'
import { Loading } from './Loading'
import { Menu } from './Menu'

export interface BurgerMenuProps {
    onTabChange?: (tab: string) => void | undefined
}

export const BurgerMenu: FC<BurgerMenuProps> = ({ onTabChange }) => (
    <>
        <Menu onTabChange={onTabChange} />
        <div className="w-full mt-4">
            <Loading />
        </div>
    </>
)
