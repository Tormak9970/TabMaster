import { PluginController } from "../../lib/controllers/PluginController"

export type FilterType = 'collection' | 'installed' | 'regex' | 'friends' | 'tags'

type CollectionFilterParams = { collection: SteamCollection }
type InstalledFilterParams = { installed: boolean }
type RegexFilterParams = { regex: string }
type FriendsFilterParams = { friends: number[] }
type TagsFilterParams = { tags: number[] }

type FilterParams<T extends FilterType> =
  T extends 'collection' ? CollectionFilterParams :
  T extends 'installed' ? InstalledFilterParams :
  T extends 'regex' ? RegexFilterParams :
  T extends 'friends' ? FriendsFilterParams :
  T extends 'tags' ? TagsFilterParams :
  never

export type TabFilterSettings<T extends FilterType> = {
  type: T
  params: FilterParams<T>
}

type FilterFunction = (params: FilterParams<FilterType>, appOverview: SteamAppOverview) => boolean

export class Filter {
  private static filterFunctions = {
    collection: (params: FilterParams<'collection'>, appOverview: SteamAppOverview) => {
      return params.collection?.allApps.find((value: any) => value.appid === appOverview.appid) !== undefined && params.collection?.visibleApps.find((value: any) => value.appid === appOverview.appid) !== undefined;
    },
    installed: (params: FilterParams<'installed'>, appOverview: SteamAppOverview) => {
      return params.installed ? appOverview.installed : !appOverview.installed;
    },
    regex: (params: FilterParams<'regex'>, appOverview: SteamAppOverview) => {
      const regex = new RegExp(params.regex ?? "/^$/");
      return regex.test(appOverview.display_name);
    },
    friends: (params: FilterParams<'friends'>, appOverview: SteamAppOverview) => {
      return false;
    },
    tags: (params: FilterParams<'tags'>, appOverview: SteamAppOverview) => {
      return params.tags.every((tag: number) => appOverview.store_tag.includes(tag));
    },
  }

  static run(filterSettings: TabFilterSettings<FilterType>, appOverview: SteamAppOverview): boolean {
    return (this.filterFunctions[filterSettings.type] as FilterFunction)(filterSettings.params, appOverview);
  }
}