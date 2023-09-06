import { Fragment, VFC, useState } from "react";
import { DialogButton, Focusable, ModalRoot, showModal } from "decky-frontend-lib";
import { FilterDefaultParams, FilterType } from "./Filters";
import { capitalizeFirstLetter } from "../../lib/Utils";
import { FilterSelectStyles, achievementClasses } from "../styles/FilterSelectionStyles";

interface FilterSelectModalProps {
  selectedOption: FilterType,
  onSelect: (selected: FilterType) => void,
  closeModal?: () => void;
}

const FilterSelectModal: VFC<FilterSelectModalProps> = ({ selectedOption, onSelect, closeModal }) => {
  const [selected, setSelected] = useState<FilterType>(selectedOption);
  const filterTypeOptions = Object.keys(FilterDefaultParams) as FilterType[];
  const filterDescriptions: { [filterType in FilterType]: string } = {
    collection: "Selects apps that are in a certain Steam Collection.",
    installed: "Selects apps that are installed/uninstalled.",
    regex: "Selects apps whose titles match a regular expression.",
    friends: "Selects apps that are also owned by any/all listed friends.",
    tags: "Selects apps that have any/all specific tags.",
    whitelist: "Selects apps that are added to the list.",
    blacklist: "Selects apps that are not added to the list.",
    merge: "Selects apps that pass a subgroup of filters.",
    platform: "Selects Steam or non-Steam apps.",
    "deck compatibility": "Selects apps that have a specific Steam Deck compatibilty status.",
    "review score": "Selects apps that are greater/less than the provided metacritic/steam review score.",
    "time played": "Selects apps that have a play time greater/less than the provided time.",
    "size on disk": "Selects apps that have an install size greater/less than the provided size.",
    "release date": "Selects apps that were released before/after the provided date.",
    "last played": "Selects apps that were last played before/after the provided date."
  }

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
        <div className="tab-master-filter-select">
          {filterTypeOptions.map((filterType: FilterType) => {
            return (
              <Focusable
                focusWithinClassName="gpfocuswithin"
                onActivate={() => {}}
                style={{ width: "100%", margin: 0, marginBottom: "10px", padding: 0 }}
                onOKButton={() => handleSelect(filterType)}
              >
                <div
                  className={achievementClasses.AchievementListItemBase}
                  style={{ display: "flex", flexDirection: "column", padding: "0.5em", height: "60px" }}
                >
                  <div className="entry-label">{filterType.split(" ").map((word: string) => capitalizeFirstLetter(word)).join(" ")}</div>
                  <div className="entry-desc">{filterDescriptions[filterType]}</div>
                </div>
              </Focusable>
            );
          })}
        </div>
      </ModalRoot>
    </>
  );
};

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
    <DialogButton onOKActionDescription={"Change Filter Type"} onOKButton={showFilterSelection} onClick={showFilterSelection}>
      {selected}
    </DialogButton>
  )
};
