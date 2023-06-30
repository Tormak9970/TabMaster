import { Button, Focusable } from "decky-frontend-lib"
import React, { VFC, useState } from "react"
import { FilterType, TabFilterSettings } from "../filters/Filters"
import { capitalizeFirstLetter } from "../../lib/Utils"
import { BiSolidDownArrow } from "react-icons/bi"

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
          <div className="filter-line" />
          <div className="filter-label">
            Filter {index + 1} - {capitalizeFirstLetter(filter.type)}{filter.type === "merge" ? ` - mode: ${capitalizeFirstLetter((filter as TabFilterSettings<'merge'>).params.mode)}` : ""}
            <BiSolidDownArrow
              style={{
                animation: "transform 0.2s ease-in-out",
                transform: !open ? "rotate(90deg)" : "",
                fontSize: "0.8em",
                marginLeft: "5px"
              }}
            />
          </div>
          <div className="filter-line" />
        </Button>
      </Focusable>
      {open && children}
    </Focusable>
  )
}