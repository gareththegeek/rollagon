import React from 'react'
import { Loading } from './Loading'

export const Header = () => {
    return (
        <div>
            <div className="flex items-center">
                <Loading />
                <div className="text-2xl uppercase leading-10 ml-2 py-6">Agon Dice Roller</div>
            </div>
        </div>
    )
}
