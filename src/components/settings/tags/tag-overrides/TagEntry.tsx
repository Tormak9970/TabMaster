import { Dropdown, Field } from '@decky/ui'
import { trans_string as t } from '@utils'
import { useState } from 'react'

type TagEntryProps = {
    tag: number
    overrideState: boolean
    onChange: (tagNumber: number, overrideState: boolean | null) => void
}

export const TagEntry = ({ tag, overrideState, onChange }: TagEntryProps) => {
    const [status, setStatus] = useState(overrideState)

    const tagName = appStore.m_mapStoreTagLocalization[tag.toString()]

    return (
        <Field label={tagName}>
            <Dropdown
                rgOptions={[
                    { label: t('LABEL_TAG_OVERRIDE_ADD', 'Add'), data: true },
                    { label: t('LABEL_TAG_OVERRIDE_IGNORE', 'Ignore'), data: false },
                ]}
                selectedOption={status}
                onChange={option => {
                    setStatus(option.data)
                    onChange(tag, option.data)
                }}
            />
        </Field>
    )
}
