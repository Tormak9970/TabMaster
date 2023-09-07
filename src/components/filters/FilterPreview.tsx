import { Fragment, VFC } from "react";
import { FilterType, TabFilterSettings, compatCategoryToLabel } from "./Filters";
import { dateToLabel } from '../generic/DatePickers';
import { capitalizeEachWord } from '../../lib/Utils';

type FilterPreviewProps<T extends FilterType> = {
  filter: TabFilterSettings<T>
}


const CollectionFilterPreview: VFC<FilterPreviewProps<'collection'>> = ({ filter }) => {
  return <div className="merge-filter-entry">{capitalizeEachWord(filter.type) + ' - '}{filter.params.name ?? filter.params.id}{filter.inverted ? " (inverted)" : ""}</div>
}

const InstalledFilterPreview: VFC<FilterPreviewProps<'installed'>> = ({filter }) => {
  return <div className="merge-filter-entry">{capitalizeEachWord(filter.type) + ' - '}{filter.params.installed ? "yes" : "no"}</div>
}

const RegexFilterPreview: VFC<FilterPreviewProps<'regex'>> = ({ filter }) => {
  return <div className="merge-filter-entry">{capitalizeEachWord(filter.type) + ' - '}{filter.params.regex}{filter.inverted ? " (inverted)" : ""}</div>
}

const FriendsFilterPreview: VFC<FilterPreviewProps<'friends'>> = ({ filter }) => {
  return <div className="merge-filter-entry">{capitalizeEachWord(filter.type) + ' - '}{filter.params.friends.length} {filter.params.friends.length == 1 ? "friend" : "friends"}{filter.inverted ? " (inverted)" : ""}</div>
}

const TagsFilterPreview: VFC<FilterPreviewProps<'tags'>> = ({ filter }) => {
  return <div className="merge-filter-entry">{capitalizeEachWord(filter.type) + ' - '}{filter.params.tags.length} {filter.params.tags.length == 1 ? "tag" : "tags"}{filter.inverted ? " (inverted)" : ""}</div>
}

const WhitelistFilterPreview: VFC<FilterPreviewProps<'whitelist'>> = ({ filter }) => {
  return <div className="merge-filter-entry">{capitalizeEachWord(filter.type) + ' - '}{filter.params.games.length} whitelisted</div>
}

const BlackListFilterPreview: VFC<FilterPreviewProps<'blacklist'>> = ({ filter }) => {
  return <div className="merge-filter-entry">{capitalizeEachWord(filter.type) + ' - '}{filter.params.games.length} blacklisted</div>
}

const MergeFilterPreview: VFC<FilterPreviewProps<'merge'>> = ({ filter }) => {
  return <div className="merge-filter-entry">{capitalizeEachWord(filter.type) + ' - '}{filter.params.filters.length} grouped filters{filter.inverted ? " (inverted)" : ""}</div>
}

const PlatformFilterPreview: VFC<FilterPreviewProps<'platform'>> = ({ filter }) => {
  return <div className="merge-filter-entry">{capitalizeEachWord(filter.type) + ' - '}{filter.params.platform === "steam" ? "Steam" : "Non Steam"}</div>
}

const DeckCompatFilterPreview: VFC<FilterPreviewProps<'deck compatibility'>> = ({ filter }) => {
  return <div className="merge-filter-entry">{capitalizeEachWord(filter.type) + ' - '}{compatCategoryToLabel(filter.params.category)}{filter.inverted ? " (inverted)" : ""}</div>
}

const ReviewScoreFilterPreview: VFC<FilterPreviewProps<'review score'>> = ({ filter }) => {
  const { scoreThreshold, condition, type } = filter.params;
  return <div className="merge-filter-entry">{capitalizeEachWord(filter.type) + ' - '}{type === 'metacritic' ? `Metacritic of ${scoreThreshold} or ${condition === 'above' ? 'higher' : 'lower'}` : `At ${condition === 'above' ? 'least' : 'most'} ${scoreThreshold}% positive Steam reviews`}</div>
}

