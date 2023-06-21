import {
    afterPatch,
    Patch,
    replacePatch,
    RoutePatch,
    ServerAPI,
    wrapReactType
} from "decky-frontend-lib";
import { JSXElementConstructor, ReactElement, useEffect } from "react";
import { SteamTab } from "../../types/SteamTypes";

export const patchLibrary = (serverAPI: ServerAPI): RoutePatch => {
    let TabContentTemplate: JSXElementConstructor<{ collection: SteamCollection, eSortBy: number, setSortBy: (e: any) => void, showSortingContextMenu: (e: any) => void }>;
    let TabContentPropsTemplate: { collection: SteamCollection, eSortBy: number, setSortBy: (e: any) => void, showSortingContextMenu: (e: any) => void };
    let TabAddonTemplate: JSXElementConstructor<{ count: number }>;
    //* This only runs 1 time, which is perfect
    return serverAPI.routerHook.addPatch("/library", (props: { path: string; children: ReactElement }) => {
        // console.log('route', props)
        afterPatch(props.children, "type", (_: Record<string, unknown>[], ret1: ReactElement) => {
            // console.log("ret1", ret1);
            let innerPatch: Patch;
            let memoCache: any;

            useEffect(() => {
                return innerPatch.unpatch();
            })

            //* This patch always runs twice
            afterPatch(ret1, "type", (_: Record<string, unknown>[], ret2: ReactElement) => {
                // console.log("ret2", ret2);
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
                                const tabs = fn();
                                if (TabContentTemplate === undefined) {
                                    const tabTemplate = tabs.find((tab: SteamTab) => tab?.id === "AllGames");
                                    if (tabTemplate) {
                                        TabContentTemplate = tabTemplate.content.type;
                                        TabContentPropsTemplate = tabTemplate.content.props;
                                        TabAddonTemplate = tabTemplate.renderTabAddon().type;
                                    }
                                }
                                //* Alter tabs array here

                                return tabs;
                            }, deps);
                        }
                        hooks.useMemo = fakeUseMemo;
                        const res = origMemoFn(...args);
                        hooks.useMemo = realUseMemo;
                        return res;
                    })
                    memoCache = ret2.type;
                }
                return ret2;
            });
            return ret1;
        });
        return props;
    });
}