import { DialogButton } from '@decky/ui'
import { CSSProperties } from 'react'
import { FaTrash } from 'react-icons/fa6'

interface TrashButtonProps {
    onClick: () => void
    style?: CSSProperties
}

export const TrashButton = ({ onClick, style }: TrashButtonProps) => {
    return (
        <DialogButton
            onClick={onClick}
            style={{ minWidth: '45px', padding: '10px 16px', minHeight: '40px', display: 'flex', ...(style ?? {}) }}
        >
            <FaTrash size='.9em' style={{ margin: 'auto', flex: 'auto' }} />
        </DialogButton>
    )
}
