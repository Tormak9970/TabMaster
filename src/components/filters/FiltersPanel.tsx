import { PanelSection, PanelSectionRow, Field, ButtonItem, Dropdown, Toggle, afterPatch, Focusable } from "decky-frontend-lib";
import { VFC, Fragment, useMemo } from "react";
import { FilterEntry } from "./FilterEntry";
import { FilterOptions } from "./FilterOptions";
import { TabFilterSettings, FilterType } from "./Filters";
import { FilterSectionAccordion } from "../accordions/FilterSectionAccordion";

interface FiltersPanelProps {
  groupFilters: TabFilterSettings<FilterType>[],
  groupLogicMode: string,
  groupIncludesHidden: boolean,
  setGroupFilters: React.Dispatch<React.SetStateAction<TabFilterSettings<FilterType>[]>>,
  setGroupLogicMode: React.Dispatch<React.SetStateAction<LogicalMode>>,
  setGroupIncludesHidden: React.Dispatch<React.SetStateAction<boolean>>,
  addFilter: () => void,
  canAddFilter: boolean,
  shouldFocusAddButton?: boolean
}

export const FiltersPanel: VFC<FiltersPanelProps> = ({ groupFilters, groupLogicMode, groupIncludesHidden, setGroupFilters, setGroupLogicMode, setGroupIncludesHidden, addFilter, canAddFilter, shouldFocusAddButton }) => {
  const modeOptions = [
    { label: "And", data: "and" },
    { label: "Or", data: "or" }
  ];

  //this sets whether filter entry type dropdown should take focus when being rendered, ie when a filter is added 
  let shouldFocusFilterDropdown = false;
  useMemo(() => {
    shouldFocusFilterDropdown = true;
  }, [groupFilters.length]);

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
            <div style={{ width: "150px" }}>
              <Dropdown rgOptions={modeOptions} selectedOption={groupLogicMode} onChange={(option) => setGroupLogicMode(option.data)} focusable={true} />
            </div>
          </Field>
        </PanelSectionRow>
        <PanelSectionRow>
          <Field
            label="Include Hidden Games"
            childrenLayout="inline"
            childrenContainerWidth="min"
            inlineWrap="keep-inline"
            className="no-sep"
          >
            <Toggle value={groupIncludesHidden} onChange={(checked) => setGroupIncludesHidden(checked)} />
          </Field>
        </PanelSectionRow>
        <PanelSectionRow>
          {groupFilters.map((filter, index) => {
            return (
              <>
                <FilterSectionAccordion
                  index={index}
                  filter={filter}
                  isOpen={true}
                >
                  <div className="no-sep">
                    <Field
                      label="Filter Type"
                      description={<FilterEntry index={index} filter={filter} containingGroupFilters={groupFilters} setContainingGroupFilters={setGroupFilters} shouldFocus={shouldFocusFilterDropdown && index === groupFilters.length - 1} />}
                    />
                  </div>
                  <div className="no-sep" key={`${filter.type}`}>
                    <FilterOptions index={index} filter={filter} containingGroupFilters={groupFilters} setContainingGroupFilters={setGroupFilters} />
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
            <ButtonItem onClick={addFilter} disabled={!canAddFilter}>
              Add Filter
            </ButtonItem>
          </div>
        </PanelSectionRow>
      </PanelSection>
    </Focusable>
  );

  if (shouldFocusAddButton) {
    //wrap the whole panel in a focusable and one shot patch it to grab it's navNode and set focus to it's last child
    //which is the add filter button
    afterPatch(element.type, 'render', (_: any, ret: any) => {
      setTimeout(() => ret.props.value.BFocusLastChild(3), 1);
      return ret;
    }, { singleShot: true });
  }

  return element;
};
