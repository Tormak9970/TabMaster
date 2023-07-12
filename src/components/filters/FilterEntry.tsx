import { Fragment, VFC, useState } from "react";
import { FilterDefaultParams, FilterType, TabFilterSettings, canBeInverted } from "./Filters";
import { ButtonItem, Dropdown, Focusable } from "decky-frontend-lib";
import { FaTrash } from "react-icons/fa";

type FilterEntryProps = {
  index: number,
  filter: TabFilterSettings<FilterType>,
  containingGroupFilters: TabFilterSettings<FilterType>[],
  setContainingGroupFilters: React.Dispatch<React.SetStateAction<TabFilterSettings<FilterType>[]>>
}

/**
 * An individual filter for a tab.
 */
export const FilterEntry: VFC<FilterEntryProps> = ({ index, filter, containingGroupFilters, setContainingGroupFilters }) => {
  const filterTypeOptions = Object.keys(FilterDefaultParams).map(type => { return { label: type, data: type } });
  const invertOptions = [
    {
      label: "default",
      data: false
    },
    {
      label: "invert",
      data: true
    }
  ];

  const [ isInverted, setIsInverted ] = useState(filter.inverted);

  //* new filter is made with default params
  function onChange(data: {data: FilterType}) {
    const updatedFilter = {
      type: data.data,
      inverted: isInverted,
      params: {...FilterDefaultParams[data.data]}
    }
    const updatedFilters = [...containingGroupFilters];
    updatedFilters[index] = updatedFilter;
    setContainingGroupFilters(updatedFilters);
  }

  function onInvertedChange(data: { data: boolean }) {
    const updatedFilter = { ...filter }
    updatedFilter.inverted = data.data;

    const updatedFilters = [...containingGroupFilters];
    updatedFilters[index] = updatedFilter;

    setIsInverted(data.data);
    setContainingGroupFilters(updatedFilters);
  }

  function onDelete() {
    const updatedFilters = [...containingGroupFilters];
    updatedFilters.splice(index, 1);
    setContainingGroupFilters(updatedFilters);
  }

  if (filter) {
    return (
      <div className="filter-entry">
        <Focusable style={{
          width: "100%",
          display: "flex",
          flexDirection: "row"
        }}>
          {!canBeInverted(filter) ? (
            <Focusable style={{
              width: "calc(100% - 55px)"
            }}>
              <Dropdown rgOptions={filterTypeOptions} selectedOption={filter.type} onChange={onChange} />
            </Focusable>
          ) : (
            <>
              <Focusable style={{
                width: "calc(100% - 185px)"
              }}>
                <Dropdown rgOptions={filterTypeOptions} selectedOption={filter.type} onChange={onChange} />
              </Focusable>
              <Focusable style={{
                marginLeft: "10px",
                width: "120px"
              }}>
                <Dropdown rgOptions={invertOptions} selectedOption={filter.inverted} onChange={onInvertedChange} />
              </Focusable>
            </>
          )}
          <Focusable style={{
            marginLeft: "10px",
            width: "45px"
          }}>
            <ButtonItem onClick={onDelete}>
              <FaTrash />
            </ButtonItem>
          </Focusable>
        </Focusable>
      </div>
    )
  } else {
    return (
      <Fragment />
    );
  }
}
