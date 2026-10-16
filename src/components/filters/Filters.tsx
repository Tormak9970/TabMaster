import { IconType } from 'react-icons/lib'
import { MicroSDeckInterop, PluginController, LogController } from '@lib'
import { STEAM_FEATURES_ID_MAP } from './SteamFeatures'
import { FaCheckCircle, FaHdd, FaSdCard, FaShoppingCart, FaTrophy, FaUserFriends } from 'react-icons/fa'
import { IoGrid } from 'react-icons/io5'
import { SiSteam, SiSteamdeck } from 'react-icons/si'
import {
    FaAward,
    FaBan,
    FaCalendarDays,
    FaCloudArrowDown,
    FaCompactDisc,
    FaFolder,
    FaListCheck,
    FaPlay,
    FaRegClock,
    FaSteam,
    FaTags,
    FaUserPlus,
} from 'react-icons/fa6'
import { BsClockHistory, BsRegex } from 'react-icons/bs'
import { LuCombine } from 'react-icons/lu'
import { CardAndGames } from '@cebbinghaus/microsdeck'
import { MdNewReleases } from 'react-icons/md'
import { trans_string as t } from '@utils'
import {
    SteamAppOverview,
    FilterParams,
    FilterType,
    SdCardParamType,
    TabFilterSettings,
    ValidationResponse,
    FilterErrorEntry,
    DateIncludes,
} from '@types'

function getSteamOSCompatCategory(app: SteamAppOverview) {
    return (app.steam_hw_compat_category_packed >> 4) & 3 || 0
}

type FilterFunction = (params: FilterParams<FilterType>, appOverview: SteamAppOverview) => boolean

/**
 * Define the deafult params for a filter type here
 * Checking and settings defaults in component is unnecessary
 */
export const FilterDefaultParams: () => { [key in FilterType]: FilterParams<key> } = () => ({
    collection: { id: 'favorite', name: 'Favorites' },
    installed: { installed: true },
    regex: { regex: '' },
    friends: { friends: [], mode: 'and' },
    tags: { tags: [], mode: 'and' },
    whitelist: { games: [] },
    blacklist: { games: [] },
    merge: { filters: [], mode: 'and' },
    platform: { platform: 'steam' },
    'deck compatibility': { category: 3 },
    'steamos compatibility': { category: 2 },
    'review score': { scoreThreshold: 50, condition: 'above', type: 'metacritic' },
    'time played': { timeThreshold: 60, condition: 'above', units: 'minutes' },
    'size on disk': { gbThreshold: 10, condition: 'above' },
    'release date': { date: undefined, condition: 'above' },
    'purchase date': { date: undefined, condition: 'above' },
    'last played': { date: undefined, condition: 'above' },
    'family sharing': { isFamilyShared: true },
    demo: { isDemo: true },
    'coming soon': { isComingSoon: true },
    streamable: { isStreamable: true },
    'steam features': { features: [], mode: 'and' },
    achievements: { threshold: 10, thresholdType: 'percent', condition: 'above' },
    'sd card': { card: SdCardParamType.INSTALLED },
    'install folder': {
        driveName: installFolderStore?.AllInstallFolders?.find(folder => folder.bIsDefaultFolder)?.strDriveName ?? '',
    },
})

/**
 * Dictionary of descriptions for each filter.
 */
