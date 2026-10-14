import { findModuleExport } from '@decky/ui'
import { Unregisterer } from '@types'

interface SleepManager {
    RegisterForNotifyResumeFromSuspend: (cb: () => void) => Unregisterer
}

export const sleepManager = findModuleExport(modExport => {
    if (modExport?.RegisterForNotifyResumeFromSuspend) return modExport
}) as SleepManager | undefined
