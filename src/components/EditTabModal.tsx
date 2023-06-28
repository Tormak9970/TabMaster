import {
  Button,
  ButtonItem,
  ConfirmModal,
  Dropdown,
  Field,
  Focusable,
  PanelSection,
  PanelSectionRow,
  TextField,
  gamepadDialogClasses
} from "decky-frontend-lib";
import { useState, VFC, Fragment, useEffect } from "react";
import { FilterType, TabFilterSettings } from "./filters/Filters";
import { PythonInterop } from "../lib/controllers/PythonInterop";
import { TabMasterContextProvider } from "../state/TabMasterContext";
import { TabMasterManager } from "../state/TabMasterManager";
import { ModalStyles } from "./styles/ModalStyles";
import { FilterOptions } from "./filters/FilterOptions";
import { FilterEntry } from "./filters/FilterEntry";

export type EditableTabSettings = {
  title: string,
  filters: TabFilterSettings<any>[]
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
  }
}

type EditTabModalProps = {
  closeModal: () => void,
  onConfirm: (tabId: string | undefined, tabSettings: EditableTabSettings) => void,
  tabId?: string,
  tabTitle?: string,
  tabFilters: TabFilterSettings<FilterType>[],
  tabMasterManager: TabMasterManager,
  filtersMode: string
}

/**
 * The modal for editing and creating custom tabs.
 */
export const EditTabModal: VFC<EditTabModalProps> = ({ closeModal, onConfirm, tabId, tabTitle, tabFilters, tabMasterManager, filtersMode }) => {
  const tabsMap: Map<string, TabContainer> = tabMasterManager.getTabs().tabsMap;

  const [name, setName] = useState<string>(tabTitle ?? '');
  const [filters, setFilters] = useState<TabFilterSettings<FilterType>[]>(tabFilters);
  const [filterLogicMode, setFilterLogicMode] = useState<string>(filtersMode ?? 'and');
  const [canSave, setCanSave] = useState<boolean>(false);
  const [canAddFilter, setCanAddFilter] = useState<boolean>(true);

  useEffect(() => {
    setCanSave(name != "" && filters.length > 0);
  }, [name, filters]);

  useEffect(() => {
    setCanAddFilter(filters.length == 0 || filters.every((filter) => {
      if (filter.type === "friends" && !(filter as TabFilterSettings<'friends'>).params.friends) (filter as TabFilterSettings<'friends'>).params.friends = [];
      if (filter.type === "tags" && !(filter as TabFilterSettings<'tags'>).params.tags) (filter as TabFilterSettings<'tags'>).params.tags = [];

      return !isDefaultParams(filter);
    }));
  }, [filters]);

  function onNameChange(e: React.ChangeEvent<HTMLInputElement>) {
    setName(e?.target.value);
  }

  function onSave() {
    if (canSave && canAddFilter) {
      if (!tabsMap.has(name) || tabsMap.get(name)?.id === tabId) {
        const updated: EditableTabSettings = {
          title: name,
          filters: filters,
        };
        onConfirm(tabId, updated);
        closeModal();
      } else {
        PythonInterop.toast("Error", "A tab with that name already exists!");
      }
    } else {
      PythonInterop.toast("Error", "Please add a name and at least 1 filter before saving");
    }
  }

  function addFilter() {
    const updatedFilters = [...filters];
    updatedFilters.push({
      type: "collection",
      params: { collection: "" }
    });
    setFilters(updatedFilters);
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
          <PanelSection title="Filters">
            <PanelSectionRow>
              {filters.map((filter, index) => {
                return (
                  <>
                    <div className="filter-start-cont">
                      <div className="filter-line" />
                      <div className="filter-label">Filter {index + 1} - {filter.type[0].toUpperCase().concat(filter.type.substring(1))}</div>
                      <div className="filter-line" />
                    </div>
                    <div className="filter-params-input">
                      <Field
                        label="Filter Type"
                        description={<FilterEntry index={index} filter={filter} filters={filters} setFilters={setFilters} />}
                      />
                    </div>
                    <div className="filter-params-input" key={`${filter.type}`}>
                      <FilterOptions index={index} filter={filter} filters={filters} setFilters={setFilters} />
                    </div>
                    {index == filters.length - 1 ? (
                      <div className="filter-start-cont">
                        <div className="filter-line" />
                      </div>
                    ) : (
                      <Fragment />
                    )}
                  </>
                );
              })}
            </PanelSectionRow>
            <PanelSectionRow>
              <div className="add-filter-btn">
                {!canAddFilter ? (
                  <div style={{ marginTop: "5px" }}>Please finish the current filter before adding another</div>
                ) : (
                  <Fragment />
                )}
                <Field >
                  <div style={{ textAlign: 'right' }}>Filter Combination Logic</div>
                  <Focusable style={{ width: "100%", display: "flex", flexDirection: "row", marginBottom: "5px" }}>
                    <div style={{ width: "calc(100% - 100px)" }}>
                      <ButtonItem onClick={addFilter} disabled={!canAddFilter}>
                        Add Filter
                      </ButtonItem>
                    </div>
                    <div style={{ marginLeft: "10px", width: "90px", marginTop: '10px', marginBottom: '10px', display: 'flex' }}>
                      <Dropdown rgOptions={[{ label: "And", data: "and" }, { label: "Or", data: "or" },]} selectedOption={filterLogicMode} onChange={option => setFilterLogicMode(option.data)} focusable={true} />
                    </div>
                  </Focusable>
                </Field>
              </div>
            </PanelSectionRow>
          </PanelSection>
        </ConfirmModal>
      </div>
    </TabMasterContextProvider>
  );
}