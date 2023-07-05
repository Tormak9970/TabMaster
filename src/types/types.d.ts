declare module "*.svg" {
  const content: string;
  export default content;
}

declare module "*.png" {
  const content: string;
  export default content;
}

declare module "*.jpg" {
  const content: string;
  export default content;
}

type TabContainer = {
    id: string
    title: string
    position: number    //-1 position is a hidden tab
    filters?: TabFilterSettings<FilterType>[] //undefined filters is a default tab else it's a CustomTabContainer
    filtersMode?: LogicalMode //boolean operation combine filters
}

interface TabSettings extends TabContainer { }

type TabSettingsDictionary = {
    [tabId: string]: TabSettings
}

type Unregisterer = {
  unregister: () => void;
}

type TagResponse = {
  tag: number,
  string: string | undefined
}

type FriendEntry = {
  name: string,
  steamid: number
}

type FilterErrorEntry = {
  filterIdx: number,
  errors: string[]
}

type LogicalMode = 'and' | 'or'

type SteamPlatform = "steam" | "nonSteam"
