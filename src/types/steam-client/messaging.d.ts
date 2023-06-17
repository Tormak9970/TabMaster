// Types for SteamClient.Messaging

type Messaging = {
  PostMessage: () => void,
  RegisterForMessages: (accountName: string, callback: (data: any) => void) => Unregisterer
}