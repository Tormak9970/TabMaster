import { MenuItem, showModal, ConfirmModal, Menu, showContextMenu, DialogButton } from "decky-frontend-lib"
import { VFC } from "react"
import { FaEllipsisH } from "react-icons/fa"
import { TabMasterManager } from "../state/TabMasterManager"
import { EditTabModal, EditableTabSettings } from "./modals/EditTabModal"

interface TabActionsContextMenuProps {
  tabContainer: TabContainer,
  tabMasterManager: TabMasterManager
}

/**
 * The context menu for Tab Actions.
 */
export const TabActionsContextMenu: VFC<TabActionsContextMenuProps> = ({ tabContainer, tabMasterManager }) => {
  const menuItems = [
    <MenuItem onSelected={() => tabMasterManager.hideTab(tabContainer.id)}>
      Hide
    </MenuItem>
  ];

  if (tabContainer.filters) {
    menuItems.unshift(
      <MenuItem onSelected={() => {
        showModal(
          <EditTabModal
            onConfirm={(tabId: string | undefined, updatedTabSettings: EditableTabSettings) => {
              tabMasterManager.updateCustomTab(tabId!, updatedTabSettings);
            }}
            tabId={tabContainer.id}
            tabTitle={tabContainer.title}
            tabFilters={tabContainer.filters!}
            tabMasterManager={tabMasterManager}
            filtersMode={tabContainer.filtersMode!}
            includesHidden={tabContainer.includesHidden!}
          />
        )
      }}>
        Edit
      </MenuItem>
    );

    menuItems.push(
      <MenuItem onSelected={() => {
        if (tabContainer.filters) {
          showModal(
            <ConfirmModal
              className={'tab-master-destructive-modal'}
              onOK={() => {
                tabMasterManager.deleteTab(tabContainer.id);
              }}
              bDestructiveWarning={true}
              strTitle="WARNING!"
            >
              Are you sure you want to delete this Tab? This can't be undone.
            </ConfirmModal>
          )
        }
      }}>
        Delete
      </MenuItem>
    );
  }
  return (
    <Menu label="Actions">
      {menuItems}
    </Menu>
  )
}

interface TabActionButtionProps {
  tabContainer: TabContainer,
  tabMasterManager: TabMasterManager
}

/**
 * The Tab Action button.
 */
export const TabActionsButton: VFC<TabActionButtionProps> = (props) => {
  const onClick = () => {
    showContextMenu(<TabActionsContextMenu {...props} />);
  }
  return (
    <DialogButton
      style={{ height: "40px", minWidth: "40px", width: "40px", display: "flex", justifyContent: "center", alignItems: "center", padding: "10px" }}
      onClick={onClick}
      onOKButton={onClick}
      onOKActionDescription="Open tab options"
    >
      <FaEllipsisH />
    </DialogButton>
  )
}
