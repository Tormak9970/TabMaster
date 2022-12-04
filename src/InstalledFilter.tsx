import {Filter} from "./LibraryTab";
import {SteamAppOverview} from "./SteamTypes";

export class InstalledFilter implements Filter<{ installed: boolean }>
{
	get params(): { installed: boolean }
	{
		return this._params;
	}

	private readonly _params: { installed: boolean };
	private readonly installed: boolean;

	filter(app: SteamAppOverview)
	{
		return this.installed ? app.installed : !app.installed;
	}

	type: string = "collection";

	constructor(params: { installed: boolean })
	{
		this._params = params

		this.installed = params.installed ?? false;
	}
}