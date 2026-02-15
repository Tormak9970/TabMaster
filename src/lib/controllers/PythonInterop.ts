import { getCompactTimestamp, validateTabStructure } from '../Utils'
import { TabProfileDictionary } from '../../state/TabProfileManager'
import { USER_BACKUP_NAME } from '../../constants'
import { call, FileSelectionType, openFilePicker, toaster } from '@decky/api'

/**
 * Class for frontend -> backend communication.
 */
export class PythonInterop {
    static isDismounted = false

    static dismount() {
        PythonInterop.isDismounted = true
    }

    /**
     * Gets the user's desktop path.
     * @returns The path.
     */
    static async getUserDesktopPath(): Promise<string | Error> {
        try {
            return await call<[], string>('get_user_desktop')
        } catch (e: any) {
            return e
        }
    }

    /**
     * Gets a folder chosen by the user.
     * @returns The choosen folder.
     */
    static async openFolder(): Promise<string | Error> {
        const startPath = await this.getUserDesktopPath()

        if (startPath instanceof Error) {
            return startPath
        }

        const res = await openFilePicker(
            FileSelectionType.FOLDER,
            startPath,
            false,
            true,
            undefined,
            undefined,
            false,
            false
        )

        return res.realpath
    }

    /**
     * Backs up the plugin's settings to prevent them from being corrupted.
     * @param destPath The path to copy the settings to.
     */
    static async backupSettings(destPath: string): Promise<boolean | Error> {
        try {
            return await call<[dest_path: string], boolean>(
                'backup_settings',
                `${destPath}/${USER_BACKUP_NAME}_${getCompactTimestamp()}.json`
            )
        } catch (e: any) {
            return e
        }
    }

    /**
     * Gets a file chosen by the user.
     * @returns The choosen file.
     */
    static async openJSONFile(): Promise<string | Error> {
        const startPath = await this.getUserDesktopPath()

        if (startPath instanceof Error) {
            return startPath
        }

        const res = await openFilePicker(
            FileSelectionType.FILE,
            startPath,
            true,
            true,
            undefined,
            ['json'],
            false,
            false
        )

        return res.realpath
    }

    /**
     * Restores the plugin's settings from a previous backup.
     * @param srcPath The path to the settings to restore.
     */
    static async restoreSettings(srcPath: string): Promise<boolean | Error> {
        try {
            return await call<[src_path: string], boolean>('restore_settings', srcPath)
        } catch (e: any) {
            return e
        }
    }

    /**
     * Backs up the plugin's settings to default settings dir.
     * @param name The name to give the file.
     */
    static async backupDefaultDir(name: string): Promise<boolean | Error> {
        try {
            return await call<[name: string], boolean>('backup_default_dir', `${name}_${getCompactTimestamp()}`)
        } catch (e: any) {
            return e
        }
    }

    /**
     * Logs a message to the plugin's log file and the frontend console.
     * @param message The message to log.
     */
    static async log(message: String): Promise<void> {
        await call<[message: string, level: number], boolean>('log_message', `[front-end]: ${message}`, 0)
    }

    /**
     * Logs a warning to the plugin's log file and the frontend console.
     * @param message The message to log.
     */
    static async warn(message: string): Promise<void> {
        await call<[message: string, level: number], boolean>('log_message', `[front-end]: ${message}`, 1)
    }

    /**
     * Logs an error to the plugin's log file and the frontend console.
     * @param message The message to log.
     */
    static async error(message: string): Promise<void> {
        await call<[message: string, level: number], boolean>('log_message', `[front-end]: ${message}`, 2)
    }

    /**
     * Gets the plugin's users dictionary.
     * @returns A promise resolving to the plugin's users dictionary.
     */
    static async getUsersDict(): Promise<UsersDict | Error> {
        try {
            return await call<[], UsersDict>('get_users_dict')
        } catch (e: any) {
            return e
        }
    }

    /**
     * Sends the active user's steamID to the backend.
     * @returns A promise resolving to the plugin's users dictionary.
     */
    static async setActiveSteamId(userId: string): Promise<boolean | Error> {
        try {
            return await call<[user_id: string], boolean>('set_active_user_id', userId)
        } catch (e: any) {
            return e
        }
    }

    /**
     * Removes any legacy settings fields that may be present in the settings file.
     */
    static async removeLegacySettings(): Promise<void | Error> {
        try {
            return await call<[], void>('remove_legacy_settings')
        } catch (e: any) {
            return e
        }
    }

    /**
     * Migrates a legacy user to use the new settings system.
     */
    static async migrateLegacySettings(): Promise<void | Error> {
        try {
            return await call<[], void>('migrate_legacy_settings')
        } catch (e: any) {
            return e
        }
    }

