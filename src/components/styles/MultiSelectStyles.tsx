import { gamepadDialogClasses } from "decky-frontend-lib";
import { VFC } from "react";

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
        padding: 10px;
        min-width: 45px;
      }

      .tab-master-modal-scope .filter-params-input .${gamepadDialogClasses.Field}.${gamepadDialogClasses.WithBottomSeparatorStandard}::after {
        display: none
      }
    `}</style>
  );
}