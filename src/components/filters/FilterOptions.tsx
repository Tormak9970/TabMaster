import {
    ButtonItem,
    Dropdown,
    DropdownOption,
    Field,
    Focusable,
    SingleDropdownOption,
    TextField,
    ToggleField,
    showModal,
} from '@decky/ui'
import React, { VFC, Fragment, useState, useMemo } from 'react'
import { FaTag, FaTags, FaUser, FaCompactDisc, FaListCheck, FaSteam, FaStar, FaFolder } from 'react-icons/fa6'
import { FaUserFriends, FaQuestionCircle } from 'react-icons/fa'
import { MdApps } from 'react-icons/md'
import { IoGameController, IoGrid } from 'react-icons/io5'
import { BsWindow } from 'react-icons/bs'
import { IconType } from 'react-icons/lib'

import {
    FilterType,
    ReviewScoreType,
    SdCardParamType,
    TabFilterSettings,
    ThresholdCondition,
    TimeUnit,
    compatCategoryToLabel,
    steamOSCompatCategoryToLabel,
} from './Filters'
import { TabMasterContextProvider, useTabMasterContext } from '../../state/TabMasterContext'
import { ModeMultiSelect } from '../multi-selects/ModeMultiSelect'
import { EditMergeFilterModal } from '../modals/EditMergeFilterModal'
import { MultiSelect } from '../multi-selects/MultiSelect'
import { FilterPreview } from './FilterPreview'
import { DateIncludes, DateObj, DatePicker, DateSelection } from '../generic/DatePickers'
import { EnhancedSelectorFocusRingMode, EnhancedSelectorTransparencyMode } from '../generic/EnhancedSelector'
import { IncludeCategories } from '../../lib/Utils'
import { Slider } from '../generic/Slider'
import { STEAM_FEATURES_ID_MAP, STEAM_FEATURES_TO_RENDER } from './SteamFeatures'
import { MicroSDeckInterop } from '../../lib/controllers/MicroSDeckInterop'
import { ListSearchDropdown } from '../modals/ListSearchModal'
import t from '../../utils/i18n'
import {
    getLogicalMode,
    getReviewScoreFilterLabel,
    getLeastMostThresholdOptions,
    getTimeOptions,
    getTimePlayed,
    getEarlyLateThresholdOptions,
    getTimeframeOptions,
    getDateFilterDisplayData,
    getAchievementDisplayData,
    getAchievementOptions,
    getSizeOnDiskDisplayData,
} from '../../utils/translationHelpers'

type FilterOptionsProps<T extends FilterType> = {
    index: number
    filter: TabFilterSettings<T>
    containingGroupFilters: TabFilterSettings<FilterType>[]
    setContainingGroupFilters: React.Dispatch<React.SetStateAction<TabFilterSettings<FilterType>[]>>
}

/**
 * Gets an entry icon for an app based on its type.
 * @param entry The app entry.
 * @returns The icon for the app.
 */
function getAppIconType(entry: any): IconType {
    switch (entry.data.appType) {
        case IncludeCategories.games:
            return IoGameController
        case IncludeCategories.music:
            return FaCompactDisc
        case IncludeCategories.software:
            return BsWindow
        default:
            return FaQuestionCircle
    }
}

/**
 * Gets an entry icon for a collection based on if its user made.
 * @param entry The collection entry.
 * @returns The icon for the collection.
 */
function getCollectionIcon(entry: any): IconType {
    const collection = collectionStore.userCollections.find(
        (collection: SteamCollection) => collection.id === entry.data
    )
    if (collection?.bIsEditable) {
        return FaUser
    } else {
        return FaSteam
    }
}

/**
 * The options for a collection filter.
 */
const CollectionFilterOptions: VFC<FilterOptionsProps<'collection'>> = ({
    index,
    setContainingGroupFilters,
    filter,
    containingGroupFilters,
}) => {
    const collectionDropdownOptions: SingleDropdownOption[] = collectionStore.userCollections
        .concat([{ displayName: t('GameList_Category_Hidden', 'Hidden', true), id: 'hidden' }] as any)
        .map((collection: SteamCollection) => {
            return {
                label: collection.displayName,
                data: collection.id,
            }
        })

    function onChange(data: SingleDropdownOption) {
        const updatedFilter = { ...filter }
        updatedFilter.params.id = data.data
        updatedFilter.params.name = data.label as string
        const updatedFilters = [...containingGroupFilters]
        updatedFilters[index] = updatedFilter
        setContainingGroupFilters(updatedFilters)
    }

    return (
        <Field
            label={t('LABEL_SELECTED_COLLECTION', 'Selected Collection')}
            description={
                <ListSearchDropdown
                    entryLabel={t('LibraryTab_Collections', 'Collections', true)}
                    rgOptions={collectionDropdownOptions}
                    selectedOption={filter.params.id}
                    onChange={onChange}
                    TriggerIcon={IoGrid}
                    determineEntryIcon={getCollectionIcon}
                />
            }
        />
    )
}

/**
 * The options for an installed filter.
 */
const InstalledFilterOptions: VFC<FilterOptionsProps<'installed'>> = ({
    index,
    setContainingGroupFilters,
    filter,
    containingGroupFilters,
}) => {
    function onChange(checked: boolean) {
        const updatedFilter = { ...filter }
        updatedFilter.params.installed = checked ?? false
        const updatedFilters = [...containingGroupFilters]
        updatedFilters[index] = updatedFilter
        setContainingGroupFilters(updatedFilters)
    }

    return (
        <ToggleField
            label={t('LABEL_IS_INSTALLED', 'Is installed?')}
            checked={filter.params.installed}
            onChange={onChange}
        />
    )
}

/**
 * The options for a regex filter.
 */
const RegexFilterOptions: VFC<FilterOptionsProps<'regex'>> = ({
    index,
    setContainingGroupFilters,
    filter,
    containingGroupFilters,
}) => {
    function onChange(e: React.ChangeEvent<HTMLInputElement>) {
        const updatedFilter = { ...filter }
        updatedFilter.params.regex = e?.target.value
        const updatedFilters = [...containingGroupFilters]
        updatedFilters[index] = updatedFilter
        setContainingGroupFilters(updatedFilters)
    }

    return (
        <Field
            label='Regex'
            description={
                <TextField
                    value={filter.params.regex}
                    placeholder={t('PLACEHOLDER_REGULAR_EXPRESSION', 'Input a Regular Expression')}
                    onChange={onChange}
                />
            }
        />
    )
}

/**
 * The options for a friends filter.
 */
