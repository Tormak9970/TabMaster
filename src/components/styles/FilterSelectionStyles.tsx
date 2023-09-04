import { findModule } from "decky-frontend-lib";
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

export const achievementClasses: AchievementClasses = findModule(
  (mod) => typeof mod === 'object' && mod?.AchievementListItemBase?.includes('achievementslist'),
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

      .tab-master-filter-select .gpfocuswithin .${achievementClasses.AchievementListItemBase} {
        background: #767a8773;
      }

      .tab-master-filter-select .entry-label {
        font-size: 22px;
        text-align: initial;
      }

      .tab-master-filter-select .entry-desc {
        font-size: 16px;
        text-align: initial;
      }
    `}</style>
  );
}
