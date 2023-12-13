import { FilterType, TabFilterSettings } from '../components/filters/Filters';
import { IncludeCategories } from '../lib/Utils';

type TabPreset = {
  filters: TabFilterSettings<FilterType>[],
  filtersMode: LogicalMode,
  categoriesToInclude: number; //include categories bit field
};

const presetDefines = {

  collection: (collectionId: string, collectionName: string) => {
    return {
      filters: [{ type: 'collection', inverted: false, params: { id: collectionId, name: collectionName } }],
      filtersMode: 'and',
      categoriesToInclude: IncludeCategories.games
    };
  },

  'all games': () => {
    return {
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
      filters: [
        { type: 'installed', inverted: false, params: { installed: installed } }
      ],
      filtersMode: 'and',
      categoriesToInclude: IncludeCategories.games
    };
  },

  'deck compatibility': (compat: number) => {
    return {
      filters: [{ type: 'deck compatibility', inverted: false, params: { category: compat } }],
      filtersMode: 'and',
      categoriesToInclude: IncludeCategories.games
    };
  },

  'platform': (platform: SteamPlatform) => {
    return {
      filters: [{ type: 'platform', inverted: false, params: { platform: platform } }],
      filtersMode: 'and',
      categoriesToInclude: IncludeCategories.games
    };
  },

  soundtracks: () => {
    return {
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
      filters: [
        { type: 'installed', inverted: false, params: { installed: true } },
        { type: 'installed', inverted: false, params: { installed: false } }
      ],
      filtersMode: 'or',
      categoriesToInclude: IncludeCategories.software
    };
  },
  'micro sd card': (card?: string) => {
    return {
      filters: [
        { type: 'sd card', inverted: false, params: { card: card } },
      ],
      filtersMode: 'or',
      categoriesToInclude: IncludeCategories.games
    };
  }
};

export type PresetName = keyof typeof presetDefines;
export type PresetOptions<Name extends keyof typeof presetDefines> = Parameters<typeof presetDefines[Name]>;

export const presetKeys = Object.keys(presetDefines) as PresetName[];

export function getPreset<Name extends PresetName>(presetName: Name, ...presetOptions: PresetOptions<Name>) {
  return (presetDefines[presetName] as (...options: any[]) => TabPreset)(...presetOptions);
}