export const FilterDescriptions: () => { [key in FilterType]: string } = () => ({
    collection: t('DESCRIPTION_COLLECTION_FILTER', 'Selects apps that are in a certain Steam Collection.'),
    installed: t('DESCRIPTION_INSTALLED_FILTER', 'Selects apps that are installed/uninstalled.'),
    regex: t('DESCRIPTION_REGEX_FILTER', 'Selects apps whose titles match a regular expression.'),
    friends: t('DESCRIPTION_FRIENDS_FILTER', 'Selects apps that are also owned by friends.'),
    tags: t('DESCRIPTION_TAGS_FILTER', 'Selects apps that have specific community tags.'),
    whitelist: t('DESCRIPTION_WHITELIST_FILTER', 'Selects apps that are added to the list.'),
    blacklist: t('DESCRIPTION_BLACKLIST_FILTER', 'Selects apps that are not added to the list.'),
    merge: t('DESCRIPTION_MERGE_FILTER', 'Selects apps that pass a subgroup of filters.'),
    platform: t('DESCRIPTION_PLATFORM_FILTER', 'Selects Steam or non-Steam apps.'),
    'deck compatibility': t(
        'DESCRIPTION_DECK_COMPAT_FILTER',
        'Selects apps that have a specific Steam Deck compatibilty status.'
    ),
    'steamos compatibility': t(
        'DESCRIPTION_MACHINE_COMPAT_FILTER',
        'Selects apps that have a specific SteamOS compatibilty status.'
    ),
    'review score': t('DESCRIPTION_REVIEW_FILTER', 'Selects apps based on their metacritic/steam review score.'),
    'time played': t('DESCRIPTION_TIME_PLAYED_FILTER', 'Selects apps based on your play time.'),
    'size on disk': t('DESCRIPTION_SIZE_ON_DISK_FILTER', 'Selects apps based on their install size.'),
    'release date': t('DESCRIPTION_RELEASE_DATE_FILTER', 'Selects apps based on their release date.'),
    'purchase date': t('DESCRIPTION_PURCHASE_DATE_FILTER', 'Selects apps based on when you purchased them.'),
    'last played': t('DESCRIPTION_LAST_PLAYED_FILTER', 'Selects apps based on when they were last played.'),
    'family sharing': t(
        'DESCRIPTION_FAMILY_SHARING_FILTER',
        "Selects apps that are/aren't shared from family members."
    ),
    demo: t('DESCRIPTION_DEMO_FILTER', "Selects apps that are/aren't demos."),
    'coming soon': t('DESCRIPTION_COMING_SOON_FILTER', "Selects apps that are/aren't soon to be released."),
    streamable: t('DESCRIPTION_STREAMABLE_FILTER', "Selects apps that can/can't be streamed from another computer."),
    achievements: t('DESCRIPTION_ACHIEVEMENTS_FILTER', 'Selects apps based on their completion percentage.'),
    'steam features': t('DESCRIPTION_STEAM_FEATURES_FILTER', 'Selects apps that support specific Steam Features.'),
    'sd card': t('DESCRIPTION_SD_CARD_FILTER', 'Selects apps that are present on the inserted/specific MicroSD Card.'),
    'install folder': t(
        'DESCRIPTION_INSTALL_FOLDER_FILTER',
        'Selects apps that are installed in a specific Steam Install Folder.'
    ),
})

/**
 * Dictionary of Labels for each filter.
 */
export const FilterLabels: () => { [key in FilterType]: string } = () => ({
    collection: t('LABEL_COLLECTION_FILTER', 'Collection'),
    installed: t('LABEL_INSTALLED_FILTER', 'Installed'),
    regex: t('LABEL_REGEX_FILTER', 'Regex'),
    friends: t('LABEL_FRIENDS_FILTER', 'Friends'),
    tags: t('LABEL_TAGS_FILTER', 'Tags'),
    whitelist: t('LABEL_WHITELIST_FILTER', 'Whitelist'),
    blacklist: t('LABEL_BLACKLIST_FILTER', 'Blacklist'),
    merge: t('LABEL_MERGE_FILTER', 'Merge'),
    platform: t('LABEL_PLATFORM_FILTER', 'Platform'),
    'deck compatibility': t('LABEL_DECK_COMPAT_FILTER', 'Deck Compatibility'),
    'steamos compatibility': t('LABEL_MACHINE_COMPAT_FILTER', 'SteamOS Compatibility'),
    'review score': t('LABEL_REVIEW_FILTER', 'Review Score'),
    'time played': t('LABEL_TIME_PLAYED_FILTER', 'Time Played'),
    'size on disk': t('LABEL_SIZE_ON_DISK_FILTER', 'Size On Disk'),
    'release date': t('LABEL_RELEASE_DATE_FILTER', 'Release Date'),
    'purchase date': t('LABEL_PURCHASE_DATE_FILTER', 'Purchase Date'),
    'last played': t('LABEL_LAST_PLAYED_FILTER', 'Last Played'),
    'family sharing': t('LABEL_FAMILY_SHARING_FILTER', 'Family Sharing'),
    demo: t('LABEL_DEMO_FILTER', 'Demo'),
    'coming soon': t('LABEL_COMING_SOON_FILTER', 'Coming Soon'),
    streamable: t('LABEL_STREAMABLE_FILTER', 'Streamable'),
    achievements: t('LABEL_ACHIEVEMENTS_FILTER', 'Achievements'),
    'steam features': t('LABEL_STEAM_FEATURES_FILTER', 'Steam Features'),
    'sd card': t('LABEL_SD_CARD_FILTER', 'MicroSD Card'),
    'install folder': t('LABEL_INSTALL_FOLDER_FILTER', 'Install Folder'),
})

