import { Menu, MenuGroup, MenuItem } from 'decky-frontend-lib';
import { VFC, Fragment } from 'react';
import { PresetName, presetKeys } from '../../presets/presets';
import { capitalizeEachWord } from '../../lib/Utils';
import { TabMasterManager } from '../../state/TabMasterManager';
import { compatCategoryToLabel } from '../filters/Filters';

interface PresetMenuProps {
  tabMasterManager: TabMasterManager;
}

export const PresetMenu: VFC<PresetMenuProps> = ({ tabMasterManager }) => {
  return <Menu label='Preset Tabs'>
    <PresetMenuItems tabMasterManager={tabMasterManager} />
  </Menu>;
};

interface PresetMenuItemsProps {
  tabMasterManager: TabMasterManager;
}

export const PresetMenuItems: VFC<PresetMenuItemsProps> = ({ tabMasterManager }) => {
  return <>
    {presetKeys.map(name => {
      const presetName = name as PresetName;
      switch (presetName) {
        case 'collection':
          return (
            <MenuGroup label='Collection'>
              {collectionStore.userCollections.map(({ displayName, id }: { displayName: string; id: string; }) =>
                <MenuItem
                  onClick={() => tabMasterManager.createPresetTab(presetName, id, displayName)}
                >
                  {displayName}
                </MenuItem>
              )}
            </MenuGroup>
          );
        case 'installation':
          const getOnClick = (installed: boolean) => () => tabMasterManager.createPresetTab(presetName, installed);
          return (
            <MenuGroup label='Installation'>
              <MenuItem onClick={getOnClick(true)}>
                Installed
              </MenuItem>
              <MenuItem onClick={getOnClick(false)}>
                Not Installed
              </MenuItem>
            </MenuGroup>
          );
        case 'deck compatibility':
          return (
            <MenuGroup label='Deck Compatibility'>
              {[0, 1, 2, 3].map((level) =>
                <MenuItem onClick={() => tabMasterManager.createPresetTab(presetName, level)}>
                  {compatCategoryToLabel(level)}
                </MenuItem>
              )}
            </MenuGroup>
          );
        default:
          return (
            <MenuItem onClick={() => tabMasterManager.createPresetTab(presetName)} >{capitalizeEachWord(presetName)}</MenuItem>
          );
      }
    })}
  </>;
};
