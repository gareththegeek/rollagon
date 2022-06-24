import React from 'react'
import { HarmTagType } from '../../api/strife'
import { Diamond } from '../Diamond'

export interface TagProps {
    tag: HarmTagType
}

const HarmTagsDescription: Record<HarmTagType, React.ReactElement> = {
    epic: <p>The Contest was&nbsp;<b>Epic</b>&nbsp;- Heroes who entered the contest marked Pathos</p>,
    mythic: <p>The Contest was&nbsp;<b>Mythic</b>&nbsp;- Heroes who entered the contest spent Divine Favour</p>,
    perilous: <p>The Contest was&nbsp;<b>Perilous</b>&nbsp;- Heroes who suffered marked Pathos</p>,
    sacred: <p>The Contest was&nbsp;<b>Sacred</b>&nbsp;- Heroes who suffered spent Divine Favour</p>
}

export const Tag = ({ tag }: TagProps) => {
    return (
        <ul className="mb-4">
            <li className="flex"><Diamond className="mr-6 w-4 h-4 min-w-[0.8rem] min-h-[0.8rem]" />{HarmTagsDescription[tag]}</li>
        </ul>
    )
}
