import { IconType } from "react-icons/lib";
import { MicroSDeckInterop } from '../../lib/controllers/MicroSDeckInterop';
import { PluginController } from "../../lib/controllers/PluginController";
import { DateIncludes, DateObj } from '../generic/DatePickers';
import { STEAM_FEATURES_ID_MAP } from "./SteamFeatures";
import { FaCheckCircle, FaHdd, FaSdCard, FaShoppingCart, FaTrophy, FaUserFriends } from "react-icons/fa";
import { IoGrid } from "react-icons/io5";
import { SiSteam, SiSteamdeck } from "react-icons/si";
import { FaAward, FaBan, FaCalendarDays, FaCloudArrowDown, FaCompactDisc, FaListCheck, FaPlay, FaRegClock, FaSteam, FaTags, FaUserPlus } from "react-icons/fa6";
import { BsClockHistory, BsRegex } from "react-icons/bs";
import { LuCombine } from "react-icons/lu";
import { LogController } from "../../lib/controllers/LogController";
import { CardAndGames } from '@cebbinghaus/microsdeck';

export type FilterType = 'collection' | 'installed' | 'regex' | 'friends' | 'tags' | 'whitelist' | 'blacklist' | 'merge' | 'platform' | 'deck compatibility' | 'steamos compatibility' | 'review score' | 'time played' | 'size on disk' | 'release date' | 'purchase date' | 'last played' | 'family sharing' | 'demo' | 'streamable' | 'steam features' | 'achievements' | 'sd card';

export type TimeUnit = 'minutes' | 'hours' | 'days';
export type ThresholdCondition = 'above' | 'below';
export type ReviewScoreType = 'metacritic' | 'steampercent';

function getSteamOSCompatCategory(app: SteamAppOverview) {
    return app.steam_hw_compat_category_packed >> 4 & 3 || 0;
}

export enum SdCardParamType {
  INSTALLED = 0,
  ANY
};

type CollectionFilterParams = {
  id: SteamCollection['id'],
  /**
   * Always present as of v1.2.2 onward
   */
  name?: string,
  /**
   * @deprecated Replaced by id. Used pre v1.2.2
   */
  collection?: SteamCollection['id'];
};
type InstalledFilterParams = { installed: boolean };
type RegexFilterParams = { regex: string };
type FriendsFilterParams = { friends: number[], mode: LogicalMode };
type TagsFilterParams = { tags: number[], mode: LogicalMode };
type WhitelistFilterParams = { games: number[] };
type BlacklistFilterParams = { games: number[] };
type MergeFilterParams = { filters: TabFilterSettings<FilterType>[], mode: LogicalMode };
type PlatformFilterParams = { platform: SteamPlatform };
type DeckCompatFilterParams = { category: number };
type SteamOSCompatFilterParams = { category: number };
type ReviewScoreFilterParams = { scoreThreshold: number, condition: ThresholdCondition, type: ReviewScoreType };
type TimePlayedFilterParams = { timeThreshold: number, condition: ThresholdCondition, units: TimeUnit };
type SizeOnDiskFilterParams = { gbThreshold: number, condition: ThresholdCondition };
type ReleaseDateFilterParams = { date?: DateObj, daysAgo?: number, condition: ThresholdCondition };
type PurchaseDateFilterParams = { date?: DateObj, daysAgo?: number, condition: ThresholdCondition };
type LastPlayedFilterParams = { date?: DateObj, daysAgo?: number, condition: ThresholdCondition };
type FamilySharingFilterParams = { isFamilyShared: boolean };
type DemoFilterParams = { isDemo: boolean };
type StreamableFilterParams = { isStreamable: boolean };
type SteamFeaturesFilterParams = { features: number[], mode: LogicalMode };
type AchievementsFilterParams = {
  /** 
   * @deprecated This is no longer used
   */
  completionPercentage?: number,
  threshold: number,
  thresholdType: "count" | "percent",
  condition: ThresholdCondition
}
type SdCardParams = { card: SdCardParamType | string | undefined }; //inserted card/ any card/ card uid (undefined value is legacy)

