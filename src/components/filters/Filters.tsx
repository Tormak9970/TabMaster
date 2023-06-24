export type FilterType = 'collection' | 'installed' | 'regex' | 'friends' | 'tags'

type CollectionFilterParams = { collection: SteamCollection['id'] }
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
      const collection = collectionStore.GetCollection(params.collection)
      return collectionStore.GetCollectionListForAppID(appOverview.appid).includes(collection)
    },
    installed: (params: FilterParams<'installed'>, appOverview: SteamAppOverview) => {
      return params.installed ? appOverview.installed : !appOverview.installed;
    },
    regex: (params: FilterParams<'regex'>, appOverview: SteamAppOverview) => {
      const regex = new RegExp(params.regex ?? "/^$/");
      return regex.test(appOverview.display_name);
    },
    friends: (params: FilterParams<'friends'>, appOverview: SteamAppOverview) => {
      // TODO: get friends who have played/own this game
      const friendsWhoOwn: number[] = [];
      return params.friends.every((friend) => friendsWhoOwn.includes(friend));
    },
    tags: (params: FilterParams<'tags'>, appOverview: SteamAppOverview) => {
      return params.tags.every((tag: number) => appOverview.store_tag.includes(tag));
    },
  }

  static run(filterSettings: TabFilterSettings<FilterType>, appOverview: SteamAppOverview): boolean {
    return (this.filterFunctions[filterSettings.type] as FilterFunction)(filterSettings.params, appOverview);
  }
}