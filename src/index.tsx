import { definePlugin, RoutePatch, routerHook } from "@decky/api";
import { TbLayoutNavbarExpand } from "react-icons/tb";
import { PluginController } from "./lib/controllers/PluginController";
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
  let DeckyPluginLoader: DeckyLoader;
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


export default definePlugin(() => {
  let libraryPatch: RoutePatch;
  let settingsPatch: RoutePatch;

  const tabMasterManager = new TabMasterManager();
  PluginController.setup(tabMasterManager);

  const loginUnregisterer = PluginController.initOnLogin(async () => {
    await MicroSDeckInterop.waitForLoad();
    await tabMasterManager.loadTabs();
    libraryPatch = patchLibrary(tabMasterManager);
    settingsPatch = patchSettings(tabMasterManager);
  });

  routerHook.addRoute("/tab-master-docs", () => (
    <TabMasterContextProvider tabMasterManager={tabMasterManager}>
      <DocsRouter />
    </TabMasterContextProvider>
  ));
  return {
    name: 'TabMaster',
    title: <></>,
    titleView: <QuickAccessTitleView title="TabMaster" tabMasterManager={tabMasterManager} />,
    content:
      <TabMasterContextProvider tabMasterManager={tabMasterManager}>
        <QuickAccessContent />
      </TabMasterContextProvider>,
    icon: <TbLayoutNavbarExpand />,
    onDismount: () => {
      routerHook.removePatch("/library", libraryPatch);
      routerHook.removePatch("/settings", settingsPatch);
      routerHook.removeRoute("/tab-master-docs");

      loginUnregisterer.unregister();
      PluginController.dismount();
    },
  };
});

