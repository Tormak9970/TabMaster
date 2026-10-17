export type DateObj = { day?: number; month?: number; year: number }

/** Whether the date includes day/ month and year, month and year, or year only. */
export enum DateIncludes {
    yearOnly,
    monthYear,
    dayMonthYear,
}
