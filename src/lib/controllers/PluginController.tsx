import { ConfirmModal, ServerAPI, showModal } from "decky-frontend-lib";
import { PythonInterop } from "./PythonInterop";
import { SteamController } from "./SteamController";
import { LogController } from "./LogController";
import { TabMasterManager } from "../../state/TabMasterManager";
import { getCurrentUserId } from "../Utils";
import { DestructiveModal } from '../../components/generic/DestructiveModal';

function showMigrationModal(okCallback: () => Promise<void>, cancelCallback: () => Promise<void>) {
  showModal(
    <ConfirmModal
      strOKButtonText={"Transfer"}
      onOK={okCallback}
      strCancelButtonText={"Discard"}
      onCancel={async () => {
        showDiscardConfirm(cancelCallback, async () => showMigrationModal(okCallback, cancelCallback));
      }}
      strTitle="TabMaster: Legacy Settings Found"
    >
      TabMaster now saves settings and tabs for each user of the device. Would you like to transfer this device's previous settings to your account?
    </ConfirmModal>
  );
}

function showDiscardConfirm(okCallback: () => Promise<void>, onCancel: () => Promise<void>) {
  showModal(
    <DestructiveModal
      strOKButtonText={"Confirm"}
      onOK={okCallback}
      strCancelButtonText={"Back"}
      onCancel={onCancel}
      strTitle="Are You Sure?"
    >
      Are you sure you want to discard the previous settings? This can't be undone.
    </DestructiveModal>
  )
}

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
  }

  /**
   * Sets the plugin to initialize once the user logs in.
   * @returns The unregister function for the login hook.
   */
  static initOnLogin(onMount: () => Promise<void>): Unregisterer {
    return this.steamController.registerForAuthStateChange(async (username) => {
      LogController.log(`User logged in. [DEBUG] username: ${username}.`);
      if (await this.steamController.waitForServicesToInitialize()) {
        await PluginController.init();
        onMount();
      } else {
        PythonInterop.toast("Error", "Failed to initialize, try restarting.");
      }
    }, async (username) => {
      LogController.log(`User logged out. [DEBUG] username: ${username}.`);
    }, true, true);
  }

  /**
   * Initializes the Plugin.
   */
  static async init(): Promise<void> {
    LogController.log("PluginController initialized.");
    
    // @ts-ignore
    return new Promise(async (resolve, reject) => {
      const hadLegacySettings = await PythonInterop.setActiveSteamId(getCurrentUserId());
      LogController.log(hadLegacySettings ? "Detected Legacy Settings." : "No Legacy Settings found.");

      if (hadLegacySettings) {
        showMigrationModal(async () => {
          LogController.log("Transfering Legacy Settings...");
          await PythonInterop.migrateLegacySettings();
          resolve();
        }, async () => {
          LogController.log("Removing Legacy Settings...");
          await PythonInterop.removeLegacySettings();
          resolve();
        });
      } else {
        resolve();
      }
    });
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
