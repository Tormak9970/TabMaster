import {
    Button,
    ButtonItem,
    ConfirmModal, Dropdown,
    Field,
    PanelSection,
    PanelSectionRow,
    SingleDropdownOption,
    TextField, ToggleField
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
            <>
                <Dropdown rgOptions={filterTypeOptions} selectedOption={filter.type} onChange={onChange} />
                {/*this does not work*/}
                <Button onClick={onDelete}>
                    <FaTrash />
                </Button>
            </>
        )
    } else {
        return (
            <Fragment />
        );
    }
}


type EditFiltersProps = {
    filters: TabFilterSettings<FilterType>[],
    setFilters: React.Dispatch<React.SetStateAction<TabFilterSettings<FilterType>[]>>
}

const EditFilters: VFC<EditFiltersProps> = ({ filters, setFilters }) => {
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
            <PanelSectionRow>
                <Fragment>
                    <ButtonItem onClick={addFilter}>
                        Add Filter
                    </ButtonItem>
                    {filters.map((filter, index) => {
                        return (
                            <>
                                <Field
                                    label="Type"
                                    description={
                                        <FilterTypeRow index={index} filter={filter} filters={filters} setFilters={setFilters} />
                                    }
                                />
                                <SetFilterParameters index={index} filter={filter} filters={filters} setFilters={setFilters} />
                            </>
                        );
                    })}
                </Fragment>
            </PanelSectionRow>
        </>
    );
}

type EditTabModalProps = {
    closeModal: () => void
    onConfirm: (tabId: string | undefined, tabSettings: EditableTabSettings) => void
    tabId?: string
    tabTitle?: string
    tabFilters: TabFilterSettings<FilterType>[]
}

export const EditTabModal: VFC<EditTabModalProps> = ({ closeModal, onConfirm = () => { }, tabId, tabTitle, tabFilters}) => {
    const [name, setName] = useState<string>(tabTitle ?? '');
    const [filters, setFilters] = useState<TabFilterSettings<FilterType>[]>(tabFilters);

    function onNameChange(e: React.ChangeEvent<HTMLInputElement>) {
        setName(e?.target.value);
    }

    function onSave() {
        const updated: EditableTabSettings = {
            title: name,
            filters,
        };
        onConfirm(tabId, updated);
        closeModal();
    }

    return (
        <>
            <ConfirmModal
                bAllowFullSize
                onCancel={closeModal}
                onEscKeypress={closeModal}
                onOK={onSave}
            >
                <PanelSection title={tabTitle ? `Modifying: ${tabTitle}` : '' }>
                    <PanelSectionRow>
                        <Field
                            label="Name"
                            description={
                                <TextField value={name} onChange={onNameChange} />
                            }
                        />
                    </PanelSectionRow>
                    <EditFilters filters={filters} setFilters={setFilters} />
                </PanelSection>
            </ConfirmModal>
        </>
    );
}