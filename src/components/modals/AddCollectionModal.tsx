import { findModuleChild } from "@decky/ui"

const AddCollectionModal = findModuleChild((mod) => {
    if (typeof mod !== 'object') return undefined
    for (const prop in mod) {
        if (mod[prop]?.toString && mod[prop].toString().includes('"#GameAction_NewCollectionDialogTitle"')) {
            return mod[prop]
        }
    }
}) as (window: Window, apps: SteamAppOverview[], unkStr: string) => void

export const showAddCollectionModal = (apps: SteamAppOverview[]) => AddCollectionModal(window, apps, "context-menu")
