interface AchievementNotification {
    achievement: AppAchievements
    nCurrentProgress: number
    nMaxProgress: number
    unAppID: number
}

interface AppLifetimeNotification {
    bRunning: boolean
    nInstanceID: number
    /** This is not properly set by Steam for non-steam game shortcuts, so it defaults to 0 for them */
    unAppID: number
}

interface ScreenshotNotification {
    details: Screenshot
    hScreenshot: number
    strOperation: 'deleted' | 'written'
    unAppID: number
}

type GameSessions = {
    RegisterForAchievementNotification(
        callback: (achievementNotification: AchievementNotification) => void
    ): Unregisterer
    RegisterForAppLifetimeNotifications(
        callback: (appLifetimeNotification: AppLifetimeNotification) => void
    ): Unregisterer
    RegisterForScreenshotNotification(callback: (screenshotNotification: ScreenshotNotification) => void): Unregisterer
}
