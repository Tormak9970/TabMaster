import {
  Button,
  ModalRoot,
  PanelSection,
  PanelSectionRow,
} from "decky-frontend-lib";
import { useState, VFC, useEffect } from "react";
import { PythonInterop } from "../../lib/controllers/PythonInterop";
import { TabMasterContextProvider } from "../../state/TabMasterContext";
import type { TabMasterManager } from "../../state/TabMasterManager";
import { ModalStyles } from "../styles/ModalStyles";
import { TabPanel } from "../changes-needed/TabPanel";

type ChangeTabModalRootProps = {
  closeModal?: () => void,
  onConfirm: (fixedTabSettings: TabSettingsDictionary) => void,
  tabs: TabSettingsDictionary,
  erroredFiltersMap: Map<string, FilterErrorEntry[]>
  tabMasterManager: TabMasterManager
}

/**
 * Modal root for the Changes Needed modal.
 */
export const ChangeTabModalRoot: VFC<ChangeTabModalRootProps> = ({ closeModal, onConfirm, tabs, erroredFiltersMap, tabMasterManager }) => {
  return (
    <ModalRoot onCancel={closeModal} onEscKeypress={closeModal} bAllowFullSize>
      <TabMasterContextProvider tabMasterManager={tabMasterManager}>
        <ModalStyles />
        <ChangeTabModal onConfirm={onConfirm} tabs={tabs} erroredFiltersMap={erroredFiltersMap} />
      </TabMasterContextProvider>
    </ModalRoot>
  );
}


type ChangeTabModalProps = {
  onConfirm: (fixedTabSettings: TabSettingsDictionary) => void,
  tabs: TabSettingsDictionary,
  erroredFiltersMap: Map<string, FilterErrorEntry[]>
}

/**
 * The modal for editing and creating custom tabs.
 */
const ChangeTabModal: VFC<ChangeTabModalProps> = ({ onConfirm, tabs, erroredFiltersMap }) => {
  const [changedTabs, setChangedTabs] = useState<TabSettingsDictionary>(Object.fromEntries(Object.entries(tabs).filter(([id]) => erroredFiltersMap.has(id))));
  const [isPassingMap, setIsPassingMap] = useState<{ [tabId: string]: boolean}>(Object.fromEntries(Object.keys(tabs).map((key) => [key, false])));
  const [canApply, setCanApply] = useState<boolean>(false);

  useEffect(() => {
    setCanApply(Object.values(isPassingMap).every((isPassing) => isPassing));
  }, [isPassingMap]);

  function updateTabStatus(tab: TabSettings, isPassing: boolean) {
    const passingMap = {...isPassingMap};
    passingMap[tab.id] = isPassing;
    setIsPassingMap(passingMap);

    const fixedTabs = {...changedTabs};
    fixedTabs[tab.id] = tab;
    setChangedTabs(fixedTabs);
  }

  function onApply() {
    if (canApply) {
      const fixedTabs = tabs;

      for (const changedTab of Object.values(changedTabs)) {
        fixedTabs[changedTab.id] = changedTab;
      }

      onConfirm(changedTabs);
    } else {
      PythonInterop.toast("Error", "Please fix all tabs before saving");
    }
  }

  return (
    <div className="tab-master-modal-scope">
      <h1>Changes Needed for One or More Tabs</h1>
      <PanelSection>
        <PanelSectionRow>
          TabMaster has found an issue with one or more of your tabs. Please take a moment to review the issue below, and correct it. Not doing so may result in TabMaster not functioning properly.
        </PanelSectionRow>
      </PanelSection>
      <PanelSection title="Tabs With Errors">
        <PanelSectionRow>
          {Object.values(changedTabs).map((tab: TabSettings, idx: number) => {
            return <TabPanel index={idx} tab={tab} erroredFilters={erroredFiltersMap.get(tab.id)!} onTabStatusChange={updateTabStatus} />
          })}
        </PanelSectionRow>
      </PanelSection>
      <PanelSection>
        <PanelSectionRow>
          <Button onClick={onApply} disabled={!canApply} >
            Apply Fixes
          </Button>
        </PanelSectionRow>
      </PanelSection>
    </div>
  );
}
