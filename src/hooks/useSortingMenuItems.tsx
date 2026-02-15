import { useMemo } from 'react'

/**
 * Gets the localized version of a sorting method
 */
export function getESortByLabel(eSortBy: number) {
    const map: { [eSortBy: number]: string } = {
        1: '#Library_SortByAlphabetical',
        10: '#Library_SortByFriendsPlaying',
        2: '#Library_SortByPctAchievementsComplete',
        3: '#Library_SortByLastUpdated',
        4: '#Library_SortByHoursPlayed',
        5: '#Library_SortByLastPlayed',
        6: '#Library_SortByReleaseDate',
        7: '#Library_SortByAddedToLibrary',
        8: '#Library_SortBySizeOnDisk',
        9: '#Library_SortByMetacriticScore',
        11: '#Library_SortBySteamReview',
    }
    return LocalizationManager.LocalizeString(map[eSortBy])
}

/**
 * Creates the array of sorting SingleDropdownOptions
 */
function getSortingMenuItems() {
    return [1, 10, 2, 4, 5, 6, 7, 8, 9, 11].map(e => ({
        data: e,
        label: getESortByLabel(e)!,
    }))
}

/**
 * Hook to use memoized sort options
 * @param deps Dependency array to determine when to recalculate
 */
export const useSortingMenuItems = (deps: any[]) =>
    useMemo(() => [{ label: 'Default', data: -1 }].concat(getSortingMenuItems()), deps)
