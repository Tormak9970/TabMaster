import { FileSelectionType, ServerAPI } from "decky-frontend-lib";
import { getCompactTimestamp, validateTabStructure } from "../Utils";
import { TabProfileDictionary } from '../../state/TabProfileManager';
import { PluginController } from './PluginController';
import { USER_BACKUP_NAME } from '../../constants';

/**
 * Class for frontend -> backend communication.
 */
export class PythonInterop {
  private static serverAPI: ServerAPI;

  /**
   * Sets the interop's severAPI.
   * @param serv The ServerAPI for the interop to use.
   */
  static setServer(serv: ServerAPI): void {
    this.serverAPI = serv;
  }

  /**
   * Gets the user's desktop path.
   * @returns The path.
   */
  static async getUserDesktopPath(): Promise<string | Error> {
    const result = await this.serverAPI.callPluginMethod<{}, string>("get_user_desktop", {});

    if (result.success) {
      return result.result;
    } else {
      return new Error(result.result);
    }
  }

  /**
   * Gets a folder chosen by the user.
   * @returns The choosen folder.
   */
  static async openFolder(): Promise<string | Error> {
    const startPath = await this.getUserDesktopPath();

    if (startPath instanceof Error) {
      return startPath;
    }

    const res = await this.serverAPI.openFilePickerV2(
      FileSelectionType.FOLDER,
      startPath,
      false,
      true,
      undefined,
      undefined,
      false,
      false,
    );

    return res.realpath;
  }

  /**
   * Gets the interop's serverAPI.
   */
  static get server(): ServerAPI { return this.serverAPI; }

  /**
   * Logs a message to the plugin's log file and the frontend console.
   * @param message The message to log.
   */
  static async log(message: string): Promise<void> {
    await this.serverAPI.callPluginMethod<{ message: string, level: number }, boolean>("log_message", { message: `[front-end]: ${message}`, level: 0 });
  }
  
  /**
   * Backs up the plugin's settings to prevent them from being corrupted.
   * @param destPath The path to copy the settings to.
   */
  static async backupSettings(destPath: string): Promise<boolean | Error> {
    const result = await this.serverAPI.callPluginMethod<{ dest_path: string }, boolean>("backup_settings", { dest_path: `${destPath}/${USER_BACKUP_NAME}_${getCompactTimestamp()}.json` });
    if (result.success) {
      return result.result;
    } else {
      return new Error(result.result);
    }
  }

    /**
   * Backs up the plugin's settings to default settings dir.
   * @param name The name to give the file.
   */
  static async backupDefaultDir(name: string): Promise<boolean | Error> {
    const result = await this.serverAPI.callPluginMethod<{}, boolean>("backup_default_dir", { name: `${name}_${getCompactTimestamp()}` });
    if (result.success) {
      return result.result;
    } else {
      return new Error(result.result);
    }
  }


  /**
   * Logs a warning to the plugin's log file and the frontend console.
   * @param message The message to log.
   */
  static async warn(message: string): Promise<void> {
    await this.serverAPI.callPluginMethod<{ message: string, level: number }, boolean>("logMessage", { message: `[front-end]: ${message}`, level: 1 });
  }

  /**
   * Logs an error to the plugin's log file and the frontend console.
   * @param message The message to log.
   */
  static async error(message: string): Promise<void> {
    await this.serverAPI.callPluginMethod<{ message: string, level: number }, boolean>("logMessage", { message: `[front-end]: ${message}`, level: 2 });
  }
  
  /**
   * Gets the plugin's users dictionary.
   * @returns A promise resolving to the plugin's users dictionary.
   */
  static async getUsersDict(): Promise<UsersDict | Error> {
    const result = await this.serverAPI.callPluginMethod<{}, UsersDict>("get_users_dict", {});

    if (result.success) {
      return result.result;
    } else {
      return new Error(result.result);
    }
  }
  
  /**
   * Sends the active user's steamID to the backend.
   * @returns A promise resolving to the plugin's users dictionary.
   */
  static async setActiveSteamId(userId: string): Promise<boolean | Error> {
    const result = await this.serverAPI.callPluginMethod<{ user_id: string }, boolean>("set_active_user_id", { user_id: userId});

    if (result.success) {
      return result.result;
    } else {
      return new Error(result.result);
    }
  }

  /**
   * Removes any legacy settings fields that may be present in the settings file.
   */
  static async removeLegacySettings(): Promise<void | Error> {
    const result = await this.serverAPI.callPluginMethod<{}, void>("remove_legacy_settings", {});

    if (result.success) {
      return result.result;
    } else {
      return new Error(result.result);
    }
  }

  /**
   * Migrates a legacy user to use the new settings system.
   */
  static async migrateLegacySettings(): Promise<void | Error> {
    const result = await this.serverAPI.callPluginMethod<{}, void>("migrate_legacy_settings", {});

    if (result.success) {
      return result.result;
    } else {
      return new Error(result.result);
    }
  }

  /**
   * Gets the plugin's tabs.
   * @returns A promise resolving to the plugin's tabs or null when the tab structure fails validation
   */
  static async getTabs(): Promise<TabSettingsDictionary | Error | null> {
    let result = await PythonInterop.serverAPI.callPluginMethod<{}, TabSettingsDictionary>("get_tabs", {});
    if (result.success) {
      if (!validateTabStructure(result.result))  return null;

      return result.result;
    } else {
      return new Error(result.result);
    }
  }

