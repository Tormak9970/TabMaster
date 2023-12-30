import { PythonInterop } from '../lib/controllers/PythonInterop';
import { TabMasterManager } from './TabMasterManager';

export type SnapshotDictionary = {
  [name: string]: string[]; //array of ordered tab ids
};

export class SnapshotManager {
  snapshots: SnapshotDictionary;

  constructor(snapshots: SnapshotDictionary) {
    this.snapshots = snapshots;
  }

  write(snapshotName: string, tabIds: string[]) {
    this.snapshots[snapshotName] = tabIds;
    this.save();
  }


  apply(snapshotName: string, tabMasterManager: TabMasterManager) {
    tabMasterManager.getTabs().tabsMap.forEach(tabContainer => tabContainer.position = -1);
    tabMasterManager.reorderTabs(this.snapshots[snapshotName]);
  }

  private save() {
    PythonInterop.setSnapshots(this.snapshots);
  }
}
