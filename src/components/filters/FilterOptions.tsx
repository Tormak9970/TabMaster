import {
  ButtonItem,
  Dropdown,
  DropdownOption,
  Field,
  Focusable,
  SingleDropdownOption,
  TextField,
  ToggleField,
  showModal
} from "decky-frontend-lib";
import { VFC, Fragment, useState } from "react";
import { FilterType, TabFilterSettings, categoryToLabel } from "./Filters";
import { TabMasterContextProvider, useTabMasterContext } from "../../state/TabMasterContext";
import { ModeMultiSelect } from "../multi-selects/ModeMultiSelect";
import { EditMergeFilterModal } from "../modals/EditMergeFilterModal";
import { MultiSelect } from "../multi-selects/MultiSelect";
import { FilterPreview } from "./FilterPreview";

type FilterOptionsProps<T extends FilterType> = {
  index: number,
  filter: TabFilterSettings<T>,
  containingGroupFilters: TabFilterSettings<FilterType>[],
  setContainingGroupFilters: React.Dispatch<React.SetStateAction<TabFilterSettings<FilterType>[]>>
}


/**
 * The options for a collection filter.
 */
export const CollectionFilterOptions: VFC<FilterOptionsProps<'collection'>> = ({ index, setContainingGroupFilters, filter, containingGroupFilters }) => {
  const collectionDropdownOptions: DropdownOption[] = collectionStore.userCollections.map((collection: { displayName: string; id: string; }) => { return { label: collection.displayName, data: collection.id } });

  function onChange(data: SingleDropdownOption) {
    const updatedFilter = { ...filter };
    updatedFilter.params.id = data.data;
    updatedFilter.params.name = data.label as string;
    const updatedFilters = [...containingGroupFilters];
    updatedFilters[index] = updatedFilter;
    setContainingGroupFilters(updatedFilters);
  }

  return (
    <Field
      label="Selected Collection"
      description={<Dropdown rgOptions={collectionDropdownOptions} selectedOption={(filter as TabFilterSettings<'collection'>).params.id} onChange={onChange} />}
    />
  );
}

/**
 * The options for an installed filter.
 */
export const InstalledFilterOptions: VFC<FilterOptionsProps<'installed'>> = ({ index, setContainingGroupFilters, filter, containingGroupFilters }) => {
  function onChange(checked: boolean) {
    const updatedFilter = { ...filter };
    updatedFilter.params.installed = checked ?? false;
    const updatedFilters = [...containingGroupFilters];
    updatedFilters[index] = updatedFilter;
    setContainingGroupFilters(updatedFilters);
  }

  return (
    <ToggleField label="Installed" checked={filter.params.installed} onChange={onChange} />
  );
}

/**
 * The options for a regex filter.
 */
export const RegexFilterOptions: VFC<FilterOptionsProps<'regex'>> = ({ index, setContainingGroupFilters, filter, containingGroupFilters }) => {
  function onChange(e: React.ChangeEvent<HTMLInputElement>) {
    const updatedFilter = { ...filter };
    updatedFilter.params.regex = e?.target.value;
    const updatedFilters = [...containingGroupFilters];
    updatedFilters[index] = updatedFilter;
    setContainingGroupFilters(updatedFilters);
  }

  return (
    <Field
      label="Regex"
      description={<TextField value={filter.params.regex} onChange={onChange} />}
    />
  );
}

/**
 * The options for a friends filter.
 */
export const FriendsFilterOptions: VFC<FilterOptionsProps<'friends'>> = ({ index, setContainingGroupFilters, filter, containingGroupFilters }) => {
  const { currentUsersFriends } = useTabMasterContext();

  const dropdownOptions: DropdownOption[] = currentUsersFriends.map((friend: FriendEntry) => { return { label: friend.name, data: friend.steamid } });
  const selected: DropdownOption[] = filter.params.friends.map((id: number) => {
    return {
      label: currentUsersFriends.find((friend) => friend.steamid === id)!.name,
      data: id
    }
  });
  const friendsMode = filter.params.mode;

  function onChange(selected: DropdownOption[], mode: LogicalMode) {
    const updatedFilter = { ...filter };
    updatedFilter.params.friends = selected.map((friendEntry) => friendEntry.data as number);
    updatedFilter.params.mode = mode;
    const updatedFilters = [...containingGroupFilters];
    updatedFilters[index] = updatedFilter;
    setContainingGroupFilters(updatedFilters);
  }

  return (
    <ModeMultiSelect fieldLabel="Selected Friends" dropdownLabel="Add a friend" mode={friendsMode} options={dropdownOptions} selected={selected} onChange={onChange} />
  );
}

/**
 * The options for a tags filter.
 */
