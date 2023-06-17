import { ServerAPI } from "decky-frontend-lib";
import { LibraryTabDictionary } from "../../state/TabMasterState";

/**
 * Class for frontend - backend communication.
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
  static async getTabs(): Promise<LibraryTabDictionary | Error> {
    let result = await PythonInterop.serverAPI.callPluginMethod<{}, LibraryTabDictionary>("get_tabs", {});

    if (result.success) {
      return result.result;
    } else {
      return new Error(result.result);
    }
  }

  /**
   * Sets the plugin's tabs.
   * @param tabs The plugin's tabsDictionary.
   * @returns A promise resolving to whether or not the tabs were successfully set.
   */
  static async setTabs(tabs: LibraryTabDictionary): Promise<void | Error> {
    let result = await PythonInterop.serverAPI.callPluginMethod<{ tabs: LibraryTabDictionary, }, void>("set_tabs", { tabs: tabs });

    if (result.success) {
      return result.result;
    } else {
      return new Error(result.result);
    };
  }

  /**
   * Gets the plugin's hidden tabs.
   * @returns A promise resolving to the plugin's hidden tabs.
   */
  static async getHiddenTabs(): Promise<string[] | Error> {
    let result = await PythonInterop.serverAPI.callPluginMethod<{}, string[]>("get_hidden_tabs", {});

    if (result.success) {
      return result.result;
    } else {
      return new Error(result.result);
    };
  }

  /**
   * Sets the plugin's hidden tabs.
   * @param tabs The plugin's hidden tabs.
   * @returns A promise resolving to whether or not the tabs were successfuly set.
   */
  static async setHiddenTabs(tabs: string[]) {
    let result = await PythonInterop.serverAPI.callPluginMethod<{ tabs: string[], }, void>("set_hidden_tabs", { tabs: tabs });

    if (result.success) {
      return result.result;
    } else {
      return new Error(result.result);
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