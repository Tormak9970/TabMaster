import { DropdownOption, Field, FieldProps, Focusable, SingleDropdownOption } from '@decky/ui'
import { useState, VFC, useEffect } from 'react'
import { MultiSelectStyles } from '../styles/MultiSelectStyles'
import { MultiSelectedOption } from './MultiSelectOption'
import { ListSearchTrigger } from '../modals/ListSearchModal'
import { IconType } from 'react-icons/lib'

export type MultiSelectProps = {
    entryLabel: string
    determineEntryIcon: (entry: any) => IconType
    TriggerIcon: IconType
    options: DropdownOption[]
    selected: DropdownOption[]
    fieldLabel: string
    dropdownLabel?: string
    onChange?: (selected: DropdownOption[]) => void
    maxOptions?: number
    fieldProps?: FieldProps
}

/**
 * A component for multi select dropdown menus.
 */
export const MultiSelect: VFC<MultiSelectProps> = ({
    options,
    selected,
    fieldLabel,
    dropdownLabel,
    onChange = () => {},
    maxOptions,
    fieldProps,
    entryLabel,
    determineEntryIcon,
    TriggerIcon,
}) => {
    const [sel, setSel] = useState(selected)
    const [available, setAvailable] = useState(options.filter(opt => !selected.includes(opt)))

    const [dropdownSelected, setDropdownSelected] = useState({ label: dropdownLabel, data: '' })

    useEffect(() => {
        const avail = options.filter(
            opt => !sel.some(selOpt => JSON.stringify(selOpt.data) === JSON.stringify(opt.data))
        )
        setAvailable(avail)
        setDropdownSelected({
            label:
                avail.length == 0
                    ? 'All selected'
                    : ((!!maxOptions && sel.length == maxOptions ? 'Max selected' : dropdownLabel) as string),
            data: '',
        })
        onChange(sel)
    }, [sel])

    const onRemove = (option: DropdownOption) => {
        const ref = [...sel]
        ref.splice(sel.indexOf(option), 1)
        selected = ref
        setSel(selected)
    }

    const onSelectedChange = (option: DropdownOption) => {
        selected = [...sel, option]
        setSel(selected)
    }

    return (
        <Focusable>
            <MultiSelectStyles />
            <Field
                label={fieldLabel}
                description={
                    <div className='multi-select'>
                        <Focusable
                            style={{
                                width: '100%',
                                marginBottom: '5px',
                            }}
                        >
                            <ListSearchTrigger
                                entryLabel={entryLabel}
                                options={available as SingleDropdownOption[]}
                                onChange={onSelectedChange}
                                labelOverride={dropdownSelected.label!}
                                disabled={available.length == 0 || (!!maxOptions && selected.length == maxOptions)}
                                TriggerIcon={TriggerIcon}
                                determineEntryIcon={determineEntryIcon}
                            />
                        </Focusable>
                    </div>
                }
            />
            <div style={{ width: '100%', marginBottom: '14px' }}>
                {sel.map(option => (
                    <MultiSelectedOption option={option} onRemove={onRemove} fieldProps={fieldProps} />
                ))}
            </div>
        </Focusable>
    )
}
