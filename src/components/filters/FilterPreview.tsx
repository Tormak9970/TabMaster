import { Fragment, VFC, createElement } from 'react'
import {
    FilterIcons,
    FilterType,
    SdCardParamType,
    TabFilterSettings,
    compatCategoryToLabel,
    steamOSCompatCategoryToLabel,
} from './Filters'
import { capitalizeEachWord } from '../../lib/Utils'
import { MicroSDeckInterop } from '../../lib/controllers/MicroSDeckInterop'
import t from '../../utils/i18n'
import {
    getAchievementDisplayData,
    getDateFilterDisplayData,
    getReviewScoreFilterLabel,
    getSizeOnDiskDisplayData,
    getTimePlayed,
} from '../../utils/translationHelpers'

type FilterPreviewGenericProps = {
    filter: TabFilterSettings<FilterType>
    displayData: string | undefined
    isInverted?: boolean
}

const FilterPreviewGeneric: VFC<FilterPreviewGenericProps> = ({ filter, displayData, isInverted }) => {
    return (
        <div style={{ display: 'flex' }}>
            <div style={{ marginRight: '7px' }}>{createElement(FilterIcons[filter.type], { size: '.8em' })}</div>
            <div>
                <b>{capitalizeEachWord(filter.type)}</b>
                {' - ' + displayData + (isInverted ? ` (${t('LABEL_FILTER_INVERTED', 'inverted')})` : '')}
            </div>
        </div>
    )
}

type FilterPreviewProps<T extends FilterType> = {
    filter: TabFilterSettings<T>
}

const CollectionFilterPreview: VFC<FilterPreviewProps<'collection'>> = ({ filter }) => {
    return (
        <FilterPreviewGeneric
            filter={filter}
            displayData={filter.params.name ?? filter.params.id}
            isInverted={filter.inverted}
        />
    )
}

const InstalledFilterPreview: VFC<FilterPreviewProps<'installed'>> = ({ filter }) => {
    return (
        <FilterPreviewGeneric
            filter={filter}
            displayData={filter.params.installed ? t('LABEL_YES', 'yes') : t('LABEL_NO', 'no')}
        />
    )
}

const RegexFilterPreview: VFC<FilterPreviewProps<'regex'>> = ({ filter }) => {
    return <FilterPreviewGeneric filter={filter} displayData={filter.params.regex} isInverted={filter.inverted} />
}

const FriendsFilterPreview: VFC<FilterPreviewProps<'friends'>> = ({ filter }) => {
    return (
        <FilterPreviewGeneric
            filter={filter}
            displayData={`${filter.params.friends.length} ${filter.params.friends.length == 1 ? t('LABEL_FRIEND_SINGULAR', 'friend') : t('LABEL_FRIENDS_PLURAL', 'friends')}`}
            isInverted={filter.inverted}
        />
    )
}

const TagsFilterPreview: VFC<FilterPreviewProps<'tags'>> = ({ filter }) => {
    return (
        <FilterPreviewGeneric
            filter={filter}
            displayData={`${filter.params.tags.length} ${filter.params.tags.length == 1 ? t('LABEL_TAG_SINGULAR', 'tag') : t('LABEL_TAGS_PLURAL', 'tags')}`}
            isInverted={filter.inverted}
        />
    )
}

const WhitelistFilterPreview: VFC<FilterPreviewProps<'whitelist'>> = ({ filter }) => {
    return (
        <FilterPreviewGeneric
            filter={filter}
            displayData={`${filter.params.games.length} ${t('LABEL_WHITELISTED', 'whitelisted')}`}
        />
    )
}

const BlackListFilterPreview: VFC<FilterPreviewProps<'blacklist'>> = ({ filter }) => {
    return (
        <FilterPreviewGeneric
            filter={filter}
            displayData={`${filter.params.games.length} ${t('LABEL_BLACKLISTED', 'blacklisted')}`}
        />
    )
}

const MergeFilterPreview: VFC<FilterPreviewProps<'merge'>> = ({ filter }) => {
    return (
        <FilterPreviewGeneric
            filter={filter}
            displayData={`${filter.params.filters.length} ${t('LABEL_GROUPED_FILTERS', 'grouped filters')}`}
            isInverted={filter.inverted}
        />
    )
}

const PlatformFilterPreview: VFC<FilterPreviewProps<'platform'>> = ({ filter }) => {
    return (
        <FilterPreviewGeneric
            filter={filter}
            displayData={filter.params.platform === 'steam' ? 'Steam' : t('LibraryTab_NonSteam', 'Non Steam', true)}
        />
    )
}

