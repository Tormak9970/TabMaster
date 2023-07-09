import { findModuleChild } from "decky-frontend-lib";


const ScrollingModule = findModuleChild((mod) => {
  if (typeof mod !== 'object' || !mod.__esModule) return undefined;
  if (mod.ScrollPanel) return mod;
})

export const ScrollPanel = ScrollingModule.ScrollPanel;
