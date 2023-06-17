export interface LibraryTab {
	title: string,
	filters: Filter<any>[],
}

export interface Filter<params> {
	type: string,
	params: params,
	filter: (app: SteamAppOverview) => boolean
}

export interface LibraryTabElement {
	custom: boolean,
	id: string,
	title: string,
	position: number,
	filters: FilterElement<any>[]
}

export interface FilterElement<params> {
	type: string,
	params: params
}