// appOverview.rt_purchased_time

export type FilterParams<T extends FilterType> =
  T extends 'collection' ? CollectionFilterParams :
  T extends 'installed' ? InstalledFilterParams :
  T extends 'regex' ? RegexFilterParams :
  T extends 'friends' ? FriendsFilterParams :
  T extends 'tags' ? TagsFilterParams :
  T extends 'whitelist' ? WhitelistFilterParams :
  T extends 'blacklist' ? BlacklistFilterParams :
  T extends 'merge' ? MergeFilterParams :
  T extends 'platform' ? PlatformFilterParams :
  T extends 'deck compatibility' ? DeckCompatFilterParams :
  T extends 'steamos compatibility' ? SteamOSCompatFilterParams :
  T extends 'review score' ? ReviewScoreFilterParams :
  T extends 'time played' ? TimePlayedFilterParams :
  T extends 'size on disk' ? SizeOnDiskFilterParams :
  T extends 'release date' ? ReleaseDateFilterParams :
  T extends 'purchase date' ? PurchaseDateFilterParams :
  T extends 'last played' ? LastPlayedFilterParams :
  T extends 'family sharing' ? FamilySharingFilterParams :
  T extends 'demo' ? DemoFilterParams :
  T extends 'streamable' ? StreamableFilterParams :
  T extends 'steam features' ? SteamFeaturesFilterParams :
  T extends 'achievements' ? AchievementsFilterParams :
  T extends 'sd card' ? SdCardParams :
  never;

export type TabFilterSettings<T extends FilterType> = {
  type: T,
  inverted: boolean,
  params: FilterParams<T>;
};

type FilterFunction = (params: FilterParams<FilterType>, appOverview: SteamAppOverview) => boolean;


/**
 * Define the deafult params for a filter type here
 * Checking and settings defaults in component is unnecessary
 */
export const FilterDefaultParams: { [key in FilterType]: FilterParams<key> } = {
  "collection": { id: "favorite", name: "Favorites" },
  "installed": { installed: true },
  "regex": { regex: "" },
  "friends": { friends: [], mode: 'and' },
  "tags": { tags: [], mode: 'and' },
  "whitelist": { games: [] },
  "blacklist": { games: [] },
  "merge": { filters: [], mode: 'and' },
  "platform": { platform: "steam" },
  "deck compatibility": { category: 3 },
  "steamos compatibility": { category: 2 },
  "review score": { scoreThreshold: 50, condition: 'above', type: 'metacritic' },
  "time played": { timeThreshold: 60, condition: 'above', units: 'minutes' },
  "size on disk": { gbThreshold: 10, condition: 'above' },
  "release date": { date: undefined, condition: 'above' },
  "purchase date": { date: undefined, condition: 'above' },
  "last played": { date: undefined, condition: 'above' },
  "family sharing": { isFamilyShared: true },
  "demo": { isDemo: true },
  "streamable": { isStreamable: true },
  "steam features": { features: [], mode: 'and' },
  "achievements": { threshold: 10, thresholdType: "percent", condition: 'above' },
  "sd card": { card: SdCardParamType.INSTALLED }
}

/**
 * Dictionary of descriptions for each filter.
 */
