import { VFC, Fragment, useState } from "react"
import { FilterErrorOptions } from "./FilterErrorOptions"
import { ButtonItem } from "decky-frontend-lib"
import { FilterType, TabFilterSettings } from "../filters/Filters";

type ErroredFiltersPanelProps = {
  filters: TabFilterSettings<FilterType>[],
  errorEntries: FilterErrorEntry[],
  onChange: (filters: TabFilterSettings<FilterType>[], messages: string[][]) => void;
}

/**
 * Renders all errored filters.
 */
export const ErroredFiltersPanel: VFC<ErroredFiltersPanelProps> = ({ filters, errorEntries, onChange }) => {
  const [errEntries, setErrEntries] = useState(errorEntries);
  const [errorMessages, setErrorMessages] = useState<string[][]>(errorEntries.map((entry: FilterErrorEntry) => entry.errors));

  function handleFilterUpdate(filterListIdx: number, errorMessageIdx: number, filter: TabFilterSettings<FilterType>) {
    const messages = [...errorMessages];
    messages[errorMessageIdx] = [];
    setErrorMessages(messages);

    const newFilters = [...filters];
    newFilters[filterListIdx] = filter;

    onChange(newFilters, messages);
  }

  // //this does not work, indexes will get off
  //* should now update the indices properly, need to test
  function deleteFilter(filterListIdx: number, errorIdx: number) {
    const messages = [...errorMessages];
    messages.splice(errorIdx, 1);
    setErrorMessages(messages);

    const newFilters = [...filters];
    newFilters.splice(filterListIdx, 1);

    const newErrFilters = [...errEntries];
    newErrFilters.splice(errorIdx, 1);

    for (const erroredFilter of newErrFilters) {
      if (erroredFilter.filterIdx > errorIdx) erroredFilter.filterIdx--;
    }
    
    setErrEntries(newErrFilters);
    onChange(newFilters, messages);
  }

  return (
    <>
      {errEntries.map((erroredFilter: FilterErrorEntry, errorIdx: number) => {
      const filter = filters[erroredFilter.filterIdx];

      return (
        <div className="filter-error-entry">
          <div className="filter-error-messages">
            {errorMessages[errorIdx].map((errorMsg: string, idx: number) => (
              <div className="filter-error-msg">Error {idx + 1} - {errorMsg}</div>
            ))}
          </div>
          <div className="filter-type">Filter Type - {filter.type}</div>
          <FilterErrorOptions filter={filter} onFilterUpdate={(filter) => handleFilterUpdate(erroredFilter.filterIdx, errorIdx, filter)} mergeErrorEntries={errorEntries[errorIdx].mergeErrorEntries} />
          //* probably should be trash icon next to filter options, and show modal
          <ButtonItem onClick={() => {
            deleteFilter(erroredFilter.filterIdx, errorIdx);
          }} >
            Delete Filter
          </ButtonItem>
        </div>
      );
    })}
    </>
  )
}
