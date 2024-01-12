// Types for the global appStore

type StoreTagLocalizationEntry = {
  /**
   * @deprecated Replaced by data_. Used before Dec 13 2023 on the stable Steam Client Channel, while it used MobX 5.x.x (now uses 6.x.x).
   */
  value: string,
  value_: string //? This is the string of the tag
}

type StoreTagLocalizationMap = {
  /**
   * @deprecated Replaced by data_. Used before Dec 13 2023 on the stable Steam Client Channel, while it used MobX 5.x.x (now uses 6.x.x).
   */
  _data?: Map<number, StoreTagLocalizationEntry>
  data_?: Map<number, StoreTagLocalizationEntry>
}

type AppStore = {
  GetAppOverviewByAppID: (appId: number) => SteamAppOverview | null;
  m_mapStoreTagLocalization: StoreTagLocalizationMap
}
