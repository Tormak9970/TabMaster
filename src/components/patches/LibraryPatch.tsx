import {
  afterPatch,
  Patch,
  replacePatch,
  RoutePatch,
  ServerAPI,
  wrapReactType
} from "decky-frontend-lib";
import { ReactElement, useEffect } from "react";
import { TabMasterManager } from "../../state/TabMasterManager";
import { CustomTabContainer } from "../CustomTabContainer";

export const patchLibrary = (serverAPI: ServerAPI, tabMasterManager: TabMasterManager): RoutePatch => {
  //* This only runs 1 time, which is perfect
  return serverAPI.routerHook.addPatch("/library", (props: { path: string; children: ReactElement }) => {
    afterPatch(props.children, "type", (_: Record<string, unknown>[], ret1: ReactElement) => {
      let innerPatch: Patch;
      let memoCache: any;

      useEffect(() => {
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
          wrapReactType(ret2.type.type);

          //* This runs once for every outer run
          innerPatch = replacePatch(ret2.type, 'type', (args) => {
            const hooks = (window.SP_REACT as any).__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED.ReactCurrentDispatcher.current;
            const realUseMemo = hooks.useMemo;

            const fakeUseMemo = (fn: () => any, deps: any[]) => {
              return realUseMemo(() => {
                const tabs: SteamTab[] = fn();

                if (CustomTabContainer.TabContentTemplate === undefined) {
                  const tabTemplate = tabs.find((tab: SteamTab) => tab?.id === "AllGames");
                  if (tabTemplate) CustomTabContainer.TabContentTemplate = tabTemplate.content.type as TabContentComponent;
                }

                let pacthedTabs: SteamTab[];

                if (tabMasterManager.hasSettingsLoaded) {
                  let tablist = tabMasterManager.getTabs().visibleTabsList;

                  console.log('tabs to build list', tablist);

                  pacthedTabs = tablist.map((tabContainer) => {
                    if (tabContainer.filters && tabContainer.filters.length > 0) {
                      return (tabContainer as CustomTabContainer).actualTab;
                    } else {
                      return tabs.find(actualTab => actualTab.id === tabContainer.id)!;
                    }
                  });
                } else {
                  pacthedTabs = tabs;
                }

                console.log('tabs', pacthedTabs);

                return pacthedTabs;
              }, deps)
            }
            
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
}