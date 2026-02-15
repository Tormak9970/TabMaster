// ? Global types related to filters.

type TagResponse = {
    tag: number
    string: string | undefined
}

type FriendEntry = {
    name: string
    steamid: number
}

type FilterErrorEntry = {
    filterIdx: number
    errors: string[]
    mergeErrorEntries?: FilterErrorEntry[]
}

type ValidationResponse = {
    passed: boolean
    errors: string[]
    mergeErrorEntries?: FilterErrorEntry[]
}

type LogicalMode = 'and' | 'or'

type SteamPlatform = 'steam' | 'nonSteam'
