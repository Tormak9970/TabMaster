import { Menu, MenuGroup, MenuItem, showModal } from 'decky-frontend-lib';
import { VFC, Fragment } from 'react';
import { TabMasterManager } from '../../state/TabMasterManager';
import { CreateSnapshotModal, OverwriteSnapshotModal } from '../modals/SnapshotModals';
import { gamepadContextMenuClasses } from '../../lib/GamepadContextMenuClasses';

interface SnapshotMenuProps {
  tabMasterManager: TabMasterManager,
}

export const SnapshotMenu: VFC<SnapshotMenuProps> = ({ tabMasterManager }) => {
  return <Menu label='Manage Tab Visibility Snapshots'>
    <SnapshotMenuItems tabMasterManager={tabMasterManager} />
  </Menu>;
};


export const SnapshotMenuItems: VFC<SnapshotMenuProps> = ({ tabMasterManager }) => {
  return (
    <>
      <MenuItem onClick={() => showModal(<CreateSnapshotModal tabMasterManager={tabMasterManager} />)}>
        New
      </MenuItem>
      <OverwriteSnapshotMenuGroup tabMasterManager={tabMasterManager} />
      <div className={gamepadContextMenuClasses.ContextMenuSeparator} />
      <ApplySnapshotMenuGroup label='Apply' tabMasterManager={tabMasterManager} />
    </>
  );
};

export const OverwriteSnapshotMenuGroup: VFC<SnapshotMenuProps> = ({ tabMasterManager }) => {

  return (
    <MenuGroup label='Overwrite'>
      {Object.keys(tabMasterManager.snapshotManager?.snapshots ?? {}).map(snapshotName => {
        return (
          <MenuItem onClick={() => showModal(<OverwriteSnapshotModal snapshotName={snapshotName} tabMasterManager={tabMasterManager} />)}>
            {snapshotName}
          </MenuItem>
        );
      })}
    </MenuGroup>
  );
};

interface ApplySnapshotMenuGroupProps extends SnapshotMenuProps {
  label: string;
}

export const ApplySnapshotMenuGroup: VFC<ApplySnapshotMenuGroupProps> = ({ label, tabMasterManager }) => {

  return (
    <MenuGroup label={label}>
      {Object.keys(tabMasterManager.snapshotManager?.snapshots ?? {}).map(snapshotName => {
        return (
          <MenuItem onClick={() => tabMasterManager.snapshotManager?.apply(snapshotName, tabMasterManager)}>
            {snapshotName}
          </MenuItem>
        );
      })}
    </MenuGroup>
  );
};


