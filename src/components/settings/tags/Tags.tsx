import { ButtonItem, Field, gamepadDialogClasses, showModal, SingleDropdownOption } from '@decky/ui'
import { useSettingsContext } from '@state'
import { getAppIconType, trans_string as t } from '@utils'
import { TagOverrides } from './tag-overrides/TagOverrides'
import { Fragment, useMemo } from 'react'
import { SteamAppOverview } from '@types'
import { ListSearchModal } from '../../modals/ListSearchModal'

type GamesModalProps = {
    onSelect: (option: SingleDropdownOption) => void
    dropdownOptions: SingleDropdownOption[]
    closeModal?: () => void
}

const GamesModalWrapper = ({ onSelect, dropdownOptions, closeModal }: GamesModalProps) => {
    return (
        <ListSearchModal
            entryLabel={t('LABEL_YOUR_APPS', 'Your Apps')}
            rgOptions={dropdownOptions}
            onSelectOption={onSelect}
            determineEntryIcon={getAppIconType}
            closeModal={closeModal}
        />
    )
}

export const Tags = () => {
    const { tagOverrides, setTagOverrides } = useSettingsContext()
    const selectedAppIds = useMemo(() => Object.keys(tagOverrides), [tagOverrides])

    const appsList: SteamAppOverview[] = useMemo(() => {
        let apps: SteamAppOverview[] = []
        const types = ['games', 'music', 'software']

        for (const type of types) {
            apps = apps.concat(
                collectionStore.appTypeCollectionMap.get(`type-${type as 'games' | 'music' | 'software'}`)!.allApps
            )
        }

        return apps
    }, [collectionStore.appTypeCollectionMap])

    const appsMap = Object.fromEntries(appsList.map(entry => [entry.appid, entry]))

    const dropdownOptions: SingleDropdownOption[] = appsList
        .filter(game => !selectedAppIds?.includes(game.appid.toString()))
        .map((game: SteamAppOverview) => {
            return { label: game.display_name, data: { appid: game.appid, appType: game.app_type } }
        })

    const onSelect = (option: SingleDropdownOption) => {
        setTagOverrides({
            ...tagOverrides,
            [option.data.appid]: {},
        })
    }

    return (
        <>
            <style>{`
              /* The button item */
              .tab-master-tag-settings .styled-btn {
                padding: 0 !important;
              }
              .tab-master-tag-settings .styled-btn > div {
                margin-top: 0.5rem;
              }
              .tab-master-tag-settings .styled-btn .${(gamepadDialogClasses as any).FieldLeftColumn} {
                display: none;
              }
              .tab-master-tag-settings .styled-btn .${(gamepadDialogClasses as any).FieldRightColumn} {
                width: 100%;
                max-width: 100% !important;
              }
              .tab-master-tag-settings .${(gamepadDialogClasses as any).FieldRightColumn} .styled-btn > div {
                padding: 0rem !important;
              }
              .tab-master-tag-settings .styled-btn .${gamepadDialogClasses.FieldChildrenInner} {
                width: 100%;
              }
              .tab-master-tag-settings .styled-btn .${(gamepadDialogClasses as any).FieldChildrenWithIcon} {
                width: 100%;
              }

              .tab-master-tag-settings .game-entry {
                background-color: #23262e;
                margin-top: 0.5rem;
              }
            `}</style>
            <div className='tab-master-tag-settings'>
                <Field
                    label={t('LABEL_TAG_OVERRIDES', 'App Tag Overrides')}
                    description={t(
                        'DESCRIPTION_TAG_OVERRIDES',
                        'Allows you to override specific tags for apps you own.'
                    )}
                >
                    <div className='styled-btn'>
                        <ButtonItem
                            onClick={() => {
                                showModal(
                                    <GamesModalWrapper
                                        onSelect={option => onSelect(option)}
                                        dropdownOptions={dropdownOptions}
                                    />
                                )
                            }}
                        >
                            {t('LABEL_ADD_FILTER', 'Add App')}
                        </ButtonItem>
                    </div>
                </Field>
                <TagOverrides tagOverrides={tagOverrides} appsMap={appsMap} setTagOverrides={setTagOverrides} />
            </div>
        </>
    )
}
