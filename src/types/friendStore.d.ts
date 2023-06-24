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

type PersonaCacheEntry = {
  value: FriendStoreEntry
}

type PersonaCacheMap = {
  _data: Map<number, PersonaCacheEntry>
}

type FriendStore = {
  allFriendsList: FriendStoreEntry[],
  GetOwnedGames(userId): Set<any>,
  m_mapPersonaCache: PersonaCacheMap
}