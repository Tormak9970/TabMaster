import { ServerAPI } from "decky-frontend-lib";
import { PythonInterop } from "./PythonInterop";
import { SteamController } from "./SteamController";
import { LogController } from "./LogController";

/**
 * Main controller class for the plugin.
 */
export class PluginController {
  // @ts-ignore
  private static server: ServerAPI;

  private static steamController: SteamController;

  private static gameLifetimeRegister: Unregisterer;
  private static historyListener: () => void;

  /**
   * Sets the plugin's serverAPI.
   * @param server The serverAPI to use.
   */
  static setup(server: ServerAPI): void {
    this.server = server;
    this.steamController = new SteamController();
  }

  /**
   * Sets the plugin to initialize once the user logs in.
   * @returns The unregister function for the login hook.
   */
  static initOnLogin(onMount: () => Promise<void>): Unregisterer {
    return this.steamController.registerForAuthStateChange(async (username) => {
      PythonInterop.log(`User logged in. [DEBUG] username: ${username}.`);
      if (await this.steamController.waitForServicesToInitialize()) {
        PluginController.init();
        onMount();
      } else {
        PythonInterop.toast("Error", "Failed to initialize, try restarting.");
      }
    }, null, true);
  }

  /**
   * Initializes the Plugin.
   */
  static async init(): Promise<void> {
    LogController.log("PluginController initialized.");
  }

  /**
   * Gets the details for the provided app.
   * @param appid The id of the app to get the details of.
   * @returns A promise resolving to the app's details, or null if failed.
   */
  static async getAppDetails(appid: number): Promise<SteamAppDetails | null> {
    return await PluginController.steamController.getAppDetails(appid);
  }

  /**
   * Gets the localized tags from a list of ids.
   * @param tags The list of tag ids.
   * @return The list of localized tags.
   */
  static getGameTags(tags: number[]): TagResponse[] {
    // return await this.steamController.getLocalizedTags(tags);
    return tags.map((tag: number) => {
      return {
        tag: tag,
        string: appStore.m_mapStoreTagLocalization._data.get(tag)?.value
      }
    })
  }

  /**
   * Function to run when the plugin dismounts.
   */
  static dismount(): void {
    this.gameLifetimeRegister.unregister();
    this.historyListener();
    
    LogController.log("PluginController dismounted.");
  }
}