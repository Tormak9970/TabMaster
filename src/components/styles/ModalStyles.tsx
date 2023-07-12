import { gamepadDialogClasses } from "decky-frontend-lib";
import { VFC } from "react";

/**
 * All css styling for TabMaster's modals.
 */
export const ModalStyles: VFC<{}> = ({}) => {
  return (
    <style>{`
      .tab-master-modal-scope .${gamepadDialogClasses.GamepadDialogContent} .DialogHeader {
        margin-left: 15px;
      }
      
      /* The button item */
      .tab-master-modal-scope .styled-btn {
        padding: 0 !important;
      }
      .tab-master-modal-scope .styled-btn .${gamepadDialogClasses.FieldLabel} {
        display: none;
      }
      .tab-master-modal-scope .styled-btn .${gamepadDialogClasses.FieldChildren} {
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
      .tab-master-modal-scope .filter-entry .${gamepadDialogClasses.FieldChildren} > button.${gamepadDialogClasses.Button}.DialogButton {
        padding: 10px;
        min-width: 45px;
      }

      .tab-master-modal-scope .no-sep .${gamepadDialogClasses.Field}.${gamepadDialogClasses.WithBottomSeparatorStandard}::after,
      .tab-master-modal-scope .no-sep.${gamepadDialogClasses.Field}.${gamepadDialogClasses.WithBottomSeparatorStandard}::after {
        display: none
      }

      /* Filter section start */
      .tab-master-modal-scope .filter-start-cont {
        width: 114%;
        margin-left: -40px;
        padding: 0;

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
      
      /* Focused styles */
      .tab-master-modal-scope .filter-start-cont.start-focused {
        background-color: #3d4450 !important;
      }
      .tab-master-modal-scope .filter-start-cont.start-focused .filter-line {
        background: #a9a9a9;
      }
      .tab-master-modal-scope .filter-start-cont.start-focused .filter-label {
        color: #a9a9a9;
      }

      /* merge entries */
      .tab-master-modal-scope .merge-filter-entries .merge-filter-entry {
        margin: 5px;
      }

      /* red buttons on destructive modals, matches steams */
      .tab-master-destructive-modal button.${gamepadDialogClasses.Button}.DialogButton.gpfocus.Primary {
        background: #de3618;
        color: #fff
      }

      /* merge entries */
      .tab-master-modal-scope .merge-filter-entries .merge-filter-entry {
        margin: 5px;
      }
    `}</style>
  );
}
