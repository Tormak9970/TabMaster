import { Menu, MenuGroup, MenuItem, showModal, GamepadButton, gamepadContextMenuClasses } from '@decky/ui'
import { Fragment, useState } from 'react'
import { TabMasterManager } from '@state'
import { CreateTabProfileModal, OverwriteTabProfileModal } from '../modals/TabProfileModals'
import { DestructiveModal } from '../generic/DestructiveModal'
import { trans_string as t } from '@utils'

interface TabsProfilesMenuProps {
    tabMasterManager: TabMasterManager
}

/**
 * Context menu for managing Tab Profiles.
 */
export const TabProfilesMenu = ({ tabMasterManager }: TabsProfilesMenuProps) => {
    return (
        <Menu label={t('LABEL_MANAGE_TAB_PROFILES', 'Manage Tab Profiles')}>
            <TabProfileMenuItems tabMasterManager={tabMasterManager} />
        </Menu>
    )
}

/**
 * Context menu sub-menu for managing Tab Profiles.
 */
export const TabProfilesSubMenu = ({ tabMasterManager }: TabsProfilesMenuProps) => {
    return (
        <MenuGroup label={t('LABEL_MANAGE_TAB_PROFILES', 'Manage Tab Profiles')}>
            <TabProfileMenuItems tabMasterManager={tabMasterManager} />
        </MenuGroup>
    )
}

/**
 * Menu items for the Tab Profiles context menu.
 */
const TabProfileMenuItems = ({ tabMasterManager }: TabsProfilesMenuProps) => {
    const [_refresh, setRefresh] = useState(true)
    return (
        <>
            <MenuItem onClick={() => showModal(<CreateTabProfileModal tabMasterManager={tabMasterManager} />)}>
                {t('TITLE_CREATE_PROFILE', 'Create Profile')}
            </MenuItem>
            <div className={gamepadContextMenuClasses.ContextMenuSeparator} />
            {Object.keys(tabMasterManager.tabProfileManager?.tabProfiles ?? {}).map(profileName => {
                return (
                    <MenuItem
                        onClick={() => tabMasterManager.tabProfileManager?.apply(profileName, tabMasterManager)}
                        actionDescriptionMap={{
                            [GamepadButton.OK]: t('LABEL_APPLY_PROFILE', 'Apply Profile'),
                            [GamepadButton.SECONDARY]: t('LABEL_DELETE_PROFILE', 'Delete Profile'), //X
                            [GamepadButton.OPTIONS]: t('LABEL_OVERWRITE_PROFILE', 'Overwrite Profile'), //Y
                        }}
                        onSecondaryButton={() =>
                            showModal(
                                <DestructiveModal
                                    onOK={() => {
                                        tabMasterManager.tabProfileManager?.delete(profileName)
                                        setRefresh(cur => !cur)
                                    }}
                                    strTitle={`${t('TITLE_DELETE_PROFILE', 'Deleting Profile')}: ${profileName}`}
                                >
                                    {t(
                                        'MESSAGE_CONFIRM_DELETE_PROFILE',
                                        'Are you sure you want to delete this profile?'
                                    )}
                                </DestructiveModal>
                            )
                        }
                        onOptionsButton={() =>
                            showModal(
                                <OverwriteTabProfileModal
                                    profileName={profileName}
                                    tabMasterManager={tabMasterManager}
                                />
                            )
                        }
                    >
                        {profileName}
                    </MenuItem>
                )
            })}
        </>
    )
}
