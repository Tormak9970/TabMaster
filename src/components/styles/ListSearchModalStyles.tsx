import { quickAccessControlsClasses } from "decky-frontend-lib";
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
    `}</style>
  );
}
