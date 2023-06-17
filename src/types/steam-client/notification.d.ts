// Types for SteamClient.Notifications

type Notifications = {
  RegisterForNotifications: (callback: (unk1: number, unk2: number, unk3: ArrayBuffer) => void) => Unregisterer
}