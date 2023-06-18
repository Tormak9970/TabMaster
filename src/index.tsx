import {
	ButtonItem,
	ConfirmModal,
	definePlugin, DialogButton,
	gamepadDialogClasses,
	Menu,
	MenuItem, PanelSection, quickAccessControlsClasses, ReorderableEntry, ReorderableList, RoutePatch,
	ServerAPI,
	showContextMenu, showModal,
	staticClasses,
} from "decky-frontend-lib";
import { VFC, Fragment } from "react";
import { FaEllipsisH, FaLayerGroup } from "react-icons/fa";

import { patchLibrary } from "./components/patches/LibraryPatch";
import {
	defaultTabs, LibraryTabDictionary,
	showTab,
	TabMasterContextProvider,
	TabMasterState, tabsToHide,
	useTabMasterState
} from "./state/TabMasterState";
import { EditTabModal } from "./components/EditTabModal";
import { LibraryTabElement } from "./components/LibraryTab";
import { cloneDeep } from "lodash";
import { PluginController } from "./lib/controllers/PluginController";
import { PythonInterop } from "./lib/controllers/PythonInterop";

declare global {
  var SteamClient: SteamClient;
	let collectionStore: CollectionStore;
	let appDetailsStore: AppDetailsStore;
  var appStore: AppStore;
  var loginStore: LoginStore;
	let uiStore: UIStore;
}

type ActionButtonProps<T> = {
	entry: ReorderableEntry<T>
}

type InteractablesProps<T> = {
	entry: ReorderableEntry<T>
}

