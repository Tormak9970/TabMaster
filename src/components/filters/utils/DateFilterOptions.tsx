import { Field, Focusable, Dropdown } from '@decky/ui'
import { DateObj, DateIncludes, ThresholdCondition, FilterOptionsProps } from '@types'
import { getDateFilterDisplayData, getTimeframeOptions, getEarlyLateThresholdOptions } from '@utils'
import { useState, Fragment } from 'react'
import { DateSelection, DatePicker } from '../../generic/DatePickers'
import { EnhancedSelectorTransparencyMode, EnhancedSelectorFocusRingMode } from '../../generic/EnhancedSelector'
import { Slider } from '../../generic/Slider'

/**
 * The options for a date filter.
 */
export const DateFilterOptions = ({
    index,
    setContainingGroupFilters,
    filter,
    containingGroupFilters,
}: FilterOptionsProps<'last played' | 'release date' | 'purchase date'>) => {
    const dateFilterType = filter.type
    const [date, setDate] = useState<DateObj | undefined>(filter.params.date)
    const [dateIncludes, setDateIncludes] = useState<DateIncludes>(
        filter.params.date
            ? filter.params.date.day === undefined
                ? filter.params.date.month === undefined
                    ? DateIncludes.yearOnly
                    : DateIncludes.monthYear
                : DateIncludes.dayMonthYear
            : DateIncludes.dayMonthYear
    )
    const [thresholdType, setThresholdType] = useState<ThresholdCondition>(filter.params.condition)
    const [byDaysAgo, setByDaysAgo] = useState(filter.params.daysAgo !== undefined)
    const [byUnknown, setByUnknown] = useState(filter.params.isUnknown !== undefined)
    const [daysAgo, setDaysAgo] = useState<number>(filter.params.daysAgo ?? 30)

    function onDateChange(dateSelection: DateSelection) {
        const updatedFilter = { ...filter }
        updatedFilter.params.date = dateSelection.data
        const updatedFilters = [...containingGroupFilters]
        updatedFilters[index] = updatedFilter
        setContainingGroupFilters(updatedFilters)
        setDate(dateSelection.data)
    }

    function onThreshTypeChange({ data: threshType }: { data: ThresholdCondition }) {
        const updatedFilter = { ...filter }
        updatedFilter.params.condition = threshType
        const updatedFilters = [...containingGroupFilters]
        updatedFilters[index] = updatedFilter
        setContainingGroupFilters(updatedFilters)
        setThresholdType(threshType)
    }

    function onByDaysAgoChange(byDaysAgo: boolean) {
        const updatedFilter = { ...filter }

        if (byDaysAgo) {
            delete updatedFilter.params.date
            updatedFilter.params.daysAgo = daysAgo
        } else {
            delete updatedFilter.params.daysAgo
            updatedFilter.params.date = date
        }

        const updatedFilters = [...containingGroupFilters]
        updatedFilters[index] = updatedFilter

        setContainingGroupFilters(updatedFilters)
        setByDaysAgo(byDaysAgo)
    }

    function onByUnknownChange(byUnknown: boolean) {
        const updatedFilter = { ...filter }

        if (byUnknown) {
            delete updatedFilter.params.date
            updatedFilter.params.isUnknown = byUnknown
        } else {
            delete updatedFilter.params.isUnknown
            updatedFilter.params.date = date
        }

        const updatedFilters = [...containingGroupFilters]
        updatedFilters[index] = updatedFilter

        setContainingGroupFilters(updatedFilters)
        setByUnknown(byUnknown)
    }

    function onSliderChange(value: number) {
        const updatedFilter = { ...filter }
        updatedFilter.params.daysAgo = value
        const updatedFilters = [...containingGroupFilters]
        updatedFilters[index] = updatedFilter
        setContainingGroupFilters(updatedFilters)
        setDaysAgo(value)
    }

    return (
        <Field
            label={getDateFilterDisplayData(dateFilterType, date, daysAgo, byUnknown, thresholdType)}
            description={
                <Focusable style={{ display: 'flex', flexDirection: 'row' }}>
                    {byUnknown ? (
                        <></>
                    ) : byDaysAgo ? (
                        <Slider value={daysAgo} min={0} max={3000} onChange={onSliderChange} />
                    ) : (
                        <DatePicker
                            focusDropdowns={true}
                            modalType='simple'
                            buttonContainerStyle={{ flex: 1 }}
                            onChange={onDateChange}
                            dateIncludes={dateIncludes}
                            selectedDate={date}
                            toLocaleStringOptions={{ dateStyle: 'long' }}
                            animate={true}
                            transparencyMode={EnhancedSelectorTransparencyMode.selection}
                            focusRingMode={EnhancedSelectorFocusRingMode.transparentOnly}
                        />
                    )}
                    <div
                        style={
                            byUnknown
                                ? {
                                      width: '100%',
                                  }
                                : { margin: '0 10px' }
                        }
                    >
                        <Dropdown
                            rgOptions={getTimeframeOptions()}
                            selectedOption={dateIncludes}
                            onChange={option => {
                                if (option.data === 'byUnknown') {
                                    if (byDaysAgo) onByDaysAgoChange(false)
                                    onByUnknownChange(true)
                                } else if (option.data === 'byDaysAgo') {
                                    if (byUnknown) onByUnknownChange(false)
                                    onByDaysAgoChange(true)
                                } else {
                                    if (byUnknown) onByUnknownChange(false)
                                    if (byDaysAgo) onByDaysAgoChange(false)
                                    setDateIncludes(option.data)
                                }
                            }}
                        />
                    </div>
                    {!byUnknown && (
                        <div>
                            <Dropdown
                                rgOptions={getEarlyLateThresholdOptions()}
                                selectedOption={thresholdType}
                                onChange={onThreshTypeChange}
                            />
                        </div>
                    )}
                </Focusable>
            }
        />
    )
}
