import { Menu, MenuGroup, MenuItem, showModal } from 'decky-frontend-lib';
import { VFC, Fragment } from 'react';
import { TabMasterManager } from '../../state/TabMasterManager';
import { CreateTabGroupModal, OverwriteTabGroupModal } from '../modals/TabGroupModals';

interface TabsGroupMenuProps {
  tabMasterManager: TabMasterManager,
}

/**
 * Context menu for managing Tab Groups.
 */
export const TabGroupsMenu: VFC<TabsGroupMenuProps> = ({ tabMasterManager }) => {
  return <Menu label='Manage Tab Groups'>
    <TabGroupMenuItems tabMasterManager={tabMasterManager} />
  </Menu>;
};

/**
 * Context menu sub-menu for managing Tab Groups.
 */
export const TabGroupsSubMenu: VFC<TabsGroupMenuProps> = ({ tabMasterManager }) => {
  return <MenuGroup label='Manage Tab Groups'>
    <TabGroupMenuItems tabMasterManager={tabMasterManager} />
  </MenuGroup>;
};

/**
 * Menu items for the Tab Group context menu.
 */
const TabGroupMenuItems: VFC<TabsGroupMenuProps> = ({ tabMasterManager }) => {
  return (
    <>
      <MenuItem onClick={() => showModal(<CreateTabGroupModal tabMasterManager={tabMasterManager} />)}>
        Create Group
      </MenuItem>
      <OverwriteTabGroupMenu tabMasterManager={tabMasterManager} />
      {/* <div className={gamepadContextMenuClasses.ContextMenuSeparator} /> */}
      <ApplyTabGroupMenu tabMasterManager={tabMasterManager} />
    </>
  );
};

/**
 * The overwrite menu for Tab Groups.
 */
const OverwriteTabGroupMenu: VFC<TabsGroupMenuProps> = ({ tabMasterManager }) => {
  return (
    <MenuGroup label='Overwrite Tab Group' disabled={Object.keys(tabMasterManager.tabGroupManager?.snapshots ?? {}).length === 0}>
      {Object.keys(tabMasterManager.tabGroupManager?.snapshots ?? {}).map(snapshotName => {
        return (
          <MenuItem onClick={() => showModal(<OverwriteTabGroupModal groupName={snapshotName} tabMasterManager={tabMasterManager} />)}>
            {snapshotName}
          </MenuItem>
        );
      })}
    </MenuGroup>
  );
};

/**
 * The apply menu for Tab Groups.
 */
const ApplyTabGroupMenu: VFC<TabsGroupMenuProps> = ({ tabMasterManager }) => {
  return (
    <MenuGroup label='Apply Tab Group' disabled={Object.keys(tabMasterManager.tabGroupManager?.snapshots ?? {}).length === 0}>
      {Object.keys(tabMasterManager.tabGroupManager?.snapshots ?? {}).map(snapshotName => {
        return (
          <MenuItem onClick={() => tabMasterManager.tabGroupManager?.apply(snapshotName, tabMasterManager)}>
            {snapshotName}
          </MenuItem>
        );
      })}
    </MenuGroup>
  );
};


