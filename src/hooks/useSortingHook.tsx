import { findModuleExport } from '@decky/ui'

export const useSortingHook = findModuleExport(modExport => {
    if (modExport?.toString().includes('setItem("AppGridDisplaySettings"')) return modExport
}) as () => {
    eSortBy: number
    setSortBy: (e: any) => void
    showSortingContextMenu: (e: any) => void
}
