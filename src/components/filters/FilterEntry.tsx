import { Fragment, VFC, useState } from "react";
import { FilterDefaultParams, FilterType, TabFilterSettings, canBeInverted } from "./Filters";
import { Dropdown, Focusable, afterPatch } from "decky-frontend-lib";
import { FilterSelect } from "./FilterSelect";
import { TrashButton } from '../generic/TrashButton';

type FilterEntryProps = {
  index: number,
  filter: TabFilterSettings<FilterType>,
  containingGroupFilters: TabFilterSettings<FilterType>[],
  setContainingGroupFilters: React.Dispatch<React.SetStateAction<TabFilterSettings<FilterType>[]>>,
  onFilterDelete(index: number): void,
  shouldFocus: boolean
};

/**
 * An individual filter for a tab.
 */
export const FilterEntry: VFC<FilterEntryProps> = ({ index, filter, containingGroupFilters, setContainingGroupFilters, onFilterDelete, shouldFocus }) => {
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

  function onChange(selectedType: FilterType) {
    const updatedFilter = {
      type: selectedType,
      inverted: isInverted,
      params: {...FilterDefaultParams[selectedType]}
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
    onFilterDelete(index);
    setContainingGroupFilters(updatedFilters);
  }

  if (filter) {
    const filterTypeDropdownElt = (
      <Focusable style={!canBeInverted(filter) ? { width: "calc(100% - 55px)" } : { width: "calc(100% - 185px)" }}>
        <FilterSelect selectedOption={filter.type} onChange={onChange} />
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
            <TrashButton onClick={onDelete} />
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
