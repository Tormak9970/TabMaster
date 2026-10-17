// Types for friendStore global

export type SteamFriend = {
    m_strAccountName?: string
    m_strPlayerName: string
    m_steamid: {
        m_ulSteamID: {
            high: number
            low: number
            unsigned: boolean
        }
    }
}

export type FriendStoreEntry = {
    m_persona: SteamFriend
    m_strNickname?: string
}

export type FriendOwnedGames = {
    setApps: Set<number>
}

export type OwnedGamesEntry = {
    value: {
        m_data: FriendOwnedGames
    }
}

export type OwnedGames = {
    Get: (userid: number) => void
    m_dataMap: {
        _data: Map<number, OwnedGamesEntry>
    }
}

export type PersonaCacheEntry = {
    value: FriendStoreEntry
}

export type PersonaCacheMap = {
    _data: Map<number, PersonaCacheEntry>
}

export type FriendStore = {
    allFriends: FriendStoreEntry[]
    m_ownedGames: OwnedGames
    FetchOwnedGames: (userid: number) => Promise<FriendOwnedGames | undefined>
    GetOwnedGames(userId: number): Set<any>
    m_mapPersonaCache: PersonaCacheMap
}
