import { Fragment, VFC, createElement } from "react";
import { FilterIcons, FilterType, TabFilterSettings, compatCategoryToLabel } from "./Filters";
import { dateToLabel } from '../generic/DatePickers';
import { capitalizeEachWord } from '../../lib/Utils';
import { MicroSDeckInterop } from '../../lib/controllers/MicroSDeckInterop';

type FilterPreviewGenericProps = {
  filter: TabFilterSettings<FilterType>,
  displayData: string | undefined,
  isInverted?: boolean
};

const FilterPreviewGeneric: VFC<FilterPreviewGenericProps> = ({ filter, displayData, isInverted }) => {
  return (
    <div style={{ display: "flex" }}>
      <div style={{ marginRight: '7px' }}>
        {createElement(FilterIcons[filter.type], { size: '.8em' })}
      </div>
      <div>
        <b>{capitalizeEachWord(filter.type)}</b>{' - ' + displayData + (isInverted ? " (inverted)" : "")}
      </div>
    </div>
  );
}

type FilterPreviewProps<T extends FilterType> = {
  filter: TabFilterSettings<T>;
};

const CollectionFilterPreview: VFC<FilterPreviewProps<'collection'>> = ({ filter }) => {
  return <FilterPreviewGeneric filter={filter} displayData={filter.params.name ?? filter.params.id} isInverted={filter.inverted} />;
};

const InstalledFilterPreview: VFC<FilterPreviewProps<'installed'>> = ({ filter }) => {
  return <FilterPreviewGeneric filter={filter} displayData={filter.params.installed ? "yes" : "no"} />;
};

const RegexFilterPreview: VFC<FilterPreviewProps<'regex'>> = ({ filter }) => {
  return <FilterPreviewGeneric filter={filter} displayData={filter.params.regex} isInverted={filter.inverted} />;
};

const FriendsFilterPreview: VFC<FilterPreviewProps<'friends'>> = ({ filter }) => {
  return <FilterPreviewGeneric filter={filter} displayData={`${filter.params.friends.length} ${filter.params.friends.length == 1 ? "friend" : "friends"}`} isInverted={filter.inverted} />;
};

const TagsFilterPreview: VFC<FilterPreviewProps<'tags'>> = ({ filter }) => {
  return <FilterPreviewGeneric filter={filter} displayData={`${filter.params.tags.length} ${filter.params.tags.length == 1 ? "tag" : "tags"}`} isInverted={filter.inverted} />;
};

const WhitelistFilterPreview: VFC<FilterPreviewProps<'whitelist'>> = ({ filter }) => {
  return <FilterPreviewGeneric filter={filter} displayData={`${filter.params.games.length} whitelisted`} />;
};

const BlackListFilterPreview: VFC<FilterPreviewProps<'blacklist'>> = ({ filter }) => {
  return <FilterPreviewGeneric filter={filter} displayData={`${filter.params.games.length} blacklisted`} />;
};

const MergeFilterPreview: VFC<FilterPreviewProps<'merge'>> = ({ filter }) => {
  return <FilterPreviewGeneric filter={filter} displayData={`${filter.params.filters.length} grouped filters`} isInverted={filter.inverted} />;
};

const PlatformFilterPreview: VFC<FilterPreviewProps<'platform'>> = ({ filter }) => {
  return <FilterPreviewGeneric filter={filter} displayData={filter.params.platform === "steam" ? "Steam" : "Non Steam"} />;
};

const DeckCompatFilterPreview: VFC<FilterPreviewProps<'deck compatibility'>> = ({ filter }) => {
  return <FilterPreviewGeneric filter={filter} displayData={compatCategoryToLabel(filter.params.category)} isInverted={filter.inverted} />;
};

const ReviewScoreFilterPreview: VFC<FilterPreviewProps<'review score'>> = ({ filter }) => {
  const { scoreThreshold, condition, type } = filter.params;
  return <FilterPreviewGeneric filter={filter} displayData={type === 'metacritic' ? `Metacritic of ${scoreThreshold} or ${condition === 'above' ? 'higher' : 'lower'}` : `At ${condition === 'above' ? 'least' : 'most'} ${scoreThreshold}% positive Steam reviews`} />;
};

const TimePlayedFilterPreview: VFC<FilterPreviewProps<'time played'>> = ({ filter }) => {
  const { timeThreshold, condition, units } = filter.params;
  return <FilterPreviewGeneric filter={filter} displayData={`${timeThreshold} ${timeThreshold === 1 ? units.slice(0, -1) : units} or ${condition === 'above' ? 'more' : 'less'}`} />;
};

const SizeOnDiskFilterPreview: VFC<FilterPreviewProps<'size on disk'>> = ({ filter }) => {
  const { gbThreshold, condition } = filter.params;
  return <FilterPreviewGeneric filter={filter} displayData={`${gbThreshold < 1 ? gbThreshold * 1000 : gbThreshold} ${gbThreshold < 1 ? 'MB' : 'GB'} or ${condition === 'above' ? 'more' : 'less'}`} />;
};

const ReleaseDateFilterPreview: VFC<FilterPreviewProps<'release date'>> = ({ filter }) => {
  let displayData: string;

  if (filter.params.date) {
    const { day, month, year } = filter.params.date;
    displayData = `${!day ? 'In' : 'On'} or ${filter.params.condition === 'above' ? 'after' : 'before'} ${dateToLabel(year, month, day, { dateStyle: 'long' })}`;
  } else {
    const daysAgo = filter.params.daysAgo;
    displayData = `${daysAgo} day${daysAgo === 1 ? '' : 's'} ago or ${filter.params.condition === 'above' ? 'later' : 'earlier'}`;
  }

  return <FilterPreviewGeneric filter={filter} displayData={displayData} />;
};

