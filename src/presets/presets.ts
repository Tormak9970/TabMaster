import { FilterType, TabFilterSettings, compatCategoryToLabel } from '../components/filters/Filters';
import { IncludeCategories } from '../lib/Utils';

type TabPreset = {
  title: string,
  filters: TabFilterSettings<FilterType>[],
  filtersMode: LogicalMode,
  categoriesToInclude: number; //include categories bit field
};

const presetDefines = {

  collection: (collectionId: string, collectionName: string) => {
    return {
      title: collectionName,
      filters: [{ type: 'collection', inverted: false, params: { id: collectionId, name: collectionName } }],
      filtersMode: 'and',
      categoriesToInclude: IncludeCategories.games
    };
  },

  'all games': () => {
    return {
      title: 'All Games',
      filters: [
        { type: 'installed', inverted: false, params: { installed: true } },
        { type: 'installed', inverted: false, params: { installed: false } }
      ],
      filtersMode: 'or',
      categoriesToInclude: IncludeCategories.games
    };
  },

  installation: (installed: boolean) => {
    return {
      title: installed ? 'Installed' : 'Not Installed',
      filters: [
        { type: 'installed', inverted: false, params: { installed: installed } }
      ],
      filtersMode: 'and',
      categoriesToInclude: IncludeCategories.games
    };
  },

  'deck compatibility': (compat: number) => {
    return {
      title: compatCategoryToLabel(compat),
      filters: [{ type: 'deck compatibility', inverted: false, params: { category: compat } }],
      filtersMode: 'and',
      categoriesToInclude: IncludeCategories.games
    };
  },

  'platform': (platform: SteamPlatform) => {
    return {
      title: platform === 'nonSteam' ? 'Non Steam' : 'Steam',
      filters: [{ type: 'platform', inverted: false, params: { platform: platform } }],
      filtersMode: 'and',
      categoriesToInclude: IncludeCategories.games
    };
  },

  music: () => {
    return {
      title: 'Soundtracks',
      filters: [
        { type: 'installed', inverted: false, params: { installed: true } },
        { type: 'installed', inverted: false, params: { installed: false } }
      ],
      filtersMode: 'or',
      categoriesToInclude: IncludeCategories.music
    };
  },

  software: () => {
    return {
      title: 'Software',
      filters: [
        { type: 'installed', inverted: false, params: { installed: true } },
        { type: 'installed', inverted: false, params: { installed: false } }
      ],
      filtersMode: 'or',
      categoriesToInclude: IncludeCategories.software
    };
  }

};

export type PresetName = keyof typeof presetDefines;
export type PresetOptions<Name extends keyof typeof presetDefines> = Parameters<typeof presetDefines[Name]>;

export const presetKeys = Object.keys(presetDefines);

export function getPreset<Name extends PresetName>(presetName: Name, ...presetOptions: PresetOptions<Name>) {
  return (presetDefines[presetName] as (...options: any[]) => TabPreset)(...presetOptions);
}

