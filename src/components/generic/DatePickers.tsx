import { ConfirmModal, Focusable, SingleDropdownOption, quickAccessMenuClasses } from '@decky/ui'
import { ReactElement, useMemo, useState, Fragment, useEffect } from 'react'
import { TbCalendarEvent } from 'react-icons/tb'
import { EnhancedSelector, EnhancedSelectorFocusRingMode, EnhancedSelectorTransparencyMode } from './EnhancedSelector'
import { SoundEffect } from '../../lib/GamepadUIAudio'
import { CustomDropdown } from './CustomDropdown'
import { trans_string as t, dateToLabel } from '@utils'
import { DateIncludes, DateObj } from '@types'

export type DatePickerModalType = 'simple' | 'pretty'

/** A SingleDropdownOption with specific date data */
export interface DateSelection extends SingleDropdownOption {
    data: DateObj
}

/** Props for DatePicker component */
export interface DatePickerProps extends Omit<SimpleDatePickerModalProps, 'onSelectDate' | 'closeModal'> {
    /** The date picker modal style. Either "simple" or "pretty" @default 'simple' */
    modalType?: DatePickerModalType

    /** Callback function to call when the date is changed */
    onChange?: (date: DateSelection) => void

    /** Custom icon to use for the popup button */
    buttonIcon?: ReactElement

    /** Whether or not the popup button icon should be removed @default false */
    noIcon?: boolean

    /** Whether or not the popup button text chould be centered @default false */
    buttonLabelCenter?: boolean

    /** CSS style for the popup button */
    buttonStyle?: React.CSSProperties

    /** CSS style for the popup button container */
    buttonContainerStyle?: React.CSSProperties

    /** Default text to display in the popup button when selectedDate is undefined or invalid @default 'Select Date...' */
    strDefaultLabel?: string
}

/** CSS class names for DatePicker component */
export enum DatePickerClasses {
    topLevel = 'date-picker',
}

interface ModalWrapperProps {
    onSelectOption: (option: SingleDropdownOption) => void
    selectedOption?: any
    rgOptions?: any
    closeModal?: () => void
}

/** A highly configurable button component that pops up a modal to select a date and displays the captured result.  */
export const DatePicker = ({
    modalType,
    selectedDate,
    buttonLabelCenter,
    buttonIcon,
    noIcon,
    buttonStyle,
    buttonContainerStyle,
    strDefaultLabel,
    toLocaleStringOptions,
    dateIncludes,
    onChange,
    ...modalProps
}: DatePickerProps) => {
    const DatePickerModal = modalType === 'pretty' ? PrettyDatePickerModal : SimpleDatePickerModal
    const include = dateIncludes ?? DateIncludes.dayMonthYear

    const [mounted, setMounted] = useState(false)
    useEffect(() => setMounted(true), [])

    const { day: incomingDay, month: incomingMonth, year: incomingYear } = selectedDate ?? {}

    const [day, setDay] = useState(include === DateIncludes.dayMonthYear ? (incomingDay ?? 1) : undefined)
    const [month, setMonth] = useState(include >= DateIncludes.monthYear ? (incomingMonth ?? 1) : undefined)
    const [year, setYear] = useState(incomingYear)

    const valid = isValidDate(day, month, year)

    useEffect(() => {
        if (mounted) {
            const { day, month, year } = selectedDate ?? {}
            const valid = selectedDate && isValidDate(day, month, year)
            if (valid) {
                setYear(year)
                setMonth(month)
                setDay(day)
            }
        }
    }, [incomingDay, incomingMonth, incomingYear])

    const _date: DateObj = { year: year! }
    if (month) _date.month = month
    if (day) _date.day = day

    const date = useMemo(() => (valid ? _date : undefined), [day, month, year, valid, include])

    const options = useMemo(
        () =>
            valid
                ? [
                      {
                          label: dateToLabel(year!, month, day, toLocaleStringOptions),
                          data: date!,
                      },
                  ]
                : undefined,
        [day, month, year, valid, include]
    )

    useEffect(() => {
        if (valid && mounted) {
            const newDate = { ...options![0].data }

            switch (include) {
                case DateIncludes.dayMonthYear:
                    if (!newDate.day) newDate.day = 1
                    if (!newDate.month) newDate.month = 1
                    break
                case DateIncludes.monthYear:
                    if (!newDate.month) newDate.month = 1
                    delete newDate.day
                    break
                case DateIncludes.yearOnly:
                    delete newDate.day
                    delete newDate.month
            }
            setYear(newDate.year)
            setMonth(newDate.month)
            setDay(newDate.day)
            onChange?.({
                label: dateToLabel(newDate.year!, newDate.month, newDate.day, toLocaleStringOptions),
                data: newDate,
            })
        }
    }, [include])

    return (
        <CustomDropdown
            onChange={onChange}
            selectedOption={date}
            rgOptions={options}
            strDefaultLabel={strDefaultLabel ?? t('LABEL_SELECT_DATE', 'Select Date...')}
            labelCenter={buttonLabelCenter}
            customDropdownIcon={buttonIcon ?? <TbCalendarEvent style={{ margin: 'auto' }} />}
            noDropdownIcon={noIcon ?? false}
            style={buttonStyle}
            containerStyle={buttonContainerStyle}
            containerClassName={DatePickerClasses.topLevel}
            useCustomModal={({ onSelectOption, selectedOption, closeModal }: ModalWrapperProps) => {
                return (
                    <DatePickerModal
                        onSelectDate={date => {
                            onSelectOption(date)
                            setYear(date.data.year)
                            setMonth(date.data.month)
                            setDay(date.data.day)
                        }}
                        selectedDate={selectedOption}
                        dateIncludes={include}
                        toLocaleStringOptions={toLocaleStringOptions}
                        closeModal={closeModal}
                        {...modalProps}
                    />
                )
            }}
        />
    )
}