const FriendsFilterOptions: VFC<FilterOptionsProps<'friends'>> = ({
    index,
    setContainingGroupFilters,
    filter,
    containingGroupFilters,
}) => {
    const { currentUsersFriends } = useTabMasterContext()

    const dropdownOptions: DropdownOption[] = currentUsersFriends
        .sort((friendA: FriendEntry, friendB: FriendEntry) => friendA.name.localeCompare(friendB.name))
        .map((friend: FriendEntry) => {
            return { label: friend.name, data: friend.steamid }
        })
    const selected: DropdownOption[] = filter.params.friends.map((id: number) => {
        return {
            label: currentUsersFriends.find(friend => friend.steamid === id)!.name,
            data: id,
        }
    })
    const friendsMode = filter.params.mode

    function onChange(selected: DropdownOption[], mode: LogicalMode) {
        const updatedFilter = { ...filter }
        updatedFilter.params.friends = selected.map(friendEntry => friendEntry.data as number)
        updatedFilter.params.mode = mode
        const updatedFilters = [...containingGroupFilters]
        updatedFilters[index] = updatedFilter
        setContainingGroupFilters(updatedFilters)
    }

    return (
        <ModeMultiSelect
            fieldLabel={t('LABEL_SELECTED_FRIENDS', 'Selected Friends')}
            dropdownLabel={t('LABEL_FRIENDS_OPTIONS_ADD_FRIEND', 'Add a friend')}
            mode={friendsMode}
            options={dropdownOptions}
            selected={selected}
            onChange={onChange}
            entryLabel={t('LABEL_FRIENDS_PLURAL', 'friends')}
            EntryIcon={FaUser}
            TriggerIcon={FaUserFriends}
        />
    )
}

/**
 * The options for a tags filter.
 */
const TagsFilterOptions: VFC<FilterOptionsProps<'tags'>> = ({
    index,
    setContainingGroupFilters,
    filter,
    containingGroupFilters,
}) => {
    const { allStoreTags } = useTabMasterContext()

    const dropdownOptions: DropdownOption[] = allStoreTags
        .sort((tagA: TagResponse, tagB: TagResponse) => tagA.string!.localeCompare(tagB.string!))
        .map((storeTag: TagResponse) => {
            return { label: storeTag.string, data: storeTag.tag }
        })
    const selected: DropdownOption[] = filter.params.tags.map((tagNum: number) => {
        return {
            label: allStoreTags.find(tag => tag.tag === tagNum)!.string,
            data: tagNum,
        }
    })
    const tagsMode = filter.params.mode

    function onChange(selected: DropdownOption[], mode: LogicalMode) {
        const updatedFilter = { ...filter }
        updatedFilter.params.tags = selected.map(tagEntry => tagEntry.data as number)
        updatedFilter.params.mode = mode
        const updatedFilters = [...containingGroupFilters]
        updatedFilters[index] = updatedFilter
        setContainingGroupFilters(updatedFilters)
    }

    return (
        <ModeMultiSelect
            fieldLabel={t('LABEL_SELECTED_TAGS', 'Selected Tags')}
            dropdownLabel={t('LABEL_TAGS_OPTIONS_ADD_TAG', 'Add a tag')}
            mode={tagsMode}
            options={dropdownOptions}
            selected={selected}
            onChange={onChange}
            entryLabel={t('LABEL_TAGS_PLURAL', 'tags')}
            EntryIcon={FaTag}
            TriggerIcon={FaTags}
        />
    )
}

/**
 * The options for a whitelist filter.
 */
const WhitelistFilterOptions: VFC<FilterOptionsProps<'whitelist'>> = ({
    index,
    setContainingGroupFilters,
    filter,
    containingGroupFilters,
}) => {
    let appsList: SteamAppOverview[] = []
    const selected: DropdownOption[] = []
    const types = ['games', 'music', 'software']

    for (const type of types) {
        appsList = appsList.concat(
            collectionStore.appTypeCollectionMap.get(`type-${type as 'games' | 'music' | 'software'}`)!.allApps
        )
    }

    for (const gameid of filter.params.games) {
        const game = appsList.find(game => game.appid === gameid)

        if (game) selected.push({ label: game.display_name, data: { appid: game.appid, appType: game.app_type } })
    }

    const dropdownOptions: DropdownOption[] = appsList.map((game: SteamAppOverview) => {
        return { label: game.display_name, data: { appid: game.appid, appType: game.app_type } }
    })

    function onChange(selected: DropdownOption[]) {
        const updatedFilter = { ...filter }
        updatedFilter.params.games = selected.map(gameEntry => gameEntry.data.appid as number)
        const updatedFilters = [...containingGroupFilters]
        updatedFilters[index] = updatedFilter
        setContainingGroupFilters(updatedFilters)
    }

    return (
        <MultiSelect
            fieldLabel={t('LABEL_WHITELISTED_APPS', 'Whitelisted Apps')}
            dropdownLabel={t('LABEL_ADD_APP', 'Add an app')}
            options={dropdownOptions}
            selected={selected}
            onChange={onChange}
            entryLabel={t('LABEL_YOUR_APPS', 'Your Apps')}
            determineEntryIcon={getAppIconType}
            TriggerIcon={MdApps}
        />
    )
}

/**
 * The options for a blacklist filter.
 */
const BlackListFilterOptions: VFC<FilterOptionsProps<'blacklist'>> = ({
    index,
    setContainingGroupFilters,
    filter,
    containingGroupFilters,
}) => {
    let appsList: SteamAppOverview[] = []
    const selected: DropdownOption[] = []
    const types = ['games', 'music', 'software']

    for (const type of types) {
        appsList = appsList.concat(
            collectionStore.appTypeCollectionMap.get(`type-${type as 'games' | 'music' | 'software'}`)!.allApps
        )
    }

    for (const gameid of filter.params.games) {
        const game = appsList.find(game => game.appid === gameid)

        if (game) selected.push({ label: game.display_name, data: { appid: game.appid, appType: game.app_type } })
    }

    const dropdownOptions: DropdownOption[] = appsList.map((game: SteamAppOverview) => {
        return { label: game.display_name, data: { appid: game.appid, appType: game.app_type } }
    })

    function onChange(selected: DropdownOption[]) {
        const updatedFilter = { ...filter }
        updatedFilter.params.games = selected.map(gameEntry => gameEntry.data.appid as number)
        const updatedFilters = [...containingGroupFilters]
        updatedFilters[index] = updatedFilter
        setContainingGroupFilters(updatedFilters)
    }

    return (
        <MultiSelect
            fieldLabel={t('LABEL_BLACKLISTED_APPS', 'Blacklisted Apps')}
            dropdownLabel={t('LABEL_ADD_APP', 'Add an app')}
            options={dropdownOptions}
            selected={selected}
            onChange={onChange}
            entryLabel={t('LABEL_YOUR_APPS', 'Your Apps')}
            determineEntryIcon={getAppIconType}
            TriggerIcon={MdApps}
        />
    )
}

