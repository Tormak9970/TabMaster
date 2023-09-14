import { ConfirmModal, ConfirmModalProps, gamepadDialogClasses } from 'decky-frontend-lib';
import { Fragment, VFC } from 'react';

export interface DestructiveModalProps extends Omit<ConfirmModalProps, 'bDestructiveWarning' > {

}

export const DestructiveModal: VFC<DestructiveModalProps> = ({ className, ...props }) => {

  return <>
    <style>{`.tab-master-destructive-modal button.${gamepadDialogClasses.Button}.DialogButton.gpfocus.Primary {
        background: #de3618;
        color: #fff
      }`}</style>
    <ConfirmModal
      className={'tab-master-destructive-modal' + (className ? ` ${className}`: '')}
      {...props}
    />
  </>;

};
