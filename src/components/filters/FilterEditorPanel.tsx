import { PanelSection, PanelSectionRow, Field, Focusable, ButtonItem, Dropdown } from "decky-frontend-lib"
import { VFC, Fragment } from "react"
import { FilterEntry } from "./FilterEntry"
import { FilterOptions } from "./FilterOptions"
import { TabFilterSettings, FilterType } from "./Filters"

interface FilterEditorPanelProps {
  groupFilters: TabFilterSettings<FilterType>[]
  groupLogicMode: string
  setGroupFilters: React.Dispatch<React.SetStateAction<TabFilterSettings<FilterType>[]>>
  setGroupLogicMode: React.Dispatch<React.SetStateAction<LogicalMode>>
  addFilter: () => void
  canAddFilter: boolean
}

export const FilterEditorPanel: VFC<FilterEditorPanelProps> = ({ groupFilters, groupLogicMode, setGroupFilters, setGroupLogicMode, addFilter, canAddFilter }) => {

  return (
    <PanelSection title="Filters">
      <PanelSectionRow>
        {groupFilters.map((filter, index) => {
          return (
            <>
              <div className="filter-start-cont">
                <div className="filter-line" />
                <div className="filter-label">Filter {index + 1} - {filter.type[0].toUpperCase().concat(filter.type.substring(1))}</div>
                <div className="filter-line" />
              </div>
              <div className="filter-params-input">
                <Field
                  label="Filter Type"
                  description={<FilterEntry index={index} filter={filter} containingGroupFilters={groupFilters} setContainingGroupFilters={setGroupFilters} />}
                />
              </div>
              <div className="filter-params-input" key={`${filter.type}`}>
                <FilterOptions index={index} filter={filter} containingGroupFilters={groupFilters} setContainingGroupFilters={setGroupFilters} />
              </div>
              {index == groupFilters.length - 1 ? (
                <div className="filter-start-cont">
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
        <div className="add-filter-btn">
          {!canAddFilter ? (
            <div style={{ marginTop: "5px" }}>Please finish the current filter before adding another</div>
          ) : (
            <Fragment />
          )}
          <Field >
            <div style={{ textAlign: 'right' }}>Group Combination Logic</div>
            <Focusable style={{ width: "100%", display: "flex", flexDirection: "row", marginBottom: "5px" }}>
              <div style={{ width: "calc(100% - 100px)" }}>
                <ButtonItem onClick={addFilter} disabled={!canAddFilter}>
                  Add Filter
                </ButtonItem>
              </div>
              <div style={{ marginLeft: "10px", width: "90px", marginTop: '10px', marginBottom: '10px', display: 'flex' }}>
                <Dropdown rgOptions={[{ label: "And", data: "and" }, { label: "Or", data: "or" },]} selectedOption={groupLogicMode} onChange={option => setGroupLogicMode(option.data)} focusable={true} />
              </div>
            </Focusable>
          </Field>
        </div>
      </PanelSectionRow>
    </PanelSection>
  )
}