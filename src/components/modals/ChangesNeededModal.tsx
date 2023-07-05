import {
  Button,
  ModalRoot,
  PanelSection,
  PanelSectionRow,
} from "decky-frontend-lib";
import { useState, VFC, useEffect } from "react";
import type { FilterType, TabFilterSettings } from "../filters/Filters";
import { PythonInterop } from "../../lib/controllers/PythonInterop";
import { TabMasterContextProvider } from "../../state/TabMasterContext";
import type { TabMasterManager } from "../../state/TabMasterManager";
import { ModalStyles } from "../styles/ModalStyles";

type ChangesNeededModalRootProps = {
  closeModal?: () => void,
  onConfirm: (fixedTabSettings: TabSettingsDictionary) => void,
  tabs: TabSettingsDictionary,
  erroredFiltersMap: Map<string, FilterErrorEntry[]>
  tabMasterManager: TabMasterManager
}

/**
 * Modal root for the Changes Needed modal.
 */
export const ChangesNeededModalRoot: VFC<ChangesNeededModalRootProps> = ({ closeModal, onConfirm, tabs, erroredFiltersMap, tabMasterManager }) => {
  return (
    <ModalRoot onCancel={closeModal} onEscKeypress={closeModal} bAllowFullSize>
      <TabMasterContextProvider tabMasterManager={tabMasterManager}>
        <ModalStyles />
        <ChangesNeededModal onConfirm={onConfirm} tabs={tabs} erroredFiltersMap={erroredFiltersMap} />
      </TabMasterContextProvider>
    </ModalRoot>
  );
}


type ChangesNeededModalProps = {
  onConfirm: (fixedTabSettings: TabSettingsDictionary) => void,
  tabs: TabSettingsDictionary,
  erroredFiltersMap: Map<string, FilterErrorEntry[]>
}

/**
 * The modal for editing and creating custom tabs.
 */
export const ChangesNeededModal: VFC<ChangesNeededModalProps> = ({ onConfirm, tabs }) => {
  const [canApply, setCanApply] = useState<boolean>(false);

  useEffect(() => {
    setCanApply();
  }, []);

  function onApply() {
    if (canApply) {
      // TODO: handle saving changes
      // onConfirm();
      closeModal!();
    } else {
      // TODO: change the following
      PythonInterop.toast("Error", "Please TODO before saving");
    }
  }

  return (
    <div className="tab-master-modal-scope">
      <h1>Action Needed for One or More Tabs</h1>
      <PanelSection>
        <PanelSectionRow>
          TabMaster has found an issue with one or more of your tabs. Please take a moment to review the issue below, and correct it. Not doing so may result in TabMaster not functioning properly.
        </PanelSectionRow>
        <PanelSectionRow>
          {/* TODO: tabs here */}
        </PanelSectionRow>
        <PanelSectionRow>
          <Button onClick={onApply} disabled={!canApply} >
            Apply Fixes
          </Button>
        </PanelSectionRow>
      </PanelSection>
    </div>
  );
}
