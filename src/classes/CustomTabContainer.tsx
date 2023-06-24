import { VFC } from "react"
import { EditableTabSettings } from "../components/EditTabModal"
import { useSortingHook } from "../hooks/useSortingHook"
import { Filter } from "./Filter"

interface TabContentWrapperProps {
    collection: Collection
    TabContentTemplate: TabContentComponent
}

const TabContentWrapper: VFC<TabContentWrapperProps> = ({ TabContentTemplate, collection }) => {
    const sortingProps = useSortingHook()
    return <TabContentTemplate collection={collection} {...sortingProps} />
}

export class CustomTabContainer implements TabContainer {
    id: string
    title: string
    position: number
    filters: TabFilterSettings<FilterType>[]
    collection: Collection
    static TabContentTemplate: TabContentComponent
    constructor(id: string, title: string, position: number, filterSettingsList: TabFilterSettings<FilterType>[]) {
        this.id = id
        this.title = title
        this.position = position
        this.filters = filterSettingsList
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
        this.buildCollection()
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
                return <span className='gamepadtabbedpage_TabCount_1ui4I'>
                    {this.collection.visibleApps.length}
                </span>
            }
        }
    }

    hideAppFromList(appId: AppId) {
        const appItemIndex = this.collection.visibleApps.findIndex((appItem: SteamAppOverview) => appItem.appid === appId)
        if (appItemIndex >= 0) this.collection.visibleApps.splice(appItemIndex, 1)
    }

    unhideAppFromList(appId: AppId) {
        this.collection.visibleApps.push(collectionStore.allAppsCollection.apps.get(appId)!)
    }

    buildCollection() {
        if (this.position > -1) {
            const appsList = collectionStore.appTypeCollectionMap.get('type-games')!.visibleApps.filter(appItem => this.filters.every(filterSettings => Filter.run(filterSettings, appItem)))
            this.collection.allApps = appsList
            this.collection.visibleApps = appsList.filter((appItem: SteamAppOverview) => !collectionStore.BIsHidden(appItem.appid))
            const allAppsMap = collectionStore.allAppsCollection.apps
            const appMap = new Map<AppId, SteamAppOverview>()
            appsList.forEach((appItem: SteamAppOverview) => appMap.set(appItem.appid, allAppsMap.get(appItem.appid)!))
            this.collection.apps = appMap
        }
    }

    update(updatedTabInfo: EditableTabSettings) {
        const { filters, title } = updatedTabInfo
        this.title = title
        if (this.filters !== filters) {
            this.filters = filters
            this.buildCollection()
        }
    }
}