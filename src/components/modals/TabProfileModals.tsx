import { ConfirmModal, Field, TextField, quickAccessControlsClasses } from 'decky-frontend-lib';
import { VFC, useState, Fragment, FC } from 'react';
import { TabMasterManager } from '../../state/TabMasterManager';
import { TabMasterContextProvider } from "../../state/TabMasterContext";
import { TabProfileModalStyles } from "../styles/TabProfileModalStyles";
import { TabListLabel } from '../TabListLabel';

export interface CreateTabProfileModalProps {
  tabMasterManager: TabMasterManager,
  closeModal?: () => void,
}

export const CreateTabProfileModal: VFC<CreateTabProfileModalProps> = ({ tabMasterManager, closeModal }) => {
  const [name, setName] = useState<string>('');
  const visibleTabs = tabMasterManager.getTabs().visibleTabsList;

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
                <TextField value={name} placeholder="The name of this tab profile" onChange={onNameChange} />
              </>
            } />
          </div>
          {/* <ScrollableWindow height='180px' fadePercent={7}> */}
            <div style={{ padding: '0 20px'}}>
              {visibleTabs.map(tabContainer => {
                return (
                  <TabItem >
                    <TabListLabel tabContainer={tabContainer} microSDeckDisabled={false} />
                  </TabItem>
                );
              })}
            </div>
          {/* </ScrollableWindow> */}
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

const TabItem: FC<{}> = ({ children }) => {
  return (
    <>
      <div style={{ padding: '0 15px', height: '28px', display: 'flex', fontSize: 'small' }}>
        {children}
      </div>
      <div
        style={{
          height: '2px',
          background: 'rgba(255,255,255,.1)',
          flexShrink: '0'
        }}
      />
    </>
  );
};


