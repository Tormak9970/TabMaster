import { ButtonItem, Focusable } from '@decky/ui'
import { VFC, ReactNode, useState } from 'react'
import { playUISound } from '../../lib/Utils'
import { BiSolidDownArrow } from 'react-icons/bi'
import { FaUser } from 'react-icons/fa6'

type SharedTabAccordionProps = {
    user: string
    tabs: TabSettings[]
    isOpen: boolean
    children: ReactNode
}

/**
 * Shared Tab accordion component
 */
export const SharedTabAccordion: VFC<SharedTabAccordionProps> = ({ user, tabs, isOpen, children }) => {
    const [open, setOpen] = useState(isOpen)

    const tabCount = tabs.length

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
                        <FaUser size='0.9em' style={{ marginRight: '3px', color: '#009e0eb3' }} />
                        {user} - {tabCount} {tabCount === 1 ? 'Tab' : 'Tabs'}
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
