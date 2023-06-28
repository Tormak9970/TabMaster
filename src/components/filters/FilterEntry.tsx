import { Fragment, VFC } from "react";
import { FilterType, TabFilterSettings } from "./Filters";
import { ButtonItem, Dropdown, Focusable, SingleDropdownOption } from "decky-frontend-lib";
import { FaTrash } from "react-icons/fa";

const FilterTypes: string[] = [
  "collection",
  "installed",
  "regex",
  "friends",
  "tags",
  "whitelist",
  "blacklist"
];


type FilterEntryProps = {
  index: number,
  filter: TabFilterSettings<FilterType>,
  filters: TabFilterSettings<FilterType>[],
  setFilters: React.Dispatch<React.SetStateAction<TabFilterSettings<FilterType>[]>>
}

/**
 * An individual filter for a tab.
 */
export const FilterEntry: VFC<FilterEntryProps> = ({ index, filter, filters, setFilters }) => {
  const filterTypeOptions = FilterTypes.map(type => { return { label: type, data: type } });

  function onChange(data: SingleDropdownOption) {
    const updatedFilter = {...filter};
    updatedFilter.type = data.data;
    const updatedFilters = [...filters];
    updatedFilters[index] = updatedFilter;
    setFilters(updatedFilters);
  }

  function onDelete() {
    const updatedFilters = [...filters];
    updatedFilters.splice(index, 1);
    setFilters(updatedFilters);
  }

  if (filter) {
    return (
      <div className="filter-entry">
        <Focusable style={{
          width: "100%",
          display: "flex",
          flexDirection: "row"
        }}>
          <Focusable style={{
            width: "calc(100% - 55px)"
          }}>
            <Dropdown rgOptions={filterTypeOptions} selectedOption={filter.type} onChange={onChange} />
          </Focusable>
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