// Types for SteamClient.Updates

type Updates = {
  RegisterForUpdateStateChanges: (callback: (data: any) => void) => Unregisterer
  GetCurrentOSBranch: () => any
}