import { ConfirmModal, showModal } from "decky-frontend-lib"
import { VFC, useState, Fragment } from "react"
import { TabFilterSettings, FilterType } from "../filters/Filters"
import { PythonInterop } from "../../lib/controllers/PythonInterop"
import { ErroredFiltersPanel } from "../changes-needed/ErroredFiltersPanel"
import { ErrorPanelTabNameContext } from "../../state/ErrorPanelNameContext"
import { FixModalStyles } from "../styles/FixModalStyles"
import { DestructiveModal } from '../generic/DestructiveModal';

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

  function onChange(filters: (TabFilterSettings<FilterType> | [])[], messages: string[][]) {
    setFilters(filters);

    const passing = messages.every((entry) => entry.length === 0);
    setIsPassing(passing);
  }

  function onOkButton() {
    if (isPassing) {
      const newMergeParams = {
        filters: filters.flatMap(filter => filter),
        mode: mergeParams.mode,
      }

      setIsPassingOuter(true);
      saveMerge(newMergeParams);
      closeModal();
    } else {
      PythonInterop.toast("Error", "All errors must be resolved before saving");
    }
  }

  return (
    <>
      <FixModalStyles />
      <div className="tab-master-fix-modal-scope">
        <ConfirmModal
          onOK={() => {
            showModal(
              <DestructiveModal
                onOK={onOkButton}
                strTitle="WARNING!"
              >
                Are you sure you want save these fixes to this merge group? This can't be can't be changed later.
              </DestructiveModal>
            );
          }}
          bOKDisabled={!isPassing}
          strOKButtonText={"Save Changes"}
          onCancel={closeModal}
          strCancelButtonText={"Discard Changes"}
          strTitle={`Fix Merge Group in Tab ${tabName}`}
        >
          {isPassing && <div>All errors have been resolved.</div>}
          <ErrorPanelTabNameContext.Provider value={tabName}>
            <ErroredFiltersPanel
              isMergeGroup={true}
              filters={filters}
              errorEntries={mergeErrorEntries}
              onChange={onChange}
            />
          </ErrorPanelTabNameContext.Provider>
        </ConfirmModal>
      </div>
    </>
  )
}
