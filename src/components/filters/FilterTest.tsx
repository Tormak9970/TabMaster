type FilterType = 'collection' | 'installed' | 'regex'
type CollectionFilterParams = { collection: SteamCollection }
type InstalledFilterParams = { installed: boolean }
type RegexFilterParams = { regex: string }

type FilterParams<T extends FilterType> =
  T extends 'collection' ? CollectionFilterParams :
  T extends 'installed' ? InstalledFilterParams :
  T extends 'regex' ? RegexFilterParams :
  never

type TabFilterSettings<T extends FilterType> = {
  type: T
  params: FilterParams<T>
}

export class Filter {
  static filterFunctions = {
    collection: (params: FilterParams<'collection'>, appOverview: SteamAppOverview) => {
      return params.collection?.allApps.find((value: any) => value.appid === appOverview.appid) !== undefined && params.collection?.visibleApps.find((value: any) => value.appid === appOverview.appid) !== undefined;
    },
    installed: (params: FilterParams<'installed'>, appOverview: SteamAppOverview) => {
      return params.installed ? appOverview.installed : !appOverview.installed;
    },
    regex: (params: FilterParams<'regex'>, appOverview: SteamAppOverview) => {
      const regex = new RegExp(params.regex ?? "/^$/");
      return regex.test(appOverview.display_name);
    }
  }

  static run(filterSettings: TabFilterSettings<FilterType>, appOverview: SteamAppOverview) {
    (this.filterFunctions[filterSettings.type] as (params: FilterParams<FilterType>, appOverview: SteamAppOverview) => boolean)(filterSettings.params, appOverview);
  }
}