import {Filter} from "./LibraryTab";
import {SteamAppOverview, SteamCollection} from "./SteamTypes";

export class CollectionFilter implements Filter<{ collection: SteamCollection }>
{
	get params(): { collection: SteamCollection }
	{
		return this._params;
	}

	private readonly _params: { collection: SteamCollection };

	filter(app: SteamAppOverview)
	{
		return (this.params.collection?.allApps.find(value => value.appid===app.appid)!==undefined && this.params.collection?.visibleApps.find(value => value.appid===app.appid)!==undefined)
	}

	type: string = "collection";

	constructor(params: { collection: SteamCollection })
	{
		this._params = params
	}
}