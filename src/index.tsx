import {
	ButtonItem,
	ConfirmModal,
	definePlugin,
	Menu,
	MenuItem,
	ServerAPI,
	showContextMenu, showModal,
	staticClasses,
} from "decky-frontend-lib";
import {VFC, Fragment} from "react";
import {FaShip} from "react-icons/fa";

import {patchAppPage} from "./AppPatch";
import {AppDetailsStore, CollectionStore, UIStore} from "./SteamTypes";
import {ReorderableEntry, ReorderableList} from "./ReorderableList";
import {
	default_tabs,
	LibraryTabDictionary, showTab,
	TabMasterContextProvider,
	TabMasterState, tabsToHide,
	useTabMasterState
} from "./TabMasterState";
import {EditTabModal} from "./EditTabModal";
import {LibraryTabElement} from "./LibraryTab";
import {cloneDeep} from "lodash";
import {get_hidden_tabs, get_tabs} from "./Python";

declare global
{
	let collectionStore: CollectionStore;
	let appDetailsStore: AppDetailsStore;
	let uiStore: UIStore;
}

const Content: VFC<{ serverAPI: ServerAPI }> = ({serverAPI}) =>
{
	const {libraryTabs, setLibraryTabs, setHiddenTabs, libraryTabsList, reorderableLibraryTabs} = useTabMasterState();
	async function reload() {
		let tabs = await get_tabs(serverAPI);
		let hidden_tabs = await get_hidden_tabs(serverAPI);
		Object.entries(default_tabs).forEach(entry =>
		{
			const key = entry[0];
			const value = entry[1];
			if (!hidden_tabs.includes(key) && !Object.keys(tabs).includes(key))
			{
				tabs[key] = value
			}
		});
		setHiddenTabs(hidden_tabs);
		setLibraryTabs(cloneDeep(tabs));
	}

	const reloadData = { "showReload": true, "reload": reload, "reloadLabel": "Library Tabs" };

	function onUpdate(data: LibraryTabDictionary) {
		setLibraryTabs(data);
	}
	function action(e: MouseEvent, data: ReorderableEntry<LibraryTabElement>) {
		const tab = data.data;
		showContextMenu(
				<Menu label="Actions">
					{(() =>
					{
						if (tab.custom)
						{
							return <MenuItem onSelected={() =>
							{
								showModal(
										<EditTabModal onConfirm={(updated: LibraryTabElement) =>
										{
											let tabs = cloneDeep(libraryTabs);
											tabs[tab.id] = updated;
											setLibraryTabs(tabs);
										}} tab={cloneDeep(tab)} closeModal={() =>
										{
										}}/>
								)
							}}>Edit</MenuItem>
						}
						else return <Fragment/>;
					})()}
					<MenuItem onSelected={() => {
						if (tab.custom)
						{
							showModal(
									<ConfirmModal onOK={() =>
									{
										let tabs = cloneDeep(libraryTabs);
										delete tabs[tab.id];
										setLibraryTabs(tabs);
									}} bDestructiveWarning={true}>
										Are you sure you want to delete this shortcut?
									</ConfirmModal>
							)
						}
						else
						{
							let tabs = cloneDeep(libraryTabs);
							delete tabs[tab.id];
							setLibraryTabs(tabs);
						}
					}}>{(() => {
						if (tab.custom) return "Delete"
						else return "Hide"
					})()}</MenuItem>
				</Menu>,
				e.currentTarget ?? window
		);
	}
	console.log(libraryTabsList)
	if (libraryTabsList.length == 0) reload().then(() => {});
	return (
			<Fragment>
				<div style={{
					marginBottom: "5px"
				}}>Here you can add, re-order, or remove Library Tabs</div>
				<ButtonItem onClick={() =>
				{
					showModal(<EditTabModal onConfirm={(updated: LibraryTabElement) => {
						let tabs = cloneDeep(libraryTabs);
						tabs[updated.id] = updated;
						setLibraryTabs(tabs);
					}} tab={{
						custom: true,
						title: "",
						id: "",
						filters: [],
						position: libraryTabsList.length + 1
					}} closeModal={() => {}}/>)
				}}>
					Add
				</ButtonItem>
				{libraryTabsList.length > 0 ? (
						<ReorderableList<LibraryTabElement> data={reorderableLibraryTabs} reloadData={reloadData} action={action} onUpdate={onUpdate}/>
				) : (
						<div style={{width: "100%", display: "flex", justifyContent: "center", alignItems: "center", padding: "5px"}}>
							Loading...
						</div>
				)
				}
				{
					Object.keys(default_tabs).filter(default_tab => tabsToHide.includes(default_tab)).map(default_tab => default_tabs[default_tab]).map(default_tab =>

							<ButtonItem
									label={default_tab.title}
									onClick={() =>
									{
										let tabs = cloneDeep(libraryTabs);
										tabs[default_tab.id] = default_tab;
										setLibraryTabs(tabs);
										showTab(default_tab.id);
									}}
							>
								Show
							</ButtonItem>)
				}
			</Fragment>
	);
};

export default definePlugin((serverAPI: ServerAPI) =>
{
	const state = new TabMasterState(serverAPI);

	Promise.all([get_tabs(serverAPI), get_hidden_tabs(serverAPI)]).then(value =>
	{
		const tabs = value[0];
		const hidden_tabs = value[1];
		Object.entries(default_tabs).forEach(entry =>
		{
			const key = entry[0];
			const value = entry[1];
			if (!hidden_tabs.includes(key) && !Object.keys(tabs).includes(key))
			{
				tabs[key] = value
			}
		});
		state.setHiddenTabs(hidden_tabs);
		state.setLibraryTabs(cloneDeep(tabs));
	});

	const patch = patchAppPage(serverAPI);
	return {
		title: <div className={staticClasses.Title}>Example Plugin</div>,
		content:
				<TabMasterContextProvider tabMasterStateClass={state}>
					<Content serverAPI={serverAPI}/>
				</TabMasterContextProvider>,
		icon: <FaShip/>,
		onDismount()
		{
			serverAPI.routerHook.removePatch("/library", patch);
		},
	};
});
