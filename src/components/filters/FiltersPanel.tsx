import { PanelSection, PanelSectionRow, Field, ButtonItem, Dropdown, afterPatch, Focusable } from "decky-frontend-lib";
import { VFC, Fragment, useRef, useEffect } from "react";
import { FilterEntry } from "./FilterEntry";
import { FilterOptions } from "./FilterOptions";
import { TabFilterSettings, FilterType } from "./Filters";
import { FilterSectionAccordion } from "../accordions/FilterSectionAccordion";

interface FiltersPanelProps {
  groupFilters: TabFilterSettings<FilterType>[],
  groupLogicMode: string,
  setGroupFilters: React.Dispatch<React.SetStateAction<TabFilterSettings<FilterType>[]>>,
  setGroupLogicMode: React.Dispatch<React.SetStateAction<LogicalMode>>,
  addFilter: () => void,
  canAddFilter: boolean,
  shouldFocusAddButton?: boolean,
  collapseFilters?: boolean
}

export const FiltersPanel: VFC<FiltersPanelProps> = ({ groupFilters, groupLogicMode, setGroupFilters, setGroupLogicMode, addFilter, canAddFilter, shouldFocusAddButton, collapseFilters }) => {
  const modeOptions = [
    { label: "And", data: "and" },
    { label: "Or", data: "or" }
  ];

  let newFilterWasAdded = useRef(false);
  let deletedFilterIndex = useRef(-1);

  function onAddFilter(): void {
    newFilterWasAdded.current = true;
    addFilter();
  }

  function onFilterDelete(index: number): void {
    deletedFilterIndex.current = index;
  }

  useEffect(() => {
    if (deletedFilterIndex.current !== -1) deletedFilterIndex.current = -1;
    if (newFilterWasAdded.current) newFilterWasAdded.current = false;
  });

  const element = (
    <Focusable>
      <PanelSection title="Filters">
        <PanelSectionRow>
          <Field
            label="Group Combination Logic"
            childrenLayout="inline"
            childrenContainerWidth="min"
            inlineWrap="keep-inline"
            className="no-sep"
          >
            <div style={{ width: "100px" }}>
              <Dropdown rgOptions={modeOptions} selectedOption={groupLogicMode} onChange={(option) => setGroupLogicMode(option.data)} focusable={true} />
            </div>
          </Field>
        </PanelSectionRow>
        <PanelSectionRow>
          {groupFilters.map((filter, index) => {
            return (
              <>
                <FilterSectionAccordion
                  index={index}
                  filter={filter}
                  isOpen={(newFilterWasAdded.current ? index === groupFilters.length - 1 : !collapseFilters) || ((deletedFilterIndex.current !== -1) && (deletedFilterIndex.current !== groupFilters.length ? index === deletedFilterIndex.current : index === groupFilters.length - 1))}
                >
                  <div className="no-sep" key={`${filter.type}`}>
                    <div className="no-sep">
                      <Field
                        label="Filter Type"
                        description={
                          <FilterEntry
                            index={index}
                            filter={filter}
                            containingGroupFilters={groupFilters}
                            setContainingGroupFilters={setGroupFilters}
                            onFilterDelete={onFilterDelete}
                            // * if a new filter was just added, focus the last filter (the new one).
                            // * or, if a filter was just deleted, if its the last filter, focus the new last one, otherwise focus the correct one.
                            shouldFocus={(newFilterWasAdded.current && index === groupFilters.length - 1) || ((deletedFilterIndex.current !== -1) && (deletedFilterIndex.current !== groupFilters.length ? index === deletedFilterIndex.current : index === groupFilters.length - 1))}
                          />
                        }
                      />
                    </div>
                    <div className="no-sep">
                      <FilterOptions index={index} filter={filter} containingGroupFilters={groupFilters} setContainingGroupFilters={setGroupFilters} />
                    </div>
                  </div>
                </FilterSectionAccordion>
                {index == groupFilters.length - 1 ? (
                  <div className="filter-start-cont" style={{ marginTop: "8px" }}>
                    <div className="filter-line" />
                  </div>
                ) : (
                  <Fragment />
                )}
              </>
            );
          })}
        </PanelSectionRow>
        <PanelSectionRow>
          <div className="styled-btn no-sep">
            {!canAddFilter ? (
              <div style={{ marginTop: "10px" }}>Please finish the current filter before adding another</div>
            ) : (
              <Fragment />
            )}
            <ButtonItem onClick={onAddFilter} disabled={!canAddFilter}>
              Add Filter
            </ButtonItem>
          </div>
        </PanelSectionRow>
      </PanelSection>
    </Focusable>
  );

  if (shouldFocusAddButton) {
    // * wrap the whole panel in a focusable and one shot patch it to grab it's navNode and set focus to it's last child
    // * which is the add filter button
    afterPatch(element.type, 'render', (_: any, ret: any) => {
      setTimeout(() => ret.props.value.BFocusLastChild(3), 1);
      return ret;
    }, { singleShot: true });
  }

  return element;
};
