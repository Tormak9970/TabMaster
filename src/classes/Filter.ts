export class Filter {
    static filterFunctions = {
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
        }
    }

    static run(filterSettings: TabFilterSettings<FilterType>, appOverview: SteamAppOverview) {
        return (this.filterFunctions[filterSettings.type] as (params: FilterParams<FilterType>, appOverview: SteamAppOverview) => boolean)(filterSettings.params, appOverview);
    }
}