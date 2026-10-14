import { Unregisterer } from './UtilityTypes'

export type System = {
    RegisterForOnResumeFromSuspend?: (callback: () => void) => Unregisterer
}
