import { DropdownProps, SingleDropdownOption, showContextMenu, Menu, MenuItem, showModal } from 'decky-frontend-lib';
import { ReactElement, VFC, useState, useEffect } from 'react';
import { BsThreeDots } from 'react-icons/bs';
import { CustomButtonProps, CustomButton } from './CustomButton';

export type BaseModalProps = {
  onSelectOption: (option: SingleDropdownOption) => void,
  rgOptions?: SingleDropdownOption[],
  selectedOption?: SingleDropdownOption['data'],
  closeModal?: () => void
}

export interface CustomDropdownProps extends Omit<DropdownProps, 'rgOptions' | 'onMenuWillOpen' | 'selectedOption' | 'contextMenuPositionOptions' | 'renderButtonValue'>, Omit<CustomButtonProps, 'audioSFX' | 'noAudio' | 'onClick' | 'children'> {
  /** An array of options to choose from */
  rgOptions?: SingleDropdownOption[];

  /** The selected option data */
  selectedOption?: SingleDropdownOption['data'];

  /** Whether or not the selection label should be centered @default false */
  labelCenter?: boolean;

  /** A string to always show in place of the selected option's label */
  labelOverride?: string;

  /** Whether or not the selection dropdown arrow should be removed @default false */
  noDropdownIcon?: boolean;

  /** An element to use a replacement for the selection dropdown icon */
  customDropdownIcon?: ReactElement;

  /** A custom modal to use to select options instead of the default context menu */
  useCustomModal?: VFC<BaseModalProps>;

  /** CSS style for the selection label div */
  labelStyle?: React.CSSProperties;

  /** CSS style for the selection label div when it has changed */
  labelChangedStyle?: React.CSSProperties;
}

/** CSS class names for CustomDropdown component */
export enum CustomDropdownClasses {
  topLevel = 'custom-dropdown-container',
  label = 'custom-dropdown-label',
  selectionChanged = 'selection-changed'
}

/** A dropdown component with many customizable options */
export const CustomDropdown: VFC<CustomDropdownProps> = ({
  rgOptions,
  selectedOption: selectedOptionData,
  style,
  labelStyle,
  labelChangedStyle,
  containerClassName,
  labelOverride,
  strDefaultLabel,
  labelCenter,
  menuLabel,
  noDropdownIcon,
  customDropdownIcon,
  focusMode,
  transparent,
  onChange,
  useCustomModal: CustomModal,
  onMenuOpened,
  ...buttonProps
}) => {
  const icon = customDropdownIcon ?? (CustomModal ? <BsThreeDots style={{ margin: 'auto' }} /> : <svg style={{ height: '1em', margin: 'auto' }} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 36 36" fill="none"><path d="M17.98 26.54L3.20996 11.77H32.75L17.98 26.54Z" fill="currentColor"></path></svg>);
  const [selected, setSelected] = useState<SingleDropdownOption | undefined>(rgOptions?.find(option => option.data === selectedOptionData));
  const [changed, setChanged] = useState(false);

  useEffect(() => {
    if (changed) {
      setTimeout(() => setChanged(false), 15);
    }
  }, [changed]);

  useEffect(() => {
    if (selected?.data !== selectedOptionData) {
      setChanged(true);
      setSelected(rgOptions?.find(option => option.data === selectedOptionData));
    }
  }, [selectedOptionData, rgOptions?.length]);


  const onSelect = (option: SingleDropdownOption) => {
    setChanged(true);
    setSelected(option);
    onChange?.(option);
  };

  const showDefaultMenu = () => {
    showContextMenu(<Menu label={menuLabel ?? ''} >
      {rgOptions?.map(option =>
        <MenuItem selected={option === selected} onClick={() => onSelect(option)}>
          {option.label}
        </MenuItem>)}
    </Menu>);
    onMenuOpened?.();
  };

  return (
    <CustomButton
      containerClassName={addClasses(CustomDropdownClasses.topLevel, containerClassName)}
      style={{ padding: '10px 16px', ...style }}
      noAudio={true}
      focusMode={focusMode}
      transparent={transparent}
      onClick={() => {
        CustomModal ? showModal(
          <CustomModal
            onSelectOption={(option) => onSelect(option)}
            selectedOption={selected?.data}
            rgOptions={rgOptions}
          />
        ) : rgOptions && showDefaultMenu();
      }}
      {...buttonProps}
    >
      <div style={{ display: 'flex', overflow: 'hidden' }}>
        <div style={{ overflow: 'hidden', flex: 'auto' }}>
          <div style={Object.assign({ textAlign: labelCenter ? 'center' : 'left', minHeight: '20px' }, changed ? labelChangedStyle : labelStyle)} className={addClasses(CustomDropdownClasses.label, changed && CustomDropdownClasses.selectionChanged)}>
            {labelOverride ?? selected?.label ?? strDefaultLabel}
          </div>
        </div>
        {!noDropdownIcon && (
          <div style={{ display: 'flex', marginLeft: '1ch', flex: 'none' }}>
            {icon}
          </div>
        )}
      </div>
    </CustomButton>
  );
};

/** Utility function to join strings for CSS class names omitting invalid values */
function addClasses(...strings: any[]) {
  return strings.filter(string => string).join(' ');
}
