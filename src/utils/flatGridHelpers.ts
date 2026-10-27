import { findInReactTree } from '@decky/ui'
import { ReactElement } from 'react'
import { TabAppGridComponent } from '@types'

type AppGridSection = {
    subSectionName: string
    children: unknown[]
}

let FlatTabAppGridDef: TabAppGridComponent | undefined
const flatComponents = new WeakMap<any, any>()
const ownComponents = new WeakSet<any>()

/**
 * Gets a version of Steam's tab app grid that shows the sorted apps in one grid instead of one per group.
 * @param TabAppGrid Steam's tab app grid component.
 * @returns The flat tab app grid component.
 */
export function getFlatTabAppGrid(TabAppGrid: TabAppGridComponent): TabAppGridComponent {
    if (!FlatTabAppGridDef) {
        FlatTabAppGridDef = function FlatTabAppGrid(props) {
            const ret = TabAppGrid(props)

            //* the tab grid renders the component that splits the apps into groups for the current sort
            const grouping = findInReactTree(ret, elt => elt?.props?.appOverviews && 'eSortBy' in elt.props)
            if (grouping) grouping.type = getFlatComponent(grouping.type)

            return ret
        }
    }

    return FlatTabAppGridDef
}

/**
 * Wraps Steam's grouping component so the groups it renders are merged into one.
 * @param component The grouping component, either a function or a memo.
 * @returns The wrapped component. The same component is always wrapped the same way, so React keeps its state.
 */
function getFlatComponent(component: any): any {
    if (ownComponents.has(component)) return component

    let flat = flatComponents.get(component)
    if (flat) return flat

    if (typeof component === 'function') {
        flat = function FlatAppGroups(this: unknown, ...args: unknown[]) {
            return mergeSections(component.apply(this, args))
        }
    } else if (typeof component?.type === 'function') {
        flat = { ...component, type: getFlatComponent(component.type) }
    } else {
        return component
    }

    ownComponents.add(flat)
    flatComponents.set(component, flat)
    return flat
}

/**
 * Merges the sections of the app grid in the grouping component's output into one, keeping the sort order.
 * @param ret The grouping component's output.
 * @returns The same output.
 */
function mergeSections(ret: ReactElement) {
    const grid = findInReactTree(ret, elt => Array.isArray(elt?.props?.childSections))
    const sections: AppGridSection[] | undefined = grid?.props.childSections

    if (sections && sections.length > 1) {
        grid.props.childSections = [
            {
                ...sections[0],
                subSectionName: '',
                children: sections.flatMap(section => section.children),
            },
        ]
    }

    return ret
}
