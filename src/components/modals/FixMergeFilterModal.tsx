import { ConfirmModal } from "decky-frontend-lib"
import { VFC, useState, Fragment } from "react"
import { ModalStyles } from "../styles/ModalStyles"
import { TabFilterSettings, FilterType } from "../filters/Filters"
import { PythonInterop } from "../../lib/controllers/PythonInterop"
import { ErroredFiltersPanel } from "../changes-needed/ErroredFiltersPanel"

interface FixMergeFilterModalProps {
  mergeParams: TabFilterSettings<'merge'>['params'],
  mergeErrorEntries: FilterErrorEntry[],
  saveMerge: (groupParams: TabFilterSettings<'merge'>['params']) => void,
  closeModal: () => void
}

/**
 * Modal for fixing a Merge Filter.
 */
export const FixMergeFilterModal: VFC<FixMergeFilterModalProps> = ({ mergeParams, mergeErrorEntries, saveMerge, closeModal }) => {
  const [filters, setFilters] = useState<(TabFilterSettings<FilterType> | [])[]>(mergeParams.filters);
  const [isPassing, setIsPassing] = useState(false);

  function onChange(filters: (TabFilterSettings<FilterType> | [])[], messages: string[][]) {
    setFilters(filters);

    const passing = messages.every((entry) => entry.length === 0);
    setIsPassing(passing);
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
    <>
      <ModalStyles />
      <div className="tab-master-modal-scope">
        <ConfirmModal onOK={onOkButton} strOKButtonText={"Apply"} onCancel={closeModal} strCancelButtonText={"Close"} strTitle="Merge Group">
          <ErroredFiltersPanel
            isMergeGroup={true}
            filters={filters}
            errorEntries={mergeErrorEntries}
            onChange={onChange}
          />
        </ConfirmModal>
      </div>
    </>
  )
}
