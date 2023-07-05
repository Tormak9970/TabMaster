import { VFC, useState } from "react"
import { TabErrorsAccordion } from "../accordions/TabErrorsAccordion"
import { FilterOptions } from "../filters/FilterOptions"

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
            {/* TODO: we need something like FilterOptions, but for when there's errors. we can reuse all of them except the merge one */}
          </div>
        );
      })}
    </TabErrorsAccordion>
  )
}
