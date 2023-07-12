import { PluginController } from "../../lib/controllers/PluginController"

export type FilterType = 'collection' | 'installed' | 'regex' | 'friends' | 'tags' | 'whitelist' | 'blacklist' | 'merge' | 'platform' | 'deck compatibility';

type CollectionFilterParams = {
  id: SteamCollection['id'],
  /**
   * Always present as of v1.2.2 onward
   */
  name?: string,
  /**
   * @deprecated Replaced by id. Used pre v1.2.2
   */
  collection?: SteamCollection['id']
};
type InstalledFilterParams = { installed: boolean };
type RegexFilterParams = { regex: string };
type FriendsFilterParams = { friends: number[], mode: LogicalMode };
type TagsFilterParams = { tags: number[], mode: LogicalMode };
type WhitelistFilterParams = { games: number[] }
type BlacklistFilterParams = { games: number[] }
type MergeFilterParams = { filters: TabFilterSettings<FilterType>[], mode: LogicalMode, includesHidden: boolean }
type PlatformFilterParams = { platform: SteamPlatform }
type DeckCompatFilterParams = { category: number }

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
  never

export type TabFilterSettings<T extends FilterType> = {
  type: T,
  inverted: boolean,
  params: FilterParams<T>
}

type FilterFunction = (params: FilterParams<FilterType>, appOverview: SteamAppOverview, includesHidden?: boolean) => boolean;

/**
 * Define the deafult params for a filter type here
 * Checking and settings defaults in component is unnecessary
 */
export const FilterDefaultParams: { [key in FilterType]: FilterParams<key> } = {
  "collection": { id: "", name: "" },
  "installed": { installed: false },
  "regex": { regex: "" },
  "friends": { friends: [], mode: 'and' },
  "tags": { tags: [], mode: 'and' },
  "whitelist": { games: [] },
  "blacklist": { games: [] },
  "merge": { filters: [], mode: 'and', includesHidden: false },
  "platform": { platform: "steam" },
  "deck compatibility": { category: 3 }
};

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
      return true;
    case "platform":
    case "installed":
    case "whitelist":
    case "blacklist":
      return false;
  }
}

/**
 * Checks if the user has made any changes to a filter.
 * @param filter The filter to check.
 * @returns True if the filter is the default (wont filter anything).
 */
export function isDefaultParams(filter: TabFilterSettings<FilterType>): boolean {
  switch (filter.type) {
    case "regex":
      return (filter as TabFilterSettings<'regex'>).params.regex === "";
    case "collection":
      return (filter as TabFilterSettings<'collection'>).params.id === "" || (filter as TabFilterSettings<'collection'>).params.name === "";
    case "friends":
      return (filter as TabFilterSettings<'friends'>).params.friends.length === 0;
    case "tags":
      return (filter as TabFilterSettings<'tags'>).params.tags.length === 0;
    case "installed":
    case "whitelist":
    case "blacklist":
      return false
    case "merge":
      return (filter as TabFilterSettings<'merge'>).params.filters.length === 0
    case "platform":
    case "deck compatibility":
      return false
  }
}

/**
 * Gets the label for a provided deck verified category.
 * @param category The category to get the label for.
 * @returns The label of the provided category.
 */
export function categoryToLabel(category: number): string {
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
        if(collectionFilter.params.name){
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
      }
    }
    case "merge": {
      let passed = true;
      const errors: string[] = [];
      const mergeErrorEntries: FilterErrorEntry[] = []

      if (!Object.keys(filter.params).includes("includesHidden")) (filter as TabFilterSettings<'merge'>).params.includesHidden = false;
      const mergeFilter = filter as TabFilterSettings<'merge'>;

      for (let i = 0; i < mergeFilter.params.filters.length; i++) {
        const filter = mergeFilter.params.filters[i];

        const validated = validateFilter(filter);

        if (!validated.passed) {
          passed = false;
          errors.push(`Filter ${i+1} - ${validated.errors.length} ${validated.errors.length === 1 ? "error" : "errors"}`);
          
          let entry: FilterErrorEntry = {
            filterIdx: i,
            errors: validated.errors,
          }

          if (validated.mergeErrorEntries) entry.mergeErrorEntries = validated.mergeErrorEntries;
          
          mergeErrorEntries.push(entry);
        }
      }

      return {
        passed: passed,
        errors: errors,
        mergeErrorEntries: mergeErrorEntries
      }
    }
    case "regex":
    case "friends":
    case "tags":
    case "installed":
    case "whitelist":
    case "blacklist":
    case "platform":
    case "deck compatibility":
      return {
        passed: true,
        errors: []
      }
    }
}

/**
 * Utility class for filtering games.
 */
export class Filter {
  private static filterFunctions = {
    collection: (params: FilterParams<'collection'>, appOverview: SteamAppOverview, includesHidden: boolean) => {
      return collectionStore.GetCollection(params.id)[includesHidden ? "allApps" : "visibleApps"].includes(appOverview);
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
        return params.filters.every(filterSettings => Filter.run(filterSettings, appOverview, params.includesHidden));
      } else {
        return params.filters.some(filterSettings => Filter.run(filterSettings, appOverview, params.includesHidden));
      }
    },
    platform: (params: FilterParams<'platform'>, appOverview: SteamAppOverview, includesHidden: boolean) => {
      let collection = null;

      if (params.platform === "steam") {
        collection = collectionStore.allGamesCollection[includesHidden ? "allApps" : "visibleApps"];
      } else if (params.platform === "nonSteam") {
        collection = collectionStore.deckDesktopApps?.[includesHidden ? "allApps" : "visibleApps"] ?? collectionStore.localGamesCollection[includesHidden ? "allApps" : "visibleApps"].filter((overview) => overview.app_type === 1073741824);
      }

      return collection ? collection.includes(appOverview) : false;
    },
    "deck compatibility": (params: FilterParams<'deck compatibility'>, appOverview: SteamAppOverview) => {
      return appOverview.steam_deck_compat_category === params.category;
    }
  }

  /**
   * Checks if a game passes a given filter.
   * @param filterSettings The filter to run.
   * @param appOverview The app to check
   * @param includesHideen Whether this filter should include hidden games
   * @returns True if the app meets the filter criteria.
   */
  static run(filterSettings: TabFilterSettings<FilterType>, appOverview: SteamAppOverview, includesHidden: boolean): boolean {
    const shouldInclude = (this.filterFunctions[filterSettings.type] as FilterFunction)(filterSettings.params, appOverview, includesHidden);
    return filterSettings.inverted ? !shouldInclude : shouldInclude;
  }
}
