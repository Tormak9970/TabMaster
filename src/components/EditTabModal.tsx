import {
  ButtonItem,
  ConfirmModal,
  Dropdown,
  DropdownOption,
  Field,
  Focusable,
  PanelSection,
  PanelSectionRow,
  SingleDropdownOption,
  TextField,
  ToggleField
} from "decky-frontend-lib";
import { useState, VFC, Fragment, useEffect } from "react";
import { FaTrash } from "react-icons/fa";
import { FilterType, TabFilterSettings } from "./filters/Filters";
import { PythonInterop } from "../lib/controllers/PythonInterop";
import { MultiSelect } from "./MultiSelect";
import { TabMasterContextProvider, useTabMasterContext } from "../state/TabMasterContext";
import { TabMasterManager } from "../state/TabMasterManager";
import { ModalStyles } from "./styles/ModalStyles";

export type EditableTabSettings = {
  title: string,
  filters: TabFilterSettings<any>[]
}

const FilterTypes: string[] = [
  "collection",
  "installed",
  "regex",
  "friends",
  "tags"
];

type FilterOptionsProps = {
  index: number,
  filter: TabFilterSettings<FilterType>,
  filters: TabFilterSettings<FilterType>[],
  setFilters: React.Dispatch<React.SetStateAction<TabFilterSettings<FilterType>[]>>
}

/**
 * The options for an individual filter.
 */
const FilterOptions: VFC<FilterOptionsProps> = ({ index, filter, filters, setFilters }) => {
  const { allStoreTags, currentUsersFriends } = useTabMasterContext();

  const friendsDropdownOptions: DropdownOption[] = currentUsersFriends.map((friend: FriendEntry) => { return { label: friend.name, data: friend.steamid } });
  const friendsSelected: DropdownOption[] = (filter.type === "friends" && (filter as TabFilterSettings<"friends">).params.friends) ? (filter as TabFilterSettings<"friends">).params.friends.map((id: number) => {
    return {
      label: currentUsersFriends.find((friend) => friend.steamid === id)!.name,
      data: id
    }
  }) : [];
  const friendsMode = (filter.type === "friends" && (filter as TabFilterSettings<"friends">).params.mode) ? (filter as TabFilterSettings<"friends">).params.mode ?? "and" : "and";

  const storeTagDropdownOptions: DropdownOption[] = allStoreTags.map((storeTag: TagResponse) => { return { label: storeTag.string, data: storeTag.tag } });
  const tagsSelected: DropdownOption[] = (filter.type === "tags" && (filter as TabFilterSettings<"tags">).params.tags) ? (filter as TabFilterSettings<"tags">).params.tags.map((tagNum: number) => {
    return {
      label: allStoreTags.find((tag) => tag.tag === tagNum)!.string,
      data: tagNum
    }
  }) : [];
  const tagsMode = (filter.type === "tags" && (filter as TabFilterSettings<"tags">).params.mode) ? (filter as TabFilterSettings<"tags">).params.mode : "and";

  const collectionDropdownOptions: DropdownOption[] = collectionStore.userCollections.map((collection: { displayName: any; id: any; }) => { return { label: collection.displayName, data: collection.id } });

  function onCollectionChange(data: SingleDropdownOption) {
    const filter1 = {...filter} as TabFilterSettings<'collection'>;
    filter1.params.collection = data.data;
    const filters1 = [...filters];
    filters1[index] = filter1;
    setFilters(filters1);
  }

  function onInstalledChange(checked: boolean) {
    const filter1 = {...filter} as TabFilterSettings<'installed'>;
    filter1.params.installed = checked ?? false;
    const filters1 = [...filters];
    filters1[index] = filter1;
    setFilters(filters1);
  }

  function onRegexChange(e: React.ChangeEvent<HTMLInputElement>) {
    const filter1 = {...filter} as TabFilterSettings<'regex'>;
    filter1.params.regex = e?.target.value;
    const filters1 = [...filters];
    filters1[index] = filter1;
    setFilters(filters1);
  }

  function onFriendsChange(selected: DropdownOption[], mode: string) {
    const filter1 = {...filter} as TabFilterSettings<'friends'>;
    filter1.params.friends = selected.map((friendEntry) => friendEntry.data as number);
    filter1.params.mode = mode;
    const filters1 = [...filters];
    filters1[index] = filter1;
    setFilters(filters1);
  }

  function onTagsChange(selected: DropdownOption[], mode: string) {
    const filter1 = {...filter} as TabFilterSettings<'tags'>;
    filter1.params.tags = selected.map((tagEntry) => tagEntry.data as number);
    filter1.params.mode = mode;
    const filters1 = [...filters];
    filters1[index] = filter1;
    setFilters(filters1);
  }

  if (filter) {
    switch (filter.type) {
      case "regex":
        return (
          <Field
            label="Regex"
            description={<TextField value={(filter as TabFilterSettings<'regex'>).params.regex} onChange={onRegexChange} />}
          />
        );
      case "installed":
        return (
          <ToggleField label="Installed" checked={(filter as TabFilterSettings<'installed'>).params.installed} onChange={onInstalledChange} />
        );
      case "collection":
        return (
          <Field
            label="Selected Collection"
            description={<Dropdown rgOptions={collectionDropdownOptions} selectedOption={(filter as TabFilterSettings<'collection'>).params.collection} onChange={onCollectionChange} />}
          />
        );
      case "friends":
        return (
          <MultiSelect fieldLabel="Selected Friends" dropdownLabel="Add a friend" mode={friendsMode} options={friendsDropdownOptions} selected={friendsSelected} onChange={onFriendsChange} />
        );
      case "tags":
        return (
          <MultiSelect fieldLabel="Selected Tags" dropdownLabel="Add a tag" mode={tagsMode} options={storeTagDropdownOptions} selected={tagsSelected} onChange={onTagsChange} />
        );
      default:
        return (
          <Fragment />
        );
    }
  } else {
    return (
      <Fragment />
    );
  }
}


