// Types for the global appStore

type StoreTagLocalizationEntry = {
  tagid: number;
  name: string;
}

type StoreTagLocalizationMap = Map<number, StoreTagLocalizationEntry>;

type AppStore = {
  GetAppOverviewByAppID: (appId: number) => SteamAppOverview | null;
  m_mapStoreTagLocalization: StoreTagLocalizationMap
}
