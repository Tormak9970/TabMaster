import { Filter } from "../LibraryTab";

export class TagsFilter implements Filter<{ tags: string[] }> {
  type: string = "tags";
  params: { tags: string[] }

  /**
   * Creates a new tags filter.
   * @param params Props for the tags filter.
   */
  constructor(params: { tags: string[] }) {
    this.params = params;
  }

  /**
   * Checks if a app complies with this filter.
   * @param appOverview The overview of the app to filter.
   * @returns Whether or not to include the app.
   */
  filter(appOverview: SteamAppOverview) {
    return true;
  }
}