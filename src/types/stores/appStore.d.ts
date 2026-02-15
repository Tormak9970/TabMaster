// Types for the global appStore

type StoreTagLocalizationEntry = {
    tagid: number
    name: string
}

// TODO: remove this once 3.6.22 hits stable
type DepreciatedStoreTagLocalizationMap = Map<number, StoreTagLocalizationEntry>

type StoreTagLocalizationMap = DepreciatedStoreTagLocalizationMap | Record<number, string>

type AppStore = {
    GetAppOverviewByAppID: (appId: number) => SteamAppOverview | null
    m_mapStoreTagLocalization: StoreTagLocalizationMap
}
