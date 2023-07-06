import {
  ButtonItem,
  Dropdown,
  DropdownOption,
  Field,
  Focusable,
  SingleDropdownOption,
  showModal
} from "decky-frontend-lib";
import { VFC, Fragment, useState } from "react";
import { FilterType, TabFilterSettings } from "../filters/Filters";
import { FixMergeFilterModal } from "../modals/FixMergeFilterModal";

type FilterErrorOptionsProps<T extends FilterType> = {
  filter: TabFilterSettings<T>,
  mergeErrorEntries?: FilterErrorEntry[] | undefined,
  onFilterUpdate: (filter: TabFilterSettings<FilterType> | []) => void
}


/**
 * The error options for a collection filter.
 */
const CollectionFilterErrorOptions: VFC<FilterErrorOptionsProps<'collection'>> = ({ filter, onFilterUpdate }) => {
  const collectionDropdownOptions: DropdownOption[] = collectionStore.userCollections.map((collection: { displayName: string; id: string; }) => { return { label: collection.displayName, data: collection.id } });

  function onChange(data: SingleDropdownOption) {
    const updatedFilter = { ...filter };
    updatedFilter.params.id = data.data;
    updatedFilter.params.name = data.label as string;
    onFilterUpdate(updatedFilter);
  }

  return (
    <Field
      label="Selected Collection"
      description={<Dropdown rgOptions={collectionDropdownOptions} selectedOption={(filter as TabFilterSettings<'collection'>).params.id} onChange={onChange} />}
    />
  );
}

/**
 * The error options for a merge filter.
 */
const MergeFilterErrorOptions: VFC<FilterErrorOptionsProps<'merge'>> = ({ filter, mergeErrorEntries, onFilterUpdate }) => {
  const initialParams = {
    filters: [...filter.params.filters],
    mode: filter.params.mode
  }
  const [mergeParams, setMergeParams] = useState<TabFilterSettings<'merge'>['params']>(initialParams);

  function saveMerge(mergeParams: TabFilterSettings<'merge'>['params']) {
    const updatedFilter = { ...filter };
    updatedFilter.params.filters = mergeParams.filters;
    updatedFilter.params.mode = mergeParams.mode;



    onFilterUpdate(mergeParams.filters.length === 0 ? [] : updatedFilter);
    setMergeParams({ ...mergeParams });
  }

  function onClick() {
    //*this is necessary to close the modal
    const modal: { instance: any } = { instance: null }
    modal.instance = showModal(
        <FixMergeFilterModal
          mergeParams={mergeParams}
          mergeErrorEntries={mergeErrorEntries!}
          saveMerge={saveMerge}
          closeModal={() => modal.instance.Close()}
        />
    );
  }

  return (
    <Focusable className="styled-btn">
      <ButtonItem onClick={onClick}>
        {"Fix Merge Group"}
      </ButtonItem>
    </Focusable>
  )
}


/**
 * The error options for an individual filter.
 */
export const FilterErrorOptions: VFC<FilterErrorOptionsProps<FilterType>> = ({ filter, mergeErrorEntries, onFilterUpdate }) => {
  if (filter) {
    switch (filter.type) {
      case "collection":
        return <CollectionFilterErrorOptions filter={filter as TabFilterSettings<'collection'>} onFilterUpdate={onFilterUpdate} />
      case "installed":
        throw new Error("FilterErrorOption for installed not implemented!");
      case "regex":
        throw new Error("FilterErrorOption for regex not implemented!");
      case "friends":
        throw new Error("FilterErrorOption for friends not implemented!");
      case "tags":
        throw new Error("FilterErrorOption for tags not implemented!");
      case "whitelist":
        throw new Error("FilterErrorOption for whitelist not implemented!");
      case "blacklist":
        throw new Error("FilterErrorOption for blacklist not implemented!");
      case "merge":
        return <MergeFilterErrorOptions filter={filter as TabFilterSettings<'merge'>} mergeErrorEntries={mergeErrorEntries} onFilterUpdate={onFilterUpdate} />
      case "platform":
        throw new Error("FilterErrorOption for platform not implemented!");
      case "deck compatibility":
        throw new Error("FilterErrorOption for deck compatibility not implemented!");
      default:
        return <Fragment />
    }
  } else {
    return <Fragment />
  }
}