/**
 * The options for a merge filter.
 */
const MergeFilterOptions: VFC<FilterOptionsProps<'merge'>> = ({
    index,
    filter,
    containingGroupFilters,
    setContainingGroupFilters,
}) => {
    const tabMasterManager = useTabMasterContext().tabMasterManager
    const initialParams = {
        filters: [...filter.params.filters],
        mode: filter.params.mode,
    }

    const [isEditing, setIsEditing] = useState<boolean>(filter.params.filters.length !== 0)
    const [mergeParams, setMergeParams] = useState<TabFilterSettings<'merge'>['params']>(initialParams)

    function saveMerge(mergeParams: TabFilterSettings<'merge'>['params']) {
        const updatedFilter = { ...filter }
        updatedFilter.params.filters = mergeParams.filters
        updatedFilter.params.mode = mergeParams.mode

        const updatedFilters = [...containingGroupFilters]
        updatedFilters[index] = updatedFilter

        setIsEditing(true)
        setMergeParams({ ...mergeParams })
        setContainingGroupFilters(updatedFilters)
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
                    isEditing={isEditing}
                />
            </TabMasterContextProvider>
        )
    }

    return (
        <Focusable className='styled-btn'>
            <ButtonItem onClick={onClick}>
                {(isEditing ? t('LABEL_EDIT', 'Edit') : t('LABEL_CREATE', 'Create')) +
                    ' ' +
                    t('TITLE_MERGE_GROUP', 'Merge Group')}
            </ButtonItem>
            <div style={{ marginTop: '7px' }}>
                <b>{t('LABEL_MERGE_MODE', 'Merge Mode')}</b> - {getLogicalMode(mergeParams.mode)}
            </div>
            <div style={{ marginTop: '7px', fontWeight: 'bold' }}>{t('TITLE_FILTERS', 'Filters')}:</div>
            <div className='merge-filter-entries'>
                {mergeParams.filters.map(filter => (
                    <div style={{ marginTop: '3px' }}>
                        <FilterPreview filter={filter} />
                    </div>
                ))}
            </div>
        </Focusable>
    )
}

/**
 * The options for a platform filter.
 */
const PlatformFilterOptions: VFC<FilterOptionsProps<'platform'>> = ({
    index,
    setContainingGroupFilters,
    filter,
    containingGroupFilters,
}) => {
    const dropdownOptions: DropdownOption[] = [
        { label: 'Steam', data: 'steam' },
        { label: t('LibraryTab_NonSteam', 'Non Steam', true), data: 'nonSteam' },
    ]

    function onChange(selected: DropdownOption) {
        const updatedFilter = { ...filter }
        updatedFilter.params.platform = selected.data
        const updatedFilters = [...containingGroupFilters]
        updatedFilters[index] = updatedFilter
        setContainingGroupFilters(updatedFilters)
    }

    return (
        <Field
            label={t('LABEL_SELECTED_PLATFORM', 'Selected Platform')}
            description={
                <Dropdown
                    rgOptions={dropdownOptions}
                    selectedOption={(filter as TabFilterSettings<'platform'>).params.platform}
                    onChange={onChange}
                />
            }
        />
    )
}

/**
 * The options for a deck compatibility filter.
 */
const DeckCompatFilterOptions: VFC<FilterOptionsProps<'deck compatibility'>> = ({
    index,
    setContainingGroupFilters,
    filter,
    containingGroupFilters,
}) => {
    const dropdownOptions: DropdownOption[] = [0, 1, 2, 3].map(level => {
        return { label: compatCategoryToLabel(level), data: level }
    })

    function onChange(selected: DropdownOption) {
        const updatedFilter = { ...filter }
        updatedFilter.params.category = selected.data
        const updatedFilters = [...containingGroupFilters]
        updatedFilters[index] = updatedFilter
        setContainingGroupFilters(updatedFilters)
    }

    return (
        <Field
            label={t('LABEL_SELECTED_COMPATIBILITY', 'Selected Compatibility')}
            description={
                <Dropdown
                    rgOptions={dropdownOptions}
                    selectedOption={(filter as TabFilterSettings<'deck compatibility'>).params.category}
                    onChange={onChange}
                />
            }
        />
    )
}

/**
 * The options for a deck compatibility filter.
 */
const SteamOSCompatFilterOptions: VFC<FilterOptionsProps<'steamos compatibility'>> = ({
    index,
    setContainingGroupFilters,
    filter,
    containingGroupFilters,
}) => {
    const dropdownOptions: DropdownOption[] = [0, 1, 2].map(level => {
        return { label: steamOSCompatCategoryToLabel(level), data: level }
    })

    function onChange(selected: DropdownOption) {
        const updatedFilter = { ...filter }
        updatedFilter.params.category = selected.data
        const updatedFilters = [...containingGroupFilters]
        updatedFilters[index] = updatedFilter
        setContainingGroupFilters(updatedFilters)
    }

    return (
        <Field
            label={t('LABEL_SELECTED_COMPATIBILITY', 'Selected Compatibility')}
            description={
                <Dropdown
                    rgOptions={dropdownOptions}
                    selectedOption={(filter as TabFilterSettings<'steamos compatibility'>).params.category}
                    onChange={onChange}
                />
            }
        />
    )
}

/**
 * The options for a review score filter.
 */
const ReviewScoreFilterOptions: VFC<FilterOptionsProps<'review score'>> = ({
    index,
    setContainingGroupFilters,
    filter,
    containingGroupFilters,
}) => {
    const [value, setValue] = useState<number>(filter.params.scoreThreshold)
    const [thresholdType, setThresholdType] = useState<ThresholdCondition>(filter.params.condition)
    const [reviewType, setReviewType] = useState<ReviewScoreType>(filter.params.type)

    function updateFilter(threshold: number, threshType: ThresholdCondition, scoreType: ReviewScoreType) {
        const updatedFilter = { ...filter }
        updatedFilter.params.scoreThreshold = threshold
        updatedFilter.params.condition = threshType
        updatedFilter.params.type = scoreType
        const updatedFilters = [...containingGroupFilters]
        updatedFilters[index] = updatedFilter
        setContainingGroupFilters(updatedFilters)
    }

    function onSliderChange(value: number) {
        updateFilter(value, thresholdType, reviewType)
        setValue(value)
    }

    function onThreshTypeChange({ data: threshType }: { data: ThresholdCondition }) {
        updateFilter(value, threshType, reviewType)
        setThresholdType(threshType)
    }

    function onReviewTypeChange({ data: type }: { data: ReviewScoreType }) {
        updateFilter(value, thresholdType, type)
        setReviewType(type)
    }

    return (
        <Field
            label={getReviewScoreFilterLabel(value, thresholdType, reviewType)}
            description={
                <Focusable style={{ display: 'flex', flexDirection: 'row' }}>
                    <Slider value={value} min={0} max={100} onChange={onSliderChange} />
                    <div style={{ marginLeft: '12px', marginRight: '10px' }}>
                        <Dropdown
                            rgOptions={[
                                { label: 'Metacritic', data: 'metacritic' },
                                { label: 'Steam ', data: 'steampercent' },
                            ]}
                            selectedOption={reviewType}
                            onChange={onReviewTypeChange}
                        />
                    </div>
                    <div>
                        <Dropdown
                            rgOptions={getLeastMostThresholdOptions()}
                            selectedOption={thresholdType}
                            onChange={onThreshTypeChange}
                        />
                    </div>
                </Focusable>
            }
        />
    )
}

