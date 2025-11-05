import { gamepadDialogClasses } from "@decky/ui";
import { VFC } from "react";

/**
 * All css styling for TabMaster's filter selection.
 */
export const FilterSelectStyles: VFC<{}> = ({}) => {
  return (
    <style>{`
      .tab-master-filter-select {
        width: 100%;
        height: auto;
      }

      .tab-master-filter-select .${gamepadDialogClasses.ModalPosition} > .${gamepadDialogClasses.GamepadDialogContent} {
        background: radial-gradient(155.42% 100% at 0% 0%, #060a0e 0 0%, #0e141b 100%);
      }

      .tab-master-filter-select .entry-label {
        font-size: 22px;
        text-align: initial;
      }

      .tab-master-filter-select .entry-disabled {
        color: #92939B;
        background-color: #20222996;
      }

      .tab-master-filter-select .entry-desc {
        font-size: 16px;
        text-align: initial;
      }
    `}</style>
  );
}
