// Types for the global appAchievementProgressCache

export type AppAchievementProgress = {
    all_unlocked: number
    appid: number
    cache_time: number
    percentage: number
    total: number
    unlocked: number
}

export type AppAchievementProgressCache = {
    GetAchievementProgress: (appId: number) => number
    m_achievementProgress: {
        mapCache: import('mobx').ObservableMap<number, AppAchievementProgress>
    }
}
