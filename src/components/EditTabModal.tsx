import {
    ButtonItem,
    ConfirmModal, Dropdown,
    DropdownOption,
    Field,
    Focusable,
    PanelSection,
    PanelSectionRow,
    SingleDropdownOption,
    TextField, ToggleField, gamepadDialogClasses
} from "decky-frontend-lib";
import { useState, VFC, Fragment, useEffect } from "react";
import { FaTrash } from "react-icons/fa";
import { cloneDeep } from "lodash";
import { FilterType, TabFilterSettings } from "./filters/Filters";
import { PythonInterop } from "../lib/controllers/PythonInterop";
import { MultiSelect } from "./MultiSelect";
import { useTabMasterState } from "../state/TabMasterState";

export type EditableTabSettings = {
    title: string
    filters: TabFilterSettings<any>[]
}

const FilterTypes: string[] = [
    "collection",
    "installed",
    "regex"
];

type FilterOptionsProps = {
    index: number,
    filter: TabFilterSettings<FilterType>,
    filters: TabFilterSettings<FilterType>[],
    setFilters: React.Dispatch<React.SetStateAction<TabFilterSettings<FilterType>[]>>
}

const FilterOptions: VFC<FilterOptionsProps> = ({ index, filter, filters, setFilters }) => {
    //we can't use this context because it's there no Provider provided to the modal
    const { allStoreTags, currentUsersFriends } = useTabMasterState();

    /*
    const freindsDropdownOptions = currentUsersFriends.map((friend: FriendEntry) => { return { label: friend.name, data: friend.steamid } });
    const storeTagDropdownOptions = allStoreTags.map((storeTag: TagResponse) => { return { label: storeTag.string, data: storeTag.tag } });
    */
    //just setting these empty for now
    const freindsDropdownOptions = []
    const storeTagDropdownOptions = []
    const collectionDropdownOptions = collectionStore.userCollections.map((collection: { displayName: any; id: any; }) => { return { label: collection.displayName, data: collection.id } });

    function onCollectionChange(data: SingleDropdownOption) {
        const filter1 = cloneDeep(filter) as TabFilterSettings<'collection'>;
        filter1.params.collection = data.data;
        const filters1 = cloneDeep(filters);
        filters1[index] = filter1;
        setFilters(filters1);
    }

    function onInstalledChange(checked: boolean) {
        const filter1 = cloneDeep(filter) as TabFilterSettings<'installed'>;
        filter1.params.installed = checked ?? false;
        const filters1 = cloneDeep(filters);
        filters1[index] = filter1;
        setFilters(filters1);
    }

    function onRegexChange(e: React.ChangeEvent<HTMLInputElement>) {
        const filter1 = cloneDeep(filter) as TabFilterSettings<'regex'>;
        filter1.params.regex = e?.target.value;
        const filters1 = cloneDeep(filters);
        filters1[index] = filter1;
        setFilters(filters1);
    }

    function onFriendsChange(selected: DropdownOption[]) {

    }

    function onTagsChange(selected: DropdownOption[]) {

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
                    <MultiSelect label="Selected Friends" options={freindsDropdownOptions} selected={[]} onChange={onFriendsChange} />
                );
            case "tags":
                return (
                    <MultiSelect label="Selected Tags" options={storeTagDropdownOptions} selected={[]} onChange={onTagsChange} />
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

const FilterEntry: VFC<FilterEntryProps> = ({ index, filter, filters, setFilters }) => {
    const filterTypeOptions = FilterTypes.map(type => { return { label: type, data: type } });

    function onChange(data: SingleDropdownOption) {
        const filter1 = cloneDeep(filter);
        filter1.type = data.data;
        const filters1 = cloneDeep(filters);
        filters1[index] = filter1;
        setFilters(filters1);
    }

    function onDelete() {
        const filters1 = cloneDeep(filters);
        delete filters1[index];
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
    closeModal: () => void
    onConfirm: (tabId: string | undefined, tabSettings: EditableTabSettings) => void
    tabId?: string
    tabTitle?: string
    tabFilters: TabFilterSettings<FilterType>[]
}

export const EditTabModal: VFC<EditTabModalProps> = ({ closeModal, onConfirm, tabId, tabTitle, tabFilters }) => {
    const [name, setName] = useState<string>(tabTitle ?? '');
    const [filters, setFilters] = useState<TabFilterSettings<FilterType>[]>(tabFilters);
    const [canSave, setCanSave] = useState<boolean>(false);
    const [canAddFilter, setCanAddFilter] = useState<boolean>(true);

    useEffect(() => {
        setCanSave(name != "" && filters.length > 0);
    }, [name, filters]);

    useEffect(() => {
        setCanAddFilter(filters.every((filter) => !isDefaultParams(filter)) || filters.length == 0);
    }, [filters]);

    function onNameChange(e: React.ChangeEvent<HTMLInputElement>) {
        setName(e?.target.value);
    }

    //we need to make sure user can't confirm if filter'soptions aren't set either
    function onSave() {
        if (canSave) {
            const updated: EditableTabSettings = {
                title: name,
                filters: filters,
            };
            onConfirm(tabId, updated);
            closeModal();
        } else {
            PythonInterop.toast("Error", "Please add a name and at least 1 filter before saving")
        }
    }

    function addFilter() {
        const filtersCopy = cloneDeep(filters);
        filtersCopy.push({
            type: "regex",
            params: { regex: "" }
        });
        setFilters(filtersCopy);
    }

    return (
        <>
            <style>{`
        .tab-master-modal-scope .${gamepadDialogClasses.GamepadDialogContent} .DialogHeader {
          margin-left: 15px;
        }
        
        /* The button item */
        .tab-master-modal-scope .add-filter-btn {
          padding: 0 !important;
        }
        .tab-master-modal-scope .add-filter-btn .${gamepadDialogClasses.FieldLabel} {
          display: none;
        }
        .tab-master-modal-scope .add-filter-btn .${gamepadDialogClasses.FieldChildren} {
          width: 100%;
        }

        /* The button item wrapper */
        .tab-master-modal-scope .filter-entry .${gamepadDialogClasses.Field} {
          padding: 0;
          margin: 0;
        }
        /* The button item label */
        .tab-master-modal-scope .filter-entry .${gamepadDialogClasses.FieldLabel} {
          display: none;
        }
        /* The button item */
        .tab-master-modal-scope .filter-entry button.${gamepadDialogClasses.Button}.DialogButton {
          padding: 10px;
          min-width: 45px;
        }

        .tab-master-modal-scope .filter-params-input .${gamepadDialogClasses.Field}.${gamepadDialogClasses.WithBottomSeparatorStandard}::after {
          display: none
        }

        /* Filter section start */
        .tab-master-modal-scope .filter-start-cont {
          width: 100%;
          padding: 0;

          display: flex;
          flex-direction: row;

          justify-content: space-between;
          align-items: center;

          font-size: 14px;
        }
        .tab-master-modal-scope .filter-start-cont .filter-line {
          height: 2px;
          flex-grow: 1;
          
          background: #23262e;
        }
        .tab-master-modal-scope .filter-start-cont .filter-label {
          margin: 0px 5px;
          color: #343945;
        }
      `}</style>
            <div className="tab-master-modal-scope">
                <ConfirmModal
                    bAllowFullSize
                    onCancel={closeModal}
                    onEscKeypress={closeModal}
                    strTitle={tabTitle ? `Modifying: ${tabTitle}` : ''}
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
                                        <Field
                                            label="Filter Type"
                                            description={<FilterEntry index={index} filter={filter} filters={filters} setFilters={setFilters} />}
                                        />
                                        <div className="filter-params-input">
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
                                    <div style={{}}>Please finish the current filter before adding another</div>
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
        </>
    );
}