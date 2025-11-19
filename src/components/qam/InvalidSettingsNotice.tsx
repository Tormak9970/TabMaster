import { DialogButton, Field, showModal } from '@decky/ui';
import { FC } from 'react';
import { FaCircleExclamation } from 'react-icons/fa6';
import { DestructiveModal } from '../generic/DestructiveModal';

interface InvalidSettingsAlertProps {
  onOk: () => void;
}

export const InvalidSettingsNotice: FC<InvalidSettingsAlertProps> = ({ onOk, children }) => {
  const confMsg = 'Reset';

  const onConfirm = () => {
    showModal(
      <DestructiveModal onOK={onOk} strTitle="Reset Tabs" >
        Are you sure you want to reset tabs? A backup will be created in ~/homebrew/settings/TabMaster.
      </DestructiveModal>
    );
  };

  return (
    <div className='notice-field-cont' style={{ paddingBottom: '10px' }}>
      <Field description={
        <div style={{ margin: '8px', fontSize: '12px' }}>
          <h3>
            <FaCircleExclamation style={{ height: '.8em', marginRight: '5px' }} fill="red" />
            Cannot Load Settings
          </h3>
          <div>
            The settings file does not adhere to the expected structure and could not be loaded.
            This could be due to various reasons such as a change in Steam or a bug in TabMaster.
            In order to continue the issue must be corrected or alternatively you can reset the tab settings to default.
            This will erase all settings, but a copy of the current settings will automatically be saved as a backup.
            A future TabMaster update may be able to correct the issue, however manually restoring the backup will still be necessary.
          </div>
          {children}
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <DialogButton style={{ margin: '10px 8px 0px', width: 'auto' }} onClick={onConfirm} onOKActionDescription={confMsg}>
              {confMsg}
            </DialogButton>
          </div>
        </div>}
      />
    </div>
  );
};
