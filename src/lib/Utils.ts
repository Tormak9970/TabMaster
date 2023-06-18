import { findModuleChild, sleep } from 'decky-frontend-lib';

/**
 * Waits for a condition to be true.
 * @param retries The number of times to retry the condition.
 * @param delay The time (in ms) between retries.
 * @param check The condition to check.
 * @returns A promise resolving to true if the check was true on any attempt, or false if it failed each time.
 */
export async function waitForCondition(retries: number, delay: number, check: () => (boolean | Promise<boolean>)): Promise<boolean> {
  const waitImpl = async (): Promise<boolean> => {
    try {
      let tries = retries + 1;
      while (tries-- !== 0) {
        if (await check()) {
          return true;
        }

        if (tries > 0) {
          await sleep(delay);
        }
      }
    } catch (error) {
      console.error(error);
    }

    return false;
  };

  return await waitImpl();
}

/**
 * The react History object.
 */
export const History = findModuleChild((m) => {
  if (typeof m !== "object") return undefined;
  for (let prop in m) {
    if (m[prop]?.m_history) return m[prop].m_history
  }
});

/**
 * Provides a debounced version of a function.
 * @param func The function to debounce.
 * @param wait How long before function gets run.
 * @param immediate Wether the function should run immediately.
 * @returns A debounced version of the function.
 */
export function debounce(func:Function, wait:number, immediate?:boolean) {
  let timeout:NodeJS.Timeout|null;
  return function (this:any) {
      const context = this, args = arguments;
      const later = function () {
          timeout = null;
          if (!immediate) func.apply(context, args);
      };
      const callNow = immediate && !timeout;
      clearTimeout(timeout as NodeJS.Timeout);
      timeout = setTimeout(later, wait);
      if (callNow) func.apply(context, args);
  };
};