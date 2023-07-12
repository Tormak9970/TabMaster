// ? Global types related to tabs.

type TabContainer = {
  id: string
  title: string
  position: number    //-1 position is a hidden tab
  filters?: TabFilterSettings<FilterType>[] //undefined filters is a default tab else it's a CustomTabContainer
  filtersMode?: LogicalMode //boolean operation combine filters
  includesHidden?: boolean //boolean for if tab includes filters
}

interface TabSettings extends TabContainer { }

type TabSettingsDictionary = {
  [tabId: string]: TabSettings
}
