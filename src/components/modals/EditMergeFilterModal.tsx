import { ConfirmModal } from "decky-frontend-lib";
import { VFC, useState, Fragment, useEffect } from "react";
import { ModalStyles } from "../styles/ModalStyles";
import { FiltersPanel } from "../filters/FiltersPanel";
import { TabFilterSettings, FilterType } from "../filters/Filters";
import { isValidParams } from "../filters/Filters";
import { PythonInterop } from "../../lib/controllers/PythonInterop";

interface EditMergeFilterModalProps {
  mergeParams: TabFilterSettings<'merge'>['params'],
  saveMerge: (groupParams: TabFilterSettings<'merge'>['params']) => void,
  closeModal: () => void,
  isEditing: boolean
}

/**
 * Modal for editing a Merge Filter.
 */
export const EditMergeFilterModal: VFC<EditMergeFilterModalProps> = ({ closeModal, mergeParams, saveMerge, isEditing }) => {
  const [groupFilters, setGroupFilters] = useState<TabFilterSettings<FilterType>[]>(mergeParams.filters);
  const [groupLogicMode, setGroupLogicMode] = useState<LogicalMode>(mergeParams.mode);
  const [canSave, setCanSave] = useState<boolean>(false);
  const [canAddFilter, setCanAddFilter] = useState<boolean>(true);
  const [shouldFocusAddButton, setShouldFocusAddButton] = useState(true);

  useEffect(() => {
    setShouldFocusAddButton(false);
  }, []);

  useEffect(() => {
    setCanSave(groupFilters.length >= 2 && canAddFilter);
  }, [groupFilters, canAddFilter]);

  useEffect(() => {
    setCanAddFilter(groupFilters.length == 0 || groupFilters.every(filter => isValidParams(filter)));
  }, [groupFilters]);

  function addFilterToGroup() {
    const updatedFilters = [...groupFilters];
    updatedFilters.push({
      type: "collection",
      inverted: false,
      params: { id: "", name: "" }
    });

    setGroupFilters(updatedFilters);
  }

  function onOkButton() {
    if (canSave) {
      const mergeParams = {
        filters: [...groupFilters],
        mode: groupLogicMode,
      };

      saveMerge(mergeParams);
      closeModal();
    } else {
      if(!canAddFilter) PythonInterop.toast("Cannot Save Merge Group", "Some filters are incomplete");
      else PythonInterop.toast("Cannot Save Merge Group", "A Merge group should have at least 2 filters");
    }
  }

  return (
    <>
      <ModalStyles />
      <div className="tab-master-modal-scope">
        <ConfirmModal onOK={onOkButton}
          onCancel={closeModal}
          strTitle={"Merge Group"}
          strOKButtonText="Save Group"
        >
          <FiltersPanel
            groupFilters={groupFilters}
            setGroupFilters={setGroupFilters}
            addFilter={addFilterToGroup}
            groupLogicMode={groupLogicMode}
            setGroupLogicMode={setGroupLogicMode}
            canAddFilter={canAddFilter}
            shouldFocusAddButton={shouldFocusAddButton}
            collapseFilters={isEditing}
          />
        </ConfirmModal>
      </div>
    </>
  );
};
