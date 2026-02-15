type AppId = number

type SteamTab = {
    title: string
    id: string
    content: React.ReactElement
    footer?: {
        onOptionsActionDescription?: string
        onOptionsButton?: () => any
        onSecondaryActionDescription?: any //Returns a reactElement
        onSecondaryButton?: () => any
        onMenuActionDescription?: string
        onMenuButton?: (e: any) => void
    }
    renderTabAddon: () => any //Returns a reactElement
}

interface TabAppGridComponentProps {
    collection: Collection
    eSortBy: number
    setSortBy: (e: any) => void
    showSortingContextMenu: (e: any) => void
}

type LocalizationManager = {
    AddTokens: unknown
    BLooksLikeToken: (token: string) => boolean
    GetELanguageFallbackOrder: unknown
    GetPreferredLocales: unknown
    GetTokensChangedCallbackList: unknown
    InitDirect: unknown
    InitFromObjects: unknown
    LocalizeIfToken: (token: string, suppressErrors?: boolean) => string | undefined
    LocalizeString: (token: string, suppressErrors?: boolean) => string | undefined
    LocalizeStringFromFallback: (token: string) => string | undefined
    SetPreferredLocales: unknown
}
