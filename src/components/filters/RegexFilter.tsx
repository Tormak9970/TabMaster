import {Filter} from "../LibraryTab";

export class RegexFilter implements Filter<{ regex: string }> {
  type: string = "regex";
  params: { regex: string };
	private readonly regex: RegExp;

  /**
   * Creates a new regex filter.
   * @param params Props for the regex filter.
   */
	constructor(params: { regex: string }) {
		this.params = params
		this.regex = new RegExp(params.regex ?? "/^$/");
	}

  /**
   * Checks if a app complies with this filter.
   * @param appOverview The overview of the app to filter.
   * @returns Whether or not to include the app.
   */
	filter(app: SteamAppOverview) {
		return this.regex.test(app.display_name);
	}
}