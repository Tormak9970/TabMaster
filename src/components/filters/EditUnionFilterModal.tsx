import { ConfirmModal } from "decky-frontend-lib"
import { VFC, useState, Fragment } from "react"
import { ModalStyles } from "../styles/ModalStyles"
import { FilterEditorPanel } from "./FilterEditorPanel"
import { TabFilterSettings, FilterType } from "./Filters"

interface EditUnionFilterModalProps {
  unionParams: TabFilterSettings<'union'>['params']
  saveUnion: (groupParams: TabFilterSettings<'union'>['params']) => void
  closeModal: () => void
}

export const EditUnionFilterModal: VFC<EditUnionFilterModalProps> = ({ closeModal, unionParams, saveUnion }) => {
  const [groupFilters, setGroupFilters] = useState<TabFilterSettings<FilterType>[]>(unionParams.filters)
  const [groupLogicMode, setGroupLogicMode] = useState<LogicalMode>(unionParams.mode)

  function addFilterToGroup() {
    const updatedFilters = [...groupFilters];
    updatedFilters.push({
      type: "collection",
      params: { collection: "" }
    });
    setGroupFilters(updatedFilters);
  }

  function onOkButton() {
    const unionParams = {
      filters: groupFilters,
      mode: groupLogicMode
    }
    saveUnion(unionParams)
    closeModal()
  }

  //*filter adding and saving checks still need to be implemented

  return (
    <>
      <ModalStyles />
      <div className="tab-master-modal-scope">
        <ConfirmModal onOK={onOkButton} onCancel={closeModal} closeModal={closeModal} strTitle="Union Group">
          <FilterEditorPanel
            groupFilters={groupFilters}
            setGroupFilters={setGroupFilters}
            addFilter={addFilterToGroup}
            groupLogicMode={groupLogicMode}
            setGroupLogicMode={setGroupLogicMode}
            canAddFilter={true}
          />
        </ConfirmModal>
      </div>
    </>
  )
}