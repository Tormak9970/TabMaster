import { showModal } from '@decky/ui'
import { DestructiveModal } from '../generic/DestructiveModal'
import { TrashButton } from '../generic/TrashButton'

type GuardedDeleteButtonProps = {
    title: string
    confirmationMessage: string
    onDelete: () => void
}

export const GuardedDeleteButton = (props: GuardedDeleteButtonProps) => {
    const { title, confirmationMessage, onDelete } = props

    return (
        <TrashButton
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
