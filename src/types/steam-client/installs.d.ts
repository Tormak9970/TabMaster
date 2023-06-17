// Types for SteamClient.Installs

type Installs = {
  RegisterForShowInstallWizard: (callback: (data: InstallWizardInfo) => void) => Unregisterer,
}

type InstallWizardInfo = {
  bCanChangeInstallFolder: boolean,
  bIsRetailInstall: boolean,
  currentAppID: number,
  eAppError: number,
  eInstallState: number, //probably a LUT for install status
  errorDetail: string,
  iInstallFolder: number, //LUT for install folders
  iUnmountedFolder: number,
  nDiskSpaceAvailable: number,
  nDiskSpaceRequired: number,
  rgAppIDs: number[],
}