    /**
     * Gets the plugin's tabs.
     * @returns A promise resolving to the plugin's tabs or null when the tab structure fails validation
     */
    static async getTabs(): Promise<TabSettingsDictionary | Error | null> {
        try {
            const result = await call<[], TabSettingsDictionary>('get_tabs')

            if (!validateTabStructure(result)) return null

            return result
        } catch (e: any) {
            return e
        }
    }

    /**
     * Gets the shared tabs.
     * @returns A promise resolving to the shared tabs or null when the tab structure fails validation
     */
    static async getSharedTabs(): Promise<Record<string, TabSettingsDictionary> | Error | null> {
        try {
            const result = await call<[], Record<string, TabSettingsDictionary>>('get_shared_tabs')

            if (Object.values(result).some(tabs => !validateTabStructure(tabs))) return null

            return result
        } catch (e: any) {
            return e
        }
    }

    /**
     * Gets the store tags.
     * @returns A promise resolving to the store tags.
     */
    static async getTags(): Promise<TagResponse[] | Error> {
        try {
            return await call<[], TagResponse[]>('get_tags')
        } catch (e: any) {
            return e
        }
    }

    /**
     * Gets the cached user friends.
     * @returns A promise resolving to the cached user friends.
     */
    static async getFriends(): Promise<FriendEntry[] | Error> {
        try {
            return await call<[], FriendEntry[]>('get_friends')
        } catch (e: any) {
            return e
        }
    }

    /**
     * Gets the cached friends games.
     * @returns A promise resolving to the cached friends games.
     */
    static async getFriendsGames(): Promise<Map<number, number[]> | Error> {
        try {
            const results = await call<[], { [id: string]: number[] }>('get_friends_games')

            const adjustedGames: [number, number[]][] = Object.entries(results).map(([id, ownedGames]) => {
                return [parseInt(id), ownedGames]
            })

            return new Map<number, number[]>(adjustedGames)
        } catch (e: any) {
            return e
        }
    }

    /**
     * Gets the user's tab profiles.
     * @returns A promise resolving the user's tab profiles.
     */
    static async getTabProfiles(): Promise<TabProfileDictionary | Error> {
        try {
            return await call<[], TabProfileDictionary>('get_tab_profiles')
        } catch (e: any) {
            return e
        }
    }

    /**
     * Sets the plugin's tabs.
     * @param tabs The plugin's tabsDictionary.
     * @returns A promise resolving to whether or not the tabs were successfully set.
     */
    static async setTabs(tabs: TabSettingsDictionary): Promise<void | Error> {
        //* Verify the config
        if (!validateTabStructure(tabs)) {
            PythonInterop.error(`Tabs were corrupted when trying to set.`)
            PythonInterop.toast('Error', 'Config corrupted, please restart.')
            return
        }

        try {
            return await call<[tabs: TabSettingsDictionary], void>('set_tabs', tabs)
        } catch (e: any) {
            return e
        }
    }

    /**
     * Sets the store tags.
     * @param tags The store tags.
     * @returns A promise resolving to whether or not the tags were successfully set.
     */
    static async setTags(tags: TagResponse[]): Promise<void | Error> {
        try {
            return await call<[tags: TagResponse[]], void>('set_tags', tags)
        } catch (e: any) {
            return e
        }
    }

    /**
     * Sets the user's friends.
     * @param friends The user's friends.
     * @returns A promise resolving to whether or not the friends were successfully set.
     */
    static async setFriends(friends: FriendEntry[]): Promise<void | Error> {
        try {
            return await call<[friends: FriendEntry[]], void>('set_friends', friends)
        } catch (e: any) {
            return e
        }
    }

    /**
     * Sets the user's friends' games.
     * @param friendsGames The user's friend's games.
     * @returns A promise resolving to whether or not the friends' games were successfully set.
     */
    static async setFriendGames(friendsGames: Map<number, number[]>): Promise<void | Error> {
        const serializedGames = Object.fromEntries(
            Array.from(friendsGames.entries()).map(([id, gamesOwned]) => {
                return [id.toString(), gamesOwned]
            })
        )

        try {
            return await call<[friends_games: { [id: string]: number[] }], void>('set_friends_games', serializedGames)
        } catch (e: any) {
            return e
        }
    }

    /**
     * Sets the user's tab profiles.
     * @param tabProfiles The tab profiles.
     * @returns A promise resolving to whether or not the tab profiles were successfully set.
     */
    static async setTabProfiles(tabProfiles: TabProfileDictionary): Promise<void | Error> {
        try {
            return await call<[tab_profiles: TabProfileDictionary], void>('set_tab_profiles', tabProfiles)
        } catch (e: any) {
            return e
        }
    }

    /**
     * Shows a toast message.
     * @param title The title of the toast.
     * @param message The message of the toast.
     */
    static toast(title: string, message: string): void {
        setTimeout(() => {
            if (PythonInterop.isDismounted) return
            try {
                toaster.toast({
                    title: title,
                    body: message,
                    duration: 8000,
                })
            } catch (e) {
                console.log('Toaster Error', e)
            }
        }, 200)
    }
}
