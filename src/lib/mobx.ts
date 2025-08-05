import { findModuleChild } from 'decky-frontend-lib';

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

export const reaction = findModuleChild(mobxReactionFilter) as typeof import("mobx").reaction;
