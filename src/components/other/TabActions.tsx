import { MenuItem, showModal, Menu, showContextMenu, DialogButton } from '@decky/ui'
import { VFC } from 'react'
import { FaEllipsisH } from 'react-icons/fa'
import { TabMasterManager, CustomTabContainer } from '@state'
import { showModalDuplicateTab, showModalEditTab } from '../modals/EditTabModal'
import { DestructiveModal } from '../generic/DestructiveModal'
import { showAddCollectionModal } from '../modals/AddCollectionModal'
import { trans_string as t } from '@utils'

interface TabActionsContextMenuProps {
    tabContainer: TabContainer
    tabMasterManager: TabMasterManager
}

/**
 * The context menu for Tab Actions.
 */
export const TabActionsContextMenu: VFC<TabActionsContextMenuProps> = ({ tabContainer, tabMasterManager }) => {
    const menuItems = [
        <MenuItem onSelected={() => tabMasterManager.hideTab(tabContainer.id)}>{t('LABEL_HIDE_TAB', 'Hide')}</MenuItem>,
    ]

    if (tabContainer.filters) {
        menuItems.unshift(
            <MenuItem
                onClick={() => {
                    const customTab = tabContainer as CustomTabContainer
                    customTab.buildCollection()

                    showAddCollectionModal(customTab.collection.allApps)
                }}
            >
                {t('LABEL_SNAPSHOT_TAB', 'Snapshot')}
            </MenuItem>
        )

        menuItems.unshift(
            <MenuItem onSelected={() => showModalDuplicateTab(tabContainer as CustomTabContainer, tabMasterManager)}>
                {t('LABEL_DUPLICATE_TAB', 'Duplicate')}
            </MenuItem>
        )

        menuItems.unshift(
            <MenuItem onSelected={() => showModalEditTab(tabContainer as CustomTabContainer, tabMasterManager)}>
                {t('LABEL_EDIT_TAB', 'Edit')}
            </MenuItem>
        )

        menuItems.push(
            <MenuItem
                onSelected={() => {
                    if (tabContainer.filters) {
                        showModal(
                            <DestructiveModal
                                onOK={() => {
                                    tabMasterManager.deleteTab(tabContainer.id)
                                }}
                                strTitle={t('TITLE_ALL_CAPS_WARNING', 'WARNING!')}
                            >
                                {t(
                                    'MESSAGE_DELETE_CANT_BE_UNDONE',
                                    "Are you sure you want to delete this Tab? This can't be undone."
                                )}
                            </DestructiveModal>
                        )
                    }
                }}
            >
                {t('LABEL_DELETE_TAB', 'Delete')}
            </MenuItem>
        )
    }
    return <Menu label={t('LABEL_TAB_ACTIONS', 'Actions')}>{menuItems}</Menu>
}

interface TabActionButtionProps {
    tabContainer: TabContainer
    tabMasterManager: TabMasterManager
}

/**
 * The Tab Action button.
 */
export const TabActionsButton: VFC<TabActionButtionProps> = props => {
    const onClick = () => {
        showContextMenu(<TabActionsContextMenu {...props} />)
    }
    return (
        <DialogButton
            style={{
                height: '40px',
                minWidth: '40px',
                width: '40px',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                padding: '10px',
                marginRight: '8px',
            }}
            onClick={onClick}
            onOKButton={onClick}
            onOKActionDescription={t('LABEL_OPEN_TAB_OPTIONS', 'Open tab options')}
        >
            <FaEllipsisH />
        </DialogButton>
    )
}
