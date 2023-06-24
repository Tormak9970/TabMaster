import {
  ButtonItem,
  definePlugin,
  gamepadDialogClasses,
  PanelSection, quickAccessControlsClasses, ReorderableEntry, ReorderableList, RoutePatch,
  ServerAPI,
  showModal,
  staticClasses,
} from "decky-frontend-lib";
import { VFC, Fragment } from "react";
import { PiTabs } from "react-icons/pi";

import { patchLibrary } from "./components/patches/LibraryPatch";
import { TabMasterContextProvider, useTabMasterState } from "./state/TabMasterState";
import { EditableTabSettings, EditTabModal } from "./components/EditTabModal";
import { PluginController } from "./lib/controllers/PluginController";
import { PythonInterop } from "./lib/controllers/PythonInterop";
import { TabMasterManager } from "./state/TabMasterManager";
import { TabActionsButton } from "./components/TabActions";

declare global {
  var SteamClient: SteamClient;
  let collectionStore: CollectionStore;
  let appDetailsStore: AppDetailsStore;
  let appStore: AppStore;
  let loginStore: LoginStore;
  let uiStore: UIStore;
  let friendStore: FriendStore;
}

type TabIdEntryType = {
  id: string
}

interface TabEntryInteractablesProps {
  entry: ReorderableEntry<TabIdEntryType>
}

const Content: VFC<{}> = ({ }) => {
  const { visibleTabsList, hiddenTabsList, tabsMap, tabMasterManager } = useTabMasterState();

  function TabEntryInteractables({ entry }: TabEntryInteractablesProps) {
    const tabContainer = tabsMap.get(entry.data!.id)!;
    return (<TabActionsButton {...{ tabContainer, tabMasterManager }} />);
  }

  function onAddClicked() {
    showModal(
      // @ts-ignore
      //? This is here because showModal passes the closeModal function automatically
      <EditTabModal
        onConfirm={(_: any, tabSettings: EditableTabSettings) => {
          tabMasterManager.createNewTab(tabSettings.title, visibleTabsList.length, tabSettings.filters)
        }}
        tabFilters={[]}
        tabMasterManager={tabMasterManager}
      />
    );
  }

  const entries = visibleTabsList.map((tabContainer) => {
    return { label: tabContainer.title, position: tabContainer.position, data: { id: tabContainer.id } }
  })

  // console.log('visible list', visibleTabsList)
  // console.log('hidden list', hiddenTabsList)
  // console.log('entries', entries)

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
          {tabMasterManager.hasSettingsLoaded ? (
            <ReorderableList<TabIdEntryType>
              entries={entries}
              interactables={TabEntryInteractables}
              onSave={(entries: ReorderableEntry<TabIdEntryType>[]) => {
                tabMasterManager.reorderTabs(entries.map(entry => entry.data!.id))
              }}
            />
          ) : (
            <div style={{ width: "100%", display: "flex", justifyContent: "center", alignItems: "center", padding: "5px" }}>
              Loading...
            </div>
          )}
        </PanelSection>
        <PanelSection title="Hidden Tabs">
          <div className="seperator"></div>
          {
            hiddenTabsList.map(tabContainer =>
              <ButtonItem
                label={tabContainer.title}
                onClick={() => tabMasterManager.showTab(tabContainer.id)}
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
  let patch: RoutePatch;
  const tabMasterManager = new TabMasterManager();
  
  PluginController.setup(serverAPI, tabMasterManager);
  PythonInterop.setServer(serverAPI);

  // window.tabMasterManager = tabMasterManager
  const loginUnregisterer = PluginController.initOnLogin(async () => {
    // console.log('loading')
    await tabMasterManager.loadTabs()
    // console.log('tabs loaded') 
    patch = patchLibrary(serverAPI, tabMasterManager);
  })

  return {
    title: <div className={staticClasses.Title}>TabMaster</div>,
    content:
      <TabMasterContextProvider tabMasterManager={tabMasterManager}>
        <Content />
      </TabMasterContextProvider>,
    icon: <PiTabs />,
    onDismount: () => {
      serverAPI.routerHook.removePatch("/library", patch);
      loginUnregisterer.unregister();
      PluginController.dismount();
    },
  };
});
