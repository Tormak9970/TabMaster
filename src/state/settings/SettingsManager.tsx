import { TagOverrideDict } from '@types'
import { PythonInterop } from '../../lib/controllers/PythonInterop'
import { LogController } from '../../lib/controllers/LogController'

type TagOverrideReaction = (tagOverrides: TagOverrideDict) => void

/**
 * Class that handles TabMaster's Settings state.
 */
export class SettingsManager {
    private static userTagOverrides: TagOverrideDict = {}

    private static onTagOverrideChangeReaction: TagOverrideReaction = (_tagOverrides: TagOverrideDict) => {}

    public static eventBus = new EventTarget()

    static async loadSettings() {
        const tagOverrideRes = await PythonInterop.getTagOverrides()

        if (tagOverrideRes instanceof Error) {
            LogController.raiseError(`Error loading tag overrides \n ${tagOverrideRes.message}`)
        } else {
            SettingsManager.userTagOverrides = tagOverrideRes ?? {}
            SettingsManager.eventBus.dispatchEvent(new Event('stateUpdate'))
        }
    }

    /**
     * Gets the user's tag overrides.
     * @returns The user's tag overrides.
     */
    static getTagOverrides(): TagOverrideDict {
        return SettingsManager.userTagOverrides
    }

    /**
     * Saves the user's tag override settings.
     * @param overrides The new tag overrides.
     */
    static async setTagOverrides(overrides: TagOverrideDict) {
        const res = await PythonInterop.setTagOverrides(overrides)

        if (res instanceof Error) {
            LogController.raiseError(`Error saving tag overrides \n ${res.message}`)
        } else {
            SettingsManager.userTagOverrides = overrides
            SettingsManager.onTagOverrideChangeReaction(overrides)
            SettingsManager.eventBus.dispatchEvent(new Event('stateUpdate'))
        }
    }

    /**
     * Set the reaction to call whenever the tagOverrides change
     * @param reaction The reaction to use.
     */
    static async setTagOverrideReaction(reaction: TagOverrideReaction) {
        this.onTagOverrideChangeReaction = reaction
    }
}
