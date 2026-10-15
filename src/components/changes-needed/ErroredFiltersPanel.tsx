import { Fragment, useState } from 'react'
import { FilterErrorOptions } from './FilterErrorOptions'
import { trans_string as t } from '@utils'
import { FilterType, TabFilterSettings, FilterErrorEntry } from '@types'

type ErroredFiltersPanelProps = {
    filters: (TabFilterSettings<FilterType> | null)[]
    errorEntries: FilterErrorEntry[]
    onChange: (filters: (TabFilterSettings<FilterType> | null)[], messages: string[][]) => void
    isMergeGroup?: boolean
}

/**
 * Renders all errored filters.
 */
export const ErroredFiltersPanel = ({ filters, errorEntries, onChange, isMergeGroup }: ErroredFiltersPanelProps) => {
    const [errorMessages, setErrorMessages] = useState<string[][]>(
        errorEntries.map((entry: FilterErrorEntry) => entry.errors)
    )

    function handleFilterUpdate(
        filterListIdx: number,
        errorMessageIdx: number,
        filter: TabFilterSettings<FilterType> | null
    ) {
        const messages = [...errorMessages]
        messages[errorMessageIdx] = []
        setErrorMessages(messages)

        const newFilters = [...filters]
        newFilters[filterListIdx] = filter

        onChange(newFilters, messages)
    }

    return (
        <>
            {errorEntries.flatMap((erroredFilter: FilterErrorEntry, errorIdx: number) => {
                const filter = filters[erroredFilter.filterIdx]

                if (!filter) {
                    return <></>
                }

                return (
                    <div className='filter-error-entry'>
                        <div
                            style={{
                                color: '#8b929a',
                                fontWeight: '600',
                                marginTop: '10px',
                            }}
                        >
                            {t('TITLE_ERRORS', 'Errors')}
                        </div>
                        <div className='filter-error-messages'>
                            {errorMessages[errorIdx].map((errorMsg: string) => (
                                <div className='filter-error-msg'>{errorMsg}</div>
                            ))}
                        </div>
                        <div
                            style={{
                                color: '#8b929a',
                                fontWeight: '600',
                                marginTop: '10px',
                            }}
                        >
                            {t('TITLE_FILTER_TYPE', 'Filter Type')} - {filter.type}
                        </div>
                        <FilterErrorOptions
                            isMergeGroup={isMergeGroup}
                            numFilters={filters.flatMap(filter => filter).length}
                            filter={filter}
                            onFilterUpdate={filter => handleFilterUpdate(erroredFilter.filterIdx, errorIdx, filter)}
                            onFilterDelete={() => handleFilterUpdate(erroredFilter.filterIdx, errorIdx, null)}
                            mergeErrorEntries={errorEntries[errorIdx].mergeErrorEntries}
                        />
                    </div>
                )
            })}
        </>
    )
}
