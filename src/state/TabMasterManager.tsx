import { EditableTabSettings } from "../components/EditTabModal";
import { TabFilterSettings, FilterType } from "../components/filters/Filters";
import { PythonInterop } from "../lib/controllers/PythonInterop";
import { CustomTabContainer } from "../components/CustomTabContainer";
import { v4 as uuidv4 } from "uuid";
import { IReactionDisposer, reaction } from "mobx"
import { defaultTabsSettings, getNonBigIntUserId } from "../lib/Utils";

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
  private userHasVisibleFavorites: boolean = false;
  private userHasVisibleSoundtracks: boolean = false;

  public eventBus = new EventTarget();
  private collectionLengths: { [collectionId: string]: number } = {};

  private favoriteReaction: IReactionDisposer | undefined;
  private soundtrackReaction: IReactionDisposer | undefined;
  private installedReaction: IReactionDisposer | undefined;
  private hiddenReaction: IReactionDisposer | undefined;

  private collectionReactions: { [collectionId: string]: IReactionDisposer } = {};

  private friendsReaction: IReactionDisposer | undefined;
  private tagsReaction: IReactionDisposer | undefined;

  /**
   * Creates a new TabMasterManager.
   */
  constructor() {
    this.hasLoaded = false;
    this.tabsMap = new Map<string, TabContainer>();
  }

  private initReactions(): void {
    //* subscribe to when visible favorites change
    this.favoriteReaction = reaction(() => collectionStore.GetCollection('favorite').visibleApps.length, this.handleNumOfVisibleFavoritesChanged.bind(this));

    //*subscribe to when visible soundtracks change
    this.soundtrackReaction = reaction(() => collectionStore.GetCollection('type-music').visibleApps.length, this.handleNumOfVisibleSoundtracksChanged.bind(this));

    //*subscribe to when installed games change
    this.installedReaction = reaction(() => collectionStore.GetCollection('local-install').allApps.length, this.handleNumOfInstalledChanged.bind(this));

    //* subscribe to game hide or show
    this.hiddenReaction = reaction(() => collectionStore.GetCollection("hidden").allApps.length, this.handleGameHideOrShow.bind(this), { delay: 50 });

    //* subscribe to user's friendlist updates
    this.friendsReaction = reaction(() => friendStore.allFriends, this.handleFriendsReaction.bind(this), { delay: 50 });

    this.handleFriendsReaction(friendStore.allFriends);

    //* subscribe to store tag list changes
    this.tagsReaction = reaction(() => appStore.m_mapStoreTagLocalization, this.storeTagReaction.bind(this), { delay: 50 });

    this.storeTagReaction(appStore.m_mapStoreTagLocalization);
  }

  /**
   * Handles the favorites reaction.
   * @param numOfVisibleFavorites The number of visible favorites.
   */
  private handleNumOfVisibleFavoritesChanged(numOfVisibleFavorites: number) {
    if (!this.hasLoaded) return;

    const userHadVisibleFavorites = this.userHasVisibleFavorites;

    if (!userHadVisibleFavorites && numOfVisibleFavorites !== 0) {
      this.userHasVisibleFavorites = true;
      const favoriteTabContainer = { ...defaultTabsSettings.Favorites, position: this.visibleTabsList.length };
      this.visibleTabsList.push(this.addDefaultTabContainer(favoriteTabContainer));
      this.updateAndSave();
    }

    if (userHadVisibleFavorites && numOfVisibleFavorites === 0) {
      this.userHasVisibleFavorites = false;
      this.deleteTab('Favorites');
    }
  }

  /**
   * Handles the soundtrack reaction.
   * @param numOfVisibleSoundtracks The number of visible soundtracks.
   */
  private handleNumOfVisibleSoundtracksChanged(numOfVisibleSoundtracks: number) {
    if (!this.hasLoaded) return;

    const userHadVisibleSoundtracks = this.userHasVisibleSoundtracks;

    if (!userHadVisibleSoundtracks && numOfVisibleSoundtracks !== 0) {
      this.userHasVisibleSoundtracks = true;
      const soundtrackTabContainer = { ...defaultTabsSettings.Soundtracks, position: this.visibleTabsList.length };
      this.visibleTabsList.push(this.addDefaultTabContainer(soundtrackTabContainer));
      this.updateAndSave();
    }

    if (userHadVisibleSoundtracks && numOfVisibleSoundtracks === 0) {
      this.userHasVisibleSoundtracks = false;
      this.deleteTab('Soundtracks');
    }
  }

  /**
   * Handles the installed/uninstalled reaction.
   * @param numOfInstalled The number of installed games.
   */
  private handleNumOfInstalledChanged(numOfInstalled: number) {
    if (!this.hasLoaded) return;

    let shouldRebuildUninstalled = false;
    let shouldRebuildInstalled = false;

    if (this.collectionLengths["installed"] > numOfInstalled) {
      this.collectionLengths["installed"] = numOfInstalled;
      shouldRebuildUninstalled = true;
    } else if (this.collectionLengths["installed"] < numOfInstalled) {
      this.collectionLengths["installed"] = numOfInstalled;
      shouldRebuildInstalled = true;
    }

    if (shouldRebuildInstalled) {
      this.visibleTabsList.forEach((tabContainer) => {
        if (tabContainer.filters && tabContainer.filters.length !== 0) {
          const collectionFilters = tabContainer.filters.filter((filter: TabFilterSettings<FilterType>) => filter.type === "installed");

          if (collectionFilters.some((filter: TabFilterSettings<"installed">) => filter.params.installed)) {
            (tabContainer as CustomTabContainer).buildCollection();
          }
        }
      });
    } else if (shouldRebuildUninstalled) {
      this.visibleTabsList.forEach((tabContainer) => {
        if (tabContainer.filters && tabContainer.filters.length !== 0) {
          const collectionFilters = tabContainer.filters.filter((filter: TabFilterSettings<FilterType>) => filter.type === "installed");

          if (collectionFilters.some((filter: TabFilterSettings<"installed">) => !filter.params.installed)) {
            (tabContainer as CustomTabContainer).buildCollection();
          }
        }
      });
    }
  }

  /**
   * Handles the hidden collection reaction.
   */
  private handleGameHideOrShow() {
    if (!this.hasLoaded) return;

    this.visibleTabsList.forEach((tabContainer) => {
      if (tabContainer.filters && tabContainer.filters.length !== 0) {
        (tabContainer as CustomTabContainer).buildCollection();
      }
    });
  }

  /**
   * Handles a general userCollection reaction.
   * @param collectionId The id of the collection.
   * @param numOfIncluded The number of games in the collection.
   */
  private handleUserCollectionLengthChange(collectionId: string, numOfIncluded: number) {
    if (!this.hasLoaded) return;

    // console.log("We reacted to user collection changes!");

    this.visibleTabsList.forEach((tabContainer) => {
      if (tabContainer.filters && tabContainer.filters.length !== 0) {
        const collectionFilters = tabContainer.filters.filter((filter: TabFilterSettings<FilterType>) => filter.type === "collection").map((collectionFilter) => collectionFilter.params.collection);

        if (collectionFilters.includes(collectionId)) {
          (tabContainer as CustomTabContainer).buildCollection();
        }
      }
    });
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

    PythonInterop.setTags(this.allStoreTags);
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

    PythonInterop.setFriends(this.currentUsersFriends);

    Promise.all(this.currentUsersFriends.map((friend: FriendEntry) => {
      friendStore.FetchOwnedGames(friend.steamid).then((res) => {
        this.friendsGameMap.set(friend.steamid, Array.from(res.m_apps));
      });
    })).then(() => {
      PythonInterop.setFriendGames(this.friendsGameMap);

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
   * Handles cleaning up all reactions.
   */
  disposeReactions(): void {
    if (this.favoriteReaction) this.favoriteReaction();
    if (this.soundtrackReaction) this.soundtrackReaction();
    if (this.installedReaction) this.installedReaction();
    if (this.hiddenReaction) this.hiddenReaction();

    if (this.collectionReactions) {
      for (const reaction of Object.values(this.collectionReactions)) {
        reaction();
      }
    }

    if (this.friendsReaction) this.friendsReaction();
    if (this.tagsReaction) this.tagsReaction();
  }

  /**
   * Updates the settings for a custom tab.
   * @param customTabId The id of the custom tab.
   * @param updatedTabSettings The new settings for the tab.
   */
  updateCustomTab(customTabId: string, updatedTabSettings: EditableTabSettings) {
    (this.tabsMap.get(customTabId) as CustomTabContainer).update(updatedTabSettings);

    const filters = updatedTabSettings.filters;
    if (filters) this.addCollectionReactionsForFilters(filters);

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
    const tabContainer = this.tabsMap.get(tabId)!;

    let tabsArrayToRemoveFrom: TabContainer[];
    let updateIndexes = false;
    let index: number

    if (tabContainer.position > -1) {
      tabsArrayToRemoveFrom = this.visibleTabsList;
      index = tabContainer.position;
      updateIndexes = true;
    } else {
      tabsArrayToRemoveFrom = this.hiddenTabsList;
      index = this.hiddenTabsList.findIndex(hiddenTabContainer => hiddenTabContainer === tabContainer);
    }
    tabsArrayToRemoveFrom.splice(index, 1);
    if (updateIndexes) {
      for (let i = index; i < this.visibleTabsList.length; i++) {
        this.visibleTabsList[i].position--;
      }
    }
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
   * Adds a reaction to collection lengths if they are not already registered.
   * @param filters The array of filters to check.
   */
  private addCollectionReactionsForFilters(filters: TabFilterSettings<FilterType>[]): void {
    const collectionFilters = filters.filter((filter: TabFilterSettings<FilterType>) => filter.type === "collection");

    if (collectionFilters.length > 0) {
      for (const collectionFilter of collectionFilters) {
        const collectionId: string = (collectionFilter as TabFilterSettings<"collection">).params.collection;

        if (!this.collectionReactions[collectionId]) {
          //* subscribe to user collection updates
          this.collectionReactions[collectionId] = reaction(() => collectionStore.GetCollection(collectionId).allApps.length, (collectionLength: number) => {
            this.handleUserCollectionLengthChange(collectionId, collectionLength);
          });
        }
      }
    }
  }

  /**
   * Loads the user's tabs from the backend.
   */
  loadTabs = async () => {
    this.initReactions();
    const settings = await PythonInterop.getTabs();
    //* We don't need to wait for these, as if we get the store ones, we don't care about them
    PythonInterop.getTags().then((res: TagResponse[] | Error) => {
      if (res instanceof Error) {
        console.log("TabMaster couldn't load tags settings");
      } else {
        if (this.allStoreTags.length === 0) {
          this.allStoreTags = res;
        }
      }
    });
    PythonInterop.getFriends().then((res: FriendEntry[] | Error) => {
      if (res instanceof Error) {
        console.log("TabMaster couldn't load friends settings");
      } else {
        if (this.currentUsersFriends.length === 0) {
          this.currentUsersFriends = res;
        }
      }
    });
    PythonInterop.getFriendsGames().then((res: Map<number, number[]> | Error) => {
      if (res instanceof Error) {
        console.log("TabMaster couldn't load friends games settings");
      } else {
        if (this.friendsGameMap.size === 0) {
          this.friendsGameMap = res;
        }
      }
    });

    if (settings instanceof Error) {
      console.log("TabMaster couldn't load tab settings");
      return;
    }

    const tabsSettings = Object.keys(settings).length > 0 ? settings : { ...defaultTabsSettings };
    const visibleTabContainers: TabContainer[] = [];
    const hiddenTabContainers: TabContainer[] = [];
    const favoritesCollection = collectionStore.GetCollection("favorite");
    const soundtracksCollection = collectionStore.GetCollection('type-music');
    this.userHasVisibleFavorites = favoritesCollection && favoritesCollection.visibleApps.length > 0
    this.userHasVisibleSoundtracks = soundtracksCollection && soundtracksCollection.visibleApps.length > 0
    let favoritesOriginalIndex = null
    let soundtracksOriginalIndex = null

    if (tabsSettings.Favorites && !this.userHasVisibleFavorites) {
      favoritesOriginalIndex = tabsSettings.Favorites.position
      delete tabsSettings['Favorites']
    }
    if (tabsSettings.Soundtracks && !this.userHasVisibleSoundtracks) {
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

      if (filters) {
        this.addCollectionReactionsForFilters(filters);
      }
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