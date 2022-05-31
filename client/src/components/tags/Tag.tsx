import React from 'react'
import { HarmTagType } from '../../api/strife'

export interface TagProps {
    tag: HarmTagType
}

const HarmTagsDescription: Record<HarmTagType, string> = {
    epic: 'Mark Pathos to enter a contest against an Epic foe',
    mythic: 'Spend Divine Favour to enter a contest against a Mythic foe',
    perilous: 'Mark Pathos if you suffer against a Perilous foe',
    sacred: 'Spend Divine Favour if you suffer against a Sacred foe'
}

export const Tag = ({ tag }: TagProps) => {
    return (
        <div className="my-4">
            <span className="capitalize bg-grey-300 px-4 py-1 mr-2">{tag}</span>
            <span>{HarmTagsDescription[tag]}</span>
        </div>
    )
}
