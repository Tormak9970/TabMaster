import { findVar } from '@decky/ui'
import { Unregisterer } from '@types'

interface SleepManager {
    RegisterForNotifyResumeFromSuspend: (cb: () => void) => Unregisterer
}

export const sleepManager = findVar(modExport => {
    if (modExport?.RegisterForNotifyResumeFromSuspend) return modExport
}) as SleepManager | undefined
