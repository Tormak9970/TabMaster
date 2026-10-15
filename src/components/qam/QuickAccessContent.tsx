import {
    DialogButton,
    Field,
    Focusable,
    Navigation,
    showContextMenu,
    quickAccessMenuClasses,
    showModal,
    ConfirmModal,
} from '@decky/ui'
import { useState } from 'react'

import { FaBookmark, FaArrowUpFromBracket, FaArrowRightToBracket, FaFolderPlus, FaSlideshare } from 'react-icons/fa6'
import { PiListPlusBold } from 'react-icons/pi'

import { useTabMasterContext, CustomTabContainer, TabMasterManager } from '@state'

import { QamStyles } from '../styles/QamStyles'
import { showModalNewTab } from '../modals/EditTabModal'
import { LogController } from '../../lib/controllers/LogController'
import { PresetMenu } from '../context-menus/PresetMenu'
import {
    MicroSDeckInstallState,
    MicroSDeckInterop,
    microSDeckLibVersion,
} from '../../lib/controllers/MicroSDeckInterop'
import { MicroSDeckNotice } from './MicroSDeckNotice'
import { TabProfilesMenu } from '../context-menus/TabProfileMenu'
import { PythonInterop } from '../../lib/controllers/PythonInterop'
import { GITHUB_URL, DISCORD_URL } from '../../constants'
import { InvalidSettingsNotice } from './InvalidSettingsNotice'
import { TabsPanelSection } from './TabsPanelSection'
import { ErrorNotice } from './ErrorNotice'
import { showModalSharedTabs } from '../modals/SharedTabsModal'
import { trans_string as t } from '@utils'
import { FaCog } from 'react-icons/fa'

export type TabIdEntryType = {
    id: string
}

const restartSteam = () => {
    SteamClient.System.RestartPC()
}

const showRestartConfirm = () => {
    showModal(
        <ConfirmModal
            strTitle={t('TITLE_RESTART_STEAM', 'Restart Steam?')}
            strCancelButtonText={t('LABEL_RESTART_LATER', 'Later')}
            strOKButtonText={t('LABEL_RESTART_NOW', 'Restart Now')}
            strDescription={t(
                'MESSAGE_RESTART_REASON',
                'Your backup has been restored. TabMaster has been set to not save changes until you restart to avoid overwriting your restored settings. It is strongly recommend to restart as soon as possible'
            )}
            onOK={restartSteam}
        />
    )
}

/**
 * The Quick Access Menu content for TabMaster.
 */