const DeckCompatFilterPreview: VFC<FilterPreviewProps<'deck compatibility'>> = ({ filter }) => {
    return (
        <FilterPreviewGeneric
            filter={filter}
            displayData={compatCategoryToLabel(filter.params.category)}
            isInverted={filter.inverted}
        />
    )
}

const SteamOSCompatFilterPreview: VFC<FilterPreviewProps<'steamos compatibility'>> = ({ filter }) => {
    return (
        <FilterPreviewGeneric
            filter={filter}
            displayData={steamOSCompatCategoryToLabel(filter.params.category)}
            isInverted={filter.inverted}
        />
    )
}

const ReviewScoreFilterPreview: VFC<FilterPreviewProps<'review score'>> = ({ filter }) => {
    const { scoreThreshold, condition, type } = filter.params
    let displayData: string = getReviewScoreFilterLabel(scoreThreshold, condition, type)

    return <FilterPreviewGeneric filter={filter} displayData={displayData} />
}

const TimePlayedFilterPreview: VFC<FilterPreviewProps<'time played'>> = ({ filter }) => {
    const { timeThreshold, condition, units } = filter.params

    return <FilterPreviewGeneric filter={filter} displayData={getTimePlayed(timeThreshold, condition, units)} />
}

const SizeOnDiskFilterPreview: VFC<FilterPreviewProps<'size on disk'>> = ({ filter }) => {
    const { gbThreshold, condition } = filter.params

    return <FilterPreviewGeneric filter={filter} displayData={getSizeOnDiskDisplayData(gbThreshold, condition)} />
}

const ReleaseDateFilterPreview: VFC<FilterPreviewProps<'release date'>> = ({ filter }) => {
    const displayData = getDateFilterDisplayData(
        filter.type,
        filter.params.date,
        filter.params.daysAgo,
        filter.params.condition
    )

    return <FilterPreviewGeneric filter={filter} displayData={displayData} />
}

const PurchaseDateFilterPreview: VFC<FilterPreviewProps<'purchase date'>> = ({ filter }) => {
    const displayData = getDateFilterDisplayData(
        filter.type,
        filter.params.date,
        filter.params.daysAgo,
        filter.params.condition
    )

    return <FilterPreviewGeneric filter={filter} displayData={displayData} />
}

const LastPlayedFilterPreview: VFC<FilterPreviewProps<'last played'>> = ({ filter }) => {
    const displayData = getDateFilterDisplayData(
        filter.type,
        filter.params.date,
        filter.params.daysAgo,
        filter.params.condition
    )

    return <FilterPreviewGeneric filter={filter} displayData={displayData} />
}

const FamilySharingFilterPreview: VFC<FilterPreviewProps<'family sharing'>> = ({ filter }) => {
    return (
        <FilterPreviewGeneric
            filter={filter}
            displayData={filter.params.isFamilyShared ? t('LABEL_YES', 'yes') : t('LABEL_NO', 'no')}
        />
    )
}

const DemoFilterPreview: VFC<FilterPreviewProps<'demo'>> = ({ filter }) => {
    return (
        <FilterPreviewGeneric
            filter={filter}
            displayData={filter.params.isDemo ? t('LABEL_YES', 'yes') : t('LABEL_NO', 'no')}
        />
    )
}

const ComingSoonFilterPreview: VFC<FilterPreviewProps<'coming soon'>> = ({ filter }) => {
    return (
        <FilterPreviewGeneric
            filter={filter}
            displayData={filter.params.isComingSoon ? t('LABEL_YES', 'yes') : t('LABEL_NO', 'no')}
        />
    )
}

const StreamableFilterPreview: VFC<FilterPreviewProps<'streamable'>> = ({ filter }) => {
    return (
        <FilterPreviewGeneric
            filter={filter}
            displayData={filter.params.isStreamable ? t('LABEL_YES', 'yes') : t('LABEL_NO', 'no')}
        />
    )
}

const SteamFeaturesFilterPreview: VFC<FilterPreviewProps<'steam features'>> = ({ filter }) => {
    return (
        <FilterPreviewGeneric
            filter={filter}
            displayData={`${filter.params.features.length} ${filter.params.features.length == 1 ? t('LABEL_FEATURE_SINGULAR', 'feature') : t('LABEL_FEATURE_PLURAL', 'features')}`}
            isInverted={filter.inverted}
        />
    )
}

