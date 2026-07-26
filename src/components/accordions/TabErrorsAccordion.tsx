import { ButtonItem, Focusable } from '@decky/ui'
import React, { VFC, useState, Fragment } from 'react'
import { BiSolidDownArrow } from 'react-icons/bi'
import { FaCircleCheck, FaCircleExclamation, FaCircleXmark } from 'react-icons/fa6'
import { playUISound } from '../../lib/Utils'

type TabAccordionIconProps = {
    index: number
    tab: TabSettings
    open: boolean
    isDeleted: boolean
    isPassing: boolean
}

const TabAccordionIcon: VFC<TabAccordionIconProps> = ({ index, tab, open, isDeleted, isPassing }) => {
    if (isDeleted) {
        return (
            <div className='check-cont' style={{ pointerEvents: 'none' }}>
                <FaCircleXmark fill='red' />
                Deleting Tab {index + 1} - {tab.title}
            </div>
        )
    } else {
        return (
            <>
                <div className='check-cont' style={{ pointerEvents: 'none' }}>
                    {isPassing ? <FaCircleCheck fill='#00f500' /> : <FaCircleExclamation fill='yellow' />}
                    Tab {index + 1} - {tab.title}
                </div>
                <BiSolidDownArrow
                    style={{
                        animation: 'transform 0.2s ease-in-out',
                        transform: !open ? 'rotate(90deg)' : '',
                        fontSize: '0.8em',
                        marginLeft: '5px',
                        pointerEvents: 'none',
                    }}
                />
            </>
        )
    }
}

type TabErrorsAccordionProps = {
    index: number
    tab: TabSettings
    isPassing: boolean
    isDeleted: boolean
    isOpen: boolean
    children: React.ReactNode
}

/**
 * Filter Section accordion component
 */
export const TabErrorsAccordion: VFC<TabErrorsAccordionProps> = ({
    index,
    isPassing,
    isDeleted,
    tab,
    isOpen,
    children,
}) => {
    const [open, setOpen] = useState(isOpen)

    function onClick(e: any) {
        e.stopPropagation()
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
                    <TabAccordionIcon index={index} tab={tab} open={open} isDeleted={isDeleted} isPassing={isPassing} />
                </ButtonItem>
            </Focusable>
            {open && !isDeleted && children}
        </Focusable>
    )
}
