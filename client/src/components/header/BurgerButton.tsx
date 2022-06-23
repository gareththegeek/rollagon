import React, { FC } from 'react'

export interface BurgerButtonProps {
    onClick: () => void
    isOpen: boolean
}

export const BurgerButton: FC<BurgerButtonProps> = ({ onClick, isOpen }) => {
    return (
        <button className="mx-2" onClick={onClick}>
            {isOpen ? (
                <div className="relative rotate-45">
                    <div className="relative top-3 w-6 h-0.5 bg-black" />
                    <div className="relative left-3 w-0.5 h-6 bg-black" />
                </div>
            ) : (
                <div className="space-y-1.5">
                    <div className="w-6 h-0.5 bg-black" />
                    <div className="w-6 h-0.5 bg-black" />
                    <div className="w-6 h-0.5 bg-black" />
                </div>
            )}
        </button>
    )
}
