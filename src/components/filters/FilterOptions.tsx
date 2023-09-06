import {
  ButtonItem,
  Dropdown,
  DropdownOption,
  Field,
  Focusable,
  SingleDropdownOption,
  SliderField,
  TextField,
  ToggleField,
  showModal
} from "decky-frontend-lib";
import React, { VFC, Fragment, useState } from "react";
import { FilterType, ReviewScoreType, TabFilterSettings, ThresholdCondition, TimeUnit, compatCategoryToLabel } from "./Filters";
import { TabMasterContextProvider, useTabMasterContext } from "../../state/TabMasterContext";
import { ModeMultiSelect } from "../multi-selects/ModeMultiSelect";
import { EditMergeFilterModal } from "../modals/EditMergeFilterModal";
import { MultiSelect } from "../multi-selects/MultiSelect";
import { FilterPreview } from "./FilterPreview";
import { DateIncludes, DateObj, DatePicker, DateSelection } from '../generic/DatePickers';
import { EnhancedSelectorFocusRingMode, EnhancedSelectorTransparencyMode } from '../generic/EnhancedSelector';

type FilterOptionsProps<T extends FilterType> = {
  index: number,
  filter: TabFilterSettings<T>,
  containingGroupFilters: TabFilterSettings<FilterType>[],
  setContainingGroupFilters: React.Dispatch<React.SetStateAction<TabFilterSettings<FilterType>[]>>;
};


/**
 * The options for a collection filter.
 */
const CollectionFilterOptions: VFC<FilterOptionsProps<'collection'>> = ({ index, setContainingGroupFilters, filter, containingGroupFilters }) => {
  const collectionDropdownOptions: DropdownOption[] = collectionStore.userCollections.map((collection: { displayName: string; id: string; }) => { return { label: collection.displayName, data: collection.id }; });

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
};

/**
 * The options for an installed filter.
 */
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
};

/**
 * The options for a regex filter.
 */
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
};

/**
 * The options for a friends filter.
 */
