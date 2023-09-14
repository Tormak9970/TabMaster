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
      .tab-master-modal-scope .styled-btn .${(gamepadDialogClasses as any).FieldChildrenWithIcon} {
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
      .tab-master-modal-scope .name-field .${gamepadDialogClasses.Field} {
        padding-bottom: 16px;
        padding-top: 0px;
      }
      .tab-master-modal-scope .${gamepadDialogClasses.Field}.${gamepadDialogClasses.WithBottomSeparatorStandard}::after {
        left: 1vw;
        right: 1vw;
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
      .tab-master-modal-scope .start-focused {
        background-color: #3d4450 !important;
      }
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
      .tab-master-modal-scope .merge-filter-entries .merge-filter-entry-container {
        margin: 5px;
        display: flex; 
        justify-content: space-between;
      }

      .tab-master-modal-scope .slider-with-dropdown-container .${gamepadDialogClasses.Field} {
        padding-right: 154px;
        width: 100%;
      }
      .tab-master-modal-scope .slider-with-2dropdown-container .${gamepadDialogClasses.Field} {
        padding-right: 279px;
        width: 100%;
      }
      .tab-master-modal-scope .slider-with-2dropdown-container.wide-dropdown .${gamepadDialogClasses.Field} {
        padding-right: 294px;
      }
    `}</style>
  );
}