/** Props for SimpleDatePickerModal component */
export interface SimpleDatePickerModalProps {
    /** Callback function to call when a date is selected */
    onSelectDate?: (date: DateSelection) => void

    /** The selected date */
    selectedDate?: DateObj

    /** The earliest year that will be available to select from. This get overridden if selectedDate year is earlier @default 1970 */
    startYear?: number

    /** The latest year that will be available to select from. This get overridden if selectedDate year is later. Default is current year. */
    endYear?: number

    /** The options for the date string format */
    toLocaleStringOptions?: Intl.DateTimeFormatOptions

    /** Whether the date includes day/ month and year, month and year, or year only. @default dayMonthYear*/
    dateIncludes?: DateIncludes

    /** Whether or not the day/ month/ year selector labels should be centered @default true */
    centerSelectorLabels?: boolean

    /** Whether the day/ month/ year selections should stop when at the end/ beginning of the list or cycle around @default false */
    noWrapAround?: boolean

    /** Whether or not the day/ month/ year selection boxes should be focusable @default true */
    focusDropdowns?: boolean

    /** Whether or not to show the dropdown arrow on the day/ month/ year selection boxes @default false */
    showDropdownIcons?: boolean

    /** Which elements of the day/ month/ year EnhancedSelectors should be transparent @default none */
    transparencyMode?: EnhancedSelectorTransparencyMode

    /** When to use focus ring instead of highlight when focusing an element @default never */
    focusRingMode?: EnhancedSelectorFocusRingMode

    /** Whether or not to use the alternate sound effects for the EnhancedSelectors @default false */
    alternateSFX?: boolean

    /** Sound effect override to use for the day/ month/ year EnhancedSelector buttons */
    sfxMain?: SoundEffect

    /** Sound effect override to use on day/ month/ year buttons for when at the end/ beginning of the list and noWrapAround is true */
    sfxInvalid?: SoundEffect

    /** Whether or not the day/ month/ year selection boxes should animate when shifting the selection @default true */
    animate?: boolean

    /** The duration in ms of the day/ month/ year selection box animations @default 300 */
    animationDuration?: number

    /** Function for closing the modal, typically automatically passed when showModal is called. */
    closeModal?: () => void
}

export enum DatePickerModalClasses {
    topLevel = 'date-picker-modal',
    title = 'date-picker-modal-title',
}

