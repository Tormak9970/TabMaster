import { DropdownOption } from '@decky/ui'
import { ReviewScoreType, ThresholdCondition, TimeUnit } from '../components/filters/Filters'
import t from './i18n'
import { DateIncludes, DateObj, dateToLabel } from '../components/generic/DatePickers'

export function getLogicalMode(mode: LogicalMode): string {
    return mode === 'and' ? t('LOGIC_MODE_AND', 'and') : t('LOGIC_MODE_OR', 'or')
}

export function getAchievementOptions(): DropdownOption[] {
    return [
        { label: t('LABEL_COUNT', 'Count'), data: 'count' },
        { label: t('LABEL_PERCENT', 'Percent'), data: 'percent' },
    ]
}

export function getLeastMostThresholdOptions(): DropdownOption[] {
    return [
        { label: t('LABEL_AT_LEAST', 'At least'), data: 'above' },
        { label: t('LABEL_AT_MOST', 'At most'), data: 'below' },
    ]
}

export function getEarlyLateThresholdOptions(): DropdownOption[] {
    return [
        { label: t('LABEL_EARLIEST', 'Earliest'), data: 'above' },
        { label: t('LABEL_LATEST', 'Latest'), data: 'below' },
    ]
}

export function getTimeframeOptions(): DropdownOption[] {
    return [
        { label: t('LABEL_BY_DAY', 'By Day'), data: DateIncludes.dayMonthYear },
        { label: t('LABEL_BY_MONTH', 'By Month'), data: DateIncludes.monthYear },
        { label: t('LABEL_BY_YEAR', 'By Year'), data: DateIncludes.yearOnly },
        { label: t('LABEL_BY_DAYS_AGO', 'By Days Ago'), data: 'byDaysAgo' },
    ]
}

export function getTimeOptions(): DropdownOption[] {
    return [
        { label: t('LABEL_MINUTES', 'Minutes'), data: 'minutes' },
        { label: t('LABEL_HOURS', 'Hours'), data: 'hours' },
        { label: t('LABEL_DAYS', 'Days'), data: 'days' },
    ]
}

export function getReviewScoreFilterLabel(
    scoreThreshold: number,
    condition: ThresholdCondition,
    type: ReviewScoreType
): string {
    let displayData: string = ''

    if (type === 'metacritic') {
        if (condition === 'above') {
            displayData = t('LABEL_REVIEW_FILTER_METACRITIC_SCORE_ABOVE', 'Metacritic of {scoreThreshold} or higher')
        } else {
            displayData = t('LABEL_REVIEW_FILTER_METACRITIC_SCORE_BELOW', 'Metacritic of {scoreThreshold} or lower')
        }
    } else {
        if (condition === 'above') {
            displayData = t(
                'LABEL_REVIEW_FILTER_NON_METACRITIC_SCORE_ABOVE',
                'At least {scoreThreshold}% positive Steam reviews'
            )
        } else {
            displayData = t(
                'LABEL_REVIEW_FILTER_NON_METACRITIC_SCORE_BELOW',
                'At most {scoreThreshold}% positive Steam reviews'
            )
        }
    }

    return displayData.replace('{scoreThreshold}', scoreThreshold.toString())
}

export function getTimePlayed(time: number, condition: ThresholdCondition, units: TimeUnit, playedFor = false): string {
    let conditionSegment = ''
    let timeUnitFormatted = ''
    let beginningSegment = ''

    if (units === 'days') {
        timeUnitFormatted = time === 1 ? t('LABEL_DAY_SINGULAR', 'day') : t('LABEL_DAY_PLURAL', 'days')
    } else if (units === 'hours') {
        timeUnitFormatted = time === 1 ? t('LABEL_HOUR_SINGULAR', 'hour') : t('LABEL_HOUR_Plural', 'hours')
    } else {
        timeUnitFormatted = time === 1 ? t('LABEL_MINUTE_SINGULAR', 'minute') : t('LABEL_MINUTE_Plural', 'minutes')
    }

    if (condition === 'above') {
        conditionSegment = t('LABEL_TIME_ABOVE', 'or more')
    } else {
        conditionSegment = t('LABEL_TIME_PLAYED_FILTER_BELOW', 'or less')
    }

    if (playedFor) {
        beginningSegment = t('LABEL_TIME_PLAYED_PLAYED_FOR_TIME', 'Played for {time}')
    } else {
        beginningSegment = t('LABEL_TIME_PLAYED_TIME', '{time}')
    }

    return `${beginningSegment.replace('{time}', time.toString())} ${timeUnitFormatted} ${conditionSegment}`
}

