import { Focusable, SingleDropdownOption } from '@decky/ui'
import { Fragment, VFC, useEffect, useMemo, useState } from 'react'
import { BiChevronRight } from 'react-icons/bi'
import { SoundEffect } from '../../lib/GamepadUIAudio'
import { CustomButton, CustomButtonFocusMode } from './CustomButton'
import { CustomDropdown, CustomDropdownProps } from './CustomDropdown'

const defaultSFX = 'deck_ui_tab_transition_01.wav'
const defaultInvalidSFX = 'deck_ui_bumper_end_02.wav'
const altSFX = 'deck_ui_misc_01.wav'
const altInvalidSFX = 'deck_ui_message_toast.wav'

/** Props for EnhancedSelector component */
export interface EnhancedSelectorProps extends Omit<
    CustomDropdownProps,
    | 'disabled'
    | 'focusable'
    | 'useCustomModal'
    | 'noDropdownIcon'
    | 'style'
    | 'labelStyle'
    | 'labelChangedStyle'
    | 'className'
    | 'focusClassName'
    | 'containerClassNaem'
> {
    /** An array of options to choose from */
    rgOptions: SingleDropdownOption[]

    /** The selected option data */
    selectedOption: SingleDropdownOption['data']

    /** Whether the selection should stop when its at the end/ beginning of the list or cycle around @default false */
    noWrapAround?: boolean

    /** Whether or not selection box should be focusable @default false */
    focusDropdown?: boolean

    /** Whether or not to show the dropdown arrow on the selection box @default false */
    showDropdownIcon?: boolean

    /** Sets the width for the selection box, overrides everything else (should be a valid html width) @default auto */
    selectionBoxWidth?: string

    /** Sets the component to take full width of of it containing element @default false */
    fullWidth?: boolean

    /** Sets the spacing between elements (should be a valid html size) @default '12px' */
    spacing?: string

    /** Sets the width for the buttons (should be a valid html width) @default '40px' */
    buttonWidth?: string

    /** Which elements should be transparent @default none */
    transparencyMode?: EnhancedSelectorTransparencyMode

    /** When to use focus ring instead of highlight when focusing an element @default never */
    focusRingMode?: EnhancedSelectorFocusRingMode

    /** Whether or not to use the alternate sound effects @default false */
    alternateSFX?: boolean

    /** Sound effect override to use for the normal button sound*/
    sfxMain?: SoundEffect

    /** Sound effect override to use for buttons when at the end/ beginning of the list and noWrapAround is true*/
    sfxInvalid?: SoundEffect

    /** Whether or not the selection box should animate when shifting the selection @default false */
    animate?: boolean

    /** The duration in ms of the selection box animation @default 300 */
    animationDuration?: number

    /** Whether or not the EnhancedSelector should be disabled */
    disabled?: boolean
}

/** Mode for which elements should have transparency in EnhancedSelector component*/
export enum EnhancedSelectorTransparencyMode {
    /** No elements have transparency*/
    none,

    /** Selection box has transparency, buttons don't*/
    selection,

    /** All elements have transparency */
    all,

    /** Buttons have transparency, selection box doesn't */
    buttons,
}

/** Mode for when to use focus ring vs highlight when focusing an element in EnhancedSelector component */
export enum EnhancedSelectorFocusRingMode {
    /** Always use highlight and not ring */
    never,

    /** Use ring for transparent elements and highlight otherwise */
    transparentOnly,

    /** Always use ring and not highlight */
    always,
}

/** CSS class names for EnhanceSelector component */
export enum EnhancedSelectorClasses {
    topLevel = 'enhanced-selector',
    dirIcon = 'direction-icon',
    dirButton = 'direction-button',
    right = 'direction-right',
    left = 'direction-left',
}