export const FilterDescriptions: { [filterType in FilterType]: string } = {
  collection: "Selects apps that are in a certain Steam Collection.",
  installed: "Selects apps that are installed/uninstalled.",
  regex: "Selects apps whose titles match a regular expression.",
  friends: "Selects apps that are also owned by friends.",
  tags: "Selects apps that have specific community tags.",
  whitelist: "Selects apps that are added to the list.",
  blacklist: "Selects apps that are not added to the list.",
  merge: "Selects apps that pass a subgroup of filters.",
  platform: "Selects Steam or non-Steam apps.",
  "deck compatibility": "Selects apps that have a specific Steam Deck compatibilty status.",
  "steamos compatibility": "Selects apps that have a specific SteamOS compatibilty status.",
  "review score": "Selects apps based on their metacritic/steam review score.",
  "time played": "Selects apps based on your play time.",
  "size on disk": "Selects apps based on their install size.",
  "release date": "Selects apps based on their release date.",
  "purchase date": "Selects apps based on when you purchased them.",
  "last played": "Selects apps based on when they were last played.",
  "family sharing": "Selects apps that are/aren't shared from family members.",
  demo: "Selects apps that are/aren't demos.",
  streamable: "Selects apps that can/can't be streamed from another computer.",
  achievements: "Selects apps based on their completion percentage.",
  "steam features": "Selects apps that support specific Steam Features.",
  "sd card": "Selects apps that are present on the inserted/specific MicroSD Card."
}

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
  "deck compatibility": SiSteamdeck,
  "steamos compatibility": SiSteam,
  "review score": FaAward,
  "time played": FaRegClock,
  "size on disk": FaHdd,
  "release date": FaCalendarDays,
  "purchase date": FaShoppingCart,
  "last played": BsClockHistory,
  "family sharing": FaUserPlus,
  demo: FaCompactDisc,
  streamable: FaCloudArrowDown,
  "steam features": FaListCheck,
  achievements: FaTrophy,
  "sd card": FaSdCard
}


/**
 * Whether the filter should have an invert option.
 * @param filter The filter to check.
 * @returns True if the filter can be inverted, false if not.
 */
export function canBeInverted(filter: TabFilterSettings<FilterType>): boolean {
  switch (filter.type) {
    case "regex":
    case "collection":
    case "friends":
    case "tags":
    case "merge":
    case "deck compatibility":
    case "steamos compatibility":
    case "steam features":
    case "achievements":
    case "sd card":
      return true;
    case "platform":
    case "installed":
    case "whitelist":
    case "blacklist":
    case "review score":
    case "time played":
    case "size on disk":
    case "release date":
    case "purchase date":
    case "last played":
    case "demo":
    case "family sharing":
    case "streamable":
      return false;
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
    case "regex":
      return (filter as TabFilterSettings<'regex'>).params.regex !== "";
    case "collection":
      return (filter as TabFilterSettings<'collection'>).params.id !== "" && (filter as TabFilterSettings<'collection'>).params.name !== "";
    case "friends":
      return (filter as TabFilterSettings<'friends'>).params.friends.length !== 0;
    case "tags":
      return (filter as TabFilterSettings<'tags'>).params.tags.length !== 0;
    case "whitelist":
    case "blacklist":
      return (filter as TabFilterSettings<'whitelist'>).params.games.length !== 0;
    case "merge":
      return (filter as TabFilterSettings<'merge'>).params.filters.length !== 0;
    case "release date":
    case "purchase date":
    case "last played":
      return (filter as TabFilterSettings<'release date'>).params.date !== undefined || (filter as TabFilterSettings<'release date'>).params.daysAgo !== undefined;
    case "steam features":
      return (filter as TabFilterSettings<'steam features'>).params.features.length !== 0;
    case "size on disk":
      return (filter as TabFilterSettings<'size on disk'>).params.gbThreshold !== 0;
    case "installed":
    case "platform":
    case "deck compatibility":
    case "steamos compatibility":
    case "review score":
    case "time played":
    case "demo":
    case "family sharing":
    case "streamable":
    case "achievements":
    case "sd card":
      return true;
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
      return "Unknown";
    case 1:
      return "Unsupported";
    case 2:
      return "Playable";
    case 3:
      return "Verified";
    default:
      return "";
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
      return "Unknown";
    case 1:
      return "Unsupported";
    case 2:
      return "Compatible";
    default:
      return "";
  }
}

/**
 * Gets the label for a provided steam feature.
 * @param feature The feature to get the label for.
 * @returns The label of the provided feature.
 */
export function steamFeatureToLabel(feature: number): string {
  // @ts-ignore
  return STEAM_FEATURES_ID_MAP[feature.toString()]?.display_name ?? "Unkown Steam Feature";
}

/**
 * Validates a filter to ensure it will function properly.
 * @param filter The filter to validate.
 * @returns Whether or not the filter passed, and if not, any errors it produced.
 */
