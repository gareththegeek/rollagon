import React from 'react'
import { Loading } from './Loading'

export const Header = () => {
    return (
        <div className="w-screen bg-emerald-700 h-12">
            <div className="flex ml-16">
                <Loading />
                <div className="text-3xl text-white leading-10 ml-2">Paragon Dice Roller</div>
            </div>
        </div>
    )
}
