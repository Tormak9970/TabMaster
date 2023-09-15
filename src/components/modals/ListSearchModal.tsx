import {
  ControlsList,
  DialogBody,
  DialogButton,
  DialogControlsSection,
  DialogFooter,
  Dropdown,
  Focusable,
  Marquee,
  ModalRoot,
  SingleDropdownOption,
  TextField,
  ToggleField,
} from 'decky-frontend-lib';
import { Fragment, VFC, useEffect, useState } from "react";
import { IconType } from "react-icons";
import { FaMagnifyingGlass } from "react-icons/fa6";
import { BaseModalProps, CustomDropdown } from "../generic/CustomDropdown";

export type ListSearchModalProps = {
  rgOptions: SingleDropdownOption[],
  onSelectOption: (option: SingleDropdownOption) => void,
  EntryIcon: IconType,
  closeModal?: () => void
}

const iconStyles = {
  paddingRight: '10px',
  width: '1em',
};

export const ListSearchModal: VFC<ListSearchModalProps> = ({ rgOptions: list, EntryIcon, onSelectOption, closeModal }: ListSearchModalProps) => {
  const [query, setQuery] = useState("");
  const [filteredList, setFilteredList] = useState(list);

  useEffect(() => {
    setFilteredList(list.filter((entry) => (entry.label as string).includes(query)));
  }, [query]);

  return (
    // TODO: need to wrap this in a modal root
    <ModalRoot onCancel={closeModal} onEscKeypress={closeModal}>
      <DialogBody className="deckyFilePicker">
        <DialogControlsSection>
          <Focusable flow-children="right" style={{ display: 'flex', marginBottom: '1em' }}>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                minWidth: 'unset',
                width: '40px',
                borderRadius: 'unset',
                margin: '0',
                padding: '10px',
              }}
            >
              <FaMagnifyingGlass />
            </div>
            <div style={{ width: '100%' }}>
              <TextField
                value={query}
                onChange={(e) => { setQuery(e.target.value); }}
                style={{ height: '100%' }}
              />
            </div>
          </Focusable>
          {/* ! This comment block is where any controls will go. */}
          {/* <ControlsList alignItems="center" spacing="standard">
            <ToggleField
              highlightOnFocus={false}
              label={t('FilePickerIndex.files.show_hidden')}
              bottomSeparator="none"
              checked={showHidden}
              onChange={() => setShowHidden((x) => !x)}
            />
            <Dropdown rgOptions={sortOptions} selectedOption={sort} onChange={(x) => setSort(x.data)} />
            {validFileExtensions && (
              <DropdownMultiselect
                label={t('FilePickerIndex.files.file_type')}
                items={validExtsOptions}
                selected={selectedExts ? selectedExts : []}
                onSelect={handleExtsSelect}
              />
            )}
          </ControlsList> */}
        </DialogControlsSection>
        <DialogControlsSection style={{ marginTop: '1em' }}>
          <Focusable
            style={{ display: 'flex', gap: '.25em', flexDirection: 'column', height: '60vh', overflow: 'scroll' }}
          >
            {filteredList.map((entry) => {
                return (
                  <DialogButton
                    key={`${entry.label}`}
                    style={{ borderRadius: 'unset', margin: '0', padding: '10px' }}
                    onClick={() => {
                      onSelectOption(entry);
                      closeModal!();
                    }}
                  >
                    <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'flex-start' }}>
                      <EntryIcon style={iconStyles} />
                      <Marquee>{entry.label}</Marquee>
                    </div>
                    {/* ! This comment block is where any data we want to display will go. */}
                    {/* <div
                      style={{
                        display: 'flex',
                        opacity: 0.5,
                        fontSize: '.6em',
                        textAlign: 'left',
                        lineHeight: 1,
                        marginTop: '.5em',
                      }}
                    >
                      <span style={{ marginLeft: 'auto' }}>{new Date(file.modified * 1000).toLocaleString()}</span>
                    </div> */}
                  </DialogButton>
                );
              })}
          </Focusable>
        </DialogControlsSection>
      </DialogBody>
      {/* * Use this? */}
      {/* {!loading && error === FileErrorTypes.None && (
        <DialogFooter>
          <DialogButton
            className="Primary"
            style={{ marginTop: '10px', alignSelf: 'flex-end' }}
            onClick={() => {
              onSubmit({ path, realpath: listing.realpath });
              closeModal?.();
            }}
          >
            {fileSelType === FileSelectionType.FILE
              ? t('FilePickerIndex.file.select')
              : t('FilePickerIndex.folder.select')}
          </DialogButton>
        </DialogFooter>
      )} */}
      {/* {page * max < listing.total && (
        <DialogFooter>
          <DialogButton
            className="Primary"
            style={{ marginTop: '10px', alignSelf: 'flex-end' }}
            onClick={() => {
              setPage(page + 1);
            }}
          >
            {t('FilePickerIndex.folder.show_more')}
          </DialogButton>
        </DialogFooter>
      )} */}
    </ModalRoot>
  );
};

export type ListSearchTrigger = {
  labelOverride: string,
  options: SingleDropdownOption[],
  onChange: (option: SingleDropdownOption) => void,
  TriggerIcon: IconType,
  EntryIcon: IconType,
  disabled: boolean
}

export function ListSearchTrigger({ labelOverride, options, onChange, TriggerIcon, EntryIcon, disabled }: ListSearchTrigger) {
  const ModalWrapper: VFC<BaseModalProps> = ({ onSelectOption, rgOptions, closeModal }: BaseModalProps) => {
    return <ListSearchModal rgOptions={rgOptions!} onSelectOption={onSelectOption} EntryIcon={EntryIcon} closeModal={closeModal} />
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
