import { Dropdown, Field, Focusable } from '@decky/ui'
import { trans_string as t } from '@utils'
import { useState } from 'react'
import { GuardedDeleteButton } from '../../../utils/GuardedDeleteButton'

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
            <Focusable style={{ width: '100%', display: 'flex' }}>
                <Focusable style={{ marginRight: '0.5rem' }}>
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
                </Focusable>
                <Focusable>
                    <GuardedDeleteButton
                        title={t('TITLE_ALL_CAPS_WARNING', 'WARNING!')}
                        style={{
                            height: '40px',
                            width: '42px',
                            minWidth: 0,
                            padding: '10px 12px',
                            marginLeft: 'auto',
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                        }}
                        confirmationMessage={t(
                            'MESSAGE_DELETE_GAME_TAG_OVERRIDE_TAG_CONFIRM',
                            "Are you sure you want to delete this tag from your overrides? This can't be undone."
                        )}
                        onDelete={() => {
                            onChange(tag, null)
                        }}
                    />
                </Focusable>
            </Focusable>
        </Field>
    )
}
