import { EditableTabSettings } from "./modals/EditTabModal";
import { TabFilterSettings, FilterType, Filter } from "./filters/Filters";
import { gamepadTabbedPageClasses } from "../GamepadTabbedPageClasses";
import { filtersHaveType, getIncludedCategoriesFromBitField } from "../lib/Utils";

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
  dependsOnMicroSDeck: boolean;

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
    this.dependsOnMicroSDeck = false;

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
    this.checkMicroSDeckDependency();
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
   * Builds the list of apps for this tab.
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
    this.checkMicroSDeckDependency;
  }

  /**
   * Checks and sets whether or not the tab has filters that depend on MicroSDeck plugin.
   */
  checkMicroSDeckDependency() {
    this.dependsOnMicroSDeck = this.containsFilterType('sd card');
  }

  /**
   * Checks if the tabs filters contain any specified filter types, including those nested within a merge filter.
   * @param filterTypes The filter types to check for.
   * @returns Boolean
   */
  containsFilterType(...filterTypes: FilterType[]) {
    return filtersHaveType(this.filters, ...filterTypes);
  }
}
