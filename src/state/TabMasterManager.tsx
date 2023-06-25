import { EditableTabSettings } from "../components/EditTabModal";
import { TabFilterSettings, FilterType } from "../components/filters/Filters";
import { PythonInterop } from "../lib/controllers/PythonInterop";
import { CustomTabContainer } from "../components/CustomTabContainer";
import { v4 as uuidv4 } from "uuid";
import { reaction } from "mobx"
import { getNonBigIntUserId } from "../lib/Utils";

export const defaultTabsSettings: TabSettingsDictionary = {
  DeckGames: {
    id: "DeckGames",
    title: "Great On Deck",
    position: 0,
  },
  AllGames: {
    id: "AllGames",
    title: "All Games",
    position: 1,
  },
  Installed: {
    id: "Installed",
    title: "Installed",
    position: 2,
  },
  Favorites: {
    id: "Favorites",
    title: "Favorites",
    position: 3,
  },
  Collections: {
    id: "Collections",
    title: "Collections",
    position: 4,
  },
  DesktopApps: {
    id: "DesktopApps",
    title: "Non-Steam",
    position: 5,
  },
  Soundtracks: {
    id: "Soundtracks",
    title: "Soundtracks",
    position: 6,
  }
}

export class TabMasterManager {
  private tabsMap: Map<string, TabContainer>;
  private visibleTabsList: TabContainer[] = [];
  private hiddenTabsList: TabContainer[] = [];

  private hasLoaded: boolean;

  private currentUsersFriends: FriendEntry[] = [];
  private friendsGameMap: Map<number, number[]> = new Map();
  private allStoreTags: TagResponse[] = [];
  private userHasFavorites: boolean = false;

  public eventBus = new EventTarget();
  private collectionLengths: { [collectionId: string]: number } = {}

  constructor() {
    this.hasLoaded = false;
    this.tabsMap = new Map<string, TabContainer>();

    //* subscribe to user collection updates
    reaction(() => collectionStore.userCollections, (userCollections: SteamCollection[]) => {
      if (!this.hasLoaded) return

      // console.log("We reacted to user collection changes!");
      const userHadFavorites = this.userHasFavorites;
      const favoritesCollection = collectionStore.GetCollection("favorite");

      let depsToRebuild: string[] = [];

      if (!userHadFavorites && favoritesCollection && favoritesCollection.allApps.length != 0) {
        this.userHasFavorites = true
        const favoriteTabContainer = { ...defaultTabsSettings.Favorites, position: this.visibleTabsList.length }
        this.visibleTabsList.push(this.addDefaultTabContainer(favoriteTabContainer));
        this.update()
      }
      if (userHadFavorites && (!favoritesCollection || favoritesCollection.allApps.length === 0)) {
        this.userHasFavorites = false
        this.deleteTab('Favorites')
      }

      //* check if contents of any collection changed
      for (const collection of userCollections) {
        if (collection && this.collectionLengths[collection.id] != collection.allApps.length) {
          this.collectionLengths[collection.id] = collection.allApps.length;
          depsToRebuild.push(collection.id);
        }
      }

      if (depsToRebuild.length != 0) {
        this.visibleTabsList.forEach((tabContainer) => {
          if (tabContainer.filters && tabContainer.filters.length != 0) {
            const collectionFilters = tabContainer.filters.filter((filter: TabFilterSettings<FilterType>) => filter.type === "collection").map((collectionFilter) => collectionFilter.params.collection);
            for (const collectionUpdated of depsToRebuild) {
              if (collectionFilters.includes(collectionUpdated)) {
                (tabContainer as CustomTabContainer).buildCollection();
                break;
              }
            }
          }
        });
      }
    }, { delay: 50 });

    //* subscribe to hidden collection updates
    reaction(() => collectionStore.GetCollection("hidden").allApps, (allApps: SteamAppOverview[]) => {
      if (!this.hasLoaded) return
      
      // console.log("We reacted to hidden collection changes!");
      let shouldRebuildCollections = false;

      if (!allApps && this.collectionLengths["hidden"] != 0) {
        this.collectionLengths["hidden"] = 0;
        shouldRebuildCollections = true;
      } else if (this.collectionLengths["hidden"] != allApps.length) {
        this.collectionLengths["hidden"] = allApps.length;
        shouldRebuildCollections = true;
      }

      if (shouldRebuildCollections) {
        this.visibleTabsList.forEach((tabContainer) => {
          if (tabContainer.filters && tabContainer.filters.length != 0) {
            (tabContainer as CustomTabContainer).buildCollection();
          }
        });
      }
    }, { delay: 50 });

    //* subscribe to user's friendlist updates
    reaction(() => friendStore.allFriends, this.handleFriendsReaction.bind(this), { delay: 50 });

    this.handleFriendsReaction(friendStore.allFriends);

    //* subscribe to store tag list changes
    reaction(() => appStore.m_mapStoreTagLocalization, this.storeTagReaction.bind(this), { delay: 50 });

    this.storeTagReaction(appStore.m_mapStoreTagLocalization);
  }