/**
 * Dictionary of icons for each filter.
 */
export const FilterIcons: { [filterType in FilterType]: IconType } = {
    collection: IoGrid,
    installed: FaPlay,
    regex: BsRegex,
    friends: FaUserFriends,
    tags: FaTags,
    whitelist: FaCheckCircle,
    blacklist: FaBan,
    merge: LuCombine,
    platform: FaSteam,
    'deck compatibility': SiSteamdeck,
    'steamos compatibility': SiSteam,
    'review score': FaAward,
    'time played': FaRegClock,
    'size on disk': FaHdd,
    'release date': FaCalendarDays,
    'purchase date': FaShoppingCart,
    'last played': BsClockHistory,
    'family sharing': FaUserPlus,
    demo: FaCompactDisc,
    'coming soon': MdNewReleases,
    streamable: FaCloudArrowDown,
    'steam features': FaListCheck,
    achievements: FaTrophy,
    'sd card': FaSdCard,
    'install folder': FaFolder,
}

/**
 * Whether the filter should have an invert option.
 * @param filter The filter to check.
 * @returns True if the filter can be inverted, false if not.
 */
export function canBeInverted(filter: TabFilterSettings<FilterType>): boolean {
    switch (filter.type) {
        case 'regex':
        case 'collection':
        case 'friends':
        case 'tags':
        case 'merge':
        case 'deck compatibility':
        case 'steamos compatibility':
        case 'steam features':
        case 'achievements':
        case 'sd card':
        case 'install folder':
            return true
        case 'platform':
        case 'installed':
        case 'whitelist':
        case 'blacklist':
        case 'review score':
        case 'time played':
        case 'size on disk':
        case 'release date':
        case 'purchase date':
        case 'last played':
        case 'demo':
        case 'coming soon':
        case 'family sharing':
        case 'streamable':
            return false
    }
}

// * make sure the check is the inversion from before going forward
/**
 * Checks if a filter has valid params.
 * @param filter The filter to check.
 * @returns True if the filter has valid params.
 */
export function isValidParams(filter: TabFilterSettings<FilterType>): boolean {
    switch (filter.type) {
        case 'regex':
            return (filter as TabFilterSettings<'regex'>).params.regex !== ''
        case 'collection':
            return (
                (filter as TabFilterSettings<'collection'>).params.id !== '' &&
                (filter as TabFilterSettings<'collection'>).params.name !== ''
            )
        case 'friends':
            return (filter as TabFilterSettings<'friends'>).params.friends.length !== 0
        case 'tags':
            return (filter as TabFilterSettings<'tags'>).params.tags.length !== 0
        case 'whitelist':
        case 'blacklist':
            return (filter as TabFilterSettings<'whitelist'>).params.games.length !== 0
        case 'merge':
            return (filter as TabFilterSettings<'merge'>).params.filters.length !== 0
        case 'release date':
        case 'purchase date':
        case 'last played':
            return (
                (filter as TabFilterSettings<'release date'>).params.date !== undefined ||
                (filter as TabFilterSettings<'release date'>).params.daysAgo !== undefined
            )
        case 'steam features':
            return (filter as TabFilterSettings<'steam features'>).params.features.length !== 0
        case 'size on disk':
            return (filter as TabFilterSettings<'size on disk'>).params.gbThreshold !== 0
        case 'installed':
        case 'platform':
        case 'deck compatibility':
        case 'steamos compatibility':
        case 'review score':
        case 'time played':
        case 'demo':
        case 'coming soon':
        case 'family sharing':
        case 'streamable':
        case 'achievements':
        case 'sd card':
        case 'install folder':
            return true
    }
}

