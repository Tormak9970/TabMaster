import {
  ButtonItem,
  DialogButton,
  Field,
  Focusable,
  Navigation,
  PanelSection,
  ReorderableEntry,
  ReorderableList,
  showContextMenu,
  quickAccessMenuClasses
} from "decky-frontend-lib";
import { VFC, useState } from "react";

import { FaBook, FaCircleExclamation, FaBookmark, FaArrowUpFromBracket } from "react-icons/fa6";
import { PiListPlusBold } from "react-icons/pi";

import { useTabMasterContext } from "../../state/TabMasterContext";

import { QamStyles } from "../styles/QamStyles";
import { showModalNewTab } from "../modals/EditTabModal";
import { TabActionsButton } from "../other/TabActions";
import { LogController } from "../../lib/controllers/LogController";
import { PresetMenu } from '../context-menus/PresetMenu';
import { TabListLabel } from '../other/TabListLabel';
import { MicroSDeckInstallState, MicroSDeckInterop, microSDeckLibVersion } from '../../lib/controllers/MicroSDeckInterop';
import { MicroSDeckNotice } from './MicroSDeckNotice';
import { CustomTabContainer } from '../../state/CustomTabContainer';
import { TabProfilesMenu } from '../context-menus/TabProfileMenu';
import { TabMasterManager } from '../../state/TabMasterManager';
import { PythonInterop } from "../../lib/controllers/PythonInterop";


export type TabIdEntryType = {
  id: string;
};

interface TabEntryInteractablesProps {
  entry: ReorderableEntry<TabIdEntryType>;
}

/**
 * The Quick Access Menu content for TabMaster.
 */
