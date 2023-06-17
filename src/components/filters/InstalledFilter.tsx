import {Filter} from "../LibraryTab";

export class InstalledFilter implements Filter<{ installed: boolean }> {
	type: string = "collection";
	params: { installed: boolean };
  private readonly installed: boolean;

  /**
   * Creates a new installed filter.
   * @param params Props for the Installed filter.
   */
	constructor(params: { installed: boolean }) {
		this.params = params;
		this.installed = params.installed ?? false;
	}

  /**
   * Filters the app.
   * @param appOverview The overview of the app to filter.
   * @returns Whether to include an app based on wether or not installed is checked.
   */
	filter(app: SteamAppOverview): boolean {
		return this.installed ? app.installed : !app.installed;
	}
}