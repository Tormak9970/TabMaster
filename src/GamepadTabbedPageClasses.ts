import { findModule } from "decky-frontend-lib";

type GamepadTabbedPageClasses = Record<
  | 'duration-app-launch'
  | 'headerHeight'
  | 'contentPadding'
  | 'GamepadTabbedPage'
  | 'TabHeaderRowWrapper'
  | 'Floating'
  | 'TabRow'
  | 'TabRowTabs'
  | 'BleedGlyphs'
  | 'TabsRowScroll'
  | 'FixCenterAlignScroll'
  | 'Tab'
  | 'Selected'
  | 'HasAddon'
  | 'RightAddon'
  | 'TabTitle'
  | 'LeftAddon'
  | 'TabCount'
  | 'Active'
  | 'TabBadge'
  | 'TabCountBadge'
  | 'TabRowSpacer'
  | 'Glyphs'
  | 'Show'
  | 'TabContents'
  | 'ContentTransition'
  | 'TabContentsScroll'
  | 'Right'
  | 'Enter'
  | 'EnterActive'
  | 'Exit'
  | 'ExitActive'
  | 'Left'
  | 'TabIcon',
  string>;


export const gamepadTabbedPageClasses: GamepadTabbedPageClasses = findModule(
  (mod) => typeof mod === 'object' && mod?.GamepadTabbedPage?.includes('gamepadtabbedpage_'),
);