  private storeTagReaction(storeTagLocalizationMap: StoreTagLocalizationMap) {
    this.allStoreTags = Array.from(storeTagLocalizationMap._data.entries()).map(([tag, entry]) => {
      return {
        tag: tag,
        string: entry.value
      }
    });
    if(!this.hasLoaded) return

    //? if this is for filters then shouldn't we rebuild the tabs collection and not update?
    this.update();
  }

  private handleFriendsReaction(friends: FriendStoreEntry[]) {
    console.log("We reacted to friend store changes!");
    this.currentUsersFriends = friends.map((storeEntry: FriendStoreEntry) => {
      const entry = storeEntry;
      const userid = getNonBigIntUserId(entry.m_persona.m_steamid.m_ulSteamID.low, entry.m_persona.m_steamid.m_ulSteamID.high);
      return {
        steamid: userid,
        name: (entry.m_strNickname && entry.m_strNickname !== "") ? entry.m_strNickname : entry.m_persona.m_strPlayerName,
      }
    });

    Promise.all(this.currentUsersFriends.map((friend: FriendEntry) => {
      friendStore.FetchOwnedGames(friend.steamid).then((res) => {
        this.friendsGameMap.set(friend.steamid, Array.from(res.m_apps));
      });
    })).then(() => {
      if(!this.hasLoaded) return

      //? same thing here, see above
      this.update();
    });
  }

  updateCustomTab(customTabId: string, updatedTabSettings: EditableTabSettings) {
    (this.tabsMap.get(customTabId) as CustomTabContainer).update(updatedTabSettings);
    this.update();
  }

  reorderTabs(orederedTabIds: string[]) {
    for (let i = 0; i < orederedTabIds.length; i++) {
      this.tabsMap.get(orederedTabIds[i])!.position = i;
    }

    this.rebuildTabLists();
    this.update();
  }

  hideTab(tabId: string) {
    const tabContainer = this.tabsMap.get(tabId)!;

    this.hiddenTabsList.push(this.visibleTabsList.splice(tabContainer.position, 1)[0]);
    this.visibleTabsList.slice(tabContainer.position).forEach(tabContainer => tabContainer.position--);

    tabContainer.position = -1;

    this.update();
  }

  showTab(tabId: string) {
    const tabContainer = this.tabsMap.get(tabId)!;
    const hiddenIndex = this.hiddenTabsList.findIndex(hiddenTabContainer => hiddenTabContainer === tabContainer);

    tabContainer.position = this.visibleTabsList.length;
    this.visibleTabsList.push(this.hiddenTabsList.splice(hiddenIndex, 1)[0]);

    if (tabContainer.filters && (tabContainer as CustomTabContainer).collection.allApps === undefined) {
      (tabContainer as CustomTabContainer).buildCollection();
    }

    this.update();
  }

  deleteTab(tabId: string) {
    let tabContainer = this.tabsMap.get(tabId)!;

    const tabsArrayToRemoveFrom = tabContainer.position > -1 ? this.visibleTabsList : this.hiddenTabsList;
    const index = tabContainer.position > -1 ? tabContainer.position : this.hiddenTabsList.findIndex(hiddenTabContainer => hiddenTabContainer === tabContainer);

    tabsArrayToRemoveFrom.splice(index, 1);

    this.tabsMap.delete(tabId);
    this.update();
  }

