import { VFC, Fragment, useState } from "react";
import { FilterErrorOptions } from "./FilterErrorOptions";
import { ButtonItem, ConfirmModal, showModal } from "decky-frontend-lib";
import { FilterType, TabFilterSettings } from "../filters/Filters";

type ErroredFiltersPanelProps = {
  filters: (TabFilterSettings<FilterType> | [])[],
  errorEntries: FilterErrorEntry[],
  onChange: (filters: (TabFilterSettings<FilterType> | [])[], messages: string[][]) => void;
};

/**
 * Renders all errored filters.
 */
export const ErroredFiltersPanel: VFC<ErroredFiltersPanelProps> = ({ filters, errorEntries, onChange }) => {
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
            <div className="filter-error-messages">
              {errorMessages[errorIdx].map((errorMsg: string, idx: number) => (
                <div className="filter-error-msg">Error {idx + 1} - {errorMsg}</div>
              ))}
            </div>
            <div className="filter-type">Filter Type - {filter.type}</div>
            <FilterErrorOptions filter={filter} onFilterUpdate={(filter) => handleFilterUpdate(erroredFilter.filterIdx, errorIdx, filter)} mergeErrorEntries={errorEntries[errorIdx].mergeErrorEntries} />
          //* probably should be trash icon next to filter options, and show modal
            <ButtonItem
              onClick={() => {
                showModal(
                  <ConfirmModal
                    className={'destructive-modal'}
                    onOK={() => handleFilterUpdate(erroredFilter.filterIdx, errorIdx, [])}
                    bDestructiveWarning={true}
                    strTitle="WARNING!"
                  >
                    {'Are you sure you want to delete this filter? ' + (filters.flatMap(filter => filter).length === 1 ? `There are no other filters in this tab. Deleting it will automatically delete the tab as well. ` : '') + `This can't be undone.`}
                  </ConfirmModal>
                );
              }}

            >
              Delete Filter
            </ButtonItem>
          </div>);
      })}
    </>
  );
};
