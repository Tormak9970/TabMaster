import { PluginController } from "../../lib/controllers/PluginController";
import { DateIncludes, DateObj } from '../generic/DatePickers';

export type FilterType = 'collection' | 'installed' | 'regex' | 'friends' | 'tags' | 'whitelist' | 'blacklist' | 'merge' | 'platform' | 'deck compatibility' | 'review score' | 'time played' | 'size on disk' | 'release date' | 'last played' | 'demo' | 'streamable' | 'sd card';

export type TimeUnit = 'minutes' | 'hours' | 'days';
export type ThresholdCondition = 'above' | 'below';
export type ReviewScoreType = 'metacritic' | 'steampercent';

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
type InstalledFilterParams = { installed: boolean; };
type RegexFilterParams = { regex: string; };
type FriendsFilterParams = { friends: number[], mode: LogicalMode; };
type TagsFilterParams = { tags: number[], mode: LogicalMode; };
type WhitelistFilterParams = { games: number[]; };
type BlacklistFilterParams = { games: number[]; };
type MergeFilterParams = { filters: TabFilterSettings<FilterType>[], mode: LogicalMode; };
type PlatformFilterParams = { platform: SteamPlatform; };
type DeckCompatFilterParams = { category: number; };
type ReviewScoreFilterParams = { scoreThreshold: number, condition: ThresholdCondition, type: ReviewScoreType; };
type TimePlayedFilterParams = { timeThreshold: number, condition: ThresholdCondition, units: TimeUnit; };
type SizeOnDiskFilterParams = { gbThreshold: number, condition: ThresholdCondition; };
type ReleaseDateFilterParams = { date?: DateObj, daysAgo?: number, condition: ThresholdCondition; };
type LastPlayedFilterParams = { date?: DateObj, daysAgo?: number, condition: ThresholdCondition; };
type DemoFilterParams = { isDemo: boolean; };
type StreamableFilterParams = { isStreamable: boolean; };
type SdCardParams = { cardId: string } //use 'inserted' for currently inserted card

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
  T extends 'review score' ? ReviewScoreFilterParams :
  T extends 'time played' ? TimePlayedFilterParams :
  T extends 'size on disk' ? SizeOnDiskFilterParams :
  T extends 'release date' ? ReleaseDateFilterParams :
  T extends 'last played' ? LastPlayedFilterParams :
  T extends 'demo' ? DemoFilterParams :
  T extends 'streamable' ? StreamableFilterParams :
  T extends 'sd card' ? SdCardParams :
  never;

export type TabFilterSettings<T extends FilterType> = {
  type: T,
  inverted: boolean,
  params: FilterParams<T>;
};

type FilterFunction = (params: FilterParams<FilterType>, appOverview: SteamAppOverview) => boolean;

/**
 * Set the Description for a filter type here
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
  "review score": "Selects apps based on their metacritic/steam review score.",
  "time played": "Selects apps based on your play time.",
  "size on disk": "Selects apps based on their install size.",
  "release date": "Selects apps based on their release date.",
  "last played": "Selects apps based on when they were last played.",
  demo: "Selects apps that are/aren't demos.",
  streamable: "Selects apps that can/can't be streamed from another computer.",
  "sd card": "Selects apps that are present on the inserted/ specific MicroSD Card",
}

/**
 * Define the deafult params for a filter type here
 * Checking and settings defaults in component is unnecessary
 */
export const FilterDefaultParams: { [key in FilterType]: FilterParams<key> } = {
  "collection": { id: "", name: "" },
  "installed": { installed: true },
  "regex": { regex: "" },
  "friends": { friends: [], mode: 'and' },
  "tags": { tags: [], mode: 'and' },
  "whitelist": { games: [] },
  "blacklist": { games: [] },
  "merge": { filters: [], mode: 'and' },
  "platform": { platform: "steam" },
  "deck compatibility": { category: 3 },
  "review score": { scoreThreshold: 50, condition: 'above', type: 'metacritic' },
  "time played": { timeThreshold: 60, condition: 'above', units: 'minutes' },
  "size on disk": { gbThreshold: 10, condition: 'above' },
  "release date": { date: undefined, condition: 'above' },
  "last played": { date: undefined, condition: 'above' },
  "demo": { isDemo: true },
  "streamable": { isStreamable: true },
  "sd card": { cardId: 'inserted' },
};

/**
 * Which plugin needs to be installed for this filter to be active
 */
export const FilterPluginSource: { [key in FilterType]?: string } = {
  "sd card": "MicroSDeck",
};

/**
 * Whether the filter is disabled (cannot be selected or run)
 * @param filter The filter to check.
 * @returns True if the filter should be considered disabled
 */
export function isFilterDisabled(filter: FilterType): boolean {
  switch (filter) {
    case "sd card":
      return !MicroSDeck
    default:
      return false;
  }
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
    case "last played":
    case "demo":
    case "streamable":
      return false;
  }
}

//* I changed this from 'isDefaultParams' because some default params can still be valid
//* make sure the check is the inversion from before going forward
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
    case "last played":
      return (filter as TabFilterSettings<'release date'>).params.date !== undefined || (filter as TabFilterSettings<'release date'>).params.daysAgo !== undefined;
    case "installed":
    case "platform":
    case "deck compatibility":
    case "review score":
    case "time played":
    case "size on disk":
    case "demo":
    case "streamable":
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
      if (PluginController.microSDeckInstalled) {
        const cardsAndGames = MicroSDeck?.CardsAndGames;

        if (!cardsAndGames?.find(([card]) => cardFilter.params.cardId === card.uid)) {
          passed = false;
        }
      }
      return {
        passed,
        errors: passed ? [] : ["Couldn't find the selected card in the list of known cards."]
      };
    }
    case "regex":
    case "friends":
    case "tags":
    case "installed":
    case "whitelist":
    case "blacklist":
    case "platform":
    case "deck compatibility":
    case "review score":
    case "time played":
    case "size on disk":
    case "release date":
    case "last played":
    case "demo":
    case "streamable":
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
    demo: (params: FilterParams<'demo'>, appOverview: SteamAppOverview) => {
      return params.isDemo ? appOverview.app_type === 8 : appOverview.app_type !== 8;
    },
    streamable: (params: FilterParams<'streamable'>, appOverview: SteamAppOverview) => {
      const isStreamable = appOverview.per_client_data.some((clientData) => clientData.client_name !== "This machine" && clientData.installed);
      return params.isStreamable ? isStreamable : !isStreamable;
    },
    'sd card': (params: FilterParams<'sd card'>, appOverview: SteamAppOverview) => {
      const card = params.cardId === 'inserted' ? MicroSDeck?.CurrentCardAndGames : MicroSDeck?.CardsAndGames?.find(([card]) => card.uid == params.cardId);

      if (!card) return false;

      return !!card[1].find((game) => +game.uid == appOverview.appid);
    },
  };

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
