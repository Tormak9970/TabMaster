import { DateObj } from './DateTypes'
import { SteamCollection } from './stores'

export type FilterType =
    | 'collection'
    | 'installed'
    | 'regex'
    | 'friends'
    | 'tags'
    | 'whitelist'
    | 'blacklist'
    | 'merge'
    | 'platform'
    | 'deck compatibility'
    | 'steamos compatibility'
    | 'review score'
    | 'time played'
    | 'size on disk'
    | 'release date'
    | 'purchase date'
    | 'last played'
    | 'family sharing'
    | 'demo'
    | 'streamable'
    | 'steam features'
    | 'achievements'
    | 'sd card'
    | 'install folder'
    | 'coming soon'

export type TimeUnit = 'minutes' | 'hours' | 'days'
export type ThresholdCondition = 'above' | 'below'
export type ReviewScoreType = 'metacritic' | 'steampercent'
export type LogicalMode = 'and' | 'or'
export type SteamPlatform = 'steam' | 'nonSteam'

export enum SdCardParamType {
    INSTALLED = 0,
    ANY,
}

export type CollectionFilterParams = {
    id: SteamCollection['id']
    /**
     * Always present as of v1.2.2 onward
     */
    name?: string
    /**
     * @deprecated Replaced by id. Used pre v1.2.2
     */
    collection?: SteamCollection['id']
}
export type InstalledFilterParams = { installed: boolean }
export type RegexFilterParams = { regex: string }
export type FriendsFilterParams = { friends: number[]; mode: LogicalMode }
export type TagsFilterParams = { tags: number[]; mode: LogicalMode }
export type WhitelistFilterParams = { games: number[] }
export type BlacklistFilterParams = { games: number[] }
export type MergeFilterParams = { filters: TabFilterSettings<FilterType>[]; mode: LogicalMode }
export type PlatformFilterParams = { platform: SteamPlatform }
export type DeckCompatFilterParams = { category: number }
export type SteamOSCompatFilterParams = { category: number }
export type ReviewScoreFilterParams = { scoreThreshold: number; condition: ThresholdCondition; type: ReviewScoreType }
export type TimePlayedFilterParams = { timeThreshold: number; condition: ThresholdCondition; units: TimeUnit }
export type SizeOnDiskFilterParams = { gbThreshold: number; condition: ThresholdCondition }
export type ReleaseDateFilterParams = { date?: DateObj; daysAgo?: number; condition: ThresholdCondition }
export type PurchaseDateFilterParams = { date?: DateObj; daysAgo?: number; condition: ThresholdCondition }
export type LastPlayedFilterParams = { date?: DateObj; daysAgo?: number; condition: ThresholdCondition }
export type FamilySharingFilterParams = { isFamilyShared: boolean }
export type DemoFilterParams = { isDemo: boolean }
export type ComingSoonParams = { isComingSoon: boolean }
export type StreamableFilterParams = { isStreamable: boolean }
export type SteamFeaturesFilterParams = { features: number[]; mode: LogicalMode }
export type AchievementsFilterParams = {
    /**
     * @deprecated This is no longer used
     */
    completionPercentage?: number
    threshold: number
    thresholdType: 'count' | 'percent'
    condition: ThresholdCondition
}
export type SdCardParams = { card: SdCardParamType | string | undefined } //inserted card/ any card/ card uid (undefined value is legacy)
export type InstallFolderParams = { driveName: string }

export type FilterParams<T extends FilterType> = T extends 'collection'
    ? CollectionFilterParams
    : T extends 'installed'
      ? InstalledFilterParams
      : T extends 'regex'
        ? RegexFilterParams
        : T extends 'friends'
          ? FriendsFilterParams
          : T extends 'tags'
            ? TagsFilterParams
            : T extends 'whitelist'
              ? WhitelistFilterParams
              : T extends 'blacklist'
                ? BlacklistFilterParams
                : T extends 'merge'
                  ? MergeFilterParams
                  : T extends 'platform'
                    ? PlatformFilterParams
                    : T extends 'deck compatibility'
                      ? DeckCompatFilterParams
                      : T extends 'steamos compatibility'
                        ? SteamOSCompatFilterParams
                        : T extends 'review score'
                          ? ReviewScoreFilterParams
                          : T extends 'time played'
                            ? TimePlayedFilterParams
                            : T extends 'size on disk'
                              ? SizeOnDiskFilterParams
                              : T extends 'release date'
                                ? ReleaseDateFilterParams
                                : T extends 'purchase date'
                                  ? PurchaseDateFilterParams
                                  : T extends 'last played'
                                    ? LastPlayedFilterParams
                                    : T extends 'family sharing'
                                      ? FamilySharingFilterParams
                                      : T extends 'demo'
                                        ? DemoFilterParams
                                        : T extends 'coming soon'
                                          ? ComingSoonParams
                                          : T extends 'streamable'
                                            ? StreamableFilterParams
                                            : T extends 'steam features'
                                              ? SteamFeaturesFilterParams
                                              : T extends 'achievements'
                                                ? AchievementsFilterParams
                                                : T extends 'sd card'
                                                  ? SdCardParams
                                                  : T extends 'install folder'
                                                    ? InstallFolderParams
                                                    : never

export type TabFilterSettings<T extends FilterType> = {
    type: T
    inverted: boolean
    params: FilterParams<T>
}
