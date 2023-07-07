import { ConfirmModal, showModal } from "decky-frontend-lib"
import { VFC, useState } from "react"
import { ModalStyles } from "../styles/ModalStyles"
import { TabFilterSettings, FilterType } from "../filters/Filters"
import { PythonInterop } from "../../lib/controllers/PythonInterop"
import { ErroredFiltersPanel } from "../changes-needed/ErroredFiltersPanel"
import { ErrorPanelTabNameContext } from "../../state/ErrorPanelNameContext"

interface FixMergeFilterModalProps {
  mergeParams: TabFilterSettings<'merge'>['params'],
  mergeErrorEntries: FilterErrorEntry[],
  saveMerge: (groupParams: TabFilterSettings<'merge'>['params']) => void,
  isPassingOuter: boolean,
  setIsPassingOuter: React.Dispatch<React.SetStateAction<boolean>>,
  tabName: string,
  closeModal: () => void;
}

/**
 * Modal for fixing a Merge Filter.
 */
export const FixMergeFilterModal: VFC<FixMergeFilterModalProps> = ({ mergeParams, mergeErrorEntries, isPassingOuter, setIsPassingOuter, saveMerge, closeModal, tabName }) => {
  const [filters, setFilters] = useState<(TabFilterSettings<FilterType> | [])[]>(mergeParams.filters);
  const [isPassing, setIsPassing] = useState(isPassingOuter);

  function setPassing(passing: boolean) {
    setIsPassing(passing);
    setIsPassingOuter(passing);
  }

  function onChange(filters: (TabFilterSettings<FilterType> | [])[], messages: string[][]) {
    setFilters(filters);

    const passing = messages.every((entry) => entry.length === 0);
    setPassing(passing);
  }

  function onOkButton() {
    if (isPassing) {
      const newMergeParams = {
        filters: filters.flatMap(filter => filter),
        mode: mergeParams.mode
      }

      saveMerge(newMergeParams);
      closeModal();
    } else {
      PythonInterop.toast("Error", "All errors must be resolved before saving");
    }
  }

  return (
    <ConfirmModal
      onOK={() => {
        showModal(
          <ConfirmModal
            className={'tab-master-destructive-modal'}
            onOK={onOkButton}
            bDestructiveWarning={true}
            strTitle="WARNING!"
          >
            Are you sure you want save these fixes to this merge group? This can't be can't be changed later.
          </ConfirmModal>
        );
      }}
      bOKDisabled={!isPassing}
      strOKButtonText={"Save Changes"}
      onCancel={closeModal}
      strCancelButtonText={"Discard Changes"}
      strTitle={`Fix Merge Group in Tab ${tabName}`}
    >
      <ModalStyles />
      <div className="tab-master-modal-scope">
        {isPassing && <div>All errors have been resolved.</div>}
        <ErrorPanelTabNameContext.Provider value={tabName}>
          <ErroredFiltersPanel
            isMergeGroup={true}
            filters={filters}
            errorEntries={mergeErrorEntries}
            onChange={onChange}
          />
        </ErrorPanelTabNameContext.Provider>
      </div>
    </ConfirmModal>
  )
}