type FilterEntryProps = {
  index: number,
  filter: TabFilterSettings<FilterType>,
  filters: TabFilterSettings<FilterType>[],
  setFilters: React.Dispatch<React.SetStateAction<TabFilterSettings<FilterType>[]>>
}

/**
 * An individual filter for a tab.
 */
const FilterEntry: VFC<FilterEntryProps> = ({ index, filter, filters, setFilters }) => {
  const filterTypeOptions = FilterTypes.map(type => { return { label: type, data: type } });

  function onChange(data: SingleDropdownOption) {
    const filter1 = {...filter};
    filter1.type = data.data;
    const filters1 = [...filters];
    filters1[index] = filter1;
    setFilters(filters1);
  }

  function onDelete() {
    const filters1 = {...filters};
    filters1.splice(index, 1);
    setFilters((filters1));
  }

  if (filter) {
    return (
      <div className="filter-entry">
        <Focusable style={{
          width: "100%",
          display: "flex",
          flexDirection: "row"
        }}>
          <Focusable style={{
            width: "calc(100% - 55px)"
          }}>
            <Dropdown rgOptions={filterTypeOptions} selectedOption={filter.type} onChange={onChange} />
          </Focusable>
          <Focusable style={{
            marginLeft: "10px",
            width: "45px"
          }}>
            <ButtonItem onClick={onDelete}>
              <FaTrash />
            </ButtonItem>
          </Focusable>
        </Focusable>
      </div>
    )
  } else {
    return (
      <Fragment />
    );
  }
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
    case "installed":
      return false;
    case "collection":
      return !(filter as TabFilterSettings<'collection'>).params.collection;
    case "friends":
      return (filter as TabFilterSettings<'friends'>).params.friends.length === 0;
    case "tags":
      return (filter as TabFilterSettings<'tags'>).params.tags.length === 0;
  }
}

type EditTabModalProps = {
  closeModal: () => void,
  onConfirm: (tabId: string | undefined, tabSettings: EditableTabSettings) => void,
  tabId?: string,
  tabTitle?: string,
  tabFilters: TabFilterSettings<FilterType>[],
  tabMasterManager: TabMasterManager
}

/**
 * The modal for editing and creating custom tabs.
 */
export const EditTabModal: VFC<EditTabModalProps> = ({ closeModal, onConfirm, tabId, tabTitle, tabFilters, tabMasterManager }) => {
  const tabsMap: Map<string, TabContainer> = tabMasterManager.getTabs().tabsMap;

  const [name, setName] = useState<string>(tabTitle ?? '');
  const [filters, setFilters] = useState<TabFilterSettings<FilterType>[]>(tabFilters);
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
    const filtersCopy = [...filters];
    filtersCopy.push({
      type: "collection",
      params: { collection: "" }
    });
    setFilters(filtersCopy);
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
                <ButtonItem onClick={addFilter} disabled={!canAddFilter}>
                  Add Filter
                </ButtonItem>
              </div>
            </PanelSectionRow>
          </PanelSection>
        </ConfirmModal>
      </div>
    </TabMasterContextProvider>
  );
}