import {
  ButtonItem,
  definePlugin,
  DialogButton,
  Field,
  Focusable,
  Navigation,
  PanelSection,
  ReorderableEntry,
  ReorderableList,
  RoutePatch,
  ServerAPI,
  showModal,
  SidebarNavigation,
  staticClasses,
} from "decky-frontend-lib";
import { VFC, Fragment, ReactNode } from "react";

import { TbLayoutNavbarExpand } from "react-icons/tb";
import { FaSteam, FaArrowRotateRight } from "react-icons/fa6";
import { MdNumbers } from "react-icons/md";

import { PluginController } from "./lib/controllers/PluginController";
import { PythonInterop } from "./lib/controllers/PythonInterop";

import { TabMasterContextProvider, useTabMasterContext } from "./state/TabMasterContext";
import { TabMasterManager } from "./state/TabMasterManager";

import { patchLibrary } from "./patches/LibraryPatch";
import { patchSettings } from "./patches/SettingsPatch";

import { QamStyles } from "./components/styles/QamStyles";
import { EditableTabSettings, EditTabModal } from "./components/modals/EditTabModal";
import { CustomTabContainer } from "./components/CustomTabContainer";
import { TabActionsButton } from "./components/TabActions";
import { LogController } from "./lib/controllers/LogController";
import { DocPage } from "./components/docs/DocsPage";

declare global {
  var SteamClient: SteamClient;
  let collectionStore: CollectionStore;
  let appStore: AppStore;
  let loginStore: LoginStore;
  let friendStore: FriendStore;
  //* This casing is correct, idk why it doesn't match the others.
  let securitystore: SecurityStore;
}

type TabIdEntryType = {
  id: string;
};

interface TabEntryInteractablesProps {
  entry: ReorderableEntry<TabIdEntryType>;
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
      <EditTabModal
        onConfirm={(_: any, tabSettings: EditableTabSettings) => {
          tabMasterManager.createCustomTab(tabSettings.title, visibleTabsList.length, tabSettings.filters, tabSettings.filtersMode, tabSettings.includesHidden);
        }}
        tabFilters={[]}
        tabMasterManager={tabMasterManager}
        filtersMode="and"
        includesHidden={false}
      />
    );
  }

  function refreshTabs() {
    tabMasterManager.getTabs().visibleTabsList.forEach((tabContainer) => {
      if (tabContainer.filters && tabContainer.filters.length !== 0) {
        (tabContainer as CustomTabContainer).buildCollection();
      }
    });
  }

  const entries = visibleTabsList.map((tabContainer) => {
    return {
      label:
        <div className="tab-label-cont">
          <div className="tab-label">{tabContainer.title}</div>
          {tabContainer.filters ? <Fragment /> : <FaSteam />}
        </div>,
      position: tabContainer.position,
      data: { id: tabContainer.id }
    };
  });

  return (
    <>
      <QamStyles />
      <div className="tab-master-scope">
        <Focusable onMenuActionDescription='Open Docs' onMenuButton={() => { Navigation.CloseSideMenus(); Navigation.Navigate("/tab-master-docs"); }}>
          <div style={{ margin: "5px", marginTop: "0px" }}>
            Here you can add, re-order, or remove tabs from the library.
          </div>
          <Field className="no-sep">
            <Focusable style={{ width: "100%", display: "flex" }}>
              <Focusable className="add-tab-btn" style={{ width: "calc(100% - 50px)" }}>
                <DialogButton onClick={onAddClicked} onOKActionDescription={'Add Tab'}>
                  Add Tab
                </DialogButton>
              </Focusable>
              {tabMasterManager.hasSettingsLoaded &&
                <Focusable className="add-tab-btn" style={{ marginLeft: "10px" }}>
                  <DialogButton
                    style={{ height: '40px', width: '42px', minWidth: 0, padding: '10px 12px', marginLeft: 'auto', display: "flex", justifyContent: "center", alignItems: "center", marginRight: "8px" }}
                    onOKActionDescription={'Refresh Tab Games'}
                    onClick={refreshTabs}
                  >
                    <FaArrowRotateRight />
                  </DialogButton>
                </Focusable>}
            </Focusable>
          </Field>
          <PanelSection title="Tabs">
            <div className="seperator"></div>
            {tabMasterManager.hasSettingsLoaded ? (
              <ReorderableList<TabIdEntryType>
                entries={entries}
                interactables={TabEntryInteractables}
                onSave={(entries: ReorderableEntry<TabIdEntryType>[]) => {
                  tabMasterManager.reorderTabs(entries.map(entry => entry.data!.id));
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
                    label={
                      <div className="tab-label-cont">
                        <div className="tab-label">{tabContainer.title}</div>
                        {tabContainer.filters ? <Fragment /> : <FaSteam />}
                      </div>
                    }
                    onClick={() => tabMasterManager.showTab(tabContainer.id)}
                    onOKActionDescription="Unhide tab"
                  >
                    Show
                  </ButtonItem>
                </div>
              )
            }
          </PanelSection>
        </Focusable>
      </div>
    </>
  );
};

type DocRouteEntry = {
  title: string,
  content: ReactNode,
  route: string,
  icon: ReactNode,
  hideTitle: boolean;
};

type DocRoutes = {
  [pageName: string]: DocRouteEntry;
};

type TabMasterDocsRouterProps = {
  docs: DocPages;
};

/**
 * The documentation pages router for TabMaster.
 */
const TabMasterDocsRouter: VFC<TabMasterDocsRouterProps> = ({ docs }) => {
  const docPages: DocRoutes = {};
  Object.entries(docs).map(([pageName, doc]) => {
    docPages[pageName] = {
      title: pageName,
      content: <DocPage content={doc} />,
      route: `/tab-master-docs/${pageName.toLowerCase().replace(/ /g, "-")}`,
      icon: <MdNumbers />,
      hideTitle: true
    };
  });

  return (
    <SidebarNavigation
      title="TabMaster Docs"
      showTitle
      pages={[
        docPages["Overview"],
        docPages["Tabs"],
        docPages["Filters"],
        docPages["The Fix System"]
      ]}
    />
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

  PythonInterop.getDocs().then((pages: DocPages | Error) => {
    if (pages instanceof Error) {
      LogController.error(pages);
    } else {
      serverAPI.routerHook.addRoute("/tab-master-docs", () => (
        <TabMasterContextProvider tabMasterManager={tabMasterManager}>
          <TabMasterDocsRouter docs={pages} />
        </TabMasterContextProvider>
      ));
    }
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
      serverAPI.routerHook.removePatch("/settings", settingsPatch);
      serverAPI.routerHook.removeRoute("/tab-master-docs");

      loginUnregisterer.unregister();
      PluginController.dismount();
    },
  };
});

