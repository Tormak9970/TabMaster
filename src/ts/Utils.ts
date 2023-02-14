import {AppDetails, sleep} from "decky-frontend-lib";

export class SteamUtils
{
	static async getAppDetails(appId: number): Promise<AppDetails | null>
	{
		return new Promise((resolve) =>
		{
			const {unregister} = SteamClient.Apps.RegisterForAppDetails(appId, (details: any) =>
			{
				unregister();
				resolve(details.unAppID ?? null);
			});
		});
	}

	static async waitForAppDetails(appId: number, predicate: (details: AppDetails | null) => boolean)
	{
		let retries = 4;
		while (retries--)
		{
			if (predicate(await this.getAppDetails(appId)))
			{
				return true;
			}
			if (retries > 0)
			{
				await sleep(250);
			}
		}

		return false;
	}


}