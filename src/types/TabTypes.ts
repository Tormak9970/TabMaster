import { FilterType, LogicalMode, TabFilterSettings } from './FilterTypes'
import { TabAppGridComponentProps } from './SteamTypes'

export type TabContainer = {
    id: string
    title: string
    position: number //-1 position is a hidden tab
    filters?: TabFilterSettings<FilterType>[] //undefined filters is a default tab else it's a CustomTabContainer
    filtersMode?: LogicalMode //boolean operation combine filters
    categoriesToInclude?: number //a bit field for categories tab should include
    autoHide?: boolean
    sortByOverride?: number //The eSortBy number to force use for sorting. -1 ignores override.
    visibleToOthers?: boolean
    displayAsCollection?: boolean
}

export interface TabSettings extends TabContainer {}

export type TabSettingsDictionary = {
    [tabId: string]: TabSettings
}

export type TabContext = React.Context<{ label: string } | null>

export type TabAppGridComponent = React.VoidFunctionComponent<TabAppGridComponentProps>
