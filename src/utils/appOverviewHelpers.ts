import { SteamAppOverview } from '../types/steam-client'

/**
 * Gets all Steam App Overviews for the provided types.
 * @param types The app types to get.
 * @returns The Steam App Overviews.
 */
export const getAllOverviewsFromTypes = (types: ('games' | 'music' | 'software')[]) => {
    let appsList: SteamAppOverview[] = []

    for (const type of types) {
        appsList = appsList.concat(
            collectionStore.appTypeCollectionMap.get(`type-${type as 'games' | 'music' | 'software'}`)!.allApps
        )
    }

    return appsList
}