/**
 * The options for a time played filter.
 */
const TimePlayedFilterOptions: VFC<FilterOptionsProps<'time played'>> = ({
    index,
    setContainingGroupFilters,
    filter,
    containingGroupFilters,
}) => {
    const [time, setTime] = useState<number>(filter.params.timeThreshold)
    const [units, setUnits] = useState<TimeUnit>(filter.params.units)
    const [thresholdType, setThresholdType] = useState<ThresholdCondition>(filter.params.condition)

    function updateFilter(threshold: number, threshType: ThresholdCondition, units: TimeUnit) {
        const updatedFilter = { ...filter }
        updatedFilter.params.timeThreshold = threshold
        updatedFilter.params.condition = threshType
        updatedFilter.params.units = units
        const updatedFilters = [...containingGroupFilters]
        updatedFilters[index] = updatedFilter
        setContainingGroupFilters(updatedFilters)
    }

    function onSliderChange(value: number) {
        updateFilter(value, thresholdType, units)
        setTime(value)
    }

    function onUnitChange({ data: units }: { data: TimeUnit }) {
        updateFilter(time, thresholdType, units)
        setUnits(units)
    }

    function onThreshTypeChange({ data: threshType }: { data: ThresholdCondition }) {
        updateFilter(time, threshType, units)
        setThresholdType(threshType)
    }

    return (
        <Field
            label={getTimePlayed(time, thresholdType, units)}
            description={
                <Focusable style={{ display: 'flex', flexDirection: 'row' }}>
                    <Slider value={time} min={0} max={300} onChange={onSliderChange} />
                    <div style={{ marginLeft: '12px', marginRight: '10px' }}>
                        <Dropdown rgOptions={getTimeOptions()} selectedOption={units} onChange={onUnitChange} />
                    </div>
                    <div>
                        <Dropdown
                            rgOptions={getLeastMostThresholdOptions()}
                            selectedOption={thresholdType}
                            onChange={onThreshTypeChange}
                        />
                    </div>
                </Focusable>
            }
        />
    )
}

/**
 * The options for a size on disk filter.
 */
const SizeOnDiskFilterOptions: VFC<FilterOptionsProps<'size on disk'>> = ({
    index,
    setContainingGroupFilters,
    filter,
    containingGroupFilters,
}) => {
    const [value, setValue] = useState<string>(filter.params.gbThreshold.toString())
    const [numericValue, setNumericValue] = useState<number>(filter.params.gbThreshold)
    const [thresholdType, setThresholdType] = useState<ThresholdCondition>(filter.params.condition)

    function updateFilter(threshold: number, threshType: ThresholdCondition) {
        const updatedFilter = { ...filter }
        updatedFilter.params.gbThreshold = threshold
        updatedFilter.params.condition = threshType
        const updatedFilters = [...containingGroupFilters]
        updatedFilters[index] = updatedFilter
        setContainingGroupFilters(updatedFilters)
    }

    function onSliderChange(e: React.ChangeEvent<HTMLInputElement>) {
        let parsedValue = 0
        if (e?.target.value !== '' && !isNaN(parseFloat(e?.target.value))) {
            parsedValue = parseFloat(e?.target.value)
        }

        updateFilter(parsedValue, thresholdType)
        setNumericValue(parsedValue)

        setValue(e?.target.value)
    }

    function onThreshTypeChange({ data: threshType }: { data: ThresholdCondition }) {
        updateFilter(numericValue, threshType)
        setThresholdType(threshType)
    }

    return (
        <Field
            label={getSizeOnDiskDisplayData(numericValue, thresholdType)}
            description={
                <Focusable style={{ display: 'flex', flexDirection: 'row' }} className='size-on-disk-row'>
                    <TextField value={value} onChange={onSliderChange} />
                    <div style={{ marginLeft: '12px' }}>
                        <Dropdown
                            rgOptions={getLeastMostThresholdOptions()}
                            selectedOption={thresholdType}
                            onChange={onThreshTypeChange}
                        />
                    </div>
                </Focusable>
            }
        />
    )
}

/**
 * The options for a release date filter.
 */
