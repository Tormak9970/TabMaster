import { findModule, gamepadDialogClasses } from "decky-frontend-lib";
import { VFC } from "react";

type AchievementClasses = Record<
  "nAchievementHeight" |
  "nGlobalAchievementHeight" |
  "nAchievementsListTitleHeight" |
  "nAchievementGap" |
  "AchievementList" |
  "ListTitle" |
  "AchievementListItemBase" |
  "Container" |
  "Content" |
  "Right" |
  "Footer" |
  "AchievementTitle" |
  "AchievementDescription" |
  "AchievementGlobalPercentage" |
  "InBody" |
  "VerticalContent" |
  "UnlockDate" |
  "AlignEnd" |
  "ProgressBar" |
  "ProgressCount" |
  "AchievementContent" |
  "HiddenAchievementContent" |
  "FriendAchievementFooter" |
  "GlobalPercentage" |
  "UserUnlockDateTime" |
  "GlobalAchievementsListHeader" |
  "SearchField" |
  "Avatar" |
  "HeaderText" |
  "GlobalAchievementListItem" |
  "UnlockContainer" |
  "Info" |
  "Title" |
  "Description" |
  "Percent" |
  "ImageContainer" |
  "ProgressFill" |
  "SpoilerWarning" |
  "Hidden" |
  "ComparisonAchieverColumn" |
  "ComparisonAchieverInfo" |
  "ProgressContainer" |
  "ProgressLabel" |
  "Secondary" |
  "AvatarContainer" |
  "Unachieved",
  string
>;

type MainMenuAppRunningClasses = Record<
"duration-app-launch" |
"ScrollMask" |
"HideMask" |
"MainMenuAppRunning" |
"MenuOpen" |
"NavigationColumn" |
"ControllerColumnFocused" |
"NavColumnFocused" |
"NavigationBox" |
"NavigationMenuItem" |
"ItemFocusAnim-darkerGrey" |
"Active" |
"Disabled" |
"SwitchAppsTitle" |
"SelectableAppWindow" |
"ActiveDot" |
"NavigationMenuItemSeparator" |
"AppColumn" |
"FocusedColumn" |
"AppColumnContent" |
"ActiveContent" |
"CurrentGameBackground" |
"CurrentGameLogo" |
"OverlayAchievements" |
"Container" |
"OverlayGuides" |
"OverlayNotes" |
"OverlayInplaceBrowser" |
"ItemFocusAnim-darkerGrey-nocolor" |
"ItemFocusAnim-darkGrey" |
"ItemFocusAnim-grey" |
"ItemFocusAnimBorder-darkGrey" |
"ItemFocusAnim-green" |
"focusAnimation" |
"hoverAnimation",
string
>;

export const achievementClasses: AchievementClasses = findModule(
  (mod) => typeof mod === 'object' && mod?.AchievementListItemBase?.includes('achievementslist')
);

export const mainMenuAppRunningClasses: MainMenuAppRunningClasses = findModule(
  (mod) => typeof mod === 'object' && mod?.MainMenuAppRunning?.includes('mainmenuapprunning')
);

/**
 * All css styling for TabMaster's filter selection.
 */
export const FilterSelectStyles: VFC<{}> = ({}) => {
  return (
    <style>{`
      .tab-master-filter-select {
        width: 100%;
        height: auto;
      }

      .tab-master-filter-select .${gamepadDialogClasses.ModalPosition} > .${gamepadDialogClasses.GamepadDialogContent} {
        background: radial-gradient(155.42% 100% at 0% 0%, #060a0e 0 0%, #0e141b 100%);
      }

      .tab-master-filter-select .gpfocuswithin .${achievementClasses.AchievementListItemBase} {
        background: #767a8773;
      }

      .tab-master-filter-select .entry-label {
        font-size: 22px;
        text-align: initial;
      }

      .tab-master-filter-select .entry-disabled {
        color: #92939B;
      }

      .tab-master-filter-select .entry-desc {
        font-size: 16px;
        text-align: initial;
      }
    `}</style>
  );
}
