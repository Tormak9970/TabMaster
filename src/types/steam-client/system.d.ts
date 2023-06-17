// Types for SteamClient.System

type System = {
  RegisterForOnSuspendRequest: (callback: (data: any) => void) => Unregisterer,
}