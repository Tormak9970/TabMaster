import { ConfirmModal } from '@decky/ui'
import { getESortByLabel } from '@hooks'
import { trans_string as t } from '@utils'

interface SortOverrideMessageProps {
    eSortBy: number
    closeModal?: () => void
}

/**
 * The message modal to display when sort method is being overriden
 */
export const SortOverrideMessage = ({ eSortBy, closeModal }: SortOverrideMessageProps) => {
    return (
        <ConfirmModal
            strTitle={`${t('Library_SortCollectionBy', 'Sort By', true)}: ${getESortByLabel(eSortBy)}`}
            bAlertDialog={true}
            closeModal={closeModal}
        >
            {t(
                'MESSAGE_SORTING_METHOD_IS_OVERRIDDEN_BY_TAB',
                "The sorting method is overridden by TabMaster for this tab. Set 'Sort apps by' to 'default' in this tabs settings if you would like it to use library sorting."
            )}
        </ConfirmModal>
    )
}
