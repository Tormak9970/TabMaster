import { findModuleChild } from '@decky/ui';
import { LogController } from './controllers/LogController';

const mobxReactionFilter = (mod: any) => {
  if (!mod || typeof mod !== "object") return;

  for (const val of Object.values(mod)) {
    if (
      typeof val === "function" &&
      val.length === 3 &&
      val.toString().includes("fireImmediately") &&
      val.toString().includes("requiresObservable")
    ) {
      return val;
    }
  }
};

const res = findModuleChild(mobxReactionFilter);
if (!res) LogController.raiseError('Could not find mobx.reaction')

export const reaction = (res || (() => {})) as typeof import("mobx").reaction;
