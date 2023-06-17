import {
	afterPatch,
	findInReactTree,
	RoutePatch,
	ServerAPI,
	wrapReactType
} from "decky-frontend-lib";
import { JSXElementConstructor, ReactElement } from "react";
import { cloneDeep } from "lodash";
import { customTabs, tabOrder, tabsToHide } from "../../state/TabMasterState";

export const patchLibrary = (serverAPI: ServerAPI): RoutePatch => {
	let TabContentTemplate: JSXElementConstructor<{ collection: SteamCollection, eSortBy: number, setSortBy: (e: any) => void, showSortingContextMenu: (e: any) => void }>;
	let TabContentPropsTemplate: { collection: SteamCollection, eSortBy: number, setSortBy: (e: any) => void, showSortingContextMenu: (e: any) => void };
	let TabAddonTemplate: JSXElementConstructor<{ count: number }>;

	return serverAPI.routerHook.addPatch("/library", (props: { path: string; children: ReactElement }) => {
		wrapReactType(props.children.type);
		afterPatch(props.children, "type", (_: Record<string, unknown>[], ret1: ReactElement) => {
			let cache: any;
			let currentTab: string;

			// console.log("ret1", ret1);
			wrapReactType(ret1.type);
			afterPatch(ret1, "type", (_: Record<string, unknown>[], ret2: ReactElement) => {
				// console.log("ret2", ret2);
				currentTab = ret2.props.tab

				// @ts-ignore
				wrapReactType(ret2.type.type);
				afterPatch(ret2.props, "onShowTab", (_: Record<string, unknown>[], ret: any) => {
					currentTab = ret2.props.tab
					return ret;
				});

				afterPatch(ret2.type, "type", (_: Record<string, unknown>[], ret3: ReactElement) => {
					console.log("ret3", ret3);

					let element = findInReactTree(ret3, x => x?.props?.tabs);
					console.log("className: ", findInReactTree(ret3, x => x?.props?.className), findInReactTree(ret3, x => x?.props?.className).props.className);

					if (findInReactTree(ret3, x => x?.props?.className === "gamepadlibrary_GamepadLibrary_ZBBhe")) element.props.isLibrary = true;
					console.log("isLibrary: ", !!element.props?.isLibrary);

					if (TabContentTemplate===undefined || TabAddonTemplate===undefined) {
						let tabs = (element.props.tabs as SteamTab[]).filter(value => value!==undefined) as SteamTab[];
						let tabTemplate = tabs.find(value => value !== undefined && value?.id==="Favorites");
						// console.log("tabTemplate", tabTemplate)

						if (tabTemplate) {
							const tabContent = (tabTemplate.content.type);
							TabContentPropsTemplate = (tabTemplate.content.props);
							const tabAddon = (tabTemplate.renderTabAddon().type);

							if (typeof tabContent!=="string" && tabContent!==undefined) {
								TabContentTemplate = tabContent;
							}

							if (typeof tabAddon!=="string" && tabAddon!==undefined) {
								TabAddonTemplate = tabAddon;
							}
						}
					}

					wrapReactType(element.type.type);
					if (cache) {
						element.type = cache;
					} else {
						afterPatch(element.type, "type", (_: Record<string, any>[], ret4: ReactElement) => {
							if (ret4.props?.isLibrary) {
								// console.log("ret4", ret4);
								let tabs = (ret4.props.tabs as SteamTab[]).filter(value => value!==undefined) as SteamTab[];
								tabs = tabs.filter(value => !tabsToHide.includes(value.id));
								
                if (tabsToHide.includes(ret4.props.activeTab)) {
									if (tabs[0]!==undefined) ret4.props.activeTab = tabs[0].id;
								}
                
								console.log("tabs: ", tabs);
								ret4.props.activeTab = currentTab;

								customTabs.forEach((value, key) => {
									if (TabContentTemplate !== undefined && TabContentPropsTemplate !== undefined && TabAddonTemplate !== undefined) {
										const collection: SteamCollection = cloneDeep(collectionStore.allAppsCollection);

										collection.allApps = collectionStore.allAppsCollection.allApps.filter(app => value.filters.every(filter => filter.filter(app) && app.app_type!==4))
										collection.visibleApps = collectionStore.allAppsCollection.visibleApps.filter(app => value.filters.every(filter => filter.filter(app) && app.app_type!==4))
										const newTab: SteamTab = {
											id: key,
											title: value.title,
											content: <TabContentTemplate
                        collection={collection}
                        eSortBy={TabContentPropsTemplate.eSortBy ?? 0}
                        setSortBy={TabContentPropsTemplate.setSortBy ?? (() => {})}
                        showSortingContextMenu={TabContentPropsTemplate.showSortingContextMenu ?? (() => {})}/>,
											renderTabAddon: () => <TabAddonTemplate count={collection.visibleApps.length}/>,
										}

										if (tabs.every(value => value.id! = newTab.id)) {
											tabs.push(newTab);
										}
									}
								});

								console.log("customTabs: ", tabs);
								ret4.props.tabs = tabs.sort((a, b) => (tabOrder.get(a.id) ?? 0) - (tabOrder.get(b.id) ?? 0));
							} else {
								ret4.props.tabs = (ret4.props.tabs as SteamTab[]).filter(value => !Array.from(customTabs.keys()).includes(value.id));
							}
							console.log(element);

							return ret4;
						});
						cache = element.type;
					}
					return ret3;
				});
				return ret2;
			});
			return ret1;
		});
		return props;
	});
}