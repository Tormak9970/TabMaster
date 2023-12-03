import { sleep } from 'decky-frontend-lib';
import { LogController } from './LogController';
import { MicroSDeck as MicroSDeckManager } from '@cebbinghaus/microsdeck';
import { EventType } from '@cebbinghaus/microsdeck/dist/backend';

enum MicroSDeckInstallState {
  'not installed',
  'ver too low',
  'ver too high',
  'good'
}

export class MicroSDeckInterop {
  private static ref: MicroSDeckManager | undefined;
  private static eventHandlers: { [eventType in EventType]?: () => void }

  static initEventHandlers(handlers: { [eventType in EventType]?: () => void }) {
    this.eventHandlers = {...handlers};
    this.getInstallState();
  }

  private static subscribeToEvents() {
    for (let event in this.eventHandlers) {
      if (event) window.MicroSDeck!.eventBus.addEventListener(event as EventType, this.eventHandlers[event as EventType]!);
    }
  }

  /**
   * Checks if MicroSDeck plugin is installed when loading
   */
  //* this is not complete, i have to change it
  static async waitForLoad() {
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

  static getInstallState(runChangeHandlerIfNewInstance?: boolean) {
    if (!window.MicroSDeck) {
      return MicroSDeckInstallState['not installed'];
    } else {
      //* window.MicroSDeck = undefined needs to be added back to plugin's onDismount
      

      //MicroSDeck has been reinstalled or reloaded
      if (window.MicroSDeck !== this.ref) {
        this.ref = window.MicroSDeck;
        if (runChangeHandlerIfNewInstance) this.eventHandlers.change?.();
        this.subscribeToEvents();
      } 
      //* check version

      return MicroSDeckInstallState['good'];
    }
  }

  static isInstallOk(runChangeHandlerIfNewInstance?: boolean) {
    return this.getInstallState(runChangeHandlerIfNewInstance) === MicroSDeckInstallState['good'];
  }

  static checkVersion() {

  }
}
