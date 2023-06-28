import { VFC } from "react"
import { EditableTabSettings } from "./EditTabModal"
import { useSortingHook } from "../hooks/useSortingHook"
import { TabFilterSettings, FilterType, Filter } from "./filters/Filters"

interface TabContentWrapperProps {
  collection: Collection,
  TabContentTemplate: TabContentComponent
}

const TabContentWrapper: VFC<TabContentWrapperProps> = ({ TabContentTemplate, collection }) => {
  const sortingProps = useSortingHook();
  return <TabContentTemplate collection={collection} {...sortingProps} />;
}

/**
 * Wrapper for injecting custom tabs.
 */
export class CustomTabContainer implements TabContainer {
  id: string;
  title: string;
  position: number;
  filters: TabFilterSettings<FilterType>[];
  collection: Collection;
  filtersMode: string;
  static TabContentTemplate: TabContentComponent;

  /**
   * Creates a new CustomTabContainer.
   * @param id The id of the tab.
   * @param title The title of the tab.
   * @param position The position of the tab.
   * @param filterSettingsList The tab's filters.
   */
  constructor(id: string, title: string, position: number, filterSettingsList: TabFilterSettings<FilterType>[], filtersMode: string) {
    this.id = id;
    this.title = title;
    this.position = position;
    this.filters = filterSettingsList;
    this.filtersMode = filtersMode;
    //@ts-ignore
    this.collection = {
      AsDeletableCollection: () => null,
      AsDragDropCollection: () => null,
      AsEditableCollection: () => null,
      GetAppCountWithToolsFilter: () => null, //this is how steam gets the count in renderTabAddon, we can't just copy it because it's a closure
      bAllowsDragAndDrop: false,
      bIsDeletable: false,
      bIsDynamic: false,
      bIsEditable: false,
      displayName: this.title,
      id: this.id
    }

    this.buildCollection();
  }

  get actualTab(): SteamTab {
    return {
      title: this.title,
      id: this.id,
      content: <TabContentWrapper
        TabContentTemplate={CustomTabContainer.TabContentTemplate}
        collection={this.collection}
      />,
      //* this is just temporary for now as it won't show correct count with native filters applied
      renderTabAddon: () => {
        // TODO: use staticClasses here
        return <span className='gamepadtabbedpage_TabCount_1ui4I'>
          {this.collection.visibleApps.length}
        </span>
      }
    }
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
      const appsList = collectionStore.appTypeCollectionMap.get('type-games')!.visibleApps.filter(appItem => {
        if (this.filtersMode === 'and'){
          return this.filters.every(filterSettings => Filter.run(filterSettings, appItem))
        } else {
          return this.filters.some(filterSettings => Filter.run(filterSettings, appItem))
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
    const { filters, title, filtersMode } = updatedTabInfo;
    this.title = title;
    this.filtersMode = filtersMode;
    this.filters = filters;
    this.buildCollection();
  }
}