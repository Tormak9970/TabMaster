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

      @keyframes tab-master-arrow-bounce-up {
        0% { transform: translateY(1px)  }
        50% { transform: translateY(-2px) }
        100% { transform: translateY(1px) }
      }

      @keyframes tab-master-arrow-bounce-down {
        0% { transform: translateY(-1px)  }
        50% { transform: translateY(2px) }
        100% { transform: translateY(-1px) }
      }
      
      .tab-master-list-search-modal .more-above-arrow {
        position: absolute;
        top: 14px;

        display: flex;
        justify-content: center;
        width: 100%;

        transition: visibility 0.2s ease-in-out;

        animation: tab-master-arrow-bounce-up 2.7s infinite ease-in-out;
      }

      .tab-master-list-search-modal .more-below-arrow {
        position: absolute;
        bottom: -16px;

        display: flex;
        justify-content: center;
        width: 100%;

        transition: visibility 0.2s ease-in-out;

        animation: tab-master-arrow-bounce-down 2.7s infinite ease-in-out;
      }
    `}</style>
  );
}