const ReleaseDateFilterOptions: VFC<FilterOptionsProps<'release date'>> = ({
    index,
    setContainingGroupFilters,
    filter,
    containingGroupFilters,
}) => {
    const [date, setDate] = useState<DateObj | undefined>(filter.params.date)
    const [dateIncludes, setDateIncludes] = useState<DateIncludes>(
        filter.params.date
            ? filter.params.date.day === undefined
                ? filter.params.date.month === undefined
                    ? DateIncludes.yearOnly
                    : DateIncludes.monthYear
                : DateIncludes.dayMonthYear
            : DateIncludes.dayMonthYear
    )
    const [thresholdType, setThresholdType] = useState<ThresholdCondition>(filter.params.condition)
    const [byDaysAgo, setByDaysAgo] = useState(filter.params.daysAgo !== undefined)
    const [daysAgo, setDaysAgo] = useState<number>(filter.params.daysAgo ?? 30)

    function onDateChange(dateSelection: DateSelection) {
        const updatedFilter = { ...filter }
        updatedFilter.params.date = dateSelection.data
        const updatedFilters = [...containingGroupFilters]
        updatedFilters[index] = updatedFilter
        setContainingGroupFilters(updatedFilters)
        setDate(dateSelection.data)
    }

    function onThreshTypeChange({ data: threshType }: { data: ThresholdCondition }) {
        const updatedFilter = { ...filter }
        updatedFilter.params.condition = threshType
        const updatedFilters = [...containingGroupFilters]
        updatedFilters[index] = updatedFilter
        setContainingGroupFilters(updatedFilters)
        setThresholdType(threshType)
    }

    function onByDaysAgoChange(byDaysAgo: boolean) {
        const updatedFilter = { ...filter }
        if (byDaysAgo) {
            delete updatedFilter.params.date
            updatedFilter.params.daysAgo = daysAgo
        } else {
            delete updatedFilter.params.daysAgo
            updatedFilter.params.date = date
        }
        const updatedFilters = [...containingGroupFilters]
        updatedFilters[index] = updatedFilter
        setContainingGroupFilters(updatedFilters)
        setByDaysAgo(byDaysAgo)
    }

    function onSliderChange(value: number) {
        const updatedFilter = { ...filter }
        updatedFilter.params.daysAgo = value
        const updatedFilters = [...containingGroupFilters]
        updatedFilters[index] = updatedFilter
        setContainingGroupFilters(updatedFilters)
        setDaysAgo(value)
    }

    return (
        <Field
            label={getDateFilterDisplayData('release date', date, daysAgo, thresholdType)}
            description={
                <Focusable style={{ display: 'flex', flexDirection: 'row' }}>
                    {byDaysAgo ? (
                        <Slider value={daysAgo} min={0} max={3000} onChange={onSliderChange} />
                    ) : (
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
                    )}
                    <div style={{ margin: '0 10px' }}>
                        <Dropdown
                            rgOptions={getTimeframeOptions()}
                            selectedOption={dateIncludes}
                            onChange={option => {
                                if (option.data === 'byDaysAgo') {
                                    onByDaysAgoChange(true)
                                } else {
                                    if (byDaysAgo) onByDaysAgoChange(false)
                                    setDateIncludes(option.data)
                                }
                            }}
                        />
                    </div>
                    <div>
                        <Dropdown
                            rgOptions={getEarlyLateThresholdOptions()}
                            selectedOption={thresholdType}
                            onChange={onThreshTypeChange}
                        />
                    </div>
                </Focusable>
            }
        />
    )
}

/**
 * The options for a purchase date filter.
 */
const PurchaseDateFilterOptions: VFC<FilterOptionsProps<'purchase date'>> = ({
    index,
    setContainingGroupFilters,
    filter,
    containingGroupFilters,
}) => {
    const [date, setDate] = useState<DateObj | undefined>(filter.params.date)
    const [dateIncludes, setDateIncludes] = useState<DateIncludes>(
        filter.params.date
            ? filter.params.date.day === undefined
                ? filter.params.date.month === undefined
                    ? DateIncludes.yearOnly
                    : DateIncludes.monthYear
                : DateIncludes.dayMonthYear
            : DateIncludes.dayMonthYear
    )
    const [thresholdType, setThresholdType] = useState<ThresholdCondition>(filter.params.condition)
    const [byDaysAgo, setByDaysAgo] = useState(filter.params.daysAgo !== undefined)
    const [daysAgo, setDaysAgo] = useState<number>(filter.params.daysAgo ?? 30)

    function onDateChange(dateSelection: DateSelection) {
        const updatedFilter = { ...filter }
        updatedFilter.params.date = dateSelection.data
        const updatedFilters = [...containingGroupFilters]
        updatedFilters[index] = updatedFilter
        setContainingGroupFilters(updatedFilters)
        setDate(dateSelection.data)
    }

    function onThreshTypeChange({ data: threshType }: { data: ThresholdCondition }) {
        const updatedFilter = { ...filter }
        updatedFilter.params.condition = threshType
        const updatedFilters = [...containingGroupFilters]
        updatedFilters[index] = updatedFilter
        setContainingGroupFilters(updatedFilters)
        setThresholdType(threshType)
    }

    function onByDaysAgoChange(byDaysAgo: boolean) {
        const updatedFilter = { ...filter }
        if (byDaysAgo) {
            delete updatedFilter.params.date
            updatedFilter.params.daysAgo = daysAgo
        } else {
            delete updatedFilter.params.daysAgo
            updatedFilter.params.date = date
        }
        const updatedFilters = [...containingGroupFilters]
        updatedFilters[index] = updatedFilter
        setContainingGroupFilters(updatedFilters)
        setByDaysAgo(byDaysAgo)
    }

    function onSliderChange(value: number) {
        const updatedFilter = { ...filter }
        updatedFilter.params.daysAgo = value
        const updatedFilters = [...containingGroupFilters]
        updatedFilters[index] = updatedFilter
        setContainingGroupFilters(updatedFilters)
        setDaysAgo(value)
    }

    return (
        <Field
            label={getDateFilterDisplayData('purchase date', date, daysAgo, thresholdType)}
            description={
                <Focusable style={{ display: 'flex', flexDirection: 'row' }}>
                    {byDaysAgo ? (
                        <Slider value={daysAgo} min={0} max={3000} onChange={onSliderChange} />
                    ) : (
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
                    )}
                    <div style={{ margin: '0 10px' }}>
                        <Dropdown
                            rgOptions={getTimeframeOptions()}
                            selectedOption={dateIncludes}
                            onChange={option => {
                                if (option.data === 'byDaysAgo') {
                                    onByDaysAgoChange(true)
                                } else {
                                    if (byDaysAgo) onByDaysAgoChange(false)
                                    setDateIncludes(option.data)
                                }
                            }}
                        />
                    </div>
                    <div>
                        <Dropdown
                            rgOptions={getEarlyLateThresholdOptions()}
                            selectedOption={thresholdType}
                            onChange={onThreshTypeChange}
                        />
                    </div>
                </Focusable>
            }
        />
    )
}

/**
 * The options for a last played filter.
 */
