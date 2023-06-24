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

type FriendStore = {
  allFriendsList: FriendStoreEntry[],
  GetOwnedGames(userId): Set<any>
}