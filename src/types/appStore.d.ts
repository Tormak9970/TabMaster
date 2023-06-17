// Types for the global appStore

type AppStore = {
  GetAppOverviewByAppID: (appId: number) => SteamAppOverview | null;
}