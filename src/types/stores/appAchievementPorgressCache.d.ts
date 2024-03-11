// Types for the global appAchievementProgressCache

type AppAchievementProgressCache = {
  GetAchievementProgress: (appId: number) => number;
  m_achievementProgress: {
    mapCache: Map<number, any>
  }
}
