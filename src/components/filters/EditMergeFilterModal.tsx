import { ConfirmModal } from "decky-frontend-lib"
import { VFC, useState, Fragment, useEffect } from "react"
import { ModalStyles } from "../styles/ModalStyles"
import { FilterEditorPanel } from "./FilterEditorPanel"
import { TabFilterSettings, FilterType } from "./Filters"
import { isDefaultParams } from "./Filters"
import { PythonInterop } from "../../lib/controllers/PythonInterop"

interface EditMergeFilterModalProps {
  mergeParams: TabFilterSettings<'merge'>['params']
  saveMerge: (groupParams: TabFilterSettings<'merge'>['params']) => void
  closeModal: () => void
}

export const EditMergeFilterModal: VFC<EditMergeFilterModalProps> = ({ closeModal, mergeParams, saveMerge }) => {
  const [groupFilters, setGroupFilters] = useState<TabFilterSettings<FilterType>[]>(mergeParams.filters)
  const [groupLogicMode, setGroupLogicMode] = useState<LogicalMode>(mergeParams.mode)
  const [canSave, setCanSave] = useState<boolean>(false);
  const [canAddFilter, setCanAddFilter] = useState<boolean>(true);

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
      params: { collection: "" }
    });
    setGroupFilters(updatedFilters);
  }

  function onOkButton() {
    if (canSave && canAddFilter) {
      const mergeParams = {
        filters: [...groupFilters],
        mode: groupLogicMode
      }
      saveMerge(mergeParams)
      closeModal()
    } else {
      PythonInterop.toast("Error", "A Union group should have at least 2 filters");
    }
  }

  return (
    <>
      <ModalStyles />
      <div className="tab-master-modal-scope">
        <ConfirmModal onOK={onOkButton} onCancel={closeModal} strTitle="Union Group">
          <FilterEditorPanel
            groupFilters={groupFilters}
            setGroupFilters={setGroupFilters}
            addFilter={addFilterToGroup}
            groupLogicMode={groupLogicMode}
            setGroupLogicMode={setGroupLogicMode}
            canAddFilter={canAddFilter}
          />
        </ConfirmModal>
      </div>
    </>
  )
}