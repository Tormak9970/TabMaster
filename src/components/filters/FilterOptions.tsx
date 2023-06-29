import {
  ButtonItem,
  Dropdown,
  DropdownOption,
  Field,
  SingleDropdownOption,
  TextField,
  ToggleField,
  showModal
} from "decky-frontend-lib";
import { VFC, Fragment, useState } from "react";
import { FilterType, TabFilterSettings } from "./Filters";
import { TabMasterContextProvider, useTabMasterContext } from "../../state/TabMasterContext";
import { ModeMultiSelect } from "../multi-selects/ModeMultiSelect";
import { EditUnionFilterModal } from "./EditUnionFilterModal";
import { MultiSelect } from "../multi-selects/MultiSelect";

type FilterOptionsProps<T extends FilterType> = {
  index: number,
  filter: TabFilterSettings<T>,
  containingGroupFilters: TabFilterSettings<FilterType>[],
  setContainingGroupFilters: React.Dispatch<React.SetStateAction<TabFilterSettings<FilterType>[]>>
}


const CollectionFilterOptions: VFC<FilterOptionsProps<'collection'>> = ({ index, setContainingGroupFilters, filter, containingGroupFilters }) => {
  const collectionDropdownOptions: DropdownOption[] = collectionStore.userCollections.map((collection: { displayName: any; id: any; }) => { return { label: collection.displayName, data: collection.id } });

  function onChange(data: SingleDropdownOption) {
    const updatedFilter = { ...filter };
    updatedFilter.params.collection = data.data;
    const updatedFilters = [...containingGroupFilters];
    updatedFilters[index] = updatedFilter;
    setContainingGroupFilters(updatedFilters);
  }

  return (
    <Field
      label="Selected Collection"
      description={<Dropdown rgOptions={collectionDropdownOptions} selectedOption={(filter as TabFilterSettings<'collection'>).params.collection} onChange={onChange} />}
    />
  );
}

const InstalledFilterOptions: VFC<FilterOptionsProps<'installed'>> = ({ index, setContainingGroupFilters, filter, containingGroupFilters }) => {
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

const RegexFilterOptions: VFC<FilterOptionsProps<'regex'>> = ({ index, setContainingGroupFilters, filter, containingGroupFilters }) => {
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

const FriendsFilterOptions: VFC<FilterOptionsProps<'friends'>> = ({ index, setContainingGroupFilters, filter, containingGroupFilters }) => {
  const { currentUsersFriends } = useTabMasterContext();

  const dropdownOptions: DropdownOption[] = currentUsersFriends.map((friend: FriendEntry) => { return { label: friend.name, data: friend.steamid } });
  const selected: DropdownOption[] = filter.params.friends?.map((id: number) => {
    return {
      label: currentUsersFriends.find((friend) => friend.steamid === id)!.name,
      data: id
    }
  }) ?? [];
  const friendsMode = filter.params.mode ?? "and";

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

const TagsFilterOptions: VFC<FilterOptionsProps<'tags'>> = ({ index, setContainingGroupFilters, filter, containingGroupFilters }) => {
  const { allStoreTags } = useTabMasterContext();

  const dropdownOptions: DropdownOption[] = allStoreTags.map((storeTag: TagResponse) => { return { label: storeTag.string, data: storeTag.tag } });
  const selected: DropdownOption[] = filter.params.tags?.map((tagNum: number) => {
    return {
      label: allStoreTags.find((tag) => tag.tag === tagNum)!.string,
      data: tagNum
    }
  }) ?? [];
  const tagsMode = filter.params.mode ?? "and";

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

const WhitelistFilterOptions: VFC<FilterOptionsProps<'whitelist'>> = ({ index, setContainingGroupFilters, filter, containingGroupFilters }) => {
  const usersGames: SteamAppOverview[] = collectionStore.appTypeCollectionMap.get('type-games')!.allApps;
  const selected: DropdownOption[] = [];

  filter.params.games ??= [];

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

const BlackListFilterOptions: VFC<FilterOptionsProps<'blacklist'>> = ({ index, setContainingGroupFilters, filter, containingGroupFilters }) => {
  const usersGames: SteamAppOverview[] = collectionStore.appTypeCollectionMap.get('type-games')!.allApps;
  const selected: DropdownOption[] = [];

  filter.params.games ??= [];

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

const UnionFilterOptions: VFC<FilterOptionsProps<'union'>> = ({ index, filter, containingGroupFilters, setContainingGroupFilters }) => {
  const tabMasterManager = useTabMasterContext().tabMasterManager
  const initialParams = {
    filters: filter.params.filters ?? [],
    mode: filter.params.mode ?? 'and'
  }
  const [isEditing, setIsEditing] = useState<boolean>(!!filter.params.filters)
  const [unionParams, setUnionParams] = useState<TabFilterSettings<'union'>['params']>(initialParams)

  function saveUnion(unionParams: TabFilterSettings<'union'>['params']) {
    const updatedFilter = { ...filter };
    updatedFilter.params.filters = unionParams.filters
    updatedFilter.params.mode = unionParams.mode
    const updatedFilters = [...containingGroupFilters];
    updatedFilters[index] = updatedFilter;
    setIsEditing(true)
    setUnionParams({ ...unionParams })
    setContainingGroupFilters(updatedFilters);
  }

  function onClick() {
    //*this is necessary to close the modal
    const modal: { instance: any } = { instance: null }
    modal.instance = showModal(
      <TabMasterContextProvider tabMasterManager={tabMasterManager}>
        <EditUnionFilterModal
          unionParams={unionParams}
          saveUnion={saveUnion}
          closeModal={() => modal.instance.Close()}
        />
      </TabMasterContextProvider>
    );
  }

  return <Field>
    <div style={{ width: "100%", display: "flex", flexDirection: "row" }}>
      <div style={{ width: "calc(100% - 100px)" }}>
        <ButtonItem onClick={onClick}>
          {(isEditing ? "Edit" : "Make") + " Union Group"}
        </ButtonItem>
      </div>
      <div style={{ marginLeft: "10px", width: "90px", marginTop: '10px', marginBottom: '10px', display: 'flex' }}>
        {isEditing ? unionParams.mode : ""}
      </div>
    </div>
    {unionParams.filters.map(filter => <div>{filter.type}</div>)}
  </Field>
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
      case "union":
        return <UnionFilterOptions index={index} filter={filter as TabFilterSettings<'union'>} containingGroupFilters={containingGroupFilters} setContainingGroupFilters={setContainingGroupFilters} />
      default:
        return <Fragment />
    }
  } else {
    return <Fragment />
  }
}