export const TagsFilterOptions: VFC<FilterOptionsProps<'tags'>> = ({ index, setContainingGroupFilters, filter, containingGroupFilters }) => {
  const { allStoreTags } = useTabMasterContext();

  const dropdownOptions: DropdownOption[] = allStoreTags.map((storeTag: TagResponse) => { return { label: storeTag.string, data: storeTag.tag } });
  const selected: DropdownOption[] = filter.params.tags.map((tagNum: number) => {
    return {
      label: allStoreTags.find((tag) => tag.tag === tagNum)!.string,
      data: tagNum
    }
  });
  const tagsMode = filter.params.mode

  function onChange(selected: DropdownOption[], mode: LogicalMode) {
    const updatedFilter = { ...filter };
    updatedFilter.params.tags = selected.map((tagEntry) => tagEntry.data as number);
    updatedFilter.params.mode = mode;
    const updatedFilters = [...containingGroupFilters];
    updatedFilters[index] = updatedFilter;
    setContainingGroupFilters(updatedFilters);
  }

  return (
    <ModeMultiSelect fieldLabel="Selected Tags" dropdownLabel="Add a tag" mode={tagsMode} options={dropdownOptions} selected={selected} onChange={onChange} />
  );
}

/**
 * The options for a whitelist filter.
 */
export const WhitelistFilterOptions: VFC<FilterOptionsProps<'whitelist'>> = ({ index, setContainingGroupFilters, filter, containingGroupFilters }) => {
  const usersGames: SteamAppOverview[] = collectionStore.appTypeCollectionMap.get('type-games')!.allApps;
  const selected: DropdownOption[] = [];

  for (const gameid of filter.params.games) {
    const game = usersGames.find((game) => game.appid === gameid);

    if (game) selected.push({ label: game.display_name, data: gameid });
  }

  const dropdownOptions: DropdownOption[] = usersGames.map((game: SteamAppOverview) => { return { label: game.display_name, data: game.appid } });

  function onChange(selected: DropdownOption[]) {
    const updatedFilter = { ...filter };
    updatedFilter.params.games = selected.map((gameEntry) => gameEntry.data as number);
    const updatedFilters = [...containingGroupFilters];
    updatedFilters[index] = updatedFilter;
    setContainingGroupFilters(updatedFilters);
  }

  return (
    <MultiSelect fieldLabel="Whitelisted Games" dropdownLabel="Add a game" options={dropdownOptions} selected={selected} onChange={onChange} />
  );
}

/**
 * The options for a blacklist filter.
 */
export const BlackListFilterOptions: VFC<FilterOptionsProps<'blacklist'>> = ({ index, setContainingGroupFilters, filter, containingGroupFilters }) => {
  const usersGames: SteamAppOverview[] = collectionStore.appTypeCollectionMap.get('type-games')!.allApps;
  const selected: DropdownOption[] = [];

  for (const gameid of filter.params.games) {
    const game = usersGames.find((game) => game.appid === gameid);

    if (game) selected.push({ label: game.display_name, data: gameid });
  }

  const dropdownOptions: DropdownOption[] = usersGames.map((game: SteamAppOverview) => { return { label: game.display_name, data: game.appid } });

  function onChange(selected: DropdownOption[]) {
    const updatedFilter = { ...filter };
    updatedFilter.params.games = selected.map((gameEntry) => gameEntry.data as number);
    const updatedFilters = [...containingGroupFilters];
    updatedFilters[index] = updatedFilter;
    setContainingGroupFilters(updatedFilters);
  }

  return (
    <MultiSelect fieldLabel="Blacklisted Games" dropdownLabel="Add a game" options={dropdownOptions} selected={selected} onChange={onChange} />
  );
}

/**
 * The options for a merge filter.
 */
export const MergeFilterOptions: VFC<FilterOptionsProps<'merge'>> = ({ index, filter, containingGroupFilters, setContainingGroupFilters }) => {
  const tabMasterManager = useTabMasterContext().tabMasterManager
  const initialParams = {
    filters: [...filter.params.filters],
    mode: filter.params.mode
  }
  const [isEditing, setIsEditing] = useState<boolean>(filter.params.filters.length !== 0)
  const [mergeParams, setMergeParams] = useState<TabFilterSettings<'merge'>['params']>(initialParams)

  function saveMerge(mergeParams: TabFilterSettings<'merge'>['params']) {
    const updatedFilter = { ...filter };
    updatedFilter.params.filters = mergeParams.filters
    updatedFilter.params.mode = mergeParams.mode
    const updatedFilters = [...containingGroupFilters];
    updatedFilters[index] = updatedFilter;
    setIsEditing(true)
    setMergeParams({ ...mergeParams })
    setContainingGroupFilters(updatedFilters);
  }

  function onClick() {
    //*this is necessary to close the modal
    const modal: { instance: any } = { instance: null }
    modal.instance = showModal(
      <TabMasterContextProvider tabMasterManager={tabMasterManager}>
        <EditMergeFilterModal
          mergeParams={mergeParams}
          saveMerge={saveMerge}
          closeModal={() => modal.instance.Close()}
        />
      </TabMasterContextProvider>
    );
  }

  return (
    <Focusable className="styled-btn">
      <ButtonItem onClick={onClick}>
        {(isEditing ? "Edit" : "Create") + " Merge Group"}
      </ButtonItem>
      <div className="merge-filter-entries">
        {mergeParams.filters.map((filter) => (
          <FilterPreview filter={filter} />
        ))}
      </div>
    </Focusable>
  )
}

