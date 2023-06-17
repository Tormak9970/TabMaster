import { createContext, FC, useContext, useEffect, useState } from "react";
import { Filter, LibraryTab, LibraryTabElement } from "../components/LibraryTab";
import { CollectionFilter } from "../components/filters/CollectionFilter";
import { InstalledFilter } from "../components/filters/InstalledFilter";
import { ReorderableEntry } from "decky-frontend-lib";
import { RegexFilter } from "../components/filters/RegexFilter";
import { PythonInterop } from "../lib/controllers/PythonInterop";

export type LibraryTabDictionary = {
	[key: string]: LibraryTabElement
}

interface PublicTabMasterState {
	libraryTabs: LibraryTabDictionary,
	libraryTabsList: LibraryTabElement[],
	libraryTabsEntries: ReorderableEntry<LibraryTabElement>[],
	tabsToHide: string[],
	customTabs: Map<string, LibraryTab>
}

interface PublicTabMasterContext extends PublicTabMasterState {
	setLibraryTabs(shortcuts: LibraryTabDictionary): void,

	setHiddenTabs(tabs: string[]): void
}

export let tabsToHide: string[] = [];
export const showTab = (tab: string) => {
	tabsToHide = tabsToHide.filter(value => value!==tab)
}

export const customTabs: Map<string, LibraryTab> = new Map();
export const tabOrder: Map<string, number> = new Map();
export const defaultTabs: LibraryTabDictionary = {
	DeckGames: {
		id: "DeckGames",
		title: "Great On Deck",
		custom: false,
		position: 0,
		filters: []
	},
	AllGames: {
		id: "AllGames",
		title: "All Games",
		custom: false,
		position: 1,
		filters: []
	},
	Installed: {
		id: "Installed",
		title: "Installed",
		custom: false,
		position: 2,
		filters: []
	},
	Favorites: {
		id: "Favorites",
		title: "Favorites",
		custom: false,
		position: 3,
		filters: []
	},
	Collections: {
		id: "Collections",
		title: "Collections",
		custom: false,
		position: 4,
		filters: []
	},
	DesktopApps: {
		id: "DesktopApps",
		title: "Non-Steam",
		custom: false,
		position: 5,
		filters: []
	}
}

export class TabMasterState {
	private libraryTabs: LibraryTabDictionary = {};
	private libraryTabsList: LibraryTabElement[] = [];
	private libraryTabsEntries: ReorderableEntry<LibraryTabElement>[] = [];
	public eventBus = new EventTarget();

	constructor() {}

	getPublicState(): PublicTabMasterState {
		return {
			libraryTabs: this.libraryTabs,
			libraryTabsList: this.libraryTabsList,
			libraryTabsEntries: this.libraryTabsEntries,
			tabsToHide,
			customTabs
		}
	}

	setHiddenTabs(tabs: string[]) {
		PythonInterop.setHiddenTabs(tabs).then(() => {
			tabsToHide = tabs;
		});
	}

	setLibraryTabs(shortcuts: LibraryTabDictionary) {
		this.libraryTabs = shortcuts;
		this.libraryTabsList = Object.values(this.libraryTabs).sort((a, b) => a.position - b.position);
		this.libraryTabsEntries = [];
		customTabs.clear();

		Object.keys(defaultTabs).forEach(defaultTab => {
			if (!this.libraryTabsList.some(tab => tab.id===defaultTab) && !tabsToHide.includes(defaultTab)) {
				tabsToHide.push(defaultTab);
			}
		});

		for (let i = 0; i < this.libraryTabsList.length; i++) {
			const tab = this.libraryTabsList[i];

			this.libraryTabsEntries.push({
				label: tab.title,
				data: tab,
				position: tab.position
			});

			if (tab.custom) {
        const unFilteredFilters = tab.filters.map(filter => {
          if (filter !== undefined) {
            switch (filter.type) {
              case "collection":
                return new CollectionFilter({collection: collectionStore.userCollections.find((collection: { id: any; }) => collection.id === filter.params.collection)!});
              case "installed":
                return new InstalledFilter({installed: filter.params.installed});
              case "regex":
                return new RegexFilter({regex: filter.params.regex});
              default:
                return undefined;
            }
          } else {
            return undefined
          };
        });

				customTabs.set(tab.id, {
          title: tab.title,
          filters: unFilteredFilters.filter(value => value!==undefined) as Filter<any>[]
        });
			}

			tabOrder.set(tab.id, tab.position);
		}

		Promise.all([PythonInterop.setTabs(this.libraryTabs), PythonInterop.setHiddenTabs(tabsToHide)]).then(() => {
			this.forceUpdate();
		});
	}

	private forceUpdate() {
		this.eventBus.dispatchEvent(new Event("stateUpdate"));
	}
}

const TabMasterContext = createContext<PublicTabMasterContext>(null as any);
export const useTabMasterState = () => useContext(TabMasterContext);

interface ProviderProps {
	tabMasterStateClass: TabMasterState
}

export const TabMasterContextProvider: FC<ProviderProps> = ({ children, tabMasterStateClass }) => {
	const [publicState, setPublicState] = useState<PublicTabMasterState>({
		...tabMasterStateClass.getPublicState()
	});

	useEffect(() => {
		function onUpdate() {
			setPublicState({...tabMasterStateClass.getPublicState()});
		}

		tabMasterStateClass.eventBus.addEventListener("stateUpdate", onUpdate);

		return () => {
			tabMasterStateClass.eventBus.removeEventListener("stateUpdate", onUpdate);
		}
	}, []);

	const setLibraryTabs = (shortcuts: LibraryTabDictionary) => {
		tabMasterStateClass.setLibraryTabs(shortcuts);
	}

	const setHiddenTabs = (tabs: string[]) => {
		tabMasterStateClass.setHiddenTabs(tabs);
	}

	return (
    <TabMasterContext.Provider
      value={{
        ...publicState,
        setLibraryTabs,
        setHiddenTabs
      }}
    >
      {children}
    </TabMasterContext.Provider>
	)
}