  /**
   * Gets the store tags.
   * @returns A promise resolving to the store tags.
   */
  static async getTags(): Promise<TagResponse[] | Error> {
    let result = await PythonInterop.serverAPI.callPluginMethod<{}, TagResponse[]>("get_tags", {});

    if (result.success) {
      return result.result;
    } else {
      return new Error(result.result);
    }
  }

  /**
   * Gets the cached user friends.
   * @returns A promise resolving to the cached user friends.
   */
  static async getFriends(): Promise<FriendEntry[] | Error> {
    let result = await PythonInterop.serverAPI.callPluginMethod<{}, FriendEntry[]>("get_friends", {});

    if (result.success) {
      return result.result;
    } else {
      return new Error(result.result);
    }
  }

  /**
   * Gets the cached friends games.
   * @returns A promise resolving to the cached friends games.
   */
  static async getFriendsGames(): Promise<Map<number, number[]> | Error> {
    let result = await PythonInterop.serverAPI.callPluginMethod<{}, { [id: string]: number[] }>("get_friends_games", {});

    if (result.success) {
      const adjustedGames: [number, number[]][] = Object.entries(result.result).map(([id, ownedGames]) => {
        return [parseInt(id), ownedGames];
      });

      return new Map<number, number[]>(adjustedGames);
    } else {
      return new Error(result.result);
    }
  }

  /**
   * Gets the user's tab profiles.
   * @returns A promise resolving the user's tab profiles.
   */
  static async getTabProfiles(): Promise<TabProfileDictionary | Error> {
    let result = await PythonInterop.serverAPI.callPluginMethod<{}, TabProfileDictionary>("get_tab_profiles", {});

    if (result.success) {
      return result.result;
    } else {
      return new Error(result.result);
    };
  }

  /**
   * Sets the plugin's tabs.
   * @param tabs The plugin's tabsDictionary.
   * @returns A promise resolving to whether or not the tabs were successfully set.
   */
  static async setTabs(tabs: TabSettingsDictionary): Promise<void | Error> {
    //* Verify the config
    if (!validateTabStructure(tabs)) {
      PythonInterop.error(`Tabs were corrupted when trying to set.`);
      PythonInterop.toast("Error", "Config corrupted, please restart.");
      return;
    }

    let result = await PythonInterop.serverAPI.callPluginMethod<{ tabs: TabSettingsDictionary, }, void>("set_tabs", { tabs: tabs });

    if (result.success) {
      return result.result;
    } else {
      return new Error(result.result);
    };
  }

  /**
   * Sets the store tags.
   * @param tabs The store tags.
   * @returns A promise resolving to whether or not the tags were successfully set.
   */
  static async setTags(tags: TagResponse[]): Promise<void | Error> {
    let result = await PythonInterop.serverAPI.callPluginMethod<{ tags: TagResponse[], }, void>("set_tags", { tags: tags });

    if (result.success) {
      return result.result;
    } else {
      return new Error(result.result);
    };
  }

  /**
   * Sets the user's friends.
   * @param tabs The user's friends.
   * @returns A promise resolving to whether or not the friends were successfully set.
   */
  static async setFriends(friends: FriendEntry[]): Promise<void | Error> {
    let result = await PythonInterop.serverAPI.callPluginMethod<{ friends: FriendEntry[], }, void>("set_friends", { friends: friends });

    if (result.success) {
      return result.result;
    } else {
      return new Error(result.result);
    };
  }

  /**
   * Sets the user's friends' games.
   * @param tabs The user's friend's games.
   * @returns A promise resolving to whether or not the friends' games were successfully set.
   */
  static async setFriendGames(friendsGames: Map<number, number[]>): Promise<void | Error> {
    const serializedGames = Object.fromEntries(Array.from(friendsGames.entries()).map(([id, gamesOwned]) => {
      return [id.toString(), gamesOwned];
    }));

    let result = await PythonInterop.serverAPI.callPluginMethod<{ friends_games: { [id: string]: number[] }, }, void>("set_friends_games", { friends_games: serializedGames });

    if (result.success) {
      return result.result;
    } else {
      return new Error(result.result);
    };
  }

  /**
   * Sets the user's tab profiles.
   * @param tabProfiles The tab profiles.
   * @returns A promise resolving to whether or not the tab profiles were successfully set.
   */
    static async setTabProfiles(tabProfiles: TabProfileDictionary): Promise<void | Error> {
      let result = await PythonInterop.serverAPI.callPluginMethod<{ tab_profiles: TabProfileDictionary }, void>("set_tab_profiles", { tab_profiles: tabProfiles });
  
      if (result.success) {
        return result.result;
      } else {
        return new Error(result.result);
      };
    }

  /**
   * Shows a toast message.
   * @param title The title of the toast.
   * @param message The message of the toast.
   */
  static toast(title: string, message: string): void {
    setTimeout(() => {
      if (PluginController.isDismounted) return;
      try {
        this.serverAPI.toaster.toast({
          title: title,
          body: message,
          duration: 8000,
        });
      } catch (e) {
        console.log("Toaster Error", e);
      }
    }, 200)
  }
}
