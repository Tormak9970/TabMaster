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
  GamepadEvent,
  GamepadButton
} from "decky-frontend-lib";
import { VFC, useEffect, useMemo, useRef, useState } from "react";
import { IconType } from "react-icons/lib";
import { FixedSizeList as List } from "react-window";
import AutoSizer from "react-virtualized-auto-sizer";
import { FaMagnifyingGlass } from "react-icons/fa6";
import { BaseModalProps, CustomDropdown } from "../generic/CustomDropdown";
import { ListSearchModalStyles } from "../styles/ListSearchModalStyles";
import { BiSolidDownArrow, BiSolidUpArrow } from "react-icons/bi";

export type ListSearchModalProps = {
  rgOptions: SingleDropdownOption[],
  entryLabel: string,
  onSelectOption: (option: SingleDropdownOption) => void,
  determineEntryIcon: (entry?: any) => IconType,
  closeModal?: () => void
}

const iconStyles = {
  paddingRight: "10px",
  width: "1em",
};

export const ListSearchModal: VFC<ListSearchModalProps> = ({ rgOptions: list, entryLabel, determineEntryIcon, onSelectOption, closeModal }: ListSearchModalProps) => {
  const [query, setQuery] = useState("");
  const [filteredList, setFilteredList] = useState(list);
  const [renderTopArrow, setRenderTopArrow] = useState(false);
  const [renderBottomArrow, setRenderBottomArrow] = useState(true);
  const searchRef = useRef<any>(null);
  const listRef = useRef<List>(null);

  useEffect(() => {
    setFilteredList(list.filter((entry) => (entry.label as string).toLowerCase().includes(query.toLowerCase())));
  }, [query]);

  function onItemsRendered({ visibleStartIndex, visibleStopIndex }: { visibleStartIndex: number, visibleStopIndex: number }) {
    if (!renderTopArrow && visibleStartIndex !== 0) {
      setRenderTopArrow(true);
    } else if (renderTopArrow && visibleStartIndex === 0) {
      setRenderTopArrow(false);
    }

    if (!renderBottomArrow && visibleStopIndex !== filteredList.length - 1) {
      setRenderBottomArrow(true);
    } else if (renderBottomArrow && visibleStopIndex === filteredList.length - 1) {
      setRenderBottomArrow(false);
    }
  }

  const ListEntry = useMemo<(props: { index: number, style: any}) => JSX.Element >(() => ({ index, style }) => {
    const EntryIcon = determineEntryIcon(filteredList[index]);
    return (
      <div style={style} className="post">
        <DialogButton
          key={`${filteredList[index].label}`}
          style={{ borderRadius: "unset", margin: "0", padding: "10px", scrollMarginTop: "0" }}
          onClick={() => {
            onSelectOption(filteredList[index]);
            closeModal!();
          }}
        >
          <div style={{ display: "flex", flexDirection: "row", alignItems: "center" }}>
            <EntryIcon style={iconStyles} />
            <Marquee>{filteredList[index].label}</Marquee>
          </div>
        </DialogButton>
      </div>
    );
  }, [filteredList]);
  
  const actionButtonProps = { 
    onButtonDown: (evt: GamepadEvent) => {
      if (evt.detail.button === GamepadButton.SELECT) {
        searchRef?.current?.Focus?.();
        searchRef?.current?.element?.click?.();
      }    
    },
    actionDescriptionMap: { [GamepadButton.SELECT]: 'Search'}
  }

  return (
    <div className="tab-master-list-search-modal">
      <ListSearchModalStyles />
      <ModalRoot onCancel={closeModal} onEscKeypress={closeModal}>
        <DialogBody>
          <DialogControlsSection>
            <Focusable flow-children="right" style={{ display: "flex" }} {...actionButtonProps} >
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
                  placeholder={`Search ${entryLabel}...`}
                  onChange={(e) => {
                    listRef.current?.scrollToItem(0);
                    setQuery(e.target.value);
                  }}
                  style={{ height: "100%" }}
                  //@ts-ignore
                  ref={searchRef}
                />
              </div>
            </Focusable>
          </DialogControlsSection>
          <DialogControlsSection style={{ marginTop: "1em" }}>
            <div style={{ width: "100%", position: "relative" }}>
              <div className="more-above-arrow">
                {renderTopArrow && <BiSolidUpArrow style={{ fontSize: "0.8em", color: "#343945" }} />}
              </div>
              <PanelSection title={`${entryLabel} - ${filteredList.length}`}>
                <Focusable
                  style={{ display: "flex", gap: "4px", flexDirection: "column", height: "48.7vh", overflow: "scroll" }}
                  key={filteredList.length}
                  {...actionButtonProps}
                >
                  <AutoSizer>
                    {/* @ts-ignore */}
                    {({ height, width }) => (
                      <List
                        width={width}
                        height={height}
                        itemCount={filteredList.length}
                        itemSize={44}
                        onItemsRendered={onItemsRendered}
                        overscanCount={10}
                        ref={listRef}
                      >
                        {ListEntry}
                      </List>
                    )}
                  </AutoSizer>
                </Focusable>
              </PanelSection>
              <div className="more-below-arrow">
                {renderBottomArrow && <BiSolidDownArrow style={{ fontSize: "0.8em", color: "#343945" }} />}
              </div>
            </div>
          </DialogControlsSection>
        </DialogBody>
      </ModalRoot>
    </div>
  );
};

export type ListSearchTriggerProps = {
  entryLabel: string,
  labelOverride: string,
  options: SingleDropdownOption[],
  onChange: (option: SingleDropdownOption) => void,
  TriggerIcon: IconType,
  determineEntryIcon: (entry?: any) => IconType,
  disabled: boolean
}

export function ListSearchTrigger({ entryLabel, labelOverride, options, onChange, TriggerIcon, determineEntryIcon, disabled }: ListSearchTriggerProps) {
  const ModalWrapper: VFC<BaseModalProps> = ({ onSelectOption, rgOptions, closeModal }: BaseModalProps) => {
    return <ListSearchModal entryLabel={entryLabel} rgOptions={rgOptions!} onSelectOption={onSelectOption} determineEntryIcon={determineEntryIcon} closeModal={closeModal} />
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

export type ListSearchDropdownProps = {
  entryLabel: string,
  rgOptions: SingleDropdownOption[],
  selectedOption: any,
  onChange: (option: SingleDropdownOption) => void,
  TriggerIcon: IconType,
  determineEntryIcon: (entry?: any) => IconType,
  disabled?: boolean
}

export function ListSearchDropdown({ entryLabel, rgOptions, selectedOption, onChange, TriggerIcon, determineEntryIcon, disabled }: ListSearchDropdownProps) {
  const [selected, setSelected] = useState<SingleDropdownOption>(rgOptions.find((option: SingleDropdownOption) => option.data === selectedOption)!);

  function onChangeWrapper(data: SingleDropdownOption) {
    setSelected(data);
    onChange(data);
  }

  return (
    <ListSearchTrigger
      entryLabel={entryLabel}
      options={rgOptions}
      onChange={onChangeWrapper}
      labelOverride={selected.label as string}
      disabled={disabled ?? false}
      TriggerIcon={TriggerIcon}
      determineEntryIcon={determineEntryIcon}
    />
  );
}
