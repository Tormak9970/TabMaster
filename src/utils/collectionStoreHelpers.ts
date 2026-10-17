import { SteamAppOverview } from '@types'

/**
 * Renames the collection associated with a tab
 * @param oldName The old tab name.
 * @param newName The new tab name.
 */
export const updateTabCollectionName = async (oldName: string, newName: string) => {
    const oldCollectionName = `${oldName} (TabMaster)`
    const newCollectionName = `${newName} (TabMaster)`
    let tabCollection = collectionStore.GetUserCollectionsByName(oldCollectionName)?.[0]

    if (!tabCollection) {
        return
    }

    tabCollection.displayName = newCollectionName
    await tabCollection.Save()

    return
}

/**
 * Updates the collection tied to the provided tab.
 * @param oldTabName The old tab name.
 * @param tabName The name of the tab this collection is tied to.
 * @param appids The appids the collection should have
 */
export const updateTabCollection = async (
    oldTabName: string,
    tabName: string,
    appOverviews: SteamAppOverview[] | null
) => {
    const oldCollectionName = `${oldTabName} (TabMaster)`
    const collectionName = `${tabName} (TabMaster)`
    let tabCollection = collectionStore.GetUserCollectionsByName(oldCollectionName)?.[0]

    if (!appOverviews) {
        if (tabCollection) {
            await tabCollection.Delete()
        }

        return
    }

    if (tabCollection && oldTabName !== tabName) {
        tabCollection.displayName = collectionName
    }

    if (!tabCollection) {
        tabCollection = collectionStore.NewUnsavedCollection(collectionName, undefined, appOverviews)
        await tabCollection.Save()

        return
    }

    const collectionApps = tabCollection.apps
    const collectionAppids = collectionApps.values().toArray()
    const appsList = appOverviews.map(overview => overview.appid)

    const appsToRemove = collectionAppids.filter(app => !appsList.includes(app.appid))
    if (appsToRemove.length > 0) {
        tabCollection.RemoveApps(appsToRemove)
    }

    const appsToAdd = appOverviews.filter(app => !collectionApps.has(app.appid))
    if (appsToAdd.length > 0) {
        tabCollection.AddApps(appsToAdd)
    }

    await tabCollection.Save()

    return
}
