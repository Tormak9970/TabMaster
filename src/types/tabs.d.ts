// ? Global types related to tabs.

type TabContainer = {
  id: string
  title: string
  position: number    //-1 position is a hidden tab
  filters?: TabFilterSettings<FilterType>[] //undefined filters is a default tab else it's a CustomTabContainer
  filtersMode?: LogicalMode //boolean operation combine filters
  categoriesToInclude?: number //a bit field for categories tab should include
  autoHide?: boolean
}

interface TabSettings extends TabContainer { }

type TabSettingsDictionary = {
  [tabId: string]: TabSettings
}