const LastPlayedFilterOptions: VFC<FilterOptionsProps<'last played'>> = ({
    index,
    setContainingGroupFilters,
    filter,
    containingGroupFilters,
}) => {
    const [date, setDate] = useState<DateObj | undefined>(filter.params.date)
    const [dateIncludes, setDateIncludes] = useState<DateIncludes>(
        filter.params.date
            ? filter.params.date.day === undefined
                ? filter.params.date.month === undefined
                    ? DateIncludes.yearOnly
                    : DateIncludes.monthYear
                : DateIncludes.dayMonthYear
            : DateIncludes.dayMonthYear
    )
    const [thresholdType, setThresholdType] = useState<ThresholdCondition>(filter.params.condition)
    const [byDaysAgo, setByDaysAgo] = useState(filter.params.daysAgo !== undefined)
    const [daysAgo, setDaysAgo] = useState<number>(filter.params.daysAgo ?? 30)

    function onDateChange(dateSelection: DateSelection) {
        const updatedFilter = { ...filter }
        updatedFilter.params.date = dateSelection.data
        const updatedFilters = [...containingGroupFilters]
        updatedFilters[index] = updatedFilter
        setContainingGroupFilters(updatedFilters)
        setDate(dateSelection.data)
    }

    function onThreshTypeChange({ data: threshType }: { data: ThresholdCondition }) {
        const updatedFilter = { ...filter }
        updatedFilter.params.condition = threshType
        const updatedFilters = [...containingGroupFilters]
        updatedFilters[index] = updatedFilter
        setContainingGroupFilters(updatedFilters)
        setThresholdType(threshType)
    }

    function onByDaysAgoChange(byDaysAgo: boolean) {
        const updatedFilter = { ...filter }
        if (byDaysAgo) {
            delete updatedFilter.params.date
            updatedFilter.params.daysAgo = daysAgo
        } else {
            delete updatedFilter.params.daysAgo
            updatedFilter.params.date = date
        }
        const updatedFilters = [...containingGroupFilters]
        updatedFilters[index] = updatedFilter
        setContainingGroupFilters(updatedFilters)
        setByDaysAgo(byDaysAgo)
    }

    function onSliderChange(value: number) {
        const updatedFilter = { ...filter }
        updatedFilter.params.daysAgo = value
        const updatedFilters = [...containingGroupFilters]
        updatedFilters[index] = updatedFilter
        setContainingGroupFilters(updatedFilters)
        setDaysAgo(value)
    }

    return (
        <Field
            label={getDateFilterDisplayData('last played', date, daysAgo, thresholdType)}
            description={
                <Focusable style={{ display: 'flex', flexDirection: 'row' }}>
                    {byDaysAgo ? (
                        <Slider value={daysAgo} min={0} max={3000} onChange={onSliderChange} />
                    ) : (
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
                    )}
                    <div style={{ margin: '0 10px' }}>
                        <Dropdown
                            rgOptions={getTimeframeOptions()}
                            selectedOption={dateIncludes}
                            onChange={option => {
                                if (option.data === 'byDaysAgo') {
                                    onByDaysAgoChange(true)
                                } else {
                                    if (byDaysAgo) onByDaysAgoChange(false)
                                    setDateIncludes(option.data)
                                }
                            }}
                        />
                    </div>
                    <div>
                        <Dropdown
                            rgOptions={getEarlyLateThresholdOptions()}
                            selectedOption={thresholdType}
                            onChange={onThreshTypeChange}
                        />
                    </div>
                </Focusable>
            }
        />
    )
}

/**
 * The options for a family sharing filter.
 */
const FamilySharingFilterOptions: VFC<FilterOptionsProps<'family sharing'>> = ({
    index,
    setContainingGroupFilters,
    filter,
    containingGroupFilters,
}) => {
    function onChange(checked: boolean) {
        const updatedFilter = { ...filter }
        updatedFilter.params.isFamilyShared = checked ?? false
        const updatedFilters = [...containingGroupFilters]
        updatedFilters[index] = updatedFilter
        setContainingGroupFilters(updatedFilters)
    }

    return (
        <ToggleField
            label={t('LABEL_FAMILY_SHARING_OPTION', 'Is from a family member?')}
            checked={filter.params.isFamilyShared}
            onChange={onChange}
        />
    )
}

/**
 * The options for a demo filter.
 */
const DemoFilterOptions: VFC<FilterOptionsProps<'demo'>> = ({
    index,
    setContainingGroupFilters,
    filter,
    containingGroupFilters,
}) => {
    function onChange(checked: boolean) {
        const updatedFilter = { ...filter }
        updatedFilter.params.isDemo = checked ?? false
        const updatedFilters = [...containingGroupFilters]
        updatedFilters[index] = updatedFilter
        setContainingGroupFilters(updatedFilters)
    }

    return (
        <ToggleField label={t('LABEL_IS_DEMO_OPTION', 'Is demo?')} checked={filter.params.isDemo} onChange={onChange} />
    )
}

/**
 * The options for a coming soon filter.
 */
const ComingSoonFilterOptions: VFC<FilterOptionsProps<'coming soon'>> = ({
    index,
    setContainingGroupFilters,
    filter,
    containingGroupFilters,
}) => {
    function onChange(checked: boolean) {
        const updatedFilter = { ...filter }
        updatedFilter.params.isComingSoon = checked ?? false
        const updatedFilters = [...containingGroupFilters]
        updatedFilters[index] = updatedFilter
        setContainingGroupFilters(updatedFilters)
    }

    return (
        <ToggleField
            label={t('LABEL_IS_COMING_SOON', 'Is Coming Soon?')}
            checked={filter.params.isComingSoon}
            onChange={onChange}
        />
    )
}

/**
 * The options for a streamable filter.
 */
const StreamableFilterOptions: VFC<FilterOptionsProps<'streamable'>> = ({
    index,
    setContainingGroupFilters,
    filter,
    containingGroupFilters,
}) => {
    function onChange(checked: boolean) {
        const updatedFilter = { ...filter }
        updatedFilter.params.isStreamable = checked ?? false
        const updatedFilters = [...containingGroupFilters]
        updatedFilters[index] = updatedFilter
        setContainingGroupFilters(updatedFilters)
    }

    return (
        <ToggleField
            label={t('LABEL_IS_STREAMABLE_OPTION', 'Is streamable?')}
            checked={filter.params.isStreamable}
            onChange={onChange}
        />
    )
}

/**
 * The options for a cloud save filter.
 */
const SteamFeatureFilterOptions: VFC<FilterOptionsProps<'steam features'>> = ({
    index,
    setContainingGroupFilters,
    filter,
    containingGroupFilters,
}) => {
    const dropdownOptions: DropdownOption[] = STEAM_FEATURES_TO_RENDER.map((featureId: number) => {
        // @ts-ignore
        return { label: STEAM_FEATURES_ID_MAP[featureId.toString()].display_name, data: featureId }
    })
    const selected: DropdownOption[] = filter.params.features.map((featureId: number) => {
        return {
            // @ts-ignore
            label: STEAM_FEATURES_ID_MAP[featureId.toString()].display_name,
            data: featureId,
        }
    })
    const featuresMode = filter.params.mode

    function onChange(selected: DropdownOption[], mode: LogicalMode) {
        const updatedFilter = { ...filter }
        updatedFilter.params.features = selected.map(featureEntry => featureEntry.data as number)
        updatedFilter.params.mode = mode
        const updatedFilters = [...containingGroupFilters]
        updatedFilters[index] = updatedFilter
        setContainingGroupFilters(updatedFilters)
    }

    return (
        <ModeMultiSelect
            fieldLabel={t('LABEL_SELECTED_FEATURES', 'Selected Features')}
            dropdownLabel={t('LABEL_ADD_FEATURE', 'Add a feature')}
            mode={featuresMode}
            options={dropdownOptions}
            selected={selected}
            onChange={onChange}
            entryLabel={t('LABEL_FEATURE_PLURAL', 'features')}
            EntryIcon={FaSteam}
            TriggerIcon={FaListCheck}
        />
    )
}

