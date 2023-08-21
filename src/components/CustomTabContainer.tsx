import { EditableTabSettings } from "./modals/EditTabModal";
import { TabFilterSettings, FilterType, Filter } from "./filters/Filters";
import { gamepadTabbedPageClasses } from "../GamepadTabbedPageClasses";
import { getIncludedCategoriesFromBitField } from "../lib/Utils";

/**
 * Wrapper for injecting custom tabs.
 */
export class CustomTabContainer implements TabContainer {
  id: string;
  title: string;
  position: number;
  filters: TabFilterSettings<FilterType>[];
  collection: Collection;
  filtersMode: LogicalMode;
  categoriesToInclude: number;

  /**
   * Creates a new CustomTabContainer.
   * @param id The id of the tab.
   * @param title The title of the tab.
   * @param position The position of the tab.
   * @param filterSettingsList The tab's filters.
   * @param filtersMode boolean operator for top level filters
   * @param categoriesToInclude A bit field of which categories should be included in the tab.
   */
  constructor(id: string, title: string, position: number, filterSettingsList: TabFilterSettings<FilterType>[], filtersMode: LogicalMode, categoriesToInclude: number) {
    this.id = id;
    this.title = title;
    this.position = position;
    this.filters = filterSettingsList;
    this.filtersMode = filtersMode;
    this.categoriesToInclude = categoriesToInclude;

    //@ts-ignore
    this.collection = {
      AsDeletableCollection: () => null,
      AsDragDropCollection: () => null,
      AsEditableCollection: () => null,
      GetAppCountWithToolsFilter: (appFilter) => this.collection.visibleApps.filter(appOverview => appFilter.Matches(appOverview)).length,
      bAllowsDragAndDrop: false,
      bIsDeletable: false,
      bIsDynamic: false,
      bIsEditable: false,
      displayName: this.title,
      id: this.id
    };

    this.buildCollection();
  }

  getActualTab(TabContentComponent: TabContentComponent, sortingProps: Omit<TabContentProps, 'collection'>, footer: SteamTab['footer'], collectionAppFilter: any): SteamTab {
    return {
      title: this.title,
      id: this.id,
      footer: footer,
      content: <TabContentComponent
        collection={this.collection}
        {...sortingProps}
      />,
      renderTabAddon: () => {
        return <span className={gamepadTabbedPageClasses.TabCount}>
          {this.collection.GetAppCountWithToolsFilter(collectionAppFilter)}
        </span>;
      }
    };
  }

  /**
   * Hides an app from this tab.
   * @param appId The id of the app to hide.
   */
  //unused in current implementation
  // hideAppFromList(appId: AppId) {
  //   const appItemIndex = this.collection.visibleApps.findIndex((appItem: SteamAppOverview) => appItem.appid === appId);
  //   if (appItemIndex >= 0) this.collection.visibleApps.splice(appItemIndex, 1);
  // }

  /**
   * Unhides an app from this tab.
   * @param appId The id of the app to show.
   */
  //unused in current implementation
  // unhideAppFromList(appId: AppId) {
  //   this.collection.visibleApps.push(collectionStore.allAppsCollection.apps.get(appId)!);
  // }

  /**
   * Builds the list of games for this tab.
   */
  buildCollection() {
    if (this.position > -1) { 
      const {hidden, ...catsToIncludeObj} = getIncludedCategoriesFromBitField(this.categoriesToInclude);
      const visibility = hidden ? "allApps" : "visibleApps";
      let listToFilter: SteamAppOverview[] = [];
      
      for (const key in catsToIncludeObj) {
        const category = key as keyof typeof catsToIncludeObj;
        if (catsToIncludeObj[category]) listToFilter = listToFilter.concat(collectionStore.appTypeCollectionMap.get(`type-${category}`)![visibility]);
      }
    
      const appsList = listToFilter.filter(appItem => {
        if (this.filtersMode === 'and') {
          return this.filters.every(filterSettings => Filter.run(filterSettings, appItem));
        } else {
          return this.filters.some(filterSettings => Filter.run(filterSettings, appItem));
        }
      });

      this.collection.allApps = appsList;
      this.collection.visibleApps = [...appsList];

      const allAppsMap = collectionStore.allAppsCollection.apps;
      const appMap = new Map<AppId, SteamAppOverview>();
      appsList.forEach((appItem: SteamAppOverview) => appMap.set(appItem.appid, allAppsMap.get(appItem.appid)!));

      this.collection.apps = appMap;
    }
  }

  /**
   * Updates the tab with new settings.
   * @param updatedTabInfo The updated tab settings.
   */
  update(updatedTabInfo: EditableTabSettings) {
    const { filters, title, filtersMode, categoriesToInclude } = updatedTabInfo;
    this.title = title;
    this.filtersMode = filtersMode;
    this.categoriesToInclude = categoriesToInclude;
    this.filters = filters;
    this.buildCollection();
  }
}
