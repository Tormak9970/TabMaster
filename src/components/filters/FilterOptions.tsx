import {
  Dropdown,
  DropdownOption,
  Field,
  SingleDropdownOption,
  TextField,
  ToggleField
} from "decky-frontend-lib";
import { VFC, Fragment } from "react";
import { FilterType, TabFilterSettings } from "./Filters";
import { useTabMasterContext } from "../../state/TabMasterContext";
import { ModeMultiSelect } from "../multi-selects/ModeMultiSelect";
import { MultiSelect } from "../multi-selects/MultiSelect";

type FilterOptionsProps = {
  index: number,
  filter: TabFilterSettings<FilterType>,
  filters: TabFilterSettings<FilterType>[],
  setFilters: React.Dispatch<React.SetStateAction<TabFilterSettings<FilterType>[]>>
}


const CollectionFilterOptions: VFC<FilterOptionsProps> = ({ index, setFilters, filter, filters }) => {
  const collectionDropdownOptions: DropdownOption[] = collectionStore.userCollections.map((collection: { displayName: any; id: any; }) => { return { label: collection.displayName, data: collection.id } });
  
  function onChange(data: SingleDropdownOption) {
    const updatedFilter = {...filter} as TabFilterSettings<'collection'>;
    updatedFilter.params.collection = data.data;
    const updatedFilters = [...filters];
    updatedFilters[index] = updatedFilter;
    setFilters(updatedFilters);
  }

  return (
    <Field
      label="Selected Collection"
      description={<Dropdown rgOptions={collectionDropdownOptions} selectedOption={(filter as TabFilterSettings<'collection'>).params.collection} onChange={onChange} />}
    />
  );
}

const InstalledFilterOptions: VFC<FilterOptionsProps> = ({ index, setFilters, filter, filters }) => {
  function onChange(checked: boolean) {
    const updatedFilter = {...filter} as TabFilterSettings<'installed'>;
    updatedFilter.params.installed = checked ?? false;
    const updatedFilters = [...filters];
    updatedFilters[index] = updatedFilter;
    setFilters(updatedFilters);
  }

  return (
    <ToggleField label="Installed" checked={(filter as TabFilterSettings<'installed'>).params.installed} onChange={onChange} />
  );
}

const RegexFilterOptions: VFC<FilterOptionsProps> = ({ index, setFilters, filter, filters }) => {
  function onChange(e: React.ChangeEvent<HTMLInputElement>) {
    const updatedFilter = {...filter} as TabFilterSettings<'regex'>;
    updatedFilter.params.regex = e?.target.value;
    const updatedFilters = [...filters];
    updatedFilters[index] = updatedFilter;
    setFilters(updatedFilters);
  }

  return (
    <Field
      label="Regex"
      description={<TextField value={(filter as TabFilterSettings<'regex'>).params.regex} onChange={onChange} />}
    />
  );
}

const FriendsFilterOptions: VFC<FilterOptionsProps> = ({ index, setFilters, filter, filters }) => {
  const { currentUsersFriends } = useTabMasterContext();

  const dropdownOptions: DropdownOption[] = currentUsersFriends.map((friend: FriendEntry) => { return { label: friend.name, data: friend.steamid } });
  const selected: DropdownOption[] = (filter as TabFilterSettings<"friends">).params.friends?.map((id: number) => {
    return {
      label: currentUsersFriends.find((friend) => friend.steamid === id)!.name,
      data: id
    }
  }) ?? [];
  const friendsMode = (filter as TabFilterSettings<"friends">).params.mode ?? "and";

  function onChange(selected: DropdownOption[], mode: string) {
    const updatedFilter = {...filter} as TabFilterSettings<'friends'>;
    updatedFilter.params.friends = selected.map((friendEntry) => friendEntry.data as number);
    updatedFilter.params.mode = mode;
    const updatedFilters = [...filters];
    updatedFilters[index] = updatedFilter;
    setFilters(updatedFilters);
  }

  return (
    <ModeMultiSelect fieldLabel="Selected Friends" dropdownLabel="Add a friend" mode={friendsMode} options={dropdownOptions} selected={selected} onChange={onChange} />
  );
}

