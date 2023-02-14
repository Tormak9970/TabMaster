import {ServerAPI} from "decky-frontend-lib";
import {LibraryTabDictionary} from "./TabMasterState";

export async function get_tabs(serverAPI: ServerAPI)
{
	return new Promise<LibraryTabDictionary>(async (resolve, reject) =>
	{
		let result = await serverAPI.callPluginMethod<{}, LibraryTabDictionary>("get_tabs", {});
		if (result.success)
		{
			resolve(result.result);
		}
		else reject(new Error(result.result));
	});
}

export async function set_tabs(serverAPI: ServerAPI, tabs: LibraryTabDictionary)
{
	return new Promise<void>(async (resolve, reject) =>
	{
		let result = await serverAPI.callPluginMethod<{
			tabs: LibraryTabDictionary,
		}, void>("set_tabs", {
			tabs
		});
		if (result.success)
		{
			resolve(result.result);
		}
		else reject(new Error(result.result));
	});
}

export async function get_hidden_tabs(serverAPI: ServerAPI)
{
	return new Promise<string[]>(async (resolve, reject) =>
	{
		let result = await serverAPI.callPluginMethod<{}, string[]>("get_hidden_tabs", {});
		if (result.success)
		{
			resolve(result.result);
		}
		else reject(new Error(result.result));
	});
}

export async function set_hidden_tabs(serverAPI: ServerAPI, tabs: string[])
{
	return new Promise<void>(async (resolve, reject) =>
	{
		let result = await serverAPI.callPluginMethod<{
			tabs: string[],
		}, void>("set_hidden_tabs", {
			tabs
		});
		if (result.success)
		{
			resolve(result.result);
		}
		else reject(new Error(result.result));
	});
}