/**
 * Gets the label for a provided deck verified category.
 * @param category The category to get the label for.
 * @returns The label of the provided category.
 */
export function compatCategoryToLabel(category: number): string {
    switch (category) {
        case 0:
            return t('DeckVerified_CategoryLabel_Unknown', 'Unknown', true)
        case 1:
            return t('DeckVerified_CategoryLabel_Unsupported', 'Unsupported', true)
        case 2:
            return t('DeckVerified_CategoryLabel_Playable', 'Playable', true)
        case 3:
            return t('DeckVerified_CategoryLabel_Verified', 'Verified', true)
        default:
            return ''
    }
}

/**
 * Gets the label for a provided SteamOS verified category.
 * @param category The category to get the label for.
 * @returns The label of the provided category.
 */
export function steamOSCompatCategoryToLabel(category: number): string {
    switch (category) {
        case 0:
            return t('SteamOS_CategoryLabel_Unknown', 'Unknown', true)
        case 1:
            return t('SteamOS_CategoryLabel_Unsupported', 'Unsupported', true)
        case 2:
            return t('SteamOS_CategoryLabel_Compatible', 'Compatible', true)
        default:
            return ''
    }
}

/**
 * Gets the label for a provided steam feature.
 * @param feature The feature to get the label for.
 * @returns The label of the provided feature.
 */
export function steamFeatureToLabel(feature: number): string {
    return (
        STEAM_FEATURES_ID_MAP[feature.toString() as keyof typeof STEAM_FEATURES_ID_MAP]?.display_name ??
        t('LABEL_UNKOWN_STEAM_FEATURE', 'Unkown Steam Feature')
    )
}

/**
 * Validates a filter to ensure it will function properly.
 * @param filter The filter to validate.
 * @returns Whether or not the filter passed, and if not, any errors it produced.
 */
