import React from 'react'
import { Loading } from './Loading'
import { Menu } from './Menu'

export const BurgerMenu = () => (
    <>
        <Menu />
        <div className="w-full mt-4">
            <Loading />
        </div>
    </>
)
