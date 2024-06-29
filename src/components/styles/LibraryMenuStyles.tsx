import { gamepadContextMenuClasses } from "decky-frontend-lib";
import { VFC } from 'react';

/**
 * CSS styling for the Library Context Menu part of TabMaster.
 */
export const LibraryMenuStyles: VFC<{}> = ({ }) => {
  return (
    <style>{`
      .${gamepadContextMenuClasses.BasicContextMenuHeader} {
        margin: 0;
      }

      .tab-master-library-menu-reorderable-group .tab-label-cont {
        display: flex;
        align-items: center;
        margin-left: 12px;
      }
      
      .tab-master-library-menu-reorderable-group .tab-label-cont .tab-label {
        margin-right: 5px;
      }
    `}</style>
  );
};
