import { gamepadDialogClasses } from "@decky/ui";
import { VFC } from "react";

// New modal background should be "radial-gradient(155.42% 100% at 0% 0%, #060a0e 0 0%, #0e141b 100%)"

/**
 * CSS styling for TabMaster's Tab profile modals.
 */
export const TabProfileModalStyles: VFC<{}> = ({}) => {
  return (
    <style>{`
      .tab-master-tab-profile-modal-scope .${gamepadDialogClasses.GamepadDialogContent} .DialogHeader {
        margin-left: 15px;
      }

      .tab-master-tab-profile-modal-scope .${gamepadDialogClasses.ModalPosition} > .${gamepadDialogClasses.GamepadDialogContent} {
        background: radial-gradient(155.42% 100% at 0% 0%, #060a0e 0 0%, #0e141b 100%);
      }
      
      /* The button item */
      .tab-master-tab-profile-modal-scope .styled-btn {
        padding: 0 !important;
      }
      .tab-master-tab-profile-modal-scope .styled-btn .${gamepadDialogClasses.FieldLabel} {
        display: none;
      }
      .tab-master-tab-profile-modal-scope .styled-btn .${gamepadDialogClasses.FieldChildren} {
        width: 100%;
      }
      .tab-master-tab-profile-modal-scope .styled-btn .${(gamepadDialogClasses as any).FieldChildrenWithIcon} {
        width: 100%;
      }

      /* The button item wrapper */
      .tab-master-tab-profile-modal-scope .name-field .${gamepadDialogClasses.Field} {
        padding-bottom: 16px;
        padding-top: 0px;
      }
      .tab-master-tab-profile-modal-scope .${gamepadDialogClasses.Field}.${gamepadDialogClasses.WithBottomSeparatorStandard}::after {
        left: 1vw;
        right: 1vw;
      }
      
      /* Focused styles */
      .tab-master-tab-profile-modal-scope .start-focused {
        background-color: rgba(255, 255, 255, 0.15);
        animation-name: gamepaddialog_ItemFocusAnim-darkGrey_2zfa-;
      }
      .tab-master-tab-profile-modal-scope .highlight-on-focus {
        animation-duration: .5s;
        animation-fill-mode: forwards;
        animation-timing-function: cubic-bezier(0.17, 0.45, 0.14, 0.83);
      }
    `}</style>
  );
}
