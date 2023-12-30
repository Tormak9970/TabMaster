import { ConfirmModal, TextField } from 'decky-frontend-lib';
import { VFC, useState } from 'react';
import { TabMasterManager } from '../../state/TabMasterManager';

export interface CreateSnapshotModalProps {
  tabMasterManager: TabMasterManager,
  closeModal?: () => void,
}

export const CreateSnapshotModal: VFC<CreateSnapshotModalProps> = ({ tabMasterManager, closeModal }) => {
  const [name, setName] = useState<string>('');
  const visibleTabs = tabMasterManager.getTabs().visibleTabsList;

  return (
    <ConfirmModal
      onOK={() => {
        tabMasterManager.snapshotManager?.write(name, visibleTabs.map(tabContainer => tabContainer.id));
        closeModal!();
      }}
      onCancel={() => closeModal!()}
    >
      <TextField value={name} placeholder="The name for this snapshot" onChange={e => setName(e?.target.value)} />
      {visibleTabs.map(tabContainer => <div>{tabContainer.title}</div>)}
    </ConfirmModal>
  );
};

export interface OverwriteSnapshotModalProps extends CreateSnapshotModalProps {
  snapshotName: string;
}

export const OverwriteSnapshotModal: VFC<OverwriteSnapshotModalProps> = ({ snapshotName, tabMasterManager, closeModal }) => {
  const { visibleTabsList, tabsMap } = tabMasterManager.getTabs();
  const existingTabs = tabMasterManager.snapshotManager!.snapshots[snapshotName].map(tabId => tabsMap.get(tabId));

  return (
    <ConfirmModal
      onOK={() => {
        tabMasterManager.snapshotManager?.write(snapshotName, visibleTabsList.map(tabContainer => tabContainer.id));
        closeModal!();
      }}
      onCancel={() => closeModal!()}
    >
      <div style={{ display: 'flex', flexDirection: 'row' }}>
        <div>
          New Tabs:
          {visibleTabsList.map(tabContainer => <div>{tabContainer.title}</div>)}
        </div>
        <div>
          Existing Tabs:
          {existingTabs.map(tabContainer => <div>{tabContainer?.title}</div>)}
        </div>
      </div>
    </ConfirmModal>
  );
};

