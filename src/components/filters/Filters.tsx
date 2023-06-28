import { PluginController } from "../../lib/controllers/PluginController"

export type FilterType = 'collection' | 'installed' | 'regex' | 'friends' | 'tags' | 'whitelist' | 'blacklist' | 'group';

type CollectionFilterParams = { collection: SteamCollection['id'] };
type InstalledFilterParams = { installed: boolean };
type RegexFilterParams = { regex: string };
type FriendsFilterParams = { friends: number[], mode: string };
type TagsFilterParams = { tags: number[], mode: string };
type WhitelistFilterParams = { games: number[] }
type BlacklistFilterParams = { games: number[] }
type GroupFilterParams = { filters: TabFilterSettings<FilterType>[], mode: 'and' | 'or' }

type FilterParams<T extends FilterType> =
  T extends 'collection' ? CollectionFilterParams :
  T extends 'installed' ? InstalledFilterParams :
  T extends 'regex' ? RegexFilterParams :
  T extends 'friends' ? FriendsFilterParams :
  T extends 'tags' ? TagsFilterParams :
  T extends 'whitelist' ? WhitelistFilterParams :
  T extends 'blacklist' ? BlacklistFilterParams :
  T extends 'group' ? GroupFilterParams :
  never

export type TabFilterSettings<T extends FilterType> = {
  type: T,
  params: FilterParams<T>
}

type FilterFunction = (params: FilterParams<FilterType>, appOverview: SteamAppOverview) => boolean;

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
    group: (params: FilterParams<'group'>, appOverView: SteamAppOverview) => {
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