import {
  DialogButton,
  Field,
  Focusable,
  Navigation,
  showContextMenu,
  quickAccessMenuClasses
} from "decky-frontend-lib";
import { VFC, useState } from "react";

import { FaBook, FaBookmark, FaArrowUpFromBracket } from "react-icons/fa6";
import { PiListPlusBold } from "react-icons/pi";

import { useTabMasterContext } from "../../state/TabMasterContext";

import { QamStyles } from '../styles/QamStyles';
import { showModalNewTab } from "../modals/EditTabModal";
import { LogController } from '../../lib/controllers/LogController';
import { PresetMenu } from '../context-menus/PresetMenu';
import { MicroSDeckInstallState, MicroSDeckInterop, microSDeckLibVersion } from '../../lib/controllers/MicroSDeckInterop';
import { MicroSDeckNotice } from './MicroSDeckNotice';
import { CustomTabContainer } from '../../state/CustomTabContainer';
import { TabProfilesMenu } from '../context-menus/TabProfileMenu';
import { TabMasterManager } from '../../state/TabMasterManager';
import { PythonInterop } from '../../lib/controllers/PythonInterop';
import { GITHUB_URL, DISCORD_URL } from '../../constants';
import { InvalidSettingsNotice } from './InvalidSettingsNotice';
import { TabsPanelSection } from './TabsPanelSection';
import { ErrorNotice } from './ErrorNotice';


export type TabIdEntryType = {
  id: string;
};


/**
 * The Quick Access Menu content for TabMaster.
 */
export const QuickAccessContent: VFC<{}> = ({ }) => {
  const [microSDeckNoticeHidden, setMicroSDeckNoticeHidden] = useState(MicroSDeckInterop.noticeHidden);
  const [showError, setShowError] = useState(LogController.errorFlag);
  const { visibleTabsList, tabMasterManager } = useTabMasterContext();
  const [showResetTabs, setShowResetTabs] = useState(tabMasterManager.invalidSettingsLoaded.isTrue);

  const microSDeckInstallState = MicroSDeckInterop.getInstallState();
  const isMicroSDeckInstalled = microSDeckInstallState === MicroSDeckInstallState.VERSION_COMPATIBLE;
  const hasSdTabs = !!visibleTabsList.find(tabContainer => (tabContainer as CustomTabContainer).dependsOnMicroSDeck);



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
  };

  const confirmTabReset = async () => {
    await tabMasterManager.invalidSettingsLoaded.confirmReset();
    setShowResetTabs(false);
  };

  const support = <div style={{ wordWrap: 'break-word' }}>
    Please reach out to
    <br />
    <a href={GITHUB_URL}>{GITHUB_URL}</a>
    <br />
    or
    <br />
    <a href={DISCORD_URL}>{DISCORD_URL}</a>
    <br />
    for support.
  </div>;

  return (
    <div className="tab-master-scope">
      {showError && <ErrorNotice onDismiss={() => setShowError(LogController.errorFlag = false)}>{support}</ErrorNotice>}
      {showResetTabs && <InvalidSettingsNotice onOk={confirmTabReset}>{support}</InvalidSettingsNotice>}
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
      {!showResetTabs && <Focusable >
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
        {<TabsPanelSection isMicroSDeckInstalled={isMicroSDeckInstalled} />}
        {hasSdTabs && !isMicroSDeckInstalled && microSDeckNoticeHidden && (
          <Focusable onActivate={() => { }}>
            <MicroSDeckNotice intallState={microSDeckInstallState} pluginVersion={window.MicroSDeck?.Version ?? ''} libVersion={microSDeckLibVersion} style={{ margin: '8px', fontSize: '11px' }} />
          </Focusable>
        )}
      </Focusable>}
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
        <FaBook size='0.9em' />
      </DialogButton>
    </Focusable>
  );
};