/**
 * The options for a achievements filter.
 */
const AchievementsFilterOptions: VFC<FilterOptionsProps<'achievements'>> = ({
    index,
    setContainingGroupFilters,
    filter,
    containingGroupFilters,
}) => {
    const [value, setValue] = useState<number>(filter.params.threshold)
    const [thresholdType, setThresholdType] = useState<'percent' | 'count'>(filter.params.thresholdType)
    const [thresholdCondition, setThresholdCondition] = useState<ThresholdCondition>(filter.params.condition)

    function updateFilter(threshold: number, threshCondition: ThresholdCondition, threshType: 'percent' | 'count') {
        const updatedFilter = { ...filter }
        updatedFilter.params.threshold = threshold
        updatedFilter.params.condition = threshCondition
        updatedFilter.params.thresholdType = threshType
        const updatedFilters = [...containingGroupFilters]
        updatedFilters[index] = updatedFilter
        setContainingGroupFilters(updatedFilters)
    }

    function onSliderChange(value: number) {
        updateFilter(value, thresholdCondition, thresholdType)
        setValue(value)
    }

    function onThreshConditionChange({ data: threshCondition }: { data: ThresholdCondition }) {
        updateFilter(value, threshCondition, thresholdType)
        setThresholdCondition(threshCondition)
    }

    function onThreshTypeChange({ data: threshType }: { data: 'count' | 'percent' }) {
        updateFilter(value, thresholdCondition, threshType)
        setThresholdType(threshType)
    }

    let displayData = getAchievementDisplayData(thresholdCondition)

    return (
        <Field
            label={`${value}${thresholdType === 'percent' ? '%' : ''} ${displayData}`}
            description={
                <Focusable style={{ display: 'flex', flexDirection: 'row' }}>
                    <Slider value={value} min={0} max={100} onChange={onSliderChange} />
                    <div style={{ marginLeft: '12px' }}>
                        <Dropdown
                            rgOptions={getLeastMostThresholdOptions()}
                            selectedOption={thresholdCondition}
                            onChange={onThreshConditionChange}
                        />
                    </div>
                    <div style={{ marginLeft: '12px' }}>
                        <Dropdown
                            rgOptions={getAchievementOptions()}
                            selectedOption={thresholdType}
                            onChange={onThreshTypeChange}
                        />
                    </div>
                </Focusable>
            }
        />
    )
}

/**
 * The options for an sd card filter
 */
const SDCardFilterOptions: VFC<FilterOptionsProps<'sd card'>> = ({
    index,
    setContainingGroupFilters,
    filter,
    containingGroupFilters,
}) => {
    const isMicroSDeckInstalled = useMemo(() => MicroSDeckInterop.isInstallOk(), [])
    const cardsAndGames = window.MicroSDeck?.CardsAndGames || []
    const dropdownOptions: DropdownOption[] = [
        {
            label: t('LABEL_INSERTED_CARD', 'Inserted Card'),
            data: SdCardParamType.INSTALLED,
        },
        {
            label: t('LABEL_SPECIFIC_CARD', 'Specific Card'),
            options: cardsAndGames.map(([card]) => {
                return { label: card.name || card.uid, data: card.uid }
            }),
        },
        {
            label: t('LABEL_ANY_CARD', 'Any Card'),
            data: SdCardParamType.ANY,
        },
    ]

    function onChange({ data }: SingleDropdownOption) {
        const updatedFilter = { ...filter }
        updatedFilter.params.card = data
        const updatedFilters = [...containingGroupFilters]
        updatedFilters[index] = updatedFilter
        setContainingGroupFilters(updatedFilters)
    }

    return (
        <Field
            label={t('LABEL_MICROSD_CARD', 'Micro SD Card')}
            description={
                <Dropdown
                    rgOptions={dropdownOptions}
                    selectedOption={filter.params.card ?? SdCardParamType.INSTALLED}
                    onChange={onChange}
                    disabled={!isMicroSDeckInstalled}
                />
            }
        /> //^ back compat for undefined as installed card
    )
}

/**
 * The options for an installed folder filter.
 */
const InstallFolderFilterOptions: VFC<FilterOptionsProps<'install folder'>> = ({
    index,
    setContainingGroupFilters,
    filter,
    containingGroupFilters,
}) => {
    const collectionDropdownOptions: SingleDropdownOption[] = installFolderStore.AllInstallFolders.map(folder => {
        return {
            label: folder.strUserLabel || folder.strDriveName,
            data: folder.strDriveName,
        }
    })

    function onChange(data: SingleDropdownOption) {
        const updatedFilter = { ...filter }
        updatedFilter.params.driveName = data.data
        const updatedFilters = [...containingGroupFilters]
        updatedFilters[index] = updatedFilter
        setContainingGroupFilters(updatedFilters)
    }

    return (
        <Field
            label={t('LABEL_SELECT_INSTALL_FILTERS', 'Selected Install Folder')}
            description={
                <ListSearchDropdown
                    entryLabel={t('LABEL_INSTALL_FOLDERS', 'Install Folders')}
                    rgOptions={collectionDropdownOptions}
                    selectedOption={filter.params.driveName}
                    onChange={onChange}
                    TriggerIcon={IoGrid}
                    determineEntryIcon={entry => {
                        if (entry.bIsDefaultFolder) {
                            return FaStar
                        }

                        return FaFolder
                    }}
                />
            }
        />
    )
}

/**
 * The options for an individual filter.
 */
