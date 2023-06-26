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

/**
 * Class that handles TabMaster's core state.
 */
export class TabMasterManager {
  private tabsMap: Map<string, TabContainer>;
  private visibleTabsList: TabContainer[] = [];
  private hiddenTabsList: TabContainer[] = [];

  private hasLoaded: boolean;

  private currentUsersFriends: FriendEntry[] = [];
  private friendsGameMap: Map<number, number[]> = new Map();
  private allStoreTags: TagResponse[] = [];
  private userHasFavorites: boolean = false;
  private userHasSoundtracks: boolean = false;

  public eventBus = new EventTarget();
  private collectionLengths: { [collectionId: string]: number } = {}

  /**
   * Creates a new TabMasterManager.
   */
  constructor() {
    this.hasLoaded = false;
    this.tabsMap = new Map<string, TabContainer>();

    //* subscribe to user collection updates
    reaction(() => collectionStore.userCollections, (userCollections: SteamCollection[]) => {
      if (!this.hasLoaded) return;

      // console.log("We reacted to user collection changes!");
      const userHadFavorites = this.userHasFavorites;
      const userHadSoundtracks = this.userHasFavorites;
      const favoritesCollection = collectionStore.GetCollection("favorite");
      const soundtracksCollection = collectionStore.GetCollection('type-music');
      const installedCollection = collectionStore.GetCollection("local-install");

      let depsToRebuild: string[] = [];

      //* react to favorites visibility change
      if (!userHadFavorites && favoritesCollection && favoritesCollection.visibleApps.length !== 0) {
        this.userHasFavorites = true;
        const favoriteTabContainer = { ...defaultTabsSettings.Favorites, position: this.visibleTabsList.length };
        this.visibleTabsList.push(this.addDefaultTabContainer(favoriteTabContainer));
        this.updateAndSave();
      }
      if (userHadFavorites && (!favoritesCollection || favoritesCollection.visibleApps.length === 0)) {
        this.userHasFavorites = false;
        this.deleteTab('Favorites');
      }
      
      //* react to soundtracks visibility change
      if (!userHadSoundtracks && soundtracksCollection && soundtracksCollection.visibleApps.length !== 0) {
        this.userHasSoundtracks = true;
        const soundtrackTabContainer = { ...defaultTabsSettings.Soundtracks, position: this.visibleTabsList.length };
        this.visibleTabsList.push(this.addDefaultTabContainer(soundtrackTabContainer));
        this.updateAndSave();
      }
      if (userHadSoundtracks && (!soundtracksCollection || soundtracksCollection.visibleApps.length === 0)) {
        this.userHasSoundtracks = false;
        this.deleteTab('Soundtracks');
      }

      //* check if contents of any collection changed
      for (const collection of userCollections) {
        if (collection && this.collectionLengths[collection.id] != collection.allApps.length) {
          this.collectionLengths[collection.id] = collection.allApps.length;
          depsToRebuild.push(collection.id);
        }
      }

      let shouldRebuildUninstalled = false;
      let shouldRebuildInstalled = false;

      if (installedCollection) {
        if (this.collectionLengths["installed"] > installedCollection.allApps.length) {
          this.collectionLengths["installed"] = installedCollection.allApps.length;
          shouldRebuildUninstalled = true;
        } else if (this.collectionLengths["installed"] < installedCollection.allApps.length) {
          this.collectionLengths["installed"] = installedCollection.allApps.length;
          shouldRebuildInstalled = true;
        }
      } else {
        //? This is here for when valve inevitably changes the collection's id.
        console.error("Installed collection should always exists!!");
      }

      const tabsAlreadyBuilt: string[] = [];

      if (shouldRebuildInstalled) {
        this.visibleTabsList.forEach((tabContainer) => {
          if (tabContainer.filters && tabContainer.filters.length !== 0) {
            const collectionFilters = tabContainer.filters.filter((filter: TabFilterSettings<FilterType>) => filter.type === "installed");

            if (collectionFilters.some((filter: TabFilterSettings<"installed">) => filter.params.installed)) {
              (tabContainer as CustomTabContainer).buildCollection();
              tabsAlreadyBuilt.push(tabContainer.id);
            }
          }
        });
      } else if (shouldRebuildUninstalled) {
        this.visibleTabsList.forEach((tabContainer) => {
          if (tabContainer.filters && tabContainer.filters.length !== 0) {
            const collectionFilters = tabContainer.filters.filter((filter: TabFilterSettings<FilterType>) => filter.type === "installed");

            if (collectionFilters.some((filter: TabFilterSettings<"installed">) => !filter.params.installed)) {
              (tabContainer as CustomTabContainer).buildCollection();
              tabsAlreadyBuilt.push(tabContainer.id);
            }
          }
        });
      }

      if (depsToRebuild.length !== 0) {
        this.visibleTabsList.forEach((tabContainer) => {
          if (tabContainer.filters && tabContainer.filters.length !== 0 && !tabsAlreadyBuilt.includes(tabContainer.id)) {
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
      if (!this.hasLoaded) return;

      // console.log("We reacted to hidden collection changes!");
      let shouldRebuildCollections = false;

      if (!allApps && this.collectionLengths["hidden"] !== 0) {
        this.collectionLengths["hidden"] = 0;
        shouldRebuildCollections = true;
      } else if (this.collectionLengths["hidden"] != allApps.length) {
        this.collectionLengths["hidden"] = allApps.length;
        shouldRebuildCollections = true;
      }

      if (shouldRebuildCollections) {
        this.visibleTabsList.forEach((tabContainer) => {
          if (tabContainer.filters && tabContainer.filters.length !== 0) {
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

  /**
   * Handles updating state when the store tag localization map changes.
   * @param storeTagLocalizationMap The store tag localization map.
   */
  private storeTagReaction(storeTagLocalizationMap: StoreTagLocalizationMap) {
    this.allStoreTags = Array.from(storeTagLocalizationMap._data.entries()).map(([tag, entry]) => {
      return {
        tag: tag,
        string: entry.value
      }
    });
  }

  /**
   * Handles updating state when the user's friends list changes.
   * @param friends An array of the user's friends.
   */
  private handleFriendsReaction(friends: FriendStoreEntry[]) {
    // console.log("We reacted to friend store changes!");
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
      if (!this.hasLoaded) return;

      const listOfBadFriends: Set<number> = new Set();
      const customTabsList = this.visibleTabsList.filter((tabContainer) => tabContainer.filters && tabContainer.filters.length !== 0)

      //* splitting these loops up is technically more efficient, otherwise we end up with 3 or 4 nested loops
      customTabsList.forEach((tabContainer: TabContainer) => {
        const friendsFilters = tabContainer.filters!.filter((filter: TabFilterSettings<FilterType>) => filter.type === "friends");
        const friendsIds2D: number[][] = friendsFilters.map((collectionFilter) => collectionFilter.params.friends);

        if (friendsIds2D.length > 0) {
          //* cheap way to remove duplicates, so we only have to do one loop later
          const friendsIds: number[] = [...new Set(friendsIds2D.flat())];

          for (const id of friendsIds) {
            const stillFriends = this.currentUsersFriends.find((friendEntry) => friendEntry.steamid === id);

            if (!stillFriends) listOfBadFriends.add(id);
          }
        }
      });

      customTabsList.forEach((tabContainer) => {
        let shouldRebuildCollection = false;
        const friendsFilters = tabContainer.filters!.filter((filter: TabFilterSettings<FilterType>) => filter.type === "friends");

        //* remove friend's id from filter
        friendsFilters.forEach((friendFilter: TabFilterSettings<"friends">) => {

          for (const id of listOfBadFriends) {
            const badFriendIdx = friendFilter.params.friends.indexOf(id);

            if (badFriendIdx >= 0) {
              shouldRebuildCollection = true;
              friendFilter.params.friends.splice(badFriendIdx, 1);
            }
          }
        });

        if (shouldRebuildCollection) {
          (tabContainer as CustomTabContainer).buildCollection();
        }
      });
    });
  }

  /**
   * Updates the settings for a custom tab.
   * @param customTabId The id of the custom tab.
   * @param updatedTabSettings The new settings for the tab.
   */
  updateCustomTab(customTabId: string, updatedTabSettings: EditableTabSettings) {
    (this.tabsMap.get(customTabId) as CustomTabContainer).update(updatedTabSettings);
    this.updateAndSave();
  }

  /**
   * Reorders the tabs.
   * @param orederedTabIds The updated order of tabs.
   */
  reorderTabs(orederedTabIds: string[]) {
    for (let i = 0; i < orederedTabIds.length; i++) {
      this.tabsMap.get(orederedTabIds[i])!.position = i;
    }

    this.rebuildTabLists();
    this.updateAndSave();
  }

  /**
   * Hides a tab from the library.
   * @param tabId The id of the tab to hide.
   */
  hideTab(tabId: string) {
    const tabContainer = this.tabsMap.get(tabId)!;

    this.hiddenTabsList.push(this.visibleTabsList.splice(tabContainer.position, 1)[0]);
    this.visibleTabsList.slice(tabContainer.position).forEach(tabContainer => tabContainer.position--);

    tabContainer.position = -1;

    this.updateAndSave();
  }

  /**
   * Unhides a hidden tab in the library.
   * @param tabId The id of the tab to show.
   */
  showTab(tabId: string) {
    const tabContainer = this.tabsMap.get(tabId)!;
    const hiddenIndex = this.hiddenTabsList.findIndex(hiddenTabContainer => hiddenTabContainer === tabContainer);

    tabContainer.position = this.visibleTabsList.length;
    this.visibleTabsList.push(this.hiddenTabsList.splice(hiddenIndex, 1)[0]);

    if (tabContainer.filters && (tabContainer as CustomTabContainer).collection.allApps === undefined) {
      (tabContainer as CustomTabContainer).buildCollection();
    }

    this.updateAndSave();
  }

  /**
   * Deletes a tab.
   * @param tabId The id of the tab to delete.
   */
  deleteTab(tabId: string) {
    let tabContainer = this.tabsMap.get(tabId)!;

    const tabsArrayToRemoveFrom = tabContainer.position > -1 ? this.visibleTabsList : this.hiddenTabsList;
    const index = tabContainer.position > -1 ? tabContainer.position : this.hiddenTabsList.findIndex(hiddenTabContainer => hiddenTabContainer === tabContainer);

    tabsArrayToRemoveFrom.splice(index, 1);

    this.tabsMap.delete(tabId);
    this.updateAndSave();
  }

  /**
   * Creates a new custom tab.
   * @param title The title of the tab.
   * @param position The position of the tab.
   * @param filterSettingsList The list of filters for the tab.
   */
  createCustomTab(title: string, position: number, filterSettingsList: TabFilterSettings<FilterType>[]) {
    const id = uuidv4();
    this.visibleTabsList.push(this.addCustomTabContainer(id, title, position, filterSettingsList));
    this.updateAndSave();
  }

  /**
   * Loads the user's tabs from the backend.
   */
  loadTabs = async () => {
    const settings = await PythonInterop.getTabs();

    if (settings instanceof Error) {
      console.log("Tab Master couldn't load tab settings");
      return;
    }

    const tabsSettings = Object.keys(settings).length > 0 ? settings : { ...defaultTabsSettings };
    const visibleTabContainers: TabContainer[] = [];
    const hiddenTabContainers: TabContainer[] = [];
    const favoritesCollection = collectionStore.GetCollection("favorite");
    const soundtracksCollection = collectionStore.GetCollection('type-music');
    this.userHasFavorites = favoritesCollection && favoritesCollection.visibleApps.length > 0
    this.userHasSoundtracks = soundtracksCollection && soundtracksCollection.visibleApps.length > 0
    let favoritesOriginalIndex = null
    let soundtracksOriginalIndex = null

    if (tabsSettings.Favorites && !this.userHasFavorites) {
      favoritesOriginalIndex = tabsSettings.Favorites.position
      delete tabsSettings['Favorites']
    }
    if (tabsSettings.Soundtracks && !this.userHasFavorites) {
      soundtracksOriginalIndex = tabsSettings.Soundtracks.position
      delete tabsSettings['Soundtracks']
    }

    for (const keyId in tabsSettings) {
      const { id, title, filters, position } = tabsSettings[keyId];
      const tabContainer = filters ? this.addCustomTabContainer(id, title, position, filters) : this.addDefaultTabContainer(tabsSettings[keyId]);

      if (favoritesOriginalIndex !== null && favoritesOriginalIndex > -1 && tabContainer.position > favoritesOriginalIndex) {
        tabContainer.position--
      }
      if (soundtracksOriginalIndex !== null && soundtracksOriginalIndex > -1 && tabContainer.position > soundtracksOriginalIndex) {
        tabContainer.position--
      }
      tabContainer.position > -1 ? visibleTabContainers[tabContainer.position] = tabContainer : hiddenTabContainers.push(tabContainer);
    }

    this.visibleTabsList = visibleTabContainers;
    this.hiddenTabsList = hiddenTabContainers;
    this.hasLoaded = true;

    this.update();
  }

  /**
   * Gets the user's tabs
   * @returns The visibleTabs, hiddenTabs and tabsMap.
   */
  getTabs() {
    return {
      visibleTabsList: this.visibleTabsList,
      hiddenTabsList: this.hiddenTabsList,
      tabsMap: this.tabsMap
    }
  }

  /**
   * Gets the userFriends and store tags.
   * @returns The tags and userFriends currently in state.
   */
  getFriendsAndTags() {
    return {
      currentUsersFriends: this.currentUsersFriends,
      allStoreTags: this.allStoreTags
    }
  }

  get hasSettingsLoaded() {
    return this.hasLoaded;
  }

  /**
   * Gets the list of the user's friends who own an app.
   * @param appid The id of the app.
   * @returns A list of ids of friends who own this app.
   */
  getFriendsWhoOwn(appid: number): number[] {
    return Array.from(this.friendsGameMap.entries())
      .filter(([, ownedGames]) => ownedGames.includes(appid))
      .map(([friendId]) => friendId);
  }

  /**
   * Saves the tabs to the backend.
   */
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

  /**
   * Creates a new tab container from the provided tab data.
   * @param tabId The id of the tab.
   * @param title The title of the tab.
   * @param position The position of the tab.
   * @param filterSettingsList The tab's filters.
   * @returns A tab container for this tab.
   */
  private addCustomTabContainer(tabId: string, title: string, position: number, filterSettingsList: TabFilterSettings<FilterType>[]) {
    const tabContainer = new CustomTabContainer(tabId, title, position, filterSettingsList);
    this.tabsMap.set(tabId, tabContainer);
    return tabContainer;
  }

  /**
   * Creates a new tab container for each of the default tabs.
   * @param defaultTabSettings The default tabs.
   * @returns Tab containers for all of the default tabs.
   */
  private addDefaultTabContainer(defaultTabSettings: TabContainer) {
    this.tabsMap.set(defaultTabSettings.id, defaultTabSettings);
    return defaultTabSettings;
  }

  /**
   * Rebuilds the library tab list.
   */
  private rebuildTabLists() {
    const visibleTabContainers: TabContainer[] = []
    const hiddenTabContainers: TabContainer[] = []
    this.tabsMap.forEach(tabContainer => {
      tabContainer.position > -1 ? visibleTabContainers[tabContainer.position] = tabContainer : hiddenTabContainers.push(tabContainer)
    })
    this.visibleTabsList = visibleTabContainers
    this.hiddenTabsList = hiddenTabContainers
  }

  /**
   * Saves tab settings and dispatches event to update context provider
   */
  private updateAndSave() {
    this.saveTabs();
    this.update()
  }

  /**
   * Dispatches event to update context provider
   */
  private update() {
    this.eventBus.dispatchEvent(new Event("stateUpdate"));
  }
}