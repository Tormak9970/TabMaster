// Types for SteamClient.GameSession

type GameSession = {
  RegisterForAchievementNotification: (callback: (data: AchievementNotification) => void) => Unregisterer,
  RegisterForAppLifetimeNotifications: (callback: (data: LifetimeNotification) => void) => Unregisterer,
  RegisterForScreenshotNotification: (callback: (data: ScreenshotNotification) => void) => Unregisterer,
}

type AchievementNotification = {
  achievement: SteamAchievement,
  nCurrentProgress: number,
  nMaxProgress: number,
  unAppID: number
}

type LifetimeNotification = {
  unAppID: number;
  nInstanceID: number;
  bRunning: boolean;
}

type ScreenshotNotification = {
  details: Screenshot,
  hScreenshot: number,
  strOperation: string,
  unAppID: number,
}