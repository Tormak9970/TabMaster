import { VFC, useState } from "react"
import { TabErrorsAccordion } from "../accordions/TabErrorsAccordion"
import { FilterErrorOptions } from "./FilterErrorOptions"
import { FilterType, TabFilterSettings } from "../filters/Filters"

type TabErrorsPanelProps = {
  index: number,
  tab: TabSettings,
  erroredFilters: FilterErrorEntry[],
  onTabStatusChange: (tab: TabSettings, isPassing: boolean) => void
}

/**
 * Panel for tab that needs changes
 */
export const TabErrorsPanel: VFC<TabErrorsPanelProps> = ({ index, tab, erroredFilters, onTabStatusChange }) => {
  const [errorMessages, setErrorMessages] = useState<string[][]>(erroredFilters.map((entry: FilterErrorEntry) => entry.errors));
  const [isPassing, setIsPassing] = useState(false);

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

  return (
    <TabErrorsAccordion index={index} tab={tab} isPassing={isPassing} isOpen={true}>
      {erroredFilters.map((erroredFilter: FilterErrorEntry, errorIdx: number) => {
        const filter = tab.filters![erroredFilter.filterIdx];

        return (
          <div className="filter-error-entry">
            <div className="filter-error-messages">
              {errorMessages[errorIdx].map((errorMsg:string, idx: number) => (
                <div className="filter-error-msg">Error {idx + 1} - {errorMsg}</div>
              ))}
            </div>
            <div className="filter-type">Filter Type - {filter.type}</div>
            <FilterErrorOptions filter={filter} onFilterUpdate={(filter) => handleFilterUpdate(erroredFilter.filterIdx, errorIdx, filter)} />
          </div>
        );
      })}
    </TabErrorsAccordion>
  )
}
