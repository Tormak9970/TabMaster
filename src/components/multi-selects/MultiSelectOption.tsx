import { DialogButton, DropdownOption, Field, FieldProps, Focusable } from '@decky/ui'
import { VFC } from 'react'
import { FaTimes } from 'react-icons/fa'

type MultiSelectedOptionProps = {
    option: DropdownOption
    fieldProps?: FieldProps
    onRemove: (option: DropdownOption) => void
}

/**
 * A component for multi select dropdown options.
 */
export const MultiSelectedOption: VFC<MultiSelectedOptionProps> = ({ option, fieldProps, onRemove }) => {
    return (
        <Field label={option.label} {...fieldProps}>
            <Focusable style={{ display: 'flex', width: '100%', position: 'relative' }}>
                <DialogButton
                    style={{
                        height: '40px',
                        minWidth: '40px',
                        width: '40px',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        padding: '10px',
                    }}
                    onClick={() => onRemove(option)}
                    onOKButton={() => onRemove(option)}
                    onOKActionDescription={`Remove ${option.label}`}
                >
                    <FaTimes />
                </DialogButton>
            </Focusable>
        </Field>
    )
}
