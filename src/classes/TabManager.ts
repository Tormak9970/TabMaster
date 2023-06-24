import { EditableTabSettings } from "../components/EditTabModal";
import { PythonInterop } from "../lib/controllers/PythonInterop";
import { CustomTabContainer } from "./CustomTabContainer";
import { v4 as uuidv4 } from "uuid";

export const defaultTabsSettings: TabSettingsDictionary = {
    DeckGames: {
        id: "DeckGames",
        title: "Great On Deck",
        position: 0,
    },
    AllGames: {
        id: "AllGames",
        title: "All Games",
        position: 1,
    },
    Installed: {
        id: "Installed",
        title: "Installed",
        position: 2,
    },
    Collections: {
        id: "Collections",
        title: "Collections",
        position: 3,
    },
    DesktopApps: {
        id: "DesktopApps",
        title: "Non-Steam",
        position: 4,
    },
    Soundtracks: {
        id: "Soundtracks",
        title: "Soundtracks",
        position: 5,
    }
}

// Favorites: {
//     id: "Favorites",
//     title: "Favorites",
//     position: 3,
// },

export class TabMasterManager {
    private tabsMap: Map<string, TabContainer>
    private visibleTabsList: TabContainer[] = []
    private hiddenTabsList: TabContainer[] = []
    private hasLoaded: boolean
    public eventBus = new EventTarget()
    constructor() {
        this.hasLoaded = false
        this.tabsMap = new Map<string, TabContainer>()
    }

    updateCustomTab(customTabId: string, updatedTabSettings: EditableTabSettings) {
        (this.tabsMap.get(customTabId) as CustomTabContainer).update(updatedTabSettings)
        this.update()
    }

    reorderTabs(orederedTabIds: string[]) {
        for (let i = 0; i < orederedTabIds.length; i++){
            this.tabsMap.get(orederedTabIds[i])!.position = i
        }
        this.rebuildTabLists()
        this.update()
    }

    hideTab(tabId: string){
        const tabContainer = this.tabsMap.get(tabId)!
        this.hiddenTabsList.push(this.visibleTabsList.splice(tabContainer.position, 1)[0])
        this.visibleTabsList.slice(tabContainer.position).forEach(tabContainer => tabContainer.position--)
        tabContainer.position = -1
        this.update()
    }

    showTab(tabId: string){
        const tabContainer = this.tabsMap.get(tabId)!
        const hiddenIndex = this.hiddenTabsList.findIndex(hiddenTabContainer => hiddenTabContainer === tabContainer)
        tabContainer.position = this.visibleTabsList.length
        this.visibleTabsList.push(this.hiddenTabsList.splice(hiddenIndex, 1)[0])
        if (tabContainer.filters && (tabContainer as CustomTabContainer).collection.allApps === undefined) {
            (tabContainer as CustomTabContainer).buildCollection()
        }
        this.update()
    }

    deleteTab(tabId: string) {
        let tabContainer = this.tabsMap.get(tabId)!
        const tabsArrayToRemoveFrom = tabContainer.position > -1 ? this.visibleTabsList : this.hiddenTabsList
        const index = tabContainer.position > -1 ? tabContainer.position : this.hiddenTabsList.findIndex(hiddenTabContainer => hiddenTabContainer === tabContainer)
        tabsArrayToRemoveFrom.splice(index, 1)
        this.tabsMap.delete(tabId)
        this.update()
    }

    createNewTab(title: string, position: number, filterSettingsList: TabFilterSettings<FilterType>[]) {
        const id = uuidv4()
        this.visibleTabsList.push(this.addCustomTabContainer(id, title, position, filterSettingsList))
        this.update()
    }

    loadTabs = async () => {
        const settings = await PythonInterop.getTabs()
        if (settings instanceof Error) {
            console.log("Tab Master couldn't load tab settings")
            return
        }
        const tabsSettings = Object.keys(settings).length > 0 ? settings : defaultTabsSettings
        const visibleTabContainers: TabContainer[] = []
        const hiddenTabContainers: TabContainer[] = []
        for (const keyId in tabsSettings) {
            const { id, title, filters, position } = tabsSettings[keyId]
            const tabContainer = filters ? this.addCustomTabContainer(id, title, position, filters) : this.addDefaultTabContainer(tabsSettings[keyId])
            tabContainer.position > -1 ? visibleTabContainers[tabContainer.position] = tabContainer : hiddenTabContainers.push(tabContainer)
        }
        this.visibleTabsList = visibleTabContainers
        this.hiddenTabsList = hiddenTabContainers
        this.hasLoaded = true
        this.eventBus.dispatchEvent(new Event("stateUpdate"))
    }

    getTabs() {
        return {
            visibleTabsList: this.visibleTabsList,
            hiddenTabsList: this.hiddenTabsList,
            tabsMap: this.tabsMap
        }
    }

    get hasSettingsLoaded () {
        return this.hasLoaded
    }

    private saveTabs() {
        console.log('saving tabs')
        const allTabsSettings: TabSettingsDictionary = {}
        this.tabsMap.forEach(tabContainer => {
            const tabSettings = tabContainer.filters ?
            { id: tabContainer.id, title: tabContainer.title, position: tabContainer.position, filters: tabContainer.filters }
            : tabContainer
            // console.log('saving with settings :', tabSettings)
            allTabsSettings[tabContainer.id] = tabSettings
        })
        PythonInterop.setTabs(allTabsSettings)
    }

    private addCustomTabContainer(tabId: string, title: string, position: number, filterSettingsList: TabFilterSettings<FilterType>[]) {
        const tabContainer = new CustomTabContainer(tabId, title, position, filterSettingsList)
        this.tabsMap.set(tabId, tabContainer)
        return tabContainer
    }

    private addDefaultTabContainer(defaultTabSettings: TabContainer) {
        this.tabsMap.set(defaultTabSettings.id, defaultTabSettings)
        return defaultTabSettings
    }

    private rebuildTabLists() {
        const visibleTabContainers: TabContainer[] = []
        const hiddenTabContainers: TabContainer[] = []
        this.tabsMap.forEach(tabContainer => {
            tabContainer.position > -1 ? visibleTabContainers[tabContainer.position] = tabContainer : hiddenTabContainers.push(tabContainer)
        })
        this.visibleTabsList = visibleTabContainers
        this.hiddenTabsList = hiddenTabContainers
    }

    private update() {
        this.saveTabs()
        this.eventBus.dispatchEvent(new Event("stateUpdate"));
    }
}