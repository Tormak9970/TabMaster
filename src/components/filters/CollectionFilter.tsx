import { Filter } from "../LibraryTab";

export class CollectionFilter implements Filter<{ collection: SteamCollection }> {
  type: string = "collection";
  params: { collection: SteamCollection }

  /**
   * Creates a new collection filter.
   * @param params Props for the Collection filter.
   */
  constructor(params: { collection: SteamCollection }) {
    this.params = params;
  }

  /**
   * Filters the collection's app list.
   * @param appOverview The overview of the app to filter.
   * @returns A filtered list of collection apps.
   */
  filter(appOverview: SteamAppOverview) {
    return this.params.collection?.allApps.find((value: any) => value.appid === appOverview.appid) !== undefined && this.params.collection?.visibleApps.find((value: any) => value.appid === appOverview.appid) !== undefined;
  }
}