interface SteamClient {
  Apps: Apps,
  Browser: any,
  BrowserView: any,
  ClientNotifications: any,
  Cloud: any,
  Console: any,
  Downloads: Downloads,
  FamilySharing: any,
  FriendSettings: any,
  Friends: any,
  GameSessions: GameSession,
  Input: any,
  InstallFolder: any,
  Installs: Installs,
  MachineStorage: any,
  Messaging: Messaging,
  Notifications: Notifications,
  OpenVR: any,
  Overlay: any,
  Parental: any,
  RegisterIFrameNavigatedCallback: any,
  RemotePlay: any,
  RoamingStorage: any,
  Screenshots: Screenshots,
  Settings: any,
  SharedConnection: any,
  Stats: any,
  Storage: any,
  Streaming: any,
  System: System,
  UI: any,
  URL: any,
  Updates: Updates,
  User: User,
  WebChat: any,
  Window: Window
}

type SteamAppAchievements = {
  nAchieved:number
  nTotal:number
  vecAchievedHidden:any[]
  vecHighlight:any[]
  vecUnachieved:any[]
}

type SteamAppLanguages = {
  strDisplayName:string,
  strShortName:string
}

type SteamGameClientData = {
  bytes_downloaded: string,
  bytes_total: string,
  client_name: string,
  clientid: string,
  cloud_status: number,
  display_status: number,
  is_available_on_current_platform: boolean,
  status_percentage: number
}


type SteamTab = {
	title: string,
	id: string,
	content: ReactElement,
	footer?: {
		onOptrionActionsDescription: string,
		onOptionsButtion: () => any,
		onSecondaryActionDescription: any, //Returns a reactElement
		onSecondaryButton: () => any
	},
	renderTabAddon: () => any //Returns a reactElement
}