import { DialogButton, Dropdown, DropdownOption, Field, FieldProps, Focusable } from "decky-frontend-lib";
import { useState, VFC, useEffect } from "react";
import { FaTimes } from "react-icons/fa";

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

/**
 * The properties for the MultiSelect component.
 * @param options The list of all possible options for the component.
 * @param selected The list of currently selected options.
 * @param label The label of the dropdown.
 * @param onChange Optional callback function to run when selected values change.
 * @param maxOptions Optional prop to limit the amount of selectable options.
 * @param fieldProps Optional fieldProps for the MultiSelect entries.
 */
export type MultiSelectProps = {
  options: DropdownOption[],
  selected: DropdownOption[],
  label: string,
  onChange?: (selected:DropdownOption[]) => void,
  maxOptions?: number,
  fieldProps?: FieldProps,
}

/**
 * A component for multi select dropdown menus.
 * @param props The MultiSelectProps for this component.
 * @returns A MultiSelect component.
 */
export const MultiSelect:VFC<MultiSelectProps> = ({ options, selected, label, onChange = () => {}, maxOptions, fieldProps }) => {
  const [ sel, setSel ] = useState(selected);
  const [ available, setAvailable ] = useState(options.filter((opt) => !selected.includes(opt)));
  const [ dropLabel, setDropLabel ] = useState(label);

  useEffect(() => {
    const avail = options.filter((opt) => !sel.includes(opt));
    setAvailable(avail);
    setDropLabel(avail.length == 0 ? "All selected" : (!!maxOptions && sel.length == maxOptions ? "Max selected" : label));
    onChange(sel);
  }, [sel]);

  const onRemove = (option: DropdownOption) => {
    const ref = [...sel];
    ref.splice(sel.indexOf(option), 1);
    selected = ref;
    setSel(selected);
  }

  const onSelectedChange = (option: DropdownOption) => {
    selected = [...sel, option];
    setSel(selected);
  }

  return (
    <Focusable>
      <div style={{ width: "100%", marginBottom: "14px" }}>
        {sel.map((option) => <MultiSelectedOption option={option} onRemove={onRemove} fieldProps={fieldProps} />)}
      </div>
      <Dropdown rgOptions={available} selectedOption={dropLabel} onChange={onSelectedChange} strDefaultLabel={dropLabel} focusable={true} disabled={available.length == 0 || (!!maxOptions && selected.length == maxOptions)} />
    </Focusable>
  );
}