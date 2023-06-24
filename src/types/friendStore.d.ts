// Types for friendStore global

type SteamFriend = {
  m_strAccountName?: string,
  m_strPlayerName: string,
  m_steamid: {
    m_ulSteamID: {
      high: number
      low: number
      unsigned: boolean
    }
  }
}

type FriendStoreEntry = {
  m_persona: SteamFriend,
  m_strNickname?: string
}

type FriendOwnedGames = {
  m_apps: Set<number>,
  m_nResponseCode: number
}

type OwnedGamesEntry = {
  value: {
    m_data: FriendOwnedGames
  }
}

type OwnedGames = {
  Get: (userid: number) => void,
  m_dataMap: {
    _data: Map<number, OwnedGamesEntry>
  }
}

type PersonaCacheEntry = {
  value: FriendStoreEntry
}

type PersonaCacheMap = {
  _data: Map<number, PersonaCacheEntry>
}

type FriendStore = {
  allFriends: FriendStoreEntry[],
  m_ownedGames: OwnedGames,
  FetchOwnedGames: (userid: number) => Promise<FriendOwnedGames>
  GetOwnedGames(userId): Set<any>,
  m_mapPersonaCache: PersonaCacheMap
}