import { gamepadDialogClasses } from "decky-frontend-lib";
import { VFC } from "react";

export const ModalStyles: VFC<{}> = ({}) => {
  return (
    <style>{`
      .tab-master-modal-scope .${gamepadDialogClasses.GamepadDialogContent} .DialogHeader {
        margin-left: 15px;
      }
      
      /* The button item */
      .tab-master-modal-scope .add-filter-btn {
        padding: 0 !important;
      }
      .tab-master-modal-scope .add-filter-btn .${gamepadDialogClasses.FieldLabel} {
        display: none;
      }
      .tab-master-modal-scope .add-filter-btn .${gamepadDialogClasses.FieldChildren} {
        width: 100%;
      }

      /* The button item wrapper */
      .tab-master-modal-scope .filter-entry .${gamepadDialogClasses.Field} {
        padding: 0;
        margin: 0;
      }
      /* The button item label */
      .tab-master-modal-scope .filter-entry .${gamepadDialogClasses.FieldLabel} {
        display: none;
      }
      /* The button item */
      .tab-master-modal-scope .filter-entry button.${gamepadDialogClasses.Button}.DialogButton {
        padding: 10px;
        min-width: 45px;
      }

      .tab-master-modal-scope .filter-params-input .${gamepadDialogClasses.Field}.${gamepadDialogClasses.WithBottomSeparatorStandard}::after {
        display: none
      }

      /* Filter section start */
      .tab-master-modal-scope .filter-start-cont {
        width: 114%;
        margin-left: -40px;
        padding: 0;

        display: flex;
        flex-direction: row;

        justify-content: space-between;
        align-items: center;

        font-size: 14px;
      }
      .tab-master-modal-scope .filter-start-cont .filter-line {
        height: 2px;
        flex-grow: 1;
        
        background: #23262e;
      }
      .tab-master-modal-scope .filter-start-cont .filter-label {
        margin: 0px 5px;
        color: #343945;
      }
    `}</style>
  );
}