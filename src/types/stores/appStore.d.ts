// Types for the global appStore

type StoreTagLocalizationEntry = {
  value: string //? This is the string of the tag
}

type StoreTagLocalizationMap = {
  _data: Map<number, StoreTagLocalizationEntry>
}

type AppStore = {
  GetAppOverviewByAppID: (appId: number) => SteamAppOverview | null;
  m_mapStoreTagLocalization: StoreTagLocalizationMap
}