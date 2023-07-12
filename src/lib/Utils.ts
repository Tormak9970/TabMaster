import { sleep } from 'decky-frontend-lib';
import { FilterType, TabFilterSettings } from "../components/filters/Filters";

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
 * Gets a steam user id from two parts.
 * @param low The low part of the bigint.
 * @param high The high part of the bigint.
 * @returns The user's id as a bigint.
 */
export function getSteamIdFromParts(low: number, high: number): bigint {
  return (BigInt(high) << 32n) | (BigInt(low));
}

/**
 * Gets a steam user id from two parts.
 * @param low The low part of the bigint.
 * @param high The high part of the bigint.
 * @returns The user's id as a number.
 */
export function getNonBigIntUserId(low: number, high: number): number {
  return Number(getSteamIdFromParts(low, high) - 76561197960265728n);
}


export const defaultTabsSettings: TabSettingsDictionary = {
  DeckGames: {
    id: "DeckGames",
    title: "Great On Deck",
    position: 0,
  },
  AllGames: {
    id: "AllGames",
    title: "All Games",
    position: 1,
  },
  Installed: {
    id: "Installed",
    title: "Installed",
    position: 2,
  },
  Favorites: {
    id: "Favorites",
    title: "Favorites",
    position: 3,
  },
  Collections: {
    id: "Collections",
    title: "Collections",
    position: 4,
  },
  DesktopApps: {
    id: "DesktopApps",
    title: "Non-Steam",
    position: 5,
  },
  Soundtracks: {
    id: "Soundtracks",
    title: "Soundtracks",
    position: 6,
  }
}

/**
 * Validates that the tabs adhere to the expected structure.
 * @param tabs The tabs to check.
 * @returns True if there were no issues.
 */
export function validateTabs(tabs: TabSettingsDictionary): boolean {
  return Object.values(tabs).every((tab: TabSettings) => {
    if (tab.filters) {
      if (!Object.keys(tab).includes("includesHidden")) tab.includesHidden = false;
      if (!Object.keys(tab).includes("filtersMode")) tab.filtersMode = "and";
      return tab.filters.every((filter: TabFilterSettings<FilterType>) => {
        return (filter as TabFilterSettings<FilterType>).type !== undefined;
      });
    } else {
      return Object.keys(defaultTabsSettings).includes(tab.id);
    }
  });
}

/**
 * Capitalizes the first letter of a word.
 * @param word The word to capitalize.
 * @returns The capitalized word.
 */
export function capitalizeFirstLetter(word: string): string {
  return word[0].toUpperCase().concat(word.substring(1));
}
