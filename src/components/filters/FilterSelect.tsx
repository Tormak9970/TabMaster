import { Fragment, VFC, useState } from "react";
import { DialogButton, Focusable, ModalRoot, showModal } from "decky-frontend-lib";
import { FilterDefaultParams, FilterType } from "./Filters";
import { capitalizeFirstLetter } from "../../lib/Utils";

interface FilterSelectModalProps {
  selectedOption: FilterType,
  onSelect: (selected: FilterType) => void,
  closeModal?: () => void;
}

const FilterSelectModal: VFC<FilterSelectModalProps> = ({ selectedOption, onSelect, closeModal }) => {
  const [selected, setSelected] = useState<FilterType>(selectedOption);
  const filterTypeOptions = Object.keys(FilterDefaultParams) as FilterType[];
  const filterDescriptions: { [filterType in FilterType]: string } = {
    collection: "Selects games that are in a certain Steam Collection.",
    installed: "Selects games that are installed or not installed.",
    regex: "Selects games whose titles match a regular expression.",
    friends: "Selects games that are also owned by any/ all friends.",
    tags: "Selects games that have any/ all specific tags.",
    whitelist: "Selects games that are added to the list.",
    blacklist: "Selects games that are not added to the list.",
    merge: "Selects games that pass a subgroup of filters. They behave like filters grouped in a tab, allowing you to set whether a game needs to pass all, or any of the filters in the subgroup.",
    platform: "Selects Steam or non-Steam games.",
    "deck compatibility": "Selects games that have a specific Steam Deck compatibilty status.",
    metacritic: "",
    "steam score": "",
    "time played": "",
    "size on disk": ""
  }

  function handleSelect(selectedFilter: FilterType) {
    setSelected(selectedFilter);
    onSelect(selectedFilter);
    closeModal!();
  }

  return (
    <>
      {/* TODO: abstract this styling to its own component later. */}
      {/* TODO: use static classes */}
      <style>{`
        .tab-master-filter-select {
          width: 100%;
          height: auto;
        }

        /* .tab-master-filter-select button.gamepaddialog_Button_1kn70.DialogButton.gpfocus {
          background-color: #23262e;
        } */

        .tab-master-filter-select .gpfocuswithin .achievementslist_AchievementListItemBase_2Kmn7 {
          background: #767a8773;
        }

        .tab-master-filter-select .entry-label {
          font-size: 24px;
          text-align: initial;
        }

        .tab-master-filter-select .entry-desc {
          font-size: 16px;
          text-align: initial;
        }
      `}</style>
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
            // TODO: this needs to be a static class. hard coded for testing
            return (
              <Focusable
                focusWithinClassName="gpfocuswithin"
                onActivate={() => {}}
                style={{ width: "100%", margin: 0, marginBottom: "10px", padding: 0 }}
                onOKButton={() => handleSelect(filterType)}
              >
                <div
                  className="achievementslist_AchievementListItemBase_2Kmn7"
                  style={{ display: "flex", flexDirection: "column", padding: "0.5em"  }}
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
