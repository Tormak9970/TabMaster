import { sleep } from 'decky-frontend-lib';
import { LogController } from './LogController';
import { MicroSDeck as MicroSDeckManager } from '@cebbinghaus/microsdeck';

enum MicroSDeckInstallState {
  'not installed',
  'ver too low',
  'ver too high',
  'good'
}

export class MicroSDeckInterop {
  public static ref: MicroSDeckManager | undefined;

  /**
   * Checks if MicroSDeck plugin is installed when loading
   */
  //* this is not complete, i have to change it
  static async waitForLoad() {
    //* add version match verification here
    LogController.log("Checking for installation of MicroSDeck...");
    //MicroSDeck is already loaded
    if (window.MicroSDeck) {
      LogController.log("MicroSDeck is installed");
      return true;
    } else {
      //MicroSDeck is in queue to be loaded, wait til it's removed (starts loading)
      while (!!DeckyPluginLoader.pluginReloadQueue.find(plugin => plugin.name === 'MicroSDeck')) {
        await sleep(200);
      }

      //MicroSDeck has either started loading or is not installed at all, wait a little longer to allow it to load.
      let tries = 0;
      while (!window.MicroSDeck) {
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
    if (!window.MicroSDeck) {
      this.ref = undefined;
    } else {
      //* window.MicroSDeck = undefined needs to be added back to plugin's onDismount or fire an event there
      

      //MicroSDeck has been reinstalled or reloaded
      if (window.MicroSDeck !== this.ref) {
        this.ref = window.MicroSDeck;

        //* resub to new event bus
      } 
      //* check version
    }
  }

  static getInstallState() {
    if (!window.MicroSDeck) {
      return MicroSDeckInstallState['not installed'];
    } else {
      //* window.MicroSDeck = undefined needs to be added back to plugin's onDismount or fire an event there
      

      //MicroSDeck has been reinstalled or reloaded
      if (window.MicroSDeck !== this.ref) {
        this.ref = window.MicroSDeck;

        //* resub to new event bus
      } 
      //* check version

      return MicroSDeckInstallState['good'];
    }
  }

  static isInstallOk() {
    return this.getInstallState() === MicroSDeckInstallState['good'];
  }

  static checkVersion() {

  }
}