export const QuickAccessContent = ({}) => {
    const [microSDeckNoticeHidden, setMicroSDeckNoticeHidden] = useState(MicroSDeckInterop.noticeHidden)
    const [showError, setShowError] = useState(LogController.errorFlag)
    const { visibleTabsList, tabMasterManager } = useTabMasterContext()
    const [showResetTabs, setShowResetTabs] = useState(tabMasterManager.invalidSettingsLoaded.isTrue)

    const microSDeckInstallState = MicroSDeckInterop.getInstallState()
    const isMicroSDeckInstalled = microSDeckInstallState === MicroSDeckInstallState.VERSION_COMPATIBLE
    const hasSdTabs = !!visibleTabsList.find(tabContainer => (tabContainer as CustomTabContainer).dependsOnMicroSDeck)

    const handleRestorePrompt = async () => {
        const path = await PythonInterop.openJSONFile()
        if (path instanceof Error) {
            LogController.raiseError('TabMaster encountered a problem opening the filepicker.', path.message)
            return
        }

        await PythonInterop.restoreSettings(path)

        showRestartConfirm()
    }

    const handleBackupPrompt = async () => {
        const path = await PythonInterop.openFolder()
        if (path instanceof Error) {
            LogController.raiseError('TabMaster encountered a problem opening the filepicker.', path.message)
            return
        }

        const success = await PythonInterop.backupSettings(path)
        if (success) {
            PythonInterop.toast('Success!', 'Settings backup finished.')
        } else {
            PythonInterop.toast('Error!', 'Settings backup failed.')
        }
    }

    const confirmTabReset = async () => {
        await tabMasterManager.invalidSettingsLoaded.confirmReset()
        setShowResetTabs(false)
    }

    const support = (
        <div style={{ wordWrap: 'break-word' }}>
            {t('MESSAGE_SUPPORT_REACHOUT', 'Please reach out to')}
            <br />
            <a href={GITHUB_URL}>{GITHUB_URL}</a>
            <br />
            {t('MESSAGE_SUPPORT_OR', 'or')}
            <br />
            <a href={DISCORD_URL}>{DISCORD_URL}</a>
            <br />
            {t('MESSAGE_SUPPORT_END', 'for support.')}
        </div>
    )

    return (
        <div className='tab-master-scope'>
            {showError && (
                <ErrorNotice onDismiss={() => setShowError((LogController.errorFlag = false))}>{support}</ErrorNotice>
            )}
            {showResetTabs && <InvalidSettingsNotice onOk={confirmTabReset}>{support}</InvalidSettingsNotice>}
            {hasSdTabs && !isMicroSDeckInstalled && !microSDeckNoticeHidden && (
                <div className='notice-field-cont' style={{ paddingBottom: '10px' }}>
                    <Field>
                        <MicroSDeckNotice
                            intallState={microSDeckInstallState}
                            pluginVersion={window.MicroSDeck?.Version ?? ''}
                            libVersion={microSDeckLibVersion}
                            style={{ margin: '8px', fontSize: '11px' }}
                        />
                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                            <DialogButton
                                style={{ margin: '10px 8px 0px', width: 'auto' }}
                                onClick={() => {
                                    MicroSDeckInterop.noticeHidden = true
                                    setMicroSDeckNoticeHidden(true)
                                }}
                            >
                                {t('LABEL_HIDE_NOTICE', 'Hide Notice')}
                            </DialogButton>
                        </div>
                    </Field>
                </div>
            )}
            <QamStyles />
            {!showResetTabs && (
                <Focusable>
                    <div style={{ margin: '5px', marginTop: '0px' }}>
                        {t('MESSAGE_QAM_DESCRIPTION', 'Here you can add, re-order, or remove tabs from the library.')}
                    </div>
                    <Field childrenContainerWidth='max' className='no-sep'>
                        <Focusable style={{ width: '100%', display: 'flex' }}>
                            <Focusable className='add-tab-btn'>
                                <DialogButton
                                    disabled={!tabMasterManager.hasSettingsLoaded}
                                    style={{
                                        height: '40px',
                                        width: '42px',
                                        minWidth: 0,
                                        padding: '10px 12px',
                                        marginLeft: 'auto',
                                        display: 'flex',
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                    }}
                                    onClick={() => showModalNewTab(tabMasterManager)}
                                    onOKActionDescription={t('LABEL_ADD_TAB', 'Add Tab')}
                                >
                                    <FaFolderPlus size='1em' />
                                </DialogButton>
                            </Focusable>
                            <Focusable className='add-tab-btn' style={{ marginLeft: '10px' }}>
                                <DialogButton
                                    disabled={!tabMasterManager.hasSettingsLoaded}
                                    style={{
                                        height: '40px',
                                        width: '42px',
                                        minWidth: 0,
                                        padding: '10px 12px',
                                        marginLeft: 'auto',
                                        display: 'flex',
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                    }}
                                    onOKActionDescription={t('LABEL_ADD_QUICK_TAB', 'Add Quick Tab')}
                                    onClick={() =>
                                        showContextMenu(
                                            <PresetMenu
                                                tabMasterManager={tabMasterManager}
                                                isMicroSDeckInstalled={isMicroSDeckInstalled}
                                            />
                                        )
                                    }
                                >
                                    <PiListPlusBold size='1.4em' />
                                </DialogButton>
                            </Focusable>
                            <Focusable className='add-tab-btn' style={{ marginLeft: '10px' }}>
                                <DialogButton
                                    disabled={!tabMasterManager.hasSettingsLoaded}
                                    style={{
                                        height: '40px',
                                        width: '42px',
                                        minWidth: 0,
                                        padding: '10px 12px',
                                        marginLeft: 'auto',
                                        display: 'flex',
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                    }}
                                    onOKActionDescription={t('LABEL_VIEW_SHARED_TABS', 'View Shared Tabs')}
                                    onClick={() => showModalSharedTabs(tabMasterManager)}
                                >
                                    <FaSlideshare size='1.4em' />
                                </DialogButton>
                            </Focusable>
                            <Focusable className='add-tab-btn' style={{ marginLeft: '10px' }}>
                                <DialogButton
                                    disabled={!tabMasterManager.hasSettingsLoaded}
                                    style={{
                                        height: '40px',
                                        width: '42px',
                                        minWidth: 0,
                                        padding: '10px 12px',
                                        marginLeft: 'auto',
                                        display: 'flex',
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                    }}
                                    onOKActionDescription={t('LABEL_RESTORE_SETTINGS', 'Restore Settings')}
                                    onClick={handleRestorePrompt}
                                >
                                    <FaArrowRightToBracket size='1em' rotate={90} />
                                </DialogButton>
                            </Focusable>
                            <Focusable className='add-tab-btn' style={{ marginLeft: '10px' }}>
                                <DialogButton
                                    disabled={!tabMasterManager.hasSettingsLoaded}
                                    style={{
                                        height: '40px',
                                        width: '42px',
                                        minWidth: 0,
                                        padding: '10px 12px',
                                        marginLeft: 'auto',
                                        display: 'flex',
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                        marginRight: '8px',
                                    }}
                                    onOKActionDescription={'Backup Settings'}
                                    onClick={handleBackupPrompt}
                                >
                                    <FaArrowUpFromBracket size='1em' />
                                </DialogButton>
                            </Focusable>
                        </Focusable>
                    </Field>
                    {<TabsPanelSection isMicroSDeckInstalled={isMicroSDeckInstalled} />}
                    {hasSdTabs && !isMicroSDeckInstalled && microSDeckNoticeHidden && (
                        <Focusable onActivate={() => {}}>
                            <MicroSDeckNotice
                                intallState={microSDeckInstallState}
                                pluginVersion={window.MicroSDeck?.Version ?? ''}
                                libVersion={microSDeckLibVersion}
                                style={{ margin: '8px', fontSize: '11px' }}
                            />
                        </Focusable>
                    )}
                </Focusable>
            )}
        </div>
    )
}

