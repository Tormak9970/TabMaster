import { waitForCondition } from "../Utils";
import { LogController } from "./LogController";

/**
 * Wrapper class for the SteamClient interface.
 */
export class SteamController {
  private hasLoggedIn = false;
  private hasLoggedOut = false;

  /**
   * Registers a hook for when the user's login state changes.
   * @param onLogin Function to run on login.
   * @param onLogout Function to run on logout.
   * @param once Whether the hook should run once.
   * @param waitForPasscode Whether the hook should only run once the passcode has been entered.
   * @returns A function to unregister the hook.
   */
  registerForAuthStateChange(onLogin: ((username?:string, loginState?: LoginState, loginResult?: LoginResult, unkInt?: number, loginPercent?: number) => Promise<void>) | null, onLogout: ((username?:string, loginState?: LoginState, loginResult?: LoginResult, unkInt?: number, loginPercent?: number) => Promise<void>) | null, once: boolean, waitForPasscode: boolean): Unregisterer {
    try {
      let isLoggedIn: boolean | null = null;
      const currentUsername = loginStore.m_strAccountName;
      return SteamClient.User.RegisterForLoginStateChange((username: string) => {
        if (username === "") {
          if (isLoggedIn !== false && (once ? !this.hasLoggedOut : true)) {
            if (onLogout) onLogout(currentUsername);
          }
          isLoggedIn = false;
        } else {
          if (isLoggedIn !== true && (once ? !this.hasLoggedIn : true)) {
            if (onLogin) {
              if (waitForPasscode && securitystore.IsLockScreenActive()) {
                waitForCondition(100, 250, () => !securitystore.IsLockScreenActive()).then(() => {
                  //* basically, wait up to 25 minutes for the user to enter their passcode, and at that point, if they have logged in, initialize regardless.
                  onLogin(username);
                })
              } else {
                onLogin(username);
              }
            }
          }
          isLoggedIn = true;
        }
      });
    } catch (error) {
      LogController.log(`error with AuthStateChange hook. [DEBUG INFO] error: ${error};`);
      // @ts-ignore
      return () => { };
    }
  }

  /**
   * Waits until the services are initialized.
   * @returns A promise resolving to true if services were initialized on any attempt, or false if all attemps failed.
   */
  async waitForServicesToInitialize(): Promise<boolean> {
    type WindowEx = Window & { App?: { WaitForServicesInitialized?: () => Promise<boolean> } };
    const servicesFound = await waitForCondition(20, 250, () => (window as WindowEx).App?.WaitForServicesInitialized != null && !!appAchievementProgressCache.m_achievementProgress);
  
    if (servicesFound) {
      LogController.log(`Services found.`);
    } else {
      LogController.log(`Couldn't find services.`);
    }
  
    return (await (window as WindowEx).App?.WaitForServicesInitialized?.().then((success: boolean) => {
      LogController.log(`Services initialized. Success: ${success}`);
      return success;
    })) ?? false;
  }

  /**
   * Register a function for when the Steamdeck resumes from sleep.
   * @param callback The callback to register.
   * @returns A function that unsubscribes the callback.
   */
  registerForOnResumeFromSuspend(callback: () => void): Unregisterer {
    return SteamClient.System.RegisterForOnResumeFromSuspend(callback);
  }

  /**
   * Gets the localized tags from a list of ids.
   * @param tags The list of tag ids.
   * @return A promise resolving to a list of localized tags.
   */
  async getLocalizedTags(tags: number[]): Promise<TagResponse[]> {
    return await SteamClient.Apps.GetStoreTagLocalization(tags);
  }
}
