import { Fragment, VFC, createElement, useEffect, useState } from "react";
import { Focusable, ModalRoot, SingleDropdownOption } from "decky-frontend-lib";
import { FilterDefaultParams, FilterDescriptions, FilterIcons, FilterType } from "./Filters";
import { capitalizeEachWord } from "../../lib/Utils";
import { FilterSelectStyles, achievementClasses, mainMenuAppRunningClasses } from "../styles/FilterSelectionStyles";
import { IoFilter } from 'react-icons/io5'
import { MicroSDeckInterop, microSDeckLibVersion } from '../../lib/controllers/MicroSDeckInterop';
import { BaseModalProps, CustomDropdown } from '../generic/CustomDropdown';

const FilterSelectModal: VFC<BaseModalProps> = ({ rgOptions, selectedOption, onSelectOption, closeModal }) => {
  const [focusable, setFocusable] = useState(false); //this is to briefly (on modal mount) disable focus on all selections except last selected so it is remebered

  useEffect(() => { setTimeout(() => setFocusable(true), 10) }, []);

  function handleSelect(option: SingleDropdownOption) {
    onSelectOption(option);
    closeModal!();
  }

  return (
    <>
      <FilterSelectStyles />
      <div className={`tab-master-filter-select`}>
        <ModalRoot onCancel={closeModal} onEscKeypress={closeModal}>
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
          <div className={mainMenuAppRunningClasses.OverlayAchievements}>
            {rgOptions?.map(option => <FilterSelectElement filterType={option.data} onClick={() => handleSelect(option)} focusable={focusable || selectedOption === option.data} />)}
          </div>
        </ModalRoot>
      </div>
    </>
  );
};

interface FilterSelectElement {
  filterType: FilterType,
  focusable: boolean,
  onClick: (() => void) | undefined;
}

/**
 * Individual Filter in the filter selection Modal
 */
const FilterSelectElement: VFC<FilterSelectElement> = ({ filterType, focusable, onClick }) => {
  let disabled = false;
  let requiredMicroSDeckVer = '';

  if (filterType === 'sd card') {
    disabled = !MicroSDeckInterop.isInstallOk();
    const [major, minor, patch] = microSDeckLibVersion.split(/[.+-]/, 3);
    
    if (+major > 0) requiredMicroSDeckVer = major + '.x.x';
    if (+major === 0) requiredMicroSDeckVer = `0.${minor}.${patch}`;
  }

  const canFocus = focusable && !disabled;

  return (
    <Focusable
      focusWithinClassName="gpfocuswithin"
      style={{ width: "100%", margin: 0, marginBottom: "10px", padding: 0 }}
      onActivate={canFocus ? onClick : undefined}
      onClick={canFocus ? onClick : undefined}
    >
      <div
        className={`${achievementClasses.AchievementListItemBase} ${disabled && "entry-disabled"}`}
        style={{ display: "flex", flexDirection: "column", padding: "0.5em", height: "60px" }}
      >
        <div className="entry-label" style={{ display: 'flex', alignItems: 'baseline' }}>
          <div style={{ marginRight: '7px' }}>
            {createElement(FilterIcons[filterType], { size: '.8em' })}
          </div>
          <div>
            {capitalizeEachWord(filterType)}
          </div>
          {filterType === 'sd card' && <small style={{ fontSize: "0.5em" }}>{`requires MicroSDeck ${requiredMicroSDeckVer}`}</small>}
        </div>
        <div className="entry-desc">{FilterDescriptions[filterType]}</div>
      </div>
    </Focusable>
  );
}

type FilterSelectProps = {
  selectedOption: FilterType,
  onChange: (selected: FilterType) => void
}

/**
 * Component for handling filter selection.
 */
export const FilterSelect: VFC<FilterSelectProps> = ({ selectedOption, onChange }) => {
  const filterTypeOptions = Object.keys(FilterDefaultParams).map(filterType => ({ label: capitalizeEachWord(filterType), data: filterType}));

  return (
    <CustomDropdown
      useCustomModal={FilterSelectModal}
      customDropdownIcon={<IoFilter style={{ margin: 'auto', height: '.9em' }} />}
      onChange={option => option.data !== selectedOption && onChange(option.data)}
      selectedOption={selectedOption}
      rgOptions={filterTypeOptions}
    />
  );
};
