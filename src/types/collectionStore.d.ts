// Types for the collectionStore global

type CollectionStore = {
	userCollections: SteamCollection[],
  deckDesktopApps: Collection,
  userCollections: Collection[],
  localGamesCollection: Collection,
  allAppsCollection: Collection,
  BIsHidden: (appId: number) => boolean,
  SetAppsAsHidden: (appIds: number[], hide: boolean) => void,
	GetUserCollectionsByName: (name: string) => SteamCollection[]
}

type SteamCollection = {
  AsDeletableCollection: ()=>null
  AsDragDropCollection: ()=>null
  AsEditableCollection: ()=>null
  GetAppCountWithToolsFilter: (t:any) => any
  allApps: SteamAppOverview[]
  apps: Map<number, SteamAppOverview>
  bAllowsDragAndDrop: boolean
  bIsDeletable: boolean
  bIsDynamic: boolean
  bIsEditable: boolean
  displayName: string
  id: string,
  visibleApps: SteamAppOverview[]
}

type Collection = {
  AsDeletableCollection: () => null,
  AsDragDropCollection: () => null,
  AsEditableCollection: () => null,
  GetAppCountWithToolsFilter: (t) => any,
  allApps: SteamAppOverview[],
  apps: Map<number, SteamAppOverview>,
  bAllowsDragAndDrop: boolean,
  bIsDeletable: boolean,
  bIsDynamic: boolean,
  bIsEditable: boolean,
  displayName: string,
  id: string,
  visibleApps: SteamAppOverview[]
}