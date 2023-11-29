import { Fragment, VFC, useEffect, useState } from "react";
import { Focusable, ModalRoot, showModal } from "decky-frontend-lib";
import { FilterDefaultParams, FilterDescriptions, FilterPluginSource, FilterType, isFilterDisabled } from "./Filters";
import { capitalizeEachWord } from "../../lib/Utils";
import { FilterSelectStyles, achievementClasses, mainMenuAppRunningClasses } from "../styles/FilterSelectionStyles";
import { CustomButton } from '../generic/CustomButton';
import { IoFilter } from 'react-icons/io5'

interface FilterSelectModalProps {
  selectedOption: FilterType,
  onSelect: (selected: FilterType) => void,
  closeModal?: () => void;
}

const FilterSelectModal: VFC<FilterSelectModalProps> = ({ selectedOption, onSelect, closeModal }) => {
  const [focusable, setFocusable] = useState(false);
  const [selected, setSelected] = useState<FilterType>(selectedOption);
  const filterTypeOptions = Object.keys(FilterDefaultParams) as FilterType[];

  useEffect(() => { setTimeout(() => setFocusable(true), 10) }, []);

  function handleSelect(selectedFilter: FilterType) {
    setSelected(selectedFilter);
    onSelect(selectedFilter);
    closeModal!();
  }

  return (
    <>
      <FilterSelectStyles />
      <ModalRoot onCancel={() => handleSelect(selected)} onEscKeypress={() => handleSelect(selected)}>
        <h1
          style={{
            marginBlockEnd: "10px",
            marginBlockStart: "0px",
            overflowX: "hidden",
            fontSize: "1.5em",
            whiteSpace: "nowrap",
          }}
        >
          Change Filter Type
        </h1>
        <div className={`tab-master-filter-select ${mainMenuAppRunningClasses.OverlayAchievements}`}>
          {filterTypeOptions.map((filterType: FilterType) => {
            const disabled = isFilterDisabled(filterType);

            return (
              <FilterSelectElement
                disabled={disabled}
                filterType={filterType}
                handleSelect={focusable || selected === filterType ? () => handleSelect(filterType) : undefined}
              />
            );
          })}
        </div>
      </ModalRoot>
    </>
  );
};

interface FilterSelectElement {
  filterType: FilterType,
  disabled: boolean,
  handleSelect: (() => void) | undefined;
}

/**
 * Individual Filter in the filter selection Modal
 */
const FilterSelectElement: VFC<FilterSelectElement> = ({ filterType, disabled, handleSelect }) => {

  const pluginSource = FilterPluginSource[filterType];

  const pluginNotice = !pluginSource ? "" : (
    <small style={{ marginLeft: "0.5em", fontSize: "0.5em" }}>(requires {pluginSource})</small>
  );

  return (
    <Focusable
      focusWithinClassName="gpfocuswithin"
      style={{ width: "100%", margin: 0, marginBottom: "10px", padding: 0 }}
      onOKButton={disabled ? e => e.preventDefault() : handleSelect}
    >
      <div
        className={`${achievementClasses.AchievementListItemBase} ${disabled && "entry-disabled"}`}
        style={{ display: "flex", flexDirection: "column", padding: "0.5em", height: "60px" }}
      >
        <div className="entry-label">
          {capitalizeEachWord(filterType)}
          {pluginNotice}
        </div>
        <div className="entry-desc">{FilterDescriptions[filterType]}</div>
      </div>
    </Focusable>
  );
}

async function getFilterSelection(selectedOption: FilterType): Promise<FilterType> {
  return new Promise<FilterType>((resolve) => {
    showModal(
      <FilterSelectModal selectedOption={selectedOption} onSelect={(filterType: FilterType) => {
        resolve(filterType);
      }} />
    )
  });
}


type FilterSelectProps = {
  selectedOption: FilterType,
  onChange: (selected: FilterType) => void
}

/**
 * Component for handling filter selection.
 */
export const FilterSelect: VFC<FilterSelectProps> = ({ selectedOption, onChange }) => {
  const [selected, setSelected] = useState<FilterType>(selectedOption);

  async function showFilterSelection() {
    const chosenFilter = await getFilterSelection(selected);
    setSelected(chosenFilter);
    onChange(chosenFilter);
  }

  return (
    <CustomButton style={{ padding: '10px 16px' }} onOKActionDescription={"Change Filter Type"} onOKButton={showFilterSelection} onClick={showFilterSelection}>
      <div style={{ display: 'flex', overflow: 'hidden' }}>
        <div style={{ overflow: 'hidden', flex: 'auto' }}>
          <div style={{ textAlign: 'left', minHeight: '20px' }}>
            {capitalizeEachWord(selected)}
          </div>
        </div>
        <div style={{ display: 'flex', marginLeft: '1ch', flex: 'none' }}>
          <IoFilter style={{ margin: 'auto', height: '.9em' }} />
        </div>
      </div>
    </CustomButton>
  );
};
