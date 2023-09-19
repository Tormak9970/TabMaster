import { Menu, MenuItem, showModal, Focusable, MenuGroup, ReorderableEntry, ReorderableList, MenuItemProps } from 'decky-frontend-lib';
import { FC, Fragment, VFC, useState } from 'react';
import { TabMasterManager } from '../../state/TabMasterManager';
import { FaSteam } from 'react-icons/fa6';
import { TabIdEntryType } from '../..';
import { TabMasterContextProvider, useTabMasterContext } from '../../state/TabMasterContext';
import { EditTabModal, EditableTabSettings } from '../modals/EditTabModal';
import { IncludeCategories } from '../../lib/Utils';
import { LibraryMenuStyles } from '../styles/LibraryMenuStyles';
import { DestructiveModal } from '../generic/DestructiveModal';
import { gamepadContextMenuClasses } from '../../lib/GamepadContextMenuClasses';
import { PresetMenuItems } from './PresetMenu';

export interface LibraryMenuProps {
  closeMenu: () => void;
  selectedTabId: string;
  tabMasterManager: TabMasterManager;
}


/**
 * The library context menu for configuring tab master.
 */
export const LibraryMenu: VFC<LibraryMenuProps> = ({ closeMenu, selectedTabId, tabMasterManager }) => {
  //@ts-ignore
  return <Menu label={
    <div>
      <h3 style={{ margin: 0 }}>Tab Master</h3>
      <small>{tabMasterManager.getTabs().tabsMap.get(selectedTabId)?.title}</small>
    </div>
  }>
    <LibraryMenuStyles />
    <TabMasterContextProvider tabMasterManager={tabMasterManager} >
      <LibraryMenuItems selectedTabId={selectedTabId} closeMenu={closeMenu} />
    </TabMasterContextProvider>
  </Menu>;
};

interface LibraryMenuItemsProps extends Omit<LibraryMenuProps, 'tabMasterManager'> { }

/**
 * The menu items for the library context menu (in a separate component to manage state correctly)
 */
const LibraryMenuItems: VFC<LibraryMenuItemsProps> = ({ selectedTabId, closeMenu }) => {
  const { tabsMap, visibleTabsList, hiddenTabsList, tabMasterManager } = useTabMasterContext();
  const tabTitle = tabMasterManager.getTabs().tabsMap.get(selectedTabId)?.title;
  const isCustomTab = !!tabsMap.get(selectedTabId)?.filters;

  return <>
    <MenuItem
      //@ts-ignore
      className={gamepadContextMenuClasses.Positive}
      onOKActionDescription='Add Tab'
      onClick={() => {
        showModal(
          <EditTabModal
            onConfirm={(_: any, tabSettings: EditableTabSettings) => {
              tabMasterManager.createCustomTab(tabSettings.title, visibleTabsList.length, tabSettings.filters, tabSettings.filtersMode, tabSettings.categoriesToInclude);
              closeMenu();
            }}
            tabFilters={[]}
            tabMasterManager={tabMasterManager}
            filtersMode="and"
            categoriesToInclude={IncludeCategories.games}
          />
        );
      }}
    >
      Add Tab
    </MenuItem>
    <MenuGroup
      //@ts-ignore
      className={gamepadContextMenuClasses.Emphasis}
      label='Quick Tabs'
    >
      <PresetMenuItems tabMasterManager={tabMasterManager} />
    </MenuGroup>
    <div className={gamepadContextMenuClasses.ContextMenuSeparator} />
    <MenuGroup label='Reorder Tabs'>
      <Focusable style={{ width: '240px', background: "#23262e", margin: '0' }} className='tab-master-library-menu-reorderable-group' onOKActionDescription=''>
        <ReorderableList<TabIdEntryType>
          entries={visibleTabsList.map((tabContainer) => {
            return {
              label:
                <div className="tab-label-cont">
                  <div className="tab-label">{tabContainer.title}</div>
                  {tabContainer.filters ? <Fragment /> : <FaSteam />}
                </div>,
              position: tabContainer.position,
              data: { id: tabContainer.id }
            };
          })}
          onSave={(entries: ReorderableEntry<TabIdEntryType>[]) => {
            const currentOrder = visibleTabsList.sort((a, b) => a.position - b.position).map(entry => entry.id);
            const newOrder = entries.map(entry => entry.data!.id);

            if (JSON.stringify(currentOrder) !== JSON.stringify(newOrder)) tabMasterManager.reorderTabs(newOrder);
          }}
        />
      </Focusable>
    </MenuGroup>
    {hiddenTabsList.length > 0 &&
      <MenuGroup label='Unhide Tabs' disabled={hiddenTabsList.length === 0}>
        <HiddenItems onSelectTab={id => tabMasterManager.showTab(id)} hiddenTabsList={hiddenTabsList} />
      </MenuGroup>
    }
    <div className={gamepadContextMenuClasses.ContextMenuSeparator} />
    {isCustomTab &&
      <MenuItem
        onOKActionDescription={`Edit "${tabTitle}"`}
        onClick={() => {
          const tabContainer = tabsMap.get(selectedTabId)!;
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
              categoriesToInclude={tabContainer.categoriesToInclude!}
            />
          );
        }}
      >
        Edit
      </MenuItem>
    }
    <MenuItem onClick={() => tabMasterManager.hideTab(selectedTabId)} onOKActionDescription={`Hide "${tabTitle}"`}>
      Hide
    </MenuItem>
    {isCustomTab &&
      <MenuItem
        onOKActionDescription={`Delete "${tabTitle}"`}
        //@ts-ignore
        className={gamepadContextMenuClasses.Destructive}
        onClick={() => {
          const closeModal = () => { };
          showModal(
            <DestructiveModal
              onOK={() => {
                tabMasterManager.deleteTab(selectedTabId);
                closeMenu();
              }}
              closeModal={closeModal}
              strTitle="WARNING!"
            >
              Are you sure you want to delete this Tab? This can't be undone.
            </DestructiveModal>
          );
        }}
      >
        Delete
      </MenuItem>
    }
  </>;
};

interface HiddenItemsProps {
  hiddenTabsList: TabContainer[];
  onSelectTab: (id: TabContainer['id']) => void;
}

/**
 * The group of hidden tab menu items
 */
const HiddenItems: VFC<HiddenItemsProps> = ({ hiddenTabsList, onSelectTab }) => {
  const [_refresh, setRefresh] = useState(true);
  return <>
    {hiddenTabsList.map(tabContainer =>
      <MenuItemNoClose
        onOKActionDescription='Unhide'
        onClick={() => {
          onSelectTab(tabContainer.id);
          setRefresh(refresh => !refresh);
        }}
      >
        {tabContainer.title}
      </MenuItemNoClose>
    )}
  </>;
};

interface MenuItemNoCloseProps extends Omit<MenuItemProps, 'bInteractableItem' | 'onSelected' | 'onMouseEnter' | 'onMoveRight' | 'selected' | 'bPlayAudio' | 'tone'> {
  className?: string;
}

/**
 * Menu items that won't automatically close the menu when clicking
 */
const MenuItemNoClose: FC<MenuItemNoCloseProps> = ({ onClick, disabled, className, children, ...props }) => {
  return <Focusable
    className={`${gamepadContextMenuClasses.contextMenuItem} contextMenuItem` + (className ? ` ${className}` : '') + (disabled ? ' disabled' : '')}
    focusClassName={gamepadContextMenuClasses.Focused}
    onActivate={disabled ? undefined : onClick}
    noFocusRing={true}
    {...props}
  >
    {children}
  </Focusable>;
};
