import React from 'react'
import { Loading } from './Loading'

export const Header = () => {
    return (
        <div>
            <div className="flex items-center">
                <Loading />
                <div className="text-4xl leading-10 ml-2 py-6">Paragon Dice Roller</div>
            </div>
        </div>
    )
}
