import {
  DialogBody,
  DialogButton,
  DialogControlsSection,
  Focusable,
  Marquee,
  ModalRoot,
  PanelSection,
  SingleDropdownOption,
  TextField,
  quickAccessControlsClasses
} from "decky-frontend-lib";
import { VFC, useEffect, useState } from "react";
import { IconType } from "react-icons/lib";
import { FixedSizeList as List } from "react-window";
import AutoSizer from "react-virtualized-auto-sizer";
import { FaMagnifyingGlass } from "react-icons/fa6";
import { BaseModalProps, CustomDropdown } from "../generic/CustomDropdown";

export type ListSearchModalProps = {
  rgOptions: SingleDropdownOption[],
  entryLabel: string,
  onSelectOption: (option: SingleDropdownOption) => void,
  EntryIcon: IconType,
  closeModal?: () => void
}

const iconStyles = {
  paddingRight: "10px",
  width: "1em",
};

export const ListSearchModal: VFC<ListSearchModalProps> = ({ rgOptions: list, entryLabel, EntryIcon, onSelectOption, closeModal }: ListSearchModalProps) => {
  const [query, setQuery] = useState("");
  const [filteredList, setFilteredList] = useState(list);

  useEffect(() => {
    setFilteredList(list.filter((entry) => (entry.label as string).toLowerCase().includes(query)));
  }, [query]);

  const ListEntry = ({ index, style }: { index: number, style: any}) => (
    <div style={style} className="post">
      <DialogButton
        key={`${filteredList[index].label}`}
        style={{ borderRadius: "unset", margin: "0", padding: "10px" }}
        onClick={() => {
          onSelectOption(filteredList[index]);
          closeModal!();
        }}
      >
        <div style={{ display: "flex", flexDirection: "row", alignItems: "flex-start" }}>
          <EntryIcon style={iconStyles} />
          <Marquee>{filteredList[index].label}</Marquee>
        </div>
      </DialogButton>
    </div>
  );

  return (
    <ModalRoot onCancel={closeModal} onEscKeypress={closeModal}>
      {/* TODO: abstract this to a component */}
      <style>{`
        .list-search-modal .${quickAccessControlsClasses.PanelSection} {
          margin: 0px;
          padding: 0px;
        }
        .list-search-modal .${quickAccessControlsClasses.PanelSection}:first-of-type {
          margin: 0px;
        }
      `}</style>
      <DialogBody className="list-search-modal">
        <DialogControlsSection>
          <Focusable flow-children="right" style={{ display: "flex" }}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                minWidth: "unset",
                width: "40px",
                borderRadius: "unset",
                margin: "0",
                padding: "10px",
                paddingLeft: "0px"
              }}
            >
              <FaMagnifyingGlass />
            </div>
            <div style={{ width: "100%" }}>
              <TextField
                value={query}
                onChange={(e) => { setQuery(e.target.value); }}
                style={{ height: "100%" }}
              />
            </div>
          </Focusable>
        </DialogControlsSection>
        <DialogControlsSection style={{ marginTop: "1em" }}>
          <PanelSection title={`${entryLabel} - ${filteredList.length}`}>
            <Focusable
              style={{ display: "flex", gap: "4px", flexDirection: "column", height: "48.7vh", overflow: "scroll" }}
            >
              <AutoSizer>
                {({ height, width }) => (
                  <List
                    width={width}
                    height={height}
                    itemCount={filteredList.length}
                    itemSize={44}
                  >
                    {ListEntry}
                  </List>
                )}
              </AutoSizer>
            </Focusable>
          </PanelSection>
        </DialogControlsSection>
      </DialogBody>
    </ModalRoot>
  );
};

export type ListSearchTrigger = {
  entryLabel: string,
  labelOverride: string,
  options: SingleDropdownOption[],
  onChange: (option: SingleDropdownOption) => void,
  TriggerIcon: IconType,
  EntryIcon: IconType,
  disabled: boolean
}

export function ListSearchTrigger({ entryLabel, labelOverride, options, onChange, TriggerIcon, EntryIcon, disabled }: ListSearchTrigger) {
  const ModalWrapper: VFC<BaseModalProps> = ({ onSelectOption, rgOptions, closeModal }: BaseModalProps) => {
    return <ListSearchModal entryLabel={entryLabel} rgOptions={rgOptions!} onSelectOption={onSelectOption} EntryIcon={EntryIcon} closeModal={closeModal} />
  }
  
  return (
    <CustomDropdown
      rgOptions={options}
      labelOverride={labelOverride}
      customDropdownIcon={<TriggerIcon style={{ margin: 'auto' }} />}
      onChange={onChange}
      useCustomModal={ModalWrapper}
      disabled={disabled}
    />
  );
}
