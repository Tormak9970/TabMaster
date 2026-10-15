import { SidebarNavigation, SidebarNavigationPage } from '@decky/ui'
import { ReactNode, useMemo } from 'react'

import { DocPage } from './docs/DocsPage'

//@ts-ignore
import docs from './docs/docs.codegen'
import { trans_string as t } from '@utils'
import { FaBook, FaTag } from 'react-icons/fa6'
import { FaCog } from 'react-icons/fa'
import { General } from './General'
import { About } from './about/About'
import { Tags } from './Tags'

type RouteEntry = {
    title: string
    content: ReactNode
    route: string
    icon: ReactNode
    hideTitle?: boolean
}

type Routes = {
    [pageName: string]: RouteEntry
}

/**
 * The Settings Router for TabMaster.
 */
export const SettingsRouter = () => {
    const baseRoute = '/tab-master-settings'

    // @ts-expect-error RouteEntry is a more complete version of SidebarNavigation
    const pages: (SidebarNavigationPage | 'separator')[] = useMemo(() => {
        const docPages: Routes = {}

        Object.entries(docs).map(([pageName, doc]) => {
            pageName = pageName.replace(/_/g, ' ')

            docPages[pageName] = {
                title: pageName,
                content: <DocPage content={doc as string} />,
                route: `${baseRoute}/docs-${pageName.toLowerCase().replace(/ /g, '-')}`,
                icon: <FaBook />,
                hideTitle: true,
            }
        })

        return [
            {
                title: t('TITLE_SETTINGS_GENERAL', 'General'),
                content: <General />,
                route: `${baseRoute}/general`,
                icon: <FaCog />,
            },
            {
                title: t('TITLE_SETTINGS_TAGS', 'Tags'),
                content: <Tags />,
                route: `${baseRoute}/tags`,
                icon: <FaTag />,
            },
            {
                title: t('TITLE_SETTINGS_ABOUT', 'About'),
                content: <About />,
                route: `${baseRoute}/about`,
                icon: <FaCog />,
            },
            'seperator',
            docPages['Overview'],
            docPages['Tabs'],
            docPages['Filters'],
            docPages['Tab Profiles'],
            docPages['The Fix System'],
        ]
    }, [baseRoute])

    return <SidebarNavigation title={t('TITLE_TABMASTER_SETTINGS', 'TabMaster Settings')} showTitle pages={pages} />
}
