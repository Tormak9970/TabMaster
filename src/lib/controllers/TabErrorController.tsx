import { showModal } from 'decky-frontend-lib';
import { LogController } from './LogController';
import { validateFilter } from '../../components/filters/Filters';
import { FixTabErrorsModalRoot } from '../../components/modals/FixTabErrorsModal';
import { TabMasterManager } from '../../state/TabMasterManager';
import { EditableTabSettings } from '../../components/modals/EditTabModal';
import { CustomTabContainer } from '../../components/CustomTabContainer';

/**
 * Hanldes the tab filter validation process.
 */
export class TabErrorController {
  private static validationLock: boolean = true;
  private static validationQueue: {
    tabId: string,
    rebuildCollectionIfValid?: boolean
  }[] = [];

  /**
   * Actually performs the validation/ error handling, and processes next items in queue when done.
   * @param validationSet List of tabs to be validated.
   * @param tabMasterManager TabMasterManager instance.
   */
  private static validateInternal(validationSet: { tabId: string, rebuildCollectionIfValid?: boolean }[], tabMasterManager: TabMasterManager) {
    this.validationLock = true;
    
    const tabsMap = tabMasterManager.getTabs().tabsMap;
    const tabsSettings: { [tabId: string]: TabContainer } = {};

    validationSet.forEach(item => {
      const tabContainer = tabsMap.get(item.tabId);
      if (tabContainer && tabContainer.filters) tabsSettings[item.tabId] = tabContainer;
    });

    const tabsToFix = this.checkForBrokenFilters(tabsSettings);

    Object.keys(tabsSettings).forEach(tabId => {
      if (!tabsToFix.has(tabId) && validationSet.find(item => tabId === item.tabId && item.rebuildCollectionIfValid)) {
        (tabsMap.get(tabId) as CustomTabContainer).buildCollection();
      }
    });

    if (tabsToFix.size > 0) {
      LogController.warn(`There were ${tabsToFix.size} tabs that failed validation!`);
      showModal(
        <FixTabErrorsModalRoot
          onConfirm={(editedTabSettings: TabSettingsDictionary) => {
            for (const tab of Object.values(editedTabSettings)) {
              if (tabsToFix.has(tab.id)) {
                if (tab.filters!.length === 0) tabMasterManager.deleteTab(tab.id);
                else tabMasterManager.updateCustomTab(tab.id, tab as EditableTabSettings);
              }
            }

            this.processQueue(tabMasterManager);
          }}
          tabs={tabsSettings}
          erroredFiltersMap={tabsToFix}
          tabMasterManager={tabMasterManager}
        />
      );
    } else {
      this.processQueue(tabMasterManager);
    }
  }

  /**
   * Processes the next set of tabs in the queue to be validated.
   * @param tabMasterManager TabMasterManager instance.
   */
  private static processQueue = (tabMasterManager: TabMasterManager) => {
    const validationSet = this.validationQueue.splice(0, this.validationQueue.length);
    if (validationSet.length > 0) this.validateInternal(validationSet, tabMasterManager);
    else this.validationLock = false;
  }

  /**
   * Checks the provided tabs for broken filters.
   * @param tabsSettings Object of TabSettings/ TabContainer objects whose filters to check.
   * @returns A map of tabIds to broken filters.
   */
  private static checkForBrokenFilters(tabsSettings: TabSettingsDictionary): Map<string, FilterErrorEntry[]> {
    const tabsToFix = new Map<string, FilterErrorEntry[]>();

    for (const [id, tabSetting] of Object.entries(tabsSettings)) {
      if (tabSetting.filters) {
        const tabErroredFilters: FilterErrorEntry[] = [];

        for (let i = 0; i < tabSetting.filters.length; i++) {
          const filter = tabSetting.filters[i];
          const filterValidated = validateFilter(filter);

          if (!filterValidated) {
            tabErroredFilters.push({ filterIdx: i, errors: [`Filter "${filter.type}" cannot be validated. It has likely been removed.`] });
          } else if (!filterValidated.passed) {
            let entry: FilterErrorEntry = {
              filterIdx: i,
              errors: filterValidated.errors
            };

            if (filterValidated.mergeErrorEntries) entry.mergeErrorEntries = filterValidated.mergeErrorEntries;

            tabErroredFilters.push(entry);
          }
        }

        if (tabErroredFilters.length > 0) {
          tabsToFix.set(id, tabErroredFilters);
        }
      }
    }

    return tabsToFix;
  }

  /**
   * Checks that tab settings have valid filters.
   * 
   * This is only meant to be used when loading tabs.
   * @param tabsSettings The tab settings object.
   * @param tabMasterManager TabMasterManager instance.
   * @param finishLoading The finish loading function to execute when validation/ error correction is complete.
   */
  static validateSettingsOnLoad(tabsSettings: TabSettingsDictionary, tabMasterManager: TabMasterManager, finishLoading: (editedTabSettings: TabSettingsDictionary) => void) {
    const tabsToFix = this.checkForBrokenFilters(tabsSettings);

    if (tabsToFix.size > 0) {
      LogController.warn(`There were ${tabsToFix.size} tabs that failed validation!`);
      showModal(
        <FixTabErrorsModalRoot
          onConfirm={(editedTabSettings: TabSettingsDictionary) => {
            const tabsToDelete: string[] = [];
            for (const tab of Object.values(editedTabSettings)) {
              if (tabsToFix.has(tab.id) && tab.filters!.length === 0) tabsToDelete.push();
            }

            finishLoading(editedTabSettings);
            tabsToDelete.forEach(tabId => tabMasterManager.deleteTab(tabId));
            this.processQueue(tabMasterManager);
          }}
          tabs={tabsSettings}
          erroredFiltersMap={tabsToFix}
          tabMasterManager={tabMasterManager}
        />
      );
    } else {
      finishLoading(tabsSettings);
      this.processQueue(tabMasterManager);
    }
  }

  /**
   * Checks that specified tab containers have valid filters.
   * 
   * These validations get added to a queue to ensure only one validation/ error correction proccess happens at a time.
   * @param tabIdsToValidate An array of the tab ids to be validated
   * @param tabMasterManager TabMasterManger instance
   * @param rebuildValidTabCollections Whether or not to rebuild the collections of the tabs that pass validation.
   */
  static validateTabs(tabIdsToValidate: string[], tabMasterManager: TabMasterManager, rebuildValidTabCollections?: boolean) {
    tabIdsToValidate.forEach(tabToValidate => {
      const alreadyQueuedTab = this.validationQueue.find(queued => tabToValidate === queued.tabId);
      if (alreadyQueuedTab) {
        if (rebuildValidTabCollections) alreadyQueuedTab.rebuildCollectionIfValid = true;
      } else {
        this.validationQueue.push({ tabId: tabToValidate, rebuildCollectionIfValid: rebuildValidTabCollections });
      }
    })
    if (this.validationLock) return;

    this.processQueue(tabMasterManager);
  }  
}