export function getDateFilterDisplayData(
    type: 'last played' | 'release date' | 'purchase date',
    date: DateObj | undefined,
    daysAgo: number | undefined,
    condition: ThresholdCondition,
    prefixWithName = false
) {
    let displayData: string
    let prefix = ''

    if (prefixWithName) {
        if (type === 'last played') {
            prefix = t('LABEL_LAST_PLAYED_PREFIX', 'Last played') + ' '
        } else if (type === 'release date') {
            prefix = t('LABEL_RELEASE_DATE_PREFIX', 'Released') + ' '
        } else {
            prefix = t('LABEL_PURCHASE_DATE_PREFIX', 'Purchased') + ' '
        }
    }

    if (date) {
        const { day, month, year } = date

        const dateLabel = prefix ? '...' : dateToLabel(year, month, day, { dateStyle: 'long' })

        if (!day) {
            if (condition === 'above') {
                displayData = t('LABEL_DATE_FILTER_OBJECTIVE_NO_DAY_ABOVE', 'On or after {dateLabel}')
            } else {
                displayData = t('LABEL_DATE_FILTER_OBJECTIVE_NO_DAY_BELOW', 'On or before {dateLabel}')
            }
        } else {
            if (condition === 'above') {
                displayData = t('LABEL_DATE_FILTER_OBJECTIVE_NO_DAY_ABOVE', 'In or after {dateLabel}')
            } else {
                displayData = t('LABEL_DATE_FILTER_OBJECTIVE_NO_DAY_BELOW', 'In or before {dateLabel}')
            }
        }

        return prefix + displayData.replace('{dateLabel}', dateLabel)
    }

    if (daysAgo === 1) {
        if (condition === 'above') {
            displayData = t('LABEL_DATE_FILTER_DAYS_AGO_SINGULAR_LATER', '{daysAgo} day ago or later')
        } else {
            displayData = t('LABEL_DATE_FILTER_DAYS_AGO_SINGULAR_EARLIER', '{daysAgo} day ago or earlier')
        }
    } else {
        if (condition === 'above') {
            displayData = t('LABEL_DATE_FILTER_DAYS_AGO_PLURAL_LATER', '{daysAgo} days ago or later')
        } else {
            displayData = t('LABEL_DATE_FILTER_DAYS_AGO_PLURAL_EARLIER', '{daysAgo} days ago or earlier')
        }
    }

    return prefix + displayData.replace('{daysAgo}', daysAgo!.toString())
}

export function getAchievementDisplayData(condition: ThresholdCondition) {
    let displayData: string = ''

    if (condition === 'above') {
        displayData = t('LABEL_ACHIEVEMENTS_FILTER_ABOVE', 'or more achievements completed')
    } else {
        displayData = t('LABEL_ACHIEVEMENTS_FILTER_BELOW', 'or less achievements completed')
    }

    return displayData
}

export function getSizeOnDiskDisplayData(gbThreshold: number, condition: ThresholdCondition) {
    let displayData: string = ''

    if (condition === 'above') {
        displayData = t('LABEL_SIZE_ON_DISK_FILTER_ABOVE', 'or more on disk')
    } else {
        displayData = t('LABEL_SIZE_ON_DISK_FILTER_BELOW', 'or less on disk')
    }

    return `${gbThreshold < 1 ? gbThreshold * 1000 : gbThreshold} ${gbThreshold < 1 ? 'MB' : 'GB'} ${displayData}`
}