export function validateFilter(filter: TabFilterSettings<FilterType>): ValidationResponse {
    if (!Object.keys(filter).includes('inverted')) filter.inverted = false

    switch (filter.type) {
        case 'collection': {
            let passed = true
            const errors: string[] = []
            const collectionFilter = filter as TabFilterSettings<'collection'>

            if (collectionFilter.params.collection) {
                collectionFilter.params.id = collectionFilter.params.collection
                delete collectionFilter.params.collection
            }

            //* Confirm the collection still exists
            const collectionFromStores = collectionStore.GetCollection(collectionFilter.params.id)
            if (!collectionFromStores) {
                //* try to find collection by name
                if (collectionFilter.params.name) {
                    const updatedIdCollection = collectionStore.userCollections.find(
                        collection => collection.displayName === collectionFilter.params.name
                    )
                    if (updatedIdCollection) {
                        collectionFilter.params.id = updatedIdCollection.id
                    } else {
                        errors.push(`Collection: ${collectionFilter.params.name} no longer exists`)
                        passed = false
                    }
                    //* fallback to error on id if user has old config without name
                } else {
                    errors.push(`Collection with id: ${collectionFilter.params.id} no longer exists`)
                    passed = false
                }
            } else if (!collectionFilter.params.name) {
                collectionFilter.params.name = collectionFromStores.displayName
            }

            return {
                passed: passed,
                errors: errors,
            }
        }
        case 'merge': {
            let passed = true
            const errors: string[] = []
            const mergeErrorEntries: FilterErrorEntry[] = []

            if (Object.keys(filter.params).includes('includesHidden'))
                //@ts-ignore delete property from old settings version
                delete (filter as TabFilterSettings<'merge'>).params.includesHidden

            const mergeFilter = filter as TabFilterSettings<'merge'>

            for (let i = 0; i < mergeFilter.params.filters.length; i++) {
                const filter = mergeFilter.params.filters[i]

                const validated = validateFilter(filter)

                if (!validated.passed) {
                    passed = false
                    errors.push(
                        `Filter ${i + 1} - ${validated.errors.length} ${
                            validated.errors.length === 1 ? 'error' : 'errors'
                        }`
                    )

                    let entry: FilterErrorEntry = {
                        filterIdx: i,
                        errors: validated.errors,
                    }

                    if (validated.mergeErrorEntries) entry.mergeErrorEntries = validated.mergeErrorEntries

                    mergeErrorEntries.push(entry)
                }
            }

            return {
                passed: passed,
                errors: errors,
                mergeErrorEntries: mergeErrorEntries,
            }
        }
        case 'sd card': {
            const cardFilter = filter as TabFilterSettings<'sd card'>

            let passed = true
            if (
                MicroSDeckInterop.isInstallOk() &&
                window.MicroSDeck!.Enabled &&
                typeof cardFilter.params.card === 'string'
            ) {
                const cardsAndGames = window.MicroSDeck!.CardsAndGames || []

                if (!cardsAndGames.find(([card]) => cardFilter.params.card === card.uid)) {
                    passed = false
                }
            }

            return {
                passed,
                errors: passed ? [] : ["Couldn't find the selected card in the list of known cards."],
            }
        }
        case 'achievements': {
            const achievementsFilter = filter as TabFilterSettings<'achievements'>

            if (achievementsFilter.params.completionPercentage) {
                achievementsFilter.params.threshold = achievementsFilter.params.completionPercentage
                achievementsFilter.params.thresholdType = 'percent'
                delete achievementsFilter.params.completionPercentage
            }

            return {
                passed: true,
                errors: [],
            }
        }
        case 'size on disk':
        case 'regex':
        case 'friends':
        case 'tags':
        case 'installed':
        case 'whitelist':
        case 'blacklist':
        case 'platform':
        case 'deck compatibility':
        case 'steamos compatibility':
        case 'review score':
        case 'time played':
        case 'release date':
        case 'purchase date':
        case 'last played':
        case 'demo':
        case 'coming soon':
        case 'family sharing':
        case 'streamable':
        case 'steam features':
        case 'install folder':
        default:
            return {
                passed: true,
                errors: [],
            }
    }
}

/**
 * Utility class for filtering games.
 */
