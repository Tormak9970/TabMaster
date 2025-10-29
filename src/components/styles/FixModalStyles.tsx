import { gamepadDialogClasses } from "@decky/ui";
import { VFC } from "react";

/**
 * All css styling for TabMaster's fix modals.
 */
export const FixModalStyles: VFC<{}> = ({}) => {
  return (
    <style>{`
      .tab-master-fix-modal-scope .${gamepadDialogClasses.GamepadDialogContent} .DialogHeader {
        margin-left: 15px;
      }

      .tab-master-fix-modal-scope .${gamepadDialogClasses.ModalPosition} > .${gamepadDialogClasses.GamepadDialogContent} {
        background: radial-gradient(155.42% 100% at 0% 0%, #060a0e 0 0%, #0e141b 100%);
      }
      
      /* The button item */
      .tab-master-fix-modal-scope .styled-btn {
        padding: 0 !important;
      }
      .tab-master-fix-modal-scope .styled-btn .${gamepadDialogClasses.FieldLabel} {
        display: none;
      }
      .tab-master-fix-modal-scope .styled-btn .${gamepadDialogClasses.FieldChildren} {
        width: 100%;
      }
      .tab-master-fix-modal-scope .styled-btn .${(gamepadDialogClasses as any).FieldChildrenWithIcon} {
        width: 100%;
      }

      /* The button item wrapper */
      .tab-master-fix-modal-scope .filter-entry .${gamepadDialogClasses.Field} {
        padding: 0;
        margin: 0;
      }
      /* The button item label */
      .tab-master-fix-modal-scope .filter-entry .${gamepadDialogClasses.FieldLabel} {
        display: none;
      }
      /* The button item */
      .tab-master-fix-modal-scope .filter-entry .${gamepadDialogClasses.FieldChildren} > button.${gamepadDialogClasses.Button}.DialogButton {
        padding: 10px;
        min-width: 45px;
      }

      .tab-master-fix-modal-scope .no-sep .${gamepadDialogClasses.Field}.${gamepadDialogClasses.WithBottomSeparatorStandard}::after,
      .tab-master-fix-modal-scope .no-sep.${gamepadDialogClasses.Field}.${gamepadDialogClasses.WithBottomSeparatorStandard}::after {
        display: none
      }

      /* Filter section start */
      .tab-master-fix-modal-scope .filter-start-cont {
        width: 114%;
        margin-left: -40px;
        padding: 0;

        font-size: 14px;
      }
      
      /* Focused styles */
      .tab-master-fix-modal-scope .filter-start-cont.start-focused,
      .tab-master-fix-modal-scope .filter-start-cont.tab-errors.start-focused {
        background-color: #3d4450 !important;
      }

      /* merge entries */
      .tab-master-fix-modal-scope .merge-filter-entries .merge-filter-entry {
        margin: 5px;
      }

      /* Error Accordion styles */
      .tab-master-fix-modal-scope .filter-start-cont.tab-errors {
        background-color: #23262e;
      }
      .tab-master-fix-modal-scope .filter-start-cont .check-cont {
        color: #a9a9a9;
      }
      .tab-master-fix-modal-scope .filter-start-cont > button > svg {
        fill: #a9a9a9;
      }
      
      /* Focused styles */
      .tab-master-fix-modal-scope .filter-start-cont.start-focused .check-cont {
        color: #f5f5f5;
      }
      .tab-master-fix-modal-scope .filter-start-cont.start-focused > button > svg {
        fill: #f5f5f5;
      }

      /* merge entries */
      .tab-master-fix-modal-scope .merge-filter-entries .merge-filter-entry {
        margin: 5px;
      }

      .tab-master-fix-modal-scope .check-cont {
        display: flex;
        align-items: center;
      }
    
      .tab-master-fix-modal-scope .check-cont svg {
        margin-left: -6px;
        margin-right: 10px;
      }
    `}</style>
  );
}
