import { VFC, useState } from "react";
import { TabErrorsAccordion } from "../accordions/TabErrorsAccordion";
import { FilterType, TabFilterSettings } from "../filters/Filters";
import { ErroredFiltersPanel } from "./ErroredFiltersPanel";
import { ButtonItem, ConfirmModal, showModal } from "decky-frontend-lib";
import { ErrorPanelTabNameContext } from "../../state/ErrorPanelNameContext";
import { DestructiveModal } from '../generic/DestructiveModal';

type TabErrorsPanelProps = {
  index: number,
  tab: TabSettings,
  errorEntries: FilterErrorEntry[],
  onTabStatusChange: (tab: TabSettings, isPassing: boolean) => void;
};

/**
 * Panel for tab that needs changes
 */
export const TabErrorsPanel: VFC<TabErrorsPanelProps> = ({ index, tab, errorEntries, onTabStatusChange }) => {
  const [filters, setFilters] = useState(tab.filters!);
  const [isPassing, setIsPassing] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  function onChange(filters: (TabFilterSettings<FilterType> | [])[], messages: string[][]) {
    tab.filters = [...filters];
    setFilters(filters);

    const passing = messages.every((entry) => entry.length === 0);
    setIsPassing(passing);
    setIsDeleting(filters.flatMap(filter => filter).length === 0);
    onTabStatusChange(tab, passing);
  }

  return (
    <TabErrorsAccordion index={index} tab={tab} isPassing={isPassing} isOpen={true} isDeleted={isDeleting}>
      <ErrorPanelTabNameContext.Provider value={tab.title}>
        <ErroredFiltersPanel
          filters={filters}
          errorEntries={errorEntries}
          onChange={onChange}
        />
      </ErrorPanelTabNameContext.Provider>
      <div className="styled-btn no-sep">
        <ButtonItem
          onClick={() => {
            showModal(
              <DestructiveModal
                onOK={() => onChange([], [[]])}
                strTitle="WARNING!"
              >
                Are you sure you want to delete this Tab? This can't be undone.
              </DestructiveModal>
            );
          }}
        >
          Delete Tab
        </ButtonItem>
      </div>
    </TabErrorsAccordion>
  );
};
