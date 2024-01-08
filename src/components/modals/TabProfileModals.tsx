import { ConfirmModal, Field, TextField, afterPatch, quickAccessControlsClasses } from 'decky-frontend-lib';
import { VFC, useEffect, useState, Fragment } from 'react';
import { TabMasterManager } from '../../state/TabMasterManager';
import { TabMasterContextProvider } from "../../state/TabMasterContext";
import { TabProfileModalStyles } from "../styles/TabProfileModalStyles";

export interface CreateTabProfileModalProps {
  tabMasterManager: TabMasterManager,
  closeModal?: () => void,
}

export const CreateTabProfileModal: VFC<CreateTabProfileModalProps> = ({ tabMasterManager, closeModal }) => {
  const [name, setName] = useState<string>('');
  const visibleTabs = tabMasterManager.getTabs().visibleTabsList;
  const [patchInput, setPatchInput] = useState<boolean>(true);

  const nameInputElement = <TextField value={name} placeholder="The name of this tab profile" onChange={onNameChange} />;

  //reference to input field class component instance, which has a focus method
  let inputComponentInstance: any;

  if (patchInput) {
    afterPatch(nameInputElement.type.prototype, 'render', function (_: any, ret: any) {
      //@ts-ignore     get reference to instance
      inputComponentInstance = this;
      return ret;
    }, { singleShot: true });
  }

  useEffect(() => {
    inputComponentInstance.Focus();
    setPatchInput(false);
  }, []);

  function onNameChange(e: React.ChangeEvent<HTMLInputElement>) {
    setName(e?.target.value);
  }

  return (
    <TabMasterContextProvider tabMasterManager={tabMasterManager}>
      <TabProfileModalStyles />
      <div className="tab-master-tab-profile-modal-scope">
        <ConfirmModal
          strTitle={"Create New Tab Profile"}
          onOK={() => {
            tabMasterManager.tabProfileManager?.write(name, visibleTabs.map(tabContainer => tabContainer.id));
            closeModal!();
          }}
          onCancel={() => closeModal!()}
        >
          <div style={{ padding: "4px 16px 1px" }} className="name-field">
            <Field description={
              <>
                <div style={{ paddingBottom: "6px" }} className={quickAccessControlsClasses.PanelSectionTitle}>
                  Profile Name
                </div>
                {nameInputElement}
              </>
            } />
          </div>
          {visibleTabs.map(tabContainer => <div>{tabContainer.title}</div>)}
        </ConfirmModal>
      </div>
    </TabMasterContextProvider>
  );
};

export interface OverwriteTabProfileModalProps extends CreateTabProfileModalProps {
  profileName: string;
}

export const OverwriteTabProfileModal: VFC<OverwriteTabProfileModalProps> = ({ profileName, tabMasterManager, closeModal }) => {
  const { visibleTabsList, tabsMap } = tabMasterManager.getTabs();
  const existingTabs = tabMasterManager.tabProfileManager!.tabProfiles[profileName].map(tabId => tabsMap.get(tabId));

  return (
    <TabMasterContextProvider tabMasterManager={tabMasterManager}>
      <TabProfileModalStyles />
      <div className="tab-master-tab-profile-modal-scope">
        <ConfirmModal
          strTitle={`Overwriting Profile: ${profileName}`}
          onOK={() => {
            tabMasterManager.tabProfileManager?.write(profileName, visibleTabsList.map(tabContainer => tabContainer.id));
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
      </div>
    </TabMasterContextProvider>
  );
};

