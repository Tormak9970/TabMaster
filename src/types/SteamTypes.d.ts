type AppId = number

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

type SteamTab = {
  title: string,
  id: string,
  content: React.ReactElement,
  footer?: {
    onOptionsActionDescription?: string,
    onOptionsButton?: () => any,
    onSecondaryActionDescription?: any, //Returns a reactElement
    onSecondaryButton?: () => any,
    onMenuActionDescription?: string,
    onMenuButton?: (e: any) => void
  },
  renderTabAddon: () => any //Returns a reactElement
}

interface TabAppGridComponentProps {
  collection: Collection
  eSortBy: number
  setSortBy: (e: any) => void
  showSortingContextMenu: (e: any) => void
}

type LocalizationManager = {
  AddTokens: unknown;
  BLooksLikeToken: (token: string) => boolean;
  GetELanguageFallbackOrder: unknown;
  GetPreferredLocales: unknown;
  GetTokensChangedCallbackList: unknown;
  InitDirect: unknown;
  InitFromObjects: unknown;
  LocalizeIfToken: (token: string, suppressErrors?: boolean) => string | undefined;
  LocalizeString: (token: string, suppressErrors?: boolean) => string | undefined;
  LocalizeStringFromFallback: (token: string) => string | undefined;
  SetPreferredLocales: unknown;
};
