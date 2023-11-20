import { gamepadDialogClasses, quickAccessControlsClasses } from "decky-frontend-lib";
import { VFC } from "react";

/**
 * All css styling for TabMaster's ListSearchModal.
 */
export const ListSearchModalStyles: VFC<{}> = ({}) => {
  return (
    <style>{`
      .tab-master-list-search-modal .${quickAccessControlsClasses.PanelSection} {
        margin: 0px;
        padding: 0px;
      }
      .tab-master-list-search-modal .${quickAccessControlsClasses.PanelSection}:first-of-type {
        margin: 0px;
      }

      .tab-master-list-search-modal .${gamepadDialogClasses.ModalPosition} > .${gamepadDialogClasses.GamepadDialogContent} {
        background: radial-gradient(155.42% 100% at 0% 0%, #060a0e 0 0%, #0e141b 100%);
      }
    `}</style>
  );
}
