import { findModuleChild } from 'decky-frontend-lib';

interface SleepManager {
  RegisterForNotifyResumeFromSuspend: (cb: () => void) => Unregisterer;
}

export const sleepManager = findModuleChild((mod) => {
    if (typeof mod !== 'object') return undefined
    for (const prop in mod) {
        if (mod[prop]?.RegisterForNotifyResumeFromSuspend) return mod[prop];
    }
}) as SleepManager | undefined;
