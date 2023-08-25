import { ConfirmModal, DialogButton, showModal } from "decky-frontend-lib";
import { VFC, useState, Fragment, useEffect } from "react";
import { ModalStyles } from "../styles/ModalStyles";
import { FiltersPanel } from "../filters/FiltersPanel";
import { TabFilterSettings, FilterType } from "../filters/Filters";
import { isDefaultParams } from "../filters/Filters";
import { PythonInterop } from "../../lib/controllers/PythonInterop";
import { MdQuestionMark } from "react-icons/md";
import { FilterDescModal } from "./FilterDescModal";

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
  const [groupIncludesHidden, setGroupIncludesHidden] = useState<boolean>(!!mergeParams.includesHidden);
  const [canSave, setCanSave] = useState<boolean>(false);
  const [canAddFilter, setCanAddFilter] = useState<boolean>(true);
  const [shouldFocusAddButton, setShouldFocusAddButton] = useState(true);

  useEffect(() => {
    setShouldFocusAddButton(false);
  }, []);

  useEffect(() => {
    setCanSave(groupFilters.length >= 2);
  }, [groupFilters]);

  useEffect(() => {
    setCanAddFilter(groupFilters.length == 0 || groupFilters.every(filter => !isDefaultParams(filter)));
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
    if (canSave && canAddFilter) {
      const mergeParams = {
        filters: [...groupFilters],
        mode: groupLogicMode,
        includesHidden: groupIncludesHidden
      };

      saveMerge(mergeParams);
      closeModal();
    } else {
      PythonInterop.toast("Error", "A Merge group should have at least 2 filters");
    }
  }

  return (
    <>
      <ModalStyles />
      <div className="tab-master-modal-scope">
        <ConfirmModal onOK={onOkButton}
          onCancel={closeModal}
          strTitle={
            <div style={{ display: 'flex', marginRight: '15px', width: '100%' }}>
              <div>Merge Group</div>
              <DialogButton
                style={{ height: '28px', width: '30px', minWidth: 0, padding: '10px 12px', marginLeft: 'auto' }}
                onOKActionDescription={'Filter Descriptions'}
                onClick={() => { showModal(<FilterDescModal />); }}
              >
                <MdQuestionMark style={{ marginTop: '-4px', marginLeft: '-5px', display: 'block' }} />
              </DialogButton>
            </div>}
        >
          <FiltersPanel
            groupFilters={groupFilters}
            setGroupFilters={setGroupFilters}
            addFilter={addFilterToGroup}
            groupLogicMode={groupLogicMode}
            setGroupLogicMode={setGroupLogicMode}
            groupIncludesHidden={groupIncludesHidden}
            setGroupIncludesHidden={setGroupIncludesHidden}
            canAddFilter={canAddFilter}
            shouldFocusAddButton={shouldFocusAddButton}
            collapseFilters={isEditing}
          />
        </ConfirmModal>
      </div>
    </>
  );
};