/**
 * The options for a platform filter.
 */
export const PlatformFilterOptions: VFC<FilterOptionsProps<'platform'>> = ({ index, setContainingGroupFilters, filter, containingGroupFilters }) => {
  const dropdownOptions: DropdownOption[] = [
    { label: "Steam", data: "steam" },
    { label: "Non Steam", data: "nonSteam" }
  ];

  function onChange(selected: DropdownOption) {
    const updatedFilter = { ...filter };
    updatedFilter.params.platform = selected.data;
    const updatedFilters = [...containingGroupFilters];
    updatedFilters[index] = updatedFilter;
    setContainingGroupFilters(updatedFilters);
  }

  return (
    <Field
      label="Selected Platform"
      description={<Dropdown rgOptions={dropdownOptions} selectedOption={(filter as TabFilterSettings<'platform'>).params.platform} onChange={onChange} />}
    />
  );
}

/**
 * The options for a deck compatibility filter.
 */
export const DeckCompatFilterOptions: VFC<FilterOptionsProps<'deck compatibility'>> = ({ index, setContainingGroupFilters, filter, containingGroupFilters }) => {
  const dropdownOptions: DropdownOption[] = [0, 1, 2, 3].map((level) => {
    return { label: categoryToLabel(level), data: level };
  });

  function onChange(selected: DropdownOption) {
    const updatedFilter = { ...filter };
    updatedFilter.params.category = selected.data;
    const updatedFilters = [...containingGroupFilters];
    updatedFilters[index] = updatedFilter;
    setContainingGroupFilters(updatedFilters);
  }

  return (
    <Field
      label="Selected Compatibility"
      description={<Dropdown rgOptions={dropdownOptions} selectedOption={categoryToLabel((filter as TabFilterSettings<'deck compatibility'>).params.category)} onChange={onChange} />}
    />
  );
}


/**
 * The options for an individual filter.
 */
export const FilterOptions: VFC<FilterOptionsProps<FilterType>> = ({ index, filter, containingGroupFilters, setContainingGroupFilters }) => {
  if (filter) {
    switch (filter.type) {
      case "collection":
        return <CollectionFilterOptions index={index} filter={filter as TabFilterSettings<'collection'>} containingGroupFilters={containingGroupFilters} setContainingGroupFilters={setContainingGroupFilters} />
      case "installed":
        return <InstalledFilterOptions index={index} filter={filter as TabFilterSettings<'installed'>} containingGroupFilters={containingGroupFilters} setContainingGroupFilters={setContainingGroupFilters} />
      case "regex":
        return <RegexFilterOptions index={index} filter={filter as TabFilterSettings<'regex'>} containingGroupFilters={containingGroupFilters} setContainingGroupFilters={setContainingGroupFilters} />
      case "friends":
        return <FriendsFilterOptions index={index} filter={filter as TabFilterSettings<'friends'>} containingGroupFilters={containingGroupFilters} setContainingGroupFilters={setContainingGroupFilters} />
      case "tags":
        return <TagsFilterOptions index={index} filter={filter as TabFilterSettings<'tags'>} containingGroupFilters={containingGroupFilters} setContainingGroupFilters={setContainingGroupFilters} />
      case "whitelist":
        return <WhitelistFilterOptions index={index} filter={filter as TabFilterSettings<'whitelist'>} containingGroupFilters={containingGroupFilters} setContainingGroupFilters={setContainingGroupFilters} />
      case "blacklist":
        return <BlackListFilterOptions index={index} filter={filter as TabFilterSettings<'blacklist'>} containingGroupFilters={containingGroupFilters} setContainingGroupFilters={setContainingGroupFilters} />
      case "merge":
        return <MergeFilterOptions index={index} filter={filter as TabFilterSettings<'merge'>} containingGroupFilters={containingGroupFilters} setContainingGroupFilters={setContainingGroupFilters} />
      case "platform":
        return <PlatformFilterOptions index={index} filter={filter as TabFilterSettings<'platform'>} containingGroupFilters={containingGroupFilters} setContainingGroupFilters={setContainingGroupFilters} />
      case "deck compatibility":
        return <DeckCompatFilterOptions index={index} filter={filter as TabFilterSettings<'deck compatibility'>} containingGroupFilters={containingGroupFilters} setContainingGroupFilters={setContainingGroupFilters} />
      default:
        return <Fragment />
    }
  } else {
    return <Fragment />
  }
}
