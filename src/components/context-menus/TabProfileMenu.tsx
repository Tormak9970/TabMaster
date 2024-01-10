import { Menu, MenuGroup, MenuItem, showModal, GamepadButton } from 'decky-frontend-lib';
import { VFC, Fragment, useState } from 'react';
import { TabMasterManager } from '../../state/TabMasterManager';
import { CreateTabProfileModal, OverwriteTabProfileModal } from '../modals/TabProfileModals';
import { gamepadContextMenuClasses } from '../../lib/GamepadContextMenuClasses';
import { DestructiveModal } from '../generic/DestructiveModal';


interface TabsProfilesMenuProps {
  tabMasterManager: TabMasterManager,
}

/**
 * Context menu for managing Tab Profiles.
 */
export const TabProfilesMenu: VFC<TabsProfilesMenuProps> = ({ tabMasterManager }) => {
  return <Menu label='Manage Tab Profiles'>
    <TabProfileMenuItems tabMasterManager={tabMasterManager} />
  </Menu>;
};

/**
 * Context menu sub-menu for managing Tab Profiles.
 */
export const TabProfilesSubMenu: VFC<TabsProfilesMenuProps> = ({ tabMasterManager }) => {
  return <MenuGroup label='Manage Tab Profiles'>
    <TabProfileMenuItems tabMasterManager={tabMasterManager} />
  </MenuGroup>;
};

/**
 * Menu items for the Tab Profiles context menu.
 */
const TabProfileMenuItems: VFC<TabsProfilesMenuProps> = ({ tabMasterManager }) => {
  const [_refresh, setRefresh] = useState(true);
  return (
    <>
      <MenuItem onClick={() => showModal(<CreateTabProfileModal tabMasterManager={tabMasterManager} />)}>
        Create Profile
      </MenuItem>
      <div className={gamepadContextMenuClasses.ContextMenuSeparator} />
      {Object.keys(tabMasterManager.tabProfileManager?.tabProfiles ?? {}).map(profileName => {
        return (
          <MenuItem
            onClick= {() => tabMasterManager.tabProfileManager?.apply(profileName, tabMasterManager)}
            actionDescriptionMap={{
              [GamepadButton.OK]: 'Apply Profile',
              [GamepadButton.SECONDARY]: 'Delete Profile', //X
              [GamepadButton.OPTIONS]: 'Overwrite Profile', //Y
            }}
            onSecondaryButton={() =>
              showModal(<DestructiveModal
                onOK={() => {
                  tabMasterManager.tabProfileManager?.delete(profileName);
                  setRefresh(cur => !cur);
                }}
                strTitle={`Deleting Profile: ${profileName}`}
              >
                Are you sure you want to delete this profile?
              </DestructiveModal>)
            }
            onOptionsButton={() => showModal(<OverwriteTabProfileModal profileName={profileName} tabMasterManager={tabMasterManager} />)}
          >
            {profileName}
          </MenuItem>
        );
      })}
    </>
  );
};


