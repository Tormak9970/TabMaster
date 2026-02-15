import {
    DialogBody,
    DialogButton,
    DialogControlsSection,
    DialogHeader,
    Focusable,
    joinClassNames,
    Marquee,
    ModalRoot,
    showModal,
} from '@decky/ui'
import { VFC, useEffect, useMemo, useState } from 'react'
import { PythonInterop } from '../../lib/controllers/PythonInterop'
import { TabMasterManager } from '../../state/TabMasterManager'
import { CustomTabContainer } from '../../state/CustomTabContainer'
import { v4 as uuidv4 } from 'uuid'
import { showModalDuplicateTab } from './EditTabModal'
import { SharedTabsModalStyles } from '../styles/SharedTabsStyles'
import { SharedTabAccordion } from '../accordions/SharedTabAccordion'
import { FaRegWindowMaximize } from 'react-icons/fa6'

type UserTabProps = {
    tab: TabSettings
    closeModal?: () => void
    onConfirm: (tabSettings: TabSettings) => void
}

const UserTab: VFC<UserTabProps> = ({ tab, closeModal, onConfirm }: UserTabProps) => {
    return (
        <div className='post'>
            <DialogButton
                style={{ borderRadius: 'unset', margin: '0', padding: '10px', scrollMarginTop: '0' }}
                onClick={() => {
                    onConfirm(tab)
                    closeModal!()
                }}
            >
                <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                    <FaRegWindowMaximize
                        style={{
                            paddingRight: '10px',
                            width: '1em',
                        }}
                    />
                    <Marquee>
                        {tab.title} - {tab.filters?.length ?? 0} {tab.filters?.length === 1 ? 'Filter' : 'Filters'}
                    </Marquee>
                </div>
            </DialogButton>
        </div>
    )
}

export type SharedTabsModalProps = {
    closeModal?: () => void
    onConfirm: (tabSettings: TabSettings) => void
    tabMasterManager: TabMasterManager
}

export const SharedTabsModal: VFC<SharedTabsModalProps> = ({
    closeModal,
    onConfirm,
    tabMasterManager,
}: SharedTabsModalProps) => {
    const [loading, setLoading] = useState(true)
    const [sharedTabs, setSharedTabs] = useState<Record<string, TabSettingsDictionary>>({})

    const { currentUsersFriends } = useMemo(() => tabMasterManager.getFriendsAndTags(), [tabMasterManager])

    const tabsByUser: { user: string; tabs: TabSettings[] }[] = useMemo(() => {
        if (loading) return []

        return Array.from(
            Object.entries(sharedTabs).map(([userId, tabs]) => {
                return {
                    user: currentUsersFriends.find(friend => friend.steamid.toString() === userId)?.name ?? userId,
                    tabs: Array.from(Object.values(tabs)),
                }
            })
        )
    }, [sharedTabs, currentUsersFriends])

    useEffect(() => {
        PythonInterop.getSharedTabs().then(res => {
            if (res?.message || !res) {
                setSharedTabs({})
            } else {
                setSharedTabs(res as Record<string, TabSettingsDictionary>)
            }

            setLoading(false)
        })
    }, [])

    return (
        <div className='tab-master-shared-tabs-modal'>
            <SharedTabsModalStyles />
            <ModalRoot
                onCancel={closeModal}
                onEscKeypress={closeModal}
                bDisableBackgroundDismiss={false}
                bHideCloseIcon={false}
            >
                <DialogHeader>Shared Tabs</DialogHeader>
                <DialogBody>
                    <DialogControlsSection>
                        {/* From Decky-SGDB */}
                        <div className={joinClassNames('spinnyboi', !loading ? 'loaded' : '')}>
                            {/* cant use <SteamSpinner /> cause it has some extra elements that break the layout */}
                            <img alt='Loading...' src='/images/steam_spinner.png' />
                        </div>

                        {tabsByUser.map((userTabs, i) => (
                            <SharedTabAccordion user={userTabs.user} tabs={userTabs.tabs} isOpen={true} key={i}>
                                <Focusable
                                    style={{ display: 'flex', gap: '4px', flexDirection: 'column', padding: '4px 0px' }}
                                >
                                    {userTabs.tabs.map(tab => (
                                        <UserTab tab={tab} onConfirm={onConfirm} closeModal={closeModal} />
                                    ))}
                                </Focusable>
                            </SharedTabAccordion>
                        ))}
                    </DialogControlsSection>
                </DialogBody>
            </ModalRoot>
        </div>
    )
}

/**
 * Function to show the SharedTabsModal to copy tabs from other users.
 * @param tabMasterManager TabMasterManager instance.
 */
export function showModalSharedTabs(tabMasterManager: TabMasterManager) {
    showModal(
        <SharedTabsModal
            onConfirm={(tabSettings: TabSettings) => {
                const container = new CustomTabContainer(
                    uuidv4(),
                    '',
                    tabSettings.position,
                    tabSettings.filters!,
                    tabSettings.filtersMode ?? 'and',
                    tabSettings.categoriesToInclude!,
                    tabSettings.autoHide ?? false,
                    tabSettings.visibleToOthers ?? false,
                    tabSettings.sortByOverride ?? -1
                )

                showModalDuplicateTab(container, tabMasterManager)
            }}
            tabMasterManager={tabMasterManager}
        />
    )
}
