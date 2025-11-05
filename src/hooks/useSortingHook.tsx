import { findModuleChild } from "@decky/ui"

export const useSortingHook = findModuleChild((mod) => {
    if (typeof mod !== 'object') return undefined
    for (const prop in mod) {
        if (mod[prop]?.toString && mod[prop].toString().includes('setItem("AppGridDisplaySettings"')) {
            return mod[prop]
        }
    }
}) as () => {
    eSortBy: number
    setSortBy: (e: any) => void
    showSortingContextMenu: (e: any) => void
}
