import { Field, Focusable } from '@decky/ui'
import { ReactNode } from 'react'
import { FaCircleExclamation } from 'react-icons/fa6'
import { trans_string as t } from '@utils'

interface ErrorNoticeProps {
    onDismiss: () => void
    children: ReactNode
}

export const ErrorNotice = ({ onDismiss, children }: ErrorNoticeProps) => {
    return (
        <div className='notice-field-cont' style={{ paddingBottom: '10px' }}>
            <Field
                description={
                    <div style={{ margin: '8px', fontSize: '12px' }}>
                        <Focusable
                            onActivate={() => {}}
                            onSecondaryButton={onDismiss}
                            onSecondaryActionDescription={t('LABEL_CLEAR_ERROR', 'Clear Error')}
                        >
                            <h3>
                                <FaCircleExclamation style={{ height: '.8em', marginRight: '5px' }} fill='red' />
                                {t('MESSAGE_TABMASTER_ERROR', 'Tab Master encountered an error')}
                            </h3>
                            {children}
                        </Focusable>
                    </div>
                }
            />
        </div>
    )
}
