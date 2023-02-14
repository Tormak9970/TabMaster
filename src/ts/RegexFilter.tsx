import {Filter} from "./LibraryTab";
import {SteamAppOverview} from "./SteamTypes";

export class RegexFilter implements Filter<{ regex: string }>
{
	get params(): { regex: string }
	{
		return this._params;
	}

	private readonly _params: { regex: string };
	private readonly regex: RegExp;

	filter(app: SteamAppOverview)
	{
		return this.regex.test(app.display_name);
	}

	type: string = "regex";

	constructor(params: { regex: string })
	{
		this._params = params
		this.regex = new RegExp(params.regex ?? "/^$/");
	}
}