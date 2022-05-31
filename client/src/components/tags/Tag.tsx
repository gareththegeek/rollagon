import React from 'react'
import { HarmTagType } from '../../api/strife'
import { Diamond } from '../Diamond'

export interface TagProps {
    tag: HarmTagType
}

const HarmTagsDescription: Record<HarmTagType, React.ReactElement> = {
    epic: <>The Contest was&nbsp;<b>Epic</b>&nbsp;- Heroes who entered the contest marked Pathos</>,
    mythic: <>The Contest was&nbsp;<b>Mythic</b>&nbsp;- Heroes who entered the contest spent Divine Favour</>,
    perilous: <>The Contest was&nbsp;<b>Perilous</b>&nbsp;- Heroes who suffered marked Pathos</>,
    sacred: <>The Contest was&nbsp;<b>Sacred</b>&nbsp;- Heroes who suffered spent Divine Favour</>
}

export const Tag = ({ tag }: TagProps) => {
    return (
        <ul className="mb-4">
            <li className="flex"><Diamond className="mr-6" width={15} height={15} />{HarmTagsDescription[tag]}</li>
        </ul>
    )
}