  createCustomTab(title: string, position: number, filterSettingsList: TabFilterSettings<FilterType>[]) {
    const id = uuidv4();
    this.visibleTabsList.push(this.addCustomTabContainer(id, title, position, filterSettingsList));
    this.update();
  }

  loadTabs = async () => {
    const settings = await PythonInterop.getTabs();

    if (settings instanceof Error) {
      console.log("Tab Master couldn't load tab settings");
      return
    }

    const tabsSettings = Object.keys(settings).length > 0 ? settings : { ...defaultTabsSettings };
    const visibleTabContainers: TabContainer[] = [];
    const hiddenTabContainers: TabContainer[] = [];
    const favoritesCollection = collectionStore.GetCollection("favorite");
    this.userHasFavorites = favoritesCollection && favoritesCollection.allApps.length > 0
    let favortitesOriginalIndex = null

    if (tabsSettings.Favorites && !this.userHasFavorites) {
      favortitesOriginalIndex = tabsSettings.Favorites.position
      delete tabsSettings['Favorites']
    }

    for (const keyId in tabsSettings) {
      const { id, title, filters, position } = tabsSettings[keyId];
      const tabContainer = filters ? this.addCustomTabContainer(id, title, position, filters) : this.addDefaultTabContainer(tabsSettings[keyId]);

      if (favortitesOriginalIndex !== null && favortitesOriginalIndex > -1 && tabContainer.position > favortitesOriginalIndex) {
        tabContainer.position--
      }
      tabContainer.position > -1 ? visibleTabContainers[tabContainer.position] = tabContainer : hiddenTabContainers.push(tabContainer);
    }

    this.visibleTabsList = visibleTabContainers;
    this.hiddenTabsList = hiddenTabContainers;
    this.hasLoaded = true;

    this.eventBus.dispatchEvent(new Event("stateUpdate"));
  }

  getTabs() {
    return {
      visibleTabsList: this.visibleTabsList,
      hiddenTabsList: this.hiddenTabsList,
      tabsMap: this.tabsMap
    }
  }

  getFriendsAndTags() {
    return {
      currentUsersFriends: this.currentUsersFriends,
      allStoreTags: this.allStoreTags
    }
  }

  get hasSettingsLoaded() {
    return this.hasLoaded;
  }

  getFriendsWhoOwn(appid: number): number[] {
    return Array.from(this.friendsGameMap.entries())
      .filter(([, ownedGames]) => ownedGames.includes(appid))
      .map(([friendId]) => friendId);
  }

  private saveTabs() {
    console.log('saving tabs');

    const allTabsSettings: TabSettingsDictionary = {};

    this.tabsMap.forEach(tabContainer => {
      const tabSettings = tabContainer.filters ?
        { id: tabContainer.id, title: tabContainer.title, position: tabContainer.position, filters: tabContainer.filters }
        : tabContainer;

      // console.log('saving with settings :', tabSettings)

      allTabsSettings[tabContainer.id] = tabSettings;
    });
    PythonInterop.setTabs(allTabsSettings);
  }

  private addCustomTabContainer(tabId: string, title: string, position: number, filterSettingsList: TabFilterSettings<FilterType>[]) {
    const tabContainer = new CustomTabContainer(tabId, title, position, filterSettingsList);
    this.tabsMap.set(tabId, tabContainer);
    return tabContainer;
  }

  private addDefaultTabContainer(defaultTabSettings: TabContainer) {
    this.tabsMap.set(defaultTabSettings.id, defaultTabSettings);
    return defaultTabSettings;
  }

  private rebuildTabLists() {
    const visibleTabContainers: TabContainer[] = []
    const hiddenTabContainers: TabContainer[] = []
    this.tabsMap.forEach(tabContainer => {
      tabContainer.position > -1 ? visibleTabContainers[tabContainer.position] = tabContainer : hiddenTabContainers.push(tabContainer)
    })
    this.visibleTabsList = visibleTabContainers
    this.hiddenTabsList = hiddenTabContainers
  }

  private update() {
    this.saveTabs();
    this.eventBus.dispatchEvent(new Event("stateUpdate"));
  }
}