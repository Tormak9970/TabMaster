import { ConfirmModal } from '@decky/ui'
import { VFC } from 'react'
import { getESortByLabel } from '../../hooks/useSortingMenuItems'

interface SortOverrideMessageProps {
    eSortBy: number
    closeModal?: () => void
}

/**
 * The message modal to display when sort method is being overriden
 */
export const SortOverrideMessage: VFC<SortOverrideMessageProps> = ({ eSortBy, closeModal }) => {
    return (
        <ConfirmModal strTitle={`Sort By: ${getESortByLabel(eSortBy)}`} bAlertDialog={true} closeModal={closeModal}>
            The sorting method is overridden by TabMaster for this tab. Set 'Sort apps by' to 'default' in this tabs
            settings if you would like it to use library sorting.
        </ConfirmModal>
    )
}
