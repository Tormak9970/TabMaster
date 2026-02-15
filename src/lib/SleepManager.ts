import { findModuleExport } from '@decky/ui'

interface SleepManager {
    RegisterForNotifyResumeFromSuspend: (cb: () => void) => Unregisterer
}

export const sleepManager = findModuleExport(modExport => {
    if (modExport?.RegisterForNotifyResumeFromSuspend) return modExport
}) as SleepManager | undefined
