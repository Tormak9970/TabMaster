import { ButtonItem, Focusable } from '@decky/ui'
import React, { useState } from 'react'
import { FilterLabels, isValidParams } from '../filters/Filters'
import { BiSolidDownArrow } from 'react-icons/bi'
import { FaXmark } from 'react-icons/fa6'
import { CgCheck } from 'react-icons/cg'
import { trans_string as t, playUISound, getLogicalMode } from '@utils'
import { TabFilterSettings, FilterType } from '@types'

type FilterSectionAccordionProps = {
    index: number
    filter: TabFilterSettings<FilterType>
    isOpen: boolean
    children: React.ReactNode
}

/**
 * Filter Section accordion component
 */
export const FilterSectionAccordion = ({ index, filter, isOpen, children }: FilterSectionAccordionProps) => {
    const [open, setOpen] = useState(isOpen)

    function onClick() {
        playUISound('/sounds/deck_ui_misc_01.wav')
        setOpen(!open)
    }

    return (
        <Focusable style={{ width: '100%', padding: '0' }}>
            <Focusable
                className='filter-start-cont styled-btn highlight-on-focus'
                focusClassName='start-focused'
                focusWithinClassName='start-focused'
            >
                <ButtonItem onClick={onClick}>
                    <div className='filter-line' style={{ width: '1.25rem', pointerEvents: 'none' }} />
                    <div
                        className='filter-label'
                        style={{ display: 'flex', alignItems: 'center', pointerEvents: 'none' }}
                    >
                        {isValidParams(filter) ? (
                            <CgCheck
                                viewBox='5 5 14 14'
                                size='0.9em'
                                style={{ marginRight: '3px', color: '#009e0eb3' }}
                            />
                        ) : (
                            <FaXmark size='0.9em' style={{ marginRight: '3px' }} fill='#ff0016a3' />
                        )}
                        {t('LABEL_FILTER', 'Filter')} {index + 1} - {FilterLabels()[filter.type]}
                        {filter.type === 'merge'
                            ? ` - ${t('MESSAGE_MODE', 'mode')}: ${getLogicalMode((filter as TabFilterSettings<'merge'>).params.mode)}`
                            : ''}
                    </div>
                    <div className='filter-line' style={{ flexGrow: '1', pointerEvents: 'none' }} />
                    <BiSolidDownArrow
                        className='filter-accordion-arrow'
                        style={{
                            transition: 'transform 0.2s ease-in-out',
                            transform: !open ? 'rotate(90deg)' : '',
                            fontSize: '0.8em',
                            pointerEvents: 'none',
                        }}
                    />
                    <div className='filter-line' style={{ width: '1.25rem', pointerEvents: 'none' }} />
                </ButtonItem>
            </Focusable>
            {open && children}
        </Focusable>
    )
}
