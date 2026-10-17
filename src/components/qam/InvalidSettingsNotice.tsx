import { DialogButton, Field, showModal } from '@decky/ui'
import { FaCircleExclamation } from 'react-icons/fa6'
import { DestructiveModal } from '../generic/DestructiveModal'
import { trans_string as t } from '@utils'
import { ReactNode } from 'react'

interface InvalidSettingsAlertProps {
    onOk: () => void
    children: ReactNode
}

export const InvalidSettingsNotice = ({ onOk, children }: InvalidSettingsAlertProps) => {
    const confMsg = t('MESSAGE_RESET', 'Reset')

    const onConfirm = () => {
        showModal(
            <DestructiveModal onOK={onOk} strTitle={t('TITLE_RESET_TABS', 'Reset Tabs')}>
                {t(
                    'MESSAGE_RESET_TABS_WARNING',
                    'Are you sure you want to reset tabs? A backup will be created in ~/homebrew/settings/TabMaster.'
                )}
            </DestructiveModal>
        )
    }

    return (
        <div className='notice-field-cont' style={{ paddingBottom: '10px' }}>
            <Field
                description={
                    <div style={{ margin: '8px', fontSize: '12px' }}>
                        <h3>
                            <FaCircleExclamation style={{ height: '.8em', marginRight: '5px' }} fill='red' />
                            {t('TITLE_CANT_LOAD_SETTINGS', 'Cannot Load Settings')}
                        </h3>
                        <div>
                            {t(
                                'MESSAGE_LOAD_SETTINGS_ERROR',
                                'The settings file does not adhere to the expected structure and could not be loaded. This could be due to various reasons such as a change in Steam or a bug in TabMaster. In order to continue the issue must be corrected. Alternatively you can reset the tab settings to default. This will erase all settings, but a copy of the current settings will automatically be saved as a backup. A future TabMaster update may be able to correct the issue, however manually restoring the backup will still be necessary.'
                            )}
                        </div>
                        {children}
                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                            <DialogButton
                                style={{ margin: '10px 8px 0px', width: 'auto' }}
                                onClick={onConfirm}
                                onOKActionDescription={confMsg}
                            >
                                {confMsg}
                            </DialogButton>
                        </div>
                    </div>
                }
            />
        </div>
    )
}
