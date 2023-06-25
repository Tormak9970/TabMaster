import { DialogButton, Dropdown, DropdownOption, Field, FieldProps, Focusable } from "decky-frontend-lib";
import { useState, VFC, useEffect } from "react";
import { FaTimes } from "react-icons/fa";
import { MultiSelectStyles } from "./styles/MultiSelectStyles";

/**
 * The properties for the MultiSelectedOption component.
 * @param option This entry's option.
 * @param onRemove The function to run when the user deselects this option.
 * @param fieldProps Optional fieldProps for this entry.
 */
type MultiSelectedOptionProps = {
  option: DropdownOption,
  fieldProps?: FieldProps,
  onRemove: (option: DropdownOption) => void
}

/**
 * A component for multi select dropdown options.
 * @param props The MultiSelectedOptionProps for this component.
 * @returns A MultiSelectedOption component.
 */
const MultiSelectedOption:VFC<MultiSelectedOptionProps> = ({ option, fieldProps, onRemove }) => {
  return (
    <Field label={option.label} {...fieldProps} >
      <Focusable style={{ display: 'flex', width: '100%', position: 'relative' }}>
        <DialogButton style={{ height: "40px", minWidth: "40px", width: "40px", display: "flex", justifyContent: "center", alignItems: "center", padding: "10px" }} onClick={() => onRemove(option)} onOKButton={() => onRemove(option)} onOKActionDescription={`Remove ${option.label}`}>
          <FaTimes />
        </DialogButton>
      </Focusable>
    </Field>
  );
}


export type MultiSelectProps = {
  options: DropdownOption[],
  selected: DropdownOption[],
  fieldLabel: string,
  dropdownLabel?: string,
  mode: string
  onChange?: (selected:DropdownOption[], mode: string) => void,
  maxOptions?: number,
  fieldProps?: FieldProps,
}

/**
 * A component for multi select dropdown menus.
 * @returns A MultiSelect component.
 */
export const MultiSelect:VFC<MultiSelectProps> = ({ options, selected, fieldLabel, dropdownLabel, mode = "and", onChange = () => {}, maxOptions, fieldProps }) => {
  const [ sel, setSel ] = useState(selected);
  const [ available, setAvailable ] = useState(options.filter((opt) => !selected.includes(opt)));
  const [ innerMode, setInnerMode ] = useState(mode);

  const [ dropdownSelected, setDropdownSelected ] = useState({ label: dropdownLabel, data: "" });

  const modes = [
    { label: "And", data: "and" },
    { label: "Or", data: "or" },
  ];

  useEffect(() => {
    const avail = options.filter((opt) => !sel.includes(opt));
    setAvailable(avail);
    setDropdownSelected({
      label: avail.length == 0 ? "All selected" : (!!maxOptions && sel.length == maxOptions ? "Max selected" : dropdownLabel) as string,
      data: ""
    });
    onChange(sel, innerMode);
  }, [sel]);

  const onRemove = (option: DropdownOption) => {
    const ref = [...sel];
    ref.splice(sel.indexOf(option), 1);
    selected = ref;
    setSel(selected);
  }

  const onModeChange = (option: DropdownOption) => {
    setInnerMode(option.data);
    onChange(sel, innerMode);
  }

  const onSelectedChange = (option: DropdownOption) => {
    // option = undefined
    selected = [...sel, JSON.parse(JSON.stringify(option))];
    setSel(selected);
  }

  return (
    <Focusable>
      <MultiSelectStyles />
      <Field
        label={fieldLabel}
        description={
          <div className="multi-select">
            <Focusable style={{
              width: "100%",
              display: "flex",
              flexDirection: "row",
              marginBottom: "5px"
            }}>
              <Focusable style={{
                width: "calc(100% - 100px)"
              }}>
                <Dropdown rgOptions={available} selectedOption={dropdownSelected} onChange={onSelectedChange} strDefaultLabel={dropdownLabel} focusable={true} disabled={available.length == 0 || (!!maxOptions && selected.length == maxOptions)} />
              </Focusable>
              <Focusable style={{
                marginLeft: "10px",
                width: "90px"
              }}>
                <Dropdown rgOptions={modes} selectedOption={innerMode} onChange={onModeChange} focusable={true} />
              </Focusable>
            </Focusable>
          </div>
        }
      />
      <div style={{ width: "100%", marginBottom: "14px" }}>
        {sel.map((option) => <MultiSelectedOption option={option} onRemove={onRemove} fieldProps={fieldProps} />)}
      </div>
    </Focusable>
  );
}