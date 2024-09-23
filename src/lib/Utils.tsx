import { sleep } from 'decky-frontend-lib';
import { FilterType, TabFilterSettings } from "../components/filters/Filters";
import { Fragment } from 'react';
import { FaSteam } from 'react-icons/fa6';
import { FaSdCard } from 'react-icons/fa';
import { CustomTabContainer } from '../components/CustomTabContainer';
import { GamepadUIAudio, SFXPath } from './GamepadUIAudio';

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
    id: "GreatOnDeck",
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
};

/**
 * Validates that the tabs adhere to the expected structure.
 * @param tabs The tabs to check.
 * @returns True if there were no issues.
 */
export function validateTabs(tabs: TabSettingsDictionary): boolean {
  return Object.values(tabs).every((tab: TabSettings) => {
    if (tab.filters) {
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

/**
 * Capitalizes the first letter of each word.
 * @param words A string of words.
 * @returns The capitalized string of words.
 */
export function capitalizeEachWord(words: string): string {
  return words.split(" ").map((word: string) => capitalizeFirstLetter(word)).join(" ");
}

/**
 * Gets the current user's steam id.
 * @param useU64 Whether or not the id should be a u64.
 * @returns The user's steam id.
 */
export function getCurrentUserId(useU64 = false): string {
  if (useU64) return window.App.m_CurrentUser.strSteamID;
  return BigInt.asUintN(32, BigInt(window.App.m_CurrentUser.strSteamID)).toString();
};

/**
 * Bit defines for inlcudeable categories
 */
export enum IncludeCategories {
  games = 1,
  software = 2,
  // tools = 4,   
  // videos = 2048,
  music = 8192,
  hidden = 16
};

/**
 * Gets an updated bit field of categories to include
 * @param bitField The current bit field of categories to include
 * @param categoriesToInclude Object of categories whose bits are to be set
 * @returns A bit field of categories to include with desired bits updated
 */
export function updateCategoriesToIncludeBitField(bitField: number, categoriesToInclude: { games?: boolean, software?: boolean, music?: boolean, hidden?: boolean }) {
  let onMask = 0;
  let offMask = 0;

  for(const key in categoriesToInclude) {
    const category = key as keyof typeof categoriesToInclude;

    if (categoriesToInclude[category]) {
      onMask |= IncludeCategories[category];
    } else {
      offMask |= IncludeCategories[category];
    }
  }

  return (bitField | onMask) & ~offMask;
}

/**
 * Gets on object containing flags of which categories are set based on bit field of categories
 * @param bitField The bit field of categories to include
 * @returns An object of categories to include
 */
export function getIncludedCategoriesFromBitField(bitField: number) {
  const includes = {
    games: false,
    music: false,
    software: false,
    // videos: false,
    // tools: false,
    hidden: false
  };

  for (const key of Object.keys(IncludeCategories).filter(key => isNaN(Number(key)))) {
    includes[key as keyof typeof IncludeCategories] = (IncludeCategories[key as keyof typeof IncludeCategories] & bitField) !== 0;
  }
  return includes;
}

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
}

/**
 * Recursive function that checks whether an array of TabFilterSettings contains any filters of a specified type.
 * @param filters The array of TabFilterSettings to check in.
 * @param filterTypes The filter types to check are included.
 * @returns Boolean
 */
export function filtersHaveType(filters: TabFilterSettings<FilterType>[], ...filterTypes: FilterType[] ) {
  if (filters.find(filter =>  filterTypes.includes(filter.type))) return true;
  for (const filter of filters) {
    if (filter.type === 'merge') {
      if (filtersHaveType((filter as TabFilterSettings<'merge'>).params.filters, ...filterTypes)) return true;
    }
  }
  return false;
}

/**
 * Gets the icon if any that's displayed anywhere tabs are listed.
 * @param tabContainer The tabContaine to get icon for.
 * @param microSDeckDisabled Whether or not microSDeck icon should be disabled.
 * @returns The icon element or a fragment.
 */
export function getTabIcon(tabContainer: TabContainer, microSDeckDisabled?: boolean) {
  return tabContainer.filters ? ((tabContainer as CustomTabContainer).dependsOnMicroSDeck ? <FaSdCard fill={microSDeckDisabled ? '#92939b61' : 'currentColor'} /> : <Fragment />) : <FaSteam />
}

/**
 * Plays audio url while respecting whether user has ui sounds enabled/ disabled
 *  @param path Audio url 
 */
export function playUISound(path: SFXPath) {
  if (settingsStore?.m_ClientSettings?.enable_ui_sounds) GamepadUIAudio.AudioPlaybackManager.PlayAudioURL(path);
}
