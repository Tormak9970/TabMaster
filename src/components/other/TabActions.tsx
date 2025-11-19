import { MenuItem, showModal, Menu, showContextMenu, DialogButton } from "@decky/ui"
import { VFC } from "react"
import { FaEllipsisH } from "react-icons/fa"
import { TabMasterManager } from "../../state/TabMasterManager"
import { showModalEditTab } from "../modals/EditTabModal"
import { DestructiveModal } from '../generic/DestructiveModal';
import { CustomTabContainer } from '../../state/CustomTabContainer';

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
      <MenuItem onSelected={() => showModalEditTab(tabContainer as CustomTabContainer, tabMasterManager)}>
        Edit
      </MenuItem>
    );

    menuItems.push(
      <MenuItem onSelected={() => {
        if (tabContainer.filters) {
          showModal(
            <DestructiveModal
              onOK={() => {
                tabMasterManager.deleteTab(tabContainer.id);
              }}
              strTitle="WARNING!"
            >
              Are you sure you want to delete this Tab? This can't be undone.
            </DestructiveModal>
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
      style={{ height: "40px", minWidth: "40px", width: "40px", display: "flex", justifyContent: "center", alignItems: "center", padding: "10px", marginRight: "8px" }}
      onClick={onClick}
      onOKButton={onClick}
      onOKActionDescription="Open tab options"
    >
      <FaEllipsisH />
    </DialogButton>
  )
}
