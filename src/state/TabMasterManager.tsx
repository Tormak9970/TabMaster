import { EditableTabSettings } from "../components/modals/EditTabModal";
import { TabFilterSettings, FilterType, Filter } from "../components/filters/Filters";
import { PythonInterop } from "../lib/controllers/PythonInterop";
import { CustomTabContainer } from "./CustomTabContainer";
import { v4 as uuidv4 } from "uuid";
import { IReactionDisposer, reaction } from "mobx";
import { defaultTabsSettings, getNonBigIntUserId } from "../lib/Utils";
import { LogController } from "../lib/controllers/LogController";
import { PresetName, PresetOptions, getPreset } from '../presets/presets';
import { MicroSDeckInterop } from '../lib/controllers/MicroSDeckInterop';
import { TabErrorController } from '../lib/controllers/TabErrorController';
import { TabProfileManager } from './TabProfileManager';
import { Navigation } from 'decky-frontend-lib';
import { AUTO_BACKUP_NAME } from '../constants';

/**
 * Converts a list of filters into a 1D array.
 * @param filters The filters array to flatten.
 * @returns A 1D array of tab filters.
 */
function flattenFilters(filters: TabFilterSettings<FilterType>[]): TabFilterSettings<FilterType>[] {
  const res: TabFilterSettings<FilterType>[] = [];

  for (const filter of filters) {
    if (filter.type === "merge") {
      const mergeFilters = flattenFilters((filter as TabFilterSettings<"merge">).params.filters);
      res.push(...mergeFilters);
    } else {
      res.push(filter);
    }
  }

  return res;
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
  private userHasVisibleFavorites: boolean = false;
  private userHasVisibleSoundtracks: boolean = false;

  private userCollectionIds: string[] = [];

  public eventBus = new EventTarget();

  public microSDeckInstalled: boolean = false;

  private allGamesReaction: IReactionDisposer | undefined;
  private favoriteReaction: IReactionDisposer | undefined;
  private soundtrackReaction: IReactionDisposer | undefined;
  private installedReaction: IReactionDisposer | undefined;
  private hiddenReaction: IReactionDisposer | undefined;
  private nonSteamReaction: IReactionDisposer | undefined;

  private collectionReactions: { [collectionId: string]: IReactionDisposer; } = {};

  private friendsReaction: IReactionDisposer | undefined;
  private tagsReaction: IReactionDisposer | undefined;
  private achievementsReaction: IReactionDisposer | undefined;

  private collectionRemoveReaction: IReactionDisposer | undefined;

  public tabProfileManager: TabProfileManager | undefined;
  public invalidSettingsLoaded: {
    isTrue: boolean;
    confirmReset: () => Promise<void>;
    waitForResetConfirmation: Promise<any>;
  };

  /**
   * Creates a new TabMasterManager.
   */
  constructor() {
    this.hasLoaded = false;
    this.tabsMap = new Map<string, TabContainer>();

    this.invalidSettingsLoaded = {
      isTrue: false,
      waitForResetConfirmation: null as unknown as Promise<any>,
      confirmReset: async () => { }
    };
    this.invalidSettingsLoaded.waitForResetConfirmation = new Promise(async (resolve) => this.invalidSettingsLoaded.confirmReset = async () => {
      this.invalidSettingsLoaded.isTrue = false;
      resolve(0);
    });
  }



  private handleMicroSDeckChange() {
    if (!this.hasLoaded) return;

    const microSDeckTabs: string[] = [];
    for (let tab of this.tabsMap.values()) {
      if ((tab as CustomTabContainer).dependsOnMicroSDeck) microSDeckTabs.push(tab.id);
    }

    TabErrorController.validateTabs(microSDeckTabs, this, true);
  }

  private initReactions(): void {
    // * subscribe to changes to all games
    this.allGamesReaction = reaction(() => collectionStore.GetCollection("type-games").allApps, this.rebuildCustomTabsOnCollectionChange.bind(this), { delay: 600 });

    // * subscribe to when visible favorites change
    this.favoriteReaction = reaction(() => collectionStore.GetCollection('favorite').allApps.length, this.handleNumOfVisibleFavoritesChanged.bind(this));

    // *subscribe to when visible soundtracks change
    this.soundtrackReaction = reaction(() => collectionStore.GetCollection('type-music').visibleApps.length, this.handleNumOfVisibleSoundtracksChanged.bind(this));

    // *subscribe to when installed games change
    this.installedReaction = reaction(() => collectionStore.GetCollection('local-install').allApps.length, this.rebuildCustomTabsOnCollectionChange.bind(this));

    // * subscribe to game hide or show
    this.hiddenReaction = reaction(() => collectionStore.GetCollection("hidden").allApps.length, this.rebuildCustomTabsOnCollectionChange.bind(this), { delay: 50 });

    // * subscribe to non-steam games if they exist
    if (collectionStore.GetCollection('desk-desktop-apps')) {
      this.nonSteamReaction = reaction(() => collectionStore.GetCollection('desk-desktop-apps').allApps.length, this.rebuildCustomTabsOnCollectionChange.bind(this));
    }

    // * subscribe for when collections are deleted
    this.collectionRemoveReaction = reaction(() => collectionStore.userCollections.length, this.handleUserCollectionRemove.bind(this));

    this.handleUserCollectionRemove(collectionStore.userCollections.length); // * this loads the collection ids for the first time.

    // * subscribe to user's friendlist updates
    this.friendsReaction = reaction(() => friendStore.allFriends, this.handleFriendsReaction.bind(this), { delay: 50 });

    this.handleFriendsReaction(friendStore.allFriends);

    // * subscribe to store tag list changes
    this.tagsReaction = reaction(() => appStore.m_mapStoreTagLocalization, this.storeTagReaction.bind(this), { delay: 50 });

    this.storeTagReaction(appStore.m_mapStoreTagLocalization);


    // * subscribe to achievement cache changes
    this.achievementsReaction = reaction(() => appAchievementProgressCache.m_achievementProgress.mapCache.size, this.handleAchievementsReaction.bind(this));

    MicroSDeckInterop.initEventHandlers({ change: this.handleMicroSDeckChange.bind(this) });
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
   * Handles rebuilding tabs when a collection changes.
   */
  private async rebuildCustomTabsOnCollectionChange() {
    if (!this.hasLoaded) return;

    this.visibleTabsList.forEach((tabContainer) => {
      if (tabContainer.filters && tabContainer.filters.length !== 0) {
        (tabContainer as CustomTabContainer).buildCollection();
      }
    });
  }

  /**
   * Handles when the user deletes one of their collections.
   * @param newLength The new length of the userCollections.
   */
  private handleUserCollectionRemove(newLength: number) {
    const userCollections = collectionStore.userCollections;

    if (newLength < this.userCollectionIds.length && this.hasLoaded) {
      let validateTabs = false;
      const collectionsInUse = Object.keys(this.collectionReactions);
      const currentUserCollectionIds = userCollections.map((collection) => collection.id);

      this.userCollectionIds = this.userCollectionIds.filter((id) => {
        const isIncluded = currentUserCollectionIds.includes(id);

        if (!isIncluded && collectionsInUse.includes(id)) {
          validateTabs = true;
          this.collectionReactions[id]();
          delete this.collectionReactions[id];
        }

        return isIncluded;
      });

      if (validateTabs) TabErrorController.validateTabs(Array.from(this.tabsMap.keys()), this);
    } else {
      for (const userCollection of userCollections) {
        if (!this.userCollectionIds.includes(userCollection.id)) this.userCollectionIds.push(userCollection.id);
      }
    }
  }

  /**
   * Handles updating state when the store tag localization map changes.
   * @param storeTagLocalizationMap The store tag localization map.
   */
  private storeTagReaction(storeTagLocalizationMap: StoreTagLocalizationMap) {
    if (storeTagLocalizationMap) {
      const tagEntriesArray = Array.from(storeTagLocalizationMap.entries());

      this.allStoreTags = tagEntriesArray.map(([_, entry]) => {
        return {
          tag: entry.tagid,
          string: entry.name
        };
      });

      PythonInterop.setTags(this.allStoreTags);
    } else {
      LogController.error("Failed to get store tags. Both _data and data_ were undefined");
    }
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
      };
    });

    PythonInterop.setFriends(this.currentUsersFriends);

    Promise.all(this.currentUsersFriends.map((friend: FriendEntry) => {
      //* pretty sure it returns undefined if friends account is set to private, not sure if we should handle this in the ui
      friendStore.FetchOwnedGames(friend.steamid).then((res) => {
        this.friendsGameMap.set(friend.steamid, res ? Array.from(res.setApps) : []);
      });
    })).then(() => {
      PythonInterop.setFriendGames(this.friendsGameMap);

      if (!this.hasLoaded) return;

      const listOfBadFriends: Set<number> = new Set();
      const customTabsList = this.visibleTabsList.filter((tabContainer) => tabContainer.filters && tabContainer.filters.length !== 0);

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
   * Handles updating state when the the achievement cache changes.
   * @param _size The size of the achievements map.
   */
  private handleAchievementsReaction(_size: number) {
    this.visibleTabsList.forEach(tabContainer => {
      if (tabContainer.filters) {
        const tab = tabContainer as CustomTabContainer;
        if (tab.containsFilterType('achievements')) {
          tab.buildCollection();
        }
      }
    });
  }

  /**
   * Checks for tabs with filters that are based on time ago and rebuilds their collections.
   */
  buildTimeBasedFilterTabs() {
    this.visibleTabsList.forEach(tabContainer => {
      if (tabContainer.filters) {
        const tab = tabContainer as CustomTabContainer;
        if (tab.containsFilterType('last played', 'release date')) {
          if (!tab.containsFilterType('merge')) {
            //@ts-ignore
            if (tab.filters.find(filter => filter.params.daysAgo !== undefined)) {
              tab.buildCollection();
            }
          } else {
            tab.buildCollection();
          }
        }
      }
    });
  }

  /**
   * Handles cleaning up all reactions.
   */
  disposeReactions(): void {
    if (this.allGamesReaction) this.allGamesReaction();
    if (this.favoriteReaction) this.favoriteReaction();
    if (this.soundtrackReaction) this.soundtrackReaction();
    if (this.installedReaction) this.installedReaction();
    if (this.hiddenReaction) this.hiddenReaction();
    if (this.nonSteamReaction) this.nonSteamReaction();

    if (this.collectionReactions) {
      for (const reaction of Object.values(this.collectionReactions)) {
        reaction();
      }
    }

    if (this.friendsReaction) this.friendsReaction();
    if (this.tagsReaction) this.tagsReaction();

    if (this.achievementsReaction) this.achievementsReaction();

    if (this.collectionRemoveReaction) this.collectionRemoveReaction();
  }

  /**
   * Updates the settings for a custom tab.
   * @param customTabId The id of the custom tab.
   * @param updatedTabSettings The new settings for the tab.
   */
  updateCustomTab(customTabId: string, updatedTabSettings: EditableTabSettings) {
    (this.tabsMap.get(customTabId) as CustomTabContainer).update(updatedTabSettings);

    const filters = updatedTabSettings.filters;
    if (filters) this.addCollectionReactionsForFilters(flattenFilters(filters));

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
    if (tabContainer.position > -1) return;
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
    let index: number;

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
    this.tabProfileManager?.onDeleteTab(tabId);
    if (!this.tabProfileManager) LogController.error('Attempted to delete a tab before TabProfileManager has been initialized.', 'This should not be possible.');
    this.updateAndSave();
  }

  /**
   * Creates a new custom tab.
   * @param title The title of the tab.
   * @param position The position of the tab.
   * @param filterSettingsList The list of filters for the tab.
   * @param filtersMode The logic mode for these filters.
   * @param categoriesToInclude A bit field of which categories should be included in the tab.
   * @param autoHide Whether or not the tab should automatically be hidden if it's collection is empty.
   * @param sortByOverride The eSortBy number to force use for sorting. -1 ignores override.
   */
  createCustomTab(title: string, position: number, filterSettingsList: TabFilterSettings<FilterType>[], filtersMode: LogicalMode, categoriesToInclude: number, autoHide: boolean, sortByOverride: number) {
    const id = uuidv4();
    this.addCollectionReactionsForFilters(flattenFilters(filterSettingsList));
    this.visibleTabsList.push(this.addCustomTabContainer(id, title, position, filterSettingsList, filtersMode, categoriesToInclude, autoHide, sortByOverride));
    this.updateAndSave();
  }

  createPresetTab<Name extends PresetName>(presetName: Name, tabTitle: string, ...options: PresetOptions<Name>) {
    const { filters, filtersMode, categoriesToInclude } = getPreset(presetName, ...options);
    this.createCustomTab(tabTitle, this.visibleTabsList.length, filters, filtersMode, categoriesToInclude, false, -1);
  }

  /**
   * Adds a reaction to collection lengths if they are not already registered.
   * @param filters The array of filters to check.
   */
  private addCollectionReactionsForFilters(filters: TabFilterSettings<FilterType>[]): void {
    const collectionFilters = filters.filter((filter: TabFilterSettings<FilterType>) => filter.type === "collection");

    if (collectionFilters.length > 0) {
      for (const collectionFilter of collectionFilters) {
        const collectionId: string = (collectionFilter as TabFilterSettings<"collection">).params.id;

        if (!this.collectionReactions[collectionId]) {
          //* subscribe to user collection updates
          this.collectionReactions[collectionId] = reaction(() => collectionStore.GetCollection(collectionId).allApps.length, () => {
            this.rebuildCustomTabsOnCollectionChange();
          });
        }
      }
    }
  }

  /**
   * Other async load calls that don't need to be waited for when starting the plugin
   */
  asyncLoadOther() {
    PythonInterop.getTags().then((res: TagResponse[] | Error) => {
      if (res instanceof Error) {
        LogController.raiseError(`Error loading tags \n ${res.message}`);
      } else {
        if (this.allStoreTags.length === 0) {
          this.allStoreTags = res;
        }
      }
    });
    PythonInterop.getFriends().then((res: FriendEntry[] | Error) => {
      if (res instanceof Error) {
        LogController.raiseError(`Error loading friends \n ${res.message}`);
      } else {
        if (this.currentUsersFriends.length === 0) {
          this.currentUsersFriends = res;
        }
      }
    });
    PythonInterop.getFriendsGames().then((res: Map<number, number[]> | Error) => {
      if (res instanceof Error) {
        LogController.raiseError(`Error loading friends games \n ${res.message}`);
      } else {
        if (this.friendsGameMap.size === 0) {
          this.friendsGameMap = res;
        }
      }
    });
  }

  /**
   * Loads the user's tabs from the backend.
   */
  loadTabs = async () => {
    this.initReactions();
    let settings = await PythonInterop.getTabs();
    const profiles = await PythonInterop.getTabProfiles();

    this.asyncLoadOther();
    try {
      if (settings instanceof Error) {
        throw new Error(`Error loading tab settings \n ${settings.message}`);
      }
      if (profiles instanceof Error) {
        throw new Error(`Error loading tab profiles \n ${profiles.message}`);
      }

      if (!settings) {
        PythonInterop.error(`Tabs were corrupted.`);
        PythonInterop.toast("TabMaster Settings Couldn't Load", "Tab settings did not follow the expected format and could not load");
        this.invalidSettingsLoaded.isTrue = true;
        await this.invalidSettingsLoaded.waitForResetConfirmation;
        const res = await PythonInterop.backupDefaultDir(AUTO_BACKUP_NAME);
        if (res !== true) {
          Navigation.CloseSideMenus();
          LogController.raiseError("Couldn't backup settings");
          return; 
        }
        settings = {};
      }

      this.tabProfileManager = new TabProfileManager(profiles);
      TabErrorController.validateSettingsOnLoad((Object.keys(settings).length > 0) ? settings : defaultTabsSettings, this, this.finishLoadingTabs.bind(this));

    } catch (e) {
      if (e instanceof Error) {
        LogController.raiseError(`Encountered an error while loading \n ${e.message}`);
      }
    }
  };

  /**
   * Finishes the tab loading process.
   * @param tabsSettings The tabsSettings to finish loading.
   */
  private finishLoadingTabs(tabsSettings: TabSettingsDictionary): void {
    const visibleTabContainers: TabContainer[] = [];
    const hiddenTabContainers: TabContainer[] = [];
    const favoritesCollection = collectionStore.GetCollection("favorite");
    const soundtracksCollection = collectionStore.GetCollection('type-music');
    this.userHasVisibleFavorites = favoritesCollection && favoritesCollection.visibleApps.length > 0;
    this.userHasVisibleSoundtracks = soundtracksCollection && soundtracksCollection.visibleApps.length > 0;
    let favoritesOriginalIndex = null;
    let soundtracksOriginalIndex = null;

    if (tabsSettings.Favorites && !this.userHasVisibleFavorites) {
      favoritesOriginalIndex = tabsSettings.Favorites.position;
      delete tabsSettings['Favorites'];
    }
    if (tabsSettings.Soundtracks && !this.userHasVisibleSoundtracks) {
      soundtracksOriginalIndex = tabsSettings.Soundtracks.position;
      delete tabsSettings['Soundtracks'];
    }

    for (const keyId in tabsSettings) {
      const { id, title, filters: _filters, position, filtersMode, categoriesToInclude, autoHide, sortByOverride } = tabsSettings[keyId];
      const filters = Filter.removeUnknownTypes(_filters);
      const tabContainer = filters ? this.addCustomTabContainer(id, title, position, filters, filtersMode!, categoriesToInclude!, autoHide!, sortByOverride) : this.addDefaultTabContainer(tabsSettings[keyId]);

      if (favoritesOriginalIndex !== null && favoritesOriginalIndex > -1 && tabContainer.position > favoritesOriginalIndex) {
        tabContainer.position--;
      }
      if (soundtracksOriginalIndex !== null && soundtracksOriginalIndex > -1 && tabContainer.position > soundtracksOriginalIndex) {
        tabContainer.position--;
      }
      tabContainer.position > -1 ? visibleTabContainers[tabContainer.position] = tabContainer : hiddenTabContainers.push(tabContainer);

      if (filters) {
        const flatFilters = flattenFilters(filters);
        this.addCollectionReactionsForFilters(flatFilters);
      }
    }

    this.visibleTabsList = visibleTabContainers;
    this.hiddenTabsList = hiddenTabContainers;
    this.hasLoaded = true;

    this.updateAndSave();
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
    };
  }

  /**
   * Gets the userFriends and store tags.
   * @returns The tags and userFriends currently in state.
   */
  getFriendsAndTags() {
    return {
      currentUsersFriends: this.currentUsersFriends,
      allStoreTags: this.allStoreTags
    };
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
    LogController.log('Saving Tabs...');

    const allTabsSettings: TabSettingsDictionary = {};

    this.tabsMap.forEach(tabContainer => {
      const tabSettings: TabSettings = tabContainer.filters ?
        {
          id: tabContainer.id,
          title: tabContainer.title,
          position: tabContainer.position,
          filters: tabContainer.filters,
          filtersMode: (tabContainer as CustomTabContainer).filtersMode,
          categoriesToInclude: (tabContainer as CustomTabContainer).categoriesToInclude,
          autoHide: (tabContainer as CustomTabContainer).autoHide,
          sortByOverride: (tabContainer as CustomTabContainer).sortByOverride
        }
        : tabContainer;

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
   * @param categoriesToInclude A bit field of which categories should be included in the tab.
   * @param autoHide Whether or not the tab should automatically be hidden if it's collection is empty.
   * @param sortByOverride The eSortBy number to force use for sorting. -1 ignores override.
   * @returns A tab container for this tab.
   */
  private addCustomTabContainer(tabId: string, title: string, position: number, filterSettingsList: TabFilterSettings<FilterType>[], filtersMode: LogicalMode, categoriesToInclude: number, autoHide: boolean, sortByOverride: number = -1) {
    const tabContainer = new CustomTabContainer(tabId, title, position, filterSettingsList, filtersMode, categoriesToInclude, autoHide, sortByOverride);
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
    const visibleTabContainers: TabContainer[] = [];
    const hiddenTabContainers: TabContainer[] = [];
    this.tabsMap.forEach(tabContainer => {
      tabContainer.position > -1 ? visibleTabContainers[tabContainer.position] = tabContainer : hiddenTabContainers.push(tabContainer);
    });
    this.visibleTabsList = visibleTabContainers;
    this.hiddenTabsList = hiddenTabContainers;
  }

  /**
   * Saves tab settings and dispatches event to update context provider
   */
  private updateAndSave() {
    this.saveTabs();
    this.update();
  }

  /**
   * Dispatches event to update context provider and rerenders library component.
   */
  private update() {
    this.eventBus.dispatchEvent(new Event("stateUpdate"));
    this.rerenderLibrary();
  }

  /**
   * Method that will be used to force library to rerender. Assigned later in the library patch.
   */
  private rerenderLibrary() {

  }

  /**
   * Assigns the callback that will be used to rerender the library.
   * @param handler The callback that will cause the library to rerender.
   */
  registerRerenderLibraryHandler(handler: () => void) {
    this.rerenderLibrary = handler;
  }
}
