// Types for the global appAchievementProgressCache

type AppAchievementProgress = {
  all_unlocked: number,
  appid: number,
  cache_time: number,
  percentage: number,
  total: number,
  unlocked: number,
}

type AppAchievementProgressCache = {
  GetAchievementProgress: (appId: number) => number;
  m_achievementProgress: {
    mapCache: import("mobx").ObservableMap<number, AppAchievementProgress>
  }
}
