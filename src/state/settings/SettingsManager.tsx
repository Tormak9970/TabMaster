import { TagOverrideDict } from '@types'
import { PythonInterop } from '../../lib/controllers/PythonInterop'
import { LogController } from '../../lib/controllers/LogController'

/**
 * Class that handles TabMaster's Settings state.
 */
export class SettingsManager {
    private hasLoaded: boolean

    private userTagOverrides: TagOverrideDict = {}

    public eventBus = new EventTarget()

    /**
     * Creates a new SettingsManager.
     */
    constructor() {
        this.hasLoaded = false
    }

    async loadSettings() {
        const tagOverrideRes = await PythonInterop.getTagOverrides()

        if (tagOverrideRes instanceof Error) {
            LogController.raiseError(`Error loading tag overrides \n ${tagOverrideRes.message}`)
        } else {
            this.userTagOverrides = tagOverrideRes ?? {}
            this.eventBus.dispatchEvent(new Event('stateUpdate'))
        }

        this.hasLoaded = true
    }

    /**
     * Gets the user's tag overrides.
     * @returns The user's tag overrides.
     */
    getTagOverrides(): TagOverrideDict {
        return this.userTagOverrides
    }

    /**
     * Saves the user's tag override settings.
     * @param overrides The new tag overrides.
     */
    async setTagOverrides(overrides: TagOverrideDict) {
        const res = await PythonInterop.setTagOverrides(overrides)

        if (res instanceof Error) {
            LogController.raiseError(`Error saving tag overrides \n ${res.message}`)
        } else {
            this.userTagOverrides = overrides
            this.eventBus.dispatchEvent(new Event('stateUpdate'))
        }
    }
}
