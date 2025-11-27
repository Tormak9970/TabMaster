import { EditableTabSettings } from "../components/modals/EditTabModal";
import { TabFilterSettings, FilterType, Filter } from "../components/filters/Filters";
import { filtersHaveType, getIncludedCategoriesFromBitField } from "../lib/Utils";
import { gamepadTabbedPageClasses, showModal } from "@decky/ui";
import { SortOverrideMessage } from '../components/modals/SortOverrideMessage';
import { ReactElement } from 'react';

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
  autoHide: boolean;
  visibleToOthers: boolean;
  dependsOnMicroSDeck: boolean;
  sortByOverride: number;

  /**
   * Creates a new CustomTabContainer.
   * @param id The id of the tab.
   * @param title The title of the tab.
   * @param position The position of the tab.
   * @param filterSettingsList The tab's filters.
   * @param filtersMode boolean operator for top level filters
   * @param categoriesToInclude A bit field of which categories should be included in the tab.
   * @param autoHide Whether or not the tab should automatically be hidden if it's collection is empty.
   * @param visibleToOthers Whether or not the tab can be added by other users.
   * @param sortByOverride The eSortBy number to force use for sorting. -1 ignores override.
   */
  constructor(id: string, title: string, position: number, filterSettingsList: TabFilterSettings<FilterType>[], filtersMode: LogicalMode, categoriesToInclude: number, autoHide: boolean, visibleToOthers: boolean, sortByOverride: number) {
    this.id = id;
    this.title = title;
    this.position = position;
    this.filters = filterSettingsList;
    this.filtersMode = filtersMode;
    this.categoriesToInclude = categoriesToInclude;
    this.autoHide = autoHide;
    this.visibleToOthers = visibleToOthers;
    this.dependsOnMicroSDeck = false;
    this.sortByOverride = sortByOverride;

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

    if (this.position > -1) {
      this.buildCollection();
    }
    this.checkMicroSDeckDependency();
  }

  getActualTab(TabAppGrid: TabAppGridComponent, TabContext: TabContext | undefined, sortingProps: Omit<TabAppGridComponentProps, 'collection'>, footer: SteamTab['footer'] = {}, collectionAppFilter: any, isMicroSDeckInstalled: boolean): SteamTab | null {
    if (!isMicroSDeckInstalled && this.dependsOnMicroSDeck) return null;
    if (this.autoHide && this.collection.visibleApps.length === 0) return null;
    const showSortOverride = () => showModal(<SortOverrideMessage eSortBy={this.sortByOverride} />);
    if (this.sortByOverride !== -1) footer.onOptionsButton = showSortOverride;
    const createContent = (inner: ReactElement) => !TabContext ? inner : <TabContext.Provider value={{ label: this.title }}>{inner}</TabContext.Provider>;

    return {
      title: this.title,
      id: this.id,
      footer: footer,
      content: createContent(
        <TabAppGrid
          collection={this.collection}
          setSortBy={sortingProps.setSortBy}
          eSortBy={this.sortByOverride === -1 ? sortingProps.eSortBy : this.sortByOverride}
          showSortingContextMenu={this.sortByOverride === -1 ? sortingProps.showSortingContextMenu : showSortOverride}
        />),
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
    const { hidden, ...catsToIncludeObj } = getIncludedCategoriesFromBitField(this.categoriesToInclude);
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

    const appMap = new Map<AppId, SteamAppOverview>();
    appsList.forEach((appItem: SteamAppOverview) => appMap.set(appItem.appid, appItem));

    this.collection.apps = appMap;
  }

  /**
   * Updates the tab with new settings.
   * @param updatedTabInfo The updated tab settings.
   */
  update(updatedTabInfo: EditableTabSettings) {
    this.title = updatedTabInfo.title;
    this.filtersMode = updatedTabInfo.filtersMode;
    this.categoriesToInclude = updatedTabInfo.categoriesToInclude;
    this.filters = updatedTabInfo.filters;
    this.autoHide = updatedTabInfo.autoHide;
    this.visibleToOthers = updatedTabInfo.visibleToOthers;
    this.sortByOverride = updatedTabInfo.sortByOverride;
    this.buildCollection();
    this.checkMicroSDeckDependency();
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
