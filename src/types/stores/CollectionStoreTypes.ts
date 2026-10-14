// Types for the collectionStore global

import { SteamAppOverview } from '../steam-client'

export type AppCollectionType = 'type-games' | 'type-software' | 'type-music' | 'type-videos' | 'type-tools'

export type CollectionStore = {
    appTypeCollectionMap: Map<AppCollectionType, Collection>
    userCollections: SteamCollection[]
    allGamesCollection: Collection
    deckDesktopApps: Collection | null
    sharedLibrariesCollections: Collection[]
    localGamesCollection: Collection
    allAppsCollection: Collection
    BIsHidden: (appId: number) => boolean
    SetAppsAsHidden: (appIds: number[], hide: boolean) => void
    GetUserCollectionsByName: (name: string) => SteamCollection[]
    GetCollectionListForAppID: (appId: number) => Collection[]
    GetCollection: (id: SteamCollection['id']) => Collection
}

export type SteamCollection = {
    AsDeletableCollection: () => null
    AsDragDropCollection: () => null
    AsEditableCollection: () => null
    GetAppCountWithToolsFilter: (t: any) => any
    allApps: SteamAppOverview[]
    apps: Map<number, SteamAppOverview>
    bAllowsDragAndDrop: boolean
    bIsDeletable: boolean
    bIsDynamic: boolean
    bIsEditable: boolean
    displayName: string
    id: string
    visibleApps: SteamAppOverview[]
}

export type Collection = {
    AsDeletableCollection: () => null
    AsDragDropCollection: () => null
    AsEditableCollection: () => null
    GetAppCountWithToolsFilter: (t: any) => any
    allApps: SteamAppOverview[]
    apps: Map<number, SteamAppOverview>
    bAllowsDragAndDrop: boolean
    bIsDeletable: boolean
    bIsDynamic: boolean
    bIsEditable: boolean
    displayName: string
    id: string
    visibleApps: SteamAppOverview[]
}
