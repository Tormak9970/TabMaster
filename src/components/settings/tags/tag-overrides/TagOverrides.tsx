import { ButtonItem, showModal, SingleDropdownOption } from '@decky/ui'
import { SteamAppOverview, TagOverrideDict } from '@types'
import { getAppIconType, trans_string as t } from '@utils'
import { useMemo } from 'react'
import { ListSearchModal } from '../../../modals/ListSearchModal'
import { GameEntry } from './GameEntry'
import { useTabMasterContext } from '@state'

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

type TagOverridesProps = {
    tagOverrides: TagOverrideDict
    setTagOverrides: (overrides: TagOverrideDict) => Promise<void | Error>
}

export const TagOverrides = ({ tagOverrides, setTagOverrides }: TagOverridesProps) => {
    const { allStoreTags } = useTabMasterContext()
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
    const appsMap = useMemo(() => Object.fromEntries(appsList.map(entry => [entry.appid, entry])), [appsList])

    const gamesWithOverrides = useMemo(() => {
        return selectedAppIds.map(appid => {
            return {
                appid: appid,
                override: tagOverrides[appid],
                name: appsMap[appid].display_name,
            }
        })
    }, [selectedAppIds, tagOverrides, appsMap])

    const dropdownOptions: SingleDropdownOption[] = appsList
        .filter(game => !selectedAppIds?.includes(game.appid.toString()))
        .map((game: SteamAppOverview) => {
            return { label: game.display_name, data: { appid: game.appid, appType: game.app_type } }
        })

    const onSelect = (option: SingleDropdownOption) => {
        setTagOverrides({
            ...tagOverrides,
            [option.data]: {},
        })
    }

    return (
        <div className='tag-overrides-body'>
            <div className='tag-overrides'>
                {gamesWithOverrides.map(game => (
                    <GameEntry
                        key={`${game.appid}|${game.name}`}
                        tags={allStoreTags}
                        appid={game.appid}
                        overrides={game.override}
                        name={game.name}
                        onChange={(appid, overrides) => {
                            const newTagOverrides = { ...tagOverrides }
                            if (overrides === null) {
                                delete newTagOverrides[appid]
                            } else {
                                newTagOverrides[appid] = overrides
                            }

                            setTagOverrides(newTagOverrides)
                        }}
                    />
                ))}
            </div>
            <div className='styled-btn no-sep'>
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
        </div>
    )
}