export const QuickAccessContent: VFC<{}> = ({ }) => {
  const [microSDeckNoticeHidden, setMicroSDeckNoticeHidden] = useState(MicroSDeckInterop.noticeHidden);
  const { visibleTabsList, hiddenTabsList, tabsMap, tabMasterManager } = useTabMasterContext();

  const microSDeckInstallState = MicroSDeckInterop.getInstallState();
  const isMicroSDeckInstalled = microSDeckInstallState === MicroSDeckInstallState.VERSION_COMPATIBLE;
  const hasSdTabs = !!visibleTabsList.find(tabContainer => (tabContainer as CustomTabContainer).dependsOnMicroSDeck);

  function TabEntryInteractables({ entry }: TabEntryInteractablesProps) {
    const tabContainer = tabsMap.get(entry.data!.id)!;
    return (<TabActionsButton {...{ tabContainer, tabMasterManager }} />);
  }

  const handleBackupPrompt = async () => {
    const path = await PythonInterop.openFolder();
    if (path instanceof Error) {
      LogController.raiseError('TabMaster encountered a problem opening the filepicker.', path.message);
      return;
    }

    const success = await PythonInterop.backupSettings(path);
    if (success) {
      PythonInterop.toast("Success!", "Settings backup finished.");
    } else {
      PythonInterop.toast("Error!", "Settings backup failed.");
    }
  }

  const entries = visibleTabsList.map((tabContainer) => {
    return {
      label: <TabListLabel tabContainer={tabContainer} microSDeckDisabled={!isMicroSDeckInstalled} />,
      position: tabContainer.position,
      data: { id: tabContainer.id }
    };
  });

  return (
    <div className="tab-master-scope">
      {LogController.errorFlag && <Focusable style={{ padding: '0 15px', marginBottom: '40px' }} onActivate={() => {}}>
        <h3>
          <FaCircleExclamation style={{ height: '.8em', marginRight: '5px' }} fill="red" />
          Tab Master encountered an error
        </h3>
        <div style={{ wordWrap: 'break-word' }}>
          Please reach out to
          <br />
          <a href='https://github.com/Tormak9970/TabMaster/issues'>https://github.com/Tormak9970/TabMaster/issues</a>
          <br />
          or
          <br />
          <a href='https://discord.com/channels/960281551428522045/1049449185214206053'>https://discord.com/channels/960281551428522045/1049449185214206053</a>
          <br />
          for support.
        </div>
      </Focusable>}
      {hasSdTabs && !isMicroSDeckInstalled && !microSDeckNoticeHidden && (
        <div className='notice-field-cont' style={{ paddingBottom: '10px' }}>
          <Field>
            <MicroSDeckNotice intallState={microSDeckInstallState} pluginVersion={window.MicroSDeck?.Version ?? ''} libVersion={microSDeckLibVersion} style={{ margin: '8px', fontSize: '11px' }} />
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <DialogButton
                style={{ margin: '10px 8px 0px', width: 'auto' }}
                onClick={() => {
                  MicroSDeckInterop.noticeHidden = true;
                  setMicroSDeckNoticeHidden(true);
                }}
              >
                Hide Notice
              </DialogButton>
            </div>
          </Field>
        </div>
      )}
      <QamStyles />
      <Focusable >
        <div style={{ margin: "5px", marginTop: "0px" }}>
          Here you can add, re-order, or remove tabs from the library.
        </div>
        <Field className="no-sep">
          <Focusable style={{ width: "100%", display: "flex" }}>
            <Focusable className="add-tab-btn" style={{ width: "calc(100% - 50px)" }}>
              <DialogButton disabled={!tabMasterManager.hasSettingsLoaded} onClick={() => showModalNewTab(tabMasterManager)} onOKActionDescription={'Add Tab'}>
                Add Tab
              </DialogButton>
            </Focusable>
            <Focusable className="add-tab-btn" style={{ marginLeft: "10px" }}>
              <DialogButton
                disabled={!tabMasterManager.hasSettingsLoaded}
                style={{ height: '40px', width: '42px', minWidth: 0, padding: '10px 12px', marginLeft: 'auto', display: "flex", justifyContent: "center", alignItems: "center" }}
                onOKActionDescription={'Add Quick Tab'}
                onClick={() => showContextMenu(<PresetMenu tabMasterManager={tabMasterManager} isMicroSDeckInstalled={isMicroSDeckInstalled} />)}
              >
                <PiListPlusBold size='1.4em' />
              </DialogButton>
            </Focusable>
            <Focusable className="add-tab-btn" style={{ marginLeft: "10px" }}>
              <DialogButton
                disabled={!tabMasterManager.hasSettingsLoaded}
                style={{ height: '40px', width: '42px', minWidth: 0, padding: '10px 12px', marginLeft: 'auto', display: "flex", justifyContent: "center", alignItems: "center", marginRight: "8px" }}
                onOKActionDescription={'Backup Settings'}
                onClick={handleBackupPrompt}
              >
                <FaArrowUpFromBracket size='1em' />
              </DialogButton>
            </Focusable>
          </Focusable>
        </Field>
        <PanelSection title="Tabs">
          <div className="seperator"></div>
          {tabMasterManager.hasSettingsLoaded ? (
            <ReorderableList<TabIdEntryType>
              entries={entries}
              interactables={TabEntryInteractables}
              onSave={(entries: ReorderableEntry<TabIdEntryType>[]) => {
                tabMasterManager.reorderTabs(entries.map(entry => entry.data!.id));
              }}
            />
          ) : (
            <div style={{ width: "100%", display: "flex", justifyContent: "center", alignItems: "center", padding: "5px" }}>
              Loading...
            </div>
          )}
        </PanelSection>
        <PanelSection title="Hidden Tabs">
          <div className="seperator"></div>
          {
            hiddenTabsList.map(tabContainer =>
              <div className="hidden-tab-btn">
                {/* @ts-ignore */}
                <ButtonItem label={<TabListLabel tabContainer={tabContainer} microSDeckDisabled={!isMicroSDeckInstalled} />} onClick={() => tabMasterManager.showTab(tabContainer.id)} onOKActionDescription="Unhide tab">
                  Show
                </ButtonItem>
              </div>
            )
          }
        </PanelSection>
        {hasSdTabs && !isMicroSDeckInstalled && microSDeckNoticeHidden && (
          <Focusable onActivate={() => { }}>
            <MicroSDeckNotice intallState={microSDeckInstallState} pluginVersion={window.MicroSDeck?.Version ?? ''} libVersion={microSDeckLibVersion} style={{ margin: '8px', fontSize: '11px' }} />
          </Focusable>
        )}
      </Focusable>
    </div>
  );
};

export interface QuickAccessTitleViewProps {
  title: string;
  tabMasterManager: TabMasterManager;
}

const buttonStyle = { height: '28px', width: '40px', minWidth: 0, padding: 0, display: 'flex', justifyContent: 'center', alignItems: 'center' };

export const QuickAccessTitleView: VFC<QuickAccessTitleViewProps> = ({ title, tabMasterManager }) => {

  return (
    <Focusable
      style={{
        display: 'flex',
        padding: '0',
        flex: 'auto',
        boxShadow: 'none',
      }}
      className={quickAccessMenuClasses.Title}
    >
      <div style={{ marginRight: "auto" }}>{title}</div>
      <DialogButton
        disabled={!tabMasterManager.hasSettingsLoaded}
        onOKActionDescription="Manage Tab Profiles"
        style={buttonStyle}
        onClick={() => showContextMenu(<TabProfilesMenu tabMasterManager={tabMasterManager} />)}
      >
        <FaBookmark size='0.9em' />
      </DialogButton>
      <DialogButton
        onOKActionDescription="Open Docs"
        style={buttonStyle}
        onClick={() => {
          Navigation.CloseSideMenus();
          Navigation.Navigate("/tab-master-docs");
        }}
      >
        <FaBook size='0.9em'/>
      </DialogButton>
    </Focusable>
  );
};
