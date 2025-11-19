interface DeckyLoader {
  pluginReloadQueue: { name: string; version?: string; }[];
  routerHook: {
    routerState: {
      _routePatches: Map<string, Set<Function>>
    }
  }
};
