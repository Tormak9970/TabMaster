import { ButtonItem, Focusable, quickAccessControlsClasses, showModal, SingleDropdownOption } from '@decky/ui'
import { TagOverride, TagResponse } from '@types'
import { playUISound, trans_string as t } from '@utils'
import { useState, Fragment, useMemo } from 'react'
import { BiSolidDownArrow } from 'react-icons/bi'
import { GuardedDeleteButton } from '../../../utils/GuardedDeleteButton'
import { TagEntry } from './TagEntry'
import { ListSearchModal } from '../../../modals/ListSearchModal'
import { FaTag } from 'react-icons/fa6'

type TagsModalProps = {
    onSelect: (option: SingleDropdownOption) => void
    dropdownOptions: SingleDropdownOption[]
    closeModal?: () => void
}

const TagsModalWrapper = ({ onSelect, dropdownOptions, closeModal }: TagsModalProps) => {
    return (
        <ListSearchModal
            entryLabel={t('LABEL_YOUR_TAGS', 'Your Tags')}
            rgOptions={dropdownOptions}
            onSelectOption={onSelect}
            determineEntryIcon={() => FaTag}
            closeModal={closeModal}
        />
    )
}

type GameEntryProps = {
    tags: TagResponse[]
    appid: string
    name: string
    overrides: TagOverride
    onChange: (appid: string, overrides: TagOverride | null) => void
}

export const GameEntry = ({ tags, appid, name, overrides, onChange }: GameEntryProps) => {
    const [isOpen, setIsOpen] = useState(false)

    const tagOverrides = useMemo(() => {
        return Object.entries(overrides).map(([tag, override]) => {
            return {
                tag: parseInt(tag),
                override,
            }
        })
    }, [overrides])

    const selected: number[] = tagOverrides.map(override => override.tag)

    const dropdownOptions: SingleDropdownOption[] = tags
        .filter(tag => !selected.includes(tag.tag))
        .sort((tagA, tagB) => tagA.string!.localeCompare(tagB.string!))
        .map(storeTag => {
            return { label: storeTag.string, data: storeTag.tag }
        })

    const onSelect = (option: SingleDropdownOption) => {
        onChange(appid, {
            ...overrides,
            [option.data]: false,
        })
    }

    return (
        <>
            <div>
                <Focusable
                    style={{ margin: '0 calc(-12px - 1.4vw)' }}
                    onActivate={() => {
                        playUISound('/sounds/deck_ui_misc_01.wav')
                        setIsOpen(isOpen => !isOpen)
                    }}
                    noFocusRing={true}
                    className='highlight-on-focus'
                    focusClassName='start-focused'
                >
                    <div style={{ margin: '0 calc(12px + 1.4vw)', padding: '0 16px' }}>
                        <div style={{ display: 'flex', alignItems: 'center' }}>
                            <div
                                style={{ padding: '12px 0', float: 'left' }}
                                className={quickAccessControlsClasses.PanelSectionTitle}
                            >
                                {name} - {tagOverrides.length}{' '}
                                {tagOverrides.length === 1
                                    ? t('LABEL_TAG_OVERRIDE_SINGULAR', 'Override')
                                    : t('LABEL_TAG_OVERRIDE_PLURAL', 'Overrides')}
                            </div>
                            <div style={{ paddingRight: '10px', display: 'flex', alignItems: 'center' }}>
                                <BiSolidDownArrow
                                    style={{
                                        transform: !isOpen ? 'rotate(90deg)' : '',
                                        transition: 'transform 0.2s ease-in-out',
                                    }}
                                />
                            </div>
                            <GuardedDeleteButton
                                title={t('TITLE_ALL_CAPS_WARNING', 'WARNING!')}
                                confirmationMessage={t(
                                    'MESSAGE_DELETE_GAME_TAG_OVERRIDE_CONFIRM',
                                    "Are you sure you want to delete this game from your overrides? This can't be undone."
                                )}
                                onDelete={() => {
                                    onChange(appid, null)
                                }}
                            />
                        </div>
                    </div>
                </Focusable>
                {isOpen && (
                    <>
                        <div style={{ padding: '10px 18px' }}>
                            {tagOverrides.map(override => (
                                <TagEntry
                                    key={`${override.tag}|${override.override}`}
                                    tag={override.tag}
                                    overrideState={override.override}
                                    onChange={(tagNumber, overrideState) => {
                                        const newOverrides = { ...overrides }
                                        if (overrideState === null) {
                                            delete newOverrides[tagNumber]
                                        } else {
                                            newOverrides[tagNumber] = overrideState
                                        }

                                        onChange(appid, newOverrides)
                                    }}
                                />
                            ))}
                        </div>
                        <div className='styled-btn no-sep'>
                            <ButtonItem
                                onClick={() => {
                                    showModal(
                                        <TagsModalWrapper
                                            onSelect={option => onSelect(option)}
                                            dropdownOptions={dropdownOptions}
                                        />
                                    )
                                }}
                            >
                                {t('LABEL_ADD_TAG', 'Add Tag')}
                            </ButtonItem>
                        </div>
                    </>
                )}
            </div>
            <div
                style={{
                    position: 'relative',
                    left: 'calc(16px - 1.8vw)',
                    right: 'calc(16px - 1.8vw)',
                    height: '1px',
                    background: '#ffffff1a',
                }}
            />
        </>
    )
}
