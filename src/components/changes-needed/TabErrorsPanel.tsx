import { VFC, useState } from "react";
import { TabErrorsAccordion } from "../accordions/TabErrorsAccordion";
import { FilterErrorOptions } from "./FilterErrorOptions";
import { FilterType, TabFilterSettings } from "../filters/Filters";
import { ButtonItem } from "decky-frontend-lib";

type TabErrorsPanelProps = {
  index: number,
  tab: TabSettings,
  erroredFilters: FilterErrorEntry[],
  onTabStatusChange: (tab: TabSettings, isPassing: boolean) => void;
};

/**
 * Panel for tab that needs changes
 */
export const TabErrorsPanel: VFC<TabErrorsPanelProps> = ({ index, tab, erroredFilters, onTabStatusChange }) => {
  const [errFilters, setErrFilters] = useState(erroredFilters);
  const [errorMessages, setErrorMessages] = useState<string[][]>(erroredFilters.map((entry: FilterErrorEntry) => entry.errors));
  const [isPassing, setIsPassing] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);


  function handleFilterUpdate(filterListIdx: number, errorMessageIdx: number, filter: TabFilterSettings<FilterType>) {
    const messages = [...errorMessages];
    messages[errorMessageIdx] = [];
    setErrorMessages(messages);

    const filters = [...tab.filters!];
    filters[filterListIdx] = filter;
    tab.filters = filters;

    const passing = messages.every((entry) => entry.length === 0);
    setIsPassing(passing);
    onTabStatusChange(tab, passing);
  }

  // //this does not work, indexes will get off
  //* should now update the indices properly, need to test
  function deleteFilter(filterListIdx: number, errorIdx: number) {
    const messages = [...errorMessages];
    messages.splice(errorIdx, 1);
    setErrorMessages(messages);

    const filters = [...tab.filters!];
    filters.splice(filterListIdx, 1);
    tab.filters = filters;

    const newErrFilters = [...errFilters];
    newErrFilters.splice(errorIdx, 1);

    for (const erroredFilter of newErrFilters) {
      if (erroredFilter.filterIdx > errorIdx) erroredFilter.filterIdx--;
    }
    
    setErrFilters(newErrFilters);

    const passing = messages.every((entry) => entry.length === 0);
    setIsPassing(passing);
    setIsDeleting(filters.length === 0);
    onTabStatusChange(tab, passing);
  }

  return (
    <TabErrorsAccordion index={index} tab={tab} isPassing={isPassing} isOpen={true} isDeleted={isDeleting}>
      {errFilters.map((erroredFilter: FilterErrorEntry, errorIdx: number) => {
        const filter = tab.filters![erroredFilter.filterIdx];

        return (
          <div className="filter-error-entry">
            <div className="filter-error-messages">
              {errorMessages[errorIdx].map((errorMsg: string, idx: number) => (
                <div className="filter-error-msg">Error {idx + 1} - {errorMsg}</div>
              ))}
            </div>
            <div className="filter-type">Filter Type - {filter.type}</div>
            <FilterErrorOptions filter={filter} onFilterUpdate={(filter) => handleFilterUpdate(erroredFilter.filterIdx, errorIdx, filter)} />
            //* probably should be trash icon next to filter options, and show modal
            <ButtonItem onClick={() => {
              deleteFilter(erroredFilter.filterIdx, errorIdx);
            }} >
              Delete Filter
            </ButtonItem>
          </div>
        );
      })}
    </TabErrorsAccordion>
  );
};
