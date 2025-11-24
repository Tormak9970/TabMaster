import { gamepadDialogClasses, quickAccessControlsClasses } from "@decky/ui";
import { VFC } from "react";

/**
 * All css styling for TabMaster's SharedTabsModal.
 */
export const SharedTabsModalStyles: VFC<{}> = ({}) => {
  return (
    <style>{`
      .tab-master-shared-tabs-modal .${quickAccessControlsClasses.PanelSection} {
        margin: 0px;
        padding: 0px;
      }
      .tab-master-shared-tabs-modal .${quickAccessControlsClasses.PanelSection}:first-of-type {
        margin: 0px;
      }

      .tab-master-shared-tabs-modal .${gamepadDialogClasses.ModalPosition} > .${gamepadDialogClasses.GamepadDialogContent} {
        background: radial-gradient(155.42% 100% at 0% 0%, #060a0e 0 0%, #0e141b 100%);
      }

      /* Filter section start */
      .tab-master-shared-tabs-modal .filter-start-cont {
        margin-left: -2.8vw;
        margin-right: -2.8vw;
        padding: 0;

        font-size: 14px;
      }
      .tab-master-shared-tabs-modal .filter-start-cont .filter-line {
        height: 2px;
        
        background: #23262e;
      }
      .tab-master-shared-tabs-modal .filter-start-cont .filter-accordion-arrow,
      .tab-master-shared-tabs-modal .filter-start-cont .filter-label {
        margin: 0px 5px;
        color: #343945;
      }
      
      /* Focused styles */
      .tab-master-shared-tabs-modal .start-focused {
        background-color: rgba(255, 255, 255, 0.15);
        animation-name: gamepaddialog_ItemFocusAnim-darkGrey_2zfa-;
      }
      .tab-master-shared-tabs-modal .highlight-on-focus {
        animation-duration: .5s;
        animation-fill-mode: forwards;
        animation-timing-function: cubic-bezier(0.17, 0.45, 0.14, 0.83);
      }
      .tab-master-shared-tabs-modal .filter-start-cont.start-focused .filter-line {
        background: #a9a9a9;
      }
      .tab-master-shared-tabs-modal .filter-start-cont.start-focused .filter-accordion-arrow,
      .tab-master-shared-tabs-modal .filter-start-cont.start-focused .filter-label {
        color: #a9a9a9;
      }

      .tab-master-shared-tabs-modal .spinnyboi {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 100%;
        position: fixed;
        height: 100vh;
        top: 0;
        flex: 1;
        left: 0;
        right: 0;
        z-index: 6;
        background: #0E141B;
        transition: opacity ease-out 250ms, z-index 0s;
        will-change: opacity;
      }

      .tab-master-shared-tabs-modal .spinnyboi > img {
        transform: scale(0.75);
        transition: transform ease-out 300ms;
        will-change: transform;
        margin-top: calc(var(--basicui-header-height) * -1);
      }

      .tab-master-shared-tabs-modal .spinnyboi.loaded {
        z-index: -1;
        opacity: 0;
        transition-delay: 0ms, 300ms;
      }

      .tab-master-shared-tabs-modal .spinnyboi.loaded > img {
        transform: scale(0.6);
      }
    `}</style>
  );
}
