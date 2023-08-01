import {
  ConfirmModal,
  DialogButton,
  Field,
  PanelSection,
  PanelSectionRow,
  TextField,
  afterPatch,
  showModal} from "decky-frontend-lib";
import { useState, VFC, useEffect } from "react";
import { FilterType, TabFilterSettings, isDefaultParams } from "../filters/Filters";
import { PythonInterop } from "../../lib/controllers/PythonInterop";
import { TabMasterContextProvider } from "../../state/TabMasterContext";
import { TabMasterManager } from "../../state/TabMasterManager";
import { ModalStyles } from "../styles/ModalStyles";
import { FiltersPanel } from "../filters/FiltersPanel";
import { MdQuestionMark } from "react-icons/md";
import { FitlerDescModal } from "./FilterDescModal";

export type EditableTabSettings = {
  title: string,
  filters: TabFilterSettings<any>[];
  filtersMode: LogicalMode;
  includesHidden: boolean;
};

type EditTabModalProps = {
  closeModal?: () => void,
  onConfirm: (tabId: string | undefined, tabSettings: EditableTabSettings) => void,
  tabId?: string,
  tabTitle?: string,
  tabFilters: TabFilterSettings<FilterType>[],
  tabMasterManager: TabMasterManager,
  filtersMode: LogicalMode,
  includesHidden: boolean
};

/**
 * The modal for editing and creating custom tabs.
 */
export const EditTabModal: VFC<EditTabModalProps> = ({ closeModal, onConfirm, tabId, tabTitle, tabFilters, tabMasterManager, filtersMode, includesHidden }) => {
  const [name, setName] = useState<string>(tabTitle ?? '');
  const [topLevelFilters, setTopLevelFilters] = useState<TabFilterSettings<FilterType>[]>(tabFilters);
  const [topLevelLogicMode, setTopLevelLogicMode] = useState<LogicalMode>(filtersMode);
  const [topLevelIncludesHidden, setTopLevelIncludesHidden] = useState<boolean>(includesHidden);
  const [canSave, setCanSave] = useState<boolean>(false);
  const [canAddFilter, setCanAddFilter] = useState<boolean>(true);
  const [patchInput, setPatchInput] = useState(true);

  const nameInputElt = <TextField value={name} onChange={onNameChange} />;

  //reference to input field class component instance, which has a focus method
  let inputComponentInstance: any;

  if (patchInput) {
    afterPatch(nameInputElt.type.prototype, 'render', function (_: any, ret: any) {
      //@ts-ignore     get reference to instance
      inputComponentInstance = this;
      return ret;
    }, { singleShot: true });
  }

  useEffect(() => {
    inputComponentInstance.Focus();
    setPatchInput(false);
  }, []);

  useEffect(() => {
    setCanSave(name != "" && topLevelFilters.length > 0);
  }, [name, topLevelFilters]);

  useEffect(() => {
    setCanAddFilter(topLevelFilters.length == 0 || topLevelFilters.every(filter => !isDefaultParams(filter)));
  }, [topLevelFilters]);

  function onNameChange(e: React.ChangeEvent<HTMLInputElement>) {
    setName(e?.target.value);
  }

  function onSave() {
    if (canSave && canAddFilter) {
      const updated: EditableTabSettings = {
        title: name,
        filters: topLevelFilters,
        filtersMode: topLevelLogicMode,
        includesHidden: topLevelIncludesHidden
      };
      onConfirm(tabId, updated);
      closeModal!();
    } else {
      PythonInterop.toast("Error", "Please add a name and at least 1 filter before saving");
    }
  }

  function addFilter() {
    const updatedFilters = [...topLevelFilters];
    updatedFilters.push({
      type: "collection",
      inverted: false,
      params: { id: "", name: "" }
    });
    setTopLevelFilters(updatedFilters);
  }

  return (
    <TabMasterContextProvider tabMasterManager={tabMasterManager}>
      <ModalStyles />
      <div className="tab-master-modal-scope">
        <ConfirmModal
          bAllowFullSize
          onCancel={closeModal}
          onEscKeypress={closeModal}
          strTitle={
            <div style={{ display: 'flex', marginRight: '15px', width: '100%' }}>
              <div>
                {tabTitle ? `Modifying: ${tabTitle}` : 'Create New Tab'}
              </div>
              <DialogButton
                style={{ height: '28px', width: '30px', minWidth: 0, padding: '10px 12px', marginLeft: 'auto' }}
                onOKActionDescription={'Filter Descriptions'}
                onClick={() => { showModal(<FitlerDescModal />); }}
              >
                <MdQuestionMark style={{ marginTop: '-4px', marginLeft: '-5px', display: 'block' }} />
              </DialogButton>
            </div>
          }
          onOK={onSave}
        >
          <PanelSection>
            <PanelSectionRow>
              <Field
                label="Name"
                description={nameInputElt}
              />
            </PanelSectionRow>
          </PanelSection>
          <FiltersPanel
            groupFilters={topLevelFilters}
            setGroupFilters={setTopLevelFilters}
            addFilter={addFilter}
            groupLogicMode={topLevelLogicMode}
            setGroupLogicMode={setTopLevelLogicMode}
            groupIncludesHidden={topLevelIncludesHidden}
            setGroupIncludesHidden={setTopLevelIncludesHidden}
            canAddFilter={canAddFilter}
            collapseFilters={!!tabTitle}
          />
        </ConfirmModal>
      </div>
    </TabMasterContextProvider>
  );
};
