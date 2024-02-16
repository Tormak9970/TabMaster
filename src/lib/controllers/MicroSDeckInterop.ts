import { sleep } from 'decky-frontend-lib';
import { LogController } from './LogController';
import { MicroSDeck as MicroSDeckManager } from '@cebbinghaus/microsdeck';
import { EventType } from '@cebbinghaus/microsdeck/dist/backend';
import { version } from '@cebbinghaus/microsdeck/package.json';

export const microSDeckLibVersion = version;

export enum MicroSDeckInstallState {
  'not installed',
  'ver too low',
  'ver too high',
  'ver unknown',
  'good'
}

export class MicroSDeckInterop {
  private static ref: MicroSDeckManager | undefined;
  private static eventHandlers: { [eventType in EventType]?: () => void };
  static noticeHidden: boolean = false;

  /**
   * Initializes event handlers.
   * @param handlers Event handler callbacks.
   */
  static initEventHandlers(handlers: { [eventType in EventType]?: () => void }) {
    this.eventHandlers = {...handlers};
    this.getInstallState();
  }

  /**
   * Adds event listeners to MicroSDeck event bus using the stored handler callbacks.
   */
  private static subscribeToEvents() {
    for (let event in this.eventHandlers) {
      if (event) window.MicroSDeck!.eventBus.addEventListener(event as EventType, this.eventHandlers[event as EventType]!);
    }
  }

  /**
   * Waits some time for MicroSDeck plugin to load
   */
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

  /**
   * Gets install state of MicroSDeck
   * @param runChangeHandlerIfNewInstance Whether or not the change event handler should be run in the case a new instance in MicroSDeck is detected (only necessary in library patch).
   * @returns MicroSDeckInstallState
   */
  static getInstallState(runChangeHandlerIfNewInstance?: boolean) {
    if (!window.MicroSDeck) {
      return MicroSDeckInstallState['not installed'];
    } else {
      
      //MicroSDeck has been reinstalled or reloaded
      if (window.MicroSDeck !== this.ref) {
        this.ref = window.MicroSDeck;
        if (runChangeHandlerIfNewInstance) this.eventHandlers.change?.();
        this.subscribeToEvents();
      } 

      return this.checkVersion();
    }
  }

  /**
   * Gets whether or not MicroSDeck is installed and usable in TabMaster.
   * @param runChangeHandlerIfNewInstance Whether or not the change event handler should be run in the case a new instance in MicroSDeck is detected (only necessary in library patch).
   * @returns boolean
   */
  static isInstallOk(runChangeHandlerIfNewInstance?: boolean) {
    return this.getInstallState(runChangeHandlerIfNewInstance) === MicroSDeckInstallState['good'];
  }

  /**
   * Compares version of lib TabMaster is using against installed plugin version.
   * @returns MicroSDeckInstallState
   */
  private static checkVersion() {
    if (window.MicroSDeck?.Version) {
      const [pluginVerMajor, pluginVerMinor, pluginVerPatch] = window.MicroSDeck!.Version.split(/[.+-]/, 3).map(str => +str);
      const [libVerMajor, libVerMinor, libVerPatch] = microSDeckLibVersion.split(/[.+-]/, 3).map(str => +str);

      if (isNaN(pluginVerMajor) || isNaN(pluginVerMinor) || isNaN(pluginVerPatch) || isNaN(libVerMajor) || isNaN(libVerMinor) || isNaN(libVerPatch)) return MicroSDeckInstallState['ver unknown'];
      if (pluginVerMajor === 0 && libVerMajor === 0) {
        if (pluginVerMinor > libVerMinor) return MicroSDeckInstallState['ver too high'];
        if (pluginVerMinor < libVerMinor) return MicroSDeckInstallState['ver too low'];
        return MicroSDeckInstallState['good'];
      }
      
      if (pluginVerMajor > libVerMajor) return MicroSDeckInstallState['ver too high'];
      if (pluginVerMajor < libVerMajor) return MicroSDeckInstallState['ver too low'];
      return MicroSDeckInstallState['good'];
    } else {
      return MicroSDeckInstallState['ver too low']; //* version is so old it doesn't have the Version prop.
    }
  }
}
