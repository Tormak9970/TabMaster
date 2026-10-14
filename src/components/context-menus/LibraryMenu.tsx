import {
    Menu,
    MenuItem,
    showModal,
    Focusable,
    MenuGroup,
    ReorderableEntry,
    ReorderableList,
    MenuItemProps,
    gamepadContextMenuClasses,
} from '@decky/ui'
import { FC, Fragment, VFC, useState } from 'react'
import { TabMasterManager, TabMasterContextProvider, useTabMasterContext, CustomTabContainer } from '@state'
import { showModalDuplicateTab, showModalEditTab, showModalNewTab } from '../modals/EditTabModal'
import { LibraryMenuStyles } from '../styles/LibraryMenuStyles'
import { DestructiveModal } from '../generic/DestructiveModal'
import { PresetMenuItems } from './PresetMenu'
import { TabListLabel } from '../other/TabListLabel'
import { MicroSDeckInterop } from '../../lib/controllers/MicroSDeckInterop'
import { TabProfilesSubMenu } from './TabProfileMenu'
import { TabIdEntryType } from '../qam/QuickAccessContent'
import { showAddCollectionModal } from '../modals/AddCollectionModal'
import { trans_string as t } from '@utils'
import { TabContainer } from '@types'

export interface LibraryMenuProps {
    closeMenu: () => void
    selectedTabId: string
    tabMasterManager: TabMasterManager
}

/**
 * The library context menu for configuring tab master.
 */
export const LibraryMenu: VFC<LibraryMenuProps> = ({ closeMenu, selectedTabId, tabMasterManager }) => {
    const isMicroSDeckInstalled = MicroSDeckInterop.isInstallOk()

    return (
        <Menu
            //@ts-ignore
            label={
                <div>
                    <h3 style={{ margin: 0 }}>Tab Master</h3>
                    <small>{tabMasterManager.getTabs().tabsMap.get(selectedTabId)?.title}</small>
                </div>
            }
        >
            <LibraryMenuStyles />
            <TabMasterContextProvider tabMasterManager={tabMasterManager}>
                <LibraryMenuItems
                    selectedTabId={selectedTabId}
                    closeMenu={closeMenu}
                    isMicroSDeckInstalled={isMicroSDeckInstalled}
                />
            </TabMasterContextProvider>
        </Menu>
    )
}

interface LibraryMenuItemsProps extends Omit<LibraryMenuProps, 'tabMasterManager'> {
    isMicroSDeckInstalled: boolean
}

/**
 * The menu items for the library context menu (in a separate component to manage state correctly)
 */
