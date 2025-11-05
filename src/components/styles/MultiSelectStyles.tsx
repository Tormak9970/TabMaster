import { gamepadDialogClasses } from "@decky/ui";
import { VFC } from "react";

/**
 * All css styling for the TabMaster MultiSelect component.
 */
export const MultiSelectStyles: VFC<{}> = ({}) => {
  return (
    <style>{`
      /* The button item wrapper */
      .tab-master-modal-scope .multi-select .${gamepadDialogClasses.Field} {
        padding: 0;
        margin: 0;
      }
      /* The button item label */
      .tab-master-modal-scope .multi-select .${gamepadDialogClasses.FieldLabel} {
        display: none;
      }
      /* The button item */
      .tab-master-modal-scope .multi-select button.${gamepadDialogClasses.Button}.DialogButton {
        min-width: 45px;
      }
    `}</style>
  );
}