const TagsFilterOptions: VFC<FilterOptionsProps> = ({ index, setFilters, filter, filters }) => {
  const { allStoreTags } = useTabMasterContext();

  const dropdownOptions: DropdownOption[] = allStoreTags.map((storeTag: TagResponse) => { return { label: storeTag.string, data: storeTag.tag } });
  const selected: DropdownOption[] = (filter as TabFilterSettings<"tags">).params.tags?.map((tagNum: number) => {
    return {
      label: allStoreTags.find((tag) => tag.tag === tagNum)!.string,
      data: tagNum
    }
  }) ?? [];
  const tagsMode = (filter as TabFilterSettings<"tags">).params.mode ?? "and";

  function onChange(selected: DropdownOption[], mode: string) {
    const updatedFilter = {...filter} as TabFilterSettings<'tags'>;
    updatedFilter.params.tags = selected.map((tagEntry) => tagEntry.data as number);
    updatedFilter.params.mode = mode;
    const updatedFilters = [...filters];
    updatedFilters[index] = updatedFilter;
    setFilters(updatedFilters);
  }

  return (
    <ModeMultiSelect fieldLabel="Selected Tags" dropdownLabel="Add a tag" mode={tagsMode} options={dropdownOptions} selected={selected} onChange={onChange} />
  );
}

const WhitelistFilterOptions: VFC<FilterOptionsProps> = ({ index, setFilters, filter, filters }) => {
  const usersGames:SteamAppOverview[] = collectionStore.appTypeCollectionMap.get('type-games')!.allApps;
  const selected: DropdownOption[] = [];

  (filter as TabFilterSettings<"whitelist">).params.games ??= [];

  for (const gameid of (filter as TabFilterSettings<"whitelist">).params.games) {
    const game = usersGames.find((game) => game.appid === gameid);

    if (game) selected.push({ label: game.display_name, data: gameid });
  }

  const dropdownOptions: DropdownOption[] = usersGames.map((game: SteamAppOverview) => { return { label: game.display_name, data: game.appid } });

  function onChange(selected: DropdownOption[]) {
    const updatedFilter = {...filter} as TabFilterSettings<'whitelist'>;
    updatedFilter.params.games = selected.map((gameEntry) => gameEntry.data as number);
    const updatedFilters = [...filters];
    updatedFilters[index] = updatedFilter;
    setFilters(updatedFilters);
  }

  return (
    <MultiSelect fieldLabel="Whitelisted Games" dropdownLabel="Add a game" options={dropdownOptions} selected={selected} onChange={onChange} />
  );
}

const BlackListFilterOptions: VFC<FilterOptionsProps> = ({ index, setFilters, filter, filters }) => {
  const usersGames:SteamAppOverview[] = collectionStore.appTypeCollectionMap.get('type-games')!.allApps;
  const selected: DropdownOption[] = [];
  
  (filter as TabFilterSettings<"blacklist">).params.games ??= [];

  for (const gameid of (filter as TabFilterSettings<"blacklist">).params.games) {
    const game = usersGames.find((game) => game.appid === gameid);

    if (game) selected.push({ label: game.display_name, data: gameid });
  }

  const dropdownOptions: DropdownOption[] = usersGames.map((game: SteamAppOverview) => { return { label: game.display_name, data: game.appid } });

  function onChange(selected: DropdownOption[]) {
    const updatedFilter = {...filter} as TabFilterSettings<'blacklist'>;
    updatedFilter.params.games = selected.map((gameEntry) => gameEntry.data as number);
    const updatedFilters = [...filters];
    updatedFilters[index] = updatedFilter;
    setFilters(updatedFilters);
  }

  return (
    <MultiSelect fieldLabel="Blacklisted Games" dropdownLabel="Add a game" options={dropdownOptions} selected={selected} onChange={onChange} />
  );
}


/**
 * The options for an individual filter.
 */
export const FilterOptions: VFC<FilterOptionsProps> = ({ index, filter, filters, setFilters }) => {
  if (filter) {
    switch (filter.type) {
      case "collection":
        return <CollectionFilterOptions index={index} filter={filter} filters={filters} setFilters={setFilters} />
      case "installed":
        return <InstalledFilterOptions index={index} filter={filter} filters={filters} setFilters={setFilters} />
      case "regex":
        return <RegexFilterOptions index={index} filter={filter} filters={filters} setFilters={setFilters} />
      case "friends":
        return <FriendsFilterOptions index={index} filter={filter} filters={filters} setFilters={setFilters} />
      case "tags":
        return <TagsFilterOptions index={index} filter={filter} filters={filters} setFilters={setFilters} />
      case "whitelist":
        return <WhitelistFilterOptions index={index} filter={filter} filters={filters} setFilters={setFilters} />
      case "blacklist":
        return <BlackListFilterOptions index={index} filter={filter} filters={filters} setFilters={setFilters} />
      default:
        return <Fragment />
    }
  } else {
    return <Fragment />
  }
}