export function validateFilter(filter: TabFilterSettings<FilterType>): ValidationResponse {
  if (!Object.keys(filter).includes("inverted")) filter.inverted = false;

  switch (filter.type) {
    case "collection": {
      let passed = true;
      const errors: string[] = [];
      const collectionFilter = filter as TabFilterSettings<'collection'>;

      if (collectionFilter.params.collection) {
        collectionFilter.params.id = collectionFilter.params.collection;
        delete collectionFilter.params.collection;
      }

      //* Confirm the collection still exists
      const collectionFromStores = collectionStore.GetCollection(collectionFilter.params.id);
      if (!collectionFromStores) {
        //* try to find collection by name
        if (collectionFilter.params.name) {
          const updatedIdCollection = collectionStore.userCollections.find(collection => collection.displayName === collectionFilter.params.name);
          if (updatedIdCollection) {
            collectionFilter.params.id = updatedIdCollection.id;
          } else {
            errors.push(`Collection: ${collectionFilter.params.name} no longer exists`);
            passed = false;
          }
          //* fallback to error on id if user has old config without name
        } else {
          errors.push(`Collection with id: ${collectionFilter.params.id} no longer exists`);
          passed = false;
        }
      } else if (!collectionFilter.params.name) {
        collectionFilter.params.name = collectionFromStores.displayName;
      }

      return {
        passed: passed,
        errors: errors
      };
    }
    case "merge": {
      let passed = true;
      const errors: string[] = [];
      const mergeErrorEntries: FilterErrorEntry[] = [];

      //@ts-ignore delete property from old settings version
      if (Object.keys(filter.params).includes("includesHidden")) delete (filter as TabFilterSettings<'merge'>).params.includesHidden;

      const mergeFilter = filter as TabFilterSettings<'merge'>;

      for (let i = 0; i < mergeFilter.params.filters.length; i++) {
        const filter = mergeFilter.params.filters[i];

        const validated = validateFilter(filter);

        if (!validated.passed) {
          passed = false;
          errors.push(`Filter ${i + 1} - ${validated.errors.length} ${validated.errors.length === 1 ? "error" : "errors"}`);

          let entry: FilterErrorEntry = {
            filterIdx: i,
            errors: validated.errors,
          };

          if (validated.mergeErrorEntries) entry.mergeErrorEntries = validated.mergeErrorEntries;

          mergeErrorEntries.push(entry);
        }
      }

      return {
        passed: passed,
        errors: errors,
        mergeErrorEntries: mergeErrorEntries
      };
    }
    case "sd card": {
      const cardFilter = filter as TabFilterSettings<'sd card'>;

      let passed = true;
      if (MicroSDeckInterop.isInstallOk() && window.MicroSDeck!.Enabled && typeof cardFilter.params.card === 'string') {
        const cardsAndGames = window.MicroSDeck!.CardsAndGames || [];

        if (!cardsAndGames.find(([card]) => cardFilter.params.card === card.uid)) {
          passed = false;
        }
      }
      
      return {
        passed,
        errors: passed ? [] : ["Couldn't find the selected card in the list of known cards."]
      };
    }
    case "achievements": {
      const achievementsFilter = filter as TabFilterSettings<'achievements'>;

      if (achievementsFilter.params.completionPercentage) {
        achievementsFilter.params.threshold = achievementsFilter.params.completionPercentage;
        achievementsFilter.params.thresholdType = "percent";
        delete achievementsFilter.params.completionPercentage;
      }

      return {
        passed: true,
        errors: []
      };
    }
    case "size on disk":
    case "regex":
    case "friends":
    case "tags":
    case "installed":
    case "whitelist":
    case "blacklist":
    case "platform":
    case "deck compatibility":
    case "steamos compatibility":
    case "review score":
    case "time played":
    case "release date":
    case "purchase date":
    case "last played":
    case "demo":
    case "family sharing":
    case "streamable":
    case "steam features":
    default:
      return {
        passed: true,
        errors: []
      };
  }
}

/**
 * Utility class for filtering games.
 */
