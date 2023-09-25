import { findModule } from 'decky-frontend-lib';

type GamepadContextMenuClasses = Record<
  "duration-app-launch" |
  "BasicContextMenuModal" |
  "BasicContextMenuHeader" |
  "BasicContextMenuHeaderShrinkableSpacing" |
  "BasicContextMenuContainer" |
  "slideInAnimation" |
  "contextMenu" |
  "contextMenuContents" |
  "hasSubMenu" |
  "contextMenuFade" |
  "contextMenuItem" |
  "active" |
  "Selected" |
  "Focused" |
  "Positive" |
  "Emphasis" |
  "Destructive" |
  "Capitalized" |
  "MenuSectionHeader" |
  "UpperCase" |
  "SubMenu" |
  "ContextMenuSeparator" |
  "Label" |
  "Arrow" |
  "ItemFocusAnim-darkerGrey-nocolor" |
  "ItemFocusAnim-darkerGrey" |
  "ItemFocusAnim-darkGrey" |
  "ItemFocusAnim-grey" |
  "ItemFocusAnimBorder-darkGrey" |
  "ItemFocusAnim-green" |
  "focusAnimation" |
  "hoverAnimation",
  string>;

export const gamepadContextMenuClasses: GamepadContextMenuClasses = findModule(
  (mod) => typeof mod === 'object' && mod?.BasicContextMenuModal?.includes('gamepadcontextmenu')
);
