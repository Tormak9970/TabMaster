import { Button, Focusable } from "decky-frontend-lib";
import React, { VFC, useState, Fragment } from "react";
import { BiSolidDownArrow } from "react-icons/bi";
import { FaCircleCheck, FaCircleExclamation, FaCircleXmark } from "react-icons/fa6";

type TabErrorsAccordionProps = {
  index: number,
  tab: TabSettings,
  isPassing: boolean,
  isDeleted: boolean,
  isOpen: boolean,
  children: React.ReactNode;
};

/**
 * Filter Section accordion component
 */
export const TabErrorsAccordion: VFC<TabErrorsAccordionProps> = ({ index, isPassing, isDeleted, tab, isOpen, children }) => {
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
          {isDeleted ?
            <div className="check-cont">
              <FaCircleXmark fill="red" />
              Deleting Tab {index + 1} - {tab.title}
            </div> :
            <>
              <div className="check-cont">
                {isPassing ? (
                  // TODO: better green
                  <FaCircleCheck fill="green" />
                ) : (
                  // TODO: better yellow
                  <FaCircleExclamation fill="yellow" />
                )}
                Tab {index + 1} - {tab.title}
              </div>
              <BiSolidDownArrow
                style={{
                  animation: "transform 0.2s ease-in-out",
                  transform: !open ? "rotate(90deg)" : "",
                  fontSize: "0.8em",
                  marginLeft: "5px"
                }}
              />
            </>
          }
        </Button>
      </Focusable>
      {open && !isDeleted && children}
    </Focusable>
  );
};
