import {
  definePlugin,
  RoutePatch,
  ServerAPI,
} from "decky-frontend-lib";

import { TbLayoutNavbarExpand } from "react-icons/tb";

import { PluginController } from "./lib/controllers/PluginController";
import { PythonInterop } from "./lib/controllers/PythonInterop";

import { TabMasterContextProvider } from "./state/TabMasterContext";
import { TabMasterManager } from "./state/TabMasterManager";

import { patchLibrary } from "./patches/LibraryPatch";
import { patchSettings } from "./patches/SettingsPatch";

import { MicroSDeck } from "@cebbinghaus/microsdeck";
import { MicroSDeckInterop } from './lib/controllers/MicroSDeckInterop';
import { QuickAccessContent, QuickAccessTitleView } from "./components/qam/QuickAccessContent";
import { DocsRouter } from "./components/docs/DocsRouter";
import { Fragment } from 'react';

declare global {
  let DeckyPluginLoader: { pluginReloadQueue: { name: string; version?: string; }[]; };
  var MicroSDeck: MicroSDeck | undefined;
  var SteamClient: SteamClient;
  let collectionStore: CollectionStore;
  let appStore: AppStore;
  let loginStore: LoginStore;
  let friendStore: FriendStore;
  //* This casing is correct, idk why it doesn't match the others.
  let securitystore: SecurityStore;
  let settingsStore: SettingsStore;
  let appAchievementProgressCache: AppAchievementProgressCache;
  let LocalizationManager: LocalizationManager;
}


export default definePlugin((serverAPI: ServerAPI) => {
  let libraryPatch: RoutePatch;
  let settingsPatch: RoutePatch;

  PythonInterop.setServer(serverAPI);

  const tabMasterManager = new TabMasterManager();
  PluginController.setup(serverAPI, tabMasterManager);

  const loginUnregisterer = PluginController.initOnLogin(async () => {
    await MicroSDeckInterop.waitForLoad();
    await tabMasterManager.loadTabs();
    libraryPatch = patchLibrary(serverAPI, tabMasterManager);
    settingsPatch = patchSettings(serverAPI, tabMasterManager);
  });

  serverAPI.routerHook.addRoute("/tab-master-docs", () => (
    <TabMasterContextProvider tabMasterManager={tabMasterManager}>
      <DocsRouter />
    </TabMasterContextProvider>
  ));
  return {
    title: <></>,
    titleView: <QuickAccessTitleView title="TabMaster" tabMasterManager={tabMasterManager} />,
    content:
      <TabMasterContextProvider tabMasterManager={tabMasterManager}>
        <QuickAccessContent />
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

