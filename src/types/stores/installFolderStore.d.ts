type InstallFolderApp = {
  nAppID: number
  nAppSize: number
  nDLCSize: number
  nShaderSize: number
  nStagedSize: number
  nUsedSize: number
  nWorkshopSize: number
  rtLastPlayed: number
  strAppName: string
  strSortAs: string
}

type InstallFolder = {
  bIsDefaultFolder: boolean
  bIsFixed: boolean
  bIsMounted: boolean
  nAppSize: number
  nCapacity: number
  nDLCSize: number
  nFolderIndex: number
  nFreeSpace: number
  nShaderSize: number
  nStagedSize: number
  nUsedSize: number
  nWorkshopSize: number
  strDriveName: string
  strUserLabel: string
  vecApps: InstallFolderApp[]
}

type InstallFolderStore = {
  AllInstallFolders: InstallFolder[]
}
