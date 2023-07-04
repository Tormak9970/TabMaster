import { ServerAPI } from "decky-frontend-lib";
import { PythonInterop } from "./PythonInterop";
import { SteamController } from "./SteamController";
import { LogController } from "./LogController";
import { TabMasterManager } from "../../state/TabMasterManager";

/**
 * Main controller class for the plugin.
 */
export class PluginController {
  // @ts-ignore
  private static server: ServerAPI;
  private static tabMasterManager: TabMasterManager;

  private static steamController: SteamController;

  /**
   * Sets the plugin's serverAPI.
   * @param server The serverAPI to use.
   */
  static setup(server: ServerAPI, tabMasterManager: TabMasterManager): void {
    this.server = server;
    this.tabMasterManager = tabMasterManager;
    this.steamController = new SteamController();

    LogController.log("Test");
    LogController.warn("Test");
    LogController.error("Test");
  }

  /**
   * Sets the plugin to initialize once the user logs in.
   * @returns The unregister function for the login hook.
   */
  static initOnLogin(onMount: () => Promise<void>): Unregisterer {
    return this.steamController.registerForAuthStateChange(async (username) => {
      LogController.log(`User logged in. [DEBUG] username: ${username}.`);
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
   * Get the ids of all the users friends who own a game.
   * @param appid The id of the game.
   * @return The list of friends.
   */
  static getFriendsWhoOwn(appid: number): number[] {
    return this.tabMasterManager.getFriendsWhoOwn(appid);
  }

  /**
   * Function to run when the plugin dismounts.
   */
  static dismount(): void {
    this.tabMasterManager.disposeReactions();
    LogController.log("PluginController dismounted.");
  }
}
