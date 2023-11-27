import { sleep } from 'decky-frontend-lib';
import { LogController } from './LogController';
import { MicroSDeckManager } from '@cebbinghaus/microsdeck';

export class MicroSDeckInterop {
  public static state: 'not installed' | 'version too low' | 'version too high' | 'good' = 'not installed';
  public static ref: MicroSDeckManager | undefined;

  /**
   * Checks if MicroSDeck plugin is installed when loading
   */
  //* this is not complete, i have to change it
  static async checkInstallStateOnLoad() {
    //* add version match verification here
    LogController.log("Checking for installation of MicroSDeck...");
    //MicroSDeck is already loaded
    if (MicroSDeck) {
      LogController.log("MicroSDeck is installed");
      return true;
    } else {
      //MicroSDeck is in queue to be loaded, wait til it's removed (starts loading)
      while (!!DeckyPluginLoader.pluginReloadQueue.find(plugin => plugin.name === 'MicroSDeck')) {
        await sleep(200);
      }

      //MicroSDeck has either started loading or is not installed at all, wait a little longer to allow it to load.
      let tries = 0;
      while (!MicroSDeck) {
        tries++;
        if (tries > 10) {
          LogController.log("Could not find MicroSDeck installation");
          return false; // if MicroSDeck isn't found after number of attempts, give up
        }
        await sleep(100);
      }

      LogController.log("MicroSDeck is installed");
      return true;
    }
  }


  static checkInstallStateChanged() {
    if (!MicroSDeck) {
      this.ref = undefined;
      this.state = 'not installed';
    } else {
      //* window.MicroSDeck = undefined needs to be added back to plugin's onDismount or fire an event there
      

      //MicroSDeck has been reinstalled or reloaded
      if (MicroSDeck !== this.ref) {
        this.ref = MicroSDeck;

        //* resub to new event bus
      } 
      //* check version
    }
  }

  static checkVersion() {

  }
}
