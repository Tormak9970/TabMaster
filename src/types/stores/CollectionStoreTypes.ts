// Types for the collectionStore global

import { SteamAppOverview } from '../steam-client'

export type AppCollectionType = 'type-games' | 'type-software' | 'type-music' | 'type-videos' | 'type-tools'

export type CollectionStore = {
    appTypeCollectionMap: Map<AppCollectionType, SteamCollection>
    userCollections: SteamCollection[]
    allGamesCollection: SteamCollection
    deckDesktopApps: SteamCollection | null
    sharedLibrariesCollections: SteamCollection[]
    localGamesCollection: SteamCollection
    allAppsCollection: SteamCollection
    BIsHidden: (appId: number) => boolean
    SetAppsAsHidden: (appIds: number[], hide: boolean) => void
    GetUserCollectionsByName: (name: string) => SteamCollection[]
    GetCollectionListForAppID: (appId: number) => SteamCollection[]
    GetCollection: (id: SteamCollection['id']) => SteamCollection
    /**
     * Creates a new Steam Collection.
     * @param name The name of the collection.
     * @param filter Not sure, I assume it has to do with dynamic collections.
     * @param apps The app Overviews to add.
     */
    NewUnsavedCollection(name: string, filter: any, apps: SteamAppOverview[]): SteamCollection
}

export type SteamCollection = {
    AsDeletableCollection: () => null
    AsDragDropCollection: () => null
    AsEditableCollection: () => null
    GetAppCountWithToolsFilter: (t: any) => any
    AddApps(apps: SteamAppOverview[]): void
    RemoveApps(apps: SteamAppOverview[]): void
    Save(): Promise<void>
    Delete(): Promise<void>

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
