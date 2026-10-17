import { showModal } from '@decky/ui'
import { DestructiveModal } from '../generic/DestructiveModal'
import { TrashButton } from '../generic/TrashButton'
import { CSSProperties } from 'react'

type GuardedDeleteButtonProps = {
    title: string
    confirmationMessage: string
    onDelete: () => void
    style?: CSSProperties
}

export const GuardedDeleteButton = (props: GuardedDeleteButtonProps) => {
    const { title, confirmationMessage, onDelete, style } = props

    return (
        <TrashButton
            style={style}
            onClick={() => {
                showModal(
                    <DestructiveModal onOK={onDelete} strTitle={title}>
                        {confirmationMessage}
                    </DestructiveModal>
                )
            }}
        />
    )
}