export const FilterOptions: VFC<FilterOptionsProps<FilterType>> = ({
    index,
    filter,
    containingGroupFilters,
    setContainingGroupFilters,
}) => {
    if (filter) {
        const filterCopy = { ...filter, params: { ...filter.params } }
        switch (filter.type) {
            case 'collection':
                return (
                    <CollectionFilterOptions
                        index={index}
                        filter={filterCopy as TabFilterSettings<'collection'>}
                        containingGroupFilters={containingGroupFilters}
                        setContainingGroupFilters={setContainingGroupFilters}
                    />
                )
            case 'installed':
                return (
                    <InstalledFilterOptions
                        index={index}
                        filter={filterCopy as TabFilterSettings<'installed'>}
                        containingGroupFilters={containingGroupFilters}
                        setContainingGroupFilters={setContainingGroupFilters}
                    />
                )
            case 'regex':
                return (
                    <RegexFilterOptions
                        index={index}
                        filter={filterCopy as TabFilterSettings<'regex'>}
                        containingGroupFilters={containingGroupFilters}
                        setContainingGroupFilters={setContainingGroupFilters}
                    />
                )
            case 'friends':
                return (
                    <FriendsFilterOptions
                        index={index}
                        filter={filterCopy as TabFilterSettings<'friends'>}
                        containingGroupFilters={containingGroupFilters}
                        setContainingGroupFilters={setContainingGroupFilters}
                    />
                )
            case 'tags':
                return (
                    <TagsFilterOptions
                        index={index}
                        filter={filterCopy as TabFilterSettings<'tags'>}
                        containingGroupFilters={containingGroupFilters}
                        setContainingGroupFilters={setContainingGroupFilters}
                    />
                )
            case 'whitelist':
                return (
                    <WhitelistFilterOptions
                        index={index}
                        filter={filterCopy as TabFilterSettings<'whitelist'>}
                        containingGroupFilters={containingGroupFilters}
                        setContainingGroupFilters={setContainingGroupFilters}
                    />
                )
            case 'blacklist':
                return (
                    <BlackListFilterOptions
                        index={index}
                        filter={filterCopy as TabFilterSettings<'blacklist'>}
                        containingGroupFilters={containingGroupFilters}
                        setContainingGroupFilters={setContainingGroupFilters}
                    />
                )
            case 'merge':
                return (
                    <MergeFilterOptions
                        index={index}
                        filter={filterCopy as TabFilterSettings<'merge'>}
                        containingGroupFilters={containingGroupFilters}
                        setContainingGroupFilters={setContainingGroupFilters}
                    />
                )
            case 'platform':
                return (
                    <PlatformFilterOptions
                        index={index}
                        filter={filterCopy as TabFilterSettings<'platform'>}
                        containingGroupFilters={containingGroupFilters}
                        setContainingGroupFilters={setContainingGroupFilters}
                    />
                )
            case 'deck compatibility':
                return (
                    <DeckCompatFilterOptions
                        index={index}
                        filter={filterCopy as TabFilterSettings<'deck compatibility'>}
                        containingGroupFilters={containingGroupFilters}
                        setContainingGroupFilters={setContainingGroupFilters}
                    />
                )
            case 'steamos compatibility':
                return (
                    <SteamOSCompatFilterOptions
                        index={index}
                        filter={filterCopy as TabFilterSettings<'steamos compatibility'>}
                        containingGroupFilters={containingGroupFilters}
                        setContainingGroupFilters={setContainingGroupFilters}
                    />
                )
            case 'review score':
                return (
                    <ReviewScoreFilterOptions
                        index={index}
                        filter={filterCopy as TabFilterSettings<'review score'>}
                        containingGroupFilters={containingGroupFilters}
                        setContainingGroupFilters={setContainingGroupFilters}
                    />
                )
            case 'time played':
                return (
                    <TimePlayedFilterOptions
                        index={index}
                        filter={filterCopy as TabFilterSettings<'time played'>}
                        containingGroupFilters={containingGroupFilters}
                        setContainingGroupFilters={setContainingGroupFilters}
                    />
                )
            case 'size on disk':
                return (
                    <SizeOnDiskFilterOptions
                        index={index}
                        filter={filterCopy as TabFilterSettings<'size on disk'>}
                        containingGroupFilters={containingGroupFilters}
                        setContainingGroupFilters={setContainingGroupFilters}
                    />
                )
            case 'release date':
                return (
                    <ReleaseDateFilterOptions
                        index={index}
                        filter={filterCopy as TabFilterSettings<'release date'>}
                        containingGroupFilters={containingGroupFilters}
                        setContainingGroupFilters={setContainingGroupFilters}
                    />
                )
            case 'purchase date':
                return (
                    <PurchaseDateFilterOptions
                        index={index}
                        filter={filterCopy as TabFilterSettings<'purchase date'>}
                        containingGroupFilters={containingGroupFilters}
                        setContainingGroupFilters={setContainingGroupFilters}
                    />
                )
            case 'last played':
                return (
                    <LastPlayedFilterOptions
                        index={index}
                        filter={filterCopy as TabFilterSettings<'last played'>}
                        containingGroupFilters={containingGroupFilters}
                        setContainingGroupFilters={setContainingGroupFilters}
                    />
                )
            case 'family sharing':
                return (
                    <FamilySharingFilterOptions
                        index={index}
                        filter={filterCopy as TabFilterSettings<'family sharing'>}
                        containingGroupFilters={containingGroupFilters}
                        setContainingGroupFilters={setContainingGroupFilters}
                    />
                )
            case 'demo':
                return (
                    <DemoFilterOptions
                        index={index}
                        filter={filterCopy as TabFilterSettings<'demo'>}
                        containingGroupFilters={containingGroupFilters}
                        setContainingGroupFilters={setContainingGroupFilters}
                    />
                )
            case 'coming soon':
                return (
                    <ComingSoonFilterOptions
                        index={index}
                        filter={filterCopy as TabFilterSettings<'coming soon'>}
                        containingGroupFilters={containingGroupFilters}
                        setContainingGroupFilters={setContainingGroupFilters}
                    />
                )
            case 'streamable':
                return (
                    <StreamableFilterOptions
                        index={index}
                        filter={filterCopy as TabFilterSettings<'streamable'>}
                        containingGroupFilters={containingGroupFilters}
                        setContainingGroupFilters={setContainingGroupFilters}
                    />
                )
            case 'steam features':
                return (
                    <SteamFeatureFilterOptions
                        index={index}
                        filter={filterCopy as TabFilterSettings<'steam features'>}
                        containingGroupFilters={containingGroupFilters}
                        setContainingGroupFilters={setContainingGroupFilters}
                    />
                )
            case 'achievements':
                return (
                    <AchievementsFilterOptions
                        index={index}
                        filter={filterCopy as TabFilterSettings<'achievements'>}
                        containingGroupFilters={containingGroupFilters}
                        setContainingGroupFilters={setContainingGroupFilters}
                    />
                )
            case 'sd card':
                return (
                    <SDCardFilterOptions
                        index={index}
                        filter={filterCopy as TabFilterSettings<'sd card'>}
                        containingGroupFilters={containingGroupFilters}
                        setContainingGroupFilters={setContainingGroupFilters}
                    />
                )
            case 'install folder':
                return (
                    <InstallFolderFilterOptions
                        index={index}
                        filter={filterCopy as TabFilterSettings<'install folder'>}
                        containingGroupFilters={containingGroupFilters}
                        setContainingGroupFilters={setContainingGroupFilters}
                    />
                )
            default:
                return <Fragment />
        }
    } else {
        return <Fragment />
    }
}
