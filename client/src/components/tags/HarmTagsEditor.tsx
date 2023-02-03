import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { HarmTagType } from '../../api/strife'
import { ToggleButton } from '../ToggleButton'

export interface HarmTagsEditorProps {
    onChange: (harmTags: HarmTagType[]) => void
}

export const HarmTagsEditor = ({ onChange }: HarmTagsEditorProps) => {
    const { t } = useTranslation()
    const tags: { name: string, value: HarmTagType }[] = [
        { name: t('Sacred'), value: 'sacred' },
        { name: t('Perilous'), value: 'perilous' },
        { name: t('Mythic'), value: 'mythic' },
        { name: t('Epic'), value: 'epic' }
    ]

    const [selectedTags, setSelectedTags] = useState([] as HarmTagType[])

    return <div className="flex flex-col gap-3 xl:flex-row">
        {tags.map(({ name, value }) =>
            <ToggleButton
                key={`tag-editor-${value}`}
                label={name}
                enabled={true}
                toggled={selectedTags.includes(value)}
                onChange={(toggled: boolean) => {
                    let next = [...selectedTags]
                    if (toggled) {
                        next.push(value)
                    } else {
                        const idx = selectedTags.findIndex(x => x === value)
                        next.splice(idx, 1)
                    }
                    setSelectedTags(next)
                    onChange(next)
                }}
            />)}
    </div>
}
