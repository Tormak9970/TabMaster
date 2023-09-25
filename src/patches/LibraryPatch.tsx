import {
  afterPatch,
  Patch,
  replacePatch,
  RoutePatch,
  ServerAPI,
  showContextMenu,
  wrapReactType
} from "decky-frontend-lib";
import { ReactElement, useEffect, useState } from "react";
import { TabMasterManager } from "../state/TabMasterManager";
import { CustomTabContainer } from "../components/CustomTabContainer";
import { LogController } from "../lib/controllers/LogController";
import { LibraryMenu } from '../components/menus/LibraryMenu';

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
      if (!ret1?.type) {
        LogController.raiseError('Failed to find outer library element to patch');
        return ret1;
      }
      const [refresh, setRefresh] = useState(false);

      let innerPatch: Patch;
      let memoCache: any;
      
      useEffect(() => {
        tabMasterManager.registerRerenderLibraryHandler(() => setRefresh(!refresh));
        return innerPatch.unpatch();
      });

      //* This patch always runs twice
      afterPatch(ret1, "type", (_: Record<string, unknown>[], ret2: ReactElement) => {
        if (!ret2?.type) {
          LogController.raiseError('Failed to find inner library element to patch');
          return ret2;
        }
        if (memoCache) {
          ret2.type = memoCache;
        } else {
          // @ts-ignore
          const origMemoComponent = ret2.type.type;
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
                if (!Array.isArray(tabs)){
                  LogController.raiseError('No array returned when trying to retrieve default tabs');
                  return tabs;
                }

                const [eSortBy, setSortBy, showSortingContextMenu] = deps;
                const sortingProps = { eSortBy, setSortBy, showSortingContextMenu };
                const collectionsAppFilterGamepad = deps[6];

                const tabTemplate = tabs.find((tab: SteamTab) => tab?.id === "AllGames");
                if (tabTemplate === undefined) {
                  LogController.raiseError(`Couldn't find default tab "AllGames" to copy from`);
                  return tabs;
                }

                const tabContentComponent = tabTemplate!.content.type as TabContentComponent;

                let pacthedTabs: SteamTab[];

                if (tabMasterManager.hasSettingsLoaded) {
                  let tablist = tabMasterManager.getTabs().visibleTabsList;
                  pacthedTabs = tablist.flatMap((tabContainer) => {
                    if (tabContainer.filters) {
                      const footer = { ...(tabTemplate!.footer ?? {}), onMenuButton: getShowMenu(tabContainer.id, tabMasterManager), onMenuActionDescription: 'Tab Master' };
                      return (tabContainer as CustomTabContainer).getActualTab(tabContentComponent, sortingProps, footer, collectionsAppFilterGamepad);
                    } else {
                      return tabs.find(actualTab => {
                        if (actualTab.id === tabContainer.id) {
                          if (!actualTab.footer) actualTab.footer = {};
                          actualTab.footer!.onMenuActionDescription = 'Tab Master';
                          actualTab.footer!.onMenuButton = getShowMenu(tabContainer.id, tabMasterManager);
                          return true;
                        }
                        return false;
                      }) ?? [];
                    }
                  });
                } else {
                  pacthedTabs = tabs;
                }

                return pacthedTabs;
              }, deps);
            };

            hooks.useMemo = fakeUseMemo;
            const res = origMemoComponent(...args);
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

/**
 * Get's the fn to show library menu for each tab.
 * @param id Tab container id.
 * @param tabMasterManager TabMasterManager instance.
 */
function getShowMenu(id: string, tabMasterManager: TabMasterManager) {
  return () => {
    let menu: { Hide: () => void };
    //@ts-ignore
    menu = showContextMenu(<LibraryMenu selectedTabId={id} tabMasterManager={tabMasterManager} closeMenu={() => menu.Hide()}/>);
  }
}
