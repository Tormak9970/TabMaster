import { MenuItem, showModal, ConfirmModal, Menu, showContextMenu, DialogButton } from "decky-frontend-lib"
import { VFC } from "react"
import { FaEllipsisH } from "react-icons/fa"
import { TabMasterManager } from "../classes/TabMasterManager"
import { EditTabModal, EditableTabSettings } from "./EditTabModal"

interface TabActionsContextMenuProps {
    tabContainer: TabContainer
    tabMasterManager: TabMasterManager
}

export const TabActionsContextMenu: VFC<TabActionsContextMenuProps> = ({ tabContainer, tabMasterManager }) => {
    const menuItems = [
        <MenuItem onSelected={() => tabMasterManager.hideTab(tabContainer.id)}>
            Hide
        </MenuItem>
    ]

    if (tabContainer.filters) {
        menuItems.unshift(
            <MenuItem onSelected={() => {
                showModal(
                    <EditTabModal
                        onConfirm={(tabId: string | undefined, updatedTabSettings: EditableTabSettings) => {
                            tabMasterManager.updateCustomTab(tabId!, updatedTabSettings)
                        }}
                        tabId={tabContainer.id}
                        tabTitle={tabContainer.title}
                        tabFilters={tabContainer.filters!}
                        closeModal={() => { }}
                    />
                )
            }}>
                Edit
            </MenuItem>)

        menuItems.push(
            <MenuItem onSelected={() => {
                if (tabContainer.filters) {
                    showModal(
                        <ConfirmModal
                            onOK={() => {
                                tabMasterManager.deleteTab(tabContainer.id)
                            }}
                            bDestructiveWarning={true}
                        >
                            Are you sure you want to delete this shortcut?
                        </ConfirmModal>
                    )
                }
            }}>
                Delete
            </MenuItem>)
    }
    return (
        <Menu label="Actions">
            {menuItems}
        </Menu>
    )
}

interface TabActionButtionProps {
    tabContainer: TabContainer
    tabMasterManager: TabMasterManager
}

export const TabActionsButton: VFC<TabActionButtionProps> = (props) => {
    const onClick = () => {
        showContextMenu(<TabActionsContextMenu {...props} />);
    }
    return (
        <DialogButton
            style={{ height: "40px", minWidth: "40px", width: "40px", display: "flex", justifyContent: "center", alignItems: "center", padding: "10px" }}
            onClick={onClick}
            onOKButton={onClick}
        >
            <FaEllipsisH />
        </DialogButton>
    )
}