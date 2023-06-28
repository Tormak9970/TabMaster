import {
  ButtonItem,
  definePlugin,
  PanelSection,
  ReorderableEntry,
  ReorderableList,
  RoutePatch,
  ServerAPI,
  showModal,
  staticClasses,
} from "decky-frontend-lib";
import { VFC, Fragment } from "react";
import { TbLayoutNavbarExpand } from "react-icons/tb";

import { patchLibrary } from "./components/patches/LibraryPatch";
import { TabMasterContextProvider, useTabMasterContext } from "./state/TabMasterContext";
import { EditableTabSettings, EditTabModal } from "./components/EditTabModal";
import { PluginController } from "./lib/controllers/PluginController";
import { PythonInterop } from "./lib/controllers/PythonInterop";
import { TabMasterManager } from "./state/TabMasterManager";
import { TabActionsButton } from "./components/TabActions";
import { QamStyles } from "./components/styles/QamStyles";
import { patchSettings } from "./components/patches/SettingsPatch";

declare global {
  var SteamClient: SteamClient;
  let collectionStore: CollectionStore;
  let appStore: AppStore;
  let loginStore: LoginStore;
  let friendStore: FriendStore;
}

type TabIdEntryType = {
  id: string
}

interface TabEntryInteractablesProps {
  entry: ReorderableEntry<TabIdEntryType>
}

/**
 * The Quick Access Menu content for TabMaster.
 */
const Content: VFC<{}> = ({ }) => {
  const { visibleTabsList, hiddenTabsList, tabsMap, tabMasterManager } = useTabMasterContext();

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
          tabMasterManager.createCustomTab(tabSettings.title, visibleTabsList.length, tabSettings.filters)
        }}
        tabFilters={[]}
        tabMasterManager={tabMasterManager}
      />
    );
  }

  const entries = visibleTabsList.map((tabContainer) => {
    return { label: tabContainer.title, position: tabContainer.position, data: { id: tabContainer.id } }
  });

  return (
    <>
      <QamStyles />
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
              <div className="hidden-tab-btn">
                <ButtonItem
                  label={tabContainer.title}
                  onClick={() => tabMasterManager.showTab(tabContainer.id)}
                  onOKActionDescription="Unhide tab"
                >
                  Show
                </ButtonItem>
              </div>
            )
          }
        </PanelSection>
      </div>
    </>
  );
};

export default definePlugin((serverAPI: ServerAPI) => {
  let libraryPatch: RoutePatch;
  let settingsPatch: RoutePatch;

  PythonInterop.setServer(serverAPI);
  const tabMasterManager = new TabMasterManager();
  PluginController.setup(serverAPI, tabMasterManager);

  const loginUnregisterer = PluginController.initOnLogin(async () => {
    await tabMasterManager.loadTabs();
    libraryPatch = patchLibrary(serverAPI, tabMasterManager);
    settingsPatch = patchSettings(serverAPI, tabMasterManager);
  });

  return {
    title: <div className={staticClasses.Title}>TabMaster</div>,
    content:
      <TabMasterContextProvider tabMasterManager={tabMasterManager}>
        <Content />
      </TabMasterContextProvider>,
    icon: <TbLayoutNavbarExpand />,
    onDismount: () => {
      serverAPI.routerHook.removePatch("/library", libraryPatch);
      serverAPI.routerHook.removePatch("/library", settingsPatch);
      loginUnregisterer.unregister();
      PluginController.dismount();
    },
  };
});

