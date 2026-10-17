import { DialogButton, ModalRoot, PanelSection, PanelSectionRow } from '@decky/ui'
import { useState, useEffect, Fragment } from 'react'
import { PythonInterop } from '@lib'
import { TabMasterContextProvider, type TabMasterManager } from '@state'
import { TabErrorsPanel } from '../changes-needed/TabErrorsPanel'
import { FixModalStyles } from '../styles/FixModalStyles'
import { trans_string as t } from '@utils'
import { TabSettingsDictionary, FilterErrorEntry, TabSettings } from '@types'

type FixTabErrorsModalRootProps = {
    closeModal?: () => void
    onConfirm: (fixedTabSettings: TabSettingsDictionary) => void
    tabs: TabSettingsDictionary
    erroredFiltersMap: Map<string, FilterErrorEntry[]>
    tabMasterManager: TabMasterManager
}

/**
 * Modal root for the Changes Needed modal.
 */
export const FixTabErrorsModalRoot = ({
    closeModal,
    onConfirm,
    tabs,
    erroredFiltersMap,
    tabMasterManager,
}: FixTabErrorsModalRootProps) => {
    return (
        <>
            <FixModalStyles />
            <div className='tab-master-fix-modal-scope'>
                {/* Steam throws a fit if onCancel isn't present, so we made it do nothing */}
                <ModalRoot bAllowFullSize onCancel={() => {}}>
                    <TabMasterContextProvider tabMasterManager={tabMasterManager}>
                        <FixTabErrorsModal
                            onConfirm={onConfirm}
                            closeModal={closeModal!}
                            tabs={{ ...tabs }}
                            erroredFiltersMap={erroredFiltersMap}
                        />
                    </TabMasterContextProvider>
                </ModalRoot>
            </div>
        </>
    )
}

type FixTabErrorsModalProps = {
    onConfirm: (fixedTabSettings: TabSettingsDictionary) => void
    closeModal: () => void
    tabs: TabSettingsDictionary
    erroredFiltersMap: Map<string, FilterErrorEntry[]>
}

/**
 * The modal for fixing tabs with filter errors.
 */
const FixTabErrorsModal = ({ onConfirm, closeModal, tabs, erroredFiltersMap }: FixTabErrorsModalProps) => {
    const [changedTabs, setChangedTabs] = useState<TabSettingsDictionary>(
        Object.fromEntries(Object.entries(tabs).filter(([id]) => erroredFiltersMap.has(id)))
    )
    const [isPassingMap, setIsPassingMap] = useState<{ [tabId: string]: boolean }>(
        Object.fromEntries(Array.from(erroredFiltersMap.keys(), tabId => [tabId, false]))
    )
    const [canApply, setCanApply] = useState<boolean>(false)

    useEffect(() => {
        setCanApply(Object.values(isPassingMap).every(isPassing => isPassing))
    }, [isPassingMap])

    function updateTabStatus(tab: TabSettings, isPassing: boolean) {
        const passingMap = { ...isPassingMap }
        passingMap[tab.id] = isPassing
        setIsPassingMap(passingMap)

        const fixedTabs = { ...changedTabs }
        fixedTabs[tab.id] = tab
        setChangedTabs(fixedTabs)
    }

    function onApply() {
        if (canApply) {
            const updatedTabs: TabSettingsDictionary = { ...tabs }
            for (const changedTab of Object.values(changedTabs)) {
                changedTab.filters = changedTab.filters!.flatMap(filter => filter)
                updatedTabs[changedTab.id] = changedTab
            }
            onConfirm(updatedTabs)
            closeModal()
        } else {
            PythonInterop.toast(
                t('TITLE_ERROR', 'Error'),
                t('MESSAGE_MUST_FIX_ALL_TAB_ERRORS', 'Please fix all tabs before saving')
            )
        }
    }

    return (
        <>
            <PanelSection>
                <h1>{t('TITLE_TAB_FIXES_NEEDED', 'Fixes Needed for One or More Tabs')}</h1>
                <PanelSectionRow>
                    {erroredFiltersMap.size > 1
                        ? t(
                              'MESSAGE_TAB_ERRORS_FOUND_PLURAL',
                              'TabMaster has found an issue with one or more of your tabs. Please take a moment to review the issues below, and correct them.'
                          )
                        : t(
                              'MESSAGE_TAB_ERRORS_FOUND_SINGULAR',
                              'TabMaster has found an issue with one or more of your tabs. Please take a moment to review the issue below, and correct it.'
                          )}
                </PanelSectionRow>
            </PanelSection>
            <PanelSection title={t('TITLE_TABS_WITH_ERRORS', 'Tabs With Errors')}>
                <PanelSectionRow>
                    {Object.values(changedTabs).map((tab: TabSettings, idx: number) => {
                        return (
                            <TabErrorsPanel
                                index={idx}
                                tab={tab}
                                errorEntries={erroredFiltersMap.get(tab.id)!}
                                onTabStatusChange={updateTabStatus}
                            />
                        )
                    })}
                </PanelSectionRow>
            </PanelSection>
            <PanelSection>
                <PanelSectionRow>
                    <DialogButton
                        onOKButton={onApply}
                        onOKActionDescription={t('LABEL_APPLY_YOUR_FIXES', 'Apply Your Fixes')}
                        onClick={onApply}
                        disabled={!canApply}
                    >
                        {t('LABEL_APPLY_TAB_FIXES', 'Apply Fixes')}
                    </DialogButton>
                </PanelSectionRow>
            </PanelSection>
        </>
    )
}
