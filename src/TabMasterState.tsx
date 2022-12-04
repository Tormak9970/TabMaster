import {ReorderableListData} from "./ReorderableList";
import {createContext, FC, useContext, useEffect, useState} from "react";
import {Filter, LibraryTab, LibraryTabElement} from "./LibraryTab";
import {CollectionFilter} from "./CollectionFilter";
import {InstalledFilter} from "./InstalledFilter";
import {set_hidden_tabs, set_tabs} from "./Python";
import {ServerAPI} from "decky-frontend-lib";
import {RegexFilter} from "./RegexFilter";

export type LibraryTabDictionary = {
	[key: string]: LibraryTabElement
}

interface PublicTabMasterState
{
	libraryTabs: LibraryTabDictionary,
	libraryTabsList: LibraryTabElement[],
	reorderableLibraryTabs: ReorderableListData<LibraryTabElement>,
	tabsToHide: string[],
	customTabs: Map<string, LibraryTab>
}

interface PublicTabMasterContext extends PublicTabMasterState
{
	setLibraryTabs(shortcuts: LibraryTabDictionary): void,

	setHiddenTabs(tabs: string[]): void
}

export let tabsToHide: string[] = [];
export const showTab = (tab: string) =>
{
	tabsToHide = tabsToHide.filter(value => value!==tab)
}

export const customTabs: Map<string, LibraryTab> = new Map();
export const tabOrder: Map<string, number> = new Map();
export const default_tabs: LibraryTabDictionary = {
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

export class TabMasterState
{
	private libraryTabs: LibraryTabDictionary = {};
	private libraryTabsList: LibraryTabElement[] = [];
	private reorderableLibraryTabs: ReorderableListData<LibraryTabElement> = {};
	public eventBus = new EventTarget();
	private readonly serverAPI: ServerAPI;


	constructor(serverAPI: ServerAPI)
	{
		this.serverAPI = serverAPI;
	}

	getPublicState(): PublicTabMasterState
	{
		return {
			libraryTabs: this.libraryTabs,
			libraryTabsList: this.libraryTabsList,
			reorderableLibraryTabs: this.reorderableLibraryTabs,
			tabsToHide,
			customTabs
		}
	}

	setHiddenTabs(tabs: string[])
	{
		set_hidden_tabs(this.serverAPI, tabs).then(() =>
		{
			tabsToHide = tabs;
		});
	}

	setLibraryTabs(shortcuts: LibraryTabDictionary)
	{
		this.libraryTabs = shortcuts;
		this.libraryTabsList = Object.values(this.libraryTabs).sort((a, b) => a.position - b.position);
		this.reorderableLibraryTabs = {};
		customTabs.clear()
		Object.keys(default_tabs).forEach(default_tab =>
		{
			if (!this.libraryTabsList.some(tab => tab.id===default_tab) && !tabsToHide.includes(default_tab))
			{
				tabsToHide.push(default_tab)
			}
		});

		for (let i = 0; i < this.libraryTabsList.length; i++)
		{
			const tab = this.libraryTabsList[i];
			this.reorderableLibraryTabs[tab.id] = {
				"key": tab.id,
				"label": tab.title,
				"data": tab
			}
			if (tab.custom)
			{
				customTabs.set(tab.id,
						{
							title: tab.title,
							filters: tab.filters.map(filter =>
							{
								if (filter!==undefined)
								{
									switch (filter.type)
									{
										case "collection":
											return new CollectionFilter({collection_name: filter.params.collection_name});
										case "installed":
											return new InstalledFilter({installed: filter.params.installed});
										case "regex":
											return new RegexFilter({regex: filter.params.regex});
										default:
											return undefined;
									}
								} else return undefined;
							}).filter(value => value!==undefined) as Filter<any>[]
						});
			}
			tabOrder.set(tab.id, tab.position);

		}
		Promise.all([set_tabs(this.serverAPI, this.libraryTabs), set_hidden_tabs(this.serverAPI, tabsToHide)]).then(() =>
		{
			this.forceUpdate();
		});
	}

	private forceUpdate()
	{
		this.eventBus.dispatchEvent(new Event("stateUpdate"));
	}
}

const TabMasterContext = createContext<PublicTabMasterContext>(null as any);
export const useTabMasterState = () => useContext(TabMasterContext);

interface ProviderProps
{
	tabMasterStateClass: TabMasterState
}

export const TabMasterContextProvider: FC<ProviderProps> = ({
	                                                            children,
	                                                            tabMasterStateClass
                                                            }) =>
{
	const [publicState, setPublicState] = useState<PublicTabMasterState>({
		...tabMasterStateClass.getPublicState()
	});

	useEffect(() =>
	{
		function onUpdate()
		{
			setPublicState({...tabMasterStateClass.getPublicState()});
		}

		tabMasterStateClass.eventBus
				.addEventListener("stateUpdate", onUpdate);

		return () =>
		{
			tabMasterStateClass.eventBus
					.removeEventListener("stateUpdate", onUpdate);
		}
	}, []);

	const setLibraryTabs = (shortcuts: LibraryTabDictionary) =>
	{
		tabMasterStateClass.setLibraryTabs(shortcuts);
	}

	const setHiddenTabs = (tabs: string[]) =>
	{
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