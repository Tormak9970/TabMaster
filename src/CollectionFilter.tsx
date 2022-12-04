import {Filter} from "./LibraryTab";
import {SteamAppOverview, SteamCollection} from "./SteamTypes";

export class CollectionFilter implements Filter<{ collection_name: string }>
{
	get params(): { collection_name: string }
	{
		return this._params;
	}

	private readonly _params: { collection_name: string };
	private readonly Collection: SteamCollection;

	filter(app: SteamAppOverview)
	{
		return (this.Collection.allApps.find(value => value.appid===app.appid)!==undefined && this.Collection.visibleApps.find(value => value.appid===app.appid)!==undefined)
	}

	type: string = "collection";

	constructor(params: { collection_name: string })
	{
		this._params = params
		if (this._params.collection_name)
		{
			const collections = collectionStore.GetUserCollectionsByName(this._params.collection_name)
			if (collections.length > 0)
			{
				this.Collection = collections[0]
			} else throw new Error("Collection does not exist")
		}
		else throw new Error("collection_name is undefined")
	}
}