const FriendsFilterOptions: VFC<FilterOptionsProps<'friends'>> = ({ index, setContainingGroupFilters, filter, containingGroupFilters }) => {
  const { currentUsersFriends } = useTabMasterContext();

  const dropdownOptions: DropdownOption[] = currentUsersFriends.map((friend: FriendEntry) => { return { label: friend.name, data: friend.steamid }; });
  const selected: DropdownOption[] = filter.params.friends.map((id: number) => {
    return {
      label: currentUsersFriends.find((friend) => friend.steamid === id)!.name,
      data: id
    };
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
};

/**
 * The options for a tags filter.
 */
const TagsFilterOptions: VFC<FilterOptionsProps<'tags'>> = ({ index, setContainingGroupFilters, filter, containingGroupFilters }) => {
  const { allStoreTags } = useTabMasterContext();

  const dropdownOptions: DropdownOption[] = allStoreTags.map((storeTag: TagResponse) => { return { label: storeTag.string, data: storeTag.tag }; });
  const selected: DropdownOption[] = filter.params.tags.map((tagNum: number) => {
    return {
      label: allStoreTags.find((tag) => tag.tag === tagNum)!.string,
      data: tagNum
    };
  });
  const tagsMode = filter.params.mode;

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
};

/**
 * The options for a whitelist filter.
 */
const WhitelistFilterOptions: VFC<FilterOptionsProps<'whitelist'>> = ({ index, setContainingGroupFilters, filter, containingGroupFilters }) => {
  let appsList: SteamAppOverview[] = [];
  const selected: DropdownOption[] = [];
  const types = ['games', 'music', 'software'];

  for (const type of types) {
    appsList = appsList.concat(collectionStore.appTypeCollectionMap.get(`type-${type as 'games' | 'music' | 'software'}`)!.allApps);
  }

  for (const gameid of filter.params.games) {
    const game = appsList.find((game) => game.appid === gameid);

    if (game) selected.push({ label: game.display_name, data: gameid });
  }

  const dropdownOptions: DropdownOption[] = appsList.map((game: SteamAppOverview) => { return { label: game.display_name, data: game.appid }; });

  function onChange(selected: DropdownOption[]) {
    const updatedFilter = { ...filter };
    updatedFilter.params.games = selected.map((gameEntry) => gameEntry.data as number);
    const updatedFilters = [...containingGroupFilters];
    updatedFilters[index] = updatedFilter;
    setContainingGroupFilters(updatedFilters);
  }

  return (
    <MultiSelect fieldLabel="Whitelisted Apps" dropdownLabel="Add an app" options={dropdownOptions} selected={selected} onChange={onChange} />
  );
};

/**
 * The options for a blacklist filter.
 */
const BlackListFilterOptions: VFC<FilterOptionsProps<'blacklist'>> = ({ index, setContainingGroupFilters, filter, containingGroupFilters }) => {
  let appsList: SteamAppOverview[] = [];
  const selected: DropdownOption[] = [];
  const types = ['games', 'music', 'software'];

  for (const type of types) {
    appsList = appsList.concat(collectionStore.appTypeCollectionMap.get(`type-${type as 'games' | 'music' | 'software'}`)!.allApps);
  }

  for (const gameid of filter.params.games) {
    const game = appsList.find((game) => game.appid === gameid);

    if (game) selected.push({ label: game.display_name, data: gameid });
  }

  const dropdownOptions: DropdownOption[] = appsList.map((game: SteamAppOverview) => { return { label: game.display_name, data: game.appid }; });

  function onChange(selected: DropdownOption[]) {
    const updatedFilter = { ...filter };
    updatedFilter.params.games = selected.map((gameEntry) => gameEntry.data as number);
    const updatedFilters = [...containingGroupFilters];
    updatedFilters[index] = updatedFilter;
    setContainingGroupFilters(updatedFilters);
  }

  return (
    <MultiSelect fieldLabel="Blacklisted Apps" dropdownLabel="Add an app" options={dropdownOptions} selected={selected} onChange={onChange} />
  );
};

/**
 * The options for a merge filter.
 */
const MergeFilterOptions: VFC<FilterOptionsProps<'merge'>> = ({ index, filter, containingGroupFilters, setContainingGroupFilters }) => {
  const tabMasterManager = useTabMasterContext().tabMasterManager;
  const initialParams = {
    filters: [...filter.params.filters],
    mode: filter.params.mode,
  }
  
  const [isEditing, setIsEditing] = useState<boolean>(filter.params.filters.length !== 0);
  const [mergeParams, setMergeParams] = useState<TabFilterSettings<'merge'>['params']>(initialParams);

  function saveMerge(mergeParams: TabFilterSettings<'merge'>['params']) {
    const updatedFilter = { ...filter };
    updatedFilter.params.filters = mergeParams.filters;
    updatedFilter.params.mode = mergeParams.mode;

    const updatedFilters = [...containingGroupFilters];
    updatedFilters[index] = updatedFilter;

    setIsEditing(true);
    setMergeParams({ ...mergeParams });
    setContainingGroupFilters(updatedFilters);
  }

  function onClick() {
    //*this is necessary to close the modal
    const modal: { instance: any; } = { instance: null };
    modal.instance = showModal(
      <TabMasterContextProvider tabMasterManager={tabMasterManager}>
        <EditMergeFilterModal
          mergeParams={mergeParams}
          saveMerge={saveMerge}
          closeModal={() => modal.instance.Close()}
          isEditing={isEditing}
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
        {mergeParams.filters.map((filter, index) => (
          <div className="merge-filter-entry-container">
            <FilterPreview filter={filter} />
            <div>
              {index !== mergeParams.filters.length - 1 && mergeParams.mode}
            </div>
          </div>
        ))}
      </div>
    </Focusable>
  );
};

/**
 * The options for a platform filter.
 */
const PlatformFilterOptions: VFC<FilterOptionsProps<'platform'>> = ({ index, setContainingGroupFilters, filter, containingGroupFilters }) => {
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
};

/**
 * The options for a deck compatibility filter.
 */
const DeckCompatFilterOptions: VFC<FilterOptionsProps<'deck compatibility'>> = ({ index, setContainingGroupFilters, filter, containingGroupFilters }) => {
  const dropdownOptions: DropdownOption[] = [0, 1, 2, 3].map((level) => {
    return { label: compatCategoryToLabel(level), data: level };
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
      description={<Dropdown rgOptions={dropdownOptions} selectedOption={(filter as TabFilterSettings<'deck compatibility'>).params.category} onChange={onChange} />}
    />
  );
};

/**
 * The options for a review score filter.
 */
const ReviewScoreFilterOptions: VFC<FilterOptionsProps<'review score'>> = ({ index, setContainingGroupFilters, filter, containingGroupFilters }) => {
  const [value, setValue] = useState<number>(filter.params.scoreThreshold);
  const [thresholdType, setThresholdType] = useState<ThresholdCondition>(filter.params.condition);
  const [reviewType, setReviewType] = useState<ReviewScoreType>(filter.params.type);

  function updateFilter(threshold: number, threshType: ThresholdCondition, scoreType: ReviewScoreType) {
    const updatedFilter = { ...filter };
    updatedFilter.params.scoreThreshold = threshold;
    updatedFilter.params.condition = threshType;
    updatedFilter.params.type = scoreType;
    const updatedFilters = [...containingGroupFilters];
    updatedFilters[index] = updatedFilter;
    setContainingGroupFilters(updatedFilters);
  }

  function onSliderChange(value: number) {
    updateFilter(value, thresholdType, reviewType);
    setValue(value);
  }

  function onThreshTypeChange({ data: threshType }: { data: ThresholdCondition; }) {
    updateFilter(value, threshType, reviewType);
    setThresholdType(threshType);
  }

  function onReviewTypeChange({ data: type }: { data: ReviewScoreType; }) {
    updateFilter(value, thresholdType, type);
    setReviewType(type);
  }

  return (
    <Focusable className="slider-with-2dropdown-container wide-dropdown" style={{ display: 'flex', flexDirection: 'row' }}>
      <SliderField value={value} label={reviewType === 'metacritic' ? `Metacritic score of ${value} or ${thresholdType === 'above' ? 'higher' : 'lower'}` : `At ${thresholdType === 'above' ? 'least' : 'most'} ${value}% positive Steam reviews`} min={0} max={100} onChange={onSliderChange} />
      <div style={{ right: '40px', position: 'absolute', zIndex: 1, transform: 'translate(0px, 18px)' }}>
        <Focusable style={{ display: 'flex' }}>
          <div style={{ width: '130px' }}>
            <Dropdown rgOptions={[{ label: 'Metacritic', data: 'metacritic' }, { label: 'Steam ', data: 'steampercent' }]} selectedOption={reviewType} onChange={onReviewTypeChange} />
          </div>
          <div style={{ marginLeft: '10px', width: '115px' }}>
            <Dropdown rgOptions={[{ label: 'At least', data: 'above' }, { label: 'At most', data: 'below' }]} selectedOption={thresholdType} onChange={onThreshTypeChange} />
          </div>
        </Focusable>
      </div>
    </Focusable>
  );
};

/**
 * The options for a time played filter.
 */
const TimePlayedFilterOptions: VFC<FilterOptionsProps<'time played'>> = ({ index, setContainingGroupFilters, filter, containingGroupFilters }) => {
  const [time, setTime] = useState<number>(filter.params.timeThreshold);
  const [units, setUnits] = useState<TimeUnit>(filter.params.units);
  const [thresholdType, setThresholdType] = useState<ThresholdCondition>(filter.params.condition);

  function updateFilter(threshold: number, threshType: ThresholdCondition, units: TimeUnit) {
    const updatedFilter = { ...filter };
    updatedFilter.params.timeThreshold = threshold;
    updatedFilter.params.condition = threshType;
    updatedFilter.params.units = units;
    const updatedFilters = [...containingGroupFilters];
    updatedFilters[index] = updatedFilter;
    setContainingGroupFilters(updatedFilters);
  }

  function onSliderChange(value: number) {
    updateFilter(value, thresholdType, units);
    setTime(value);
  }

  function onUnitChange({ data: units }: { data: TimeUnit; }) {
    updateFilter(time, thresholdType, units);
    setUnits(units);
  }

  function onThreshTypeChange({ data: threshType }: { data: ThresholdCondition; }) {
    updateFilter(time, threshType, units);
    setThresholdType(threshType);
  }

  return (
    <Focusable className="slider-with-2dropdown-container" style={{ display: 'flex', flexDirection: 'row' }}>
      <SliderField value={time} label={`Played for ${time} ${time === 1 ? units.slice(0, -1) : units} or ${thresholdType === 'above' ? 'more' : 'less'}`} min={0} max={300} onChange={onSliderChange} />
      <div style={{ right: '40px', position: 'absolute', zIndex: 1, transform: 'translate(0px, 18px)' }}>
        <Focusable style={{ display: 'flex' }}>
          <div style={{ width: '115px' }}>
            <Dropdown
              rgOptions={[
                { label: 'Minutes', data: 'minutes' },
                { label: 'Hours', data: 'hours' },
                { label: 'Days', data: 'days' }
              ]}
              selectedOption={units}
              onChange={onUnitChange}
            />
          </div>
          <div style={{ marginLeft: '10px', width: "115px" }}>
            <Dropdown rgOptions={[{ label: 'At least', data: 'above' }, { label: 'At most', data: 'below' }]} selectedOption={thresholdType} onChange={onThreshTypeChange} />
          </div>
        </Focusable>
      </div>
    </Focusable>
  );
};

/**
 * The options for a size on disk filter.
 */
const SizeOnDiskFilterOptions: VFC<FilterOptionsProps<'size on disk'>> = ({ index, setContainingGroupFilters, filter, containingGroupFilters }) => {
  const [value, setValue] = useState<number>(filter.params.gbThreshold);
  const [thresholdType, setThresholdType] = useState<ThresholdCondition>(filter.params.condition);

  function updateFilter(threshold: number, threshType: ThresholdCondition) {
    const updatedFilter = { ...filter };
    updatedFilter.params.gbThreshold = threshold;
    updatedFilter.params.condition = threshType;
    const updatedFilters = [...containingGroupFilters];
    updatedFilters[index] = updatedFilter;
    setContainingGroupFilters(updatedFilters);
  }

  function onSliderChange(value: number) {
    updateFilter(value, thresholdType);
    setValue(value);
  }

  function onThreshTypeChange({ data: threshType }: { data: ThresholdCondition; }) {
    updateFilter(value, threshType);
    setThresholdType(threshType);
  }

  return (
    <Focusable className="slider-with-dropdown-container" style={{ display: 'flex', flexDirection: 'row' }}>
      <SliderField value={value} label={`${value} GB or ${thresholdType === 'above' ? 'more' : 'less'} on disk`} min={0} max={200} onChange={onSliderChange} />
      <div style={{ right: '40px', position: 'absolute', zIndex: 1, transform: 'translate(0px, 18px)' }}>
        <Dropdown rgOptions={[{ label: 'At least', data: 'above' }, { label: 'At most', data: 'below' }]} selectedOption={thresholdType} onChange={onThreshTypeChange} />
      </div>
    </Focusable>
  );
};

/**
 * The options for a time played filter.
 */
const ReleaseDateFilterOptions: VFC<FilterOptionsProps<'release date'>> = ({ index, setContainingGroupFilters, filter, containingGroupFilters }) => {
  const [date, setDate] = useState<DateObj | undefined>(filter.params.date);
  const [dateIncludes, setDateIncludes] = useState<DateIncludes>(filter.params.date ? (filter.params.date.day === undefined ? (filter.params.date.month === undefined ? DateIncludes.yearOnly : DateIncludes.monthYear) : DateIncludes.dayMonthYear) : DateIncludes.dayMonthYear);
  const [thresholdType, setThresholdType] = useState<ThresholdCondition>(filter.params.condition);

  function onDateChange(dateSelection: DateSelection) {
    const updatedFilter = { ...filter };
    updatedFilter.params.date = dateSelection.data;
    const updatedFilters = [...containingGroupFilters];
    updatedFilters[index] = updatedFilter;
    setContainingGroupFilters(updatedFilters);
    setDate(dateSelection.data);
  }

  function onThreshTypeChange({ data: threshType }: { data: ThresholdCondition; }) {
    const updatedFilter = { ...filter };
    updatedFilter.params.condition = threshType;
    const updatedFilters = [...containingGroupFilters];
    updatedFilters[index] = updatedFilter;
    setContainingGroupFilters(updatedFilters);
    setThresholdType(threshType);
  }

  return (
    <Field label={`Released ${dateIncludes === DateIncludes.dayMonthYear ? 'on' : 'in'} or ${thresholdType === 'above' ? 'after' : 'before'}...`}
      description={
        <Focusable style={{ display: 'flex', flexDirection: 'row' }}>
          <DatePicker
            focusDropdowns={true}
            modalType='simple'
            buttonContainerStyle={{ flex: 1 }}
            onChange={onDateChange}
            dateIncludes={dateIncludes}
            selectedDate={date}
            toLocaleStringOptions={{ dateStyle: 'long' }}
            animate={true}
            transparencyMode={EnhancedSelectorTransparencyMode.selection}
            focusRingMode={EnhancedSelectorFocusRingMode.transparentOnly}
          />
          <div style={{ margin: '0 10px' }}>
            <Dropdown
              rgOptions={[
                { label: 'By Day', data: DateIncludes.dayMonthYear },
                { label: 'By Month', data: DateIncludes.monthYear },
                { label: 'By Year', data: DateIncludes.yearOnly }
              ]}
              selectedOption={dateIncludes}
              onChange={option => setDateIncludes(option.data)}
            />
          </div>
          <div>
            <Dropdown rgOptions={[{ label: 'Earliest', data: 'above' }, { label: 'Latest', data: 'below' }]} selectedOption={thresholdType} onChange={onThreshTypeChange} />
          </div>
        </Focusable>}
    />
  );
};

/**
 * The options for a time played filter.
 */
const LastPlayedFilterOptions: VFC<FilterOptionsProps<'last played'>> = ({ index, setContainingGroupFilters, filter, containingGroupFilters }) => {
  const [date, setDate] = useState<DateObj | undefined>(filter.params.date);
  const [dateIncludes, setDateIncludes] = useState<DateIncludes>(filter.params.date ? (filter.params.date.day === undefined ? (filter.params.date.month === undefined ? DateIncludes.yearOnly : DateIncludes.monthYear) : DateIncludes.dayMonthYear) : DateIncludes.dayMonthYear);
  const [thresholdType, setThresholdType] = useState<ThresholdCondition>(filter.params.condition);

  function onDateChange(dateSelection: DateSelection) {
    const updatedFilter = { ...filter };
    updatedFilter.params.date = dateSelection.data;
    const updatedFilters = [...containingGroupFilters];
    updatedFilters[index] = updatedFilter;
    setContainingGroupFilters(updatedFilters);
    setDate(dateSelection.data);
  }

  function onThreshTypeChange({ data: threshType }: { data: ThresholdCondition; }) {
    const updatedFilter = { ...filter };
    updatedFilter.params.condition = threshType;
    const updatedFilters = [...containingGroupFilters];
    updatedFilters[index] = updatedFilter;
    setContainingGroupFilters(updatedFilters);
    setThresholdType(threshType);
  }

  return (
    <Field label={`Last played ${dateIncludes === DateIncludes.dayMonthYear ? 'on' : 'in'} or ${thresholdType === 'above' ? 'after' : 'before'}...`}
      description={
        <Focusable style={{ display: 'flex', flexDirection: 'row' }}>
          <DatePicker
            focusDropdowns={true}
            modalType='simple'
            buttonContainerStyle={{ flex: 1 }}
            onChange={onDateChange}
            dateIncludes={dateIncludes}
            selectedDate={date}
            toLocaleStringOptions={{ dateStyle: 'long' }}
            animate={true}
            transparencyMode={EnhancedSelectorTransparencyMode.selection}
            focusRingMode={EnhancedSelectorFocusRingMode.transparentOnly}
          />
          <div style={{ margin: '0 10px' }}>
            <Dropdown
              rgOptions={[
                { label: 'By Day', data: DateIncludes.dayMonthYear },
                { label: 'By Month', data: DateIncludes.monthYear },
                { label: 'By Year', data: DateIncludes.yearOnly }
              ]}
              selectedOption={dateIncludes}
              onChange={option => setDateIncludes(option.data)}
            />
          </div>
          <div>
            <Dropdown rgOptions={[{ label: 'Earliest', data: 'above' }, { label: 'Latest', data: 'below' }]} selectedOption={thresholdType} onChange={onThreshTypeChange} />
          </div>
        </Focusable>}
    />
  );
};

/**
 * The options for an individual filter.
 */
export const FilterOptions: VFC<FilterOptionsProps<FilterType>> = ({ index, filter, containingGroupFilters, setContainingGroupFilters }) => {
  if (filter) {
    switch (filter.type) {
      case "collection":
        return <CollectionFilterOptions index={index} filter={filter as TabFilterSettings<'collection'>} containingGroupFilters={containingGroupFilters} setContainingGroupFilters={setContainingGroupFilters} />;
      case "installed":
        return <InstalledFilterOptions index={index} filter={filter as TabFilterSettings<'installed'>} containingGroupFilters={containingGroupFilters} setContainingGroupFilters={setContainingGroupFilters} />;
      case "regex":
        return <RegexFilterOptions index={index} filter={filter as TabFilterSettings<'regex'>} containingGroupFilters={containingGroupFilters} setContainingGroupFilters={setContainingGroupFilters} />;
      case "friends":
        return <FriendsFilterOptions index={index} filter={filter as TabFilterSettings<'friends'>} containingGroupFilters={containingGroupFilters} setContainingGroupFilters={setContainingGroupFilters} />;
      case "tags":
        return <TagsFilterOptions index={index} filter={filter as TabFilterSettings<'tags'>} containingGroupFilters={containingGroupFilters} setContainingGroupFilters={setContainingGroupFilters} />;
      case "whitelist":
        return <WhitelistFilterOptions index={index} filter={filter as TabFilterSettings<'whitelist'>} containingGroupFilters={containingGroupFilters} setContainingGroupFilters={setContainingGroupFilters} />;
      case "blacklist":
        return <BlackListFilterOptions index={index} filter={filter as TabFilterSettings<'blacklist'>} containingGroupFilters={containingGroupFilters} setContainingGroupFilters={setContainingGroupFilters} />;
      case "merge":
        return <MergeFilterOptions index={index} filter={filter as TabFilterSettings<'merge'>} containingGroupFilters={containingGroupFilters} setContainingGroupFilters={setContainingGroupFilters} />;
      case "platform":
        return <PlatformFilterOptions index={index} filter={filter as TabFilterSettings<'platform'>} containingGroupFilters={containingGroupFilters} setContainingGroupFilters={setContainingGroupFilters} />;
      case "deck compatibility":
        return <DeckCompatFilterOptions index={index} filter={filter as TabFilterSettings<'deck compatibility'>} containingGroupFilters={containingGroupFilters} setContainingGroupFilters={setContainingGroupFilters} />;
      case "review score":
        return <ReviewScoreFilterOptions index={index} filter={filter as TabFilterSettings<'review score'>} containingGroupFilters={containingGroupFilters} setContainingGroupFilters={setContainingGroupFilters} />;
      case "time played":
        return <TimePlayedFilterOptions index={index} filter={filter as TabFilterSettings<'time played'>} containingGroupFilters={containingGroupFilters} setContainingGroupFilters={setContainingGroupFilters} />;
      case "size on disk":
        return <SizeOnDiskFilterOptions index={index} filter={filter as TabFilterSettings<'size on disk'>} containingGroupFilters={containingGroupFilters} setContainingGroupFilters={setContainingGroupFilters} />;
      case "release date":
        return <ReleaseDateFilterOptions index={index} filter={filter as TabFilterSettings<'release date'>} containingGroupFilters={containingGroupFilters} setContainingGroupFilters={setContainingGroupFilters} />;
      case "last played":
        return <LastPlayedFilterOptions index={index} filter={filter as TabFilterSettings<'last played'>} containingGroupFilters={containingGroupFilters} setContainingGroupFilters={setContainingGroupFilters} />;
      default:
        return <Fragment />;
    }
  } else {
    return <Fragment />;
  }
};