const TimePlayedFilterPreview: VFC<FilterPreviewProps<'time played'>> = ({ filter }) => {
  const { timeThreshold, condition, units} = filter.params;
  return <div className="merge-filter-entry">{capitalizeEachWord(filter.type) + ' - '}{`${timeThreshold} ${timeThreshold === 1 ? units.slice(0, -1) : units} or ${condition === 'above' ? 'more' : 'less'}`}</div>
}

const SizeOnDiskFilterPreview: VFC<FilterPreviewProps<'size on disk'>> = ({ filter }) => {
  const { gbThreshold, condition } = filter.params;
  return <div className="merge-filter-entry">{capitalizeEachWord(filter.type) + ' - '}{`${gbThreshold} GB or ${condition === 'above' ? 'more' : 'less'}`}</div>
}

const ReleaseDateFilterPreview: VFC<FilterPreviewProps<'release date'>> = ({ filter }) => {
  const { day, month, year } = filter.params.date!;
  return <div className="merge-filter-entry">{capitalizeEachWord(filter.type) + ' - '}{`${!day ? 'In' : 'On'} or ${filter.params.condition === 'above' ? 'after' : 'before'} ${dateToLabel(year, month, day, {dateStyle: 'long'})}`}</div>
}

const LastPlayedFilterPreview: VFC<FilterPreviewProps<'last played'>> = ({ filter }) => {
  const { day, month, year } = filter.params.date!;
  return <div className="merge-filter-entry">{capitalizeEachWord(filter.type) + ' - '}{`${!day ? 'In' : 'On'} or ${filter.params.condition === 'above' ? 'after' : 'before'} ${dateToLabel(year, month, day, {dateStyle: 'long'})}`}</div>
}
const DemoFilterPreview: VFC<FilterPreviewProps<'demo'>> = ({ filter }) => {
  return <div className="merge-filter-entry">{capitalizeEachWord(filter.type) + ' - '}{filter.params.isDemo ? "yes" : "no"}</div>
}

/**
 * Generates the preview data for filters in a merge group.
 */
export const FilterPreview: VFC<FilterPreviewProps<FilterType>> = ({ filter }) => {
  if (filter) {
    switch (filter.type) {
      case "collection":
        return <CollectionFilterPreview filter={filter as TabFilterSettings<'collection'>} />
      case "installed":
        return <InstalledFilterPreview filter={filter as TabFilterSettings<'installed'>} />
      case "regex":
        return <RegexFilterPreview filter={filter as TabFilterSettings<'regex'>} />
      case "friends":
        return <FriendsFilterPreview filter={filter as TabFilterSettings<'friends'>} />
      case "tags":
        return <TagsFilterPreview filter={filter as TabFilterSettings<'tags'>} />
      case "whitelist":
        return <WhitelistFilterPreview filter={filter as TabFilterSettings<'whitelist'>} />
      case "blacklist":
        return <BlackListFilterPreview filter={filter as TabFilterSettings<'blacklist'>} />
      case "merge":
        return <MergeFilterPreview filter={filter as TabFilterSettings<'merge'>} />
      case "platform":
        return <PlatformFilterPreview filter={filter as TabFilterSettings<'platform'>} />
      case "deck compatibility":
        return <DeckCompatFilterPreview filter={filter as TabFilterSettings<'deck compatibility'>} />
      case "review score":
        return <ReviewScoreFilterPreview filter={filter as TabFilterSettings<'review score'>} />
      case "time played":
        return <TimePlayedFilterPreview filter={filter as TabFilterSettings<'time played'>} />
      case "size on disk":
        return <SizeOnDiskFilterPreview filter={filter as TabFilterSettings<'size on disk'>} />
      case "release date":
        return <ReleaseDateFilterPreview filter={filter as TabFilterSettings<'release date'>} />
      case "last played":
        return <LastPlayedFilterPreview filter={filter as TabFilterSettings<'last played'>} />
      case "demo":
        return <DemoFilterPreview filter={filter as TabFilterSettings<'demo'>} />
      default:
        return <Fragment />
    }
  } else {
    return <Fragment />
  }
}
