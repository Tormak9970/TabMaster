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
    content: React.ReactElement<TabContentProps>,
    footer?: {
        onOptrionActionsDescription: string,
        onOptionsButtion: () => any,
        onSecondaryActionDescription: any, //Returns a reactElement
        onSecondaryButton: () => any
    },
    renderTabAddon: () => any //Returns a reactElement
}

type TabContentComponent = React.VoidFunctionComponent<TabContentProps>
interface TabContentProps {
    collection: Collection
    eSortBy: number
    setSortBy: (e: any) => void
    showSortingContextMenu: (e: any) => void
}