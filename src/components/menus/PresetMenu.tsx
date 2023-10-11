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
  return <Menu label='Quick Tabs'>
    <PresetMenuItems tabMasterManager={tabMasterManager} />
  </Menu>;
};

interface PresetMenuItemsProps {
  tabMasterManager: TabMasterManager;
}

export const PresetMenuItems: VFC<PresetMenuItemsProps> = ({ tabMasterManager }) => {

  function getActionDescription(name: string) {
    return { onOKActionDescription: `Create Tab "${name}"` };
  }

  return <>
    {presetKeys.map(name => {
      const presetName = name as PresetName;
      switch (presetName) {
        case 'collection':
          return (
            <MenuGroup label='Collection'>
              {collectionStore.userCollections.map(({ displayName, id }: { displayName: string; id: string; }) =>
                <MenuItem onClick={() => tabMasterManager.createPresetTab(presetName, id, displayName)} {...getActionDescription(displayName)}>
                  {displayName}
                </MenuItem>
              )}
            </MenuGroup>
          );
        case 'installation':
          return (
            <MenuGroup label='Installation'>
              {['Installed', 'Not Installed'].map(name =>
                <MenuItem onClick={() => tabMasterManager.createPresetTab(presetName, name === 'Installed')} {...getActionDescription(name)}>
                  {name}
                </MenuItem>)}
            </MenuGroup>
          );
        case 'deck compatibility':
          return (
            <MenuGroup label='Deck Compatibility'>
              {[0, 1, 2, 3].map(level =>
                <MenuItem onClick={() => tabMasterManager.createPresetTab(presetName, level)} {...getActionDescription(compatCategoryToLabel(level))}>
                  {compatCategoryToLabel(level)}
                </MenuItem>
              )}
            </MenuGroup>
          );
        case 'platform':
          return (
            <MenuGroup label='Platform'>
              {(['steam', 'nonSteam'] as SteamPlatform[]).map(platform =>
                <MenuItem onClick={() => tabMasterManager.createPresetTab(presetName, platform)} {...getActionDescription(name)}>
                  {platform === 'nonSteam' ? 'Non Steam' : 'Steam'}
                </MenuItem>)}
            </MenuGroup>
          );
        default:
          return (
            <MenuItem onClick={() => tabMasterManager.createPresetTab(presetName)} {...getActionDescription(presetName)}>
              {capitalizeEachWord(presetName)}
            </MenuItem>
          );
      }
    })}
  </>;
};
