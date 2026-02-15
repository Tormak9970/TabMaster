import { findModuleExport } from '@decky/ui'

const AddCollectionModal = findModuleExport(modExport => {
    if (modExport?.toString().includes('"#GameAction_NewCollectionDialogTitle"')) return modExport
}) as (window: Window, apps: SteamAppOverview[], unkStr: string) => void

export const showAddCollectionModal = (apps: SteamAppOverview[]) => AddCollectionModal(window, apps, 'context-menu')
