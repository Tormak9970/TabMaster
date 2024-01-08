import { PythonInterop } from '../lib/controllers/PythonInterop';
import { TabMasterManager } from './TabMasterManager';

export type TabGroupDictionary = {
  [name: string]: string[]; //array of ordered tab ids
};

export class TabGroupManager {
  tabGroups: TabGroupDictionary;

  /**
   * Creates a new TabGroupManager.
   * @param tabGroups The existing tab groups the current user has.
   */
  constructor(tabGroups: TabGroupDictionary) {
    this.tabGroups = tabGroups;
  }

  /**
   * Writes a tab group.
   * @param tabGroupName The name of the tab group to write.
   * @param tabIds The list of ids of the tabs that are included in this group.
   */
  write(tabGroupName: string, tabIds: string[]) {
    this.tabGroups[tabGroupName] = tabIds;
    this.save();
  }

  /**
   * Applies a tab group.
   * @param tabGroupName The name of the tab group to apply.
   * @param tabMasterManager The plugin manager.
   */
  apply(tabGroupName: string, tabMasterManager: TabMasterManager) {
    tabMasterManager.getTabs().tabsMap.forEach(tabContainer => tabContainer.position = -1);
    tabMasterManager.reorderTabs(this.tabGroups[tabGroupName]);
  }

  /**
   * Saves all changes made to the tab groups.
   */
  private save() {
    PythonInterop.setTabGroups(this.tabGroups);
  }
}
