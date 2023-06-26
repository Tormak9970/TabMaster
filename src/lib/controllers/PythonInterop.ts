import { ServerAPI } from "decky-frontend-lib";

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
   * Gets the interop's serverAPI.
   */
  static get server(): ServerAPI { return this.serverAPI; }

  /**
   * Logs a message to the plugin's log file and the frontend console.
   * @param message The message to log.
   */
  static async log(message: String): Promise<void> {
    console.log(message);
    await this.serverAPI.callPluginMethod<{ message: string, level: number }, boolean>("logMessage", { message: `[front-end]: ${message}`, level: 2 });
  }

  /**
   * Logs a warning to the plugin's log file and the frontend console.
   * @param message The message to log.
   */
  static async warn(message: string): Promise<void> {
    console.warn(message);
    await this.serverAPI.callPluginMethod<{ message: string, level: number }, boolean>("logMessage", { message: `[front-end]: ${message}`, level: 1 });
  }

  /**
   * Logs an error to the plugin's log file and the frontend console.
   * @param message The message to log.
   */
  static async error(message: string): Promise<void> {
    console.error(message);
    await this.serverAPI.callPluginMethod<{ message: string, level: number }, boolean>("logMessage", { message: `[front-end]: ${message}`, level: 2 });
  }

  /**
   * Gets the plugin's tabs.
   * @returns The plugin's tabs.
   */
  static async getTabs(): Promise<TabSettingsDictionary | Error> {
    let result = await PythonInterop.serverAPI.callPluginMethod<{}, TabSettingsDictionary>("get_tabs", {});

    if (result.success) {
      // TODO: verify the tab data is good
  
      return result.result;
    } else {
      return new Error(result.result);
    }
  }

  /**
   * Gets the store tabs.
   * @returns The store tabs.
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
   * @returns The cached user friends.
   */
  static async getFriends(): Promise<FriendEntry[] | Error> {
    let result = await PythonInterop.serverAPI.callPluginMethod<{}, FriendEntry[]>("get_friends", []);

    if (result.success) {
      return result.result;
    } else {
      return new Error(result.result);
    }
  }
  
  /**
   * Gets the cached friends games.
   * @returns The cached friends games.
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
   * Sets the plugin's tabs.
   * @param tabs The plugin's tabsDictionary.
   * @returns A promise resolving to whether or not the tabs were successfully set.
   */
  static async setTabs(tabs: TabSettingsDictionary): Promise<void | Error> {
    // TODO: verify the tab data is good

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

    let result = await PythonInterop.serverAPI.callPluginMethod<{ friends_games: { [id: string ]: number[] }, }, void>("set_friends_games", { friends_games: serializedGames });

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
    return (() => {
      try {
        return this.serverAPI.toaster.toast({
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