/** A visually simple date picker modal that is configurable */
export const SimpleDatePickerModal = ({
    onSelectDate,
    selectedDate,
    toLocaleStringOptions,
    focusDropdowns,
    showDropdownIcons,
    centerSelectorLabels,
    startYear,
    endYear,
    dateIncludes,
    closeModal,
    ...selectorProps
}: SimpleDatePickerModalProps) => {
    const thisYear = new Date().getUTCFullYear()

    const { day: incomingDay, month: incomingMonth, year: incomingYear } = selectedDate ?? {}

    const include = dateIncludes ?? DateIncludes.dayMonthYear

    const [day, setDay] = useState(include === DateIncludes.dayMonthYear ? (incomingDay ?? 1) : undefined)
    const [month, setMonth] = useState(include >= DateIncludes.monthYear ? (incomingMonth ?? 1) : undefined)
    const [year, setYear] = useState(incomingYear ?? thisYear)

    const start = startYear ?? 1970
    const end = endYear ?? thisYear

    const dayOptions = useMemo(() => getDayOptions(), [])
    const monthOptions = useMemo(() => getMonthOptions(), [])
    const yearOptions = useMemo(() => getYearOptions(year < start ? year : start, year > end ? year : end), [])

    const onConfirm = () => {
        const label = dateToLabel(year, month, day, toLocaleStringOptions)
        const date: DateObj = { year: year }
        if (day) date.day = day
        if (month) date.month = month
        onSelectDate?.({ label: label, data: date })
    }

    const daySelector = useMemo(() => {
        if (!day) return
        const daysInMonth = getDaysInMonth(month!, year)
        let _day = day
        if (day > daysInMonth) {
            _day = daysInMonth
            setDay(daysInMonth)
        }
        return (
            <EnhancedSelector
                selectionBoxWidth={`${50 + (showDropdownIcons ? 25 : 0)}px`}
                onChange={option => setDay(option.data)}
                focusDropdown={focusDropdowns ?? true}
                showDropdownIcon={showDropdownIcons}
                labelCenter={centerSelectorLabels ?? true}
                {...selectorProps}
                rgOptions={dayOptions.slice(0, daysInMonth)}
                selectedOption={_day}
            />
        )
    }, [month, year])

    const monthSelector = useMemo(() => {
        if (!month) return
        return (
            <EnhancedSelector
                selectionBoxWidth={`${110 + (showDropdownIcons ? 25 : 0)}px`}
                onChange={option => setMonth(option.data)}
                focusDropdown={focusDropdowns ?? true}
                showDropdownIcon={showDropdownIcons}
                labelCenter={centerSelectorLabels ?? true}
                {...selectorProps}
                rgOptions={monthOptions}
                selectedOption={month}
            />
        )
    }, [])

    const yearSelector = useMemo(() => {
        return (
            <EnhancedSelector
                selectionBoxWidth={`${72 + (showDropdownIcons ? 25 : 0)}px`}
                onChange={option => setYear(option.data)}
                focusDropdown={focusDropdowns ?? true}
                showDropdownIcon={showDropdownIcons}
                labelCenter={centerSelectorLabels ?? true}
                {...selectorProps}
                rgOptions={yearOptions}
                selectedOption={year}
            />
        )
    }, [])

    const titleStyle = { justifyContent: 'center' }
    const sectionStyle = day ? {} : { flex: '1' }
    const titleClass = addClasses(quickAccessMenuClasses.PanelSectionTitle, DatePickerModalClasses.title)

    return (
        <>
            <style>{`.${DatePickerModalClasses.topLevel} .DialogHeader { display: none !important; }`}</style>
            <ConfirmModal className={DatePickerModalClasses.topLevel} closeModal={closeModal} onOK={onConfirm}>
                <Focusable style={Object.assign({ display: 'flex' }, day ? { justifyContent: 'space-between' } : {})}>
                    {month && (
                        <div style={sectionStyle}>
                            <div style={titleStyle} className={titleClass}>
                                {t('LABEL_MONTH', 'Month')}
                            </div>
                            {monthSelector}
                        </div>
                    )}
                    {day && (
                        <div style={sectionStyle}>
                            <div style={titleStyle} className={titleClass}>
                                {t('LABEL_DAY', 'Day')}
                            </div>
                            {daySelector}
                        </div>
                    )}
                    <div style={sectionStyle}>
                        <div style={titleStyle} className={titleClass}>
                            {t('LABEL_YEAR', 'Year')}
                        </div>
                        {yearSelector}
                    </div>
                </Focusable>
            </ConfirmModal>
        </>
    )
}

export interface PrettyDatePickerModalProps extends SimpleDatePickerModalProps {}

export const PrettyDatePickerModal = ({}: PrettyDatePickerModalProps) => {
    return null
}

const locales = window.LocalizationManager.m_rgLocalesToUse

function getDayOptions() {
    const dayOptions: SingleDropdownOption[] = []
    for (let i = 1; i <= 31; i++) {
        dayOptions.push({ label: i, data: i })
    }
    return dayOptions
}

function getMonthOptions() {
    const monthOptions: SingleDropdownOption[] = []
    for (let i = 1; i <= 12; i++) {
        monthOptions.push({ label: new Date(2000, i - 1).toLocaleDateString(locales, { month: 'long' }), data: i })
    }
    return monthOptions
}

function getYearOptions(beginning: number, end: number) {
    const yearOptions = []
    for (let i = beginning; i <= end; i++) {
        yearOptions.push({ label: i, data: i })
    }
    return yearOptions
}

function getDaysInMonth(month: number, year: number) {
    return new Date(year, month, 0).getDate()
}

function isValidDate(day?: number, month?: number, year?: number) {
    if (
        year === undefined ||
        (day !== undefined && month === undefined) ||
        (month !== undefined && (month < 1 || month > 12)) ||
        (day !== undefined && (day < 1 || day > getDaysInMonth(month!, year)))
    ) {
        return false
    }
    return true
}

/** Utility function to join strings for CSS class names omitting invalid values */
function addClasses(...strings: any[]) {
    return strings.filter(string => string).join(' ')
}
