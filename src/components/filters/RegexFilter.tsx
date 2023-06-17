import {Filter} from "../LibraryTab";

export class RegexFilter implements Filter<{ regex: string }> {
  type: string = "regex";
  params: { regex: string };
	private readonly regex: RegExp;

  /**
   * Creates a new regex filter.
   * @param params Props for the Regex filter.
   */
	constructor(params: { regex: string }) {
		this.params = params
		this.regex = new RegExp(params.regex ?? "/^$/");
	}

  /**
   * Filters the app.
   * @param appOverview The overview of the app to filter.
   * @returns Whether to include an app based on wether or not it matches the regex.
   */
	filter(app: SteamAppOverview) {
		return this.regex.test(app.display_name);
	}
}