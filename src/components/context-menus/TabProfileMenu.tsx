import { Menu, MenuGroup, MenuItem, showModal } from 'decky-frontend-lib';
import { VFC, Fragment } from 'react';
import { TabMasterManager } from '../../state/TabMasterManager';
import { CreateTabProfileModal, OverwriteTabProfileModal } from '../modals/TabProfileModals';

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
  return (
    <>
      <MenuItem onClick={() => showModal(<CreateTabProfileModal tabMasterManager={tabMasterManager} />)}>
        Create Profile
      </MenuItem>
      <OverwriteTabProfileMenu tabMasterManager={tabMasterManager} />
      {/* <div className={gamepadContextMenuClasses.ContextMenuSeparator} /> */}
      <ApplyTabProfile tabMasterManager={tabMasterManager} />
    </>
  );
};

/**
 * The overwrite menu for Tab Profiles.
 */
const OverwriteTabProfileMenu: VFC<TabsProfilesMenuProps> = ({ tabMasterManager }) => {
  return (
    <MenuGroup label='Overwrite Tab Profile' disabled={Object.keys(tabMasterManager.tabProfileManager?.tabProfiles ?? {}).length === 0}>
      {Object.keys(tabMasterManager.tabProfileManager?.tabProfiles ?? {}).map(snapshotName => {
        return (
          <MenuItem onClick={() => showModal(<OverwriteTabProfileModal profileName={snapshotName} tabMasterManager={tabMasterManager} />)}>
            {snapshotName}
          </MenuItem>
        );
      })}
    </MenuGroup>
  );
};

/**
 * The apply menu for Tab Profiles.
 */
const ApplyTabProfile: VFC<TabsProfilesMenuProps> = ({ tabMasterManager }) => {
  return (
    <MenuGroup label='Apply Tab Profile' disabled={Object.keys(tabMasterManager.tabProfileManager?.tabProfiles ?? {}).length === 0}>
      {Object.keys(tabMasterManager.tabProfileManager?.tabProfiles ?? {}).map(snapshotName => {
        return (
          <MenuItem onClick={() => tabMasterManager.tabProfileManager?.apply(snapshotName, tabMasterManager)}>
            {snapshotName}
          </MenuItem>
        );
      })}
    </MenuGroup>
  );
};


