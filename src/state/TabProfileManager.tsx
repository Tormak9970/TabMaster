import { CustomTabContainer } from './CustomTabContainer';
import { PythonInterop } from '../lib/controllers/PythonInterop';
import { TabMasterManager } from './TabMasterManager';

export type TabProfileDictionary = {
  [name: string]: string[]; //array of ordered tab ids
};

export class TabProfileManager {
  tabProfiles: TabProfileDictionary;

  /**
   * Creates a new TabProfileManager.
   * @param tabProfiles The existing tab profiles the current user has.
   */
  constructor(tabProfiles: TabProfileDictionary) {
    Object.values(tabProfiles).forEach((tabs) => tabs.forEach((tabId, index) => {
      if (tabId === 'DeckGames') {
        tabs[index] = 'GreatOnDeck';
      }
    }));
    this.tabProfiles = tabProfiles;
  }

  /**
   * Writes a tab profile.
   * @param tabProfileName The name of the tab profile to write.
   * @param tabIds The list of ids of the tabs that are included in this profile.
   */
  write(tabProfileName: string, tabIds: string[]) {
    this.tabProfiles[tabProfileName] = tabIds;
    this.save();
  }

  /**
   * Applies a tab profile.
   * @param tabProfileName The name of the tab profile to apply.
   * @param tabMasterManager The plugin manager.
   */
  apply(tabProfileName: string, tabMasterManager: TabMasterManager) {
    const { visibleTabsList, hiddenTabsList } = tabMasterManager.getTabs();
    hiddenTabsList.forEach(tabContainer => {
      if (tabContainer.filters && (tabContainer as CustomTabContainer).collection.allApps === undefined) {
        (tabContainer as CustomTabContainer).buildCollection();
      }
    });
    visibleTabsList.forEach(tabContainer => tabContainer.position = -1);
    tabMasterManager.reorderTabs(this.tabProfiles[tabProfileName]);
  }

  delete(tabProfileName: string) {
    delete this.tabProfiles[tabProfileName];
    this.save();
  }

  /**
   * Removes tab from profiles when it has been deleted
   * @param deletedId The tab id that is being deleted
   */
  onDeleteTab(deletedId: string) {
    Object.values(this.tabProfiles).forEach(tabs => {
      const deletedIndex = tabs.findIndex(tabId => tabId === deletedId);
      if (deletedIndex > -1) tabs.splice(deletedIndex, 1);
    });
    this.save();
  }

  /**
   * Saves all changes made to the tab profiles.
   */
  private save() {
    PythonInterop.setTabProfiles(this.tabProfiles);
  }
}
