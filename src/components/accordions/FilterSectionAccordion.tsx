import { Button, Focusable } from "decky-frontend-lib"
import React, { VFC, useState } from "react"
import { FilterType, TabFilterSettings, isValidParams } from "../filters/Filters"
import { capitalizeFirstLetter, playUISound } from "../../lib/Utils"
import { BiSolidDownArrow } from "react-icons/bi"
import { FaXmark } from 'react-icons/fa6';
import { CgCheck } from 'react-icons/cg';
import { modalMargin } from '../styles/ModalStyles';

type FilterSectionAccordionProps = {
  index: number,
  filter: TabFilterSettings<FilterType>,
  isOpen: boolean,
  children: React.ReactNode
}

/**
 * Filter Section accordion component
 */
export const FilterSectionAccordion: VFC<FilterSectionAccordionProps> = ({ index, filter, isOpen, children }) => {
  const [open, setOpen] = useState(isOpen);

  function onClick(e: any) {
    e.stopPropagation();
    playUISound('/sounds/deck_ui_misc_01.wav');
    setOpen(!open);
  }

  return (
    <Focusable style={{ width: "100%", padding: "0" }}>
      <Focusable className="filter-start-cont" focusClassName="start-focused" focusWithinClassName="start-focused">
        <Button style={{
          width: "100%",
          padding: "0",
          margin: "0",
          background: "transparent",
          outline: "none",
          border: "none",

          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center"
        }} onOKButton={onClick} onClick={onClick}>
          <div className="filter-line" style={{width: `calc(${modalMargin} - 5px)`}}/>
          <div className="filter-label" style={{ display: 'flex', alignItems: 'center' }}>
            {isValidParams(filter) ? <CgCheck viewBox='5 5 14 14' size='0.9em' style={{ marginRight: '3px', color: '#009e0eb3' }} /> : <FaXmark size='0.9em' style={{ marginRight: '3px'}} fill='#ff0016a3'/>}
            Filter {index + 1} - {capitalizeFirstLetter(filter.type)}{filter.type === "merge" ? ` - mode: ${capitalizeFirstLetter((filter as TabFilterSettings<'merge'>).params.mode)}` : ""}
          </div>
          <div className="filter-line" style={{flexGrow: '1'}}/>
          <BiSolidDownArrow
            className='filter-accordion-arrow'
            style={{
              transition: "transform 0.2s ease-in-out",
              transform: !open ? "rotate(90deg)" : "",
              fontSize: "0.8em",
            }}
          />
          <div className="filter-line" style={{width: `calc(${modalMargin})`}}/>
        </Button>
      </Focusable>
      {open && children}
    </Focusable>
  )
}
