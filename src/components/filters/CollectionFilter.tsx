import { Filter } from "../LibraryTab";

export class CollectionFilter implements Filter<{ collection: SteamCollection }> {
  type: string = "collection";
  params: { collection: SteamCollection }

  /**
   * Creates a new collection filter.
   * @param params Props for the collection filter.
   */
  constructor(params: { collection: SteamCollection }) {
    this.params = params;
  }

  /**
   * Checks if a app complies with this filter.
   * @param appOverview The overview of the app to filter.
   * @returns Whether or not to include the app.
   */
  filter(appOverview: SteamAppOverview): boolean {
    return this.params.collection?.allApps.find((value: any) => value.appid === appOverview.appid) !== undefined && this.params.collection?.visibleApps.find((value: any) => value.appid === appOverview.appid) !== undefined;
  }
}