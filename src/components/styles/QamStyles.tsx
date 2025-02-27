import { gamepadDialogClasses, quickAccessControlsClasses, scrollPanelClasses } from "decky-frontend-lib";
import { VFC } from "react";

 const deckyQamTabClass = 'tab_undefined'

/**
 * All css styling for the Quick Access Menu part of TabMaster.
 */
export const QamStyles: VFC<{}> = ({}) => {
  return (
    <style>{`
      .${deckyQamTabClass}.${scrollPanelClasses.ScrollPanel} {
        scroll-padding: 48px 0px 0px;
      }
        
      .tab-master-scope {
        width: inherit;
        height: inherit;

        flex: 1 1 1px;
        display: flex;
        flex-direction: column;
        justify-content: flex-start;
        align-content: stretch;
      }

      .tab-master-scope .${quickAccessControlsClasses.PanelSection} {
        padding: 0px;
      }
      .tab-master-scope .${quickAccessControlsClasses.PanelSectionTitle} {
        margin-top: 3px;
        margin-left: 5px;
      }

      .tab-master-scope .${gamepadDialogClasses.FieldChildren} {
        margin: 0px 16px;
      }
      .tab-master-scope .${gamepadDialogClasses.FieldLabel} {
        margin-left: 16px;
      }

      .tab-master-scope .add-tab-btn .${gamepadDialogClasses.Field}.${gamepadDialogClasses.WithBottomSeparatorStandard}::after {
        display: none;
      }
      .tab-master-scope .add-tab-btn .${gamepadDialogClasses.FieldLabel} {
        display: none;
      }
      .tab-master-scope .add-tab-btn .${gamepadDialogClasses.FieldChildren} {
        width: calc(100% - 32px);
      }

      .tab-master-scope .seperator {
        width: 100%;
        height: 1px;
        background: #23262e;
      }

      .tab-master-scope .hidden-tab-btn button.${gamepadDialogClasses.Button}.DialogButton {
        min-width: 50px;
      }
      .tab-master-scope .hidden-tab-btn .${(gamepadDialogClasses as any).FieldChildrenInner} {
        min-width: 50px;
        margin-right: 8px;
      }


      .tab-master-scope .tab-label-cont {
        display: flex;
        align-items: center;
      }

      .tab-master-scope .tab-label-cont .tab-label {
        margin-right: 5px;
      }

      .tab-master-scope .no-sep .${gamepadDialogClasses.FieldLabel},
      .tab-master-scope .no-sep .${gamepadDialogClasses.Field}.${gamepadDialogClasses.WithBottomSeparatorStandard}::after,
      .tab-master-scope .no-sep.${gamepadDialogClasses.Field}.${gamepadDialogClasses.WithBottomSeparatorStandard}::after {
        display: none
      }

      .tab-master-scope .no-sep .${gamepadDialogClasses.FieldChildren} {
        width: 100%;
      }
      .tab-master-scope .no-sep .${(gamepadDialogClasses as any).FieldChildrenWithIcon} {
        width: calc(100% - 10px);
      }

      .tab-master-scope .notice-field-cont .${gamepadDialogClasses.Field} {
        padding-top: 0;
      }
      .tab-master-scope .notice-field-cont .${gamepadDialogClasses.FieldLabel} {
        display: none;
      }
    `}</style>
  );
}
