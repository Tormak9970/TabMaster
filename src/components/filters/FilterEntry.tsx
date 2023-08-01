import { Fragment, VFC, useState } from "react";
import { FilterDefaultParams, FilterType, TabFilterSettings, canBeInverted } from "./Filters";
import { ButtonItem, Dropdown, Focusable, afterPatch } from "decky-frontend-lib";
import { FaTrash } from "react-icons/fa";

type FilterEntryProps = {
  index: number,
  filter: TabFilterSettings<FilterType>,
  containingGroupFilters: TabFilterSettings<FilterType>[],
  setContainingGroupFilters: React.Dispatch<React.SetStateAction<TabFilterSettings<FilterType>[]>>,
  shouldFocus: boolean
};

/**
 * An individual filter for a tab.
 */
export const FilterEntry: VFC<FilterEntryProps> = ({ index, filter, containingGroupFilters, setContainingGroupFilters, shouldFocus }) => {
  const filterTypeOptions = Object.keys(FilterDefaultParams).map(type => { return { label: type, data: type }; });
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

  const [isInverted, setIsInverted] = useState(filter.inverted);

  //* new filter is made with default params
  function onChange(data: { data: FilterType; }) {
    const updatedFilter = {
      type: data.data,
      inverted: isInverted,
      params: {...FilterDefaultParams[data.data]}
    };
    const updatedFilters = [...containingGroupFilters];
    updatedFilters[index] = updatedFilter;
    setContainingGroupFilters(updatedFilters);
  }

  function onInvertedChange(data: { data: boolean; }) {
    const updatedFilter = { ...filter };
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

    const filterTypeDropdownElt = (
      <Focusable style={!canBeInverted(filter) ? { width: "calc(100% - 55px)" } : { width: "calc(100% - 185px)" }}>
        <Dropdown rgOptions={filterTypeOptions} selectedOption={filter.type} onChange={onChange} />
      </Focusable>
    );

    //single shot patch the filter type dropdown to get it's navNode and tell it to take focus on first render
    if (shouldFocus) {
      afterPatch(filterTypeDropdownElt.type, 'render', (_: any, ret: any) => {
        setTimeout(() => ret.props.value.BTakeFocus(3), 1);
        return ret;
      }, { singleShot: true });
    }

    return (
      <div className="filter-entry">
        <Focusable style={{
          width: "100%",
          display: "flex",
          flexDirection: "row"
        }}>
          {!canBeInverted(filter) ? filterTypeDropdownElt : (
            <>
              {filterTypeDropdownElt}
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
    );
  } else {
    return (
      <Fragment />
    );
  }
};
