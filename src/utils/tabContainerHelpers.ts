import { CustomTabContainer } from '@state'
import { TabContainer } from '@types'

export function isCustomTabContainer(container: TabContainer | CustomTabContainer): container is CustomTabContainer {
    return (container as CustomTabContainer).filtersMode !== undefined
}
