import {
  ConfirmModal,
  DialogButton,
  DialogCheckbox,
  Field,
  Focusable,
  TextField,
  afterPatch,
  quickAccessControlsClasses,
  showModal
} from "decky-frontend-lib";
import { useState, VFC, useEffect, Fragment } from "react";
import { FilterType, TabFilterSettings, isDefaultParams } from "../filters/Filters";
import { PythonInterop } from "../../lib/controllers/PythonInterop";
import { TabMasterContextProvider } from "../../state/TabMasterContext";
import { TabMasterManager } from "../../state/TabMasterManager";
import { ModalStyles } from "../styles/ModalStyles";
import { FiltersPanel } from "../filters/FiltersPanel";
import { MdQuestionMark } from "react-icons/md";
import { FitlerDescModal } from "./FilterDescModal";
import { capitalizeFirstLetter, getIncludedCategoriesFromBitField, updateCategoriesToIncludeBitField } from "../../lib/Utils";
import { BiSolidDownArrow } from "react-icons/bi";

export type EditableTabSettings = Omit<Required<TabSettings>, 'position' | 'id'>;

type EditTabModalProps = {
  closeModal?: () => void,
  onConfirm: (tabId: string | undefined, tabSettings: EditableTabSettings) => void,
  tabId?: string,
  tabTitle?: string,
  tabFilters: TabFilterSettings<FilterType>[],
  tabMasterManager: TabMasterManager,
  filtersMode: LogicalMode,
  categoriesToInclude: number; //bit field
};

/**
 * The modal for editing and creating custom tabs.
 */
export const EditTabModal: VFC<EditTabModalProps> = ({ closeModal, onConfirm, tabId, tabTitle, tabFilters, tabMasterManager, filtersMode, categoriesToInclude }) => {
  const [name, setName] = useState<string>(tabTitle ?? '');
  const [topLevelFilters, setTopLevelFilters] = useState<TabFilterSettings<FilterType>[]>(tabFilters);
  const [topLevelLogicMode, setTopLevelLogicMode] = useState<LogicalMode>(filtersMode);
  const [catsToInclude, setCatsToInclude] = useState<number>(categoriesToInclude);
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
        categoriesToInclude: catsToInclude
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
          <div style={{ padding: "4px 16px 16px" }} className="name-field">
            <Field description={
            <>
              <div style={{ paddingBottom: "6px" }} className={quickAccessControlsClasses.PanelSectionTitle}>
                Name
              </div>
              {nameInputElt}
            </>
            } />
          </div>
          <IncludeCategoriesPanel categoriesToInclude={catsToInclude} setCategoriesToInclude={setCatsToInclude} />
          <FiltersPanel
            groupFilters={topLevelFilters}
            setGroupFilters={setTopLevelFilters}
            addFilter={addFilter}
            groupLogicMode={topLevelLogicMode}
            setGroupLogicMode={setTopLevelLogicMode}
            canAddFilter={canAddFilter}
            collapseFilters={!!tabTitle}
          />
        </ConfirmModal>
      </div>
    </TabMasterContextProvider>
  );
};

type IncludeCategoriesPanelProps = {
  categoriesToInclude: number,
  setCategoriesToInclude: React.Dispatch<React.SetStateAction<number>>;
};
/**
 * Section for selecting categories to include in tab
 */
const IncludeCategoriesPanel: VFC<IncludeCategoriesPanelProps> = ({ categoriesToInclude, setCategoriesToInclude }) => {
  const [isOpen, setIsOpen] = useState(false);

  const catsToIncludeObj = getIncludedCategoriesFromBitField(categoriesToInclude);

  const showHiddenCat = Object.entries(catsToIncludeObj).filter(([cat]) => cat !== 'hidden').some(([cat, checked]) => checked);

  const getCatLabel = (category: string) => category === 'music' ? 'Soundtracks' : capitalizeFirstLetter(category)

  let catStrings = []
  for (const cat in catsToIncludeObj) {
    const include = catsToIncludeObj[cat as keyof typeof catsToIncludeObj];

    (include && (cat !== 'hidden' || showHiddenCat)) && catStrings.push(getCatLabel(cat));
  }

  return (
    <>
      <div className="tab-master-scope" style={{ marginBottom: "24px" }}>
        <Focusable style={{ margin: "0 calc(-12px - 1.4vw)" }} onActivate={() => setIsOpen(isOpen => !isOpen)} noFocusRing={true} focusClassName="start-focused" >
          <div style={{ margin: "0 calc(12px + 1.4vw)", padding: "0 16px" }}>
            <div style={{ display: "flex", alignItems: "center" }}>
              <div style={{ padding: "12px 0", float: "left" }} className={quickAccessControlsClasses.PanelSectionTitle}>
                Include in tab
              </div>
              <div style={{padding: "12px 40px", flex: "1"}}>
                {!isOpen && <span style={{ fontSize: "12px", lineHeight: "12px", color: "#8b929a"}}> 
                  {catStrings.join(', ')}
                </span>}
              </div>
              <div style={{ paddingRight: "10px", display: "flex", alignItems: "center" }}>
                <BiSolidDownArrow style={{ transform: !isOpen ? "rotate(90deg)" : "" }} />
              </div>
            </div>
          </div>
        </Focusable>
        {isOpen && (
          <div style={{ padding: "10px 18px" }}>
            {Object.entries(catsToIncludeObj).map(([category, shouldInclude]) => {
              const label = getCatLabel(category)

              const onChange = (checked: boolean) => {
                setCategoriesToInclude(currentCatsBitField => updateCategoriesToIncludeBitField(currentCatsBitField, { [category]: checked }));
              }; 
              return category === 'hidden' && !showHiddenCat ? null : <DialogCheckbox checked={shouldInclude} onChange={onChange} label={label} />;
            })}
          </div>)}
      </div>
      <div style={{
        position: "relative",
        top: "-24px",
        left: "calc(16px - 1.8vw)",
        right: "calc(16px - 1.8vw)",
        height: "1.5px",
        background: "#23262e" }}
      />
    </>
  );
};
