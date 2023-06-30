import { PluginController } from "../../lib/controllers/PluginController"

export type FilterType = 'collection' | 'installed' | 'regex' | 'friends' | 'tags' | 'whitelist' | 'blacklist' | 'merge';

type CollectionFilterParams = { collection: SteamCollection['id'] };
type InstalledFilterParams = { installed: boolean };
type RegexFilterParams = { regex: string };
type FriendsFilterParams = { friends: number[], mode: LogicalMode };
type TagsFilterParams = { tags: number[], mode: LogicalMode };
type WhitelistFilterParams = { games: number[] }
type BlacklistFilterParams = { games: number[] }
type MergeFilterParams = { filters: TabFilterSettings<FilterType>[], mode: LogicalMode }

export type FilterParams<T extends FilterType> =
  T extends 'collection' ? CollectionFilterParams :
  T extends 'installed' ? InstalledFilterParams :
  T extends 'regex' ? RegexFilterParams :
  T extends 'friends' ? FriendsFilterParams :
  T extends 'tags' ? TagsFilterParams :
  T extends 'whitelist' ? WhitelistFilterParams :
  T extends 'blacklist' ? BlacklistFilterParams :
  T extends 'merge' ? MergeFilterParams :
  never

export type TabFilterSettings<T extends FilterType> = {
  type: T,
  params: FilterParams<T>
}

type FilterFunction = (params: FilterParams<FilterType>, appOverview: SteamAppOverview) => boolean;

/**
 * Define the deafult params for a filter type here
 * Checking and settings defaults in component is unnecessary
 */
export const FilterDefaultParams: { [key in FilterType]: FilterParams<key> } = {
  "collection": { collection: "" },
  "installed": { installed: false },
  "regex": { regex: "" },
  "friends": { friends: [], mode: 'and' },
  "tags": { tags: [], mode: 'and' },
  "whitelist": { games: [] },
  "blacklist": { games: [] },
  "merge": { filters: [], mode: 'and' }
};

/**
 * Checks if the user has made any changes to a filter.
 * @param filter The filter to check.
 * @returns True if the filter is the default (wont filter anything).
 */
export function isDefaultParams(filter: TabFilterSettings<FilterType>): boolean {
  switch (filter.type) {
    case "regex":
      return (filter as TabFilterSettings<'regex'>).params.regex == "";
    case "collection":
      return (filter as TabFilterSettings<'collection'>).params.collection === "";
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
  }
}

/**
 * Utility class for filtering games.
 */
export class Filter {
  private static filterFunctions = {
    collection: (params: FilterParams<'collection'>, appOverview: SteamAppOverview) => {
      const collection = collectionStore.GetCollection(params.collection);
      return collectionStore.GetCollectionListForAppID(appOverview.appid).includes(collection);
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
    merge: (params: FilterParams<'merge'>, appOverView: SteamAppOverview) => {
      if (params.mode === "and") {
        return params.filters.every(filterSettings => Filter.run(filterSettings, appOverView));
      } else {
        return params.filters.some(filterSettings => Filter.run(filterSettings, appOverView));
      }
    }
  }
  /**
   * Checks if a game passes a given filter.
   * @param filterSettings The filter to run.
   * @param appOverview The app to check
   * @returns True if the app meets the filter criteria.
   */
  static run(filterSettings: TabFilterSettings<FilterType>, appOverview: SteamAppOverview): boolean {
    return (this.filterFunctions[filterSettings.type] as FilterFunction)(filterSettings.params, appOverview);
  }
}