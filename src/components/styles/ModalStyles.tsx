import { gamepadDialogClasses } from "decky-frontend-lib";
import { VFC } from "react";

export const modalMargin = '16px + 2.8vw';

// New modal background should be "radial-gradient(155.42% 100% at 0% 0%, #060a0e 0 0%, #0e141b 100%)"

/**
 * All css styling for TabMaster's modals.
 */
export const ModalStyles: VFC<{}> = ({}) => {
  return (
    <style>{`
      .tab-master-modal-scope .${gamepadDialogClasses.GamepadDialogContent} .DialogHeader {
        margin-left: 15px;
      }

      .tab-master-modal-scope .${gamepadDialogClasses.ModalPosition} > .${gamepadDialogClasses.GamepadDialogContent} {
        background: radial-gradient(155.42% 100% at 0% 0%, #060a0e 0 0%, #0e141b 100%);
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
        margin-left: calc((${modalMargin}) * -1);
        margin-right: calc((${modalMargin}) * -1);
        padding: 0;

        font-size: 14px;
      }
      .tab-master-modal-scope .filter-start-cont .filter-line {
        height: 2px;
        
        background: #23262e;
      }
      .tab-master-modal-scope .filter-start-cont .filter-accordion-arrow,
      .tab-master-modal-scope .filter-start-cont .filter-label {
        margin: 0px 5px;
        color: #343945;
      }
      
      /* Focused styles */
      .tab-master-modal-scope .start-focused {
        background-color: rgba(255, 255, 255, 0.15);
        animation-name: gamepaddialog_ItemFocusAnim-darkGrey_2zfa-;
      }
      .tab-master-modal-scope .highlight-on-focus {
        animation-duration: .5s;
        animation-fill-mode: forwards;
        animation-timing-function: cubic-bezier(0.17, 0.45, 0.14, 0.83);
      }
      .tab-master-modal-scope .filter-start-cont.start-focused .filter-line {
        background: #a9a9a9;
      }
      .tab-master-modal-scope .filter-start-cont.start-focused .filter-accordion-arrow,
      .tab-master-modal-scope .filter-start-cont.start-focused .filter-label {
        color: #a9a9a9;
      }

      .autohide-toggle-container .${gamepadDialogClasses.Field} {
        padding: 10px calc(28px + 1.4vw);
      }

      .autohide-toggle-container .${gamepadDialogClasses.FieldLabel} {
        color: #8b929a;
        font-size: 12px;
      }
    `}</style>
  );
}
