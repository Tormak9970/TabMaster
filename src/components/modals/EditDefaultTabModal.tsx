import { ConfirmModal, ToggleField, showModal } from '@decky/ui'
import { useState } from 'react'
import { TabMasterManager } from '@state'
import { trans_string as t } from '@utils'
import { TabContainer } from '@types'

type EditDefaultTabModalProps = {
    closeModal?: () => void
    tabContainer: TabContainer
    tabMasterManager: TabMasterManager
}

/**
 * The modal for editing one of Steam's default tabs.
 */
export const EditDefaultTabModal = ({ closeModal, tabContainer, tabMasterManager }: EditDefaultTabModalProps) => {
    const [flattenGroups, setFlattenGroups] = useState<boolean>(tabContainer.flattenGroups ?? false)

    function onSave() {
        tabMasterManager.updateDefaultTab(tabContainer.id, flattenGroups)
        closeModal!()
    }

    return (
        <ConfirmModal
            onCancel={closeModal}
            onEscKeypress={closeModal}
            strTitle={`${t('TITLE_MODIFYING_TAB', 'Modifying')}: ${tabContainer.title}`}
            onOK={onSave}
            strOKButtonText={t('LABEL_SAVE_TAB', 'Save')}
        >
            <ToggleField
                label={t('LABEL_FLATTEN_SORT_GROUPS', 'Disable grouping')}
                description={t(
                    'DESCRIPTION_FLATTEN_SORT_GROUPS',
                    'Keep the sort order but remove the groups some sorts add, like Last Played or Size on Disk'
                )}
                checked={flattenGroups}
                onChange={checked => setFlattenGroups(checked)}
            />
        </ConfirmModal>
    )
}

/**
 * Whether a default tab shows an app grid that can be flattened. The Collections tab shows collections instead.
 * @param tabContainer The default tab.
 */
export function canEditDefaultTab(tabContainer: TabContainer) {
    return !tabContainer.filters && tabContainer.id !== 'Collections'
}

/**
 * Function to show the EditDefaultTabModal.
 * @param tabContainer The default tab to edit.
 * @param tabMasterManager TabMasterManager instance.
 */
export function showModalEditDefaultTab(tabContainer: TabContainer, tabMasterManager: TabMasterManager) {
    showModal(<EditDefaultTabModal tabContainer={tabContainer} tabMasterManager={tabMasterManager} />)
}