const LibraryMenuItems: VFC<LibraryMenuItemsProps> = ({ selectedTabId, closeMenu, isMicroSDeckInstalled }) => {
    const { tabsMap, visibleTabsList, hiddenTabsList, tabMasterManager } = useTabMasterContext()
    const tabTitle = tabMasterManager.getTabs().tabsMap.get(selectedTabId)?.title
    const tabContainer = tabsMap.get(selectedTabId)
    const isCustomTab = !!tabContainer?.filters

    return (
        <>
            <MenuItem
                //@ts-ignore
                className={gamepadContextMenuClasses.Positive}
                onOKActionDescription={t('LABEL_ADD_TAB', 'Add Tab')}
                onClick={() => showModalNewTab(tabMasterManager)}
            >
                Add Tab
            </MenuItem>
            <MenuGroup label={t('LABEL_QUICK_TABS', 'Quick Tabs')}>
                <PresetMenuItems tabMasterManager={tabMasterManager} isMicroSDeckInstalled={isMicroSDeckInstalled} />
            </MenuGroup>
            <div className={gamepadContextMenuClasses.ContextMenuSeparator} />
            <TabProfilesSubMenu tabMasterManager={tabMasterManager} />
            <MenuGroup label={t('LABEL_REORDER_TABS', 'Reorder Tabs')}>
                <Focusable
                    style={{ width: '240px', background: '#23262e', margin: '0' }}
                    className='tab-master-library-menu-reorderable-group'
                    onOKActionDescription=''
                >
                    <ReorderableList<TabIdEntryType>
                        entries={visibleTabsList.map(tabContainer => {
                            return {
                                label: (
                                    <TabListLabel
                                        tabContainer={tabContainer}
                                        microSDeckDisabled={!isMicroSDeckInstalled}
                                        style={{ marginLeft: '12px' }}
                                    />
                                ),
                                position: tabContainer.position,
                                data: { id: tabContainer.id },
                            }
                        })}
                        onSave={(entries: ReorderableEntry<TabIdEntryType>[]) => {
                            const currentOrder = visibleTabsList
                                .sort((a, b) => a.position - b.position)
                                .map(entry => entry.id)
                            const newOrder = entries.map(entry => entry.data!.id)

                            if (JSON.stringify(currentOrder) !== JSON.stringify(newOrder))
                                tabMasterManager.reorderTabs(newOrder)
                        }}
                    />
                </Focusable>
            </MenuGroup>
            {hiddenTabsList.length > 0 && (
                <MenuGroup label={t('LABEL_UNHIDE_TABS', 'Unhide Tabs')} disabled={hiddenTabsList.length === 0}>
                    <HiddenItems
                        onSelectTab={id => tabMasterManager.showTab(id)}
                        hiddenTabsList={hiddenTabsList}
                        isMicroSDeckInstalled={isMicroSDeckInstalled}
                    />
                </MenuGroup>
            )}
            <div className={gamepadContextMenuClasses.ContextMenuSeparator} />
            {isCustomTab && (
                <MenuItem
                    onOKActionDescription={`${t('LABEL_EDIT_TAB', 'Edit')} "${tabTitle}"`}
                    onClick={() => showModalEditTab(tabContainer as CustomTabContainer, tabMasterManager)}
                >
                    {t('LABEL_EDIT_TAB', 'Edit')}
                </MenuItem>
            )}
            {isCustomTab && (
                <MenuItem
                    onOKActionDescription={`${t('LABEL_DUPLICATE_TAB', 'Duplicate')} "${tabTitle}"`}
                    onClick={() => showModalDuplicateTab(tabContainer as CustomTabContainer, tabMasterManager)}
                >
                    {t('LABEL_DUPLICATE_TAB', 'Duplicate')}
                </MenuItem>
            )}
            {isCustomTab && (
                <MenuItem
                    onOKActionDescription={t('LABEL_TAB_SNAPSHOT_DESCRIPTION', 'Create a collection from this tab')}
                    onClick={() => {
                        const customTab = tabContainer as CustomTabContainer
                        customTab.buildCollection()

                        showAddCollectionModal(customTab.collection.allApps)
                    }}
                >
                    {t('LABEL_SNAPSHOT_TAB', 'Snapshot')}
                </MenuItem>
            )}
            <MenuItem
                onClick={() => tabMasterManager.hideTab(selectedTabId)}
                onOKActionDescription={`${t('LABEL_HIDE_TAB', 'Hide')} "${tabTitle}"`}
            >
                {t('LABEL_HIDE_TAB', 'Hide')}
            </MenuItem>
            {isCustomTab && (
                <MenuItem
                    onOKActionDescription={`${t('LABEL_DELETE_TAB', 'Delete')} "${tabTitle}"`}
                    //@ts-ignore
                    className={gamepadContextMenuClasses.Destructive}
                    onClick={() => {
                        const closeModal = () => {}
                        showModal(
                            <DestructiveModal
                                onOK={() => {
                                    tabMasterManager.deleteTab(selectedTabId)
                                    closeMenu()
                                }}
                                closeModal={closeModal}
                                strTitle={t('TITLE_ALL_CAPS_WARNING', 'WARNING!')}
                            >
                                {t(
                                    'MESSAGE_DELETE_CANT_BE_UNDONE',
                                    "Are you sure you want to delete this Tab? This can't be undone."
                                )}{' '}
                            </DestructiveModal>
                        )
                    }}
                >
                    {t('LABEL_DELETE_TAB', 'Delete')}
                </MenuItem>
            )}
        </>
    )
}

interface HiddenItemsProps {
    hiddenTabsList: TabContainer[]
    isMicroSDeckInstalled: boolean
    onSelectTab: (id: TabContainer['id']) => void
}

/**
 * The group of hidden tab menu items
 */
const HiddenItems: VFC<HiddenItemsProps> = ({ hiddenTabsList, isMicroSDeckInstalled, onSelectTab }) => {
    const [_refresh, setRefresh] = useState(true)
    return (
        <>
            {hiddenTabsList.map(tabContainer => (
                <MenuItemNoClose
                    onOKActionDescription={t('LABEL_TAB_UNHIDE', 'Unhide')}
                    onClick={() => {
                        onSelectTab(tabContainer.id)
                        setRefresh(refresh => !refresh)
                    }}
                >
                    <TabListLabel tabContainer={tabContainer} microSDeckDisabled={!isMicroSDeckInstalled} />
                </MenuItemNoClose>
            ))}
        </>
    )
}

interface MenuItemNoCloseProps extends Omit<
    MenuItemProps,
    'bInteractableItem' | 'onSelected' | 'onMouseEnter' | 'onMoveRight' | 'selected' | 'bPlayAudio' | 'tone'
> {
    className?: string
}

/**
 * Menu items that won't automatically close the menu when clicking
 */
const MenuItemNoClose: FC<MenuItemNoCloseProps> = ({ onClick, disabled, className, children, ...props }) => {
    return (
        <Focusable
            className={
                `${gamepadContextMenuClasses.contextMenuItem} contextMenuItem` +
                (className ? ` ${className}` : '') +
                (disabled ? ' disabled' : '')
            }
            focusClassName={gamepadContextMenuClasses.Focused}
            onActivate={disabled ? undefined : onClick}
            noFocusRing={true}
            {...props}
        >
            {children}
        </Focusable>
    )
}
