import { Dropdown, DropdownOption, Field, Focusable } from "decky-frontend-lib";
import { useState, VFC, useEffect } from "react";
import { MultiSelectStyles } from "../styles/MultiSelectStyles";
import { MultiSelectedOption } from "./MultiSelectOption";
import { MultiSelectProps } from "./MultiSelect";


export interface ModeMultiSelectProps extends Omit<MultiSelectProps, 'onChange'> {
  mode: string,
  onChange?: (selected:DropdownOption[], mode: string) => void
}

/**
 * A component for multi select dropdown menus that supports modes.
 */
export const ModeMultiSelect:VFC<ModeMultiSelectProps> = ({ options, selected, fieldLabel, dropdownLabel, mode = "and", onChange = () => {}, maxOptions, fieldProps }) => {
  const [ sel, setSel ] = useState(selected);
  const [ available, setAvailable ] = useState(options.filter((opt) => !selected.includes(opt)));
  const [ innerMode, setInnerMode ] = useState(mode);

  const [ dropdownSelected, setDropdownSelected ] = useState({ label: dropdownLabel, data: "" });

  const modes = [
    { label: "And", data: "and" },
    { label: "Or", data: "or" },
  ];

  useEffect(() => {
    const avail = options.filter((opt) => !sel.some((selOpt) => selOpt.data === opt.data));
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
    selected = [...sel, option];
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
                {/* @ts-ignore */}
                <Dropdown rgOptions={modes} selectedOption={innerMode} onChange={onModeChange} focusable={true} onOKActionDescription="Change the filter mode" />
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