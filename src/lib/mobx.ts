import { findModuleExport } from '@decky/ui'
import { LogController } from './controllers/LogController'

const mobxReactionFilter = (modExport: any) => {
    if (
        typeof modExport === 'function' &&
        modExport.length === 3 &&
        modExport.toString().includes('fireImmediately') &&
        modExport.toString().includes('requiresObservable')
    ) {
        return modExport
    }
}

const res = findModuleExport(mobxReactionFilter)
if (!res) LogController.raiseError('Could not find mobx.reaction')

export const reaction = (res || (() => {})) as typeof import('mobx').reaction
