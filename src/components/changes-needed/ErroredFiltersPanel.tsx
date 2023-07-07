import { VFC, Fragment, useState } from "react";
import { FilterErrorOptions } from "./FilterErrorOptions";
import { FilterType, TabFilterSettings } from "../filters/Filters";

type ErroredFiltersPanelProps = {
  filters: (TabFilterSettings<FilterType> | [])[],
  errorEntries: FilterErrorEntry[],
  onChange: (filters: (TabFilterSettings<FilterType> | [])[], messages: string[][]) => void;
  isMergeGroup?: boolean;
};

/**
 * Renders all errored filters.
 */
export const ErroredFiltersPanel: VFC<ErroredFiltersPanelProps> = ({ filters, errorEntries, onChange, isMergeGroup }) => {
  const [errorMessages, setErrorMessages] = useState<string[][]>(errorEntries.map((entry: FilterErrorEntry) => entry.errors));

  function handleFilterUpdate(filterListIdx: number, errorMessageIdx: number, filter: TabFilterSettings<FilterType> | []) {
    const messages = [...errorMessages];
    messages[errorMessageIdx] = [];
    setErrorMessages(messages);

    const newFilters = [...filters];
    newFilters[filterListIdx] = filter;

    onChange(newFilters, messages);
  }

  return (
    <>
      {errorEntries.flatMap((erroredFilter: FilterErrorEntry, errorIdx: number) => {
        const filter = filters[erroredFilter.filterIdx];

        return Array.isArray(filter) ? [] :
          (<div className="filter-error-entry">
            <div style={{
              color: "#8b929a",
              fontWeight: "600",
              marginTop: "10px"
            }}>Errors</div>
            <div className="filter-error-messages">
              {errorMessages[errorIdx].map((errorMsg: string) => (
                <div className="filter-error-msg">{errorMsg}</div>
              ))}
            </div>
            <div style={{
              color: "#8b929a",
              fontWeight: "600",
              marginTop: "10px"
            }}>Filter Type - {filter.type}</div>
            <FilterErrorOptions isMergeGroup={isMergeGroup} numFilters={filters.flatMap(filter => filter).length} filter={filter} onFilterUpdate={(filter) => handleFilterUpdate(erroredFilter.filterIdx, errorIdx, filter)} onFilterDelete={() => handleFilterUpdate(erroredFilter.filterIdx, errorIdx, [])} mergeErrorEntries={errorEntries[errorIdx].mergeErrorEntries} />
          </div>);
      })}
    </>
  );
};
