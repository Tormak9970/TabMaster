import {
    ButtonItem,
    ConfirmModal, Dropdown,
    Field,
    Focusable,
    PanelSection,
    PanelSectionRow,
    SingleDropdownOption,
    TextField, ToggleField, gamepadDialogClasses
} from "decky-frontend-lib";
import { useState, VFC, Fragment } from "react";
import { FaTrash } from "react-icons/fa";
import { cloneDeep } from "lodash";

export type EditableTabSettings = {
    title: string
    filters: TabFilterSettings<any>[]
}

const FilterTypes: FilterType[] = [
    "collection",
    "installed",
    "regex"
];

type SetFilterParametersProps = {
    index: number,
    filter: TabFilterSettings<FilterType>,
    filters: TabFilterSettings<FilterType>[],
    setFilters: React.Dispatch<React.SetStateAction<TabFilterSettings<FilterType>[]>>
}

const SetFilterParameters: VFC<SetFilterParametersProps> = ({ index, filter, filters, setFilters }) => {
    const collectionDropdownOptions = collectionStore.userCollections.map((collection: { displayName: any; id: any; }) => { return { label: collection.displayName, data: collection.id } });

    function onCollectionChange(data: SingleDropdownOption) {
        const filter1 = cloneDeep(filter as TabFilterSettings<'collection'>);
        filter1.params.collection = data.data;
        const filters1 = cloneDeep(filters);
        filters1[index] = filter1;
        setFilters(filters1);
    }

    function onInstalledChange(checked: boolean) {
        const filter1 = cloneDeep(filter as TabFilterSettings<'installed'>);
        filter1.params.installed = checked ?? false;
        const filters1 = cloneDeep(filters);
        filters1[index] = filter1;
        setFilters(filters1);
    }

    function onRegexChange(e: React.ChangeEvent<HTMLInputElement>) {
        const filter1 = cloneDeep(filter as TabFilterSettings<'regex'>);
        filter1.params.regex = e?.target.value;
        const filters1 = cloneDeep(filters);
        filters1[index] = filter1;
        setFilters(filters1);
    }

    if (filter) {
        switch (filter.type) {
            case "collection":
                return (
                    <Field
                        label="Collection"
                        description={
                            <Dropdown rgOptions={collectionDropdownOptions} selectedOption={(filter as TabFilterSettings<'collection'>).params.collection} onChange={onCollectionChange} />
                        }
                    />
                );
            case "installed":
                return (
                    <ToggleField label="Installed" checked={(filter as TabFilterSettings<'installed'>).params.installed} onChange={onInstalledChange} />
                );
            case "regex":
                return (
                    <Field
                        label="Regex"
                        description={
                            <TextField value={(filter as TabFilterSettings<'regex'>).params.regex} onChange={onRegexChange} />
                        }
                    />
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


type FilterTypeRowProps = {
    index: number,
    filter: TabFilterSettings<FilterType>,
    filters: TabFilterSettings<FilterType>[],
    setFilters: React.Dispatch<React.SetStateAction<TabFilterSettings<FilterType>[]>>
}

const FilterTypeRow: VFC<FilterTypeRowProps> = ({ index, filter, filters, setFilters }) => {
    const filterTypeOptions = FilterTypes.map(type => { return { label: type, data: type } });

    function onChange(data: SingleDropdownOption) {
        const updatedFilter = cloneDeep(filter);
        updatedFilter.type = data.data;
        const updatedFilters = cloneDeep(filters);
        updatedFilters[index] = updatedFilter;
        setFilters(updatedFilters);
    }

    function onDelete() {
        const updatedFilters = cloneDeep(filters);
        delete updatedFilters[index];
        setFilters(updatedFilters);
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
                        marginLeft: "10px"
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

type EditTabModalProps = {
    closeModal: () => void
    onConfirm: (tabId: string | undefined, tabSettings: EditableTabSettings) => void
    tabId?: string
    tabTitle?: string
    tabFilters: TabFilterSettings<FilterType>[]
}

export const EditTabModal: VFC<EditTabModalProps> = ({ closeModal, onConfirm = () => { }, tabId, tabTitle, tabFilters }) => {
    const [name, setName] = useState<string>(tabTitle ?? '');
    const [filters, setFilters] = useState<TabFilterSettings<FilterType>[]>(tabFilters);

    function onNameChange(e: React.ChangeEvent<HTMLInputElement>) {
        setName(e?.target.value);
    }

    function onSave() {
        const updated: EditableTabSettings = {
            title: name,
            filters: filters
        };
        onConfirm(tabId, updated);
        closeModal();
    }

    function addFilter() {
        const updatedFilters = cloneDeep(filters);
        updatedFilters.push({
            //@ts-ignore
            type: "",
            //@ts-ignore
            params: {}
        });
        setFilters(updatedFilters);
    }

    return (
        <>
            <style>{`
        .tab-master-modal-scope .${gamepadDialogClasses.GamepadDialogContent} .DialogHeader {
          margin-left: 15px;
        }
        
        /* .tab-master-modal-scope .add-filter-btn .${gamepadDialogClasses.Field}.${gamepadDialogClasses.WithBottomSeparatorStandard}::after {
          display: none;
        } */
        .tab-master-modal-scope .add-filter-btn .${gamepadDialogClasses.FieldLabel} {
          display: none;
        }
        .tab-master-modal-scope .add-filter-btn .${gamepadDialogClasses.FieldChildren} {
          width: 100%;
        }

        /* The button item */
        .tab-master-scope .filter-entry .${gamepadDialogClasses.GamepadDialogContent} {
          margin: 0;
          padding: 0;
        }
        /* The button item label */
        .tab-master-scope .filter-entry .${gamepadDialogClasses.FieldLabel} {
          display: none;
        }
        /* The button item */
        .tab-master-scope .filter-entry .${gamepadDialogClasses.Button} {
          padding: 10px;
          min-width: 45px;
          width: 45px;
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
                            <div className="add-filter-btn">
                                <ButtonItem onClick={addFilter}>
                                    Add Filter
                                </ButtonItem>
                            </div>
                        </PanelSectionRow>
                        <PanelSectionRow>
                            {filters.map((filter, index) => {
                                return (
                                    <>
                                        <Field
                                            label="Type"
                                            description={<FilterTypeRow index={index} filter={filter} filters={filters} setFilters={setFilters} />}
                                        />
                                        <SetFilterParameters index={index} filter={filter} filters={filters} setFilters={setFilters} />
                                    </>
                                );
                            })}
                        </PanelSectionRow>
                    </PanelSection>
                </ConfirmModal>
            </div>
        </>
    );
}