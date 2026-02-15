import { DialogButton } from '@decky/ui'
import { VFC } from 'react'
import { FaTrash } from 'react-icons/fa6'

interface TrashButtonProps {
    onClick: () => void
}

export const TrashButton: VFC<TrashButtonProps> = ({ onClick }) => {
    return (
        <DialogButton
            onClick={onClick}
            style={{ minWidth: '45px', padding: '10px 16px', minHeight: '40px', display: 'flex' }}
        >
            <FaTrash size='.9em' style={{ margin: 'auto', flex: 'auto' }} />
        </DialogButton>
    )
}
