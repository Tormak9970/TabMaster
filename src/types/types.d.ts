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
}

interface TabSettings extends TabContainer { }

type TabSettingsDictionary = {
    [tabId: string]: TabSettings
}