/** A configurable component that allows to select from a list of options by cycling with buttons or from a dropdown menu. */
export const EnhancedSelector: VFC<EnhancedSelectorProps> = ({
    rgOptions,
    selectedOption: selectedOptionData,
    onChange,
    noWrapAround,
    showDropdownIcon,
    focusDropdown,
    transparencyMode,
    fullWidth,
    selectionBoxWidth,
    spacing,
    buttonWidth,
    focusRingMode,
    alternateSFX,
    sfxMain,
    sfxInvalid,
    animate,
    animationDuration,
    disabled,
    ...dropdownProps
}) => {
    type direction = -1 | 1 // -1: left/negative, 1: right/postive

    const noWrap = noWrapAround ?? false
    const setWidth = selectionBoxWidth !== undefined
    const transparency = transparencyMode ?? EnhancedSelectorTransparencyMode.none
    const transparentButtons =
        transparency === EnhancedSelectorTransparencyMode.buttons ||
        transparency === EnhancedSelectorTransparencyMode.all
    const transparentSelectionBox =
        transparency === EnhancedSelectorTransparencyMode.selection ||
        transparency === EnhancedSelectorTransparencyMode.all
    const ringMode = focusRingMode ?? EnhancedSelectorFocusRingMode.never

    const mainSfx = (sfxMain ?? alternateSFX) ? altSFX : defaultSFX
    const invalidSfx = (sfxInvalid ?? alternateSFX) ? altInvalidSFX : defaultInvalidSFX

    const getFocusRingMode = (transparent: boolean) => {
        switch (ringMode) {
            case EnhancedSelectorFocusRingMode.always:
                return CustomButtonFocusMode.ring
            case EnhancedSelectorFocusRingMode.never:
                return CustomButtonFocusMode.highlight
            case EnhancedSelectorFocusRingMode.transparentOnly:
                return transparent ? CustomButtonFocusMode.ring : CustomButtonFocusMode.highlight
        }
    }

    const selectionBoxFocusMode = getFocusRingMode(transparentSelectionBox)
    const buttonFocusMode = getFocusRingMode(transparentButtons)

    const incomingIndex = useMemo(() => {
        const index = rgOptions.findIndex(option => option.data === selectedOptionData)
        return index !== -1 ? index : 0
    }, [selectedOptionData, rgOptions.length])

    const [selectedIndex, setSelecetedIndex] = useState(incomingIndex)
    const [animateLabelStart, setAnimateLabelStart] = useState<React.CSSProperties>({})

    useEffect(() => {
        if (selectedIndex !== incomingIndex) setSelecetedIndex(incomingIndex)
    }, [selectedOptionData, rgOptions.length])

    const getSFX = (dir: direction) =>
        noWrap && ((selectedIndex === rgOptions.length - 1 && dir === 1) || (selectedIndex === 0 && dir === -1))
            ? invalidSfx
            : mainSfx

    const getNewIndex = (current: number, dir: direction) => {
        const max = rgOptions.length
        if (dir > 0) {
            let newIndex = (current + 1) % max
            return newIndex === 0 && noWrap ? max - 1 : newIndex
        } else {
            let newIndex = current - 1
            return newIndex < 0 ? (!noWrap ? max - 1 : 0) : newIndex
        }
    }

    const shiftIndex = (dir: direction) => {
        const newIndex = getNewIndex(selectedIndex, dir)
        if (newIndex !== selectedIndex) {
            setSelecetedIndex(newIndex)
            animate && setAnimateLabelStart({ transform: `translate(${100 * dir}%)` })
            onChange?.(rgOptions[newIndex])
        }
    }

    const onDropdownSelect = (option: { label: string; data: any }) => {
        const index = rgOptions.indexOf(option)
        setSelecetedIndex(index)
        animate && setAnimateLabelStart({})
        onChange?.(rgOptions[index])
    }

    const buttonMargin = spacing ? spacing : '12px'

    const buttonStyle = {
        width: buttonWidth ? buttonWidth : '40px',
        minHeight: '40px',
        minWidth: 'initial',
        padding: 'initial',
    }

    const buttonIconStyle = {
        height: '1.5em',
        width: '1.5em',
        display: 'block',
        margin: 'auto',
    }

    return (
        <>
            <Focusable
                className={`${EnhancedSelectorClasses.topLevel}`}
                style={{ display: 'flex', justifyContent: 'center' }}
            >
                <CustomButton
                    audioSFX={getSFX(-1)}
                    onClick={() => shiftIndex(-1)}
                    className={addClasses(EnhancedSelectorClasses.dirButton, EnhancedSelectorClasses.left)}
                    containerStyle={{ marginRight: buttonMargin }}
                    transparent={transparentButtons}
                    focusMode={buttonFocusMode}
                    style={buttonStyle}
                    disabled={disabled}
                    focusable={!disabled}
                >
                    <BiChevronRight
                        style={Object.assign({ transform: 'rotate(180deg)' }, buttonIconStyle)}
                        className={EnhancedSelectorClasses.dirIcon}
                    />
                </CustomButton>
                <CustomDropdown
                    rgOptions={rgOptions}
                    selectedOption={rgOptions?.[selectedIndex]?.data}
                    focusable={focusDropdown === true && !disabled}
                    onChange={onDropdownSelect}
                    focusMode={selectionBoxFocusMode}
                    transparent={transparentSelectionBox}
                    noDropdownIcon={!showDropdownIcon}
                    containerStyle={fullWidth && !setWidth ? { width: '100%' } : {}}
                    style={setWidth ? { width: selectionBoxWidth, minWidth: selectionBoxWidth } : { minWidth: '100px' }}
                    labelStyle={animate ? { transition: `transform ${animationDuration ?? 300}ms ease-out` } : {}}
                    labelChangedStyle={animateLabelStart}
                    disabled={disabled}
                    {...dropdownProps}
                />
                <CustomButton
                    audioSFX={getSFX(1)}
                    onClick={() => shiftIndex(1)}
                    className={addClasses(EnhancedSelectorClasses.dirButton, EnhancedSelectorClasses.right)}
                    containerStyle={{ marginLeft: buttonMargin }}
                    transparent={transparentButtons}
                    focusMode={buttonFocusMode}
                    style={buttonStyle}
                    disabled={disabled}
                    focusable={!disabled}
                >
                    <BiChevronRight style={buttonIconStyle} className={EnhancedSelectorClasses.dirIcon} />
                </CustomButton>
            </Focusable>
        </>
    )
}

/** Utility function to join strings for CSS class names omitting invalid values */
function addClasses(...strings: any[]) {
    return strings.filter(string => string).join(' ')
}
