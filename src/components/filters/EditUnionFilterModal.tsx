import { ConfirmModal } from "decky-frontend-lib"
import { VFC, useState, Fragment, useEffect } from "react"
import { ModalStyles } from "../styles/ModalStyles"
import { FilterEditorPanel } from "./FilterEditorPanel"
import { TabFilterSettings, FilterType } from "./Filters"
import { isDefaultParams } from "../EditTabModal"
import { PythonInterop } from "../../lib/controllers/PythonInterop"

interface EditUnionFilterModalProps {
  unionParams: TabFilterSettings<'union'>['params']
  saveUnion: (groupParams: TabFilterSettings<'union'>['params']) => void
  closeModal: () => void
}

export const EditUnionFilterModal: VFC<EditUnionFilterModalProps> = ({ closeModal, unionParams, saveUnion }) => {
  const [groupFilters, setGroupFilters] = useState<TabFilterSettings<FilterType>[]>(unionParams.filters)
  const [groupLogicMode, setGroupLogicMode] = useState<LogicalMode>(unionParams.mode)
  const [canSave, setCanSave] = useState<boolean>(false);
  const [canAddFilter, setCanAddFilter] = useState<boolean>(true);

  useEffect(() => {
    setCanSave(groupFilters.length >= 2);
  }, [groupFilters]);

  useEffect(() => {
    setCanAddFilter(groupFilters.length == 0 || groupFilters.every((filter) => {
      if (filter.type === "friends" && !(filter as TabFilterSettings<'friends'>).params.friends) (filter as TabFilterSettings<'friends'>).params.friends = [];
      if (filter.type === "tags" && !(filter as TabFilterSettings<'tags'>).params.tags) (filter as TabFilterSettings<'tags'>).params.tags = [];

      return !isDefaultParams(filter);
    }));
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
      const unionParams = {
        filters: groupFilters,
        mode: groupLogicMode
      }
      saveUnion(unionParams)
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