export interface QuickAccessTitleViewProps {
    title: string
    tabMasterManager: TabMasterManager
}

const buttonStyle = {
    height: '28px',
    width: '40px',
    minWidth: 0,
    padding: 0,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
}

export const QuickAccessTitleView = ({ title, tabMasterManager }: QuickAccessTitleViewProps) => {
    return (
        <Focusable
            style={{
                display: 'flex',
                padding: '0',
                flex: 'auto',
                boxShadow: 'none',
            }}
            className={quickAccessMenuClasses.Title}
        >
            <div style={{ marginRight: 'auto' }}>{title}</div>
            <DialogButton
                disabled={!tabMasterManager.hasSettingsLoaded}
                onOKActionDescription={t('LABEL_MANAGE_TAB_PROFILES', 'Manage Tab Profiles')}
                style={buttonStyle}
                onClick={() => showContextMenu(<TabProfilesMenu tabMasterManager={tabMasterManager} />)}
            >
                <FaBookmark size='0.9em' />
            </DialogButton>
            <DialogButton
                onOKActionDescription={t('LABEL_OPEN_SETTINGS', 'Open Settings')}
                style={buttonStyle}
                onClick={() => {
                    Navigation.CloseSideMenus()
                    Navigation.Navigate('/tab-master-settings')
                }}
            >
                <FaCog size='0.9em' />
            </DialogButton>
        </Focusable>
    )
}
