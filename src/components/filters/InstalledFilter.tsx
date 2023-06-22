import {Filter} from "../LibraryTab";

export class InstalledFilter implements Filter<{ installed: boolean }> {
	type: string = "collection";
	params: { installed: boolean };
  private readonly installed: boolean;

  /**
   * Creates a new installed filter.
   * @param params Props for the installed filter.
   */
	constructor(params: { installed: boolean }) {
		this.params = params;
		this.installed = params.installed ?? false;
	}

  /**
   * Checks if a app complies with this filter.
   * @param appOverview The overview of the app to filter.
   * @returns Whether or not to include the app.
   */
	filter(app: SteamAppOverview): boolean {
		return this.installed ? app.installed : !app.installed;
	}
}