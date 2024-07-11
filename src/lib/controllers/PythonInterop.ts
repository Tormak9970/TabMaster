import { validateTabs } from "../Utils";
import { TabProfileDictionary } from '../../state/TabProfileManager';
import { call, toaster } from "@decky/api";

/**
 * Class for frontend -> backend communication.
 */
export class PythonInterop {
  /**
   * Logs a message to the plugin's log file and the frontend console.
   * @param message The message to log.
   */
  static async log(message: String): Promise<void> {
    await call<[message: string, level: number], boolean>("logMessage", `[front-end]: ${message}`, 0);
  }

  /**
   * Logs a warning to the plugin's log file and the frontend console.
   * @param message The message to log.
   */
  static async warn(message: string): Promise<void> {
    await call<[message: string, level: number], boolean>("logMessage", `[front-end]: ${message}`, 1);
  }

  /**
   * Logs an error to the plugin's log file and the frontend console.
   * @param message The message to log.
   */
  static async error(message: string): Promise<void> {
    await call<[message: string, level: number], boolean>("logMessage", `[front-end]: ${message}`, 2);
  }
  
  /**
   * Gets the plugin's users dictionary.
   * @returns A promise resolving to the plugin's users dictionary.
   */
  static async getUsersDict(): Promise<UsersDict | Error> {
    try {
      return await call<[], UsersDict>("get_users_dict");
    } catch (e: any) {
      return e;
    }
  }
  
  /**
   * Sends the active user's steamID to the backend.
   * @returns A promise resolving to the plugin's users dictionary.
   */
  static async setActiveSteamId(userId: string): Promise<boolean | Error> {
    try {
      return await call<[ user_id: string ], boolean>("set_active_user_id", userId);
    } catch (e: any) {
      return e;
    }
  }

  /**
   * Removes any legacy settings fields that may be present in the settings file.
   */
  static async removeLegacySettings(): Promise<void | Error> {
    try {
      return await call<[], void>("remove_legacy_settings");
    } catch (e: any) {
      return e;
    }
  }

  /**
   * Migrates a legacy user to use the new settings system.
   */
  static async migrateLegacySettings(): Promise<void | Error> {
    try {
      return await call<[], void>("migrate_legacy_settings");
    } catch (e: any) {
      return e;
    }
  }

  /**
   * Gets the plugin's tabs.
   * @returns A promise resolving to the plugin's tabs.
   */
  static async getTabs(): Promise<TabSettingsDictionary | Error> {
    try {
      const results = await call<[], TabSettingsDictionary>("get_tabs");

      if (!validateTabs(results)) {
        PythonInterop.error(`Tabs were corrupted.`);
        PythonInterop.setTabs({});
        PythonInterop.toast("Error", "Config corrupted, please restart.");
        return {};
      }

      return results;
    } catch (e: any) {
      return e;
    }
  }

  /**
   * Gets the store tags.
   * @returns A promise resolving to the store tags.
   */
  static async getTags(): Promise<TagResponse[] | Error> {
    try {
      return await call<[], TagResponse[]>("get_tags");
    } catch (e: any) {
      return e;
    }
  }

  /**
   * Gets the cached user friends.
   * @returns A promise resolving to the cached user friends.
   */
  static async getFriends(): Promise<FriendEntry[] | Error> {
    try {
      return await call<[], FriendEntry[]>("get_friends");
    } catch (e: any) {
      return e;
    }
  }

  /**
   * Gets the cached friends games.
   * @returns A promise resolving to the cached friends games.
   */
  static async getFriendsGames(): Promise<Map<number, number[]> | Error> {
    try {
      const results = await call<[], { [id: string]: number[] }>("get_friends_games");

      const adjustedGames: [number, number[]][] = Object.entries(results).map(([id, ownedGames]) => {
        return [parseInt(id), ownedGames];
      });

      return new Map<number, number[]>(adjustedGames);
    } catch (e: any) {
      return e;
    }
  }

  /**
   * Gets the user's tab profiles.
   * @returns A promise resolving the user's tab profiles.
   */
  static async getTabProfiles(): Promise<TabProfileDictionary | Error> {
    try {
      return await call<[], TabProfileDictionary>("get_tab_profiles");
    } catch (e: any) {
      return e;
    }
  }

  /**
   * Sets the plugin's tabs.
   * @param tabs The plugin's tabsDictionary.
   * @returns A promise resolving to whether or not the tabs were successfully set.
   */
  static async setTabs(tabs: TabSettingsDictionary): Promise<void | Error> {
    // * Verify the config
    if (!validateTabs(tabs)) {
      PythonInterop.error(`Tabs were corrupted when trying to set.`);
      PythonInterop.toast("Error", "Config corrupted, please restart.");
      return;
    }

    try {
      return await call<[ tabs: TabSettingsDictionary ], void>("set_tabs", tabs);
    } catch (e: any) {
      return e;
    }
  }

  /**
   * Sets the store tags.
   * @param tags The store tags.
   * @returns A promise resolving to whether or not the tags were successfully set.
   */
  static async setTags(tags: TagResponse[]): Promise<void | Error> {
    try {
      return await call<[ tags: TagResponse[] ], void>("set_tags", tags);
    } catch (e: any) {
      return e;
    }
  }

  /**
   * Sets the user's friends.
   * @param friends The user's friends.
   * @returns A promise resolving to whether or not the friends were successfully set.
   */
  static async setFriends(friends: FriendEntry[]): Promise<void | Error> {
    try {
      return await call<[ friends: FriendEntry[] ], void>("set_friends", friends);
    } catch (e: any) {
      return e;
    }
  }

  /**
   * Sets the user's friends' games.
   * @param friendsGames The user's friend's games.
   * @returns A promise resolving to whether or not the friends' games were successfully set.
   */
  static async setFriendGames(friendsGames: Map<number, number[]>): Promise<void | Error> {
    const serializedGames = Object.fromEntries(Array.from(friendsGames.entries()).map(([id, gamesOwned]) => {
      return [id.toString(), gamesOwned];
    }));

    try {
      return await call<[ friends_games: { [id: string]: number[] } ], void>("set_friends_games", serializedGames);
    } catch (e: any) {
      return e;
    }
  }

  /**
   * Sets the user's tab profiles.
   * @param tabProfiles The tab profiles.
   * @returns A promise resolving to whether or not the tab profiles were successfully set.
   */
  static async setTabProfiles(tabProfiles: TabProfileDictionary): Promise<void | Error> {
    try {
      return await call<[ tab_profiles: TabProfileDictionary ], void>("set_tab_profiles", tabProfiles);
    } catch (e: any) {
      return e;
    }
  }

  /**
   * Shows a toast message.
   * @param title The title of the toast.
   * @param message The message of the toast.
   */
  static toast(title: string, message: string): void {
    return (() => {
      try {
        return toaster.toast({
          title: title,
          body: message,
          duration: 8000,
        });
      } catch (e) {
        console.log("Toaster Error", e);
      }
    })();
  }
}