export class Filter {
  private static filterFunctions = {
    collection: (params: FilterParams<'collection'>, appOverview: SteamAppOverview) => {
      return collectionStore.GetCollection(params.id).allApps.includes(appOverview);
    },
    installed: (params: FilterParams<'installed'>, appOverview: SteamAppOverview) => {
      return params.installed ? appOverview.installed : !appOverview.installed;
    },
    regex: (params: FilterParams<'regex'>, appOverview: SteamAppOverview) => {
      const regex = new RegExp(params.regex ?? "/^$/");
      return regex.test(appOverview.display_name);
    },
    friends: (params: FilterParams<'friends'>, appOverview: SteamAppOverview) => {
      const friendsWhoOwn: number[] = PluginController.getFriendsWhoOwn(appOverview.appid);

      if (params.mode === "and") {
        return params.friends.every((friend) => friendsWhoOwn.includes(friend));
      } else {
        return params.friends.some((friend) => friendsWhoOwn.includes(friend));
      }
    },
    tags: (params: FilterParams<'tags'>, appOverview: SteamAppOverview) => {
      if (params.mode === "and") {
        return params.tags.every((tag: number) => appOverview.store_tag.includes(tag));
      } else {
        return params.tags.some((tag: number) => appOverview.store_tag.includes(tag));
      }
    },
    whitelist: (params: FilterParams<'whitelist'>, appOverview: SteamAppOverview) => {
      return params.games.includes(appOverview.appid);
    },
    blacklist: (params: FilterParams<'whitelist'>, appOverview: SteamAppOverview) => {
      return !params.games.includes(appOverview.appid);
    },
    merge: (params: FilterParams<'merge'>, appOverview: SteamAppOverview) => {
      if (params.mode === "and") {
        return params.filters.every(filterSettings => Filter.run(filterSettings, appOverview));
      } else {
        return params.filters.some(filterSettings => Filter.run(filterSettings, appOverview));
      }
    },
    platform: (params: FilterParams<'platform'>, appOverview: SteamAppOverview) => {
      if (params.platform === "steam") {
        //make sure to exlcude tools: 4 and videos: 2048
        return appOverview.app_type !== 1073741824 && appOverview.app_type !== 4 && appOverview.app_type !== 2048;
      } else if (params.platform === "nonSteam") {
        return appOverview.app_type === 1073741824;
      }
      return false
    },
    "deck compatibility": (params: FilterParams<'deck compatibility'>, appOverview: SteamAppOverview) => {
      return appOverview.steam_deck_compat_category === params.category;
    },
    "steamos compatibility": (params: FilterParams<'steamos compatibility'>, appOverview: SteamAppOverview) => {
      return getSteamOSCompatCategory(appOverview) === params.category;
    },
    'review score': (params: FilterParams<'review score'>, appOverview: SteamAppOverview) => {
      const score = params.type === 'metacritic' ? appOverview.metacritic_score : appOverview.review_percentage;
      return params.condition === 'above' ? score >= params.scoreThreshold : score <= params.scoreThreshold;
    },
    'time played': (params: FilterParams<'time played'>, appOverview: SteamAppOverview) => {
      const minutesThreshold = params.units === 'minutes' ? params.timeThreshold : params.units === 'hours' ? params.timeThreshold * 60 : params.timeThreshold * 1440;
      return params.condition === 'above' ? appOverview.minutes_playtime_forever >= minutesThreshold : appOverview.minutes_playtime_forever <= minutesThreshold;
    },
    'size on disk': (params: FilterParams<'size on disk'>, appOverview: SteamAppOverview) => {
      return params.condition === 'above' ? Number(appOverview.size_on_disk) / 1024 ** 3 >= params.gbThreshold : Number(appOverview.size_on_disk) / 1024 ** 3 <= params.gbThreshold;
    },
    'release date': (params: FilterParams<'release date'>, appOverview: SteamAppOverview) => {
      let releaseTimeMs;
      if (appOverview.rt_original_release_date) releaseTimeMs = appOverview.rt_original_release_date * 1000;
      else if (appOverview.rt_steam_release_date !== 0) releaseTimeMs = appOverview.rt_steam_release_date * 1000;
      else return false;

      //by date case
      if (params.date) {
        const { day, month, year } = params.date;

        if (params.condition === 'above') {
          return releaseTimeMs >= new Date(year, (month ?? 1) - 1, day ?? 1).getTime();
        } else {
          const dateIncludes = day === undefined ? (month === undefined ? DateIncludes.yearOnly : DateIncludes.monthYear) : DateIncludes.dayMonthYear;
          switch (dateIncludes) {
            case DateIncludes.dayMonthYear:
              return releaseTimeMs < new Date(year, month! - 1, day! + 1).getTime();
            case DateIncludes.monthYear:
              return releaseTimeMs < new Date(year, month!, 1).getTime();
            case DateIncludes.yearOnly:
              return releaseTimeMs < new Date(year + 1, 0, 1).getTime();
          }
        }
        //by days ago case
      } else {
        const today = new Date();
        return params.condition === 'above' ?
          releaseTimeMs >= new Date(today.getUTCFullYear(), today.getUTCMonth(), today.getUTCDate() - params.daysAgo!).getTime() :
          releaseTimeMs < new Date(today.getUTCFullYear(), today.getUTCMonth(), today.getUTCDate() + 1 - params.daysAgo!).getTime();
      }
    },
    'purchase date': (params: FilterParams<'purchase date'>, appOverview: SteamAppOverview) => {
      let purchaseTimeMs;
      if (appOverview.rt_purchased_time) purchaseTimeMs = appOverview.rt_purchased_time * 1000;
      else return false;

      //by date case
      if (params.date) {
        const { day, month, year } = params.date;

        if (params.condition === 'above') {
          return purchaseTimeMs >= new Date(year, (month ?? 1) - 1, day ?? 1).getTime();
        } else {
          const dateIncludes = day === undefined ? (month === undefined ? DateIncludes.yearOnly : DateIncludes.monthYear) : DateIncludes.dayMonthYear;
          switch (dateIncludes) {
            case DateIncludes.dayMonthYear:
              return purchaseTimeMs < new Date(year, month! - 1, day! + 1).getTime();
            case DateIncludes.monthYear:
              return purchaseTimeMs < new Date(year, month!, 1).getTime();
            case DateIncludes.yearOnly:
              return purchaseTimeMs < new Date(year + 1, 0, 1).getTime();
          }
        }
        //by days ago case
      } else {
        const today = new Date();
        return params.condition === 'above' ?
          purchaseTimeMs >= new Date(today.getUTCFullYear(), today.getUTCMonth(), today.getUTCDate() - params.daysAgo!).getTime() :
          purchaseTimeMs < new Date(today.getUTCFullYear(), today.getUTCMonth(), today.getUTCDate() + 1 - params.daysAgo!).getTime();
      }
    },
    'last played': (params: FilterParams<'last played'>, appOverview: SteamAppOverview) => {
      const lastPlayedTimeMs = appOverview.rt_last_time_played * 1000;
      if (lastPlayedTimeMs === 0) return false;

      //by date case
      if (params.date) {
        const { day, month, year } = params.date;

        if (params.condition === 'above') {
          return lastPlayedTimeMs >= new Date(year, (month ?? 1) - 1, day ?? 1).getTime();
        } else {
          const dateIncludes = day === undefined ? (month === undefined ? DateIncludes.yearOnly : DateIncludes.monthYear) : DateIncludes.dayMonthYear;
          switch (dateIncludes) {
            case DateIncludes.dayMonthYear:
              return lastPlayedTimeMs < new Date(year, month! - 1, day! + 1).getTime();
            case DateIncludes.monthYear:
              return lastPlayedTimeMs < new Date(year, month!, 1).getTime();
            case DateIncludes.yearOnly:
              return lastPlayedTimeMs < new Date(year + 1, 0, 1).getTime();
          }
        }
        //by days ago case
      } else {
        const today = new Date();
        return params.condition === 'above' ?
          lastPlayedTimeMs >= new Date(today.getUTCFullYear(), today.getUTCMonth(), today.getUTCDate() - params.daysAgo!).getTime() :
          lastPlayedTimeMs < new Date(today.getUTCFullYear(), today.getUTCMonth(), today.getUTCDate() + 1 - params.daysAgo!).getTime();
      }
    },
    'family sharing': (params: FilterParams<'family sharing'>, appOverview: SteamAppOverview) => {
      const isInSharedCollection = collectionStore.sharedLibrariesCollections.some((collection) => {
        return collection.allApps.includes(appOverview);
      });
      return params.isFamilyShared ? isInSharedCollection : !isInSharedCollection;
    },
    demo: (params: FilterParams<'demo'>, appOverview: SteamAppOverview) => {
      return params.isDemo ? appOverview.app_type === 8 : appOverview.app_type !== 8;
    },
    streamable: (params: FilterParams<'streamable'>, appOverview: SteamAppOverview) => {
      const isStreamable = appOverview.per_client_data.some((clientData) => clientData.client_name !== "This machine" && clientData.client_name !== "" && clientData.installed);
      return params.isStreamable ? isStreamable : !isStreamable;
    },
    "steam features": (params: FilterParams<'steam features'>, appOverview: SteamAppOverview) => {
      if (params.mode === "and") {
        return params.features.every((feature: number) => appOverview.store_category.includes(feature));
      } else {
        return params.features.some((feature: number) => appOverview.store_category.includes(feature));
      }
    },
    'achievements': (params: FilterParams<'achievements'>, appOverview: SteamAppOverview) => {
      const percentage = appAchievementProgressCache.GetAchievementProgress(appOverview.appid);

      if (params.thresholdType === "percent") {
        return params.condition === 'above' ? percentage >= params.threshold : percentage <= params.threshold;
      } else {
        const entry = appAchievementProgressCache.m_achievementProgress.mapCache.get(appOverview.appid);
        
        if (entry) {
          const count = entry.unlocked;
        return params.condition === 'above' ? count >= params.threshold : count <= params.threshold;
        } else {
          LogController.error(`Unable to get achievements cache for ${appOverview.appid}`);
          return false;
        }
      }
    },
    'sd card': (params: FilterParams<'sd card'>, appOverview: SteamAppOverview) => {
      const isOnCard = (card: CardAndGames) => !!card[1].find((game) => +game.uid == appOverview.appid);
      let card: CardAndGames | undefined;
      switch (params.card) {
        case SdCardParamType.ANY:
          return window.MicroSDeck?.CardsAndGames?.find(isOnCard);
        case SdCardParamType.INSTALLED:
        case undefined:
          card = window.MicroSDeck?.CurrentCardAndGames;
          break;
        default:
          card = window.MicroSDeck?.CardsAndGames?.find(([card]) => card.uid == params.card);
      }
      if (!card) return false;
      return isOnCard(card);
    }
  };

  /**
   * Removes filters that are of unknown types.
   * @param filters Array of tabs filters.
   * @returns 
   */
  static removeUnknownTypes(filters?: TabFilterSettings<FilterType>[]) {
    if (!filters) return undefined;
    const knownFilterTypes = Object.keys(Filter.filterFunctions);
    return filters.flatMap(filter => {
      if (filter.type === 'merge') {
        const mergeFilter = {...filter} as TabFilterSettings<'merge'>;
        mergeFilter.params.filters = this.removeUnknownTypes(mergeFilter.params.filters)!;
        return mergeFilter;
      }
      return knownFilterTypes.includes(filter.type) ? filter : [];
    });
  }

  /**
   * Checks if a game passes a given filter.
   * @param filterSettings The filter to run.
   * @param appOverview The app to check
   * @returns True if the app meets the filter criteria.
   */
  static run(filterSettings: TabFilterSettings<FilterType>, appOverview: SteamAppOverview): boolean {
    const shouldInclude = (this.filterFunctions[filterSettings.type] as FilterFunction)(filterSettings.params, appOverview);
    return filterSettings.inverted ? !shouldInclude : shouldInclude;
  }
}
