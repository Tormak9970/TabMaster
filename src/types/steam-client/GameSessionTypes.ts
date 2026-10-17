import { AppAchievements } from '@decky/ui/dist/globals/steam-client/App'
import { Screenshot } from '@decky/ui/dist/globals/steam-client/Screenshots'
import { Unregisterer } from './UtilityTypes'

export interface AchievementNotification {
    achievement: AppAchievements
    nCurrentProgress: number
    nMaxProgress: number
    unAppID: number
}

export interface AppLifetimeNotification {
    bRunning: boolean
    nInstanceID: number
    /** This is not properly set by Steam for non-steam game shortcuts, so it defaults to 0 for them */
    unAppID: number
}

export interface ScreenshotNotification {
    details: Screenshot
    hScreenshot: number
    strOperation: 'deleted' | 'written'
    unAppID: number
}

export type GameSessions = {
    RegisterForAchievementNotification(
        callback: (achievementNotification: AchievementNotification) => void
    ): Unregisterer
    RegisterForAppLifetimeNotifications(
        callback: (appLifetimeNotification: AppLifetimeNotification) => void
    ): Unregisterer
    RegisterForScreenshotNotification(callback: (screenshotNotification: ScreenshotNotification) => void): Unregisterer
}
