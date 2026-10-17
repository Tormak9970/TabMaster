import { Menu, MenuGroup, MenuItem } from '@decky/ui'
import { Fragment } from 'react'
import { presetKeys } from '../../presets/presets'
import { TabMasterManager } from '@state'
import { compatCategoryToLabel, steamOSCompatCategoryToLabel } from '../filters/Filters'
import { trans_string as t, getAppCategoryLabels } from '@utils'
import { SteamPlatform } from '@types'

interface PresetMenuProps {
    tabMasterManager: TabMasterManager
    isMicroSDeckInstalled: boolean
}

export const PresetMenu = ({ tabMasterManager, isMicroSDeckInstalled }: PresetMenuProps) => {
    return (
        <Menu label={t('LABEL_QUICK_TABS', 'Quick Tabs')}>
            <PresetMenuItems tabMasterManager={tabMasterManager} isMicroSDeckInstalled={isMicroSDeckInstalled} />
        </Menu>
    )
}

interface PresetMenuItemsProps extends PresetMenuProps {}

export const PresetMenuItems = ({ tabMasterManager, isMicroSDeckInstalled }: PresetMenuItemsProps) => {
    function getActionDescription(name: string) {
        return { onOKActionDescription: `${t('LABEL_CREATE_TAB', 'Create Tab')} "${name}"` }
    }

    return (
        <>
            {presetKeys.map(presetName => {
                switch (presetName) {
                    case 'collection':
                        return (
                            <MenuGroup label={t('LABEL_COLLECTION', 'Collection')}>
                                {collectionStore.userCollections
                                    .concat([
                                        { displayName: t('GameList_Category_Hidden', 'Hidden', true), id: 'hidden' },
                                    ] as any)
                                    .map(({ displayName, id }: { displayName: string; id: string }) => (
                                        <MenuItem
                                            onClick={() =>
                                                tabMasterManager.createPresetTab(
                                                    presetName,
                                                    displayName,
                                                    id,
                                                    displayName
                                                )
                                            }
                                            {...getActionDescription(displayName)}
                                        >
                                            {displayName}
                                        </MenuItem>
                                    ))}
                            </MenuGroup>
                        )
                    case 'installation':
                        return (
                            <MenuGroup label='Installation'>
                                {[
                                    t('LibraryTab_Installed', 'Installed', true),
                                    t('LABEL_NOT_INSTALLED', 'Not Installed'),
                                ].map(tabName => (
                                    <MenuItem
                                        onClick={() =>
                                            tabMasterManager.createPresetTab(
                                                presetName,
                                                tabName,
                                                tabName === t('LibraryTab_Installed', 'Installed', true)
                                            )
                                        }
                                        {...getActionDescription(tabName)}
                                    >
                                        {tabName}
                                    </MenuItem>
                                ))}
                            </MenuGroup>
                        )
                    case 'deck compatibility':
                        return (
                            <MenuGroup label={t('LABEL_DECK_COMPATIBILITY', 'Deck Compatibility')}>
                                {[0, 1, 2, 3].map(level => {
                                    const tabName = compatCategoryToLabel(level)
                                    return (
                                        <MenuItem
                                            onClick={() => tabMasterManager.createPresetTab(presetName, tabName, level)}
                                            {...getActionDescription(tabName)}
                                        >
                                            {tabName}
                                        </MenuItem>
                                    )
                                })}
                            </MenuGroup>
                        )
                    case 'steamos compatibility':
                        return (
                            <MenuGroup label={t('LABEL_MACHINE_COMPAT_FILTER', 'SteamOS Compatibility')}>
                                {[0, 1, 2].map(level => {
                                    const tabName = steamOSCompatCategoryToLabel(level)
                                    return (
                                        <MenuItem
                                            onClick={() => tabMasterManager.createPresetTab(presetName, tabName, level)}
                                            {...getActionDescription(tabName)}
                                        >
                                            {tabName}
                                        </MenuItem>
                                    )
                                })}
                            </MenuGroup>
                        )
                    case 'platform':
                        return (
                            <MenuGroup label='Platform'>
                                {(['steam', 'nonSteam'] as SteamPlatform[]).map(platform => {
                                    const tabName =
                                        platform === 'nonSteam' ? t('LibraryTab_NonSteam', 'Non-Steam', true) : 'Steam'
                                    return (
                                        <MenuItem
                                            onClick={() =>
                                                tabMasterManager.createPresetTab(presetName, tabName, platform)
                                            }
                                            {...getActionDescription(tabName)}
                                        >
                                            {tabName}
                                        </MenuItem>
                                    )
                                })}
                            </MenuGroup>
                        )
                    case 'micro sd card':
                        return (
                            <MenuGroup
                                label={t('LABEL_MICROSD_CARD', 'Micro SD Card')}
                                disabled={!isMicroSDeckInstalled}
                            >
                                <MenuItem
                                    onClick={() =>
                                        tabMasterManager.createPresetTab(
                                            presetName,
                                            t('LABEL_PRESET_TITLE_INSERTED_CARD', 'Inserted Card')
                                        )
                                    }
                                    {...getActionDescription(t('LABEL_INSERTED_CARD', 'Inserted Card'))}
                                >
                                    {t('LABEL_INSERTED_CARD', 'Inserted Card')}
                                </MenuItem>
                                <MenuGroup label={t('LABEL_SPECIFIC_CARD', 'Specific Card')}>
                                    {window.MicroSDeck?.CardsAndGames.map(([card]) => {
                                        const tabName = card.name || card.uid
                                        return (
                                            <MenuItem
                                                onClick={() =>
                                                    tabMasterManager.createPresetTab(presetName, tabName, card.uid)
                                                }
                                                {...getActionDescription(tabName)}
                                            >
                                                {tabName}
                                            </MenuItem>
                                        )
                                    })}
                                </MenuGroup>
                            </MenuGroup>
                        )
                    default:
                        const tabName = getAppCategoryLabels(presetName as 'soundtracks' | 'software')
                        return (
                            <MenuItem
                                onClick={() => tabMasterManager.createPresetTab(presetName, tabName)}
                                {...getActionDescription(tabName)}
                            >
                                {tabName}
                            </MenuItem>
                        )
                }
            })}
        </>
    )
}