export class Filter {
    private static filterFunctions = {
        collection: (params: FilterParams<'collection'>, appOverview: SteamAppOverview) => {
            return collectionStore.GetCollection(params.id).allApps.includes(appOverview)
        },
        installed: (params: FilterParams<'installed'>, appOverview: SteamAppOverview) => {
            return params.installed ? appOverview.installed : !appOverview.installed
        },
        regex: (params: FilterParams<'regex'>, appOverview: SteamAppOverview) => {
            const regex = new RegExp(params.regex ?? '/^$/')
            return regex.test(appOverview.display_name)
        },
        friends: (params: FilterParams<'friends'>, appOverview: SteamAppOverview) => {
            const friendsWhoOwn: number[] = PluginController.getFriendsWhoOwn(appOverview.appid)

            if (params.mode === 'and') {
                return params.friends.every(friend => friendsWhoOwn.includes(friend))
            } else {
                return params.friends.some(friend => friendsWhoOwn.includes(friend))
            }
        },
        tags: (params: FilterParams<'tags'>, appOverview: SteamAppOverview) => {
            if (params.mode === 'and') {
                return params.tags.every((tag: number) => appOverview.store_tag.includes(tag))
            } else {
                return params.tags.some((tag: number) => appOverview.store_tag.includes(tag))
            }
        },
        whitelist: (params: FilterParams<'whitelist'>, appOverview: SteamAppOverview) => {
            return params.games.includes(appOverview.appid)
        },
        blacklist: (params: FilterParams<'whitelist'>, appOverview: SteamAppOverview) => {
            return !params.games.includes(appOverview.appid)
        },
        merge: (params: FilterParams<'merge'>, appOverview: SteamAppOverview) => {
            if (params.mode === 'and') {
                return params.filters.every(filterSettings => Filter.run(filterSettings, appOverview))
            } else {
                return params.filters.some(filterSettings => Filter.run(filterSettings, appOverview))
            }
        },
        platform: (params: FilterParams<'platform'>, appOverview: SteamAppOverview) => {
            if (params.platform === 'steam') {
                //make sure to exlcude tools: 4 and videos: 2048
                return (
                    appOverview.app_type !== 1073741824 && appOverview.app_type !== 4 && appOverview.app_type !== 2048
                )
            } else if (params.platform === 'nonSteam') {
                return appOverview.app_type === 1073741824
            }
            return false
        },
        'deck compatibility': (params: FilterParams<'deck compatibility'>, appOverview: SteamAppOverview) => {
            return appOverview.steam_deck_compat_category === params.category
        },
        'steamos compatibility': (params: FilterParams<'steamos compatibility'>, appOverview: SteamAppOverview) => {
            return getSteamOSCompatCategory(appOverview) === params.category
        },
        'review score': (params: FilterParams<'review score'>, appOverview: SteamAppOverview) => {
            const score = params.type === 'metacritic' ? appOverview.metacritic_score : appOverview.review_percentage
            return params.condition === 'above' ? score >= params.scoreThreshold : score <= params.scoreThreshold
        },
        'time played': (params: FilterParams<'time played'>, appOverview: SteamAppOverview) => {
            const minutesThreshold =
                params.units === 'minutes'
                    ? params.timeThreshold
                    : params.units === 'hours'
                      ? params.timeThreshold * 60
                      : params.timeThreshold * 1440
            return params.condition === 'above'
                ? appOverview.minutes_playtime_forever >= minutesThreshold
                : appOverview.minutes_playtime_forever <= minutesThreshold
        },
        'size on disk': (params: FilterParams<'size on disk'>, appOverview: SteamAppOverview) => {
            return params.condition === 'above'
                ? Number(appOverview.size_on_disk) / 1024 ** 3 >= params.gbThreshold
                : Number(appOverview.size_on_disk) / 1024 ** 3 <= params.gbThreshold
        },
        'release date': (params: FilterParams<'release date'>, appOverview: SteamAppOverview) => {
            let releaseTimeMs
            if (appOverview.rt_original_release_date) releaseTimeMs = appOverview.rt_original_release_date * 1000
            else if (appOverview.rt_steam_release_date !== 0) releaseTimeMs = appOverview.rt_steam_release_date * 1000
            else return false

            //by date case
            if (params.date) {
                const { day, month, year } = params.date

                if (params.condition === 'above') {
                    return releaseTimeMs >= new Date(year, (month ?? 1) - 1, day ?? 1).getTime()
                } else {
                    const dateIncludes =
                        day === undefined
                            ? month === undefined
                                ? DateIncludes.yearOnly
                                : DateIncludes.monthYear
                            : DateIncludes.dayMonthYear
                    switch (dateIncludes) {
                        case DateIncludes.dayMonthYear:
                            return releaseTimeMs < new Date(year, month! - 1, day! + 1).getTime()
                        case DateIncludes.monthYear:
                            return releaseTimeMs < new Date(year, month!, 1).getTime()
                        case DateIncludes.yearOnly:
                            return releaseTimeMs < new Date(year + 1, 0, 1).getTime()
                    }
                }
                //by days ago case
            } else {
                const today = new Date()
                return params.condition === 'above'
                    ? releaseTimeMs >=
                          new Date(
                              today.getUTCFullYear(),
                              today.getUTCMonth(),
                              today.getUTCDate() - params.daysAgo!
                          ).getTime()
                    : releaseTimeMs <
                          new Date(
                              today.getUTCFullYear(),
                              today.getUTCMonth(),
                              today.getUTCDate() + 1 - params.daysAgo!
                          ).getTime()
            }
        },
        'purchase date': (params: FilterParams<'purchase date'>, appOverview: SteamAppOverview) => {
            let purchaseTimeMs
            if (appOverview.rt_purchased_time) purchaseTimeMs = appOverview.rt_purchased_time * 1000
            else return false

            //by date case
            if (params.date) {
                const { day, month, year } = params.date

                if (params.condition === 'above') {
                    return purchaseTimeMs >= new Date(year, (month ?? 1) - 1, day ?? 1).getTime()
                } else {
                    const dateIncludes =
                        day === undefined
                            ? month === undefined
                                ? DateIncludes.yearOnly
                                : DateIncludes.monthYear
                            : DateIncludes.dayMonthYear
                    switch (dateIncludes) {
                        case DateIncludes.dayMonthYear:
                            return purchaseTimeMs < new Date(year, month! - 1, day! + 1).getTime()
                        case DateIncludes.monthYear:
                            return purchaseTimeMs < new Date(year, month!, 1).getTime()
                        case DateIncludes.yearOnly:
                            return purchaseTimeMs < new Date(year + 1, 0, 1).getTime()
                    }
                }
                //by days ago case
            } else {
                const today = new Date()
                return params.condition === 'above'
                    ? purchaseTimeMs >=
                          new Date(
                              today.getUTCFullYear(),
                              today.getUTCMonth(),
                              today.getUTCDate() - params.daysAgo!
                          ).getTime()
                    : purchaseTimeMs <
                          new Date(
                              today.getUTCFullYear(),
                              today.getUTCMonth(),
                              today.getUTCDate() + 1 - params.daysAgo!
                          ).getTime()
            }
        },
        'last played': (params: FilterParams<'last played'>, appOverview: SteamAppOverview) => {
            const lastPlayedTimeMs = appOverview.rt_last_time_played * 1000
            if (lastPlayedTimeMs === 0) return false

            //by date case
            if (params.date) {
                const { day, month, year } = params.date

                if (params.condition === 'above') {
                    return lastPlayedTimeMs >= new Date(year, (month ?? 1) - 1, day ?? 1).getTime()
                } else {
                    const dateIncludes =
                        day === undefined
                            ? month === undefined
                                ? DateIncludes.yearOnly
                                : DateIncludes.monthYear
                            : DateIncludes.dayMonthYear
                    switch (dateIncludes) {
                        case DateIncludes.dayMonthYear:
                            return lastPlayedTimeMs < new Date(year, month! - 1, day! + 1).getTime()
                        case DateIncludes.monthYear:
                            return lastPlayedTimeMs < new Date(year, month!, 1).getTime()
                        case DateIncludes.yearOnly:
                            return lastPlayedTimeMs < new Date(year + 1, 0, 1).getTime()
                    }
                }
                //by days ago case
            } else {
                const today = new Date()
                return params.condition === 'above'
                    ? lastPlayedTimeMs >=
                          new Date(
                              today.getUTCFullYear(),
                              today.getUTCMonth(),
                              today.getUTCDate() - params.daysAgo!
                          ).getTime()
                    : lastPlayedTimeMs <
                          new Date(
                              today.getUTCFullYear(),
                              today.getUTCMonth(),
                              today.getUTCDate() + 1 - params.daysAgo!
                          ).getTime()
            }
        },
        'family sharing': (params: FilterParams<'family sharing'>, appOverview: SteamAppOverview) => {
            const isInSharedCollection = collectionStore.sharedLibrariesCollections.some(collection => {
                return collection.allApps.includes(appOverview)
            })
            return params.isFamilyShared ? isInSharedCollection : !isInSharedCollection
        },
        demo: (params: FilterParams<'demo'>, appOverview: SteamAppOverview) => {
            return params.isDemo ? appOverview.app_type === 8 : appOverview.app_type !== 8
        },
        'coming soon': (params: FilterParams<'coming soon'>, appOverview: SteamAppOverview) => {
            return params.isComingSoon ? appOverview.display_status === 13 : appOverview.display_status !== 13
        },
        streamable: (params: FilterParams<'streamable'>, appOverview: SteamAppOverview) => {
            const isStreamable = appOverview.per_client_data.some(
                clientData =>
                    clientData.client_name !== 'This machine' && clientData.client_name !== '' && clientData.installed
            )
            return params.isStreamable ? isStreamable : !isStreamable
        },
        'steam features': (params: FilterParams<'steam features'>, appOverview: SteamAppOverview) => {
            if (params.mode === 'and') {
                return params.features.every((feature: number) => appOverview.store_category.includes(feature))
            } else {
                return params.features.some((feature: number) => appOverview.store_category.includes(feature))
            }
        },
        achievements: (params: FilterParams<'achievements'>, appOverview: SteamAppOverview) => {
            const percentage = appAchievementProgressCache.GetAchievementProgress(appOverview.appid)

            if (params.thresholdType === 'percent') {
                return params.condition === 'above' ? percentage >= params.threshold : percentage <= params.threshold
            } else {
                const entry = appAchievementProgressCache.m_achievementProgress.mapCache.get(appOverview.appid)

                if (entry) {
                    const count = entry.unlocked
                    return params.condition === 'above' ? count >= params.threshold : count <= params.threshold
                } else {
                    LogController.error(`Unable to get achievements cache for ${appOverview.appid}`)
                    return false
                }
            }
        },
        'sd card': (params: FilterParams<'sd card'>, appOverview: SteamAppOverview) => {
            const isOnCard = (card: CardAndGames) => !!card[1].find(game => +game.uid == appOverview.appid)
            let card: CardAndGames | undefined
            switch (params.card) {
                case SdCardParamType.ANY:
                    return window.MicroSDeck?.CardsAndGames?.find(isOnCard)
                case SdCardParamType.INSTALLED:
                case undefined:
                    card = window.MicroSDeck?.CurrentCardAndGames
                    break
                default:
                    card = window.MicroSDeck?.CardsAndGames?.find(([card]) => card.uid == params.card)
            }
            if (!card) return false
            return isOnCard(card)
        },
        'install folder': (params: FilterParams<'install folder'>, appOverview: SteamAppOverview) => {
            const folder = installFolderStore.AllInstallFolders.find(folder => folder.strDriveName === params.driveName)

            if (!folder || !folder.bIsMounted) {
                return false
            }

            return folder.vecApps.some(app => app.nAppID === appOverview.appid)
        },
    }

    /**
     * Removes filters that are of unknown types.
     * @param filters Array of tabs filters.
     * @returns
     */
    static removeUnknownTypes(filters?: TabFilterSettings<FilterType>[]) {
        if (!filters) return undefined
        const knownFilterTypes = Object.keys(Filter.filterFunctions)
        return filters.flatMap(filter => {
            if (filter.type === 'merge') {
                const mergeFilter = { ...filter } as TabFilterSettings<'merge'>
                mergeFilter.params.filters = this.removeUnknownTypes(mergeFilter.params.filters)!
                return mergeFilter
            }
            return knownFilterTypes.includes(filter.type) ? filter : []
        })
    }

    /**
     * Checks if a game passes a given filter.
     * @param filterSettings The filter to run.
     * @param appOverview The app to check
     * @returns True if the app meets the filter criteria.
     */
    static run(filterSettings: TabFilterSettings<FilterType>, appOverview: SteamAppOverview): boolean {
        const shouldInclude = (this.filterFunctions[filterSettings.type] as FilterFunction)(
            filterSettings.params,
            appOverview
        )
        return filterSettings.inverted ? !shouldInclude : shouldInclude
    }
}
