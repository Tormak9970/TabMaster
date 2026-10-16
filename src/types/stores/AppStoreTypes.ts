// Types for the global appStore

import { SteamAppOverview } from '../steam-client'

export type StoreTagLocalizationMap = Record<string, string>

export type AppStore = {
    GetAppOverviewByAppID: (appId: number) => SteamAppOverview | null
    m_mapStoreTagLocalization: StoreTagLocalizationMap
}