const AchievementsFilterPreview: VFC<FilterPreviewProps<'achievements'>> = ({ filter }) => {
    const { threshold, thresholdType, condition } = filter.params

    let displayData = getAchievementDisplayData(condition)

    return (
        <FilterPreviewGeneric
            filter={filter}
            displayData={`${threshold}${thresholdType === 'percent' ? '%' : ''} ${displayData}`}
        />
    )
}

const SDCardFilterPreview: VFC<FilterPreviewProps<'sd card'>> = ({ filter }) => {
    let displayData: string
    switch (filter.params.card) {
        case SdCardParamType.ANY:
            displayData = t('LABEL_ANY', 'Any')
            break
        case SdCardParamType.INSTALLED:
        case undefined:
            displayData = t('LABEL_INSERTED', 'Inserted')
            break
        default:
            displayData =
                (MicroSDeckInterop.isInstallOk() &&
                    window.MicroSDeck?.CardsAndGames.find(([card]) => card.uid === filter.params.card)?.[0].name) ||
                filter.params.card
    }
    return <FilterPreviewGeneric filter={filter} displayData={displayData} isInverted={filter.inverted} />
}

const InstallFolderFilterPreview: VFC<FilterPreviewProps<'install folder'>> = ({ filter }) => {
    return <FilterPreviewGeneric filter={filter} displayData={filter.params.driveName} isInverted={filter.inverted} />
}

/**
 * Generates the preview data for filters in a merge group.
 */
export const FilterPreview: VFC<FilterPreviewProps<FilterType>> = ({ filter }) => {
    if (filter) {
        switch (filter.type) {
            case 'collection':
                return <CollectionFilterPreview filter={filter as TabFilterSettings<'collection'>} />
            case 'installed':
                return <InstalledFilterPreview filter={filter as TabFilterSettings<'installed'>} />
            case 'regex':
                return <RegexFilterPreview filter={filter as TabFilterSettings<'regex'>} />
            case 'friends':
                return <FriendsFilterPreview filter={filter as TabFilterSettings<'friends'>} />
            case 'tags':
                return <TagsFilterPreview filter={filter as TabFilterSettings<'tags'>} />
            case 'whitelist':
                return <WhitelistFilterPreview filter={filter as TabFilterSettings<'whitelist'>} />
            case 'blacklist':
                return <BlackListFilterPreview filter={filter as TabFilterSettings<'blacklist'>} />
            case 'merge':
                return <MergeFilterPreview filter={filter as TabFilterSettings<'merge'>} />
            case 'platform':
                return <PlatformFilterPreview filter={filter as TabFilterSettings<'platform'>} />
            case 'deck compatibility':
                return <DeckCompatFilterPreview filter={filter as TabFilterSettings<'deck compatibility'>} />
            case 'steamos compatibility':
                return <SteamOSCompatFilterPreview filter={filter as TabFilterSettings<'steamos compatibility'>} />
            case 'review score':
                return <ReviewScoreFilterPreview filter={filter as TabFilterSettings<'review score'>} />
            case 'time played':
                return <TimePlayedFilterPreview filter={filter as TabFilterSettings<'time played'>} />
            case 'size on disk':
                return <SizeOnDiskFilterPreview filter={filter as TabFilterSettings<'size on disk'>} />
            case 'release date':
                return <ReleaseDateFilterPreview filter={filter as TabFilterSettings<'release date'>} />
            case 'purchase date':
                return <PurchaseDateFilterPreview filter={filter as TabFilterSettings<'purchase date'>} />
            case 'last played':
                return <LastPlayedFilterPreview filter={filter as TabFilterSettings<'last played'>} />
            case 'family sharing':
                return <FamilySharingFilterPreview filter={filter as TabFilterSettings<'family sharing'>} />
            case 'demo':
                return <DemoFilterPreview filter={filter as TabFilterSettings<'demo'>} />
            case 'coming soon':
                return <ComingSoonFilterPreview filter={filter as TabFilterSettings<'coming soon'>} />
            case 'streamable':
                return <StreamableFilterPreview filter={filter as TabFilterSettings<'streamable'>} />
            case 'steam features':
                return <SteamFeaturesFilterPreview filter={filter as TabFilterSettings<'steam features'>} />
            case 'achievements':
                return <AchievementsFilterPreview filter={filter as TabFilterSettings<'achievements'>} />
            case 'sd card':
                return <SDCardFilterPreview filter={filter as TabFilterSettings<'sd card'>} />
            case 'install folder':
                return <InstallFolderFilterPreview filter={filter as TabFilterSettings<'install folder'>} />
            default:
                return <Fragment />
        }
    } else {
        return <Fragment />
    }
}
