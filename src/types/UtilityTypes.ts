import { TabSettingsDictionary } from './TabTypes'

export type DocPages = {
    [key: string]: string
}

export type FriendEntry = {
    name: string
    steamid: number
}

export type UsersDict = {
    [userId: string]: {
        tabs: TabSettingsDictionary
        friends: FriendEntry[]
        friendsGames: Map<number, number[]>
    }
}