const Content: VFC<{}> = ({}) => {
	const {libraryTabs, setLibraryTabs, setHiddenTabs, libraryTabsList, libraryTabsEntries} = useTabMasterState();

	async function reload() {
		let tabs = await PythonInterop.getTabs() as LibraryTabDictionary;
		let hiddenTabs = await PythonInterop.getHiddenTabs() as string[];

		const defaultTabEntries = Object.entries(defaultTabs);

    for (const [key, value] of defaultTabEntries) {

			if (!hiddenTabs.includes(key) && !Object.keys(tabs).includes(key)) {
				tabs[key] = value
			}
		}

		setHiddenTabs(hiddenTabs);
		setLibraryTabs(cloneDeep(tabs));
	}

	function onSave(entries: ReorderableEntry<LibraryTabElement>[]) {
		const dict: LibraryTabDictionary = {};

		entries.forEach(entry => {
			dict[entry.data!.id] = entry.data!
		});

		setLibraryTabs(dict);
	}

	function action(data: ReorderableEntry<LibraryTabElement>) {
		const tab = data.data!;

    function onEditClicked() {
      showModal(
        <EditTabModal
          onConfirm={(updated: LibraryTabElement) => {
            let tabs = cloneDeep(libraryTabs);
            tabs[tab.id] = updated;
            setLibraryTabs(tabs);
          }}
          tab={cloneDeep(tab)}
          closeModal={() => {}}
        />
      )
    }

    const EditCustomEntry: VFC<{}> = () => {
      if (tab.custom) {
        return (
          <MenuItem onSelected={onEditClicked}>
            Edit
          </MenuItem>
        );
      } else {
        return (
          <Fragment/>
        );
      };
    }

		showContextMenu(
				<Menu label="Actions">
					<EditCustomEntry />
					<MenuItem onSelected={() => {
						if (tab.custom) {
							showModal(
                <ConfirmModal
                  onOK={() => {
                    let tabs = cloneDeep(libraryTabs);
                    delete tabs[tab.id];
                    setLibraryTabs(tabs);
                  }}
                  bDestructiveWarning={true}
                >
                  Are you sure you want to delete this shortcut?
                </ConfirmModal>
							)
						} else {
							let tabs = cloneDeep(libraryTabs);
							delete tabs[tab.id];
							setLibraryTabs(tabs);
						}
					}}>
            { tab.custom ? "Delete" : "Hide" }
          </MenuItem>
				</Menu>
		);
	}

	function ActionButtion(props:ActionButtonProps<LibraryTabElement>){
		function onAction(entryReference: ReorderableEntry<LibraryTabElement>): void {
			action(entryReference)
		}

		return (
      <DialogButton style={{ height: "40px", minWidth: "40px", width: "40px", display: "flex", justifyContent: "center", alignItems: "center", padding: "10px" }} onClick={() => onAction(props.entry)} onOKButton={() => onAction(props.entry)}>
        <FaEllipsisH />
      </DialogButton>
		);
	}

	function Interactables(props:InteractablesProps<LibraryTabElement>) {
		return (<ActionButtion  entry={props.entry} />);
	}

  function onAddClicked() {
    showModal(
      <EditTabModal
        onConfirm={(updated: LibraryTabElement) => {
          let tabs = cloneDeep(libraryTabs);
          tabs[updated.id] = updated;
          setLibraryTabs(tabs);
        }} 
        tab={{ custom: true, title: "", id: "", filters: [], position: libraryTabsList.length + 1 }}
        closeModal={() => {}}
      />
    );
  }

	console.log(libraryTabsList);

	if (libraryTabsList.length == 0) reload().then(() => {});

	return (
    <>
      <style>{`
        .tab-master-scope {
          width: inherit;
          height: inherit;

          flex: 1 1 1px;
          scroll-padding: 48px 0px;
          display: flex;
          flex-direction: column;
          justify-content: flex-start;
          align-content: stretch;
        }

        .tab-master-scope .${quickAccessControlsClasses.PanelSection} {
          padding: 0px;
        }
        .tab-master-scope .${quickAccessControlsClasses.PanelSectionTitle} {
          margin-top: 3px;
          margin-left: 5px;
        }

        .tab-master-scope .${gamepadDialogClasses.FieldChildren} {
          margin: 0px 16px;
        }
        .tab-master-scope .${gamepadDialogClasses.FieldLabel} {
          margin-left: 16px;
        }

        .tab-master-scope .add-tab-btn .${gamepadDialogClasses.Field}.${gamepadDialogClasses.WithBottomSeparatorStandard}::after {
          display: none;
        }
        .tab-master-scope .add-tab-btn .${gamepadDialogClasses.FieldLabel} {
          display: none;
        }
        .tab-master-scope .add-tab-btn .${gamepadDialogClasses.FieldChildren} {
          width: calc(100% - 32px);
        }

        .tab-master-scope .seperator {
          width: 100%;
          height: 1px;
          background: #23262e;
        }
      `}</style>
      <div className="tab-master-scope">
        <div style={{ margin: "5px", marginTop: "0px" }}>
          Here you can add, re-order, or remove tabs from the library.
        </div>
        <div className="add-tab-btn">
          <ButtonItem onClick={onAddClicked}>
            Add Tab
          </ButtonItem>
        </div>
        <PanelSection title="Tabs">
          <div className="seperator"></div>
          {libraryTabsList.length > 0 ? (
            <ReorderableList<LibraryTabElement> entries={libraryTabsEntries} interactables={Interactables} onSave={onSave}/>
          ) : (
            <div style={{width: "100%", display: "flex", justifyContent: "center", alignItems: "center", padding: "5px"}}>
              Loading...
            </div>
          )}
        </PanelSection>
        <PanelSection title="Hidden Tabs">
          <div className="seperator"></div>
          {
            Object.keys(defaultTabs).filter((defaultTab) => tabsToHide.includes(defaultTab)).map((defaultTab) => defaultTabs[defaultTab]).map((defaultTab) =>
              <ButtonItem
                label={defaultTab.title}
                onClick={() => {
                  let tabs = cloneDeep(libraryTabs);
                  tabs[defaultTab.id] = defaultTab;
                  setLibraryTabs(tabs);
                  showTab(defaultTab.id);
                }}
              >
                Show
              </ButtonItem>
            )
          }
        </PanelSection>
      </div>
    </>
	);
};

export default definePlugin((serverAPI: ServerAPI) => {
  PluginController.setup(serverAPI);
  PythonInterop.setServer(serverAPI);

	let patch: RoutePatch;
	let state: TabMasterState = new TabMasterState();

	const loginUnregisterer = PluginController.initOnLogin(async () => {
    await Promise.all([PythonInterop.getTabs(), PythonInterop.getHiddenTabs()]).then(value => {
      const tabs = value[0] as LibraryTabDictionary;
      const hiddenTabs = value[1] as string[];

      Object.entries(defaultTabs).forEach(entry => {
        const key = entry[0];
        const value = entry[1];

        if (!hiddenTabs.includes(key) && !Object.keys(tabs).includes(key)) {
          tabs[key] = value;
        }
      });

      state.setHiddenTabs(hiddenTabs);
      state.setLibraryTabs(cloneDeep(tabs));
    });

    patch = patchLibrary(serverAPI);
  })

	return {
		title: <div className={staticClasses.Title}>TabMaster</div>,
		content:
      <TabMasterContextProvider tabMasterStateClass={state}>
        <Content />
      </TabMasterContextProvider>,
		icon: <FaLayerGroup/>,
		onDismount: () => {
			serverAPI.routerHook.removePatch("/library", patch);
			loginUnregisterer.unregister();
      PluginController.dismount();
		},
	};
});