const LastPlayedFilterPreview: VFC<FilterPreviewProps<'last played'>> = ({ filter }) => {
  let displayData: string;

  if (filter.params.date) {
    const { day, month, year } = filter.params.date;
   displayData = `${!day ? 'In' : 'On'} or ${filter.params.condition === 'above' ? 'after' : 'before'} ${dateToLabel(year, month, day, { dateStyle: 'long' })}`;
  } else {
    const daysAgo = filter.params.daysAgo;
    displayData = `${daysAgo} day${daysAgo === 1 ? '' : 's'} ago or ${filter.params.condition === 'above' ? 'later' : 'earlier'}`;
  }

  return <FilterPreviewGeneric filter={filter} displayData={displayData} />;
};

const FamilySharingFilterPreview: VFC<FilterPreviewProps<'family sharing'>> = ({ filter }) => {
  return <FilterPreviewGeneric filter={filter} displayData={filter.params.isFamilyShared ? "yes" : "no"} />;
};

const DemoFilterPreview: VFC<FilterPreviewProps<'demo'>> = ({ filter }) => {
  return <FilterPreviewGeneric filter={filter} displayData={filter.params.isDemo ? "yes" : "no"} />;
};

const StreamableFilterPreview: VFC<FilterPreviewProps<'streamable'>> = ({ filter }) => {
  return <FilterPreviewGeneric filter={filter} displayData={filter.params.isStreamable ? "yes" : "no"} />;
};

const SteamFeaturesFilterPreview: VFC<FilterPreviewProps<'steam features'>> = ({ filter }) => {
  return <FilterPreviewGeneric filter={filter} displayData={`${filter.params.features.length} ${filter.params.features.length == 1 ? "feature" : "features"}`} isInverted={filter.inverted} />;
};

const AchievementsFilterPreview: VFC<FilterPreviewProps<'achievements'>> = ({ filter }) => {
  const { completionPercentage, condition } = filter.params;
  return <FilterPreviewGeneric filter={filter} displayData={`${completionPercentage}% or ${condition === 'above' ? 'more' : 'less'} achievements completed`} />;
};

const SDCardFilterPreview: VFC<FilterPreviewProps<'sd card'>> = ({ filter }) => {
  const isInsertCard = !filter.params.card;
  const card = (MicroSDeckInterop.isInstallOk() && window.MicroSDeck?.CardsAndGames.find(([card]) => card.uid === filter.params.card)?.[0].name) || filter.params.card;
  return <FilterPreviewGeneric filter={filter} displayData={isInsertCard ? 'Inserted Card' : card} isInverted={filter.inverted} />;
}

/**
 * Generates the preview data for filters in a merge group.
 */
export const FilterPreview: VFC<FilterPreviewProps<FilterType>> = ({ filter }) => {
  if (filter) {
    switch (filter.type) {
      case "collection":
        return <CollectionFilterPreview filter={filter as TabFilterSettings<'collection'>} />;
      case "installed":
        return <InstalledFilterPreview filter={filter as TabFilterSettings<'installed'>} />;
      case "regex":
        return <RegexFilterPreview filter={filter as TabFilterSettings<'regex'>} />;
      case "friends":
        return <FriendsFilterPreview filter={filter as TabFilterSettings<'friends'>} />;
      case "tags":
        return <TagsFilterPreview filter={filter as TabFilterSettings<'tags'>} />;
      case "whitelist":
        return <WhitelistFilterPreview filter={filter as TabFilterSettings<'whitelist'>} />;
      case "blacklist":
        return <BlackListFilterPreview filter={filter as TabFilterSettings<'blacklist'>} />;
      case "merge":
        return <MergeFilterPreview filter={filter as TabFilterSettings<'merge'>} />;
      case "platform":
        return <PlatformFilterPreview filter={filter as TabFilterSettings<'platform'>} />;
      case "deck compatibility":
        return <DeckCompatFilterPreview filter={filter as TabFilterSettings<'deck compatibility'>} />;
      case "review score":
        return <ReviewScoreFilterPreview filter={filter as TabFilterSettings<'review score'>} />;
      case "time played":
        return <TimePlayedFilterPreview filter={filter as TabFilterSettings<'time played'>} />;
      case "size on disk":
        return <SizeOnDiskFilterPreview filter={filter as TabFilterSettings<'size on disk'>} />;
      case "release date":
        return <ReleaseDateFilterPreview filter={filter as TabFilterSettings<'release date'>} />;
      case "last played":
        return <LastPlayedFilterPreview filter={filter as TabFilterSettings<'last played'>} />;
      case "family sharing":
        return <FamilySharingFilterPreview filter={filter as TabFilterSettings<'family sharing'>} />;
      case "demo":
        return <DemoFilterPreview filter={filter as TabFilterSettings<'demo'>} />;
      case "streamable":
        return <StreamableFilterPreview filter={filter as TabFilterSettings<'streamable'>} />;
      case "steam features":
        return <SteamFeaturesFilterPreview filter={filter as TabFilterSettings<'steam features'>} />;
      case "achievements":
        return <AchievementsFilterPreview filter={filter as TabFilterSettings<'achievements'>} />
      case "sd card":
        return <SDCardFilterPreview filter={filter as TabFilterSettings<'sd card'>} />;
      default:
        return <Fragment />;
    }
  } else {
    return <Fragment />;
  }
};
