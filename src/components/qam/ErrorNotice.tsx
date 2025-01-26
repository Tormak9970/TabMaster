import { Field, Focusable } from 'decky-frontend-lib';
import { FC } from 'react';
import { FaCircleExclamation } from 'react-icons/fa6';

interface ErrorNoticeProps {
  onDismiss: () => void;
}

export const ErrorNotice: FC<ErrorNoticeProps> = ({ onDismiss, children }) => {

  return (
    <div className='notice-field-cont' style={{ paddingBottom: '10px' }}>
      <Field description={
        <div style={{ margin: '8px', fontSize: '12px' }}>
          <Focusable onActivate={() => { }} onSecondaryButton={onDismiss} onSecondaryActionDescription='Clear Error'>
            <h3>
              <FaCircleExclamation style={{ height: '.8em', marginRight: '5px' }} fill="red" />
              Tab Master encountered an error
            </h3>
            {children}
          </Focusable>
        </div>}
      />
    </div>
  );
};
