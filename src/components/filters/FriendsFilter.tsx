import { Filter } from "../LibraryTab";

export class FriendsFilter implements Filter<{ friends: SteamFriend[] }> {
  type: string = "friends";
  params: { friends: SteamFriend[] }

  /**
   * Creates a new friends filter.
   * @param params Props for the friends filter.
   */
  constructor(params: { friends: SteamFriend[] }) {
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