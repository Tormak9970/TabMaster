// ? Global types related to tabs.

type TabContainer = {
    id: string
    title: string
    position: number //-1 position is a hidden tab
    filters?: TabFilterSettings<FilterType>[] //undefined filters is a default tab else it's a CustomTabContainer
    filtersMode?: LogicalMode //boolean operation combine filters
    categoriesToInclude?: number //a bit field for categories tab should include
    autoHide?: boolean
    sortByOverride?: number //The eSortBy number to force use for sorting. -1 ignores override.
    visibleToOthers?: boolean
}

interface TabSettings extends TabContainer {}

type TabSettingsDictionary = {
    [tabId: string]: TabSettings
}

type TabContext = React.Context<{ label: string } | null>

type TabAppGridComponent = React.VoidFunctionComponent<TabAppGridComponentProps>
