// Types for SteamClient.Screenshots

type Screenshots = {
  GetLastScreenshotTake: () => Promise<Screenshot>,
  GetAllLocalScreenshots: () => Promise<Screenshot[]>,
  GetAllAppsLocalScreenshots: () => Promise<Screenshot[]>
}

type Screenshot = {
  bSpoilers: boolean,
  bUploaded: boolean,
  ePrivacy: number,
  hHandle: number,
  nAppID: number,
  nCreated: number,
  nHeight: number,
  nWidth: number,
  strCaption: "",
  strUrl: string,
  ugcHandle: string
};