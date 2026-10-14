import { ConfirmModal, Field, TextField, quickAccessControlsClasses } from '@decky/ui'
import { VFC, useState, Fragment, FC } from 'react'
import { TabMasterManager, TabMasterContextProvider } from '@state'
import { TabProfileModalStyles } from '../styles/TabProfileModalStyles'
import { TabListLabel } from '../other/TabListLabel'
import { ScrollableWindow } from '../generic/ScrollableWindow'
import { DestructiveModal } from '../generic/DestructiveModal'
import { trans_string as t } from '@utils'

export interface CreateTabProfileModalProps {
    tabMasterManager: TabMasterManager
    closeModal?: () => void
}

export const CreateTabProfileModal: VFC<CreateTabProfileModalProps> = ({ tabMasterManager, closeModal }) => {
    const [name, setName] = useState<string>('')
    const visibleTabs = tabMasterManager.getTabs().visibleTabsList

    function onNameChange(e: React.ChangeEvent<HTMLInputElement>) {
        setName(e?.target.value)
    }

    return (
        <TabMasterContextProvider tabMasterManager={tabMasterManager}>
            <TabProfileModalStyles />
            <div className='tab-master-tab-profile-modal-scope'>
                <ConfirmModal
                    strTitle={t('TITLE_CREATE_NEW_TAB_PROFILE', 'Create New Tab Profile')}
                    onOK={() => {
                        tabMasterManager.tabProfileManager?.write(
                            name,
                            visibleTabs.map(tabContainer => tabContainer.id)
                        )
                        closeModal!()
                    }}
                    onCancel={() => closeModal!()}
                >
                    <div style={{ padding: '4px 16px 1px' }} className='name-field'>
                        <Field
                            description={
                                <>
                                    <div
                                        style={{ paddingBottom: '6px' }}
                                        className={quickAccessControlsClasses.PanelSectionTitle}
                                    >
                                        {t('TITLE_PROFILE_NAME', 'Profile Name')}
                                    </div>
                                    <TextField
                                        value={name}
                                        placeholder={t('PLACEHOLDER_TAB_PROFILE_NAME', 'The name of this tab profile')}
                                        onChange={onNameChange}
                                    />
                                </>
                            }
                        />
                    </div>
                    <div style={{ marginRight: '-4px' }}>
                        <ScrollableWindow height='180px' fadeAmount={'12px'} onCancel={() => closeModal!()}>
                            <div style={{ padding: '0 20px' }}>
                                {visibleTabs.map(tabContainer => (
                                    <TabItem>
                                        <TabListLabel tabContainer={tabContainer} microSDeckDisabled={false} />
                                    </TabItem>
                                ))}
                            </div>
                        </ScrollableWindow>
                    </div>
                </ConfirmModal>
            </div>
        </TabMasterContextProvider>
    )
}

export interface OverwriteTabProfileModalProps extends CreateTabProfileModalProps {
    profileName: string
}

export const OverwriteTabProfileModal: VFC<OverwriteTabProfileModalProps> = ({
    profileName,
    tabMasterManager,
    closeModal,
}) => {
    const { visibleTabsList, tabsMap } = tabMasterManager.getTabs()
    const existingTabs = tabMasterManager.tabProfileManager!.tabProfiles[profileName].map(tabId => tabsMap.get(tabId))

    return (
        <TabMasterContextProvider tabMasterManager={tabMasterManager}>
            <TabProfileModalStyles />
            <div className='tab-master-tab-profile-modal-scope'>
                <DestructiveModal
                    strTitle={`${t('TITLE_OVERWRITING_PROFILE', 'Overwriting Profile')}: ${profileName}`}
                    onOK={() => {
                        tabMasterManager.tabProfileManager?.write(
                            profileName,
                            visibleTabsList.map(tabContainer => tabContainer.id)
                        )
                        closeModal!()
                    }}
                    onCancel={() => closeModal!()}
                >
                    <div>
                        <div style={{ display: 'flex', flexDirection: 'row', padding: '0 20px', gap: '30px' }}>
                            <div
                                className={quickAccessControlsClasses.PanelSectionTitle}
                                style={{ flex: 1, paddingBottom: 0 }}
                            >
                                {t('TITLE_PROFILE_NEW_TABS', 'New Tabs')}
                            </div>
                            <div
                                className={quickAccessControlsClasses.PanelSectionTitle}
                                style={{ flex: 1, paddingBottom: 0 }}
                            >
                                {t('TITLE_PROFILE_EXISTING_TABS', 'Existing Tabs')}
                            </div>
                        </div>
                        <div style={{ height: '1.5px', background: '#ffffff1a' }} />
                        <div style={{ marginRight: '-4px' }}>
                            <ScrollableWindow height='200px' fadeAmount={'12px'} onCancel={() => closeModal!()}>
                                <div style={{ display: 'flex', flexDirection: 'row', padding: '0 20px', gap: '30px' }}>
                                    <div style={{ flex: 1 }}>
                                        {visibleTabsList.map(tabContainer => (
                                            <TabItem>
                                                <TabListLabel tabContainer={tabContainer} microSDeckDisabled={false} />
                                            </TabItem>
                                        ))}
                                    </div>
                                    <div style={{ flex: 1 }}>
                                        {existingTabs.map(tabContainer => (
                                            <TabItem>
                                                <TabListLabel tabContainer={tabContainer!} microSDeckDisabled={false} />
                                            </TabItem>
                                        ))}
                                    </div>
                                </div>
                            </ScrollableWindow>
                        </div>
                    </div>
                </DestructiveModal>
            </div>
        </TabMasterContextProvider>
    )
}

const TabItem: FC<{}> = ({ children }) => {
    return (
        <>
            <div style={{ padding: '0 15px', height: '28px', display: 'flex', fontSize: 'small' }}>{children}</div>
            <div style={{ height: '.5px', background: '#ffffff1a' }} />
        </>
    )
}
