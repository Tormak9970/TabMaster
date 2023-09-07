import {
  afterPatch,
  Patch,
  replacePatch,
  RoutePatch,
  ServerAPI,
  wrapReactType
} from "decky-frontend-lib";
import { ReactElement, useEffect, useState } from "react";
import { TabMasterManager } from "../state/TabMasterManager";
import { CustomTabContainer } from "../components/CustomTabContainer";
import { LogController } from "../lib/controllers/LogController";

/**
 * Patches the Steam library to allow the plugin to change the tabs.
 * @param serverAPI The plugin's serverAPI.
 * @param tabMasterManager The plugin's core state manager.
 * @returns A routepatch for the library.
 */
export const patchLibrary = (serverAPI: ServerAPI, tabMasterManager: TabMasterManager): RoutePatch => {
  //* This only runs 1 time, which is perfect
  return serverAPI.routerHook.addPatch("/library", (props: { path: string; children: ReactElement; }) => {
    afterPatch(props.children, "type", (_: Record<string, unknown>[], ret1: ReactElement) => {
      const [refresh, setRefresh] = useState(false);

      let innerPatch: Patch;
      let memoCache: any;
      
      useEffect(() => {
        tabMasterManager.registerRerenderLibraryHandler(() => setRefresh(!refresh));
        return innerPatch.unpatch();
      });

      //* This patch always runs twice
      afterPatch(ret1, "type", (_: Record<string, unknown>[], ret2: ReactElement) => {
        if (memoCache) {
          ret2.type = memoCache;
        } else {
          // @ts-ignore
          const origMemoFn = ret2.type.type;
          // @ts-ignore
          wrapReactType(ret2);

          //* This runs once for every outer run
          innerPatch = replacePatch(ret2.type, 'type', (args) => {
            const hooks = (window.SP_REACT as any).__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED.ReactCurrentDispatcher.current;
            const realUseMemo = hooks.useMemo;

            //* deps contains useful variables from within the orignal component that we otherwise wouldn't be able to get
            const fakeUseMemo = (fn: () => any, deps: any[]) => {
              return realUseMemo(() => {
                const tabs: SteamTab[] = fn();

                const [eSortBy, setSortBy, showSortingContextMenu] = deps;
                const sortingProps = { eSortBy, setSortBy, showSortingContextMenu };
                const collectionsAppFilterGamepad = deps[6];

                const tabTemplate = tabs.find((tab: SteamTab) => tab?.id === "AllGames");
                if (tabTemplate === undefined) {
                  LogController.error(`Tab Master couldn't find default tab "AllGames" to copy from`);
                }

                const tabContentComponent = tabTemplate!.content.type as TabContentComponent;
                const footer = tabTemplate!.footer;

                let pacthedTabs: SteamTab[];

                if (tabMasterManager.hasSettingsLoaded) {
                  let tablist = tabMasterManager.getTabs().visibleTabsList;
                  pacthedTabs = tablist.flatMap((tabContainer) => {
                    if (tabContainer.filters) {
                      return (tabContainer as CustomTabContainer).getActualTab(tabContentComponent, sortingProps, footer, collectionsAppFilterGamepad);
                    } else {
                      return tabs.find(actualTab => actualTab.id === tabContainer.id) ?? [];
                    }
                  });
                } else {
                  pacthedTabs = tabs;
                }

                return pacthedTabs;
              }, deps);
            };

            hooks.useMemo = fakeUseMemo;
            const res = origMemoFn(...args);
            hooks.useMemo = realUseMemo;

            return res;
          });

          memoCache = ret2.type;
        }

        return ret2;
      });

      return ret1;
    });

    return props;
  });
};
