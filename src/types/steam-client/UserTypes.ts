// Types for SteamClient.User

import { Unregisterer } from './UtilityTypes'

export type User = {
    RegisterForCurrentUserChanges: (callback: (data: any) => void) => Unregisterer
    RegisterForLoginStateChange: (callback: (username: string) => void) => Unregisterer
    RegisterForPrepareForSystemSuspendProgress: (callback: (data: any) => void) => Unregisterer
    RegisterForShutdownStart: (callback: () => void) => Unregisterer
    RegisterForShutdownDone: (callback: () => void) => Unregisterer
    StartRestart: () => void
}
