import {
  ConfirmModal,
  Field,
  PanelSection,
  PanelSectionRow,
  TextField
} from "decky-frontend-lib";
import { useState, VFC, useEffect } from "react";
import { FilterType, TabFilterSettings } from "./filters/Filters";
import { PythonInterop } from "../lib/controllers/PythonInterop";
import { TabMasterContextProvider } from "../state/TabMasterContext";
import { TabMasterManager } from "../state/TabMasterManager";
import { ModalStyles } from "./styles/ModalStyles";
import { FilterEditorPanel } from "./filters/FilterEditorPanel";

export type EditableTabSettings = {
  title: string,
  filters: TabFilterSettings<any>[]
  filtersMode: LogicalMode
}

/**
 * Checks if the user has made any changes to a filter.
 * @param filter The filter to check.
 * @returns True if the filter is the default (wont filter anything).
 */
function isDefaultParams(filter: TabFilterSettings<FilterType>): boolean {
  switch (filter.type) {
    case "regex":
      return (filter as TabFilterSettings<'regex'>).params.regex == "";
    case "collection":
      return !(filter as TabFilterSettings<'collection'>).params.collection;
    case "friends":
      return (filter as TabFilterSettings<'friends'>).params.friends.length === 0;
    case "tags":
      return (filter as TabFilterSettings<'tags'>).params.tags.length === 0;
    case "installed":
    case "whitelist":
    case "blacklist":
      return false
    case "union":
      return false
  }
}

type EditTabModalProps = {
  closeModal?: () => void,
  onConfirm: (tabId: string | undefined, tabSettings: EditableTabSettings) => void,
  tabId?: string,
  tabTitle?: string,
  tabFilters: TabFilterSettings<FilterType>[],
  tabMasterManager: TabMasterManager,
  filtersMode: LogicalMode
}

/**
 * The modal for editing and creating custom tabs.
 */
export const EditTabModal: VFC<EditTabModalProps> = ({ closeModal, onConfirm, tabId, tabTitle, tabFilters, tabMasterManager, filtersMode }) => {
  const tabsMap: Map<string, TabContainer> = tabMasterManager.getTabs().tabsMap;

  const [name, setName] = useState<string>(tabTitle ?? '');
  const [topLevelFilters, setTopLevelFilters] = useState<TabFilterSettings<FilterType>[]>(tabFilters);
  const [topLevelLogicMode, setTopLevelLogicMode] = useState<LogicalMode>(filtersMode);
  const [canSave, setCanSave] = useState<boolean>(false);
  const [canAddFilter, setCanAddFilter] = useState<boolean>(true);

  useEffect(() => {
    setCanSave(name != "" && topLevelFilters.length > 0);
  }, [name, topLevelFilters]);

  useEffect(() => {
    setCanAddFilter(topLevelFilters.length == 0 || topLevelFilters.every((filter) => {
      if (filter.type === "friends" && !(filter as TabFilterSettings<'friends'>).params.friends) (filter as TabFilterSettings<'friends'>).params.friends = [];
      if (filter.type === "tags" && !(filter as TabFilterSettings<'tags'>).params.tags) (filter as TabFilterSettings<'tags'>).params.tags = [];

      return !isDefaultParams(filter);
    }));
  }, [topLevelFilters]);

  function onNameChange(e: React.ChangeEvent<HTMLInputElement>) {
    setName(e?.target.value);
  }

  function onSave() {
    if (canSave && canAddFilter) {
      if (!tabsMap.has(name) || tabsMap.get(name)?.id === tabId) {
        const updated: EditableTabSettings = {
          title: name,
          filters: topLevelFilters,
          filtersMode: topLevelLogicMode
        };
        onConfirm(tabId, updated);
        closeModal!();
      } else {
        PythonInterop.toast("Error", "A tab with that name already exists!");
      }
    } else {
      PythonInterop.toast("Error", "Please add a name and at least 1 filter before saving");
    }
  }

  function addFilter() {
    const updatedFilters = [...topLevelFilters];
    updatedFilters.push({
      type: "collection",
      params: { collection: "" }
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
          strTitle={tabTitle ? `Modifying: ${tabTitle}` : 'Create New Tab'}
          onOK={onSave}
        >
          <PanelSection>
            <PanelSectionRow>
              <Field
                label="Name"
                description={<TextField value={name} onChange={onNameChange} />}
              />
            </PanelSectionRow>
          </PanelSection>
          <FilterEditorPanel
            groupFilters={topLevelFilters}
            setGroupFilters={setTopLevelFilters}
            addFilter={addFilter}
            groupLogicMode={topLevelLogicMode}
            setGroupLogicMode={setTopLevelLogicMode}
            canAddFilter={canAddFilter}
          />
        </ConfirmModal>
      </div>
    </TabMasterContextProvider>
  );
}