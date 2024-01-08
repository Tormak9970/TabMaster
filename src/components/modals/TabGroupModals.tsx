import { ConfirmModal, TextField } from 'decky-frontend-lib';
import { VFC, useState } from 'react';
import { TabMasterManager } from '../../state/TabMasterManager';

export interface CreateTabGroupModalProps {
  tabMasterManager: TabMasterManager,
  closeModal?: () => void,
}

export const CreateTabGroupModal: VFC<CreateTabGroupModalProps> = ({ tabMasterManager, closeModal }) => {
  const [name, setName] = useState<string>('');
  const visibleTabs = tabMasterManager.getTabs().visibleTabsList;

  return (
    <ConfirmModal
      onOK={() => {
        tabMasterManager.tabGroupManager?.write(name, visibleTabs.map(tabContainer => tabContainer.id));
        closeModal!();
      }}
      onCancel={() => closeModal!()}
    >
      <TextField value={name} placeholder="The name for this group" onChange={e => setName(e?.target.value)} />
      {visibleTabs.map(tabContainer => <div>{tabContainer.title}</div>)}
    </ConfirmModal>
  );
};

export interface OverwriteTabGroupModalProps extends CreateTabGroupModalProps {
  groupName: string;
}

export const OverwriteTabGroupModal: VFC<OverwriteTabGroupModalProps> = ({ groupName, tabMasterManager, closeModal }) => {
  const { visibleTabsList, tabsMap } = tabMasterManager.getTabs();
  const existingTabs = tabMasterManager.tabGroupManager!.tabGroups[groupName].map(tabId => tabsMap.get(tabId));

  return (
    <ConfirmModal
      onOK={() => {
        tabMasterManager.tabGroupManager?.write(groupName, visibleTabsList.map(tabContainer => tabContainer.id));
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

